-- =============================================================================
-- Rate limiting primitive, shared by login/registration/contact-check and
-- public listing-event recording — all currently have no throttling, which
-- makes brute-force, email/phone enumeration, and engagement-stat spoofing
-- cheap to automate.
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

create table if not exists public.rate_limit_hits (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_key_created_idx
  on public.rate_limit_hits (key, created_at desc);

-- Best-effort cleanup so the table doesn't grow unbounded; callers only ever
-- look back a few hours at most, so a day of retention is generous.
create or replace function public.prune_rate_limit_hits()
returns void
language sql
as $$
  delete from public.rate_limit_hits where created_at < now() - interval '1 day';
$$;

-- Atomically checks + records a hit for `p_key`, returning true if the
-- caller is still under `p_max` hits within the trailing `p_window_seconds`.
-- security definer so anon/authenticated callers (who have no direct table
-- access) can only interact with this table through the rate-limit contract.
create or replace function public.check_rate_limit(
  p_key text,
  p_max int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));

  select count(*) into recent_count
  from public.rate_limit_hits
  where key = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);

  if recent_count >= p_max then
    return false;
  end if;

  insert into public.rate_limit_hits (key) values (p_key);
  return true;
end;
$$;

revoke all on function public.check_rate_limit(text, int, int) from public;
grant execute on function public.check_rate_limit(text, int, int) to anon, authenticated, service_role;

alter table public.rate_limit_hits enable row level security;
-- No direct table policies for anon/authenticated — all access goes through
-- the security-definer RPC above. service_role (used nowhere for this table
-- today) is left without a bypass policy on purpose; add one only if a
-- server-side maintenance job needs direct access later.

notify pgrst, 'reload schema';
