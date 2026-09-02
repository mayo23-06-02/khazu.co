/**
 * One-off migration: re-host any listing images still pointing at Cloudinary
 * (from before the switch to Supabase Storage — see supabase/README.md) into
 * the `listing-images` bucket, and rewrite `listings.images` to match.
 *
 * Run locally, with your own SUPABASE_SERVICE_ROLE_KEY in .env.local:
 *
 *   npx tsx scripts/migrateCloudinaryImages.ts
 *
 * Add --dry-run to only report which listings/images would change.
 *
 * Once this has run cleanly (0 Cloudinary URLs left), remove the
 * res.cloudinary.com entry from next.config.ts's images.remotePatterns —
 * it was only added as a stopgap so those listings didn't render broken
 * images while this migration was pending.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.argv.includes("--dry-run");

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKET = "listing-images";
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

async function migrateOne(
  cloudinaryUrl: string,
  sellerId: string,
): Promise<string | null> {
  const res = await fetch(cloudinaryUrl);
  if (!res.ok) {
    console.warn(`    fetch failed (${res.status}): ${cloudinaryUrl}`);
    return null;
  }

  let contentType = res.headers.get("content-type") || "image/jpeg";
  // Cloudinary sometimes reports a generic type for .jpg URLs — normalize.
  if (!ALLOWED_MIME.has(contentType)) {
    contentType = "image/jpeg";
  }
  if (!ALLOWED_MIME.has(contentType)) {
    console.warn(`    unsupported content-type (${contentType}): ${cloudinaryUrl}`);
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const originalName = cloudinaryUrl.split("/").pop() || "image.jpg";
  const path = `${sellerId}/${Date.now()}-${sanitizeFileName(originalName)}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.warn(`    upload failed: ${error.message}`);
    return null;
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

async function main() {
  const { data: listings, error } = await admin
    .from("listings")
    .select("id, seller_id, images")
    .not("images", "is", null);

  if (error) {
    console.error("Failed to load listings:", error.message);
    process.exit(1);
  }

  const affected = (listings ?? []).filter((l) =>
    (l.images as string[] | null)?.some((img) => img.includes("res.cloudinary.com")),
  );

  if (affected.length === 0) {
    console.log("No Cloudinary URLs found — nothing to migrate.");
    return;
  }

  console.log(`Found ${affected.length} listing(s) with Cloudinary images.\n`);

  for (const listing of affected) {
    console.log(`Listing ${listing.id}`);
    const images = listing.images as string[];
    const newImages: string[] = [];
    let changed = false;

    for (const img of images) {
      if (!img.includes("res.cloudinary.com")) {
        newImages.push(img);
        continue;
      }

      console.log(`  migrating: ${img}`);
      if (dryRun) {
        newImages.push(img);
        continue;
      }

      const migrated = await migrateOne(img, listing.seller_id as string);
      if (migrated) {
        console.log(`    -> ${migrated}`);
        newImages.push(migrated);
        changed = true;
      } else {
        // Keep the original URL rather than drop the image silently.
        newImages.push(img);
      }
    }

    if (changed && !dryRun) {
      const { error: updateError } = await admin
        .from("listings")
        .update({ images: newImages })
        .eq("id", listing.id);

      if (updateError) {
        console.warn(`  ✗ failed to update listing: ${updateError.message}`);
      } else {
        console.log("  ✓ updated");
      }
    }
    console.log("");
  }

  if (dryRun) {
    console.log("Dry run only — no changes written. Re-run without --dry-run to migrate.");
  }
}

main();
