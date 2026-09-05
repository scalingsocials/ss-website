# Scaling Socials — Website

## What this is
Marketing site for Scaling Socials, a performance marketing and ecommerce development agency
in Bengaluru, India, serving D2C brands in India and the UAE. Rebuild, replacing a WordPress
and Elementor site.

## Read before doing anything
The specification lives in `docs/spec/`. Read the relevant file before implementing:
- `01-STACK-AND-ARCHITECTURE.md` — stack, repo layout, CI gates
- `02-SITEMAP-AND-PAGE-SPECS.md` — URLs, templates, page anatomy
- `03-SEO-AEO-GEO-SPEC.md` — schema graph, extraction rules, llms.txt, robots.txt
- `04-LEAD-CAPTURE-AND-TRACKING.md` — forms, Worker, Supabase, analytics
- `05-CONTENT-REQUIREMENTS.md` — what content exists and what is pending
- `08-DESIGN-BRIEF.md` — **v2, approved.** Palette, type, registers, motif, perf budget
- `09-DESIGNER-ASSET-BRIEF.md` — what is coming from the designer, and when

If a request conflicts with the spec, say so and ask. Do not silently deviate.

## Stack
Astro 5 (static, Cloudflare adapter) · TypeScript strict · Tailwind CSS v4 (CSS-first `@theme`,
no config file) · React 19 islands only · MDX content collections · Keystatic admin ·
Cloudflare Pages + Workers · Supabase for leads · Pagefind for search.

## The design in one paragraph
Two registers. **Paper** (`#FFFFFF`) for reading — service copy, case study narrative, blog.
**Ink** (`#000000`) for showing — client wall, creative video wall, Benchmark Index, CTA bands.
Black and white are the brand: grounds are pure `#FFFFFF` and pure `#000000`. One accent, **Klein blue `#002FA7`**, used sparingly.
A page scrolls paper, paper, ink, paper, ink, paper. The motif is the **annotation**: a thin
vertical rule with a tag, like the marker you drop on an ads dashboard when you changed
something. The signature component is the **Delta**: a state change with a direction, a client
and a period — never a big number with a small label.

## Hard rules
1. Every page must render fully with JavaScript disabled. No client-side content fetching.
   LLM crawlers barely execute JS; content behind JS never gets cited.
2. React islands only for: forms, calculators, benchmark filters, mobile nav, blog search,
   video wall intersection loading. Everything else is `.astro`. Never add an island for
   something `<details>` can do.
3. **JS budget: <60KB gzipped on content pages, <140KB on tool pages.** `npm run check:perf`
   enforces it. If you exceed it, remove an island — never raise the budget. This budget is
   about JavaScript, NOT visual richness: images, video, illustration and type do not count
   against it.
4. **Media rules.** LCP element is the `<h1>` or a hero poster under 120KB AVIF — never a
   video. Every video: `preload="none"`, `poster` set, `muted`, `playsinline`, loads on
   intersection, `.webm` + `.mp4`, under 1.5MB, max 8s. Every image: AVIF/WebP, `srcset`,
   explicit `width`/`height`, native `loading="lazy"` below the fold.
5. No hardcoded colours, spacing, radii or font sizes in components. Read semantic vars only
   (`--ground`, `--fg`, `--rule-c`, `--accent-text`, `--accent-fill`, `--accent-on`,
   `--accent-graphic`, `--pos`, `--neg`) — never the raw palette. `<Section>` is the ONLY
   component that sets `data-register`.
5a. **`--accent-fill` is for BACKGROUNDS and graphics. `--accent-text` is for text.**
    A bright brand accent will usually fail WCAG as text on the paper ground. Link and label
    text always uses `--accent-text`; button and badge backgrounds use `--accent-fill` with
    `--accent-on` text on top. If you find yourself writing `color: var(--accent-fill)`, stop.
    Klein blue `#002FA7` is 10.69:1 as text on white and FAILS on black (1.96:1) — the ink
    register uses the lifted `#5B7CFF` (5.77:1). The fill inverts too: deep blue with white
    text on paper, lifted blue with black text on ink. Never write a raw hex; read the
    semantic vars. Text on black is `#EDEDED`, never pure white — halation.
5c. **The accent is rare.** Primary buttons, links, the annotation marker, one chart series,
    active states. Nowhere else. Two blue elements competing in one section means one is
    decoration — remove it.
5b. **Serif is scoped to `.prose` only** — blog, case study narrative, guides, service body
    copy. `body` is Anek Latin. Never put Source Serif on UI, nav, buttons, labels or data.
6. The two registers differ in colour ONLY. Type scale, spacing rhythm and component shapes
   are identical in both. If they drift, the site reads as two websites.
7. Max five ink bands per page. More and it stops having rhythm and starts having stripes.
8. Exactly one `<h1>` per page. Heading levels never skip.
9. All schema is one `@graph` per page with `@id` cross-references, built by helpers in
   `src/lib/schema/`. Never inline a JSON-LD blob in a template. Never mark up content that
   is not visible. Never fabricate ratings, dates or statistics.
10. **Every number renders as a real value in the HTML.** If it animates, it animates from the
    real value already present. Never `0` fixed by JS — that bug is live on the current site
    and on intentfarm.com, and it means crawlers see zeros.
11. **Every image has real alt text.** Intent Farm's nine case study links have anchor text
    like `Group-1171276648` because their thumbnails have none. Do not repeat that.
12. FAQ answers live in the DOM whether the accordion is open or closed. Use
    `<details>`/`<summary>`.
13. Every commercial page opens with an answer block: 40–60 words, self-contained, naming
    "Scaling Socials" rather than "we", so the passage survives being lifted out of context.
14. `Delta` requires `client` and `period`. Do not add an optional-attribution escape hatch —
    the requirement is deliberate.
15. Placeholder content must be obviously placeholder: `TODO: [what is needed]`. Never invent
    a client name, testimonial, metric or case study number. If content is missing, leave a
    TODO and tell me.
16. Never add an npm dependency without telling me what it costs in KB and why nothing
    installed already does the job.
17. Secrets never enter the repo. The Supabase service key exists only in the Worker env.

## Voice
Plain, specific, confident. Indian units — ₹2L, ₹1.5Cr, never "₹1 Million". No "in today's
landscape", no "passionate about", no emoji as icons, no `→` appended to button text, no
ALL-CAPS eyebrow labels, no middle-dot meta strings. Active voice. Buttons say what happens.

## Entity facts
All organisation facts come from `src/lib/schema/entity.ts`. Never hardcode an address, phone
number or founding date anywhere else. Non-www is canonical. Founding date is 2021 in every
structured field; the 2022 LLP incorporation appears only in About-page prose. The GST address
in `legalAddress` is for invoices only and must never reach the website, schema or a directory.

## Commands
- `npm run dev` · `npm run build` · `npm run preview`
- `npm run check` — astro check + typecheck
- `npm run check:perf` — perf budget gate
- `npm run check:schema` — JSON-LD validation
- `npm run check:csp` — CSP gate: one shared policy, every inline block hashed
- `npm run check:links` — internal link + orphan check
- `npm run lh` — Lighthouse CI

## Definition of done for any page
`npm run check && npm run build && npm run check:perf && npm run check:schema && npm run check:csp && npm run lh`
all pass, Lighthouse mobile ≥ 98 on all four categories, the page renders correctly with JS
disabled, schema validates in Google's Rich Results Test, and every internal link resolves.
