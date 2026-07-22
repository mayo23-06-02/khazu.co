# Supabase setup for Khazu

## 1. Apply schema (in order)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
2. Run [`schema.sql`](./schema.sql) — auth `profiles` + storage
3. Run [`personal_dashboard.sql`](./personal_dashboard.sql) — `listings`, events, daily stats, boosts
4. Confirm **Table Editor**: `profiles`, `listings`, `listing_events`, `listing_daily_stats`, `listing_boosts`
5. Confirm bucket: **Storage** → `business-documents`
6. Run [`media_storage.sql`](./media_storage.sql) and confirm buckets **Storage** → `avatars`, `listing-images`

### Already applied old schema? Fix profiles RLS recursion

If deal/listing pages log:

```text
infinite recursion detected in policy for relation "profiles"
```

run [`fix_profiles_rls_recursion.sql`](./fix_profiles_rls_recursion.sql) once. It replaces the self-referential admin policy with `public.is_admin()` (`SECURITY DEFINER`).

### Registration wizard fields

Run [`register_wizard_fields.sql`](./register_wizard_fields.sql) for `preferred_contact_method`, `website`, `years_in_operation` on profiles (used by the account-specific step of `/auth/register`).

### Listing editing + price-drop badge

Run [`listing_price_edit.sql`](./listing_price_edit.sql) for `previous_price` on `listings`. Sellers can edit their listings from `/dashboard/personal/listings/[id]/edit`; lowering the price sets `previous_price` so the public marketplace shows a "-X%" badge with the old price struck through (cleared again if the price goes back up).

### Trial + reminders

Run [`trial_and_reminders.sql`](./trial_and_reminders.sql) for `trial_ends_at`, `scheduled_plan_id`, `scheduled_charge_at` on profiles.

### Media storage (avatars + listing images)

Run [`media_storage.sql`](./media_storage.sql) — creates public `avatars` and `listing-images` buckets with owner-scoped write policies (`{user_id}/...`), replacing Cloudinary. Uploads go through `lib/supabase/media.ts` (used by `app/api/upload/route.ts` for listing photos and `lib/auth/actions.ts` for avatars during registration).

### Subscriptions & MoMo (billing)

Run [`subscriptions.sql`](./subscriptions.sql) after profiles exist:

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

Copy from `.env.example` into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server only — never expose to the browser
```

## 4. Smoke test

```bash
npm run dev
```

1. Visit `/auth/register`
2. Complete the wizard as **Individual**
3. You should land on `/dashboard/personal`
4. Log out → `/auth/login` → sign in again
5. Repeat as **Dealership** with registered business + document upload
