-- Trial fields on profiles (auto trial for every user)
alter table public.profiles
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists scheduled_plan_id text,
  add column if not exists scheduled_charge_at timestamptz,
  add column if not exists momo_msisdn text;

notify pgrst, 'reload schema';
