# Pre-launch audit — Scaling Socials

> ## Remediation status — updated 12 September 2026, same day
>
> Fixes have been applied. **All five blockers are closed in the repo**, along with
> most of HIGH and MEDIUM. Everything below is marked:
>
> - **FIXED** — done and verified.
> - **OWNER** — needs your decision or a dashboard action; nothing was changed.
>
> | | Item | Status |
> |---|---|---|
> | B1 | Silent lead loss on a 200 | **FIXED** — 422/503 with honest client handling |
> | B2 | Turnstile fails closed | **FIXED** — fails open, flagged `turnstile='error'` |
> | B3 | Attribution stripped (25 pages) | **FIXED** — 10 new Supabase columns, verified end to end |
> | B4 | Qualifying answers stripped | **FIXED** — client routes unknown fields into `answers` |
> | B5 | Staging crawlable | **OWNER** — Cloudflare Access, dashboard only |
> | H1 | 2 legacy URLs unmapped | **FIXED** |
> | H2 | Case-study redirects → hub | **FIXED** (2 of 3; see H2 for why the third stays) |
> | H3 | Empty `<h2>` on an ad LP | **FIXED** |
> | H4 | `/teardowns/` duplicate hero | **FIXED** — thinness is now **OWNER** |
> | H5 | `/work/` thin, claims video | **FIXED** — accurate copy, page tripled |
> | H6 | Client-creative permission | **OWNER** — legal/relationship call |
> | H7 | Missing `Service` schema | **FIXED** |
> | H8 | Undocumented secrets | **FIXED** — full env table with failure modes |
> | H9 | GA4 www host gate | **FIXED** — client and server |
> | H10 | Pixel/Clarity ungated | **FIXED** for localhost; preview left firing (see H10) |
> | M1 | 4 WCAG AA contrast fails | **FIXED** — 0 failures across 3 page types |
> | M2 | `/vs/` duplicate DOM | **FIXED** (caption); dual layout kept deliberately |
> | M3 | 1.3MB unused Pagefind index | **FIXED** — removed from build, one line to restore |
> | M4 | LP re-fetching itself as an image | **FIXED** |
> | M5 | `llms.txt` overclaims | **FIXED** |
> | M6 | Thin commercial pages | **OWNER** — needs your source material |
> | M7 | Starved internal links | **FIXED** — see "Owner decisions" below |
> | M8 | Cannibalisation | **FIXED** per your call — distinctions stated, pages kept |
> | M9 | Stale runbook | **FIXED** |
> | M10 | No LocalBusiness on `/contact/` | **FIXED** |
> | M11 | `robots.txt` disallows `/lp/` | **OWNER** — confirm intent |
> | L1, L6, L7, L9, L11 | Small cleanups | **FIXED** |
>
> ### Owner decisions, taken 12 September 2026
>
> - **H6 — client creative: you confirmed permission.** The TODO in
>   `src/lib/creatives.ts` is closed and now records the confirmation, plus a
>   warning that the alt text (and therefore the public brand name) is derived
>   from the filename, so renaming a file renames the brand on the live page.
> - **H4 — `/teardowns/` stays,** as the signup point for the monthly series.
>   Rather than leave 77 words in the main nav, the page now explains what a
>   teardown covers — the store, the creative, and what we would change first —
>   drawn entirely from the method, with no teardown findings invented.
> - **M8 — both glossary pairs kept, differences made explicit.** You were right
>   that they differ; `blended-roas` already said so, the other three did not.
>   `/glossary/cvr/` and `/glossary/landing-page-cvr/` now state the distinction
>   (all sessions vs ad traffic only; sessions vs landing page views) and
>   cross-link, and `/glossary/mer/` now states how MER differs from blended ROAS
>   (all marketing cost vs ad spend alone). **This surfaced a real content bug:**
>   `/glossary/cvr/` gave its formula as `Purchases ÷ Sessions` but its worked
>   example used *landing page views* — and the identical 9,320 figure as the
>   other page. The example now uses sessions and its own numbers.
> - **M7 — nav: neither of the options as posed.** Adding top-level items to an
>   already-full nav costs UX, and footer-only costs authority. Both were put
>   into the **existing dropdowns** instead — Industries under "Work", Comparisons
>   under "Resources" — so they get a sitewide link without a new top-level slot,
>   **plus** contextual links from all six service pillars, which pass more
>   targeted relevance than nav boilerplate. Editorial inbound links per child
>   page went **from 2 to 8–10**. Two nav descriptors carried the same overclaims
>   found in `llms.txt` and were corrected: "Case studies — real result tables,
>   **named clients**" (they are anonymised) and "Creative gallery — ad creatives
>   we made, **with results attached**" (no results are attached).
>
> **Three defects were found while fixing, not during the audit:**
>
> - **NEW-1 (was a live blocker).** The teardown waitlist form posted to
>   `/api/subscribe`, **an endpoint that has never existed**. Confirmed 404. Every
>   signup from a page in the main nav was lost. Now posts to `/api/lead/`.
>   `check:links` missed it because it only checks `<a href>`, never `<form action>`.
> - **NEW-2 (was a blocker for JS-disabled visitors).** `lead_id` was required
>   (`min(8)`) but only ever set by JavaScript, so **every no-JS submission failed
>   validation** — violating CLAUDE.md §1. Invisible before, because failures
>   returned a silent 200. The server now mints one.
> - **NEW-3.** `budgetPoints()` did not recognise the option strings on `/audit/`,
>   `/contact/` or `/lp/*` (`₹3L+`, `₹5 L+`, `₹2–5 L`, `₹60 K–2 L`, `₹40–60 K`), so
>   fixing B4 alone would still have scored those leads at zero. All five sets are
>   now covered, and an unrecognised option logs a warning instead of silently
>   scoring 0.
>
> **Gates after the fixes:** `astro check` 0 errors / 0 warnings / **1 hint**
> (down from 5; the remaining one is a deliberate `execCommand` clipboard
> fallback) · `build` · `check:perf` (the three CLS warnings are gone) ·
> `check:schema` · `check:csp` · `check:links` · `check:stats` · `check:browsers`
> — all passing. All 104 canonicals and og:images now present.

