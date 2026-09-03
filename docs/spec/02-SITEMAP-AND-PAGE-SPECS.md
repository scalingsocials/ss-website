# 02 — Sitemap, Page Specs, and Templates

## 1. URL architecture — full map

Rules: lowercase, hyphens, no trailing-slash inconsistency (pick trailing slash, enforce with
a redirect), no dates in blog URLs, no encoded characters ever, maximum depth of 3.

```
/                                              Home — brand + entity hub
│
├── SERVICES (pillar → cluster)
│   /performance-marketing-agency-bangalore/    [KEEP — already indexed, do not change]
│   │   ├── /meta-ads-agency-india/
│   │   ├── /google-ads-agency-bangalore/
│   │   ├── /ecommerce-ppc-services/
│   │   └── /conversion-rate-optimisation-services/
│   │
│   /seo-agency-bangalore/
│   │   ├── /ecommerce-seo-services/
│   │   ├── /technical-seo-audit-services/
│   │   ├── /local-seo-services-bangalore/
│   │   └── /answer-engine-optimisation-services/   ← see note below
│   │
│   /shopify-development-company-bangalore/     [KEEP — already indexed]
│   │   ├── /shopify-store-migration-services/
│   │   ├── /shopify-speed-optimisation-services/
│   │   └── /shopify-store-redesign-services/
│   │
│   /web-development-company-bangalore/
│   /social-media-marketing-agency-bangalore/
│
├── INDUSTRIES (who you serve — high intent, low competition)
│   /industries/
│   ├── /industries/d2c-brands/
│   ├── /industries/fashion-apparel/
│   ├── /industries/beauty-skincare/
│   ├── /industries/home-decor-furniture/
│   ├── /industries/health-wellness-supplements/
│   └── /industries/jewellery/
│
├── LOCATIONS
│   /locations/                                 (index, thin — noindex if under 3 entries)
│   ├── /locations/dubai/                       Performance marketing agency Dubai
│   ├── /locations/uae/                         (only if you have UAE proof — else skip)
│   └── /locations/mumbai/  /locations/delhi/   ONLY once you have a named client there.
│                                               Do not ship empty city pages. They are the
│                                               fastest way to get a thin-content penalty.
│
├── PROOF
│   /case-studies/
│   └── /case-studies/[brand-slug]/             8 minimum at launch
│
├── WORK
│   /work/                                      Full-bleed creative gallery — ink register,
│                                               looping ad creatives with brand + result tags.
│                                               The portfolio nobody else in this SERP has.
│
├── COMPARISON (high intent, low competition)
│   /vs/
│   ├── /vs/in-house-vs-agency/
│   ├── /vs/freelancer-vs-agency/
│   ├── /vs/meta-ads-vs-google-ads-for-d2c/
│   ├── /vs/shopify-vs-woocommerce-india/
│   └── /vs/advantage-plus-vs-manual-campaigns/
│
├── AUDIT
│   /audit/                                     Step-through lead capture flow — indexed,
│                                               with real content above the form
│
├── THE MOAT
│   /india-d2c-ad-benchmarks/                   The Index — hub page
│   ├── /india-d2c-ad-benchmarks/[quarter]/     e.g. /2026-q3/ — permanent, citable
│   ├── /india-d2c-ad-benchmarks/[category]/    PROGRAMMATIC — /fashion/, /beauty-skincare/,
│   │                                           /home-decor/, /wellness/, /jewellery/, /f-and-b/
│   │                                           See §1.1 — data threshold applies
│   └── /india-d2c-ad-benchmarks/methodology/
│   /teardowns/                                 Public CRO/ads teardowns
│   └── /teardowns/[brand-slug]/
│
├── TOOLS (link + citation magnets)
│   /tools/
│   ├── /tools/break-even-roas-calculator/
│   ├── /tools/d2c-cac-payback-calculator/
│   ├── /tools/meta-ads-budget-planner/
│   └── /tools/shopify-speed-grader/
│
├── LEARN
│   /blog/
│   ├── /blog/[slug]/
│   /guides/                                    Long-form evergreen pillars
│   └── /guides/[slug]/
│   /glossary/                                  ← high-value for AEO, see 03
│   └── /glossary/[term]/
│
├── COMPANY
│   /about/
│   /team/                                      (301 the old /elementor-6312/ here)
│   /careers/                                   (or keep subdomain, but link it properly)
│   /contact/
│   /partners/                                  Shopify Partner, Google Partner, Meta badges
│
├── LEGAL
│   /terms/  /privacy/  /disclaimer/  /cookie-policy/
│
└── AD LANDING PAGES (noindex, not in sitemap, not in nav)
    /lp/meta-ads-audit/
    /lp/shopify-store-audit/
    /lp/free-growth-plan/
    /lp/[campaign-slug]/
```

