-- =============================================================================
-- Khazu — Personal dashboard schema (listings, events, stats, boosts)
-- Run AFTER schema.sql (profiles must exist)
-- Project SQL: https://supabase.com/dashboard/project/cfmkbytybjpwypsmldkw/sql/new
-- =============================================================================

-- Enums (idempotent)
do $$ begin
  create type public.listing_status as enum ('draft', 'active', 'sold', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.seller_type as enum ('individual', 'dealer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_event_type as enum (
    'view', 'like', 'comment', 'contact',
    'boost_started', 'boost_ended', 'status_change'
  );
exception when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- listings
-- -----------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  seller_type public.seller_type not null default 'individual',

  reg_number text,
  make text not null,
  model text not null,
  year int not null check (year >= 1950 and year <= 2100),
  mileage int not null default 0,
  body_type text,
  fuel_type text,
  transmission text,
  drive_type text,
  engine_size text,
  power_kw numeric,
  torque_nm numeric,
  doors int,
  seats int,
  colour text,
  condition text,
  features text[] default '{}',
  description text,

  price numeric(12, 2) not null check (price >= 0),
  negotiable boolean not null default true,
  accepts_installments boolean not null default false,
  deposit_amount numeric(12, 2),
  installment_months int,

  images text[] default '{}',

  status public.listing_status not null default 'active',
  is_featured boolean not null default false,
  is_verified boolean not null default false,
  views_count int not null default 0,
  contacts_count int not null default 0,
  likes_count int not null default 0,
  comments_count int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_seller_id_idx on public.listings (seller_id);
create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_seller_status_idx on public.listings (seller_id, status);

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- listing_events
-- -----------------------------------------------------------------------------
create table if not exists public.listing_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type public.listing_event_type not null,
  message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists listing_events_seller_created_idx
  on public.listing_events (seller_id, created_at desc);
create index if not exists listing_events_listing_type_created_idx
  on public.listing_events (listing_id, event_type, created_at desc);

-- -----------------------------------------------------------------------------
-- listing_daily_stats
-- -----------------------------------------------------------------------------
create table if not exists public.listing_daily_stats (
  listing_id uuid not null references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  views int not null default 0,
  likes int not null default 0,
  comments int not null default 0,
  contacts int not null default 0,
  primary key (listing_id, day)
);

create index if not exists listing_daily_stats_seller_day_idx
  on public.listing_daily_stats (seller_id, day);

-- -----------------------------------------------------------------------------
-- listing_boosts
-- -----------------------------------------------------------------------------
create table if not exists public.listing_boosts (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  amount_szl numeric(10, 2) not null default 25,
  starts_at date not null,
  ends_at date not null,
  status text not null default 'active'
    check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at >= starts_at)
);

create index if not exists listing_boosts_seller_idx on public.listing_boosts (seller_id);
create index if not exists listing_boosts_range_idx on public.listing_boosts (starts_at, ends_at);

-- -----------------------------------------------------------------------------
-- Trigger: event → counters + daily stats
-- -----------------------------------------------------------------------------
create or replace function public.handle_listing_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  col_counter text;
  col_daily text;
begin
  case new.event_type
    when 'view' then
      col_counter := 'views_count';
      col_daily := 'views';
    when 'like' then
      col_counter := 'likes_count';
      col_daily := 'likes';
    when 'comment' then
      col_counter := 'comments_count';
      col_daily := 'comments';
    when 'contact' then
      col_counter := 'contacts_count';
      col_daily := 'contacts';
    else
      return new;
  end case;

  execute format(
    'update public.listings set %I = %I + 1, updated_at = now() where id = $1',
    col_counter, col_counter
  ) using new.listing_id;

  insert into public.listing_daily_stats as s (
    listing_id, seller_id, day, views, likes, comments, contacts
  )
  values (
    new.listing_id,
    new.seller_id,
    (new.created_at at time zone 'utc')::date,
    case when col_daily = 'views' then 1 else 0 end,
    case when col_daily = 'likes' then 1 else 0 end,
    case when col_daily = 'comments' then 1 else 0 end,
    case when col_daily = 'contacts' then 1 else 0 end
  )
  on conflict (listing_id, day) do update set
    views = s.views + excluded.views,
    likes = s.likes + excluded.likes,
    comments = s.comments + excluded.comments,
    contacts = s.contacts + excluded.contacts;

  return new;
end;
$$;

drop trigger if exists listing_events_after_insert on public.listing_events;
create trigger listing_events_after_insert
  after insert on public.listing_events
  for each row execute function public.handle_listing_event();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.listings enable row level security;
alter table public.listing_events enable row level security;
alter table public.listing_daily_stats enable row level security;
alter table public.listing_boosts enable row level security;

-- listings
drop policy if exists "listings_select_own" on public.listings;
create policy "listings_select_own"
  on public.listings for select to authenticated
  using (seller_id = auth.uid());

drop policy if exists "listings_select_public_active" on public.listings;
create policy "listings_select_public_active"
  on public.listings for select to anon, authenticated
  using (status = 'active');

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
  on public.listings for insert to authenticated
  with check (seller_id = auth.uid());

drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own"
  on public.listings for update to authenticated
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

drop policy if exists "listings_delete_own" on public.listings;
create policy "listings_delete_own"
  on public.listings for delete to authenticated
  using (seller_id = auth.uid());

-- events
drop policy if exists "listing_events_select_own" on public.listing_events;
create policy "listing_events_select_own"
  on public.listing_events for select to authenticated
  using (seller_id = auth.uid());

drop policy if exists "listing_events_insert_authenticated" on public.listing_events;
create policy "listing_events_insert_authenticated"
  on public.listing_events for insert to authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.status = 'active'
        and (
          -- seller can log system events on own listing
          l.seller_id = auth.uid()
          -- or any auth user can log engagement on others' active listings
          or l.seller_id is distinct from auth.uid()
        )
    )
  );

-- daily stats
drop policy if exists "listing_daily_stats_select_own" on public.listing_daily_stats;
create policy "listing_daily_stats_select_own"
  on public.listing_daily_stats for select to authenticated
  using (seller_id = auth.uid());

-- boosts
drop policy if exists "listing_boosts_select_own" on public.listing_boosts;
create policy "listing_boosts_select_own"
  on public.listing_boosts for select to authenticated
  using (seller_id = auth.uid());

drop policy if exists "listing_boosts_insert_own" on public.listing_boosts;
create policy "listing_boosts_insert_own"
  on public.listing_boosts for insert to authenticated
  with check (seller_id = auth.uid());

drop policy if exists "listing_boosts_update_own" on public.listing_boosts;
create policy "listing_boosts_update_own"
  on public.listing_boosts for update to authenticated
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

-- Grants
grant select, insert, update, delete on table public.listings to authenticated, service_role;
grant select on table public.listings to anon;
grant select, insert on table public.listing_events to authenticated, service_role;
grant select on table public.listing_daily_stats to authenticated, service_role;
grant select, insert, update, delete on table public.listing_boosts to authenticated, service_role;

notify pgrst, 'reload schema';
