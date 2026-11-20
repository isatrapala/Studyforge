-- Week 6: Integrated Agentic Venture + Impact & Viability
-- Run this once in Supabase -> SQL Editor -> New query, then "Run".
--
-- venture_feedback: one row per external tester who finished the /demo
-- walkthrough. Testers are identified by initials only. No emails, no phone
-- numbers, no real names.

create table if not exists venture_feedback (
  id uuid primary key default gen_random_uuid(),
  tester text not null,
  finished boolean not null default false,
  usefulness int not null check (usefulness between 1 and 5),
  helped text not null check (helped in ('yes', 'some', 'no')),
  would_use text check (would_use in ('yes', 'maybe', 'no')),
  comment text,
  created_at timestamptz not null default now()
);

-- Same simple rule as the other tables: Row Level Security on, with public
-- read and insert because there is no login yet. Safe to run again.
alter table venture_feedback enable row level security;

drop policy if exists "public can read venture_feedback" on venture_feedback;
create policy "public can read venture_feedback"
  on venture_feedback for select
  using (true);

drop policy if exists "public can insert venture_feedback" on venture_feedback;
create policy "public can insert venture_feedback"
  on venture_feedback for insert
  with check (true);
