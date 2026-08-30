/**
 * Create dealer accounts directly via the Supabase Admin API.
 *
 * Bypasses `supabase.auth.signUp` entirely (email_confirm: true), so this
 * does NOT send a confirmation email and is not subject to Supabase's
 * built-in email rate limit — the one hit while testing /auth/register.
 *
 * Run locally, with your OWN SUPABASE_SERVICE_ROLE_KEY in .env.local:
 *
 *   npx tsx scripts/seedDealerAccounts.ts
 *
 * Generated passwords print ONLY to this terminal — nowhere else. Edit the
 * DEALERS array below with real details before running, then treat the
 * printed output like any other credential and hand it off securely (not
 * pasted into chat, Slack, etc).
 */

import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Edit before running — these become the two dealer profiles.
const DEALERS = [
  {
    email: "dealer1@example.com",
    fullName: "Dealer One",
    phone: "76000001",
    businessName: "Dealer One Motors",
    city: "Mbabane",
  },
  {
    email: "dealer2@example.com",
    fullName: "Dealer Two",
    phone: "76000002",
    businessName: "Dealer Two Motors",
    city: "Manzini",
  },
];

function generatePassword(): string {
  // 18 random bytes -> 24 base64url chars: well above the app's 6-char
  // minimum, with no ambiguous-looking characters to transcribe.
  return randomBytes(18).toString("base64url");
}

async function createDealer(dealer: (typeof DEALERS)[number]) {
  const password = generatePassword();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: dealer.email,
    password,
    email_confirm: true, // skips the confirmation email + its rate limit
    user_metadata: {
      full_name: dealer.fullName,
      phone: dealer.phone,
      role: "dealer",
    },
  });

  if (createError) {
    console.error(`✗ ${dealer.email}: ${createError.message}`);
    return;
  }

  const userId = created.user.id;

  // Mirrors the profile fields registerUser() sets in lib/auth/actions.ts —
  // the handle_new_user trigger only covers full_name/phone/role/is_dealer.
  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: userId,
      full_name: dealer.fullName,
      phone: dealer.phone,
      role: "dealer",
      is_dealer: true,
      business_name: dealer.businessName,
      city: dealer.city,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    console.error(`✗ ${dealer.email}: profile upsert failed — ${profileError.message}`);
    return;
  }

  // Mirrors ensureUserTrial() in lib/subscriptions/trial.ts (kept inline so
  // this script has no dependency on the Next.js app's module graph).
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);
  await admin
    .from("profiles")
    .update({
      trial_started_at: new Date().toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
    })
    .eq("id", userId);

  console.log(`✓ ${dealer.businessName}`);
  console.log(`  email:    ${dealer.email}`);
  console.log(`  password: ${password}`);
  console.log("");
}

async function main() {
  for (const dealer of DEALERS) {
    await createDealer(dealer);
  }
}

main();
