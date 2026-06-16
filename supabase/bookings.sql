-- Dent-X consultation bookings.
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query → Run).
-- After running it, view/manage submissions in Dashboard → Table editor → bookings,
-- and/or in the site's own admin panel at /admin.

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text not null,
  phone          text not null,
  preferred_date date,
  preferred_time text,
  note           text,
  status         text not null default 'new'   -- new | contacted | done | cancelled
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);

-- Lock the table down: enable RLS with NO public policies, so the table is
-- unreachable with the public "anon" key. Only the server (using the secret
-- service_role key) can insert bookings and the admin panel can read them.
alter table public.bookings enable row level security;
