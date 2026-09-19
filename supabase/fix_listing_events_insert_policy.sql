-- =============================================================================
-- Fix: listing_events_insert_authenticated allowed ANY event_type (including
-- "like", "comment", "boost_started", "boost_ended", "status_change") to be
-- inserted by any authenticated user on any active listing — those types
-- either have their own dedicated, ownership-checked write paths elsewhere
-- (lib/comments/actions.ts, createMockBoost) or should never be client-
-- writable at all. This let any signed-in user fabricate engagement stats
-- or spoof activity-feed entries on someone else's listing.
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

drop policy if exists "listing_events_insert_authenticated" on public.listing_events;
create policy "listing_events_insert_authenticated"
  on public.listing_events for insert to authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.status = 'active'
        and (
          -- any signed-in visitor can log view/contact engagement
          event_type in ('view', 'contact')
          -- only the listing's own seller can log a boost-started event
          or (event_type = 'boost_started' and l.seller_id = auth.uid())
        )
    )
  );

notify pgrst, 'reload schema';
