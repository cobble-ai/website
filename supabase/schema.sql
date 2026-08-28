-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- for the project you're using in SUPABASE_URL.

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Row Level Security is enabled with no policies, so the anon/public key
-- cannot read or write this table at all. The /api/waitlist route uses the
-- service role key, which bypasses RLS entirely. That's the only writer.
alter table waitlist enable row level security;
