# 06 — Claude Code: Setup and Prompt Sequence

## Part 1 — `CLAUDE.md`

Create this file at the repo root before your first prompt. It is what keeps Claude Code
consistent across sessions, and it is the highest-leverage file in the repo.

````markdown
# Scaling Socials — Website

## What this is
Marketing site for Scaling Socials, a performance marketing and ecommerce development agency
in Bengaluru, India, serving D2C brands in India and the UAE.

## Read before doing anything
The full specification lives in `docs/spec/`. Read the relevant file before implementing:
- `01-STACK-AND-ARCHITECTURE.md` — stack, repo layout, perf budget, CI gates
- `02-SITEMAP-AND-PAGE-SPECS.md` — URLs, templates, page anatomy, design direction
- `03-SEO-AEO-GEO-SPEC.md` — schema graph, extraction rules, llms.txt, robots.txt
- `04-LEAD-CAPTURE-AND-TRACKING.md` — forms, Worker, Supabase, analytics
- `05-CONTENT-REQUIREMENTS.md` — what content exists and what is pending

If a request conflicts with the spec, say so and ask. Do not silently deviate.

## Stack
Astro 5 (static output, Cloudflare adapter) · TypeScript strict · Tailwind CSS v4 (CSS-first
`@theme`, no config file) · React 19 for islands only · MDX content collections · Keystatic
admin · Cloudflare Pages + Workers · Supabase for leads · Pagefind for search.

## Hard rules
1. Every page must render fully with JavaScript disabled. No client-side content fetching, ever.
2. React islands only for: forms, calculators, benchmark filters, mobile nav, blog search.
   Everything else is `.astro`. Never add an island for something a `<details>` element can do.
3. JS budget: <60 KB gzipped on content pages, <140 KB on tool pages. `npm run check:perf`
   enforces it. If you exceed it, remove the island — do not raise the budget.
4. No hardcoded colours, spacing, radii, or font sizes in components. Everything reads from
   `src/styles/theme.css`.
5. Exactly one `<h1>` per page. Heading levels never skip.
6. Every image: `astro:assets`, explicit width and height, descriptive alt, AVIF/WebP.
   Below-fold images use native `loading="lazy"`. The LCP element is never lazy-loaded and
   never a background image.
7. All schema is emitted as a single `@graph` per page with `@id` cross-references, built by
   helpers in `src/lib/schema/`. Never inline a JSON-LD blob in a template.
8. Never mark up content in schema that is not visible on the page. Never fabricate ratings,
   review counts, dates, or statistics.
9. Placeholder content must be obviously placeholder — `TODO: [what is needed]`. Never invent
   a client name, a testimonial, a metric, or a case study number. If content is missing,
   leave a TODO and tell me.
10. Every stat rendered on the page must be present as a real number in the HTML source. If
    it animates, animate from the real value. Never render `0` and let JS fix it.
11. FAQ answers live in the DOM whether the accordion is open or closed.
12. Every commercial page starts with an answer block: 40–60 words, self-contained, naming
    "Scaling Socials" rather than "we".
13. Never add a new npm dependency without telling me what it costs in KB and why nothing
    already installed does the job.
14. Secrets never enter the repo. Supabase service key exists only in the Worker environment.

## Voice
Plain, specific, confident. Indian units (₹2L, ₹1.5Cr — never "₹1 Million"). No "in today's
landscape", no "passionate about", no emoji as icons, no `→` appended to button text, no
ALL-CAPS eyebrow labels. Active voice. Buttons say what happens.

## Commands
- `npm run dev`
- `npm run build`
- `npm run check` — astro check + typecheck
- `npm run check:perf` — perf budget gate
- `npm run check:schema` — JSON-LD validation
- `npm run check:links` — internal link + orphan check
- `npm run lh` — Lighthouse CI against 5 representative URLs

## Definition of done for any page
`npm run check && npm run build && npm run check:perf && npm run check:schema && npm run lh`
all pass, Lighthouse mobile ≥ 98 on all four categories, page renders correctly with JS off,
schema validates in Google's Rich Results Test, and every internal link resolves.
````

---

## Part 2 — Compressed 3-day sequence (3–8 September)

**The original 11-prompt sequence is superseded for Wave 1.** It remains valid for Waves 2–5
and is kept below as Part 4.

Run these in order. Commit after each with the prompt number in the message.

---

### DAY 1 — Prompt A: foundation