**Audited:** Saturday 12 September 2026 · **Target launch:** Monday 14 September 2026
**Build audited:** clean `npm run build` from source at audit time — 104 pages, 97 in the XML sitemap.
**Nothing in this report has been fixed.** No source file was modified. Only this file was added.

**Gates run, all passing:** `astro check` (0 errors, 0 warnings, 5 hints) · `tsc --noEmit` ·
`npm run build` · `check:perf` · `check:schema` · `check:csp` · `check:links` (0 broken, 0 orphans) ·
`check:stats` · `check:browsers` (real WebKit + Chromium, 7 widths × 17 templates, no overflow).

**Headline:** the *engineering* is in good shape — the SEO plumbing, schema, CSP, links, sitemap,
image discipline, contact-detail consistency and copy quality are all better than most sites that go
live. The problems are concentrated in one place: **the lead pipeline silently loses leads and has
already lost all campaign attribution.** That is what makes Monday risky, not the content.

---

## 1. BLOCKERS — must be fixed before Monday

### B1. A failed submission returns HTTP 200 and the visitor is sent to the thank-you page. The lead is gone.
**Files:** `src/pages/api/lead.ts:400-409` · `src/scripts/leadform.ts:238-252`

`/api/lead` returns `{ ok: true, stored: false }` with status **200** on three separate paths:
zod validation failure (`:401-404`), honeypot trip (`:408`), and Turnstile failure (`:415-421`).
The client checks only `r.ok`:

```
if (r.ok) { fbq(...); location.assign(redirectTo()); return; }
```

So on any of those paths the visitor sees "Thanks, we've got it", the Meta `Lead` pixel fires, and
nothing was stored, no email was sent, and nothing was logged.

Verified live against the running dev server:

```
POST /api/lead/  {"email":"not-an-email", ...}  ->  200  {"ok":true,"stored":false}
```

Real triggers for this on a live site: an email the regex rejects, a message over 2000 chars, a phone
over 32 chars, a pasted answer over 500 chars. Every one of those is a real person who thinks they
enquired.

**Fix:** return a non-2xx (or `{ok:false}`) for genuine validation failure and have `leadform.ts`
check `stored`/`ok` rather than `r.ok`; keep the silent-200 behaviour **only** for the honeypot.

---

### B2. Turnstile fails closed and silently. A Cloudflare hiccup on Monday deletes every lead.
**Files:** `src/pages/api/lead.ts:91-107, 412-421` · `src/scripts/leadform.ts:105-127`

`verifyTurnstile()` returns `false` on any exception — including a network error reaching
`challenges.cloudflare.com`. The caller then drops the lead down the B1 silent path.
On the client, `ensureToken()` waits at most **3 seconds** (30 × 100 ms) for a token and then submits
without one, which the server treats as unverified.

This is not theoretical. It is failing right now in the dev environment:

```
[error] Uncaught TurnstileError: [Cloudflare Turnstile] Error: 110200.   (×10)
```

(110200 = domain not allowed — localhost isn't on the sitekey. On production the domain will be
allowed, but the *failure mode* is identical for a slow connection, an extension that blocks the
challenge script, or a Turnstile outage.)

**Fix:** on a Turnstile *error* (as distinct from a definitive `success:false`), store the lead and
flag it `unverified` rather than discarding it. Losing a real lead costs far more than storing a
spam row.

---

### B3. Every form's paid-traffic attribution is thrown away at the API boundary. 25 pages.
**Files:** `src/components/blocks/LeadForm.astro:69-73` · `src/pages/api/lead.ts:28-54, 383-397`

`LeadForm.astro` renders these hidden inputs on every form, with the comment
*"Present on every form so paid-traffic attribution is never lost"*:

```
utm_source  utm_medium  utm_campaign  utm_content  utm_term  gclid  fbclid  landing_page  referrer
```

`leadform.ts` populates them correctly from the URL. Then:

1. `leadSchema` (`z.object`) does not declare any of them, and zod strips unknown keys by default.
2. `upsertLead()` builds its row from an explicit field list that does not include them either.

So none of them reach Supabase, the Resend alert email, or the lead score. **All 25 pages that carry
a lead form are affected.** You are launching paid campaigns on Monday with no way to tell which
campaign, ad set or keyword produced any lead.

**Fix:** add the nine fields to the schema and to the `upsertLead` row (or nest them under `answers`).

---

### B4. The qualifying answers on `/audit/`, `/contact/`, `/lp/*` and `/technical-seo-audit-services/` are also discarded — and that silently breaks lead scoring.
**Files:** `src/pages/audit/index.astro:70-78` · `src/pages/contact/index.astro:40-47` ·
`src/lib/landings.ts:189-205` · `src/pages/technical-seo-audit-services/index.astro:64-70` ·
`src/pages/api/lead.ts:338-370`

`LeadForm` only prefixes fields passed as `questions` with `q_`, and only `q_`-prefixed fields are
collected into `answers`. Pages that pass `step1Fields` / `step2Lead` instead get bare names, which
the schema strips exactly as in B3.

Full list of fields silently dropped, by page:

| Page | Dropped fields |
|---|---|
| `/audit/` | `category`, `budget`, `audit_url`, `location` |
| `/contact/` | `category`, `budget`, `audit_url`, `location` |
| `/technical-seo-audit-services/` | `site_url`, `platform` |
| `/lp/performance-marketing/`, `/lp/performance-marketing/b2b/` | `ad_spend` |
| 6 service pages | `service` (the pre-selected "service you're interested in") |

Knock-on effect: `scoreLead()` awards `+5` for "answered the qualifying questions" and `+0/6/12/20`
for the budget tier, both read from `lead.answers`. On these pages `answers` is always `{}`, so the
maximum achievable score is **35** — below the `>= 40` "Hot" threshold. **No lead from `/audit/` —
the primary conversion page — can ever be scored Hot**, and the "What they told us" block in the
alert email is always empty. `budget` and `ad_spend` are precisely the fields that decide whether a
lead is worth calling first.

