# Pending work — Scaling Socials website

Status as of 2026-09-04. The site builds green: `check`, `build`, `check:perf`
(per-page tiers), `check:schema`, and `check:links` (0 broken, 0 orphans) all pass.
**38 pages** are live in the repo. This document lists what remains, split by
whether it needs **you** (content/decisions) or can be **built** by Claude Code.

---

## ✅ Done so far

- Design system (tokens, primitives, blocks), styleguide, palette (periwinkle + teal).
- **Homepage** — hero (real ₹ results), services, creative slider, case studies,
  testimonials, teardowns, process, pricing, comparison, FAQ, founder, CTA. Real
  client logos (marquee) + real creative stills.
- **6 service pillar pages** + **10 cluster pages** (Meta/Google/PPC, ecommerce/
  technical/local SEO + AEO, Shopify migration/speed/redesign).
- **/audit/** + **2-step lead form** with **abandoned-lead capture** (partial on
  step 1, `sendBeacon` on leave) + **/api/lead** + **/thank-you/**.
- **About, Team, Contact**; **Terms, Privacy, Disclaimer, Cookie policy**.
- Index pages: **tools, case-studies, work, teardowns**; noindex landers for
  **blog, guides, glossary**.
- **Four free tools** — Break-even ROAS, D2C CAC payback, Meta ads budget planner,
  Shopify speed grader (React islands, SSR + shareable URLs, crawlable formulae).
- **Client logos normalised** — trimmed padding + uniform tiles; near-white marks
  (House of Kathas, Luxeraa) on dark tiles so they are visible.
- **Lead form fits one screen** — step 1 is name/email/phone; brand + website moved
  to step 2.
- **Graphics kit** (`src/components/graphics/`: Glyph, DotField, PanelMotif) placed
  across service pages, tools and interior heroes.
- **Policy pages** rebuilt with the real published wording from scalingsocials.com,
  in a full-width docs layout (sticky TOC + full-width body).

---

## 🔴 A. Lead pipeline go-live — BLOCKING (the form UI works, but nothing persists yet)

> **Deploy target: decided → Cloudflare Pages** (owner, 2026-09-04). Matches the
> existing `@astrojs/cloudflare` adapter and the spec. Full step-by-step in
> **[`DEPLOY-CLOUDFLARE.md`](./DEPLOY-CLOUDFLARE.md)** — build on the free
> `*.pages.dev` URL now, attach `scalingsocials.com` only at cutover.

1. **Create the Cloudflare Pages project** — connect `scalingsocials/ss-website`,
   build `npm run build` → `dist`, add the `nodejs_compat` flag + `NODE_VERSION`,
   and lock the `*.pages.dev` URL with Cloudflare Access so it can't be indexed.
   (Was: "decide Cloudflare vs Netlify" — now settled.) See the runbook, steps 1–4.
2. ~~**Supabase**~~ ✅ **DONE (2026-09-04).** Env vars set on Cloudflare Pages
   (Scaling Socials CRM project, ref `jpytofvaofsztvuwxnta`); `/api/lead.ts` upserts
   into a dedicated `public.website_leads` inbox (RLS on, service-role only) —
   isolated from the CRM `leads` pipeline, which requires a rep + stage. Verified
   end-to-end (live form → function → row, score 45). Remaining: **promote
   website_leads → CRM `leads`** so they show in the CRM UI (needs a default
   assignee + stage from you — see F below).
3. ~~**Turnstile**~~ ✅ **wired (2026-09-04).** Widget on the form (site key in
   `LeadForm.astro`), server verify in `/api/lead`. **Action:** add
   `TURNSTILE_SECRET_KEY` to the Cloudflare env + redeploy to switch verification on.
4. ~~**Resend**~~ ✅ **wired (2026-09-04).** `/api/lead` emails the team on a
   completed enquiry. **Action:** verify a sending domain in Resend and set
   `LEAD_ALERT_FROM` (e.g. `Scaling Socials <leads@scalingsocials.com>`) +
   optionally `LEAD_ALERT_TO`; the default `onboarding@resend.dev` only delivers to
   the Resend account owner until a domain is verified.
5. **Analytics** IDs — GA4, Meta CAPI (server-side), Microsoft Clarity (04).
6. **Promote website_leads → CRM `leads`** (needs a default assignee + stage; see §F).

## 🟠 B. Real content only you can supply

> **See [`CONTENT-REQUIREMENTS.md`](./CONTENT-REQUIREMENTS.md)** for the full, prioritised
> list of transcripts and raw material to send, framed around what most helps SEO and AEO.
> Summary below.

- **Case studies (highest value).** For each of the 3 published results (₹4.43 Cr /
  ₹14 L / ₹10 L): the **client name**, the **before→after table** (ROAS, CAC, AOV,
  revenue, spend, period), and a permission confirmation. Then Claude builds the
  individual `/case-studies/[slug]/` pages (target 8 at launch, per spec).
- **Creative videos** — compress to **≤1.5 MB, ≤8 s, muted, mp4 + webm** and drop
  back into `src/assets/Creatives/` (see the ffmpeg recipe given in chat). They then
  auto-wire into the creative wall (poster → play on scroll → click to unmute/expand).
- **Founder headshots + a confirmed pull-quote**, and **team photos** (currently
  initials tiles).
- **Three headline stats** (managed spend, brands, average ROAS) if you want an
  aggregate proof bar; and **how ROAS is calculated**.
- **Starting prices** for Shopify / web / social if you want a figure instead of
  "scoped".
- **Partner directory URLs** (Google/Meta/Shopify) to link the verified badges and
  add to `entity.ts` `sameAs`.
- **~20 real objections** (from sales calls) to deepen the FAQs sitewide.
- Optional: the recorded service copy (05 Blocks A/B) to expand pillar pages toward
  the 2,200–3,000-word target.

## 🟡 C. Pages & features Claude can build next (some need C's content)

- **Individual case-study pages** (`CaseStudyLayout`) — needs the data in B.
- **Content collections** (`src/content/config.ts` + zod) + **Keystatic** admin, then:
  **blog** (10 posts), **guides** (3), **glossary** (25 `DefinedTerm` pages). The
  current blog/guides/glossary are honest noindex landers until then.
- **/vs/ comparison pages** (5) — high-intent, low-competition; Claude can draft.
- **Industries** (`/industries/` + 6) — needs a little category content.
- **Locations/Dubai** — only with a UAE proof point + UAE-specific content (spec says
  don't ship a thin clone).
- **/lp/ ad landing pages** (`LandingLayout`, noindex) — as campaigns need them.
- **Benchmark Index** — **PARKED** (do not build; owner directive).

## 🔵 D. Launch-gate infrastructure (03 §0)

- **`public/_redirects`** — build from the Screaming Frog crawl in
  `docs/reference/screaming-frog-crawl-2026-09-02.csv` + `docs/spec/redirect-map.csv`.
  Every old WordPress URL must resolve to a live 200. Claude can generate this.
- **Non-www + canonical enforcement** at the edge (Cloudflare/Netlify rule).
- **HTML sitemap** at `/sitemap/`.
- **RSS `/rss.xml` + JSON `/feed.json`** — after blog content exists.
- **XML sitemap** — generated by `@astrojs/sitemap`; add `blog`, `guides`, `glossary`
  to the exclude filter while they are noindex, and confirm it lists the real pages.
- **`llms.txt` / `llms-full.txt`** — baseline generated; enrich from content collections.
- **Lighthouse CI** — `lighthouserc.json` exists; add an `lh` step to the GH Actions
  workflow (needs Chrome in CI).
- **`_headers` CSP** — currently none. Tighten before launch; if remote image/video
  hosts stay, allow them (better: self-host all media).
- **robots.txt** — present; verify it matches 03 §5 (AI crawlers allowed). _(Audited
  2026-09-04: already allows GPTBot/OAI/ChatGPT-User/ClaudeBot/PerplexityBot/
  Google-Extended/Applebot-Extended/CCBot and points at the sitemap — good.)_
- **Block the staging domain from indexing.** The preview URL is crawlable by
  default. Lock the Cloudflare `*.pages.dev` URL with **Cloudflare Access** (runbook
  step 4) — a repo `_headers` noindex would wrongly hit the live domain too, and
  Transform Rules can't target the shared `pages.dev` zone. Canonicals already point
  at `scalingsocials.com` as a backstop.
- **Real Core Web Vitals measurement on production** — run PageSpeed Insights /
  Lighthouse and CrUX on mobile **and** desktop and record actual **LCP, INP, CLS,
  FCP, TTFB**, total JS/CSS, image weight, render-blocking and third-party cost.
  (We enforce a JS *budget* and have `lh` configured, but have no field/lab CWV
  numbers — INP especially needs a real interaction test, not a guess.)
- **Search Console + Google Business Profile** — verify the production domain in
  Search Console, submit the sitemap; create/optimise the Google Business Profile;
  keep NAP identical across GBP, LinkedIn, Instagram, Facebook and any citations
  (public address only, never the GST invoice address).
- **Security headers in `_headers`** — beyond CSP: HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, secure cookies.
- **Accessibility audit** — alt text, semantic HTML, keyboard nav, focus states,
  form labels/errors, colour contrast, ARIA only where needed.
- **Alt-text audit** — confirm every content image has descriptive (not stuffed)
  alt; logos derive alt from filenames via `logos.ts` today, so verify those read well.
- **Third-party script discipline** — when GA4/GTM/Meta Pixel/Clarity/chat/Calendly
  land (see A5), load them deferred/on-interaction and re-check INP; each one taxes
  the main thread.

## 🟣 F. SEO / AEO depth & authority (from external audit, 2026-09-04)

An external SEO/AEO audit of the live Netlify build was reviewed on 2026-09-04.
**Much of it is already done and needs no action** (it crawled a snapshot and
flagged things we have since shipped): intent-focused title tags and meta
descriptions, one-`h1` heading hierarchy, answer-first FAQ blocks, the four free
calculators, the 2-step progressive lead form, production-domain canonicals
(absolute, non-www, self-referencing — emitted even on the staging URL), a full
JSON-LD `@graph` behind a schema-validation gate, and an AI-crawler-friendly
robots.txt. The genuinely new items it surfaced:

**Authority & evidence** (its core theme: _positioning is ahead of the evidence_)
- **Author / expertise pages** — per-founder `/team/[slug]` pages (bio, discipline,
  experience, LinkedIn, `Person` schema) plus author bylines on guides and case
  studies. Needs founder bios + LinkedIn (CONTENT-REQUIREMENTS §Still-open facts).
- **Richer case-study template** — beyond the before→after table (B/C), each
  `/case-studies/[slug]/` should carry situation, problem, strategy, the first
  three changes, timeline, budget range, before/after for ROAS/CAC/AOV/CR/revenue/
  spend, a client quote, team involved, date, and charts/screenshots. `Article` schema.
- **Link client logos to their case study** — turn the "Brands we work with"
  marquee into an entity graph (logo → `/case-studies/[brand]/`) where permitted.
- **Enrich testimonials** — name, role, company, industry, service, and a
  verifiable link where allowed.

**Topical depth** (six service pages alone won't build organic visibility)
- **A topical map / content hubs**, not just isolated pillar pages: expand beyond
  the planned 3 guides into hub + deep-guide clusters — e.g. an Ecommerce SEO hub
  linking product-page SEO, category/collection SEO, faceted-navigation SEO,
  canonicalisation, pagination, product structured data and Shopify CWV; plus
  Shopify SEO, Meta-Ads-for-D2C and Google-Ads-for-ecommerce guides. Quality over
  volume — 20–30 excellent pages, never mass-produced near-duplicates (the audit
  and Google's spam policy both warn against scaled-content and doorway pages;
  already aligned with CLAUDE.md §15 and the "no thin city clones" note in C).
- **Original-research / data articles** ("we audited N Shopify stores, here is what
  we found") as first-party, citable AEO fuel. Distinct from the **PARKED**
  Benchmark Index — these are lightweight editorial pieces built from real numbers
  the owner supplies (CONTENT-REQUIREMENTS §3). Do not build until data is given.

**Structured data & FAQ** (verify, don't assume)
- **Verify the live `@graph` in Google's Rich Results Test** on the production
  domain post-launch (we validate shape at build; confirm eligibility in Google).
- Confirm **LocalBusiness / PostalAddress** on `/contact` matches the Google
  Business Profile (public NAP only, never the GST invoice address).
- **FAQ rich results**: keep `FAQPage` schema for AEO/semantics, but treat rich-
  snippet eligibility as uncertain (Google has curtailed FAQ rich results) and do
  not build strategy around FAQ snippets — verify current status at launch.

## ⚪ E. Known cleanups / notes

- 🔴 **Visible `TODO` in the nav** — the header mega-menu right rail
  (`Header.astro`, "Latest case study") renders `TODO: [featured case study —
  client, result, link]` in the DOM on **every** page. The external audit caught
  it. Replace with a real featured case study once the data lands, or hide the rail
  until then. Quick fix, high visibility.
- **Old WordPress site cleanup before cutover** — the current live
  `scalingsocials.com` still exposes placeholder/contradictory details on some
  pages (e.g. `contact@mysite.com`, `123-456-7890` on the old performance-marketing
  page). Those are on the *old* WP build, not this repo, but the migration must 301
  every indexed old URL to its new equivalent and ensure no stale/placeholder page
  survives (ties to the redirect map in D).
- **Deploy target** is now decided (Cloudflare Pages, §A / `DEPLOY-CLOUDFLARE.md`);
  the remaining blockers are the project setup + Supabase/Turnstile/Resend wiring.
- Homepage HTML ~109 KB and styleguide ~153 KB exceed the 100 KB HTML *warn* (not a
  fail). Homepage can be trimmed (marquee duplication, inline SVGs) if desired.
- `astro check` reports **1 hint** (non-blocking) — worth a look.
- Replace the picsum poster placeholders on the creative wall with real posters when
  the compressed videos land.
