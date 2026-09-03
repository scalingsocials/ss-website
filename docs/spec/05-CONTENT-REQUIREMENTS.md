# 05 — Content Requirements (Your Side)

This is the document that decides whether the site is good or just fast. Claude Code can build
every page in this pack in a few weeks. It cannot know what actually happened inside your ad
accounts, and it cannot invent your point of view without producing exactly the generic copy
that is already failing on your current site.

**Start collecting on day one, in parallel with the build.** Content is the long pole.

---

## The pipeline — mandated roles

**Khan records raw audio. He does not write.**

A dedicated **content editor / transcriber** owns everything from audio to merged MDX. This role
is mandatory and full-time from 3 September. It exists because the founder is the bottleneck in
every project shaped like this, and the September launch cannot survive that.

```
Khan records          phone, unstructured, rambling is fine, no prep
  ↓
Transcriber           transcribes, then drafts into the template
  ↓
Claude Code           formats to MDX — frontmatter, schema, internal links, keywords
  ↓
Khan approves         gist level only. Not line edits.
  ↓
Merged
```

**Khan's total obligation:** record the prompts in section B, and approve at gist level. He does
not draft, does not edit, does not review word by word. If he is writing copy, the pipeline has
failed.

**Transcriber's obligation:** never invent a number, a client name, or a claim that was not in
the recording. Where the recording is thin, leave `TODO: [what is missing]` and flag it — do not
fill the gap with plausible-sounding filler. Filler that ships is how the current site ended up
with another agency's name in its own SEO copy.

**Wave 1 exception.** No audio exists yet, so Wave 1 service copy is drafted from the existing
`/performance-marketing-agency-bangalore/` page plus Khan's locked headline numbers,
restructured to the template. It gets replaced wave by wave as recordings land. For the
5 September launch, Khan's minimum is the three headline numbers and 45 minutes of B1.

---

## The rule that makes the content unique

Generic agency copy comes from writing about the *category*. Unique copy comes from writing
about *specific things that happened*. Every request below is a request for a specific thing
that happened.

The practical method: **do not write. Talk.** Record voice notes answering the prompts below,
send the transcripts, and let them be edited into copy. Your spoken explanation of why a
campaign failed is worth more than any amount of drafted prose, because it contains the
specifics and the opinions that no competitor and no language model can reproduce.

---

## A. Blockers — the build cannot ship without these

| # | Item | Format | Owner | Why blocking |
|---|---|---|---|---|
| A1 | **Client permissions** for 8 case studies | Signed email or WhatsApp confirmation per client | You | Build fails on `client_permission_granted: false`. Offer a backlink from their site in exchange. |
| A2 | **Real campaign data** for those 8 | Spreadsheet: brand, category, start/end date, spend, revenue, ROAS, CAC, AOV, CVR — before and after | You / account managers | The case study template requires a results table |
| A3 | **Verified headline stats** | Total ad spend managed (exact), number of brands (exact), average ROAS (with the method used to calculate it), founding date | You | Three different ROAS numbers currently appear across your site. Pick the real ones. |
| A4 | **Logo** | 512×512 PNG transparent + SVG | You | Schema, favicon, OG images |
| A5 | **Real NAP** | Confirmed email, phone, address, exact GBP rooftop coordinates | You | Entity graph |
| A6 | **Social URLs** | All live profile URLs, plus GBP link | You | `sameAs` array |
| A7 | **Supabase credentials + table access** | Env vars | Dev team | Lead capture |
| A8 | **Old site crawl** | Screaming Frog export of every live URL | You / dev | 301 map |
| A9 | **Pricing** | Starting price per service, and what moves it | You | Pricing transparency block. Decide now whether you'll publish. My recommendation: yes. |

---

## B. Your voice — record these (about 4 hours total)

Record on your phone. Rambling is fine. Do not prepare. The value is in the tangents.

### B1 — Founder POV (45 min)
1. Why did you and Jamal start Scaling Socials? What was broken about the agencies you'd seen?
2. What is the single most common mistake you see Indian D2C brands make with Meta ads?
3. What do you believe about performance marketing that most agencies in Bangalore would
   disagree with?
4. Describe a client you fired, or should have fired. Why?
5. What kind of brand should *not* hire you?
6. What is the thing clients ask for that you refuse to do?

### B2 — Per case study (20 min each × 8)
1. What was the state of the account when you took over? Actual numbers.
2. What did you *think* was wrong at first — and were you right?
3. What was the first thing you changed, and what happened?
4. What failed? What did you test that didn't work?
5. What was the turning point?
6. What would you do differently if you started that account today?
7. Where are they now?

Answer 4 and 6 honestly. The admission of what failed is the most credible content on a case
study page and no competitor will publish it.

### B3 — Per service pillar (25 min each × 6)
1. Explain this service to a founder who has never bought it, in plain language.
2. What do agencies charge for this and what does it actually cost to deliver?
3. What are the three ways this goes wrong?
4. How do you know within 30 days whether it's working?
5. What questions should a founder ask any agency before hiring them for this?

### B4 — Objection handling (30 min)
Sit with Harsh and Vinay. List the 20 objections and questions they hear most on calls, with
the answers that actually work. These become FAQ blocks across the site — real questions,
real language, which is exactly what matches real search queries.

---

## C. Proof assets