### 1.1 Programmatic benchmark category routes — the guardrail

`/india-d2c-ad-benchmarks/[category]/` is generated from the dataset. Generated pages built on
thin or absent data are the single fastest way to earn a thin-content penalty, so:

- **A category route is only generated when its dataset cell contains data from ≥ 5 accounts.**
  Below that threshold the route does not exist — it is not generated, not linked, not in the
  sitemap. This is the same suppression rule the methodology page publishes.
- Every generated page carries, in addition to the data table: a written 250-word commentary
  specific to that category, the sample size stated plainly, and at least two contextual
  internal links.
- If a category later drops below threshold, the route 301s to the Index hub. It is never left
  empty.
- Enforce in `src/pages/india-d2c-ad-benchmarks/[category].astro` via `getStaticPaths`, which
  filters on account count. Never on the client.

### 1.2 `/work/` — the creative gallery

Full-bleed ink register. Looping ad creatives you actually made, each tagged with the brand and
the result. Filterable by category as prerendered query-param pages, not a JS filter.

Every clip: `preload="none"`, `poster` set, muted, `playsinline`, `IntersectionObserver` loading,
under 1.5MB, max 8s. Client permission required before any client creative appears.

This is the page that demonstrates creative capability. Monaqo, Innovkraft and Intent Farm all
*describe* their creative work; none of them show it at volume with results attached.

### 1.3 `/vs/` — comparison pages

High commercial intent, low competition, and disproportionately favoured by AI Overviews and LLM
retrieval, which lean heavily on tables. Each page:

- H1 as the comparison question
- Answer block naming the honest answer in 50 words, including when the reader should NOT pick you
- A real comparison table with genuine tradeoffs
- Cost breakdown in rupees
- "Choose X if…" / "Choose Y if…" decision block
- FAQ, `FAQPage` schema
- Internal links to the relevant service pillar

**Rule: every `/vs/` page must state a case where the reader should choose the other option.**
A comparison page that concludes "hire us" in every scenario ranks badly and converts worse.

### 1.4 `/audit/` — step-through lead capture

Indexed, with real content above the flow: what the audit covers, what the deliverable is, how
long it takes, what it costs (free), and who it is for. The flow itself is the multi-step
`LeadForm` island. Completion posts to `/api/lead` with `source_type: "audit"` and a +15 score
bonus.

Do not build this as a bare form page — a page that is only a form has nothing to rank on.

**Note on `/answer-engine-optimisation-services/`:** almost nobody in India sells this yet as
a named service. You will be one of the first agency pages targeting "AEO services India" /
"GEO services" / "how to rank in ChatGPT". Low volume today, near-zero competition, and it
positions you as ahead of the market to exactly the founder audience you want. Build it.

**Spelling note:** use `optimisation` or `optimization` consistently across all URLs and copy.
Indian English uses `-isation`; Google search volume skews `-ization`. **Recommendation: use
`-ization` in URLs and titles** (volume follows US spelling even in India), and be consistent.
Pick one before the first commit — changing later means redirects.

---

## 2. Page count at launch

