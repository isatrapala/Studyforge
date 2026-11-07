-- Week 5: Public Chatbot / Guided Assistant
-- Run this once in Supabase -> SQL Editor -> New query, then "Run".
--
-- chat_sessions: one row per finished /chat session (the answers, how it ended,
-- a short summary) and the rating the user gave afterwards.

create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null default '{}'::jsonb,
  outcome text not null check (outcome in ('plan', 'blocked', 'offtopic', 'human')),
  rating text check (rating in ('up', 'down')),
  comment text,
  summary text not null,
  created_at timestamptz not null default now()
);

-- Same simple rule as the other tables: Row Level Security on, with public
-- read and insert because there is no login yet. Update is also public so a
-- rating can be added to a saved session. Safe to run again.
alter table chat_sessions enable row level security;

drop policy if exists "public can read chat_sessions" on chat_sessions;
create policy "public can read chat_sessions"
  on chat_sessions for select
  using (true);

drop policy if exists "public can insert chat_sessions" on chat_sessions;
create policy "public can insert chat_sessions"
  on chat_sessions for insert
  with check (true);

drop policy if exists "public can update chat_sessions" on chat_sessions;
create policy "public can update chat_sessions"
  on chat_sessions for update
  using (true)
  with check (true);
