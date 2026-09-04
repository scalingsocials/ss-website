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

1. **Deploy target decision.** The Astro adapter is `@astrojs/cloudflare`, but the
   preview is on **Netlify**. Server routes like `/api/lead` need a server runtime:
   - Option 1 (recommended, matches the spec): deploy to **Cloudflare Pages**.
   - Option 2: switch to `@astrojs/netlify` and deploy on Netlify.
   Until one is chosen, form submissions and abandoned-lead beacons are validated
   but **not stored**.
2. **Supabase** — `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` in the deploy env, and the
   CRM table/columns for leads (`lead_id`, `status` = partial|abandoned|complete,
   `source`, contact fields, `answers`, `page`). Wire the upsert in `/api/lead`
   (marked `TODO` there). Add the `+15` score bonus for `source: "audit"`.
3. **Turnstile** (invisible captcha) site + secret keys, and add the widget to the form.
4. **Resend** API key for form receipt + internal alert emails.
5. **Analytics** IDs — GA4, Meta CAPI (server-side), Microsoft Clarity (04).

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
- **robots.txt** — present; verify it matches 03 §5 (AI crawlers allowed).

## ⚪ E. Known cleanups / notes

- **Deploy mismatch** (see A) is the single most important open item.
- Homepage HTML ~109 KB and styleguide ~153 KB exceed the 100 KB HTML *warn* (not a
  fail). Homepage can be trimmed (marquee duplication, inline SVGs) if desired.
- `astro check` reports **1 hint** (non-blocking) — worth a look.
- Replace the picsum poster placeholders on the creative wall with real posters when
  the compressed videos land.
