import { createAdminClient } from "./admin";
import { validateFile } from "@/lib/security/fileValidation";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

// Mirrors the bucket configs in supabase/media_storage.sql — kept as an
// independent app-side check rather than trusting the client's declared
// content-type or relying solely on the bucket config as the only backstop.
const BUCKET_LIMITS: Record<string, number> = {
  avatars: 5 * 1024 * 1024,
  "listing-images": 10 * 1024 * 1024,
};

/**
 * Uploads a file to a public Supabase Storage bucket, folder-scoped to the
 * owner (`{folder}/...`) to match the storage RLS policies in
 * supabase/media_storage.sql. Uses the service-role client since callers
 * (registration, before email confirmation) may not have a session yet.
 */
export async function uploadMedia(
  file: Buffer,
  bucket: string,
  folder: string,
  fileName: string,
  contentType: string,
): Promise<{ url: string; path: string }> {
  const validation = validateFile(
    file,
    ["jpeg", "png", "webp"],
    BUCKET_LIMITS[bucket] ?? 10 * 1024 * 1024,
  );
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const path = `${folder}/${Date.now()}-${sanitizeFileName(fileName)}`;
  const admin = createAdminClient();

  const { error } = await admin.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl, path };
}
