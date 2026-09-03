# 09 — Designer Asset Brief

Everything the build needs from a designer, with formats and quantities. Hand this over as-is
to get a quote.

**Read first:** `08-DESIGN-BRIEF.md` for palette, type, motif and the two-register concept.

---

## Ground rules for every asset

| Rule | Why |
|---|---|
| **SVG wherever the asset is vector** (logos, icons, illustration, diagrams). Not PNG. | Sharp at any size, a few KB, recolourable in code |
| **Every SVG optimised through SVGO**, no embedded raster, no `<image>` tags | A 400KB "SVG" with a PNG inside defeats the point |
| **Raster delivered as source + AVIF/WebP exports** at 1× and 2× | Build pipeline handles the rest |
| **Every asset must work on BOTH `#F7F7F4` paper and `#12141C` ink** | Two registers. Deliver light and dark variants where the asset can't be recoloured by CSS |
| **Palette locked to §4 of the design brief** | No new colours introduced per-asset |
| **Named descriptively**, lowercase, hyphens: `service-meta-ads-illustration.svg` | Not `Group-1171276544.png`. Filenames become alt text fallbacks and part of image SEO |
| **No stock photography, no stock illustration, no generic 3D blobs** | The point is that it can't be mistaken for a template |
| **No text baked into images** | Text in images is invisible to Google and to AI crawlers. All copy is live HTML |

---

## A. Brand core — required before build starts

| # | Asset | Format | Spec |
|---|---|---|---|
| A1 | Primary logo | SVG | Horizontal lockup, live text converted to outlines |
| A2 | Logo — ink variant | SVG | For dark bands |
| A3 | Logomark only | SVG | Square, for favicon and avatars |
| A4 | Favicon set | SVG + ICO + PNG | 16, 32, 180 (Apple touch), 512 |
| A5 | Schema logo | PNG | **512×512, square, transparent.** Required by `Organization` schema |
| A6 | OG image template | Figma frame | 1200×630. Build generates per-page versions from this |

---

## B. Service illustrations — the biggest visual lever

**Six illustrations, one per service pillar.** This is where the design budget should go. It's
the single thing that stops the site looking templated, and it's what Intent Farm's custom
composite graphics are doing for them.

| # | Service | Suggested subject |
|---|---|---|
| B1 | Performance marketing | Funnel or spend-to-revenue flow |
| B2 | Meta ads | Creative testing — variants fanning out, one winning |
| B3 | Google ads | Intent capture — a query resolving to a result |
| B4 | SEO | Compounding growth over time |
| B5 | Shopify development | Storefront to checkout, structural |
| B6 | Web development | Build/architecture metaphor |

**Spec:** SVG, roughly 800×600 artboard, works on both grounds (or two variants), max 4 colours
from the palette, no gradients, no drop shadows, no text. Flat and structural rather than
decorative — these should look like diagrams a smart person drew, not marketing illustration.

**Optional upgrade:** if budget allows, make three of them animatable — deliver as layered SVG
with named groups so the build can animate on scroll or hover. Adds real polish for almost no
weight.

---

## C. Iconography

| # | Asset | Format | Spec |
|---|---|---|---|
| C1 | Icon set, 24 icons | SVG sprite | 24×24 grid, 1.5px stroke, `currentColor` only — no hardcoded fills. Covers services, process steps, benefits, UI |
| C2 | Process step markers, 5 | SVG | For the five engagement phases |

**Critical:** `stroke="currentColor"`, never a fixed hex. That's what lets one icon set work in
both registers with zero extra files.

---

## D. Video and motion — your portfolio

This is the highest-impact section on the site and you already own most of the source material.

| # | Asset | Format | Spec |
|---|---|---|---|
| D1 | Creative wall clips — 8 to 12 | `.webm` (VP9) + `.mp4` (H.264) | **Max 8 seconds, under 1.5MB each, muted, 1080×1350 or 1080×1920.** Real ad creatives you ran, cut to their strongest moment |
| D2 | Poster frame for each clip | AVIF + WebP | Matching dimensions, under 60KB. Loads first; video swaps in on scroll |
| D3 | Hero background clip | `.webm` + `.mp4` | Max 6s, under 1.2MB, subtle and low-contrast enough for type to sit over it |
| D4 | Hero poster | AVIF | **Under 120KB.** This is the LCP fallback — hard limit |
| D5 | Brand result overlay | Figma component | Small tag on each clip: brand name + one metric. Rendered as HTML over the video, not baked in |

