# 08 — Design Brief (v2)

**Supersedes v1.** v1 was too austere. This keeps what was right and adds the visual
ambition the brief actually needs.

**Status: awaiting approval. Do not write component code until approved.**

---

## 1. What changed, and why

v1 proposed ink-on-paper with colour reserved entirely for data. Correct instinct, pushed too
far — it produced something credible but not something that demonstrates you can *make things*.
You sell design and development. The site is the portfolio.

v2 keeps three things from v1: the **delta** as the core device, the typographic discipline,
and the performance floor. It adds density, motion, imagery, and a much bolder rhythm.

**The clarification that matters:** the performance budget governs *JavaScript*, not visual
richness. Images, video, illustration and type cost nothing against it. What the budget
prevents is a page-builder's jQuery stack and five animation libraries — none of which make
anything look better.

---

## 2. Concept: two registers

The site alternates between two modes. This is the structural idea that gives it rhythm and
lets it be both readable and dramatic.

**Paper register — for reading.** Light ground, serif body, generous line length, quiet.
Service explanations, case study narratives, blog, glossary, FAQs. Anything a founder will
read for more than ten seconds.

**Ink register — for showing.** Full-bleed dark bands. Video walls, the Benchmark Index,
case study results, the client logo wall, CTA bands. Where the site goes loud.

A page scrolls: paper, paper, **ink**, paper, **ink**, paper. The dark bands act as chapter
breaks. It reads as designed rather than assembled, and gives you drama without sacrificing
legibility for long-form content — which is the trade Intent Farm made and lost.

---

## 3. The motif: the annotation

Every site needs one device that is unmistakably its own. Intent Farm uses hashtags. Ours comes
from the actual work.

**The annotation marker** — a thin vertical rule with a small tag, exactly like the annotation
you drop on an ads dashboard at the point you changed something.

```
                    │ Creative refresh
                    │ 14 Apr
    ────────────────┼──────────────────────
```

Rendered in `--accent-graphic`. Used to mark the turning point on a case study chart, label a screenshot, call out a moment in
the Benchmark data, tag a section heading. Functional, native to your world, and nobody in this
market is using it. Build it once as `<Annotation>`.

---

## 4. Colour — black, white, and one blue

Black and white are the brand. The palette takes that literally: **pure `#FFFFFF`** and
**pure `#000000`** as the two grounds, with a single accent used sparingly.

### The accent: Klein blue `#002FA7`

Chosen on measurement, not taste. The shortlist and how each performed:

| Candidate | As text on white | As text on black |
|---|---|---|
| **Klein blue `#002FA7`** | **10.69:1** | 1.96 — needs a lift |
| Electric blue `#0B3FE8` | 7.27:1 | 2.89 |
| Rani magenta `#D6006E` | 5.14:1 | 4.08 |
| Deep teal `#006D77` | 6.08:1 | 3.45 |
| Signal orange `#FF4F00` | **3.30 — fails** | 6.37:1 |

Three reasons it wins:

1. **It passes in both directions at the top of the scale.** `#002FA7` as text on white is
   10.69:1, and white text on a `#002FA7` fill is also 10.69:1. Nothing else on the list did
   both. That means one colour serves links, buttons, badges and graphics with no compromise.
2. **No semantic collision.** Green and red are already spoken for as delta direction. That
   rules out orange and magenta as a system accent — an orange chart series sitting next to a
   red negative delta is a genuine legibility problem, not a theoretical one.
3. **It is not a default.** Not terracotta, not acid green, not vermilion-on-near-black — the
   three looks that currently mark a page as generated. And a true Klein blue is far deeper and
   more saturated than the generic SaaS blue; it reads as an art-directed choice because it is
   one.

It fails on black (1.96:1), so the ink register uses **`#5B7CFF`** at 5.77:1.

### Tokens

| Token | Paper (white) | Ink (black) |
|---|---|---|
| `--ground` | `#FFFFFF` | `#000000` |
| `--fg` | `#111111` (18.88:1) | `#EDEDED` (17.94:1) |
| `--fg-muted` | `#6E6E6E` (5.10:1) | `#9A9A9A` (7.46:1) |
| `--surface-c` | `#F5F5F5` | `#141414` |
| `--rule-c` | `#E2E2E2` | `#2A2A2A` |
| `--accent-text` | `#002FA7` (10.69:1) | `#5B7CFF` (5.77:1) |
| `--accent-fill` | `#002FA7` | `#5B7CFF` |
| `--accent-on` | `#FFFFFF` (10.69:1) | `#000000` (5.77:1) |
| `--accent-wash` | `#EDF0FC` | lift at 14% |
| `--pos` | `#0B7A45` (5.41:1) | `#3ECF8E` (10.52:1) |
| `--neg` | `#B3261E` (6.54:1) | `#FF6B5E` (7.52:1) |

### Two deliberate details

**Text on black is `#EDEDED`, not pure white.** Pure white on pure black causes halation — the
letterforms bloom and body text becomes genuinely harder to read. Two percent off pure is
invisible as a colour decision and materially easier to read.

**The accent inverts between registers.** On white the fill is deep blue with white text; on
black it is the lifted blue with black text. Both hit their contrast targets, and inverting the
fill rather than keeping it constant is what makes buttons read as equally prominent on both
grounds.

### Restraint

