-- =============================================================================
-- Khazu — Listing editing + price-drop tracking
-- Run AFTER personal_dashboard.sql
-- Project SQL: https://supabase.com/dashboard/project/cfmkbytybjpwypsmldkw/sql/new
-- =============================================================================

-- Tracks the price a listing was reduced from, so the public marketplace can
-- show a "price drop" badge (percentage off) with the old price struck through.
-- Set whenever a seller edits a listing and lowers the price; cleared when the
-- price is raised back up or matches the previous value.
alter table public.listings
  add column if not exists previous_price numeric(12, 2);
