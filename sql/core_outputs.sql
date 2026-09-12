-- Week 1: Generative Core Agent
-- Run this once in Supabase → SQL Editor → New query, then "Run".
--
-- Stores each "core extraction" the student generates and saves from /core.
-- output_json holds the structured card (coreTopic, keyConcepts, studySteps,
-- whyItMatters) exactly as simulated by src/lib/coreEngine.js.

create table if not exists core_outputs (
  id uuid primary key default gen_random_uuid(),
  title text,
  input_text text not null,
  output_json jsonb not null,
  created_at timestamptz not null default now()
);

-- Free-tier friendly: Row Level Security on, but with a public read/write
-- policy since this project has no login system yet (single-user, Week 1).
-- Tighten this once accounts/auth are introduced in a later week.
alter table core_outputs enable row level security;

create policy "public can read core_outputs"
  on core_outputs for select
  using (true);

create policy "public can insert core_outputs"
  on core_outputs for insert
  with check (true);