```
Read CLAUDE.md, docs/spec/08-DESIGN-BRIEF.md and docs/spec/01-STACK-AND-ARCHITECTURE.md
in full, including §2.1 (the React boundary).

The design is approved. Implement it exactly. Study src/styles/theme.css,
src/components/primitives/Section.astro, and src/components/blocks/{Delta,Annotation}.astro
first — they set the conventions.

Build:
1. Remaining primitives: Container, Prose, Heading, Button, Link, Table. Semantic vars only.
2. BaseLayout with semantic landmarks, skip link, meta slot, schema slot.
3. Header, 5-item nav, mega menu, keyboard accessible. Mobile nav is VANILLA JS
   (<dialog> or checkbox toggle) — NOT a React island. See 01 §2.1.
4. Footer, rendered ONCE, ink register, NAP from src/lib/schema/entity.ts.
5. Blocks: AnswerBlock, ProofBar, LogoWall, ClientVoice, CaseStudyCard, ProcessSteps,
   CtaBand, FounderQuote, ComparisonTable, PricingBlock, NotForYouBlock.
   FaqAccordion uses <details>/<summary> with ZERO JavaScript.
6. src/lib/schema/ — @graph builders per 03 §1.2: organization, website, webPage, service,
   article, caseStudy, faqPage, breadcrumbs, person, definedTerm, dataset, webApplication.
   Meta.astro enforcing unique title 50-60 chars and description 140-158 — build FAILS on
   missing or duplicate.
7. scripts/validate-schema.mjs and scripts/check-links.mjs. GitHub Actions running
   check, build, check:perf, check:schema, check:links.

Build /styleguide/ (noindex) showing every token, primitive and block in BOTH registers
side by side.

Verify: npm run check && npm run build && npm run check:perf && npm run check:schema
all pass, and /styleguide/ renders correctly with JavaScript disabled.
```

---

### DAY 2 — Prompt B: the 15 Wave 1 pages

```
Read docs/spec/02-SITEMAP-AND-PAGE-SPECS.md §5 and docs/spec/03-SEO-AEO-GEO-SPEC.md §0
(the zero-defect launch gate) in full.

Build the 15 Wave 1 pages listed in docs/spec/07-EXECUTION-ROADMAP.md §1.

Priority order: /performance-marketing-agency-bangalore/ FIRST — it already has 3,516
impressions at position 24. Then the homepage. Then the rest.

EVERY page must satisfy the §0 gate: unique title 50-60, unique description 140-158,
exactly one <h1>, an answer block of 40-60 words naming "Scaling Socials" rather than
"we", question-shaped H2s, FAQ in <details> with FAQPage schema, full @graph with @id
cross-references, self-referencing absolute canonical, visible published and updated
dates matching schema, every image with real alt text and explicit dimensions, and at
least two contextual in-prose internal links.

Also build /audit/ per 02 §1.4 — real content above the flow, not a bare form page.

Use content from the current site plus the headline numbers in docs/spec/, restructured
to the template. Mark anything genuinely missing as TODO. Never invent a client name,
a testimonial, or a metric.

Verify: all five npm checks pass, and Lighthouse mobile SEO is exactly 100 on every page.
```

---

### DAY 3 — Prompt C: lead capture and SEO infrastructure

```
Read docs/spec/04-LEAD-CAPTURE-AND-TRACKING.md in full, including §4.1.

1. src/lib/validation.ts — shared zod leadSchema.
2. LeadForm React island (this IS a permitted React use — multi-step with validation
   state). Must degrade to a plain POST form with JS disabled.
3. src/lib/attribution.ts — sessionStorage capture of landing_page, referrer, UTMs,
   gclid, fbclid on first page of session.
4. /api/lead — server-side revalidation, Turnstile, rate limit, dedupe, scoring per §4,
   Supabase insert, Meta CAPI with hashed PII and shared event_id, GA4 Measurement
   Protocol, Resend emails.
5. The HotLeadEscalation Durable Object per §4.1, plus the claimed_at / claimed_by /
   escalated_at migration.
6. /thank-you/ and /lp/thank-you/, both noindex.

Then the SEO infrastructure from 03 §0:
7. robots.txt (exact contents, 03 §5), XML sitemap with the exclusions, HTML sitemap
   at /sitemap/, scripts/build-llms-txt.mjs generating /llms.txt and /llms-full.txt,
   RSS at /rss.xml, JSON feed at /feed.json, per-page OG image generation, custom 404.
8. public/_redirects built from docs/spec/redirect-map.csv.

Verify: submit a test lead end to end and show me the Supabase row. Confirm the form
still submits with JavaScript disabled.
```

