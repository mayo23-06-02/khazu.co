-- =============================================================================
-- Khazu — custom email verification (EmailJS-based)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Replaces Supabase Auth's built-in "confirm email" flow. Codes are sent via
-- EmailJS (server-side) and checked against this table instead of Supabase's
-- own confirmation link. All access goes through the service-role client
-- (lib/supabase/admin.ts), so RLS is enabled with no public policies.
-- =============================================================================

alter table public.profiles
  add column if not exists email_verified_at timestamptz;

create table if not exists public.email_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_verifications_email_idx
  on public.email_verifications (lower(email));

alter table public.email_verifications enable row level security;
-- No policies: only the service-role client (admin.ts) may read/write this
-- table. Regular users never query it directly.

notify pgrst, 'reload schema';
