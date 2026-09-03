# 07 — Execution Roadmap (v2, compressed)

**Supersedes v1.** v1 assumed an 8-week build. That is cancelled.

**Launch date: 8 September 2026.** Written 2 September 2026 — one working week.

Revised from 5 September at Khan's direction: use the full week and ship more.

---

## 1. What ships on 8 September

Five working days instead of three roughly triples what can ship. Wave 1 and Wave 2 merge.

### Wave 1 — live 8 September. ~40 pages.

| Page | Notes |
|---|---|
| `/` | Homepage, both registers, hero deltas |
| `/performance-marketing-agency-bangalore/` | **Highest priority.** 3,516 impressions already sitting at position 24 |
| `/seo-agency-bangalore/` | |
| `/shopify-development-company-bangalore/` | |
| `/web-development-company-bangalore/` | |
| `/social-media-marketing-agency-bangalore/` | |
| `/meta-ads-agency-india/` | |
| `/about/` `/team/` `/contact/` | |
| `/audit/` | Step-through lead capture |
| `/terms/` `/privacy/` `/disclaimer/` `/cookie-policy/` | |
| **11 service cluster pages** | Meta/Google/ecommerce PPC/CRO, ecommerce SEO/technical SEO/local SEO/AEO, Shopify migration/speed/redesign |
| **6 industry pages + index** | Fashion, beauty, home decor, wellness, jewellery, D2C |
| **5 `/vs/` comparison pages** | Highest-intent, lowest-competition pages on the site |
| `/work/` | Creative gallery, ink register |
| `/case-studies/` | Index, live with however many have permission |
| `/partners/` `/sitemap/` | |

Eight times the current indexed page count, with technical SEO the current site has never had.

### Waves 2–4 — weekly, through late September

| Wave | Date | Scope |
|---|---|---|
| 2 | 15 Sep | First 4 case studies, 25 glossary terms, blog engine |
| 3 | 22 Sep | 4 more case studies, first 6 blog posts, calculators, teardowns |
| 4 | 29 Sep | Benchmark Index v1 with category routes, `/audit/` refinements |

Each wave ships through the same CI gates. Nothing merges that fails them.

### Why not everything on the 5th

**DNS cutover without a validated redirect map is the real risk.** You have 359 branded clicks
a quarter — people searching your name and finding you. That is the only thing the current site
does well. A cutover with unvalidated redirects loses it and it takes weeks to recover.

---

## 2. Hard prerequisites — must land by end of 3 September or the date slips

These are not build tasks. They are inputs, and nothing substitutes for them.

| # | Input | Owner | Blocks |
|---|---|---|---|
| P1 | Brand hex codes, or logo files to extract from | Khan | `theme.css`, every component |
| P2 | Logo SVG + 512×512 PNG (schema requires square PNG) | Khan / designer | Header, footer, `Organization` schema |
| P3 | Anek Latin + Source Serif 4, subset **including ₹ U+20B9**, as woff2 in `public/fonts/` | Dev | Every number on the site renders wrong without it |
| P4 | **Screaming Frog crawl of the live site, exported** | Dev | The 301 map. **Cutover cannot happen without this.** |
| P5 | Three locked headline numbers — managed spend, brands, average ROAS, and how ROAS is calculated | Khan | Homepage, every service page |
| P9 | 90 minutes of recording, Blocks A and B in `05` | Khan | Real service copy on Day 4. Without it, launch ships restructured existing copy |
| P10 | Transcriber named and available from 3 Sep | Khan | The whole Day 4 content pass |
| P6 | Cloudflare account + Pages project | Dev | Deploy |
| P7 | Supabase URL + service role key (Worker env only) | Dev | Lead capture |
| ~~P8~~ | ~~Partner data~~ — **DELIVERED**, see `11-SUPPLIED-CONTENT.md` §1 | — | — |

**If P4 is not delivered, Wave 1 deploys to a preview URL on 8 September and DNS cutover waits.**
That is the one non-negotiable. Everything else can ship with a TODO.

