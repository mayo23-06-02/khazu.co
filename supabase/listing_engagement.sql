-- =============================================================================
-- Khazu — listing comments (with seller replies) + likes
-- Run AFTER schema.sql and personal_dashboard.sql (profiles + listings must exist)
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

-- 'unlike' lets handle_listing_event() below decrement likes_count when a user
-- un-likes a listing (existing enum only ever incremented).
alter type public.listing_event_type add value if not exists 'unlike';

-- -----------------------------------------------------------------------------
-- listing_comments (buyer comments + threaded seller replies)
-- -----------------------------------------------------------------------------
create table if not exists public.listing_comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  parent_comment_id uuid references public.listing_comments (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists listing_comments_listing_created_idx
  on public.listing_comments (listing_id, created_at asc);
create index if not exists listing_comments_parent_idx
  on public.listing_comments (parent_comment_id);

-- -----------------------------------------------------------------------------
-- listing_likes (one row per user per listing — toggled on/off)
-- -----------------------------------------------------------------------------
create table if not exists public.listing_likes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

create index if not exists listing_likes_listing_idx on public.listing_likes (listing_id);

-- -----------------------------------------------------------------------------
-- Extend the existing event → counters trigger to support decrementing
-- (needed for 'unlike'); 'view'/'like'/'comment'/'contact' behavior unchanged.
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
  delta int := 1;
begin
  case new.event_type
    when 'view' then
      col_counter := 'views_count';
      col_daily := 'views';
    when 'like' then
      col_counter := 'likes_count';
      col_daily := 'likes';
    when 'unlike' then
      col_counter := 'likes_count';
      col_daily := 'likes';
      delta := -1;
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
    'update public.listings set %I = greatest(%I + $1, 0), updated_at = now() where id = $2',
    col_counter, col_counter
  ) using delta, new.listing_id;

  insert into public.listing_daily_stats as s (
    listing_id, seller_id, day, views, likes, comments, contacts
  )
  values (
    new.listing_id,
    new.seller_id,
    (new.created_at at time zone 'utc')::date,
    case when col_daily = 'views' then delta else 0 end,
    case when col_daily = 'likes' then delta else 0 end,
    case when col_daily = 'comments' then delta else 0 end,
    case when col_daily = 'contacts' then delta else 0 end
  )
  on conflict (listing_id, day) do update set
    views = greatest(s.views + excluded.views, 0),
    likes = greatest(s.likes + excluded.likes, 0),
    comments = greatest(s.comments + excluded.comments, 0),
    contacts = greatest(s.contacts + excluded.contacts, 0);

  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.listing_comments enable row level security;
alter table public.listing_likes enable row level security;

-- Comments are readable by anyone on an active listing; the seller can also
-- read comments on their own listing regardless of status.
drop policy if exists "listing_comments_select" on public.listing_comments;
create policy "listing_comments_select"
  on public.listing_comments for select to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_comments.listing_id
        and (l.status = 'active' or l.seller_id = auth.uid())
    )
  );

-- Any signed-in user can leave a top-level comment on an active listing.
-- Only the listing's seller may insert a reply (parent_comment_id set).
drop policy if exists "listing_comments_insert" on public.listing_comments;
create policy "listing_comments_insert"
  on public.listing_comments for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.listings l
      where l.id = listing_comments.listing_id
        and l.status = 'active'
        and l.seller_id = listing_comments.seller_id
        and (
          parent_comment_id is null
          or l.seller_id = auth.uid()
        )
    )
  );

-- Likes: a user can only see/manage their own like row (listings.likes_count
-- already exposes the public total via the trigger above).
drop policy if exists "listing_likes_select_own" on public.listing_likes;
create policy "listing_likes_select_own"
  on public.listing_likes for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "listing_likes_insert_own" on public.listing_likes;
create policy "listing_likes_insert_own"
  on public.listing_likes for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.listings l
      where l.id = listing_likes.listing_id
        and l.status = 'active'
        and l.seller_id = listing_likes.seller_id
    )
  );

drop policy if exists "listing_likes_delete_own" on public.listing_likes;
create policy "listing_likes_delete_own"
  on public.listing_likes for delete to authenticated
  using (user_id = auth.uid());

grant select, insert on table public.listing_comments to authenticated, service_role;
grant select on table public.listing_comments to anon;
grant select, insert, delete on table public.listing_likes to authenticated, service_role;

notify pgrst, 'reload schema';