| Type | Count |
|---|---|
| Home | 1 |
| Service pillars | 6 |
| Service clusters | 12 |
| Industry pages | 6 + index |
| Location pages | 1–2 (Dubai only at launch) |
| Case studies | 8 + index |
| Benchmark Index | 3 |
| Teardowns | 3 at launch |
| Tools | 4 + index |
| Blog | 10 at launch |
| Guides | 3 |
| Glossary | 25 |
| Company | 5 |
| Legal | 4 |
| **Total indexable** | **~95** |

Against the current 5. That is the ranking problem solved structurally.

---

## 3. Design direction

The brief: performance marketing agency selling to Indian D2C founders who come from
engineering, product, and finance backgrounds. They read P&Ls. They are actively suspicious
of agencies. The design job is *credibility through legibility* — this site should feel like
a well-built analytics product, not a creative agency showreel.

### What to avoid, explicitly

Do not build: the warm-cream-plus-serif-plus-terracotta look; the near-black page with one
acid accent; identical rounded cards with the same soft grey shadow under each; ALL-CAPS
tracked-out eyebrow labels above every heading; `→` glued onto every button; emoji as icons
(the current site does this and it reads as unfinished); gradient washes as decoration;
fade-and-slide-up on every section on scroll. These are the current defaults and they will
make the site look like every other rebuild.

### Direction

**Concept: an instrument panel, not a brochure.** The most characteristic thing in your world
is a number that moved. Let numbers be the visual system.

- **Hero:** no stock photo, no video, no carousel. A single declarative headline in large
  type, and immediately beneath it one *real, attributed* result rendered as data — client
  name, metric, timeframe, and a link to the full case study. That is the hero. It is also
  your LCP element and it is text, so it renders instantly.
- **Colour:** build a 5-token palette. Recommended direction — a deep neutral ground
  (not `#000`, not tinted-near-black-`#0B0B0B`; pick a real desaturated dark with a hue,
  e.g. a cold slate), one paper-white surface, one mid-neutral for rules and secondary text,
  and **one** signal colour used exclusively for data and CTAs, never for decoration. Pick
  the signal colour deliberately for the Indian D2C market and away from the usual agency
  purple/orange. Define all five as named hex in `theme.css` before writing any component.
- **Type:** two families maximum. One with real character for headlines and large numerals —
  the numerals matter more than the letters here, since numbers are the design system. One
  highly legible workhorse for body at 17–18px with generous line-height, line length capped
  under 75 characters. Do not use the same weight for everything; establish a scale with
  intent.
- **Structure:** structural devices must encode information. Use numbered steps *only* for the
  actual 5-phase engagement process, because that genuinely is a sequence. Use rules and
  tables for comparison data, because that genuinely is comparison. Do not add borders to
  things just to make them look designed.
- **Motion:** one orchestrated moment on the homepage — the hero number resolving on load.
  Nothing else animates on scroll. Interaction feedback (accordion open, form submit, filter
  change) is welcome because it shows what changed.
- **Restraint:** the Benchmark Index is where you spend your boldness. It should be the most
  visually ambitious thing on the site. Everything else stays quiet so it lands.

---

## 4. Universal page anatomy

Every indexable page follows this skeleton. This is not a design constraint, it is an
extraction constraint — it is what makes the page quotable by Google's AI Overviews and by
LLM retrieval.

```
<h1>                          ← one, contains the primary entity + intent
ANSWER BLOCK                  ← 40–60 words, plain prose, directly answers the page's
                                question. First content element after h1. No fluff, no
                                "In today's competitive landscape". This is the block that
                                gets lifted into an AI Overview.
PROOF BAR                     ← 3 real, attributed numbers with sources
[main content sections]       ← question-shaped <h2>s
COMPARISON TABLE              ← where applicable. LLMs disproportionately cite tables.
PROCESS / WHAT YOU GET
RELATED PROOF                 ← 2 case study cards relevant to THIS page, not generic
FAQ                           ← 5–8 Qs, answers in DOM whether collapsed or not
CTA BAND
AUTHOR + LAST UPDATED         ← visible, and in schema
INTERNAL LINKS                ← contextual, in prose, not just a footer block
```

