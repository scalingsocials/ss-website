# 11 — Supplied Content

Everything Khan has confirmed. Claude Code reads this as source of truth for these items.
Anything marked TODO is still outstanding.

Last updated: 2 September 2026

---

## 1. Partners

Four co-founders. All four go on `/team/` and `/about/`, each as a `Person` in the schema
graph with `worksFor` pointing at the organisation `@id`.

**Display spelling is "Khushal Sharma"** — matches the website and his LinkedIn. The LLP
registry says "Kushal Ashok Kumar Sharma"; that form appears only in legal filings.

```ts
// src/content/team/ — one MDX file each, or src/lib/team.ts
export const PARTNERS = [
  {
    slug: 'tayeb-khan',
    name: 'Tayeb Khan',
    role: 'Co-founder',
    focus: 'Web development and finance',
    linkedin: 'https://www.linkedin.com/in/tayebmohammedkhan/',
    photo: './tayeb.jpg',        // TODO: from current site /wp-content/uploads/
    bio: 'An MBA graduate, Tayeb leads web development and financial management at Scaling Socials. He makes sure clients get web work that actually converts, and that the business stays financially sound.',
  },
  {
    slug: 'jamal-khan',
    name: 'Jamal Khan',
    role: 'Co-founder',
    focus: 'Paid media',
    linkedin: 'https://www.linkedin.com/in/jamal-mohammed-khan-4555001b2/',
    photo: './jamal.jpg',        // TODO
    bio: 'An engineer by training, Jamal drives advertising strategy at Scaling Socials. He reads market shifts early and leads the media team that turns that into campaign performance.',
  },
  {
    slug: 'maaz-khan',
    name: 'Maaz Khan',
    role: 'Co-founder',
    focus: 'Ecommerce growth',
    linkedin: 'https://www.linkedin.com/in/maazing/',
    photo: './maaz.jpg',         // TODO
    bio: 'An MBA focused on ecommerce and business development, Maaz has led growth for brands across fashion, beauty and home. He is the person clients call when a store needs to scale, not just launch.',
  },
  {
    slug: 'khushal-sharma',
    name: 'Khushal Sharma',
    role: 'Co-founder',
    focus: 'Brand and creator growth',
    linkedin: 'https://www.linkedin.com/in/khushal-sharma-836783120/',
    photo: './khushal.jpg',      // TODO
    bio: 'An entrepreneur who has built and grown online businesses of his own, with an audience of 60,000+ on Instagram. Khushal brings an operator perspective on brand and creator-led growth.',
  },
];
```

**Bios rewritten from the current site** — plainer, active voice, no "unleashing the potential",
no broken sentence in Tayeb's. Fix the fabricated social links too: the current page has
Facebook, LinkedIn and Twitter icons on every partner all pointing at `#`. Only ship links that
exist — LinkedIn only, for now.

**TODO:** photos. Pull the existing ones from `/wp-content/uploads/` for launch; replace with the
photographer's set in Wave 2.

---

## 2. Pricing

**Confirmed:** performance marketing and SEO start at **₹25,000/month**. Final quote depends on
ad spend for performance, and keyword count and competitiveness for SEO.

Publishing this is a real advantage. Monaqo publishes ₹50,000/month; nobody else in the SERP
publishes anything. "How much does a performance marketing agency cost in India" is a question
people ask ChatGPT, and right now there is no good Indian answer to cite.

### Pricing block — performance marketing pages

> **Performance marketing starts at ₹25,000/month.**
>
> Where you land depends on your monthly ad spend. Managing ₹1L a month and managing ₹20L a
> month are different jobs — more campaigns, more creative volume, more testing, more people on
> the account.
>
> What moves the number: monthly ad spend, how many platforms you run, how much creative you
> need produced each month, and whether landing page and CRO work is in scope.
>
> Ad spend is separate and paid directly to the platforms. We never mark it up.

### Pricing block — SEO pages

> **SEO starts at ₹25,000/month.**
>
> Where you land depends on how many keywords you're targeting and how competitive they are.
> Ranking for twenty long-tail terms in one city is a different job from competing nationally
> on head terms.
>
> What moves the number: keyword count and difficulty, how many pages need writing or rewriting,
> whether technical fixes are in scope, and how much link work you want.

### Other services

TODO — Khan to confirm starting prices for Shopify development, web development, and social
media management. Until then those pages carry:

> Pricing depends on scope. Most projects start around ₹X. Tell us what you need and we'll
> quote in two working days.

**Never publish a price you won't honour.** If ₹25,000 is a real floor, say it. If deals
regularly close below it, change the number.

---

## 3. The audit offer

**Draft — Khan to correct.** Written to be specific rather than generic, because "free audit"
means nothing on its own and every agency offers one.

### Name
**Free Growth Audit**

### Page copy

> **We'll tell you what's wrong with your ads before you pay us anything.**
>
> Send us access to your ad accounts and your store. Within three working days you get a written
> audit of what's working, what's leaking money, and what we'd change first — whether or not you
> hire us.
>
> No sales deck. A document you could hand to another agency.

### What you get

- **Ad account teardown.** Campaign structure, budget allocation, audience overlap, creative
  fatigue, and where spend is going that shouldn't be
