-- Week 2: Research + Benchmarking Dashboard
-- Run this once in Supabase -> SQL Editor -> New query, then "Run".
--
-- Stores each research / validation entry logged from /research -- e.g. a
-- real conversation testing whether the "messy notes" problem is real for
-- someone, a survey response, or a note from trying a competitor's app.
--
-- The 5 global examples + 8 direct competitors shown on /research are
-- static reference data (src/lib/researchData.js), not stored here -- this
-- table only holds the research the student personally logs.

create table if not exists research_outputs (
  id uuid primary key default gen_random_uuid(),
  title text,
  method text not null,
  summary text not null,
  validates_hypothesis text,
  created_at timestamptz not null default now()
);

-- Free-tier friendly: Row Level Security on, but with a public read/write
-- policy since this project has no login system yet (single-user, Week 2).
-- Tighten this once accounts/auth are introduced in a later week.
alter table research_outputs enable row level security;

create policy "public can read research_outputs"
  on research_outputs for select
  using (true);

create policy "public can insert research_outputs"
  on research_outputs for insert
  with check (true);