With pure black and pure white doing the structural work, the blue has to be rare to mean
anything. It appears on: primary buttons, links, the annotation marker, one chart series, and
active states. Nowhere else. If a section has two blue elements competing, one of them is
decoration — remove it.

---

## 5. Typography

**Display, UI, labels, navigation, buttons, cards, all numerals: Anek Latin**
(Indian Type Foundry, variable, OFL). An Indian foundry face for an Indian agency. Its sharp
geometric construction echoes the angular pyramid mark. This is the **default on `body`**.

**Long-form prose only: Source Serif 4** (OFL), 18px, generous leading, measure capped at 68
characters. Applied through a `.prose` class — blog posts, case study narrative, guides, and
service page body copy. **Not on `body`, not on UI.**

Scoping the serif this way resolves the tension between a sharp cyan tech brand and a
document-like reading experience: the interface is crisp and geometric, the reading is calm.
It is also more defensible than "serif everywhere", which would have fought the logo.

**Both faces must be subset including ₹ (U+20B9).** Verify before shipping — a missing rupee
glyph silently falls back and breaks every number on the site.

Hero H1 at `clamp(3rem, 7vw, 5.5rem)`, tracking `-0.035em`. Display can go larger on ink and
sit over imagery.

**Tabular figures on every number.** `font-variant-numeric: tabular-nums`.

**Still prohibited:** accenting one word in a headline in a different colour; ALL-CAPS
tracked-out eyebrow labels; `→` glued to button text; meta strings joined with middle dots;
monospace for small data labels.

---

## 6. Motion

More than v1, still disciplined.

- **Hero:** one orchestrated load sequence — type settles, deltas resolve, video fades in.
  About 900ms total.
- **Video:** looping muted creative clips in the ink showcase bands, running continuously.
  That's the point — it's your work.
- **Interaction:** accordions, filters, form steps, card hovers.
- **Still banned:** fade-and-slide-up on every section on scroll. Most recognisable template
  tell there is, and it makes a site feel slower than it is.

All wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## 7. Homepage structure

```
1.  Header — 5 items, mega menu
2.  HERO (paper)              Big type, answer block, three attributed deltas,
                              muted looping video, primary CTA
3.  Partner badges (paper)    Google, Meta, Shopify partner marks
4.  CLIENT WALL (ink)         Full-bleed, 30+ logos, quiet grid
5.  Services (paper)          Six cards, each with its custom illustration
6.  CREATIVE WALL (ink)       Full-bleed. Looping ad creatives you actually made,
                              each tagged with brand and result. Your portfolio —
                              nobody else in this SERP has one.
7.  Client-voice problems     "I'm frustrated that my agency doesn't bring fresh
    (paper)                   ideas." First person, as founders actually say it.
8.  Case studies (paper)      Three cards with real result tables, not thumbnails
9.  BENCHMARK INDEX (ink)     Full-bleed, live chart, loudest thing on the site
10. Process (paper)           Five numbered phases — the only place numbered
                              markers appear, because it is a real sequence
11. Founder (paper)           Photo, quote, name, LinkedIn. A named human.
12. Awards (paper)            When you have them
13. CTA BAND (ink)            Multi-step form
14. Footer (ink)              One footer, real NAP
```

Roughly 4,000px of desktop scroll. Right for this category.

---

## 8. Performance budget (v2)

Revised to separate JavaScript from media.

| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | **< 2.0s** — relaxed from 1.8s to allow a hero poster image |
| INP | < 150ms |
| CLS | < 0.05 |
| **JavaScript, gzipped** | **< 60KB content, < 140KB tools** — unchanged |
| CSS, gzipped | < 40KB |
| Above-fold media | **< 250KB total** |
| Below-fold media | Unbudgeted, but lazy-loaded with explicit dimensions |
| Lighthouse mobile | ≥ 98 all four categories |

**Rules that make richness safe:**

- LCP element is the H1, or a hero poster image under 120KB in AVIF. **Never a video.**
- Every video: `preload="none"`, `poster` set, `muted`, `playsinline`, loads on intersection.
  `.webm` with `.mp4` fallback, under 1.5MB, max 8 seconds.
- Every image: AVIF with WebP fallback, `srcset`, explicit dimensions, native `loading="lazy"`
  below the fold.
- Ink bands use flat colour, never a full-bleed background image, unless that image is the content.
- **Numbers render as real values in HTML.** If a counter animates, it animates from the real
  value already present. Never `0` fixed by JS — the bug on your current site and Intent Farm's.
- **Every image has real alt text.** Intent Farm's nine case study links have anchor text like
  `Group-1171276648` because their thumbnails have none. Nine wasted internal links.

---

## 9. Self-critique

Checked against current AI-design defaults: no warm cream, no serif display, no terracotta; not
near-black-plus-acid-accent (ink is a chapter device, not the whole site); no identical rounded
cards with uniform soft shadows (no shadows at all — elevation is a 1px rule); no ALL-CAPS
eyebrows; no gradient washes; no `→` on buttons.

**The risk in v2:** two registers can look like two different websites if type scale, spacing
rhythm and component shapes drift between them. They must stay identical. The only thing that
changes between registers is colour.

**Watch during build:** ink bands are seductive. Cap them at the five listed in §7. A site that
alternates every section stops having rhythm and starts having stripes.
