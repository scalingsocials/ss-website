# Scaling Socials — Website Rebuild Spec Pack

**Owner:** Khan (Maaz), Co-founder, Scaling Socials Media LLP
**Target:** scalingsocials.com — full rebuild
**Build method:** Claude Code
**Version:** 1.0 — September 2026

---

## What this pack is

Seven documents that together form a complete build specification. They are written to be
read by Claude Code as source-of-truth context, not as a pitch deck. Every decision has a
reason attached so Claude Code doesn't silently substitute a default.

| File | What it decides | Who acts on it |
|---|---|---|
| `00-START-HERE.md` | How to run the build | You |
| `01-STACK-AND-ARCHITECTURE.md` | Tech stack, repo layout, rendering, perf budget | Claude Code |
| `02-SITEMAP-AND-PAGE-SPECS.md` | Every URL, template, section, keyword, schema | Claude Code + writers |
| `03-SEO-AEO-GEO-SPEC.md` | Search, answer-engine, and LLM-citation strategy | Claude Code + writers |
| `04-LEAD-CAPTURE-AND-TRACKING.md` | Forms, CRM wiring, ad landing pages, attribution | Claude Code |
| `05-CONTENT-REQUIREMENTS.md` | Exactly what you must supply, in what format | **You and your team** |
| `06-CLAUDE-CODE-PROMPTS.md` | Ordered prompt sequence to run the build | You |
| `07-EXECUTION-ROADMAP.md` | The 3-day launch plan and wave schedule | You |
| `08-DESIGN-BRIEF.md` | Palette, type, registers, motif, perf budget | Claude Code |
| `09-DESIGNER-ASSET-BRIEF.md` | What to commission, with formats and quantities | Designer |
| `10-CASE-STUDY-TEMPLATE.md` | Case study structure and writing guide | Writers |

---

## The strategic bet, in one paragraph

Every agency site in Bangalore says the same six things on a slow WordPress build. You
cannot out-adjective them. You can out-*evidence* them. The plan is a site that is (a) the
fastest in its SERP by a wide margin, (b) structurally built to be quoted by ChatGPT,
Perplexity, Gemini and Google AI Overviews rather than merely crawled by Googlebot, and
(c) anchored by a genuinely proprietary public dataset — the India D2C Ad Benchmark Index —
built from your own ₹10Cr+ of managed spend. Nobody in your market publishes real numbers.
That dataset is the link magnet, the citation magnet, the PR hook, and the sales asset, all
at once. Everything else in this pack supports it.

---

## Non-negotiables

These are the constraints that make the rest work. If a decision later conflicts with one of
these, the constraint wins.

1. **Every page must be fully readable with JavaScript disabled.** This is not a purist
   preference. ChatGPT's crawler, PerplexityBot, and most LLM retrieval pipelines execute
   little or no JS. Content that needs JS to render is content that will never be cited.
2. **Total JavaScript on a content page: under 60 KB gzipped.** Interactive tools are the
   only exception and they load their JS on interaction, not on page load.
3. **No content is ever fetched client-side.** All copy, all case study data, all schema
   ships in the initial HTML.
4. **Every claim with a number attached must have a source, a date, and a named subject.**
   No more "4.2X average ROAS" floating free. This is both a trust rule and a GEO rule —
   LLMs preferentially cite specific, attributed, dated claims.
5. **One canonical URL per intent.** No duplicate service pages, no `/performance-marketing/`
   and `/performance-marketing-agency-bangalore/` both live.
6. **Every lead form writes to the existing Supabase CRM.** No new silo, no WPForms inbox.

---

## Phasing — COMPRESSED

**Launch: 5 September 2026.** The original 8-week build is cancelled. See
`07-EXECUTION-ROADMAP.md` for the full plan; the shape is:

**Wave 1 — live 5 September.** 15 pages: homepage, six service pillars, about, team, contact,
`/audit/`, and the legal pages. Full technical SEO, complete schema, Lighthouse SEO exactly 100,
validated 301 map. Three days: foundation, pages, validate and cut over.

**Waves 2–5 — weekly through early October.** Service clusters and `/work/` (12 Sep), industries
and first case studies and `/vs/` pages (19 Sep), glossary and blog (26 Sep), Benchmark Index
with category routes and calculators (3 Oct).

**The old WordPress site is left completely untouched until DNS cutover.** No emergency fixes,
no plugin updates, no content edits. It is being replaced in three days.

**Off-page SEO runs on a parallel track, starting now** — Google Business Profile, review
collection, and NAP corrections have zero dependency on the website and are the fastest ranking
wins available. Owned by marketing, gates nothing in the build.

---

## How to run this with Claude Code

1. Create an empty repo. Copy this entire spec pack into `docs/spec/` inside it.
2. Create a `CLAUDE.md` at repo root — `06-CLAUDE-CODE-PROMPTS.md` contains its exact
   contents. This is what keeps Claude Code from drifting across sessions.
3. Work one prompt at a time from `06-CLAUDE-CODE-PROMPTS.md`. Each prompt ends in a
   verifiable state. Commit after each.
4. After every page-building prompt, run the verification block in that prompt before
   moving on. Do not batch three pages and check at the end.

---

## What you personally have to do

The build is the easy half. Read `05-CONTENT-REQUIREMENTS.md` first and start collecting
in parallel with Phase 1 — the content is the long pole, and it is the only part Claude
Code cannot produce for you. Specifically: client permissions, real campaign numbers,
dashboard screenshots, and about four hours of your own voice recorded.