**Fix:** prefix these with `q_` at the call sites, or add them to the schema explicitly.

---

### B5. The staging site is publicly crawlable right now.
**Verified live at audit time:**

```
GET https://ss-website-bzx.pages.dev/            -> 200   (no Cloudflare Access challenge)
GET https://ss-website-bzx.pages.dev/robots.txt  -> 200   "User-agent: *  /  Allow: /"
     meta robots on the homepage: (none)
     canonical: https://scalingsocials.com/      (the only thing stopping this)
```

A full 104-page duplicate of the new site is open to Googlebot with `Allow: /`. The canonical is a
hint, not a directive. The runbook (`docs/DEPLOY-CLOUDFLARE.md` step 4) already prescribes the fix —
it has not been applied.

**Fix:** enable Cloudflare Access on the `*.pages.dev` hostname (10 minutes, per the runbook).
Do this **before** DNS cutover, not after.

---

## 2. HIGH — should be fixed before Monday

### H1. Two indexed old-WordPress URLs are missing from the redirect map and will 404 at cutover.
**File:** `public/_redirects` · `docs/spec/redirect-map.csv`

I pulled the live Yoast sitemap. The old site has 22 URLs. Two are in it, return 200 today, and have
no rule:

```
https://scalingsocials.com/hello-world/                                  -> 200, in post-sitemap.xml
https://scalingsocials.com/author/darkcyan-fox-581548-hostingersite-com/ -> 200, in author-sitemap.xml
```

Everything else in the old sitemap is covered. `/hello-world/` → `/blog/`,
the author archive → `/team/` (or `/about/`).

**Good news, and it changes the launch calculus:** the redirect mapping the checklist budgeted
"several hours" for is essentially done. There is no blog archive, no tag archives, and no attachment
pages. 20 of 22 URLs are already mapped, all as `301`, zero `302`s, zero chains.

### H2. The three highest-impression legacy case-study URLs still point at the hub, not at case studies.
**File:** `public/_redirects:25-29`

```
/₹1-4-million-in-3-months/   -> /case-studies/   (1490 impressions/12mo)
/₹1-million-in-90-days/      -> /case-studies/   (606)
/₹44-3-million-in-90-days/   -> /case-studies/   (284)
```

The CSV notes say *"Repoint to the real case study when it ships."* Seven case studies have shipped.
2,380 impressions are being pointed at an index page — which Google treats as a soft 404 signal.
Repoint each to the closest matching study.

### H3. `/lp/web-development/` ships an empty `<h2>` on a paid-traffic page.
**File:** `src/components/blocks/SiteShowcase.astro:46` · `src/layouts/LandingLayout.astro`

`SiteShowcase` renders `<h2 class="…">{heading}</h2>` unconditionally. `LandingLayout` passes an
empty string to suppress it (the layout already prints "Stores and sites we've built" above), so the
built HTML contains:

```html
<h2 class="mb-[var(--space-5)] max-w-[24ch] text-h2 font-semibold"></h2>
```

An empty heading directly under a real one, on the page you are about to buy traffic to.
**Fix:** `{heading && <h2>…</h2>}`.

### H4. `/teardowns/` renders its hero twice and has no content behind it.
**File:** `src/pages/teardowns/index.astro`

Heading tree:

```
h1  Honest teardowns of real D2C brands
h2  Honest teardowns of real D2C brands      <- identical text
```