---

## 3. Five working days

### Day 1 — Wednesday 3 September: foundation

- Repo, install, `CLAUDE.md`, spec pack in `docs/spec/`
- `theme.css` with real brand colours (blocked on P1)
- Fonts subset and installed (P3)
- Primitives, `Section`, `Delta`, `Annotation`, remaining blocks
- `BaseLayout`, header, footer — footer rendered **once**
- `src/lib/schema/` — full `@graph` builders
- All four CI scripts + GitHub Actions, gates enforcing
- `/styleguide/` for review

**End of day:** styleguide renders in both registers, JS disabled, all gates green.

### Day 2 — Thursday 4 September: commercial core

- Homepage + 6 service pillars + `/audit/`
- Every page: unique title 50–60 chars, unique description 140–158, single `<h1>`, answer block,
  question-shaped H2s, FAQ in `<details>`, full `@graph`, canonical
- Lead capture: `/api/lead` → Worker → Supabase, Turnstile, scoring, WhatsApp routing
- `/audit/` step-through flow
- `robots.txt`, `llms.txt`, `llms-full.txt`, XML sitemap, HTML sitemap at `/sitemap/`

**End of day:** every page passes all five checks, Lighthouse SEO exactly 100.

### Day 3 — Friday 5 September: depth

- 11 service cluster pages
- 6 industry pages + index
- 5 `/vs/` comparison pages
- `/work/` creative gallery, `/partners/`, `/case-studies/` index

### Day 4 — Saturday 6 September: content pass and polish

- Khan's recordings (Blocks A and B) transcribed and merged, replacing placeholder copy
- FAQ blocks populated from the Harsh and Vinay objection list
- Client-voice problem statements
- Logos migrated, alt text on every asset
- `public/_redirects` built from the P4 crawl

### Day 5 — Sunday 7 September: validate

- Full crawl. Zero 404s, chains, orphans
- Every old URL resolves to a live 200
- Rich Results Test, one page per template
- JS-disabled pass on every page
- Real phone, real 4G
- **GO / NO-GO report against the hold conditions**

### Day 6 — Monday 8 September: cut over

Morning:
- Full crawl of the built site. Zero 404s, zero redirect chains, zero orphans.
- Every old URL from the P4 crawl resolves to a live 200 on the new site.
- Rich Results Test on one page per template.
- Manual JS-disabled pass on all 15 pages.
- Mobile pass on a real phone, on 4G, not on wifi.

Afternoon:
- DNS cutover.
- Immediately: resubmit sitemap in GSC and Bing, request indexing on the six priority pages.
- Monitor 404s hourly for 48 hours.

**Hold conditions — do not cut over if any of these is true:**
- `check:schema` fails
- Lighthouse SEO is below 100 on any page
- Any old URL from the crawl does not resolve
- Any page has a missing or duplicate title or description
- Any page renders incompletely with JS disabled

---

## 4. The old WordPress site

**Left completely untouched until cutover.** No emergency fixes, no plugin updates, no content
edits. Every hour spent on it is an hour not spent on the replacement, and it is being replaced
in three days.

**One condition:** if cutover slips past **12 September**, do the six-hour emergency pass on the
live site after all — the placeholder `contact@mysite.com`, the "Urban Socials" copy on the SEO
page, and the "full payment upfront" FAQ are actively costing you deals, and a week is long
enough to matter.

---

## 5. Off-page SEO — runs in parallel, not after

**This is a deliberate change from the instruction to defer it.**

Google Business Profile, review collection, and directory corrections have **zero dependency on
the website**. They compete for no development time. They are also the fastest ranking wins
available — Map Pack can move in weeks where organic takes months.

Deferring them to after 5 September buys the dev team nothing and costs three days of the only
work that produces results quickly.

Assign to marketing, starting **today**:

