# 01 — Stack and Architecture

## 1. The stack

| Layer | Choice | Why this and not the obvious alternative |
|---|---|---|
| Framework | **Astro 5**, TypeScript strict | Ships zero JS by default and outputs static HTML. Next.js App Router ships a React runtime to every page whether you need it or not; for a site that is 95% content, that is pure cost. Astro still lets you drop React components in as islands where you genuinely need state. |
| Styling | **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`) | v4 compiles via Lightning CSS, is dramatically faster, and lets the design tokens live in one `@theme` block that both Tailwind and hand-written CSS read from. |
| Interactivity | **React 19 — complex client-side tools ONLY** | Benchmark Explorer, ROI/ROAS calculators, multi-step lead forms. Nothing else. |
| Light interactivity | **Native HTML + vanilla JS** | Mobile menu, FAQ accordions, tabs, filters, video intersection loading. See §2.1. |
| Content | **Astro Content Collections** (MDX) + **Keystatic** admin UI | Content lives as MDX in git — versioned, reviewable, diffable, and present in the HTML at build time. Keystatic gives your non-technical writers a real editor at `/keystatic` that commits to git. No headless CMS bill, no API latency, no client-side fetch. Sanity is the upgrade path if you later need multi-locale or 10+ editors. |
| Hosting | **Cloudflare Pages** + Workers | Cloudflare has POPs in Mumbai, Bangalore, Chennai, Delhi, Hyderabad, Kolkata, and Dubai. Your entire audience is India + UAE. Vercel's India edge coverage is thinner and its bandwidth pricing is worse. |
| Forms backend | **Astro API route → Cloudflare Worker → Supabase** | You already run a Supabase-backed CRM with a lead-capture module and WhatsApp routing. The website is just another writer into that pipeline. |
| Images | `astro:assets` + **Cloudflare Images** | AVIF/WebP with automatic `srcset`, explicit dimensions, and no CLS. |
| Blog search | **Pagefind** | Static index built at compile time, no search backend, works with JS off for the fallback. |
| Analytics | GA4 + Meta CAPI (server-side) + Microsoft Clarity | See `04-LEAD-CAPTURE-AND-TRACKING.md`. |
| Email | Resend | Transactional only — form receipts, internal alerts. |

### Versions to pin

```
astro            ^5.x
@astrojs/react   ^4.x
@astrojs/mdx     ^4.x
@astrojs/sitemap ^3.x
@astrojs/cloudflare ^12.x
tailwindcss      ^4.x
react / react-dom ^19.x
@keystatic/astro latest
astro-seo-schema or hand-rolled JSON-LD (prefer hand-rolled — see 03)
pagefind         ^1.x
zod              (bundled with Astro, use for content schemas and form validation)
```

### 2.1 The React boundary — hard rule

React 19 is reserved for components with genuine client-side state complexity. Everything else
uses native HTML plus a few lines of vanilla JS. This is what keeps the 60 KB budget reachable
without argument.

**React is permitted for, and only for:**
- `BenchmarkExplorer` — multi-dimensional filtering over a dataset
- `RoasCalculator`, `CacPaybackCalculator`, `BudgetPlanner`, `SpeedGrader`
- `LeadForm` — multi-step with validation state
- `BlogSearch` — Pagefind UI

**React is forbidden for, and these use native HTML + vanilla JS:**
- FAQ accordions → `<details>` / `<summary>`. Zero JS. Answers stay in the DOM whether open or
  closed, which is what makes them extractable.
- Mobile navigation → `<dialog>` or a checkbox toggle plus ~15 lines of vanilla JS
- Tabs → anchor links to prerendered views, or `<details>` groups
- Case study and blog filtering → prerendered query-param pages, so every filtered view is
  crawlable
- Video intersection loading → `IntersectionObserver`, ~10 lines
- Counters and reveals → vanilla, animating from the real value already in the HTML
- Copy-to-clipboard, smooth scroll, header state → vanilla

If a proposed React island is not on the permitted list, the answer is no. Adding React to a
content page for a disclosure widget costs ~45 KB to replace a browser primitive.

**Vanilla JS is written as small ES modules in `src/scripts/`, imported per-page, never global.**

---

## 2. Rendering strategy

**Default: `output: 'static'` with a Cloudflare adapter in hybrid mode.**

- Every marketing page, service page, case study, blog post, industry page, and location
  page is **prerendered at build time**. No exceptions.
- Only these routes are server-rendered (`export const prerender = false`):
  - `/api/lead` — form submission handler
  - `/api/subscribe` — newsletter
  - `/api/benchmark-data` — only if the Index needs live filtering at scale; otherwise
    prerender the whole dataset as JSON and filter client-side
- `/keystatic` runs as a server route, protected, `noindex`.

**Build triggers:** push to `main`, plus a Cloudflare deploy hook fired by Keystatic on
content publish.

---

## 3. Repo structure

```
scalingsocials/
├── CLAUDE.md                       # persistent instructions for Claude Code
├── docs/spec/                      # this pack — Claude Code reads from here
├── astro.config.mjs
├── keystatic.config.ts
├── public/
│   ├── robots.txt                  # hand-written, see 03
│   ├── llms.txt                    # see 03
│   ├── llms-full.txt
│   ├── _headers                    # Cloudflare cache + security headers
│   ├── _redirects                  # 301 map from old WordPress URLs
│   └── fonts/                      # self-hosted woff2 only, subset
├── src/
│   ├── content/
│   │   ├── config.ts               # zod schemas for every collection
│   │   ├── services/               # MDX, one per service page
│   │   ├── case-studies/
│   │   ├── blog/
│   │   ├── industries/
│   │   ├── locations/
│   │   ├── team/
│   │   ├── faqs/                   # reusable FAQ items, referenced by slug
│   │   └── benchmarks/             # quarterly dataset JSON + commentary MDX
│   ├── components/
│   │   ├── primitives/             # Section, Container, Prose, Heading, Button
│   │   ├── blocks/                 # AnswerBlock, StatBlock, ProofBar, FaqAccordion,
│   │   │                           # ComparisonTable, ProcessSteps, CaseStudyCard,
│   │   │                           # AuthorByline, LastUpdated, CtaBand
│   │   ├── islands/                # React: LeadForm, RoasCalculator, BenchmarkExplorer,
│   │   │                           # MobileNav, BlogSearch
│   │   └── seo/                    # Meta, SchemaGraph, Breadcrumbs
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ServiceLayout.astro
│   │   ├── CaseStudyLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── LandingLayout.astro     # ad landing pages — no nav, no footer links
│   ├── lib/
│   │   ├── schema/                 # entity graph builders — see 03
│   │   ├── seo.ts                  # title/description/canonical helpers
│   │   ├── analytics.ts
│   │   └── validation.ts           # zod form schemas, shared client+server
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [...slug].astro         # or explicit routes — prefer explicit for clarity
│   │   ├── api/lead.ts
│   │   └── ...
│   └── styles/
│       ├── theme.css               # @theme tokens
│       └── global.css
└── scripts/
    ├── check-perf-budget.mjs       # fails CI if JS/HTML exceed budget
    ├── validate-schema.mjs         # fails CI if JSON-LD invalid
    └── build-llms-txt.mjs          # generates llms.txt from content collections