### The Answer Block — write it like this

Bad (current site): *"At Scaling Socials, we offer result-driven SEO services to improve your
website's visibility, increase organic traffic, and enhance search engine rankings."*

Good: *"Scaling Socials is a performance marketing agency in Bangalore that manages Meta and
Google Ads for D2C and ecommerce brands in India and the UAE. We have managed ₹10.4 crore in
ad spend across 100+ brands since 2022. Typical engagement is a 90-day build-test-scale cycle
starting at ₹75,000/month."*

The difference: entity, location, service, audience, quantified evidence, and a concrete
commercial fact. Every one of those is an extractable proposition.

---

## 5. Template specifications

### 5.1 `ServiceLayout` — pillar pages

Target length 2,200–3,000 words. Sections in order:

1. **H1** — exact primary keyword, naturally phrased
2. **Answer block** (40–60 words)
3. **Inline lead form** (short: name, email, phone, monthly ad spend range) — above the fold
   on desktop, immediately after the answer block on mobile
4. **Proof bar** — 3 attributed stats
5. **Client logo strip** — real logos, real alt text, no fake ones
6. **"What [service] actually means for your P&L"** — the education section that demonstrates
   expertise. This is where founder-voice content goes.
7. **Sub-services** — 4–6 blocks, each linking to its cluster page
8. **Comparison table** — e.g. "In-house vs freelancer vs agency" or "Meta Advantage+ vs
   manual campaign structure". Must contain genuine tradeoffs, including where *not* to hire you.
