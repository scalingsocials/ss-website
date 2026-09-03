# 04 — Lead Capture, CRM Wiring, Ad Landing Pages, and Tracking

## 1. Principle

The website is a lead source that writes into the Supabase CRM you already run. It is not a
separate system. Every form on the site — organic pages, ad landing pages, tool downloads,
newsletter — hits one endpoint, gets normalised, gets scored, and lands in the same pipeline
that already routes to WhatsApp for Harsh and Vinay.

One endpoint. One schema. One source of truth.

---

## 2. Architecture

```
Browser
  └─ React island <LeadForm variant="..."/>
       • zod validation client-side (same schema as server)
       • Cloudflare Turnstile (invisible)
       • honeypot field
       • captures attribution from sessionStorage + document.referrer
       │
       ▼  POST /api/lead   (Astro server route, prerender: false)
Cloudflare Worker
  ├─ zod re-validate (never trust client)
  ├─ Turnstile verify
  ├─ rate limit by IP (10/hour) + duplicate-email suppression (24h)
  ├─ enrich: IP → country/city, parse UTM, resolve gclid/fbclid
  ├─ score lead (see §4)
  │
  ├──► Supabase: insert into leads table (service-role key, Worker-side only)
  ├──► Meta Conversions API: Lead event, hashed email/phone, event_id
  ├──► GA4 Measurement Protocol: generate_lead event
  ├──► Resend: confirmation email to prospect + alert to sales
  └──► CRM WhatsApp routing module (existing) → Harsh / Vinay by round-robin or score
       │
       ▼
   200 { ok: true, leadId } → client shows /thank-you/ state
```

**Why server-side, not a form service.** Third-party form embeds (Typeform, HubSpot,
WPForms) add 100–300 KB of JS, break your perf budget, and put your lead data outside your
CRM. You already have the infrastructure. Use it.

---

## 3. The lead payload schema

Define once in `src/lib/validation.ts`, imported by both the React island and the Worker.

```ts
export const leadSchema = z.object({
  // Identity
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{8,15}$/),
  company: z.string().max(120).optional(),
  website: z.string().url().optional(),

  // Qualification — these drive routing and scoring
  monthly_ad_spend: z.enum(['<1L','1-3L','3-5L','5-15L','15L+','not-running-ads']),
  monthly_revenue: z.enum(['<5L','5-25L','25L-1Cr','1Cr+','pre-revenue']).optional(),
  services_interested: z.array(z.enum([
    'meta-ads','google-ads','seo','shopify','web-dev','social-media','cro'
  ])).min(1),
  primary_challenge: z.string().max(600).optional(),
  timeline: z.enum(['immediately','1-month','1-3-months','exploring']).optional(),

  // Context — filled automatically, never shown to the user
  source_page: z.string(),          // full path of the page the form was on
  source_type: z.enum(['organic','paid-lp','tool','newsletter','contact','exit-intent']),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  referrer: z.string().optional(),
  landing_page: z.string(),         // FIRST page of the session, not the form page
  session_page_count: z.number(),
  device: z.enum(['mobile','tablet','desktop']),

  // Anti-spam
  turnstile_token: z.string(),
  _hp: z.string().max(0),           // honeypot — must be empty
});
```

**Attribution capture.** On first page of a session, write to `sessionStorage`:
`landing_page`, `referrer`, and all UTM/click-ID params. Every form reads from there. Without
this you cannot tell which blog post produced the lead — you only see the contact page.

### Supabase table

```sql
create table public.website_leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text not null,
  email             text not null,
  phone             text not null,
  company           text,
  website           text,
  monthly_ad_spend  text not null,
  monthly_revenue   text,
  services          text[] not null,
  primary_challenge text,
  timeline          text,
  score             int not null default 0,
  tier              text not null,          -- hot | warm | nurture
  source_page       text not null,
  source_type       text not null,
  landing_page      text not null,
  utm               jsonb,
  gclid             text,
  fbclid            text,
  referrer          text,
  device            text,
  ip_country        text,
  ip_city           text,
  assigned_to       text,                   -- harsh | vinay | ...
  crm_lead_id       uuid,                   -- FK into your existing pipeline
  status            text not null default 'new'
);
create index on public.website_leads (created_at desc);
create index on public.website_leads (tier, status);
create unique index on public.website_leads (email, date_trunc('day', created_at));
```

RLS on. Only the Worker's service role can insert. No anon access.

---

## 4. Lead scoring and routing

Score at the Worker, store the score, route on it. Keep the rules in one config object so
you can tune without redeploying logic.