---

### DAY 5 — Prompt D: validate for cutover

```
Pre-launch validation against docs/spec/03-SEO-AEO-GEO-SPEC.md §0 and
docs/spec/07-EXECUTION-ROADMAP.md §3.

1. Crawl the built site. Report every 404, redirect chain, loop, and orphan page.
2. Validate public/_redirects: every source URL from docs/spec/redirect-map.csv must
   resolve to a live 200 on the new site. Report any that do not. Nothing may redirect
   to a 404 and nothing may bulk-redirect to /.
3. Run npm run check, build, check:perf, check:schema, check:links.
4. Lighthouse CI on all 15 pages, mobile preset. Assert SEO = 100 exactly, and
   Performance / Accessibility / Best Practices each >= 98.
5. Report any page with a missing or duplicate title or description, more or fewer than
   one h1, a skipped heading level, an image without alt, or an image without explicit
   dimensions.
6. Confirm /llms.txt and /llms-full.txt are generated and correct.
7. Grep the built HTML for placeholder-zero counters and report any hit.

Produce a written GO / NO-GO report against the hold conditions in 07 §3. Do not
recommend GO if any hold condition fails.
```

---

## Part 3 — Original 11-prompt sequence (Waves 2–5)

Run these after launch, in order. Each ends in a verifiable state.

---

### Prompt 1 — Scaffold and design system

```
Read docs/spec/01-STACK-AND-ARCHITECTURE.md and the "Design direction" section of
docs/spec/02-SITEMAP-AND-PAGE-SPECS.md in full.

Set up the Astro 5 project per the spec: TypeScript strict, Tailwind v4 with CSS-first
config, MDX, React integration, sitemap, Cloudflare adapter in static/hybrid mode.

Before writing any component, produce a design plan and show it to me for approval:
- A palette of 5 named hex tokens with the reasoning for each
- Two typefaces with their roles and the full type scale
- A layout concept with ASCII wireframes for the hero and one content section
- The principles that make this site look like Scaling Socials and not like a template

The audience is Indian D2C founders with engineering and finance backgrounds. The concept is
"instrument panel, not brochure" — numbers are the visual system. Explicitly avoid the
default AI-design looks listed in the spec (cream + serif + terracotta; near-black + acid
accent; uniform rounded cards with identical soft shadows; ALL-CAPS eyebrow labels).

Review your own plan against that list before showing it to me. If any part of it is a
default rather than a choice for this brief, revise it and tell me what you changed.

Do not write component code until I approve the plan.
```

---

### Prompt 2 — Tokens, primitives, and CI gates

```
Implement the approved design plan.

1. src/styles/theme.css — all tokens in Tailwind v4 @theme: colour, type scale with clamp(),
   spacing on an 8px base, three radius tokens (card/button/input), motion tokens.
2. Self-host both typefaces as subset woff2. IMPORTANT: the subset must include ₹ (U+20B9).
   Preload in head, font-display: swap.
3. Primitives in src/components/primitives/: Container, Section, Prose, Heading, Button,
   Link, Table.
4. BaseLayout.astro with semantic landmarks, skip link, meta component, schema slot.
5. Header with the 5-item nav from the spec (mega menu, keyboard accessible, mobile nav as
   the only island). Footer, rendered once, with real NAP read from src/lib/schema/entity.ts.
6. public/_headers, public/robots.txt (exact contents in 03-SEO-AEO-GEO-SPEC.md §5).
7. The four CI scripts in scripts/ and their npm commands.
8. GitHub Actions workflow running all gates on PR.

Build a /styleguide/ page (noindex) showing every token and primitive so I can review.

Verify: npm run check && npm run build && npm run check:perf all pass.
```

---

### Prompt 3 — Content collections and the schema graph