**Client permission required** before any client creative goes on the site. Add it to the same
conversation as the case study permissions.

---

## E. Case study visual system

| # | Asset | Format | Spec |
|---|---|---|---|
| E1 | Case study card template | Figma component | Brand mark, headline metric, category tag |
| E2 | Results chart style | Figma spec | How before/after charts look in both registers. Build renders live SVG from this |
| E3 | Screenshot frame | SVG or CSS spec | Consistent treatment for dashboard screenshots — border, corner, annotation placement |
| E4 | Annotation marker | SVG + spec | The site motif (§3 of the design brief). Line weight, tag shape, type size, both registers |
| E5 | Before/after layout | Figma component | For creative and website comparisons |

Actual dashboard screenshots come from your account managers, not the designer — see `05`.

---

## F. Benchmark Index — the loudest page

This is the moat. It should be the most visually ambitious thing on the site.

| # | Asset | Format | Spec |
|---|---|---|---|
| F1 | Data-viz style guide | Figma | Chart types, categorical colour sequence (5 hues derived from indigo), axis and grid treatment, tooltips, legend. Both registers |
| F2 | Index identity | SVG | A sub-brand mark for "India D2C Ad Benchmark Index" — it gets cited and embedded elsewhere, so it needs to stand alone |
| F3 | Embed widget frame | Figma | How a single benchmark chart looks embedded on someone else's site, with attribution |
| F4 | Report cover | Figma + PDF export | For the downloadable version |

---

## G. Photography — brief a photographer, half day

| # | Subject | Spec |
|---|---|---|
| G1 | Team portraits — all staff | Consistent lighting, plain background, same crop. Square, min 1200×1200 |
| G2 | Four founder portraits | Tayeb, Jamal, Maaz, Kushal. Same treatment, higher res |
| G3 | Office — 8 to 10 shots | Real space, real people working. Also feeds the Google Business Profile |
| G4 | Working sessions — 6 to 8 | Whiteboards, screens, actual meetings. For About and careers |

**No stock, no posed handshakes, no pointing-at-laptops.** Real photos of your actual team are
worth more than any purchased image, and they're an E-E-A-T signal.

---

## H. Ad landing pages

| # | Asset | Format | Spec |
|---|---|---|---|
| H1 | LP hero variants — 3 | Figma | One per campaign theme: audit offer, Shopify offer, growth plan |
| H2 | Offer badge | SVG | The "free audit" mark, both registers |
| H3 | Trust row | Figma component | Partner badges, review score, client count |

---

## I. Social and OG

| # | Asset | Format | Spec |
|---|---|---|---|
| I1 | OG templates — 4 | Figma | Home, service, case study, article. 1200×630 |
| I2 | LinkedIn banner | PNG | 1128×191 |
| I3 | Benchmark launch graphics — 5 | PNG/MP4 | For the Index launch push |

---

## Priority and phasing

Not all of this is needed at once. Order it like this so the build is never blocked.

**Phase 1 — blocks the build (week 1)**
A1–A6, C1, E4 (the annotation motif), D4 (hero poster)

**Phase 2 — needed before launch (weeks 2–5)**
B1–B6 (service illustrations), C2, D1–D3, D5, E1–E3, E5, G1–G4

**Phase 3 — post-launch (weeks 6–10)**
F1–F4 (Benchmark), H1–H3, I1–I3

---

## What to tell the designer

> We're rebuilding a performance marketing agency site for Indian D2C founders — technical,
> P&L-literate people who evaluate vendors carefully. The concept is two registers: light
> "paper" sections for reading, full-bleed dark "ink" sections for showing work. Palette,
> type and the annotation motif are locked in the attached design brief — please work within
> them rather than proposing a new direction.
>
> The visual reference for **density and ambition** is intentfarm.com. We are not copying
> their aesthetic — ours is quieter, more structural, built around data and annotation rather
> than hashtags and gradients.
>
> Priority is the six service illustrations. They carry the site.
>
> Everything vector ships as optimised SVG using `currentColor` where possible, so the build
> can recolour for both registers without duplicate files. No text baked into any image.

---

## If you build it in-house instead

Claude Code can generate the icon set (C1), the annotation component (E4), the chart styles
(F1) and all layout components directly. What it genuinely cannot do well is **B1–B6, the
service illustrations** — that needs a human with taste, and it's the thing that will make or
break how the site reads.

If you commission one line item from this document, make it the six illustrations.