| Signal | Points |
|---|---|
| Monthly ad spend 15L+ | +40 |
| 5–15L | +30 |
| 3–5L | +20 |
| 1–3L | +10 |
| <1L or not running ads | 0 |
| Has a live website with a Shopify/WooCommerce signature | +15 |
| Timeline = immediately | +20 |
| Timeline = 1 month | +10 |
| Came from a case study page | +15 |
| Came from the Benchmark Index or a tool | +10 |
| Came from a paid LP | +5 |
| Filled `primary_challenge` with >100 chars | +10 |
| Session page count ≥ 4 | +10 |
| Free email domain (gmail/yahoo) | −5 |
| Phone fails Indian/UAE format | −20 |

Tiers: **hot ≥ 60**, **warm 30–59**, **nurture < 30**.

Routing:
- **Hot** → immediate WhatsApp to the on-duty BDE + email to Khan + calendar link in the
  auto-reply. Target: contacted within 5 minutes. Speed-to-lead is the single largest
  controllable variable in inbound conversion.

### 4.1 Hot-lead escalation — the 5-minute fallback

A hot lead that nobody picks up is worse than no lead. Speed-to-lead decay is steep: response
inside 5 minutes versus 30 minutes is a large multiple on connect rate.

**Rule.** If a lead scoring ≥ 60 is not marked claimed in the CRM within **5 minutes** of
insert, fire a secondary WhatsApp alert directly to the founders.

**Implementation — a Worker cannot sleep inside a request.** Use a Cloudflare **Durable Object
with an alarm**:

```ts
// src/workers/HotLeadEscalation.ts
export class HotLeadEscalation {
  constructor(private state: DurableObjectState, private env: Env) {}

  // called by /api/lead immediately after a hot-lead insert
  async fetch(req: Request) {
    const { leadId, name, phone, spend, sourcePage, assignedTo } = await req.json();
    await this.state.storage.put('lead', { leadId, name, phone, spend, sourcePage, assignedTo });
    await this.state.storage.setAlarm(Date.now() + 5 * 60 * 1000);
    return new Response('scheduled');
  }

  // fires 5 minutes later
  async alarm() {
    const lead = await this.state.storage.get('lead');
    if (!lead) return;

    // re-read the row — the BDE may have claimed it
    const { data } = await supabase(this.env)
      .from('website_leads')
      .select('status, claimed_at')
      .eq('id', lead.leadId)
      .single();

    if (data?.claimed_at) return;                       // claimed. nothing to do.

    await sendWhatsApp(this.env.FOUNDER_ESCALATION_WEBHOOK, {
      text:
        `UNCLAIMED HOT LEAD — 5 min\n` +
        `${lead.name} · ${lead.phone}\n` +
        `Spend: ${lead.spend}\n` +
        `From: ${lead.sourcePage}\n` +
        `Assigned: ${lead.assignedTo}\n` +
        `${this.env.CRM_URL}/leads/${lead.leadId}`,
    });

    await supabase(this.env)
      .from('website_leads')
      .update({ escalated_at: new Date().toISOString() })
      .eq('id', lead.leadId);
  }
}
```

Add to the table in §3:
```sql
alter table public.website_leads
  add column claimed_at   timestamptz,
  add column claimed_by   text,
  add column escalated_at timestamptz;
```

`FOUNDER_ESCALATION_WEBHOOK` is a **separate** webhook from the BDE routing webhook, so
escalations are visibly distinct and cannot be muted along with normal lead noise.

**Alternative if Durable Objects are unavailable on your plan:** a cron-triggered Worker running
every minute, selecting rows where `tier = 'hot' AND claimed_at IS NULL AND escalated_at IS NULL
AND created_at < now() - interval '5 minutes'`. Less precise, functionally equivalent, simpler.

**Claiming.** The CRM must expose a one-tap claim action that writes `claimed_at` and
`claimed_by`. Without that write, every hot lead escalates and the founders learn to ignore the
alert — which defeats the whole mechanism. Build the claim action before switching escalation on.
- **Warm** → WhatsApp to the round-robin BDE, 30-minute SLA.
- **Nurture** → into the email sequence, no BDE alert.

---

## 5. Forms across the site — variants

Do not use one form everywhere. Match the ask to the intent.

