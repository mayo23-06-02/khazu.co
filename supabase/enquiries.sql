-- =============================================================================
-- Khazu — buyer enquiries (Enquire button on a listing)
-- Run AFTER schema.sql and personal_dashboard.sql (profiles + listings must exist)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_seller_created_idx
  on public.enquiries (seller_id, created_at desc);
create index if not exists enquiries_listing_idx on public.enquiries (listing_id);

alter table public.enquiries enable row level security;

-- Sellers see enquiries left on their own listings
drop policy if exists "enquiries_select_own" on public.enquiries;
create policy "enquiries_select_own"
  on public.enquiries for select to authenticated
  using (seller_id = auth.uid());

-- Anyone (including anonymous buyers) can enquire about a live listing —
-- the check keeps seller_id honest and blocks enquiries on inactive listings.
drop policy if exists "enquiries_insert_public" on public.enquiries;
create policy "enquiries_insert_public"
  on public.enquiries for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = enquiries.listing_id
        and l.seller_id = enquiries.seller_id
        and l.status = 'active'
    )
  );

grant select on table public.enquiries to authenticated, service_role;
grant insert on table public.enquiries to anon, authenticated, service_role;

notify pgrst, 'reload schema';
