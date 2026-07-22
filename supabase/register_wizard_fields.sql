-- =============================================================================
-- Khazu — Registration wizard: extra profile fields
-- Run AFTER schema.sql (profiles must exist)
-- Adds columns used by the Step 3 (account-specific) registration screen:
--   - preferred_contact_method (individual)
--   - website, years_in_operation (dealer)
-- avatar_url (individual photo / dealer logo) and bio (business description)
-- already exist on profiles from schema.sql.
-- =============================================================================

alter table public.profiles
  add column if not exists preferred_contact_method text
    check (preferred_contact_method in ('phone', 'email', 'whatsapp')),
  add column if not exists website text,
  add column if not exists years_in_operation int
    check (years_in_operation is null or years_in_operation >= 0);

notify pgrst, 'reload schema';
