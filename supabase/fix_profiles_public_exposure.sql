-- =============================================================================
-- Fix: profiles_select_public_sellers granted `select *` on public.profiles
-- to anon + authenticated with `using (true)` — a full PII leak (phone,
-- address, business_registration_number, business_documents storage paths,
-- momo_msisdn, trial/subscription internals) for every user, readable via
-- a plain PostgREST request with only the public anon key.
--
-- Fix: drop that blanket policy (authenticated users keep full access to
-- their own row via profiles_select_own; admins keep profiles_admin_all).
-- Public marketplace/dealer-directory code needs a few non-sensitive
-- columns for ANY seller, so those are exposed through a narrow view
-- instead of the base table. The view runs with the privileges of its
-- owner (the role that runs this migration, normally `postgres` in the
-- Supabase SQL Editor, which owns `profiles` and so bypasses its RLS) —
-- run this migration as that role.
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

drop policy if exists "profiles_select_public_sellers" on public.profiles;

drop view if exists public.seller_public_profiles;
create view public.seller_public_profiles as
select
  id,
  full_name,
  phone,
  city,
  address,
  business_name,
  is_dealer,
  avatar_url,
  role,
  bio,
  website,
  years_in_operation,
  is_registered_business
from public.profiles;

grant select on public.seller_public_profiles to anon, authenticated;

notify pgrst, 'reload schema';