| Placement | Fields | CTA copy |
|---|---|---|
| Homepage hero | Email + monthly ad spend (2 fields) → then a progressive second step | "Get a free growth plan" |
| Service page inline | Name, email, phone, ad spend | "Get a free account audit" |
| Case study end | Name, email, phone | "Show me what this looks like for my brand" |
| Tool result gate | Email only, **after** showing the result | "Email me this breakdown" |
| Benchmark Index | Email only | "Get the next quarter's data first" |
| Contact page | Full form | "Send" |
| Ad landing page | Name, phone, email, ad spend — 4 max | Match the ad's promise |
| Blog sidebar/end | Email only | "Get the weekly D2C teardown" |
| Exit intent (desktop only) | Email only | Only on service and case study pages. Not sitewide. Not on mobile. |

**Multi-step where the ask is large.** Step 1 asks the low-friction question (ad spend range —
which is also the qualifier). Step 2 asks for contact details. Completion rates are materially
higher and you capture the qualification even on abandons if you fire a partial event.

**Never gate the Benchmark Index or the calculators behind a form.** They exist to earn links
and citations. A gate kills both. Collect email *after* delivering value, optionally.

---

## 6. Ad landing pages

Separate template, separate rules. `noindex, nofollow`, not in the sitemap, not in nav.

### Structure
```
1. Headline — verbatim message-match to the ad creative
2. Sub-headline — the specific outcome, with a number
3. Form (above the fold, 4 fields) OR a single CTA that scrolls to it
4. Proof bar — 3 attributed numbers
5. "What you get" — 3–5 concrete deliverables, not benefits
6. One case study, condensed, with the results table
7. Risk reversal — what happens if it doesn't work, stated plainly
8. Founder photo + one-paragraph note in first person
9. FAQ — the 5 objections your BDEs actually hear on calls
10. Form again
```

### Rules
- **One conversion action.** No nav, no footer links, no "explore our services".
- **LCP under 1.5s.** Landing page speed is an input to Google Ads Quality Score, which is an
  input to your CPC. A fast LP is a direct media-cost saving.
- **Build a variant system.** `/lp/[campaign]/` reads from a content collection so your team
  can ship a new LP by adding an MDX file, not by asking a developer. This is what lets you
  run message-matched LPs per ad set instead of sending all traffic to one page.
- **Thank-you page at `/lp/thank-you/`** — a real URL, so it can be a conversion destination.
  Put the calendar booking widget there. Roughly a third of leads will self-book if you ask
  at that moment.

---

## 7. Tracking

### GA4
- Loaded via GTM, deferred to `requestIdleCallback`, or via Partytown.
- Events: `form_start`, `form_step_complete`, `generate_lead`, `tool_used`,
  `benchmark_download`, `case_study_read` (scroll depth 75%), `call_click`,
  `whatsapp_click`, `calendar_booked`.
- `generate_lead` fired **server-side** via Measurement Protocol from the Worker, so it is
  not lost to ad blockers. Deduplicate against the client event with a shared `event_id`.

### Meta Conversions API
- Fire `Lead` server-side from the Worker with hashed email and phone (SHA-256, lowercase,
  trimmed), `event_id` shared with any client pixel event for deduplication, plus `fbc`/`fbp`
  cookies passed through.
- This matters more than usual for you: iOS attribution loss is the reason your reported ROAS
  and actual revenue diverge, and CAPI is the fix. It is also a live demo of a service you
  sell.
- Target Event Match Quality of 7.0+. Pass email, phone, first name, last name, city,
  country, and click ID.

### Google Ads
- Enhanced conversions for leads, using the hashed email, uploaded via the Worker or via
  offline conversion import from the CRM once a lead becomes qualified/closed.
- **Import closed-won back into Google Ads and Meta.** Optimising toward form fills teaches
  the algorithm to find form fillers. Optimising toward qualified pipeline teaches it to find
  customers. Almost nobody does this. Since your CRM already holds the outcome, you can.

### Microsoft Clarity
Free, lightweight, gives session recordings and heatmaps on your own site. Use it to run the
CRO you sell — and screenshot the findings for content.

### Consent
Add a lightweight consent banner for EU/UK traffic only (geo-gated at the edge so Indian
visitors never see it), with Google Consent Mode v2 wired up. Do not ship a heavy CMP.

---

## 8. Speed-to-lead operations

The build is only half of this. On the operations side:

- WhatsApp alert to the assigned BDE within 10 seconds of submission, containing name, phone,
  ad spend, the page they came from, and their stated challenge.
- Auto-reply email within 60 seconds with a calendar link and one relevant case study matched
  to their selected service.
- A `/thank-you/` page with the calendar embed, so booking can happen before anyone calls.
- A simple internal dashboard (you already have the CRM — add a view) showing: leads today by
  tier, median time-to-first-contact, and source page. If median time-to-first-contact drifts
  above 15 minutes, the site's conversion rate becomes irrelevant.
