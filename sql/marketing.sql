-- Week 4: Marketing Engine + Content System
-- Run this once in Supabase -> SQL Editor -> New query, then "Run".
--
-- Creates two tables:
--   marketing_assets: posts, scripts, landing copy and calendars saved from /marketing
--   ab_votes: one row per real vote in the two A/B tests (headline and cta)

create table if not exists marketing_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('landing', 'post', 'script', 'calendar')),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists ab_votes (
  id uuid primary key default gen_random_uuid(),
  test_id text not null check (test_id in ('headline', 'cta')),
  variant text not null check (variant in ('A', 'B')),
  created_at timestamptz not null default now()
);

-- Same simple rule as the other tables: Row Level Security on, with public
-- read and insert because there is no login yet. Safe to run again.
alter table marketing_assets enable row level security;
alter table ab_votes enable row level security;

drop policy if exists "public can read marketing_assets" on marketing_assets;
create policy "public can read marketing_assets"
  on marketing_assets for select
  using (true);

drop policy if exists "public can insert marketing_assets" on marketing_assets;
create policy "public can insert marketing_assets"
  on marketing_assets for insert
  with check (true);

drop policy if exists "public can read ab_votes" on ab_votes;
create policy "public can read ab_votes"
  on ab_votes for select
  using (true);

drop policy if exists "public can insert ab_votes" on ab_votes;
create policy "public can insert ab_votes"
  on ab_votes for insert
  with check (true);
