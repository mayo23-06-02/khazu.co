# Supabase setup for Khazu

## 1. Apply schema (in order)

Registration (and most of the dashboard) writes to `profiles` with a fixed
set of columns — if **any** file below is skipped, `registerUser` fails with
a "Could not find the '...' column of 'profiles' in the schema cache" error
that gets surfaced as a database-setup error on the register form. If you're
seeing that repeatedly after already running `schema.sql`, the fix is almost
always "run the next migration in this list you haven't run yet" — the app
now tells you which column is missing in the error message; find it below
and run that file.

Run every one of these, in order, even if some feel optional — several
later files add columns that `registerUser`'s profile upsert always writes:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
2. Run [`schema.sql`](./schema.sql) — auth `profiles` + storage
3. Run [`personal_dashboard.sql`](./personal_dashboard.sql) — `listings`, events, daily stats, boosts
4. Run [`admin_moderation.sql`](./admin_moderation.sql) — adds `moderation_status`/`moderation_notes` to `listings`, `account_status` to `profiles`, a `fraud_flags` table, and an admin RLS bypass on `listings` (used by `/dashboard/admin`)
5. Confirm **Table Editor**: `profiles`, `listings`, `listing_events`, `listing_daily_stats`, `listing_boosts`, `fraud_flags`
6. Confirm bucket: **Storage** → `business-documents`
7. Run [`media_storage.sql`](./media_storage.sql) and confirm buckets **Storage** → `avatars`, `listing-images`
8. Run [`register_wizard_fields.sql`](./register_wizard_fields.sql) — adds `preferred_contact_method`, `website`, `years_in_operation` to `profiles`
9. Run [`register_contact_checks.sql`](./register_contact_checks.sql) — email/phone "already taken" check used by the register wizard
10. Run [`trial_and_reminders.sql`](./trial_and_reminders.sql) — adds `trial_ends_at`, `scheduled_plan_id`, `scheduled_charge_at`, `momo_msisdn` to `profiles`
11. Run [`subscriptions.sql`](./subscriptions.sql) — `subscriptions`, `sponsorships` tables + billing columns on `profiles`
12. Run [`enquiries.sql`](./enquiries.sql) — buyer enquiries (the "Enquire" button on a listing)
13. Run [`listing_engagement.sql`](./listing_engagement.sql) — listing comments + likes
14. Run [`listing_price_edit.sql`](./listing_price_edit.sql) — adds `previous_price` to `listings`
15. Run [`email_verifications.sql`](./email_verifications.sql) — adds `email_verified_at` to `profiles` + the EmailJS verification-code flow (`registerUser` always writes this column, even with `SKIP_EMAIL_VERIFICATION=true`)
16. Run [`fix_profiles_public_exposure.sql`](./fix_profiles_public_exposure.sql) — locks down `profiles` to owner-only reads and adds the `seller_public_profiles` view the marketplace/dealer-directory pages read from instead
17. Run [`fix_listing_events_insert_policy.sql`](./fix_listing_events_insert_policy.sql) — restricts which `listing_events` rows a signed-in visitor can write
18. Run [`rate_limits.sql`](./rate_limits.sql) — `check_rate_limit()` used by login/register/contact-check/listing-event throttling (`lib/security/rateLimit.ts`)

### Already applied old schema? Fix profiles RLS recursion

If deal/listing pages log:

```text
infinite recursion detected in policy for relation "profiles"
```

run [`fix_profiles_rls_recursion.sql`](./fix_profiles_rls_recursion.sql) once. It replaces the self-referential admin policy with `public.is_admin()` (`SECURITY DEFINER`).

### Listing editing + price-drop badge

`listing_price_edit.sql` (step 13 above) adds `previous_price` on `listings`. Sellers can edit their listings from `/dashboard/personal/listings/[id]/edit`; lowering the price sets `previous_price` so the public marketplace shows a "-X%" badge with the old price struck through (cleared again if the price goes back up).

### Media storage (avatars + listing images)

`media_storage.sql` (step 6 above) creates public `avatars` and `listing-images` buckets with owner-scoped write policies (`{user_id}/...`), replacing Cloudinary. Uploads go through `lib/supabase/media.ts` (used by `app/api/upload/route.ts` for listing photos and `lib/auth/actions.ts` for avatars during registration) — both validate the actual file bytes/size server-side, not just the client-declared content-type.

### Subscriptions & MoMo (billing)

`subscriptions.sql` (step 10 above) creates:

- `subscriptions` — plans (trial / individual / dealer)
- `sponsorships` — banner + listing boost add-ons
- Profile columns: `subscription_plan_id`, `subscription_ends_at`, `listing_limit`
- RLS: users read/write own rows; admins via `is_admin()`

UI: `components/subscription/subscription-plans.tsx` + right-side `CheckoutDrawer`  
Quick pay: `lib/subscriptions/quick-checkout.ts` (initiate → approve → validate in one tap)  
MoMo sim: `lib/subscriptions/momo.ts`  
Listing gate: `lib/subscriptions/entitlement.ts` — 1 free trial listing, then paid plan required before `/sell/upload` publish  
Sell UI: `components/sell/ListingPaymentGate.tsx`  
Subscription hub: `SubscriptionBillingStatus` on dealer/personal subscription pages

### Optional seed (demo data on personal dashboard)

```bash
# install once if needed: npm i -D tsx dotenv
npx tsx scripts/seedPersonalDashboard.ts
# with: SEED_USER_EMAIL=you@example.com
# or:   SEED_USER_ID=<uuid from Authentication → Users>
```

## 2. Auth settings

In **Authentication → Providers → Email**:

- Enable Email provider
- For local/dev testing you can disable **Confirm email** so `signUp` returns a session immediately
- For production, keep email confirmation on (users land on `/auth/login?registered=1` after signup)

## 3. Environment variables

Set these in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server only — never expose to the browser

# Email verification (registerUser always tries to send a code unless bypassed)
EMAILJS_SERVICE_ID=...
EMAILJS_TEMPLATE_ID=...
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...
# Dev-only: skip sending/checking the code entirely so signup/login can be
# tested repeatedly without spending EmailJS sends. Must be exactly "true";
# never bypassed implicitly, so a misconfigured prod build can't disable it.
SKIP_EMAIL_VERIFICATION=true
```

Registration fails outright if `email_verifications.sql` (step 14 above) hasn't been run — that has nothing to do with EmailJS being configured, `email_verified_at` is written to `profiles` either way. EmailJS credentials are only needed when `SKIP_EMAIL_VERIFICATION` isn't `"true"`.

## 4. Smoke test

```bash
npm run dev
```

1. Visit `/auth/register`
2. Complete the wizard as **Individual**
3. You should land on `/dashboard/personal`
4. Log out → `/auth/login` → sign in again
5. Repeat as **Dealership** with registered business + document upload
