-- =============================================================================
-- Fix: infinite recursion in profiles RLS (profiles_admin_all)
-- Run in Supabase SQL Editor if you see:
--   "infinite recursion detected in policy for relation \"profiles\""
-- Project: https://supabase.com/dashboard/project/cfmkbytybjpwypsmldkw/sql/new
-- =============================================================================

-- Security-definer helper: reads profiles without re-entering RLS
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

-- Replace recursive admin policy
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Storage policies that subquery profiles the same way (if present)
drop policy if exists "biz_docs_admin_select" on storage.objects;
create policy "biz_docs_admin_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'business-documents'
    and public.is_admin()
  );

notify pgrst, 'reload schema';
