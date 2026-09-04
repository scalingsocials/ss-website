-- Scaling Socials — website lead capture inbox
--
-- APPLIED 2026-09-04 to the "Scaling Socials CRM" Supabase project
-- (ref jpytofvaofsztvuwxnta) via MCP migration `create_website_leads_table`.
--
-- Why a separate table, not the CRM `leads` table: that project's public.leads is
-- the live sales pipeline (full_name / phone / assigned_to are NOT NULL, status is
-- an enum, rows link to lead_stages/notes/pitch). Raw and partial website captures
-- can't be inserted there directly and must not pollute it. So the website writes
-- to this isolated inbox; leads are promoted into public.leads separately, with a
-- rep and a stage (a future promote step — see src/pages/api/lead.ts TODO).
--
-- /api/lead.ts upserts here on lead_id (partial -> abandoned -> complete share one
-- row). Secrets live only in the Cloudflare Pages env, never in the repo.

create table if not exists public.website_leads (
  lead_id       text primary key,
  status        text not null default 'partial',   -- partial | abandoned | complete
  source        text,                               -- audit, performance-marketing, seo, ...
  name          text,
  email         text,
  phone         text,
  company       text,
  website       text,
  message       text,
  answers       jsonb not null default '{}'::jsonb, -- service-specific q_* answers
  page          text,                               -- path the lead came from
  score         integer not null default 0,         -- +15 audit, +10 complete, +10 email, +5 phone, +5 answers
  crm_lead_id   uuid,                                -- soft link to public.leads.id once promoted
  synced_to_crm boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists website_leads_status_idx     on public.website_leads (status);
create index if not exists website_leads_created_at_idx  on public.website_leads (created_at desc);
create index if not exists website_leads_unsynced_idx    on public.website_leads (synced_to_crm) where synced_to_crm = false;

-- Service-role only. RLS on with no anon/authenticated policies => the public anon
-- key can neither read nor write; the /api/lead worker uses the service key.
alter table public.website_leads enable row level security;
