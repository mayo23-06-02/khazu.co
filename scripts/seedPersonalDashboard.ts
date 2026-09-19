/**
 * Seed sample listings + engagement for the currently configured Supabase project.
 *
 * Usage (PowerShell):
 *   $env:SEED_USER_ID="<auth user uuid>"; npx tsx scripts/seedPersonalDashboard.ts
 *
 * Or set SEED_USER_EMAIL and ensure SUPABASE_SERVICE_ROLE_KEY is in env.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * And tables from supabase/personal_dashboard.sql
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (process.env.ALLOW_SEED !== "true") {
  console.error(
    "Refusing to run: this writes fake listings/engagement into whichever Supabase project your .env.local points at.\n" +
      "If that's really what you want (a dev/staging project), re-run with ALLOW_SEED=true.",
  );
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function resolveUserId(): Promise<string> {
  if (process.env.SEED_USER_ID) return process.env.SEED_USER_ID;

  const email = process.env.SEED_USER_EMAIL;
  if (!email) {
    console.error("Set SEED_USER_ID or SEED_USER_EMAIL");
    process.exit(1);
  }

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  const user = data.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }
  return user.id;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const userId = await resolveUserId();
  console.log("Seeding for user", userId);

  // Ensure profile exists
  await admin.from("profiles").upsert(
    {
      id: userId,
      full_name: "Demo Seller",
      role: "individual",
      is_dealer: false,
      city: "Mbabane",
    },
    { onConflict: "id" },
  );

  const samples = [
    {
      make: "Volkswagen",
      model: "Golf GTI",
      year: 2018,
      price: 185000,
      mileage: 78000,
      reg_number: "HSD 123 AM",
      body_type: "hatchback",
      fuel_type: "petrol",
      transmission: "manual",
    },
    {
      make: "Toyota",
      model: "Hilux",
      year: 2020,
      price: 420000,
      mileage: 45000,
      reg_number: "JSD 456 BM",
      body_type: "pick-up",
      fuel_type: "diesel",
      transmission: "automatic",
    },
    {
      make: "BMW",
      model: "320i",
      year: 2017,
      price: 265000,
      mileage: 92000,
      reg_number: "GSD 789 CM",
      body_type: "sedan",
      fuel_type: "petrol",
      transmission: "automatic",
    },
  ];

  const listingIds: string[] = [];

  for (const s of samples) {
    const { data, error } = await admin
      .from("listings")
      .insert({
        seller_id: userId,
        seller_type: "individual",
        ...s,
        condition: "good",
        negotiable: true,
        images: [],
        status: "active",
        description: `Well maintained ${s.year} ${s.make} ${s.model}.`,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert listing failed:", error.message);
      continue;
    }
    listingIds.push(data.id);
    console.log("Listing", data.id, s.make, s.model);
  }

  // Events over last 14 days
  for (const listingId of listingIds) {
    for (let d = 13; d >= 0; d--) {
      const views = 5 + ((d * 3 + listingId.charCodeAt(0)) % 20);
      for (let i = 0; i < views; i++) {
        await admin.from("listing_events").insert({
          listing_id: listingId,
          seller_id: userId,
          event_type: "view",
          created_at: new Date(
            Date.now() - d * 86400000 - i * 60000,
          ).toISOString(),
        });
      }
      if (d % 3 === 0) {
        await admin.from("listing_events").insert({
          listing_id: listingId,
          seller_id: userId,
          event_type: "like",
          created_at: new Date(Date.now() - d * 86400000).toISOString(),
        });
      }
      if (d % 5 === 0) {
        await admin.from("listing_events").insert({
          listing_id: listingId,
          seller_id: userId,
          event_type: "comment",
          message: "Is the price negotiable?",
          created_at: new Date(Date.now() - d * 86400000).toISOString(),
        });
      }
      if (d % 7 === 0) {
        await admin.from("listing_events").insert({
          listing_id: listingId,
          seller_id: userId,
          event_type: "contact",
          message: "WhatsApp inquiry",
          created_at: new Date(Date.now() - d * 86400000).toISOString(),
        });
      }
    }
  }

  // Boost on first listing
  if (listingIds[0]) {
    await admin.from("listing_boosts").insert({
      listing_id: listingIds[0],
      seller_id: userId,
      amount_szl: 25,
      starts_at: daysAgo(5),
      ends_at: daysAgo(-9), // 9 days from now
      status: "active",
    });
    await admin
      .from("listings")
      .update({ is_featured: true })
      .eq("id", listingIds[0]);
    await admin.from("listing_events").insert({
      listing_id: listingIds[0],
      seller_id: userId,
      event_type: "boost_started",
      message: "SZL 25 for 14-day boost",
    });
  }

  console.log("Done. Open /dashboard/personal");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