The body paragraph is also duplicated with a one-word variation ("we pull apart" / "Scaling Socials
pulls apart"). The page is 128 words, is in the **main nav and the footer**, is in the XML sitemap,
and its only real content is *"The first teardown is publishing shortly."* That is a coming-soon page
in primary navigation — a classic thin-content/soft-404 pattern on a brand-new domain.

**Fix:** remove the duplicate block. Decide whether an empty section belongs in the nav on day one.

### H5. `/work/` is 57 words, sits in the main nav, and promises video it does not have.
**File:** `src/pages/work/index.astro` · `src/lib/creatives.ts:19-22`

The page's own copy and meta description say *"statics **and video** built to be tested"*. The glob in
`creatives.ts` matches `*.{png,jpg,jpeg,webp,avif}` only. The six `.mp4` files in
`src/assets/Creatives/` are gitignored (`.gitignore:11-13`) and were never wired up. **Zero video
files exist in `dist/`.** The page is a still-image gallery with three sentences of copy, in the nav
and the sitemap.

### H6. Client creative is published under named brands with permission still unconfirmed.
**File:** `src/lib/creatives.ts:1-10`

The file's own header says: *"Client permission is required before client creative appears
(02 §1.2) — **confirm before launch**."* It is not confirmed anywhere in the docs.

The alt text is derived from the filenames, so `/work/` publicly names eight clients alongside their
ad creative:

```
Avila International · Meraki · Sanmal · Senren · Tessuti · Tritiksha · Urbanrac  (+ one unnamed)
```

None of these appear on the logo wall, which carries a different roster. Given the standing anonymity
directive (four logos were removed from the marquee precisely because they identified case-study
accounts), publishing named client creative without a recorded permission is a legal/relationship
risk, not a nit. **This is a decision for you, not a code fix.**

### H7. `/technical-seo-audit-services/` is the only service page with no `Service` schema node.
**File:** `src/pages/technical-seo-audit-services/index.astro`

Every other service page emits `Organization, WebSite, Service, WebPage, BreadcrumbList, FAQPage`.
This one emits the same minus `Service`. It is also the thinnest commercial page on the site (805
words). `check:schema` passes because it validates shape, not completeness.

### H8. The two secrets the entire analytics plan depends on are not documented anywhere.
**File:** `docs/DEPLOY-CLOUDFLARE.md:52-59`

The env table is stale. It lists `PUBLIC_TURNSTILE_SITE_KEY` (unused — the sitekey is hardcoded at
`LeadForm.astro:157`) and files Meta/GA under *"(later) … when wired"*. They are wired. The names
actually read by `src/pages/api/lead.ts:71-81` are:

```
GA4_MP_API_SECRET     -> without it, server-side generate_lead never fires (silently)
META_CAPI_TOKEN       -> without it, the Meta CAPI Lead never fires (silently)
META_TEST_EVENT_CODE  -> if left set from testing, live conversions go to Test Events only
```

Both are guarded by `if (… && env.ga4Secret)` / `if (… && env.metaCapiToken)`, so a missing value
produces no error, no log, and no conversion. The same doc still claims *"the current `/api/lead.ts`
just logs and has a TODO for the upsert"* — that was true a week ago and is badly misleading now.

**Also check `META_TEST_EVENT_CODE` is unset in the Production environment before Monday.**

### H9. GA4 will mark every hit `debug_mode` if anyone lands on `www.` — including all of launch day.
**Files:** `src/scripts/analytics.ts:23-24, 36` · `src/pages/api/lead.ts:449-455`

Both the client bootstrap and the server-side Measurement Protocol call gate on an exact string:

```ts
const isProd = location.hostname === PROD_HOST;   // 'scalingsocials.com'
…
await sendGa4Lead(env.ga4Id, env.ga4Secret, lead, host !== 'scalingsocials.com');
```

`www.scalingsocials.com` is not equal to `scalingsocials.com`. Any traffic that reaches www before
the apex redirect fires is flagged `debug_mode: true` and **excluded from standard GA4 reports** — it
only appears in DebugView. The www → apex 301 is listed in PENDING §D as still outstanding
("Non-www + canonical enforcement at the edge"). If that rule is not live at cutover, launch-day
conversion data is lost.

**Fix:** gate on `hostname.endsWith('scalingsocials.com')`, and confirm the edge redirect exists.

### H10. Meta Pixel and Clarity have no host gate at all — the live pixel is being polluted right now.
**Files:** `src/scripts/meta.ts:15-47` · `src/scripts/clarity.ts:9-30` · `src/layouts/BaseLayout.astro:93-95`

`PENDING-WORK.md` §A6 states all three are "host-gated". Only GA4 is (and even then only into
`debug_mode`, not suppression). `meta.ts` calls `fbq('init', PIXEL_ID)` and `fbq('track','PageView')`
unconditionally; `clarity.ts` boots unconditionally.

Consequence: every visit to `ss-website-bzx.pages.dev` and every `npm run dev` session has been
firing real `PageView` / `FormStart` / `Lead` events into pixel `2381316206031576`. That contaminates
the audiences you are about to optimise campaigns against, and it is happening today.

---

## 3. MEDIUM — fix in the first week after launch

### M1. Four WCAG AA contrast failures on the homepage and both performance-marketing landing pages.
White/near-white text at 64–78% alpha on the case-study card grounds. Measured composited:

| Text | Foreground | Ground | Ratio | Needs |
|---|---|---|--:|--:|
| "Meta Ads · Jan – Jul 2026" (12px) | `#FFF @ 64%` | `rgb(79,82,219)` | **3.40** | 4.5 |
| "Mid-luxury women's western wear · …" (12px) | `#FFF @ 72%` | `rgb(79,82,219)` | **3.88** | 4.5 |
| "Past a ceiling it sat under for a year." (16px) | `#FFF @ 78%` | `rgb(79,82,219)` | **4.26** | 4.5 |
| "Meta Ads · May – Jul 2026" (12px) | `#EA…@ 64%` | `rgb(23,84,79)` | **4.19** | 4.5 |

Everything else I sampled passes. **Fix:** raise the alpha on card meta text (0.85+ clears it).

### M2. All five `/vs/` pages ship the comparison matrix twice in the HTML.
A card stack (mobile) and a `<table>` (desktop) both render the same content; CSS hides one per
breakpoint but **both are in the served HTML**. Confirmed in the DOM on
`/vs/advantage-plus-vs-manual/`. Crawlers see the entire matrix, plus the intro sentence
*"The winning setup is usually a mix…"*, duplicated on the page.

### M3. Pagefind ships 1.3 MB of search index that nothing uses.
`npm run build` runs `pagefind --site dist` and writes 104 fragments to `dist/pagefind/`.
`grep -rn "pagefind" src/` returns **nothing**, and `/blog/` has no search input in the DOM.
CLAUDE.md §2 lists "blog search" as a sanctioned React island; it does not exist. Either build the
search or drop the step.

### M4. Three landing pages request the page itself as an image.
`<img class="lp-lightbox__img" data-lightbox-img src="" alt="">` — an empty `src` resolves to the
document URL, so the browser re-fetches the page as an image on load. This is what `check:perf`
reports as *"has an `<img>` without explicit width/height (CLS risk)"* on all three `/lp/` pages.
**Fix:** omit the `src` attribute entirely and set it on open.

### M5. `llms.txt` makes two claims the site does not support.
**File:** `dist/llms.txt` (generated) — the source strings live in the llms builder.

```
- [Case studies](…): Real, attributed result tables.     <- the studies are deliberately anonymised
- [Creative gallery](…): Ad creatives with results attached.  <- /work/ attaches no results at all
```

This file exists specifically to be read by AI crawlers. Two of its five "Explore" lines misdescribe
the page they point at.

### M6. Six commercial pages are under 1,000 words; the spec target is 2,200–3,000.

| Page | Words |
|---|--:|
| `/technical-seo-audit-services/` | 805 |
| `/ecommerce-seo-services/` | 932 |
| `/local-seo-services-bangalore/` | 938 |
| `/shopify-store-redesign-services/` | 959 |
| `/shopify-store-migration-services/` | 991 |
| `/shopify-speed-optimisation-services/` | 983 |

Only `/meta-ads-agency-india/` (2,376) is near the target. Note the cluster page is **larger than its
own pillar** (`/performance-marketing-agency-bangalore/`, 1,388) — worth rebalancing.

### M7. Commercial pages with fewer than five editorial inbound links.
Counting links inside `<main>` only (header/footer nav excluded):

| Page | Editorial inbound |
|---|--:|
| `/industries/*` (all five) | 2 each |
| `/vs/agency-vs-freelancer/`, `/vs/in-house-vs-agency/`, `/vs/seo-vs-performance-marketing/` | 2 each |
| `/team/*` (all four) | 2 each |
| `/work/`, `/teardowns/` | 2 each |
| `/vs/shopify-vs-woocommerce/` | 3 |
| `/answer-engine-optimisation-services/` | 4 |
| `/local-seo-services-bangalore/` | 4 |
| `/shopify-store-migration-services/` | 4 |
| `/shopify-store-redesign-services/` | 4 |
| `/vs/advantage-plus-vs-manual/` | 4 |
| `/about/` | **1** |

`/industries/` and `/vs/` are footer-only (not in the main nav), which is why their children are
starved. `/about/` having one editorial inbound link on a site selling trust is an odd gap.

### M8. Keyword cannibalisation — two genuine pairs.

| Pair | Overlap | Recommendation |
|---|--:|---|
| `/glossary/cvr/` vs `/glossary/landing-page-cvr/` | 0.60 | **`/glossary/cvr/` wins.** Fold landing-page CVR into it as a section, 301 the other. |
| `/glossary/blended-roas/` vs `/glossary/mer/` | 0.45 | Near-synonyms. **`/glossary/mer/` wins** (the term operators search); make blended-ROAS a redirect or an explicit "also called" section. |

Secondary, worth watching rather than fixing: `/industries/*` vs
`/performance-marketing-agency-bangalore/` (0.30–0.41 — the industry pages reuse the pillar's
positioning paragraph nearly verbatim), and `/vs/agency-vs-freelancer/` vs `/vs/in-house-vs-agency/`
(0.28).

### M9. Deploy runbook is stale in three places beyond H8.
`docs/DEPLOY-CLOUDFLARE.md` still describes `/api/lead.ts` as unimplemented, lists an env var that is
no longer read, and predates the analytics stack. Anyone following it on Monday will mis-configure
the project.

### M10. `/contact/` renders no `LocalBusiness` / `ProfessionalService` node.
The homepage carries `ProfessionalService`; `/contact/` carries only `Organization`. PENDING §F
specifically calls for LocalBusiness on `/contact` matching the Google Business Profile. Low cost,
and it is the page that shows the NAP.

### M11. `robots.txt` disallows `/lp/`.
Intentional (the pages are `noindex, nofollow`), and `AdsBot-Google` ignores `User-agent: *`, so
Google Ads itself is unaffected. But it means Google can never *see* the `noindex`, and some ad
review flows do fetch as a generic crawler. Worth a conscious confirmation rather than an assumption.

---

## 4. LOW — backlog

- **L1.** `/thank-you/` (36 words) and `/404` (44 words) have no canonical and no `og:image`. Both are
  `noindex` so this is cosmetic, but `/thank-you/` is in the old-site GSC data with 153 impressions.
- **L2.** Two titles exceed 60 characters *as raw HTML* only because `&amp;` counts as five
  characters. Rendered they are 57 and 58. No action needed — noted so nobody "fixes" it.
- **L3.** Three descriptions are outside 140–160: `/404` (101), `/styleguide/` (69), `/thank-you/`
  (67). All three are `noindex`.
- **L4.** Three footer legal links are under 44px wide (31/37/42px) though all are 44px tall.
  Passes WCAG 2.5.8; below Apple's guidance.
- **L5.** Five phone renderings use spaces (`+91 96067 13608`) against 209 using hyphens. Same number,
  cosmetic inconsistency only. Email (317 instances), address (100), and the WhatsApp number are
  100% consistent. The GST/legal address correctly appears nowhere.
- **L6.** `src/lib/logos.ts:9` says *"The folder is currently empty, so LOGOS is []"* — there are now
  12 logos. Stale comment.
- **L7.** Stray empty directory in the repo root from a mis-escaped `mkdir`:
  `{src/{styles,components/{primitives,blocks,islands,seo},layouts,lib/schema,content},public,scripts}`.
  Untracked, harmless, delete it.
- **L8.** One creative has no derivable brand name and falls back to `alt="Ad creative sample"`.
- **L9.** Compact (hero) forms announce each field label three times to a screen reader: an
  `sr-only` `<span>`, the `aria-label`, and the empty `<option>` text. Also the required `*` is
  invisible in compact mode because it lives inside the `sr-only` span.
- **L10.** Seven HTML documents exceed the 100 KB *warn* threshold (homepage 164 KB, styleguide
  185 KB). Warn, not fail; the enforced JS budget passes at 10.1 KB / 60 KB on content pages and
  70.3 KB / 140 KB on the heaviest tool page. Inline SVG gzips well — revisit only if field LCP suffers.
- **L11.** `astro check` reports 5 hints: four unused variables
  (`scripts/check-gotchas.mjs:51`, `CaseVisual.astro:97,124`, `about/index.astro:12` imports `Prose`
  without using it) and one deprecation (`document.execCommand` at `contact/index.astro:128`).
- **L12.** `/audit/` and `/contact/` collect no `name` in step 1, so an abandoned-lead partial has
  email + phone but no name. Deliberate (short step 1), noted for the alert email's "who" field.

---

## 5. Page-by-page table

**Human-read score (1–5).** Assigned by reading the pages, not by word count. The automated
lexical pass found the site remarkably clean: across 104 pages there are **7 uses of "tailored", one
"leverage", one "bespoke", one "when it comes to", zero filler openers, zero
"it's not just X, it's Y" constructions, and two rhetorical-question openers.** For comparison, a
typical agency site scores 30–60 lexicon hits per 1,000 words; this site's worst page scores **1.2**.
Where scores drop it is never vocabulary — it is **template uniformity** (every page in a set built
to an identical shape) or **absence of content**.

| Page set | Read | Why |
|---|:-:|---|
| Blog posts (10) | **5** | Opinionated, specific, named mechanisms, real numbers. Titles like "Ask your agency for their worst month" are not machine-written. |
| Guides (3) | **5** | Rupee-denominated worked examples throughout. |
| Service pillars & clusters (15) | **4** | Genuinely good. One tell: the closing FAQ block frequently restates a body section almost verbatim — `/ecommerce-seo-services/` answers "Does SEO work with my paid ads?" with the same claim as its "SEO and paid pull in the same direction" section; `/technical-seo-audit-services/` answers "What does a technical SEO audit cover?" by relisting the "What the audit covers" grid. A section ending by restating itself is the single most common structural tell on this site. |
| Case studies (7) | **4** | Real before→after tables. Identical seven-beat structure across all seven, which reads as a template rather than seven stories. |
| Homepage, `/audit/`, LP pages | **4** | Strong. `/lp/*` carries all 7 of the "tailored" hits and the two rhetorical-question openers. |
| Glossary (25) | **3** | Every page: definition → "How X is calculated" → "A worked example" → "Common mistakes" (always exactly three) → "Work the number" → related terms. The content is correct and the rupee examples are real, but 25 pages of identical scaffolding with shared phrasing ("explains the formula, a worked rupee example") is a scaled-content pattern. |
| `/vs/` (5) | **3** | Same shape five times: comparison matrix → "When A wins" (4 bullets) → "When B wins" (4 bullets) → "The honest take" → 2 FAQs. Every bullet list is exactly four items. Compounded by M2 (matrix duplicated in the DOM). |
| `/industries/` (5) | **3** | Same shape five times, and the positioning paragraph is near-verbatim from the performance-marketing pillar (0.30–0.41 token overlap). Each carries exactly three "How we run it" cards — a triadic list per page, five pages running. |
| `/team/*` (4) | **2** | 88–96 words each. Identical template: discipline line → "Background" → one credential sentence → "He is the person clients call when…" → three service chips. Indexable, in the sitemap, 2 inbound links each. |
| `/teardowns/` | **2** | 128 words, duplicated hero, "publishing shortly". |
| `/work/` | **2** | 57 words. |

**Bottom five:** `/work/` (57w) · `/teardowns/` (128w) · `/team/*` (88–96w) · `/industries/*` ·
`/vs/*`.

**Em-dash density** (flagged above ~1 per 150 words): `/vs/in-house-vs-agency/` 1 per 55 ·
`/team/` 1 per 57 · `/sitemap/` 1 per 58 · `/styleguide/` 1 per 63 · `/vs/advantage-plus-vs-manual/`
1 per 69 · `/answer-engine-optimisation-services/` 1 per 84, plus 20 more between 1-per-89 and
1-per-150. Full list in the appendix note below. This is the one stylistic tell that is systemic.

### Full route inventory

104 routes build. 97 are in the XML sitemap; the 7 omissions are all `noindex` by design
(`/404`, `/thank-you/`, `/styleguide/`, four `/lp/` pages). **Zero orphans, zero broken internal
links, zero broken in-page anchors, zero sitemap entries without a page, zero indexable pages missing
from the sitemap.** All 104 canonicals point at `https://scalingsocials.com` — **no `pages.dev`
anywhere in `src/`, `public/` or `dist/`.**

| URL | Type | Words | Nav | Footer | Sitemap | noindex |
|---|---|--:|:-:|:-:|:-:|:-:|
| `/` | home | 2206 | Y | Y | Y | |
| `/about/` | company | 800 | Y | Y | Y | |
| `/audit/` | company | 677 | Y | | Y | |
| `/contact/` | company | 186 | Y | Y | Y | |
| `/performance-marketing-agency-bangalore/` | service | 1388 | Y | Y | Y | |
| `/meta-ads-agency-india/` | service | 2376 | | | Y | |
| `/google-ads-agency-bangalore/` | service | 1027 | | | Y | |
| `/seo-agency-bangalore/` | service | 1142 | Y | Y | Y | |
| `/ecommerce-seo-services/` | service | 932 | | | Y | |
| `/technical-seo-audit-services/` | service | 805 | | | Y | |
| `/local-seo-services-bangalore/` | service | 938 | | | Y | |
| `/answer-engine-optimisation-services/` | service | 1087 | | | Y | |
| `/shopify-development-company-bangalore/` | service | 1107 | Y | Y | Y | |
| `/shopify-store-migration-services/` | service | 991 | | | Y | |
| `/shopify-speed-optimisation-services/` | service | 983 | | | Y | |
| `/shopify-store-redesign-services/` | service | 959 | | | Y | |
| `/web-development-company-bangalore/` | service | 1173 | Y | Y | Y | |
| `/social-media-marketing-agency-bangalore/` | service | 1128 | Y | Y | Y | |
| `/conversion-rate-optimisation-services/` | service | 1038 | Y | Y | Y | |
| `/case-studies/` | index | 448 | Y | Y | Y | |
| `/case-studies/womenswear-breaking-the-ceiling/` | case study | 692 | | | Y | |
| `/case-studies/womens-fashion-account-turnaround/` | case study | 712 | | | Y | |
| `/case-studies/wellness-brand-zero-to-scale/` | case study | 666 | | | Y | |
| `/case-studies/kids-accessories-seven-month-floor/` | case study | 690 | | | Y | |
| `/case-studies/kidswear-campaign-longevity/` | case study | 660 | | | Y | |
| `/case-studies/indo-western-launch-90-days/` | case study | 674 | | | Y | |
| `/case-studies/gifting-brand-new-concept-launch/` | case study | 658 | | | Y | |
| `/work/` | index | **57** | Y | Y | Y | |
| `/teardowns/` | index | **128** | Y | Y | Y | |
| `/industries/` | index | 148 | | Y | Y | |
| `/industries/fashion-apparel/` | industry | 642 | | | Y | |
| `/industries/kids-baby/` | industry | 565 | | | Y | |
| `/industries/wellness-health/` | industry | 559 | | | Y | |
| `/industries/gifting/` | industry | 556 | | | Y | |
| `/industries/beauty-cosmetics/` | industry | 545 | | | Y | |
| `/vs/` | index | 159 | | Y | Y | |
| `/vs/agency-vs-freelancer/` | comparison | 669 | | | Y | |
| `/vs/in-house-vs-agency/` | comparison | 657 | | | Y | |
| `/vs/shopify-vs-woocommerce/` | comparison | 610 | | | Y | |
| `/vs/seo-vs-performance-marketing/` | comparison | 579 | | | Y | |
| `/vs/advantage-plus-vs-manual/` | comparison | 548 | | | Y | |
| `/blog/` | index | 538 | Y | Y | Y | |
| `/blog/who-we-turn-down-and-why/` | blog | 898 | | | Y | |
| `/blog/meta-ads-traffic-but-no-sales/` | blog | 885 | | | Y | |
| `/blog/when-to-scale-spend-and-when-to-hold/` | blog | 866 | | | Y | |
| `/blog/first-90-days-of-a-new-d2c-ad-account/` | blog | 857 | | | Y | |
| `/blog/what-to-fix-before-blaming-the-ads/` | blog | 844 | | | Y | |
| `/blog/why-5x-in-30-days-is-a-red-flag/` | blog | 844 | | | Y | |
| `/blog/creative-that-survives-repetition/` | blog | 827 | | | Y | |
| `/blog/in-house-versus-outsourced-agency-work/` | blog | 791 | | | Y | |
| `/blog/what-realistic-roas-looks-like/` | blog | 779 | | | Y | |
| `/blog/ask-your-agency-for-their-worst-month/` | blog | 778 | | | Y | |
| `/guides/` | index | 225 | Y | Y | Y | |
| `/guides/d2c-unit-economics/` | guide | 1482 | | | Y | |
| `/guides/meta-ads-creative-testing/` | guide | 1289 | | | Y | |
| `/guides/shopify-store-speed/` | guide | 1160 | | | Y | |
| `/glossary/` | index | 790 | Y | Y | Y | |
| `/glossary/*` (25 terms) | glossary | 372–418 | | | Y | |
| `/tools/` | index | 156 | Y | Y | Y | |
| `/tools/shopify-speed-grader/` | tool | 340 | | | Y | |
| `/tools/meta-ads-budget-planner/` | tool | 316 | | | Y | |
| `/tools/d2c-cac-payback-calculator/` | tool | 269 | | | Y | |
| `/tools/break-even-roas-calculator/` | tool | 246 | | | Y | |
| `/team/` | index | 229 | Y | Y | Y | |
| `/team/maaz-khan/` | author | 96 | | | Y | |
| `/team/khushal-sharma/` | author | 92 | | | Y | |
| `/team/tayeb-khan/` | author | 92 | | | Y | |
| `/team/jamal-khan/` | author | 88 | | | Y | |
| `/privacy/` | legal | 1492 | | Y | Y | |
| `/terms/` | legal | 880 | | Y | Y | |
| `/disclaimer/` | legal | 853 | | Y | Y | |
| `/cookie-policy/` | legal | 360 | | Y | Y | |
| `/sitemap/` | utility | 463 | | Y | Y | |
| `/lp/performance-marketing/` | landing (ad) | 2221 | | | | Y |
| `/lp/performance-marketing/b2b/` | landing (ad) | 2216 | | | | Y |
| `/lp/web-development/` | landing (ad) | 1410 | | | | Y |
| `/lp/performance-marketing/thanks/` | landing (ad) | 80 | | | | Y |
| `/styleguide/` | utility | 2193 | | | | Y |
| `/404` | utility | 44 | | | | Y |
| `/thank-you/` | utility | 36 | | | | Y |

---

## 6. What passed — so the blockers are read in proportion

I want the honest assessment below to be read against what is actually solid, because most of it is.

- **SEO hygiene: essentially perfect.** 104 unique titles, 104 unique meta descriptions, all
  canonicals absolute and non-www and production-domain, one `<h1>` per page, no skipped heading
  levels anywhere, no accidental `noindex`, `robots.txt` correct and AI-crawler-friendly, RSS + JSON
  feed + `llms.txt` + HTML sitemap all present and generated from the same source as the routes.
- **Links:** 0 broken internal, 0 broken anchors, 0 orphans, 18 external links (all four I tested
  resolve 200, including `careers.scalingsocials.com`, which is a footer link on all 104 pages *and*
  the 301 target for the old `/careers/` page's 2,147 impressions).
- **Images: 757 `<img>` tags, zero missing an `alt` attribute.** Three assets over 200 KB (max
  215 KB), 161 of 178 images in WebP, explicit `width`/`height` everywhere except the three
  lightbox placeholders in M4.
- **Schema:** 100 `@graph` blocks, all parse, all nodes carry `@id`. Only four pages have no JSON-LD
  and all four are `noindex`.
- **CSP:** one unified policy across 104 pages, 223 inline blocks hash-verified, no `unsafe-inline`,
  no `unsafe-eval`. Security headers (HSTS preload, DENY, nosniff, COOP, Permissions-Policy,
  `no-store`+`noindex` on `/api/*`) all present.
- **Secrets: clean.** `.ga-creds.json` is gitignored and was never committed (`git log --all` on the
  path is empty). No key-shaped strings in any tracked file. Working tree clean.
- **Responsive:** no horizontal overflow at 320px, 360px or 375px, confirmed both by the real
  WebKit+Chromium gate and by direct measurement. Only 3 tap targets under 44px, all 44px tall.
- **Code health:** 0 TypeScript errors, 0 `astro check` warnings, **0 unused components**, no
  `console.log` left in `src/`, no commented-out blocks, no hardcoded proof stats outside
  `proofStats.ts`.
- **Contact details:** phone, email, address and WhatsApp number consistent across all 104 pages;
  the GST/legal address appears nowhere on the site, in schema, or in any generated file.
- **404 page:** styled, `noindex`, real `h1`, six links back into the site.
- **Performance posture:** LCP element is the `<h1>`; fonts self-hosted, preloaded, `font-display:
  swap`, 36 KB + 54 KB; CSS 32.6 KB total; React loads on four tool pages only; all third-party
  scripts deferred.
- **And the redirect map is far better than the checklist assumed** — see H1.

---

## 7. Honest assessment: is this ready to replace a live, ranking WordPress site on Monday?

**On SEO migration risk: yes. On lead capture: no — and that is the thing that actually costs you money.**

Let me separate the two, because they are usually conflated in a launch decision and here they point
in opposite directions.

**The migration itself is low-risk, lower than the checklist assumed.** I pulled the live Yoast
sitemap during this audit. The old site has **22 URLs** — one real post (`/hello-world/`), 19 pages,
one empty category archive, one author archive. There is no blog archive, no tag archives, no
attachment pages, no five years of content to map. Twenty of those 22 already have `301` rules, none
are `302`, and there are no chains. Two are missing (H1) and three point at a hub instead of a
specific page (H2). That is **under an hour of work**, not the several hours the plan budgeted. The
canonicals, sitemap, `robots.txt`, schema and internal linking are in better shape than the site
you are replacing — which, per your own crawl notes, currently has pages with no `<h1>` at all, a
CTA band used as an `<h1>` on three pages, a live 404 linked from its own homepage, and a
competitor's name in an FAQ. **You are not putting rankings at risk by shipping this. You are
removing risk.**

**The lead pipeline is the reason I would not ship on Monday as it stands.** Five findings compound
into one failure mode: a visitor fills in the form, sees "Thanks, we've got it", the Meta `Lead`
pixel fires and reports a conversion — and nothing is stored, nothing is emailed, and nothing is
logged. That happens on a rejected email format, an over-long message, or *any* Turnstile error
including a transient network one (B1, B2). Layered on top, every lead that *does* arrive has no
`utm_source`, no `gclid`, no `fbclid` (B3), and on `/audit/` — your primary conversion page — no
budget, no category, no URL, and consequently a lead score that mathematically cannot reach "Hot"
(B4). You are planning to point paid spend at this site. On day one you would be optimising Meta and
Google campaigns against a conversion signal that fires on submissions you never received, for leads
you cannot attribute to a campaign. That is worse than having no tracking, because it looks like it
works.

**What specifically is not ready:**

1. `/api/lead` acknowledges leads it discards, and the client believes it.
2. Turnstile fails closed and silently.
3. Campaign attribution is stripped on all 25 form pages.
4. `/audit/` and `/lp/*` qualifying answers are stripped; lead scoring is broken as a result.
5. The staging site is open to Google today, with `Allow: /` and no Access lock.
6. Meta Pixel and Clarity fire from staging and localhost into the live pixel.
7. Two indexed legacy URLs will 404 at cutover.
8. `GA4_MP_API_SECRET` and `META_CAPI_TOKEN` are not documented; if either is unset in Cloudflare,
   the conversions disappear with no error.

**My recommendation.** B1–B4 are all in two files (`src/pages/api/lead.ts`, `src/scripts/leadform.ts`)
and are, between them, maybe half a day of focused work plus a real end-to-end test on the deployed
preview — submit a lead with UTMs on the URL, confirm the row in Supabase carries them, confirm the
alert email shows the budget, confirm GA4 and Meta Events Manager each register exactly one Lead.
B5 is ten minutes. H1, H2, H3, H8, H9, H10 are each under an hour.

That is a realistic Sunday. **If you get all of Part 1 plus H1, H2, H8, H9 and H10 done and verified
on the preview by Sunday evening, ship Monday** — the content findings in Part 3 are all
post-launch work and none of them threaten a ranking.

**If any blocker is still open on Monday morning, wait a week.** Not because the site is bad — it is
genuinely better than what it replaces — but because the specific thing that is broken is the thing
the launch exists to produce. The old site is costing you nothing by staying up seven more days. A
week of paid traffic landing on a form that says "thanks" and throws leads away costs you real money
and real customers, and you would not find out for weeks, because every signal you are watching would
say it was working.

**One thing that is not a code decision and needs you:** H6. Eight named clients' ad creative is
published on `/work/` and the file that renders it carries an explicit unresolved note that
permission must be confirmed before launch. Please settle that before Monday either way.

---

### Appendix — em-dash density, full list

Pages exceeding roughly one em-dash per 150 words, worst first:
`/vs/in-house-vs-agency/` 12/657w (1:55) · `/team/` 4/229 (1:57) · `/sitemap/` 8/463 (1:58) ·
`/styleguide/` 35/2193 (1:63) · `/vs/advantage-plus-vs-manual/` 8/548 (1:69) ·
`/answer-engine-optimisation-services/` 13/1087 (1:84) ·
`/case-studies/womens-fashion-account-turnaround/` 8/712 (1:89) ·
`/case-studies/gifting-brand-new-concept-launch/` 7/658 (1:94) · `/lp/web-development/` 15/1410 (1:94) ·
`/vs/agency-vs-freelancer/` 7/669 (1:96) · `/shopify-store-redesign-services/` 10/959 (1:96) ·
`/case-studies/indo-western-launch-90-days/` 7/674 (1:96) · `/technical-seo-audit-services/` 8/805 (1:101) ·
`/meta-ads-agency-india/` 23/2376 (1:103) · `/industries/beauty-cosmetics/` 5/545 (1:109) ·
`/industries/wellness-health/` 5/559 (1:112) · `/industries/kids-baby/` 5/565 (1:113) ·
`/case-studies/kids-accessories-seven-month-floor/` 6/690 (1:115) · `/vs/shopify-vs-woocommerce/` 5/610 (1:122) ·
`/industries/fashion-apparel/` 5/642 (1:128) · `/glossary/attribution-window/` 3/388 (1:129) ·
`/ecommerce-seo-services/` 7/932 (1:133) · `/case-studies/wellness-brand-zero-to-scale/` 5/666 (1:133) ·
`/industries/gifting/` 4/556 (1:139) · `/vs/seo-vs-performance-marketing/` 4/579 (1:145) ·
`/google-ads-agency-bangalore/` 7/1027 (1:147).
