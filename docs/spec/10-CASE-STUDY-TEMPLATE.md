# 10 — Case Study Template

The highest-value template on the site. Case studies are what earn links, what close deals on
sales calls, and what Google and LLMs read as evidence rather than assertion.

Every case study uses this structure. No exceptions — consistency is what lets the build render
them, lets the schema validate, and lets a reader compare two of them.

**Target length: 1,200–1,800 words.** Under 1,000 and it reads thin. Over 2,000 and nobody
finishes it.

---

## 1. Frontmatter — enforced by zod, build fails if wrong

```yaml
---
title: "Timri: 3.4× ROAS and ₹42L monthly revenue in 5 months"
slug: "timri-shopify-meta-ads"
client_name: "Timri Cosmetics"
client_permission_granted: true        # BUILD FAILS IF FALSE
client_url: "https://timri.in"
category: "beauty-skincare"            # one of the six industry slugs
services: ["meta-ads", "shopify", "cro"]
platforms: ["Meta", "Google Shopping"]
start_date: "2026-03-01"
end_date: "2026-08-31"
starting_spend: "₹1.2L/month"
ending_spend: "₹4.8L/month"

target_keyword: "meta ads agency for skincare brands india"
description: "How Scaling Socials took Timri from 1.4× to 3.4× ROAS in five months by
  rebuilding creative testing and fixing checkout friction."   # 140–158 chars

metrics:
  - label: "Return on ad spend"
    before: "1.4×"
    after: "3.4×"
    direction: "up"
  - label: "Monthly revenue"
    before: "₹6L"
    after: "₹42L"
    direction: "up"
  - label: "Cost per acquisition"
    before: "₹840"
    after: "₹390"
    direction: "down"
  - label: "Checkout conversion rate"
    before: "0.9%"
    after: "2.1%"
    direction: "up"

quote: "..."
quote_author: "Nikunj Vavadiya"
quote_role: "Founder"
quote_photo: "./nikunj.jpg"

author: "tayeb"
publishedAt: 2026-09-15
updatedAt: 2026-09-15
featured: true
---
```

**Rules.**
Minimum three metrics, maximum six. Every metric needs a real before value — "we grew revenue
to ₹42L" without a starting point is not a case study, it's a claim. `client_permission_granted`
must be `true` in writing (email or WhatsApp is fine, keep it).

---

## 2. Page structure

### H1
`[Brand]: [specific outcome] in [timeframe]`

Good: *"Timri: 3.4× ROAS and ₹42L monthly revenue in 5 months"*
Bad: *"How we helped a beauty brand scale"* — no brand, no number, no period, and it ranks for
nothing.

### Answer block — 45–60 words, first thing after the H1

Self-contained. Assume it will be lifted out of context into an AI Overview, so name the
subject rather than saying "we".

> Scaling Socials rebuilt Timri's Meta Ads creative testing and Shopify checkout between March
> and August 2026. ROAS moved from 1.4× to 3.4× while monthly ad spend grew from ₹1.2L to
> ₹4.8L, and monthly revenue reached ₹42L. The largest single gain came from fixing a
> checkout step that was losing 40% of buyers.

Note what's in there: entity, client, service, dates, three numbers, and the one insight. That
paragraph alone is quotable.

### Results table

Rendered automatically from the frontmatter `metrics`. Do not hand-write it.

### At a glance
Category · Platforms · Engagement length · Services · Starting spend → ending spend

### The situation — 200–300 words

What was actually broken, in numbers. Not "they were struggling with growth."

> Timri came to us in February 2026 running ₹1.2L/month on Meta at 1.4× ROAS. With a 55% gross
> margin, their break-even was 1.8×, so every rupee of ad spend was losing money. They had 340
> SKUs on Shopify, one campaign, and a single creative that had been running for eleven months.

Include: monthly spend, the metric that was broken, the business consequence, and what they had
tried already.

### What we diagnosed — 200–300 words

The hypothesis. **Including what you got wrong first.** This is the section that separates a
real case study from a brochure, and almost nobody writes it.

> Our first read was creative fatigue — one ad running eleven months is an obvious suspect. We
> shipped nine new creatives in week two and ROAS moved to 1.6×. Better, but nowhere near
> break-even, which told us the problem was downstream of the ad. Session recordings showed
> 40% of users abandoning at a shipping-calculator step that took four seconds to load.

