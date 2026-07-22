-- =============================================================================
-- Khazu — Supabase schema (profiles + storage + RLS)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Project: https://supabase.com/dashboard/project/cfmkbytybjpwypsmldkw/sql/new
-- =============================================================================

-- Roles (idempotent)
do $$ begin
  create type public.user_role as enum ('individual', 'dealer', 'admin');
exception
  when duplicate_object then null;
end $$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'individual',
  is_dealer boolean not null default false,
  business_name text,
  is_registered_business boolean not null default false,
  business_registration_number text,
  business_documents text[] default '{}',
  address text,
  city text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_city_idx on public.profiles (city);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text := coalesce(new.raw_user_meta_data ->> 'role', 'individual');
  resolved_role public.user_role := 'individual';
begin
  begin
    resolved_role := meta_role::public.user_role;
  exception
    when others then
      resolved_role := 'individual';
  end;

  insert into public.profiles (id, full_name, phone, role, is_dealer)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    resolved_role,
    resolved_role = 'dealer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_select_public_sellers" on public.profiles;
create policy "profiles_select_public_sellers"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role is distinct from 'admin'::public.user_role
  );

-- Admin check without recursive RLS (subquery on profiles would recurse)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Expose table to PostgREST (schema cache)
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.profiles to anon, authenticated, service_role;

-- Notify PostgREST to reload schema cache
notify pgrst, 'reload schema';

-- -----------------------------------------------------------------------------
-- Storage: business-documents bucket
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-documents',
  'business-documents',
  false,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "biz_docs_insert_own" on storage.objects;
create policy "biz_docs_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'business-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "biz_docs_select_own" on storage.objects;
create policy "biz_docs_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'business-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "biz_docs_update_own" on storage.objects;
create policy "biz_docs_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'business-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "biz_docs_delete_own" on storage.objects;
create policy "biz_docs_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'business-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "biz_docs_admin_select" on storage.objects;
create policy "biz_docs_admin_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'business-documents'
    and public.is_admin()
  );
