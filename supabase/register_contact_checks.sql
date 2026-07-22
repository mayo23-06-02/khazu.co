-- =============================================================================
-- Khazu — registration contact availability checks
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Lets the register wizard tell a user their email/phone is already taken
-- before they fill out the whole form, without exposing raw contact data
-- (only a boolean crosses the API).
-- =============================================================================

-- auth.users isn't exposed to PostgREST, so this security-definer function
-- is the only way the API can check email uniqueness pre-signup.
create or replace function public.email_registered(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where lower(email) = lower(check_email)
  );
$$;

revoke all on function public.email_registered(text) from public;
grant execute on function public.email_registered(text) to anon, authenticated, service_role;

create or replace function public.phone_registered(check_phone text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where phone = check_phone and phone <> ''
  );
$$;

revoke all on function public.phone_registered(text) from public;
grant execute on function public.phone_registered(text) to anon, authenticated, service_role;

notify pgrst, 'reload schema';