### What we changed — 350–500 words

The most concrete section. Subheads for each change. Screenshots with real numbers.

Cover: campaign restructure, creative angles tested and which won, landing page or checkout
changes, tracking or attribution fixes, budget scaling approach.

Every screenshot needs an `<Annotation>` marking the point the change was made. That's what
the motif is for.

**Say what failed.** "We tested UGC testimonials against product-demo video. Testimonials lost,
badly — 0.8× ROAS across ₹40,000 of spend. We cut them in week three."

### The result — 150–250 words

The numbers again in prose, plus what happened after the engagement window closed. Never end at
the peak — say what held.

### Client quote

Named, with role and photo. If you only have a text testimonial, use it, but go back and get a
60-second phone video. Six video testimonials beat sixty written ones.

### What we'd do differently — 100–150 words

One honest paragraph. The single most credible thing you can put on a case study page and no
competitor in your SERP will publish it.

> We spent three weeks on creative before looking at the checkout. The checkout fix delivered
> more than every creative test combined. We now run a CRO audit in week one on every account,
> before touching a single ad.

### Related
Two case studies in the same category, rendered automatically.

### CTA
"Show me what this looks like for my brand."

---

## 3. Interview questions — to get the raw material

Record the account manager for 20 minutes per case study. Do not send these as a written
questionnaire; you get one-line answers.

1. What was the account like when we took it over? Actual numbers.
2. What did we *think* was wrong at first — and were we right?
3. What was the first thing we changed, and what happened?
4. What did we test that didn't work? How much did we spend finding out?
5. What was the turning point?
6. What surprised us?
7. What would we do differently starting that account today?
8. Where are they now?

Questions 4 and 7 produce the content nobody else has. Push for real answers on those.

---

## 4. Quality checklist

Before publishing, every one of these must be true.

```
□ Client permission in writing, saved
□ Client named in the H1
□ At least three metrics with real BEFORE and AFTER values
□ Every metric has a date range attached
□ Answer block is self-contained and names "Scaling Socials", not "we"
□ At least one screenshot with real numbers visible
□ Every image has descriptive alt text
□ "What we diagnosed" admits at least one wrong turn
□ "What we'd do differently" is written and honest
□ Client quote is attributed with name and role
□ Two contextual internal links to service pages, in prose
□ Target keyword appears in H1, answer block, and one H2 — naturally
□ Title 50–60 chars, description 140–158 chars, both unique
□ Amounts in Indian units: ₹42L, ₹1.5Cr — never "₹4.2 Million"
□ Published and updated dates set
□ Article schema validates
```

---

## 5. Common failure modes

| Failure | Fix |
|---|---|
| "Revenue grew 300%" | From what to what, over what period? Percentages without a base are unverifiable and Google discounts them |
| Unnamed client ("a leading beauty brand") | Worth a fraction of a named one. Go get the permission |
| No before value | It's a claim, not a case study |
| Every test succeeded | Nobody believes it. Include the failures |
| Screenshots with everything blurred | Redact the client name if you must; never redact the numbers |
| Written like a press release | Write like you're explaining it to another media buyer over coffee |
| Same three services listed on all eight | If every case study is identical, publish three good ones instead |

---

## 6. Content collection schema

Add to `src/content/config.ts`. The build fails on a case study without permission — this is
deliberate.

```ts
const caseStudies = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().max(70),
    client_name: z.string(),
    client_permission_granted: z.literal(true, {
      errorMap: () => ({ message: 'Case study cannot build without written client permission.' }),
    }),
    client_url: z.string().url().optional(),
    category: z.enum(['fashion-apparel','beauty-skincare','home-decor-furniture',
                      'health-wellness-supplements','jewellery','food-beverage','other']),
    services: z.array(z.string()).min(1),
    platforms: z.array(z.string()).min(1),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    starting_spend: z.string(),
    ending_spend: z.string().optional(),
    target_keyword: z.string(),
    description: z.string().min(140).max(158),
    metrics: z.array(z.object({
      label: z.string(),
      before: z.string(),
      after: z.string(),
      direction: z.enum(['up','down']),
    })).min(3).max(6),
    quote: z.string().optional(),
    quote_author: z.string().optional(),
    quote_role: z.string().optional(),
    quote_photo: image().optional(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});
```
