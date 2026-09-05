# Pending work — Scaling Socials website

Status as of 2026-09-05. The site builds green: `check`, `build`, `check:perf`
(per-page tiers), `check:schema`, and `check:links` (0 broken, 0 orphans) all pass.
**47 pages** are live in the repo (seven anonymised case studies + an HTML sitemap added 2026-09-05). This document lists what remains, split by
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

## 🟢 A. Lead pipeline — LIVE on the preview (stores + alerts + spam-protected)

The full pipeline is built, deployed to Cloudflare Pages and **verified end-to-end
on the preview** (real form submit → Turnstile passed → stored → branded alert
email delivered). Only analytics and the production-domain cutover remain.
Deploy runbook: **[`DEPLOY-CLOUDFLARE.md`](./DEPLOY-CLOUDFLARE.md)**.

1. ✅ **Cloudflare Pages project** (2026-09-04) — repo connected, build
   `npm run build` → `dist`, `nodejs_compat` + `NODE_VERSION` set. Live at
   `ss-website-bzx.pages.dev`. A real **404 page** and the **`/api/lead/`
   trailing-slash** bug were found and fixed during deploy testing.
2. ✅ **Supabase** (2026-09-04) — `/api/lead` upserts into a dedicated
   `public.website_leads` inbox (Scaling Socials CRM project `jpytofvaofsztvuwxnta`,
   RLS on, service-role only), isolated from the live CRM `leads` pipeline.
3. ✅ **Turnstile** (2026-09-04) — widget on the form + server-side siteverify;
   secret set and confirmed blocking automated submissions.
4. ✅ **Resend** (2026-09-04) — branded HTML alert email with a Hot/Warm/Cool
   score (deal-size aware), human labels and reply-to the lead, from the verified
   `scalingsocials.com` domain; confirmed delivered to `support@scalingsocials.com`.
5. ✅ **Promote → CRM** — handled by the owner directly in the CRM.
6. 🔲 **Analytics** IDs — GA4, Meta CAPI (server-side), Microsoft Clarity (04).
   The one open item in this section.
7. 🔲 **Production cutover** — attach `scalingsocials.com` + DNS + `_redirects`
   when ready (see §D).

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

- ✅ **`public/_redirects`** (2026-09-05) — generated from `docs/spec/redirect-map.csv`;
  every indexed old WordPress URL resolves to a live 200. ₹-slugs emitted both
  percent-encoded and raw.
- **Non-www + canonical enforcement** at the edge (Cloudflare/Netlify rule).
- ✅ **HTML sitemap** at `/sitemap/` (2026-09-05) — built from the same route data
  as the pages, linked from the footer, so it cannot drift.
- **RSS `/rss.xml` + JSON `/feed.json`** — after blog content exists.
- **XML sitemap** — generated by `@astrojs/sitemap`; add `blog`, `guides`, `glossary`
  to the exclude filter while they are noindex, and confirm it lists the real pages.
- **`llms.txt` / `llms-full.txt`** — baseline generated; enrich from content collections.
- **Lighthouse CI** — `lighthouserc.json` exists; add an `lh` step to the GH Actions
  workflow (needs Chrome in CI).
- ⚠️ **CSP regression, found and fixed 2026-09-05.** The first CSP shipped broke
  client-side navigation: Astro emits a *per-page* policy hashing only that
  page's inline blocks, but a `<meta>` CSP is honoured only while the document
  is first parsed, and `<ClientRouter />` swaps the DOM without reloading. So the
  landing page's policy governed the whole session and every other page had its
  inline `<style>` refused — pages rendered on a hard load and lost their
  component styles when reached by a link (the homepage logo marquee, visibly).
  Fixed by `scripts/unify-csp.mjs`, which rewrites every page to one shared
  policy (the union of all hashes) after the build. `npm run check:csp` now
  fails the build if the policies ever diverge again, if any page's inline block
  is not covered by its own policy, or if anyone adds `unsafe-inline`.
  **Lesson: full-page-load testing is not sufficient on a site with view
  transitions — navigation must be exercised.**

- ✅ **CSP** (2026-09-05) — a strict, hash-based policy with **no `unsafe-inline`
  and no `unsafe-eval`**, emitted per page via Astro's native CSP (SHA-256 hashes
  for every inline script and style). Getting there meant removing all 81 inline
  `style=""` attributes from components and islands, since hashes cannot cover
  style attributes. `frame-ancestors` is a real header in `_headers` (it is
  ignored inside a meta CSP). Only external origin allowed is Turnstile.
  Verified in Chromium across 13 pages: zero violations.
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
- ✅ **Security headers** (2026-09-05) — HSTS (preload), `X-Frame-Options: DENY`,
  `X-Content-Type-Options`, `Referrer-Policy`, a widened `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`, plus `no-store` + `noindex` on `/api/*`.
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
- ~~Link client logos to their case study~~ — **DROPPED.** Directly contradicts the
  owner's anonymity directive: four logos were removed from the marquee precisely
  because they identified case-study accounts by cross-reference.
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

- ✅ **Visible `TODO` in the nav** (2026-09-05) — replaced with evergreen
  case-study copy. Now that seven case studies exist, this rail could feature a
  real one (anonymised by niche).
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
- ✅ `astro check` is now clean: **0 errors, 0 warnings, 0 hints**.
- Replace the picsum poster placeholders on the creative wall with real posters when
  the compressed videos land.