- **Your break-even ROAS, calculated.** Based on your actual margins, not a generic benchmark.
  Most brands we audit are targeting a number that loses money
- **Attribution check.** Where platform-reported revenue diverges from your real Shopify
  revenue, and why
- **Store conversion audit.** Page speed, product page, cart and checkout, with the specific
  friction points ranked by how much they cost you
- **Creative review.** What's fatigued, what angles you haven't tested
- **A 30-60-90 plan.** The three things we'd do first, in order, with the reasoning

### How it works

1. **20-minute call.** What you sell, what your margins are, what you've tried
2. **You give read-only access** to Meta Ads, Google Ads, Shopify or GA4
3. **We audit.** Three working days
4. **45-minute walkthrough.** We take you through it live and answer questions
5. **You get the document.** Yours to keep, regardless of what you decide

### The honest bit

> **It's free and there's no obligation.** Obviously we hope you'll work with us. But we've
> handed audits to brands who took them in-house and did the work themselves, and that's a fine
> outcome. A brand that fixes its own funnel and comes back at 10× the spend is worth more to
> us than one we talked into a retainer they weren't ready for.

### Who this is for

- Spending ₹1L or more a month on ads
- Selling physical products online, in India or the UAE
- Have at least 90 days of ad account data

### Who it isn't for

- Pre-launch brands with no data to audit. We can't audit an empty account
- Anyone wanting a free strategy they'll hand to a cheaper agency. We'll know, and we'd rather
  say no than do the work twice
- Service businesses and B2B lead gen. Not our specialism — we'll refer you to someone better

**That last block matters.** Disqualifying is a trust signal and it filters your inbound.
Nobody in your SERP publishes one.

### Form routing
`source_type: "audit"`, `+15` score bonus. Ad spend and store URL are required fields.

---

## 4. Client logos

**Instruction: auto-discover, don't hand-list.** Drop a file in the folder and it appears.

```
src/assets/logos/
  timri.svg
  rangloom.svg
  lille-barn.svg
  younglings.png
  ...
```

```ts
// src/lib/logos.ts
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/logos/*.{svg,png,webp,avif}',
  { eager: true }
);

export const LOGOS = Object.entries(files)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.\w+$/, '');
    return {
      slug,
      src: mod.default,
      alt: `${slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} logo`,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));
```

**Rules:**
- Filename becomes the alt text. Name files properly — `lille-barn.svg`, never `logo-9.png`
- SVG preferred; PNG minimum 400px wide on transparent background
- Rendered at a fixed height with `object-fit: contain` so mixed aspect ratios sit on one line
- **Permission required.** Ask each client once; keep the reply. A "Website by Scaling Socials"
  footer link on their site is a fair trade and gets you a backlink
- Optional `src/assets/logos/_featured.json` listing 6–8 slugs for the homepage strip; the full
  wall uses everything

Migrate the logos already on the current site for launch. New ones drop in and appear on the
next build.

---

## 5. Brand assets — DELIVERED

**Black and white are the brand.** Grounds are pure `#FFFFFF` and pure `#000000`. One accent:
Klein blue `#002FA7`, chosen on measured contrast — see `08-DESIGN-BRIEF.md` §4 for the
shortlist and why the alternatives lost.

Neither the logo cyan `#0CC0DF` nor the careers-page violet `#4D3CF6` is used. Both have been
removed from the token system and every generated asset.

| | Hex |
|---|---|
| White ground | `#FFFFFF` |
| Black ground | `#000000` |
| Accent (on white) | `#002FA7` |
| Accent lifted (on black) | `#5B7CFF` |
| Accent wash | `#EDF0FC` |

| Asset | Path |
|---|---|
| Schema logo | `public/logo.png` — 512×512 square, transparent, black |
| Favicons | `public/favicon.ico`, `favicon-{16,32,180,192,512}.png` |
| Mark — black / white / accent | `src/assets/brand/mark-{black,white,accent}.png` |
| Lockup — black / white | `src/assets/brand/lockup-{black,white}.png` |

Source PNGs preserved in `docs/reference/logo-source/`.

**TODO — worth commissioning:** true vector SVG of the mark and lockup. These are raster,
traced from PNGs. The pyramid is pure geometry and will trace cleanly — a few KB against 150KB,
sharp at any size, and recolourable in code with `currentColor` so three files become one.

**Careers subdomain confirmed.** `careers.scalingsocials.com` is a Lovable hiring microsite and
stays where it is. The `/careers/` redirect (2,147 impressions) points there.

---

## 6. Still outstanding

| # | Item | Blocks |
|---|---|---|
| 1 | **Three headline numbers** — managed spend, brands, average ROAS, and how ROAS is calculated | Homepage, every service page |
| 3 | Screaming Frog crawl export | The 301 map. Blocks DNS cutover, not the build |
| 4 | 90 minutes of recording (Blocks A and B in `05`) | Real service copy. Launch uses restructured existing copy until then |
| 5 | Starting prices for Shopify, web dev, social media | Those three pricing blocks |
| 6 | One client permission for a hero delta | Homepage hero |
| 7 | 20 objections from Harsh and Vinay | FAQ blocks sitewide |
| 8 | Transcriber named | The content pipeline |
