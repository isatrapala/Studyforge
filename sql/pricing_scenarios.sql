-- Week 3: Product Architecture + Pricing Simulator
-- Run this once in Supabase -> SQL Editor -> New query, then "Run".
--
-- Stores each pricing scenario saved from /pricing: the name, the scenario
-- type (conservative / expected / optimistic), all calculator inputs as
-- JSON, and the monthly and annual revenue that was calculated.

create table if not exists pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scenario text not null,
  inputs_json jsonb not null,
  monthly_revenue numeric not null,
  annual_revenue numeric not null,
  created_at timestamptz not null default now()
);

-- Same simple rule as the other tables: Row Level Security on, with public
-- read and insert because there is no login yet. Safe to run again.
alter table pricing_scenarios enable row level security;

drop policy if exists "public can read pricing_scenarios" on pricing_scenarios;
create policy "public can read pricing_scenarios"
  on pricing_scenarios for select
  using (true);

drop policy if exists "public can insert pricing_scenarios" on pricing_scenarios;
create policy "public can insert pricing_scenarios"
  on pricing_scenarios for insert
  with check (true);