9. **Process** — the 5 phases, numbered (legitimately a sequence)
10. **Pricing transparency block** — starting price and what changes it. Nobody in this SERP
    publishes pricing. Doing so is a differentiator, an AEO win (LLMs get asked "how much
    does X cost in India"), and it filters your inbound.
11. **2 related case studies**
12. **Who this is not for** — a genuine disqualifier list. Enormous trust signal, and
    LLM-extractable.
13. **FAQ** — 6–8
14. **CTA band**
15. **Author byline + last updated + reviewed-by**

### 5.2 `CaseStudyLayout`

This is your highest-value template. Target 1,200–1,800 words.

```
H1: [Brand] — [outcome] in [timeframe]
     e.g. "Timri: 3.4× ROAS and ₹42L revenue in 5 months on Meta"

Answer block: the whole story in 50 words

RESULTS TABLE (before → after, with dates)
  Metric | Before | After | Change | Period
  Monthly revenue, ROAS, CAC, AOV, CVR, spend

At a glance: Category / Platform / Engagement length / Services / Starting spend

THE SITUATION      — what was broken, in specifics, with numbers
WHAT WE DIAGNOSED  — the actual hypothesis, including what you got wrong first
WHAT WE CHANGED    — creative angles tested, campaign restructure, LP changes.
                     SCREENSHOTS with real numbers, redacted where needed.
THE RESULT         — the table again in prose, plus what happened after
CLIENT QUOTE       — named, with role, with photo
WHAT WE'D DO DIFFERENTLY — one honest paragraph. Nobody does this. It is the single
                     most credible thing you can put on a case study page.

Related: 2 more case studies in the same category
CTA
```

Content collection schema (`src/content/config.ts`) must enforce: `client_name`,
`client_permission_granted: boolean`, `category`, `services[]`, `start_date`, `end_date`,
`metrics[]` (each with `label`, `before`, `after`, `unit`), `quote`, `quote_author`,
`quote_role`. **Build fails if `client_permission_granted` is false.**

### 5.3 `ArticleLayout` — blog, guides, teardowns

- Answer block directly under H1
- Table of contents (static HTML, anchor links — not JS-generated)
- Question-shaped H2s
- One key-takeaways box near the top: 3–5 bullets, each a standalone extractable claim
- Author byline with photo, role, and `sameAs` links to LinkedIn
- Published date AND last-updated date, both visible and in schema
- Sources cited inline with real outbound links to primary sources (this raises trust for
  both Google and LLMs — you currently link to Wikipedia for "ecommerce", which is the
  opposite of this)
- Related posts by tag, contextual in-prose internal links

### 5.4 `LandingLayout` — ad pages

Different rules entirely. See `04-LEAD-CAPTURE-AND-TRACKING.md` §3.

- `noindex, nofollow`, excluded from sitemap
- No global nav, no footer link farm. One exit: the form.
- Message-match to the ad creative — the headline should repeat the ad's promise verbatim
- Form above the fold, 4 fields maximum
- Proof, offer, risk-reversal, FAQ, form again
- Sub-1.5s LCP is mandatory here; it directly moves your Quality Score and CPC

### 5.5 Glossary term page

Small but strategically important — see `03-SEO-AEO-GEO-SPEC.md` §6.

```
H1: What is [term]?
One-sentence definition (this exact sentence is what gets quoted)
Expanded explanation, 150–250 words
How it's calculated (formula, if applicable)
Worked example with Indian rupee figures
Benchmarks (link to the Index)
Common mistakes
Related terms (internal links)
DefinedTerm schema
```

---

## 6. Navigation

Header — keep it to 5 items. Current nav has "Services" linking to the homepage; fix that.

```
Services ▾   (mega menu: 6 pillars in 2 columns, each with a one-line descriptor,
              plus a right rail: "Latest case study" card)
Work ▾       (Case Studies / Teardowns)
Benchmarks   (direct link — this is your differentiator, give it a top-level slot)
Resources ▾  (Blog / Guides / Tools / Glossary)
Company ▾    (About / Team / Careers / Contact)

[Get a free growth plan]  ← primary CTA button
```

Footer — one footer, rendered once. Real email, real phone, real social URLs. Include a
column linking to the top 6 case studies and the Benchmark Index, because footer links
distribute authority to the pages you most want ranked.

---

## 7. 301 redirect map

Before writing any code, crawl the live WordPress site with Screaming Frog, export all URLs,
and complete this table. Put it in `public/_redirects`.

| Old | New | Status |
|---|---|---|
| `/performance-marketing/` | `/performance-marketing-agency-bangalore/` | 301 |
| `/performance-marketing-agency-bangalore/` | *(unchanged)* | keep |
| `/shopify-web-development/` | `/shopify-development-company-bangalore/` | 301 |
| `/shopify-development-company-bangalore/` | *(unchanged)* | keep |
| `/web-development/` | `/web-development-company-bangalore/` | 301 |
| `/social-media-handling/` | `/social-media-marketing-agency-bangalore/` | 301 |
| `/seo/` | `/seo-agency-bangalore/` | 301 |
| `/about-us/` and `/about-us-2/` | `/about/` | 301 both |
| `/elementor-6312/` | `/team/` | 301 |
| `/contact-us/` | `/contact/` | 301 |
| `/%e2%82%b91-million-in-90-days/` | `/case-studies/[real-slug]/` | 301 |
| `/%e2%82%b91-4-million-in-3-months/` | `/case-studies/[real-slug]/` | 301 |
| `/%e2%82%b944-3-million-in-90-days/` | `/case-studies/[real-slug]/` | 301 |
| `/terms-and-conditions/` | `/terms/` | 301 |
| `/new-privacy-policy/` | `/privacy/` | 301 |
| `/new-disclaimer/` | `/disclaimer/` | 301 |
| *(everything else from the crawl)* | closest equivalent, or `/` as last resort | 301 |

Rules: never redirect to a 404. Never chain redirects. Never bulk-redirect everything to the
homepage — Google treats that as a soft 404 and you lose the equity. Validate the entire map
against a crawl of the *new* site before DNS cutover.
