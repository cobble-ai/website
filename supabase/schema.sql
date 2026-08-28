-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- for the project you're using in SUPABASE_URL. Safe to re-run: every
-- statement is idempotent, so running it again after pulling new columns
-- will not error or touch existing data.

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Step 1: capture and identity.
alter table waitlist add column if not exists handle text;
alter table waitlist add column if not exists country text;

-- Step 2: tap-only qualification questions.
alter table waitlist add column if not exists archive text[];
alter table waitlist add column if not exists broll_sources text[];
alter table waitlist add column if not exists edit_time text;
-- false only when edit_time is "I haven't posted a video yet"; true otherwise
-- (including when step 2 is skipped entirely). Drives which confirmation
-- email variant gets sent.
alter table waitlist add column if not exists has_posted boolean not null default true;

-- Step 3: final tap question, opt-in, optional free text.
alter table waitlist add column if not exists paid_for text[];
alter table waitlist add column if not exists free_edit_optin boolean not null default false;
alter table waitlist add column if not exists annoyance text;

-- Funnel / attribution metadata, written on every step's call.
alter table waitlist add column if not exists source text;
alter table waitlist add column if not exists submitted_at timestamptz;
alter table waitlist add column if not exists step_reached smallint;

-- Set once the confirmation email actually sends, so a retried or
-- double-clicked final submit never sends it twice for the same email.
alter table waitlist add column if not exists confirmation_sent_at timestamptz;

-- Row Level Security is enabled with no policies, so the anon/public key
-- cannot read or write this table at all. The /api/waitlist route uses the
-- service role key, which bypasses RLS entirely. That's the only writer.
alter table waitlist enable row level security;