```
Read docs/spec/03-SEO-AEO-GEO-SPEC.md sections 1 and 2 in full.

1. src/lib/schema/entity.ts — the ORG constant per the spec. Leave TODO markers for the
   facts I haven't supplied yet (founding date, geo coordinates, full sameAs list). Do not
   invent them.
2. src/lib/schema/ — builder functions that emit a single @graph per page with @id
   cross-references: organization(), website(), webPage(), service(), article(),
   caseStudy(), faqPage(), breadcrumbs(), person(), definedTerm(), dataset(), webApplication().
3. src/components/seo/SchemaGraph.astro and Meta.astro. Meta enforces: unique title 50–60
   chars, unique description 140–158 chars, self-referencing absolute canonical, OG and
   Twitter tags with a per-page OG image. Build fails if title or description is missing.
4. src/content/config.ts — zod schemas for every collection listed in the spec. The
   case-studies schema requires client_permission_granted: boolean and the build must fail
   if it is false. Every collection requires publishedAt, updatedAt, and an author reference.
5. scripts/validate-schema.mjs — parse every JSON-LD block in dist/, validate required
   fields per type, fail on error.
6. scripts/build-llms-txt.mjs — generate /llms.txt and /llms-full.txt from the collections
   in the format in spec §4.3.

Verify: npm run check:schema passes on a build with one sample entry per collection.
```

---

### Prompt 4 — Reference implementation: one service page end to end

```
Read the ServiceLayout spec in 02-SITEMAP-AND-PAGE-SPECS.md §5.1 and the AEO rules in
03-SEO-AEO-GEO-SPEC.md §3.

Build ServiceLayout.astro and the block components it needs: AnswerBlock, ProofBar,
LogoStrip, SubServiceGrid, ComparisonTable, ProcessSteps, PricingBlock, NotForYouBlock,
CaseStudyCard, FaqAccordion, CtaBand, AuthorByline, LastUpdated.

FaqAccordion must use <details>/<summary> — answers in the DOM at all times, no JS.
ProcessSteps is the only place numbered markers are allowed, because it is a real sequence.

Then build /performance-marketing-agency-bangalore/ as the reference implementation, using
the existing copy from the current live page as a starting point (it is in
docs/spec/reference/current-performance-page.md) — but restructure it to the template,
fix the typos, and add the answer block, comparison table, pricing block, and "who this is
not for" section. Mark any section needing content I haven't supplied as TODO.

Verify: renders correctly with JS disabled; Lighthouse mobile 100/100/100/100; schema
validates; JS shipped under 60 KB.

This page is the pattern for every other service page. Get it right before we scale it.
```

---

### Prompt 5 — Lead capture

```
Read docs/spec/04-LEAD-CAPTURE-AND-TRACKING.md in full.

1. src/lib/validation.ts — the shared zod leadSchema.
2. src/components/islands/LeadForm.tsx — React, variant prop driving field sets per the
   table in §5, multi-step where specified, client-side zod, Turnstile, honeypot,
   attribution read from sessionStorage, accessible errors via aria-live, real loading and
   success states. Must degrade to a plain POST form if JS fails.
3. src/lib/attribution.ts — on first page of a session, persist landing_page, referrer, all
   UTM params, gclid, fbclid to sessionStorage.
4. src/pages/api/lead.ts (prerender: false) — server-side re-validation, Turnstile verify,
   rate limit, duplicate suppression, scoring per §4, Supabase insert, Meta CAPI Lead event
   with hashed PII and shared event_id, GA4 Measurement Protocol, Resend emails.
5. The Supabase migration SQL from §3, with RLS.
6. /thank-you/ and /lp/thank-you/ pages.

Secrets from Cloudflare env only. Never in the repo, never in client bundles.

Verify: submit a test lead end to end and show me the row in Supabase. Confirm the form
still submits with JS disabled.
```

---

### Prompt 6 — Remaining service, industry, and location pages

```
Using the reference implementation from Prompt 4, build:
- The 5 remaining service pillars
- The 12 service cluster pages
- The 6 industry pages + index
- /locations/dubai/

Exact URLs are in 02-SITEMAP-AND-PAGE-SPECS.md §1. Content comes from
src/content/ — I will supply MDX. Where I have not, create the file with correct
frontmatter and TODO markers in the body. Do not write filler copy.

Every page needs: contextual in-prose internal links to its pillar, siblings, 2 case
studies, and 2 blog posts. Run npm run check:links and show me any orphans.
```

---

### Prompt 7 — Case studies and the proof layer

```
Read 02-SITEMAP-AND-PAGE-SPECS.md §5.2.

Build CaseStudyLayout.astro with the results table, at-a-glance block, screenshot figure
component with caption, client quote block, and the "what we'd do differently" section.
Build /case-studies/ index with category and service filtering — filtering must work as
plain links with query params that produce prerendered pages, not a JS filter, so every
filtered view is crawlable.

Build /teardowns/ on the same layout.

Create the 8 case study MDX files from the data I supply. Build must fail on any entry with
client_permission_granted: false.
```