| Task | Owner | Cadence |
|---|---|---|
| GBP: verify NAP, category, services, hours, 20+ photos | Marketing | Once, this week |
| GBP Posts | Marketing | Weekly |
| Review collection calls | Marketing / account managers | 5 requests/week ongoing |
| NAP corrections per `ss-nap-checklist.xlsx` Tiers 1–3 | Marketing | Two days this week |
| Client footer credit audit — 56 live sites per BuiltWith | Marketing | This week |

**After 5 September**, add: directory profiles (Clutch, GoodFirms, DesignRush, Sortlist),
listicle placement outreach, Reddit and Quora seeding, guest posts, digital PR.

The one thing that genuinely must wait for launch is anything that sends traffic or links to
pages that do not exist yet.

---

## 6. Content — the transcriber owns the pipeline

**Mandated role: content editor / transcriber**, dedicated, starting now.

**Khan records raw audio only.** He does not write, does not edit, does not review drafts line
by line. The transcriber owns everything from audio to merged MDX.

Pipeline:
```
Khan records (phone, unstructured, rambling is fine)
  → transcriber transcribes
  → transcriber drafts into the template
  → Claude Code formats to MDX with frontmatter, schema, internal links
  → Khan approves at gist level only
  → merged
```

### Wave 1 content reality

There is no recorded audio yet, so **Wave 1 service copy is drafted from the existing
`/performance-marketing-agency-bangalore/` page plus Khan's approved headline numbers**,
restructured to the template. This is acceptable for launch. It gets replaced wave by wave as
recordings land.

**Khan's minimum:** P5 (the three numbers) by 3 September, and 90 minutes of recording
(Blocks A and B) by end of 5 September so the transcriber can work through the weekend.
Nothing else.

**Delivered so far** — see `11-SUPPLIED-CONTENT.md`: partner names, roles, bios and LinkedIn
URLs; pricing floor of ₹25,000/month for performance marketing and SEO with the variables that
move it; the Free Growth Audit offer (drafted, Khan to correct); client logo handling.

### Recording schedule after launch

| When | Recording | Feeds |
|---|---|---|
| By 5 Sep | Block A (45 min founder POV) + Block B (45 min, 6 services) | Day 4 content pass |
| w/c 8 Sep | 8 case study interviews, 20 min each | Waves 2–3 |
| w/c 15 Sep | Objection handling with Harsh and Vinay | FAQ refresh sitewide |

---

## 7. Resourcing, 3–8 September

| Role | Commitment |
|---|---|
| Dev lead + Claude Code | Full-time, 3–8 September including the weekend |
| Content transcriber | Full-time from 3 Sep, working the weekend for the Day 4 pass |
| Marketing (off-page, parallel track) | Half-time, ongoing |
| Khan | 2 hours total: P1, P5, P8, plus the 45-minute recording |
| Designer | Not blocking. Assets land Wave 2 onward per `09-DESIGNER-ASSET-BRIEF.md` |

---

## 8. Targets — unchanged

Compressing the build does not compress the ranking timeline. Rankings lag 6–12 weeks.

Day 120 (early January 2027) Tier 1 targets stand as written in v1 §1: 400+ non-branded clicks
a month, 20+ queries in top 5, Map Pack top 3, 50+ referring domains, 40+ organic leads a month,
`/performance-marketing-agency-bangalore/` at position ≤ 15.

Launching four weeks earlier pulls each of these forward by roughly four weeks. It does not make
the head term arrive in month two.

---

## 9. What kills this now

1. **P4 not delivered and cutover forced anyway.** Loses branded traffic. *Mitigation: preview
   URL on the 5th, DNS when the map validates.*
2. **A hold condition ignored to make the date.** *Mitigation: the conditions are in §3 and the
   CI gates enforce most of them mechanically.*
3. **Khan drafts content instead of recording.** The bottleneck moves to the one person who
   has least time. *Mitigation: transcriber owns drafting, §6.*
4. **Off-page gets deferred anyway** because "we're focused on launch". *Mitigation: separate
   owner, separate track, starts today.*
5. **Waves 2–5 never ship** because launch felt like the finish line. *Mitigation: Wave dates
   are in §1 and each is a calendar commitment.*
