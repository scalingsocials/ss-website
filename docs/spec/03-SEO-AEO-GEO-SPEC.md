# 03 — SEO, AEO, and GEO Specification

Three overlapping disciplines. Definitions as used in this document:

- **SEO** — ranking a page in the classic ten blue links.
- **AEO (Answer Engine Optimization)** — getting your content lifted into Google AI Overviews,
  featured snippets, People Also Ask, and voice answers. The unit of success is *an extracted
  passage*, not a ranking position.
- **GEO (Generative Engine Optimization)** — getting your brand named and your URL cited
  inside ChatGPT, Perplexity, Claude, Gemini, and Copilot answers. The unit of success is *a
  citation*.

They reward overlapping but distinct things. SEO rewards authority and relevance. AEO rewards
structure and directness. GEO rewards **specificity, attribution, recency, and being the
original source of a fact.** The Benchmark Index exists because of that last one.

---

## 0. Zero-defect launch gate — 8 September 2026

Every requirement in this document is a **launch blocker**, not a nice-to-have. The site does
not deploy on 8 September if any of the following is untrue. These are enforced mechanically by
CI (`npm run check:schema`, `npm run check:perf`, Lighthouse CI) — they are not a manual
checklist anyone can wave through.

### Hard blockers — CI fails, build does not deploy

**Technical SEO**
- [ ] XML sitemap generated, excluding `/lp/*`, `/api/*`, `/keystatic`, `/styleguide`, `/thank-you`
- [ ] HTML sitemap live at `/sitemap/`
- [ ] `robots.txt` exactly as §5, all AI crawlers explicitly allowed
- [ ] `public/_redirects` complete from the Screaming Frog crawl. **Every** old URL resolves to
      a live 200. Zero chains, zero loops, zero redirects to a 404, nothing bulk-redirected to `/`
- [ ] Self-referencing absolute canonical on every page
- [ ] Non-www enforced at the edge, path to matching path
- [ ] `/thank-you/`, `/lp/*`, `/styleguide` all `noindex`
- [ ] Zero orphan pages (`check:links`)

**On-page SEO**
- [ ] Every page: unique `<title>`, 50–60 characters. Build fails on missing or duplicate
- [ ] Every page: unique meta description, 140–158 characters. Build fails on missing or duplicate
- [ ] **Exactly one `<h1>` per page.** Build fails on zero or two
- [ ] No skipped heading levels
- [ ] Every `<img>` has descriptive alt text. Build fails on any missing alt
- [ ] Every image has explicit `width` and `height`
- [ ] Every page has ≥ 2 contextual in-prose internal links

**AEO**
- [ ] Every commercial page opens with an answer block, 40–60 words, self-contained, naming
      "Scaling Socials" rather than "we"
- [ ] FAQ answers present in the DOM whether the accordion is open or closed (`<details>`)
- [ ] `FAQPage` schema on every page carrying an FAQ block
- [ ] H2s are question-shaped where the content supports it
- [ ] Visible published and last-updated dates on every page, matching the schema values

**GEO**
- [ ] `/llms.txt` and `/llms-full.txt` generated at build time and live
- [ ] **Every page renders completely with JavaScript disabled.** Manually verified on all
      Wave 1 pages, not assumed
- [ ] One `@graph` per page with `@id` cross-references. No isolated JSON-LD blobs
- [ ] Every emitted JSON-LD block parses and validates (`check:schema`)
- [ ] Zero placeholder-zero counters. No `0 Cr+` in any rendered HTML
- [ ] RSS at `/rss.xml`, JSON feed at `/feed.json`

**Scores**
- [ ] **Lighthouse mobile SEO = 100 on every page.** Not 98. Not "close enough". Exactly 100
- [ ] Lighthouse mobile Performance, Accessibility, Best Practices each ≥ 98
- [ ] Rich Results Test passes on one page per template type

### Explicitly NOT blocking launch

