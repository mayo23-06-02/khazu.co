-- =============================================================================
-- Khazu — Admin moderation schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Run AFTER schema.sql and personal_dashboard.sql.
-- Adds the moderation workflow the admin dashboard needs: per-listing
-- moderation_status, per-profile account_status, a fraud_flags table, and
-- an admin bypass on listings (profiles/subscriptions/sponsorships already
-- have one via public.is_admin(), listings did not).
-- =============================================================================

do $$ begin
  create type public.moderation_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.account_status as enum ('active', 'suspended');
exception
  when duplicate_object then null;
end $$;

-- Defaults to 'approved': the marketplace already has live listings with no
-- moderation concept. Defaulting to 'pending' would hide every existing and
-- new listing from public view the instant this migration runs. Flip the
-- default to 'pending' (and backfill existing rows to 'approved' first) if a
-- real day-one moderation gate is wanted instead.
alter table public.listings
  add column if not exists moderation_status public.moderation_status not null default 'approved';

alter table public.listings
  add column if not exists moderation_notes text;

create index if not exists listings_moderation_status_idx
  on public.listings (moderation_status);

alter table public.profiles
  add column if not exists account_status public.account_status not null default 'active';

create index if not exists profiles_account_status_idx
  on public.profiles (account_status);

-- Admin bypass on listings — reuses the existing public.is_admin() function
-- (schema.sql / fix_profiles_rls_recursion.sql), does not redefine it.
drop policy if exists "listings_admin_all" on public.listings;
create policy "listings_admin_all"
  on public.listings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Fraud flags: lightweight, admin-reviewable signals against listings/users.
create table if not exists public.fraud_flags (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  pattern text not null,
  risk_score int not null default 0 check (risk_score >= 0 and risk_score <= 100),
  status text not null default 'open' check (status in ('open', 'dismissed', 'actioned')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists fraud_flags_status_idx on public.fraud_flags (status);
create index if not exists fraud_flags_listing_id_idx on public.fraud_flags (listing_id);
create index if not exists fraud_flags_user_id_idx on public.fraud_flags (user_id);

alter table public.fraud_flags enable row level security;

drop policy if exists "fraud_flags_admin_all" on public.fraud_flags;
create policy "fraud_flags_admin_all"
  on public.fraud_flags for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.fraud_flags to authenticated, service_role;

notify pgrst, 'reload schema';