```

---

## 4. Performance budget — enforced in CI

These are hard gates. `scripts/check-perf-budget.mjs` fails the build if exceeded.

| Metric | Budget | Notes |
|---|---|---|
| LCP (mobile, 4G throttled) | **< 1.8s** | Google's "good" is 2.5s. Beating the SERP is the point. |
| INP | **< 150ms** | |
| CLS | **< 0.05** | Every image and embed gets explicit dimensions. |
| TTFB | **< 200ms** from India | Static + Cloudflare edge makes this trivial. |
| JS shipped, content page | **< 60 KB** gzipped | |
| JS shipped, tool page | **< 140 KB** gzipped | |
| HTML document | **< 100 KB** | |
| CSS | **< 30 KB** gzipped | |
| Total requests, first load | **< 25** | |
| Lighthouse mobile | **100 / 100 / 100 / 100** | Perf, A11y, Best Practices, SEO. All four. |

### How to actually hit this

- **Fonts:** two families maximum, self-hosted, subset to Latin + the specific glyphs you
  need (`₹` must be included — check the subset), `woff2` only, `font-display: swap`,
  preloaded in `<head>`. No Google Fonts CDN — it is an extra connection and a GDPR liability.
- **LCP element:** always a text headline or an `<img>` with `loading="eager"`,
  `fetchpriority="high"`, and `decoding="sync"`. Never a background image. Never behind a
  carousel. Never lazy-loaded.
- **Below-fold images:** `loading="lazy"`, native only. No JS lazy-load library. This is the
  single biggest thing the current site gets wrong.
- **No carousels above the fold.** They are the reason the current homepage has an
  undiscoverable LCP.
- **Third-party scripts:** GTM loaded with `Partytown` or deferred to `requestIdleCallback`.
  Meta Pixel client-side is optional once CAPI is running server-side — prefer CAPI-only.
  Chat widget (if any) loads on click of a static button, not on page load.
- **Counters/stats:** render the final number in the HTML. If you want a count-up animation,
  animate *from* the real number being present, and respect `prefers-reduced-motion`. Never
  render `0` and let JS fix it — that is what the current site does and it means Google and
  every LLM sees zeros.

---

## 5. Design system

Follow the design direction in `02-SITEMAP-AND-PAGE-SPECS.md` §Design Direction. Architecture
rules here:

- All tokens in `src/styles/theme.css` under Tailwind v4's `@theme`. No hardcoded hex
  anywhere in components.
- Type scale is a fixed ratio scale, defined once. Use `clamp()` for fluid sizing so there
  are no layout jumps at breakpoints.
- Spacing on an 8px base with a named scale. No arbitrary `mt-[37px]`.
- One border-radius token for cards, one for buttons, one for inputs. Not one radius for
  everything.
- Motion: define `--ease-out` and `--duration-fast/base`. Wrap every animation in
  `@media (prefers-reduced-motion: no-preference)`.

---

## 6. Accessibility floor

Non-optional, and it also feeds the SEO score.

- Semantic landmarks: one `<main>`, `<nav aria-label>`, `<header>`, `<footer>`.
- Exactly one `<h1>` per page. Heading levels never skip.
- Visible focus rings — do not remove the outline, restyle it.
- Colour contrast 4.5:1 body, 3:1 large text. Verify the accent against both backgrounds.
- Every form input has a `<label>`, every error is announced via `aria-live`.
- Skip-to-content link that actually works.
- All interactive elements reachable and operable by keyboard. Accordions use
  `<details>/<summary>` or proper ARIA — FAQ accordions must have their answers present in
  the DOM whether open or closed, because that is what gets extracted.

---

## 7. CI pipeline

On every PR to `main`:

1. `astro check` — TypeScript + template type errors
2. `astro build`
3. `node scripts/check-perf-budget.mjs` — fails on budget breach
4. `node scripts/validate-schema.mjs` — parses every emitted JSON-LD block, validates
   required fields, fails on error
5. Lighthouse CI against 5 representative URLs (home, service, case study, blog post, tool),
   mobile preset, assert all four categories ≥ 98
6. Broken internal link check
7. Deploy preview

On merge to `main`: production deploy + sitemap ping.

---

## 8. Security and hygiene

`public/_headers`:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: (start report-only, tighten before launch)

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

- Form endpoint: Cloudflare Turnstile (invisible), rate limited per IP, honeypot field,
  server-side zod validation. Never trust the client.
- Supabase writes go through a Worker holding a service-role key. **The service key never
  reaches the browser.**
- No secrets in the repo. Cloudflare env vars only.