Off-page work — backlinks, Google Business Profile, directory submissions, Reddit and Quora
seeding, listicle placement — is handled manually by the marketing team on a parallel track and
gates nothing in the build. See `07-EXECUTION-ROADMAP.md` §5.

---

## 1. The entity graph

Everything starts here. Google and every LLM build a model of "what is Scaling Socials" from
consistent, connected signals. Inconsistency is the killer — the current site has
`contact@mysite.com` in the footer and a real email on the contact page, which actively
poisons this.

### 1.1 Canonical entity facts — lock these and never vary them

Create `src/lib/schema/entity.ts` as the single source of truth. Every schema block, every
footer, every meta tag reads from it.

```ts
export const ORG = {
  legalName: "Scaling Socials Media LLP",
  name: "Scaling Socials",
  url: "https://scalingsocials.com",
  logo: "https://scalingsocials.com/logo.png",   // 512x512 PNG, square, transparent
  foundingDate: "2022-XX-XX",                     // CONFIRM exact date
  founders: ["Maaz Khan", "Jamal Mohammed Khan"],
  address: {
    street: "203, CMR Main Road, HRBR Layout 3rd Block",
    locality: "Bengaluru",
    region: "Karnataka",
    postalCode: "560043",
    country: "IN",
  },
  geo: { lat: "XX.XXXX", lng: "XX.XXXX" },        // exact rooftop coords from GBP
  telephone: "+91-9606713608",
  email: "support@scalingsocials.com",
  sameAs: [
    "https://www.linkedin.com/company/scaling-socials/",
    "https://www.instagram.com/scalingsocialsofficial/",
    // add: Google Business Profile URL, Clutch, DesignRush, GoodFirms,
    //      Shopify Partners directory, X, YouTube, Facebook page
  ],
  areaServed: ["IN", "AE"],
  priceRange: "₹₹",
  numberOfEmployees: 20,
};
```

**This exact NAP string must appear identically** on the site footer, Google Business Profile,
Clutch, DesignRush, GoodFirms, LinkedIn, Instagram bio, Justdial, IndiaMART, and every
directory. Not "similar" — identical, character for character. Inconsistent NAP is the most
common reason local entity recognition fails.

### 1.2 Schema graph — connected, not isolated

