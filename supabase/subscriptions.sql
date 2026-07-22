-- =============================================================================
-- Khazu — Subscriptions & sponsorships (MTN MoMo)
-- Run AFTER schema.sql (profiles must exist)
-- =============================================================================

do $$ begin
  create type public.subscription_role as enum ('individual', 'dealer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_status as enum (
    'pending', 'active', 'trialing', 'expired', 'cancelled', 'failed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_provider as enum ('mtn_momo', 'manual', 'promo');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.sponsorship_type as enum (
    'banner_home_listings',
    'listing_boost_7',
    'listing_boost_14'
  );
exception when duplicate_object then null;
end $$;

-- Active / historical subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.subscription_role not null,
  plan_id text not null,
  plan_name text not null,
  price_szl numeric(12, 2) not null default 0,
  currency text not null default 'SZL',
  billing_period_days int not null default 30,
  listing_limit int not null default 1,
  included_sponsorships int not null default 0,
  status public.subscription_status not null default 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  momo_msisdn text,
  payment_provider public.payment_provider not null default 'mtn_momo',
  payment_reference text,
  payment_metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
create index if not exists subscriptions_user_active_idx
  on public.subscriptions (user_id, status)
  where status in ('active', 'trialing');

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Sponsorship / advertising purchases
create table if not exists public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  listing_id uuid references public.listings (id) on delete set null,
  sponsorship_type public.sponsorship_type not null,
  label text not null,
  price_szl numeric(12, 2) not null default 0,
  duration_days int not null,
  status public.subscription_status not null default 'pending',
  starts_at timestamptz,
  ends_at timestamptz,
  momo_msisdn text,
  payment_reference text,
  payment_metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sponsorships_user_id_idx on public.sponsorships (user_id);
create index if not exists sponsorships_status_idx on public.sponsorships (status);

drop trigger if exists sponsorships_set_updated_at on public.sponsorships;
create trigger sponsorships_set_updated_at
  before update on public.sponsorships
  for each row execute function public.set_updated_at();

-- Optional: mirror plan limits onto profile for quick checks
alter table public.profiles
  add column if not exists subscription_plan_id text,
  add column if not exists subscription_ends_at timestamptz,
  add column if not exists listing_limit int default 1;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.subscriptions enable row level security;
alter table public.sponsorships enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own"
  on public.subscriptions for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own"
  on public.subscriptions for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "sponsorships_select_own" on public.sponsorships;
create policy "sponsorships_select_own"
  on public.sponsorships for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "sponsorships_insert_own" on public.sponsorships;
create policy "sponsorships_insert_own"
  on public.sponsorships for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "sponsorships_update_own" on public.sponsorships;
create policy "sponsorships_update_own"
  on public.sponsorships for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

grant select, insert, update on table public.subscriptions to authenticated, service_role;
grant select, insert, update on table public.sponsorships to authenticated, service_role;

notify pgrst, 'reload schema';