| # | Item | Notes |
|---|---|---|
| C1 | Dashboard screenshots | Meta Ads Manager, Google Ads, Shopify Analytics, GA4 — showing real numbers. Redact client names where needed but keep the numbers visible. **Blur nothing that matters.** These are the single most convincing thing on a case study. |
| C2 | Before/after creative | The ads that failed and the ads that won, side by side |
| C3 | Before/after site screenshots | For Shopify and web dev case studies |
| C4 | Client video testimonials | 60–90 seconds, phone camera is fine. Ask 3 questions: what was the problem, what changed, would you recommend. Six of these beat sixty written testimonials. |
| C5 | Written testimonials with permission to name | You already have Pooja (Rangloom), Juhi (Lille Barn), Param (Younglings), Nikunj (Timri), Kruthik, Gaurav — get permission to use full names, company, and photo |
| C6 | Client logos | SVG or high-res PNG, with written permission to display |
| C7 | Team photos | Consistent lighting and framing, plain background. Every person on the team page. |
| C8 | Office photos | For the GBP profile and About page. Real office, not stock. |
| C9 | Certifications | Google Partner, Meta Business Partner, Shopify Partner badges and certificate IDs. If you claim "Google-certified media buyers" on the site, show the certificates. |

---

## D. The Benchmark Index dataset — the big one

This is the highest-value item in this entire document. Budget a full week of analyst time.

### D1 — Data extraction
Export from every managed ad account you have permission to include:

- Account-level monthly aggregates for the last 8 quarters
- Per account: category, platform, monthly spend, impressions, clicks, CTR, CPM, CPC,
  conversions, conversion value, ROAS, AOV
- Strip every identifier. Store the mapping separately and privately.

### D2 — Aggregation rules
- Group by: platform × category × spend band × quarter
- Report median and interquartile range, **not** mean. Means are distorted by outliers and
  reporting a median with an IQR signals statistical competence, which is the whole point.
- Suppress any cell with fewer than 5 accounts. State the suppression rule publicly.
- Publish total spend and total account count in the sample.

### D3 — Consent
Add a clause to your client agreement permitting aggregated, anonymised inclusion. For
existing clients, a short email opt-in. Do not publish without it.

### D4 — Methodology write-up
One page, honest, covering: sample composition, date range, what's excluded, how ROAS was
calculated (platform-reported vs. Shopify-attributed — say which), known biases (your client
base skews toward certain categories and spend levels — say so), and the suppression rule.

Publishing limitations honestly is what makes it citable rather than dismissible.

### D5 — Commentary
Per quarter, 800–1,200 words from you on what the numbers mean and what changed. This is the
part that gets quoted.

---

## E. Content production plan — first 90 days

Do not try to write 95 pages before launch. Launch with the commercial core complete and
build the library on a cadence.

**At launch (Weeks 1–9)**
- 6 service pillars — full, from your B3 recordings
- 12 service cluster pages — shorter, 900–1,200 words each
- 6 industry pages
- 8 case studies — from B2
- 25 glossary terms — templated, but every one with an Indian rupee worked example
- 10 blog posts
- 3 guides
- Benchmark Index v1
- 3 teardowns
- About, Team, Contact, Partners

**Post-launch cadence**
- 2 blog posts per week
- 1 teardown per month
- 1 case study per month
- Benchmark Index refresh every quarter
- Quarterly refresh of the top 10 pages (update the dates — recency is a ranking and citation
  factor)

### First 10 blog posts — write these, in this order

Chosen because each is (a) something you can answer from experience, (b) a real query with
intent, and (c) likely to be retrieved by an LLM answering a founder's question.

1. What ROAS do you actually need to be profitable? A margin-by-margin breakdown for Indian D2C
2. Meta Ads CPM in India: what brands in each category are really paying *(pulls from the Index)*
3. Why your Meta reported ROAS doesn't match your Shopify revenue — and how to reconcile them
4. The real cost of running Meta ads in India in 2026: agency fees, ad spend, creative, tools
5. Advantage+ Shopping vs manual campaign structure: what we found across 40 Indian D2C accounts
6. Your Shopify store converts at 0.9%. Here are the seven things to fix, in order
7. CAC benchmarks for Indian D2C by category *(pulls from the Index)*
8. How to audit an agency before you hire them: 12 questions and the answers to listen for
9. Creative testing framework: how to find a winning angle in 14 days on a ₹2L budget
10. WhatsApp retention flows for Indian D2C: the four flows that pay for themselves

Note the pattern: every title contains a number, a specific market, or a concrete claim.
None of them could have been written by an agency that hadn't run the accounts.

---

## F. Writing standards

Give this section to whoever writes, including Claude Code.

**Do**
- Lead with the answer. First 50 words say the thing.
- Use real numbers with sources and dates.
- Name the subject in each section: "Scaling Socials found…" not "we found…"
- Write in Indian units. ₹2L, ₹1.5Cr. Never "₹1 Million" — no Indian founder says that.
- Short paragraphs. 2–4 sentences.
- Use tables for anything comparable.
- State tradeoffs and downsides honestly, including where you're not the right fit.
- Cite primary sources with real outbound links.

**Don't**
- "In today's competitive digital landscape"
- "We are passionate about delivering results"
- "Data-driven" as a standalone claim with no data attached
- Unattributed round numbers
- Emoji as icons
- Any sentence that would be equally true of every agency in Bangalore

**The test for every paragraph:** could a competitor paste this onto their own site and have it
still be true? If yes, it is not content. Delete it or make it specific.

---

## G. Quick checklist for you

```
□ Book 8 client permission conversations this week
□ Export the case study numbers into a shared sheet
□ Decide the three headline stats and never change them
□ Record B1 (45 min) — do this today, it unblocks the homepage and About
□ Get the Screaming Frog crawl of the old site
□ Confirm exact founding date, address, coordinates, and NAP
□ Decide: are you publishing pricing? (recommend yes)
□ Assign an analyst to the Benchmark data extraction
□ Add the aggregated-data consent clause to your contract template
□ Book a photographer for team + office (half day)
□ Start collecting the 20 objections from Harsh and Vinay
```