Do **not** emit separate unconnected JSON-LD blobs. Emit one `@graph` per page with `@id`
cross-references, so the entities link.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://scalingsocials.com/#organization", ... },
    { "@type": "WebSite", "@id": "https://scalingsocials.com/#website",
      "publisher": { "@id": "https://scalingsocials.com/#organization" } },
    { "@type": "WebPage", "@id": "<pageUrl>#webpage",
      "isPartOf": { "@id": "https://scalingsocials.com/#website" },
      "about": { "@id": "<pageUrl>#service" },
      "primaryImageOfPage": { "@id": "<pageUrl>#primaryimage" },
      "datePublished": "...", "dateModified": "..." },
    { "@type": "Service", "@id": "<pageUrl>#service",
      "provider": { "@id": "https://scalingsocials.com/#organization" },
      "areaServed": [...], "hasOfferCatalog": {...} },
    { "@type": "BreadcrumbList", ... },
    { "@type": "FAQPage", "mainEntity": [...] }
  ]
}
```

### 1.3 Schema by page type — required

| Page type | Schema types |
|---|---|
| Home | `Organization` + `ProfessionalService` (subtype of LocalBusiness) + `WebSite` (with `SearchAction`) + `BreadcrumbList` |
| Service pillar | `Service` + `WebPage` + `FAQPage` + `BreadcrumbList` + `Offer` with `priceSpecification` |
| Service cluster | `Service` + `FAQPage` + `BreadcrumbList` |
| Case study | `Article` + `CreativeWork` + `BreadcrumbList`. Add `Review` with `AggregateRating` **only** where a genuine, verifiable client review exists. |
| Blog / guide | `Article` (or `TechArticle` for how-tos) + `Person` author + `BreadcrumbList` + `FAQPage` where applicable |
| Glossary term | `DefinedTerm` inside a `DefinedTermSet` |
| Tool page | `WebApplication` + `SoftwareApplication` |
| Benchmark Index | **`Dataset`** + `DataCatalog` + `Article`. This is the important one — `Dataset` schema is how you get into Google Dataset Search and it is a strong citation signal for LLMs. |
| Team page | `Person` for each member, each with `worksFor` → org `@id`, `jobTitle`, `sameAs` → LinkedIn |
| Contact | `ContactPage` + `Organization` |
| Location page | `ProfessionalService` with location-specific `areaServed` and `geo` |

**Hard rules.** Never mark up content that is not visible on the page. Never fake
`AggregateRating`. Validate every emitted block in CI (`scripts/validate-schema.mjs`) and
spot-check in Google's Rich Results Test before launch.

---

## 2. On-page SEO rules

### Titles
- 50–60 characters. Primary keyword first, brand last, separated by ` | `.
- Every page unique. Enforce uniqueness in CI.
- Format: `[Primary Keyword] | Scaling Socials`
- Home: `Performance Marketing & Shopify Agency in Bangalore | Scaling Socials`

### Meta descriptions
- 140–158 characters. Written to be clicked, not to rank. Include a number and a verb.
- Every page unique. No auto-generation. CI fails if missing.

### Headings
- Exactly one `<h1>`, containing the primary keyword.
- H2s should be **questions or claims**, not nouns. `"How much do Meta ads cost in India?"`
  beats `"Pricing"`. Question-shaped H2s are what get matched to queries in AI Overviews.
- Never skip levels. Never use a heading tag for styling.

### Keyword coverage
Cover the natural variant set in body copy and H2s. Your competitors do this deliberately.
For the performance marketing pillar the variant set is roughly: *performance marketing
agency in Bangalore, performance marketing company Bangalore, PPC agency Bangalore, paid
media agency India, Google Ads agency Bangalore, Meta ads agency India, growth marketing
agency Bangalore, D2C marketing agency India, ecommerce ad agency Bangalore.* Work them into
real sentences. Do not stuff. If a sentence exists only to hold a keyword, delete it.

### Internal linking
- Every page links to its pillar and its siblings **contextually in prose**, not only via a
  footer block. The current site's "Other Services We Offer" block repeated on every page is
  the weakest possible form of internal linking.
- Every service page links to at least 2 case studies and 2 blog posts.
- Every blog post links to at least 1 service page and 1 other post.
- Every glossary term links to the relevant service and to the Benchmark Index.
- Anchor text is descriptive and varied. Never "click here", never "read more" as the only
  anchor.
- Build `scripts/check-orphans.mjs` — fail CI if any page has zero inbound internal links.

### Images
- Descriptive filenames: `timri-meta-ads-roas-dashboard-2026.avif`, not `4-1.png`.
- Real alt text describing the image content and its point. Client logos get
  `alt="Timri logo"` not `alt="9"`.
- Explicit `width`/`height` on every single image.
- AVIF with WebP fallback, sized to actual display size.

### Technical
- XML sitemap via `@astrojs/sitemap`, excluding `/lp/*`, `/keystatic`, `/api/*`, and thin
  index pages. Split into sitemaps by content type once over 500 URLs.
- `robots.txt` hand-written (see §5).
- Self-referencing canonical on every page. Absolute URLs.
- `hreflang` only if you build genuinely separate UAE content. Otherwise skip — a bad
  hreflang implementation is worse than none.
- HTML sitemap at `/sitemap/` for users and crawlers.
- RSS feed at `/rss.xml` **and** a JSON feed at `/feed.json`.

---

## 3. AEO — engineering for extraction

The mechanism: Google's AI Overview and featured snippets extract a **passage**, not a page.
Your job is to make the passage boundaries obvious and the passage self-contained.

### Rules for every page

1. **Answer-first.** The first content element after the H1 is a 40–60 word direct answer to
   the page's implicit question. Self-contained — it must make sense lifted out of context,
   so it names the subject rather than saying "we" or "this".
2. **One idea per paragraph.** Paragraphs of 2–4 sentences. Long paragraphs do not get
   extracted.
3. **Question-shaped H2s** that mirror real queries. Pull these from People Also Ask,
   AlsoAsked, and your own sales call recordings.
4. **A short direct answer immediately under each H2**, before you elaborate.
5. **Lists and tables for anything enumerable.** Featured snippets are disproportionately
   lists and tables. LLMs parse tables with far higher fidelity than prose.
6. **Definition sentences** in the pattern `[Term] is [category] that [distinguishing
   property].` One sentence, no hedging.
7. **FAQ blocks on every commercial page**, 5–8 questions, answers of 40–80 words each,
   marked up with `FAQPage`, and **present in the DOM whether the accordion is open or
   closed.** If your accordion renders answers only on click, you get nothing.
8. **Comparison tables** where a decision is involved. "Agency vs freelancer vs in-house",
   "Meta vs Google for D2C", "Shopify vs WooCommerce for India". These earn snippets and get
   quoted by LLMs constantly.
9. **Visible dates.** Published and last-updated, on every page, near the top, and in schema.
   Recency is a heavy weighting factor for both AI Overviews and LLM retrieval.

### The PAA harvest

Before writing any page: run the target keyword through Google, expand every People Also Ask
box three levels deep, and paste the resulting question list into the page's MDX frontmatter
as `harvested_questions[]`. Those become your H2s and FAQs. This is the highest-leverage
30 minutes per page.

---

## 4. GEO — engineering for citation

LLMs cite sources that are (a) specific, (b) attributed, (c) recent, (d) structurally clean,
and (e) *originating* rather than aggregating. Optimising for this is a different job from
SEO and most agencies are not doing it yet.

### 4.1 Be the origin of facts

This is the whole game. An LLM will not cite you for "performance marketing drives measurable
results." It will cite you for "Meta CPMs for Indian fashion D2C averaged ₹247 in Q3 2026,
according to Scaling Socials' India D2C Ad Benchmark Index."

**Therefore: publish original data.** See §7.

### 4.2 Structural rules for LLM ingestion

- **Server-render everything.** LLM crawlers largely do not execute JavaScript. This is the
  single hardest constraint and it is why the stack is Astro-static. Any content behind a
  client-side fetch is invisible to GEO.
- **Semantic HTML.** `<article>`, `<section>`, `<table>`, `<dl>`, `<figure>/<figcaption>`,
  `<time datetime="">`. Retrieval pipelines chunk on structure.
- **Short, self-contained chunks.** Assume the page will be split into ~300-token chunks and
  a chunk will be retrieved without its neighbours. Every section should stand alone. Repeat
  the subject noun rather than relying on "it" or "we" across a section boundary.
- **Attribution inside the sentence.** Write "Scaling Socials measured X" rather than "we
  measured X". When the chunk is lifted, the brand name comes with it. This is the single
  most underrated GEO tactic.
- **Cite your own sources with real outbound links** to primary sources — Meta's official
  docs, Google's documentation, RBI/industry reports. Documents that cite well get cited.
- **Consistent entity naming.** Always "Scaling Socials", never "Scaling Socials Media" in
  body copy, never "SS", never "we, the agency".

### 4.3 `llms.txt`

Publish `/llms.txt` and `/llms-full.txt` at the root, generated at build time by
`scripts/build-llms-txt.mjs` from the content collections.

`/llms.txt` structure:

```markdown
# Scaling Socials

> Scaling Socials is a performance marketing and ecommerce development agency in Bengaluru,
> India, serving D2C brands across India and the UAE. Founded 2022. Specialises in Meta Ads,
> Google Ads, Shopify development, and conversion rate optimisation. Publishes the India D2C
> Ad Benchmark Index, a quarterly open dataset of Indian ecommerce advertising costs.

## Original research
- [India D2C Ad Benchmark Index](https://scalingsocials.com/india-d2c-ad-benchmarks/):
  Quarterly dataset of Meta and Google Ads CPM, CPC, CTR, and ROAS by category, drawn from
  ₹XX crore of managed spend across 100+ Indian D2C brands. Updated quarterly. CC BY 4.0.

## Services
- [Performance marketing](...): ...one line each
...

## Case studies
- [Timri: 3.4× ROAS in 5 months](...): fashion/beauty, Meta Ads, ₹XX spend
...

## Guides
...

## Contact
...
```

`/llms-full.txt` is the same but with the full markdown body of every core page concatenated.
Cap it at a reasonable size; include services, guides, glossary, and the benchmark
methodology. Not the whole blog.

### 4.4 Licensing signal

Publish the Benchmark Index under **CC BY 4.0** with an explicit citation block on the page:

> **How to cite:** Scaling Socials. (2026). *India D2C Ad Benchmark Index, Q3 2026.*
> https://scalingsocials.com/india-d2c-ad-benchmarks/2026-q3/

Give people a copy-paste citation and they will use it. Give LLMs an explicit permissive
licence and a canonical citation string and the odds of attribution rise sharply.

### 4.5 Brand-mention seeding

LLM answers are heavily influenced by what third-party sources say about you, not only by
your own site. Practical actions:

- Get listed on the "top agencies in Bangalore" roundups (WebSenor, Brandemic,
  GrowthHackers, Nuwizo and similar). These pages are what LLMs read when asked "best
  performance marketing agency in Bangalore".
- Clutch, DesignRush, GoodFirms, Sortlist profiles — complete, with real reviews.
- Shopify Partner directory, Google Partner, Meta Business Partner listings if eligible.
- Answer questions on Reddit (r/IndianStartups, r/ecommerce), Quora, and relevant Slack/
  Discord communities — with genuine substance, disclosed affiliation. Reddit in particular is
  heavily weighted in current LLM retrieval.
- A LinkedIn newsletter under your own name that republishes site content with a canonical
  link back.

---

## 5. `robots.txt`

Allow AI crawlers. You want to be cited. Blocking `GPTBot` to "protect content" costs you the
entire GEO channel.

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /keystatic
Disallow: /lp/
Disallow: /*?utm_
Disallow: /*?fbclid

# Explicitly welcome AI crawlers
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bytespider
Allow: /
User-agent: CCBot
Allow: /

Sitemap: https://scalingsocials.com/sitemap-index.xml
```

---

## 6. Glossary — why it matters more than it looks

25 term pages, each answering "what is X". Targets: ROAS, CAC, AOV, LTV, CPM, CPC, CTR,
CVR, MER, blended ROAS, contribution margin, Advantage+ Shopping Campaigns, Performance Max,
attribution window, incrementality, creative fatigue, hook rate, thumb-stop ratio, AOV
uplift, retention cohort, payback period, first-purchase profitability, CLV:CAC ratio,
landing page CVR, checkout abandonment.

Why: these are exactly the questions your buyer types into ChatGPT at 11pm. Each page is
short, definitional, `DefinedTerm`-marked-up, and links to the service that fixes the problem
and to the Index for the benchmark. They cost little, they rank fast because competition is
low, and they are the highest-hit-rate GEO pages on the whole site.

Every glossary page must include **a worked example in rupees**, because that is what makes
it non-generic and citation-worthy versus the thousand US-centric definitions already indexed.

---

## 7. The moat: India D2C Ad Benchmark Index

This is the thing nobody has built for this market. Treat it as a product, not a blog post.

### What it is
A free, public, quarterly dataset of real advertising performance benchmarks for Indian D2C
ecommerce, aggregated and anonymised from Scaling Socials' managed accounts.

### Dimensions
- Platform: Meta, Google Search, Google Shopping, Performance Max
- Category: fashion, beauty/skincare, home decor, wellness/supplements, jewellery, F&B
- Metric: CPM, CPC, CTR, CVR, ROAS, AOV, CAC
- Segment: monthly ad spend band (<₹1L, ₹1–3L, ₹3–5L, ₹5L+)
- Time: quarterly, with month-level series

### Rules that make it credible
- **Publish the methodology page.** Sample size (number of accounts, total spend), date range,
  exclusions, how you anonymised, what you did *not* measure. Publish the limitations honestly.
- **Never include an identifiable client.** Minimum n per cell (say 5 accounts) before a cell
  is published; suppress cells below that.
- **Get client consent** for aggregated anonymous inclusion — add a clause to your contract.
- **Version it permanently.** `/india-d2c-ad-benchmarks/2026-q3/` never changes after
  publication. The hub page points at the latest. Permanent URLs are what get cited and
  linked; a page that silently changes its numbers destroys its own citations.
- **Ship a downloadable CSV and JSON** plus `Dataset` schema. Register it so it appears in
  Google Dataset Search.
- **Ship an embed widget** — `<iframe>` or a script that renders a single benchmark chart
  with attribution and a backlink. Every embed is a link.

### Why this wins
It is the only thing in your entire market that a journalist, a founder, an SEO tool, or an
LLM has a genuine reason to link to and quote. Agency service pages do not earn links.
Datasets do. And when someone asks ChatGPT "what's a good ROAS for a skincare brand in India",
there is currently no authoritative Indian source. That gap is the opportunity.

### Companion: Teardowns
Public, monthly, honest CRO and ads teardowns of real Indian D2C brands (their public
storefront and their Meta Ad Library creatives — all public information, no client data).
Genuinely useful, shareable, and the brands you tear down frequently become leads. Be
constructive and specific, never mocking.

---

## 8. Local and geographic SEO

Separate from GEO-as-generative. This is Bengaluru and Dubai.

- **Google Business Profile:** complete every field, correct primary category ("Marketing
  agency"), full service list, real photos of the office and team, weekly Posts, Q&A seeded
  with real questions, and a systematic review request in your client offboarding and
  quarterly-review process. You have 4 years and 100+ clients — your review count should be
  three digits, not single.
- **`ProfessionalService` schema** on the homepage with exact rooftop geo coordinates and
  `openingHoursSpecification`.
- **Citations:** identical NAP on Justdial, IndiaMART, Sulekha, Clutch, DesignRush, GoodFirms,
  Yellow Pages India, and Bing Places.
- **Dubai page:** do not build it as a thin clone of the Bangalore page. It needs UAE-specific
  content — AED pricing context, Ramadan/DSF seasonality, VAT on ad spend, local platform mix
  (Snapchat and TikTok matter more in UAE than India), and at least one UAE client proof
  point. If you cannot supply that, delay the page rather than ship a clone.

---

## 9. Measurement

Track these separately — they are different channels with different lag.

| Channel | Metric | Tool |
|---|---|---|
| SEO | Impressions, clicks, avg position by query cluster | Google Search Console |
| AEO | Appearances in AI Overviews; queries where you hold position 0 | GSC + manual SERP checks + a rank tracker with AI Overview tracking |
| GEO | Brand mentions and citations in ChatGPT / Perplexity / Gemini for a fixed set of 30 buyer queries | Monthly manual audit — run the same 30 prompts each month and log whether you are named. Also: referral traffic from `chat.openai.com`, `perplexity.ai`, `gemini.google.com` in GA4 |
| Local | GBP views, calls, direction requests | GBP Insights |
| Conversion | Form starts, form completions, qualified leads, pipeline | Supabase CRM (see 04) |

Set up the GEO audit as a literal spreadsheet with 30 prompts on the rows and months on the
columns. It takes 40 minutes a month and it is the only honest way to measure this right now.