---

### Prompt 8 — The Benchmark Index

```
Read 03-SEO-AEO-GEO-SPEC.md §7.

Build /india-d2c-ad-benchmarks/ as the most visually ambitious page on the site — this is
where the design spends its boldness.

- Hub page: latest quarter, headline findings, methodology link, citation block, CSV and
  JSON download, embed code generator
- /india-d2c-ad-benchmarks/[quarter]/ — permanent archived versions, prerendered from JSON
  in src/content/benchmarks/
- /india-d2c-ad-benchmarks/methodology/
- BenchmarkExplorer React island for filtering — but the FULL dataset must also render as
  semantic <table> markup in the HTML for crawlers and LLMs. The island enhances it; it
  does not replace it. This is non-negotiable.
- Dataset + DataCatalog schema with license CC BY 4.0, distribution URLs, temporalCoverage,
  spatialCoverage, variableMeasured
- Embeddable widget at /embed/benchmark/[metric]/ that renders one chart with attribution
  and a backlink

Verify: the full data table is readable with JS disabled. Dataset schema validates.
```

---

### Prompt 9 — Blog, guides, glossary, tools

```
1. ArticleLayout per §5.3 — static TOC, key-takeaways box, author byline with Person schema
   and sameAs, visible published and updated dates, inline source links, related posts.
2. /blog/ with tag filtering as prerendered pages. Pagefind search island.
3. /guides/ on the same layout.
4. /glossary/ + /glossary/[term]/ per §5.5, with DefinedTerm schema in a DefinedTermSet.
   Every term page needs a worked example in rupees.
5. The four calculators as React islands, each on its own page with WebApplication schema.
   The calculator page must explain the formula in plain HTML so the page has crawlable
   content even before anyone interacts. Results are shareable via URL query params so a
   result can be linked and indexed.
6. RSS at /rss.xml and JSON feed at /feed.json.
```

---

### Prompt 10 — Company pages, ad landing pages, legal

```
- /about/ — founder story from the supplied recording, timeline, real numbers
- /team/ — Person schema per member, real photos, LinkedIn sameAs
- /partners/ — certifications and partner badges
- /contact/ — form, map, ContactPage schema, real NAP
- LandingLayout.astro per 04-LEAD-CAPTURE-AND-TRACKING.md §6: noindex, no nav, no footer
  links, one conversion action, LCP target under 1.5s
- /lp/[campaign]/ driven by a content collection so the marketing team can ship an LP by
  adding an MDX file
- Legal pages
```

---

### Prompt 11 — Migration and launch readiness

```
1. Build public/_redirects from docs/spec/redirect-map.csv. Validate: every source resolves
   to a live 200 on the new site, no chains, no loops, nothing pointing at a 404.
2. Sitemap config excluding /lp/*, /api/*, /keystatic, /styleguide.
3. HTML sitemap at /sitemap/.
4. Generate and commit llms.txt and llms-full.txt.
5. Per-page OG image generation at build time.
6. Wire GA4 via GTM deferred to requestIdleCallback, Clarity, Consent Mode v2 geo-gated to
   EU/UK only.
7. Custom 404 with search and links to the top 10 pages.
8. Full Lighthouse CI run across every template type.
9. Produce a launch checklist covering: GSC and Bing verification, sitemap submission, GA4
   conversion setup, Meta CAPI event test, DNS cutover order, and post-launch crawl
   validation.

Then give me a written pre-launch report: any page missing content, any broken link, any
schema warning, any perf budget breach, and the full redirect validation result.
```

---

## Part 3 — How to work with Claude Code on this

- **One prompt per session where possible.** Long sessions drift.
- **After every prompt, run the verification and actually look at the page with JS disabled**
  (DevTools → Settings → Debugger → Disable JavaScript). This is the check that catches the
  failure mode that matters most for GEO, and it is the one that is easiest to skip.
- **When Claude Code proposes a dependency,** ask what it costs in KB. The perf budget is the
  differentiator; protect it.
- **When you need content that doesn't exist yet,** let it write `TODO:` rather than filler.
  Filler that ships is how the current site ended up with another agency's name in the copy.
- **Commit after each prompt** with the prompt number in the message, so you can bisect.
- **Update `CLAUDE.md`** whenever you make a decision that should persist. It is the memory.
