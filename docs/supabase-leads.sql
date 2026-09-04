-- Scaling Socials — website lead capture table
--
-- Run in the Supabase SQL editor of the project whose SUPABASE_URL /
-- SUPABASE_SERVICE_KEY you set in the Cloudflare Pages env. One row per lead_id,
-- upserted by /api/lead.ts — the partial, abandoned and complete states of a
-- single visitor share the same row (Shopify-style abandoned capture).
--
-- ⚠ Reusing an existing project ("Social Flow Hub 84"): if that project ALREADY
--   has a `leads` table, do NOT run this blindly — the column set may differ and
--   the upsert would fail. Confirm the existing schema first (that's what the
--   Supabase MCP inspection is for) and either match this table's columns to the
--   CRM's, or use a dedicated table name (e.g. website_leads) here and in
--   src/pages/api/lead.ts's fetch URL.

create table if not exists public.leads (
  lead_id     text primary key,
  status      text not null default 'partial',   -- partial | abandoned | complete
  source      text,                               -- e.g. audit, performance-marketing, seo
  name        text,
  email       text,
  phone       text,
  company     text,
  website     text,
  message     text,
  answers     jsonb not null default '{}'::jsonb, -- service-specific q_* answers
  page        text,                               -- path the lead came from
  score       integer not null default 0,         -- +15 audit, +10 complete, +10 email, +5 phone, +5 answers
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Fast filtering of the pipeline by state and recency.
create index if not exists leads_status_idx      on public.leads (status);
create index if not exists leads_created_at_idx   on public.leads (created_at desc);

-- Lock it down: only the service role (used server-side by /api/lead) may touch
-- this table. With RLS on and no anon/authenticated policies, the public anon key
-- can neither read nor write it.
alter table public.leads enable row level security;
