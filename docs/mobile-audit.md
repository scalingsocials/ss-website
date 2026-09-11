# Mobile optimisation pass — audit & fixes

Measured with **headless Chrome** (puppeteer-core) against the production build,
emulating mobile at **360 / 390 / 414 / 768px**, plus Lighthouse mobile on Home.
(The in-app preview pane is unreliable while minimised, so all numbers here come
from headless Chrome.) Fixes were made in **shared layouts/components** so each
lands across every page that uses them.

## Baseline (before)

| Template | H-overflow @360 | Undersized tap targets @390 | Body font | Img w/h | Inputs ≥16px |
|---|---|---|---|---|---|
| Home | none | 33 | 18px ✓ | all set ✓ | ✓ |
| Service (ServiceLayout ×6) | none | 34 | 18px | ✓ | ✓ |
| Cluster (ClusterLayout ×10) | none | 31 | 18px | ✓ | ✓ |
| Case index | none | 28 | 18px | ✓ | ✓ |
| **Case study (×7)** | **YES → 473px** | 30 | 18px | ✓ | ✓ |
| Work | none | 28 | 18px | ✓ | ✓ |
| Contact | none | 37 | 18px | ✓ | ✓ |
| ROAS calculator | none | 30 | 18px | ✓ | ✓ |
| Blog / Legal | none | 27–31 | 18px | ✓ | ✓ |

**Lighthouse (Home, mobile):** Accessibility **100**, Best Practices **100**, SEO **100**, CLS **0**.
(Performance metric was unreliable against a local static server — LCP is the text
`<h1>`, JS is ≈6.3KB/page, images are dimensioned, so CWV risk is low.)

### Top failures found
1. Footer nav links 26px tall (×14/page, every page).
2. **Case-study pages overflow to 473px** — an `sr-only` `<table>` (a `<table>` ignores `width:1px`) was unclipped and extended the scroll width.
3. Footer phone/email links 26px; footer social 36px; legal row 13px tall.
4. Header hamburger 37–40px; mobile CTA 39px; logo link 28px.
5. Contact copy buttons 32px; contact social 40px; contact NAP links 26–31px.
6. "See more" links (See the full wall / All case studies / All teardowns) 26px; testimonial arrows 40px; service "Learn more" 34px.
7. Form inputs 29px tall (no min-height).

## Fixes (shared components first)

| # | File | Change | Why |
|---|---|---|---|
| 1 | `Footer.astro` | Nav/NAP links `min-height:44px`; social icons 36→44px; legal row links 44px tall; brand-logo link 44px | Tap targets on every page |
| 2 | `Header.astro` + `Button.astro` | Hamburger/close `min-h/w:44px`; `sm`/`md` buttons `min-height:44px`; logo link `min-height:44px`; `padding-top:env(safe-area-inset-top)` on fixed header | Controls + notch safe-area |
| 3 | `CaseVisual.astro` | Wrapped each `sr-only` data table in `<div class="sr-only">` (the div clips the wide child) | Kills case-study horizontal overflow |
| 4 | `index.astro` | `.ss-link-arrow` `min-height:44px`; sticky CTA `bottom: calc(space + env(safe-area-inset-bottom))` | "See more" targets + home-indicator clearance |
| 5 | `Teardowns.astro` / `Testimonials.astro` | "All teardowns" 44px; nav arrows 40→44px | Targets |
| 6 | `contact/index.astro` | Copy buttons 32→44px; social 40→44px; phone/email/get-directions links 44px; email `break-all` | Targets + no overflow |
| 7 | `LeadForm.astro` | `.ss-input` `min-height:44px` | Inputs ≥44px (already ≥16px font → no iOS zoom) |
| 8 | `ServiceLayout` / `ClusterLayout` / `CaseStudyLayout` / tool pages | "Learn more" 44px; breadcrumb links 44px tall | Targets |
| 9 | `nav.ts` | Body scroll-lock while mobile menu open; released on the dialog `close` event (button / backdrop / Esc) | No background scroll behind menu |

Already compliant (verified, no change): viewport meta correct site-wide (no
`user-scalable=no`); body 18px; form inputs ≥16px; every `<img>` has width/height
(CLS 0); tables wrap in `overflow-x:auto`; `LogoWall`/`CreativeWall` marquees and
count-up/reveal respect `prefers-reduced-motion`; mobile menu is a native
`<dialog>` (focus trap, Esc, focus-return); nav dropdowns have tap-toggle +
`aria-expanded`.

## After

| Template | H-overflow @360/390/414/768 | Genuine undersized targets |
|---|---|---|
| Home | none / none / none / none | 0 |
| Service / Cluster | none ×4 | 0 |
| Case index / **Case study** | none ×4 (**473→ok**) | 0 |
| Work / Contact / ROAS / Blog / Legal | none ×4 | 0 |

Remaining scan flags are **not** genuine failures:
- **Inline text links** — breadcrumb items (Home/Tools), the footer legal row
  (Terms/Privacy/Sitemap) and in-prose links on legal pages read as <44px *wide*
  only because the words are short; they are now 44px **tall** and fall under the
  WCAG 2.5.8 inline exception.
- **Honeypot input** (`.ss-hp`, `left:-9999px`, `tabindex="-1"`) — an off-screen
  spam trap, not a user target (scan false positive).
- **Logo while the header is scrolled** — the deliberate shrink scales it to ~36px;
  it is ≥44px at the top of the page and remains AA-compliant (2.5.8, ≥24px + ample
  spacing) while compact.

## Needs a design decision (optional)
- Making footer targets 44px makes the mobile footer taller (approved: "best practices").
- The scrolled-header logo is 36px by design; raising it to 44px would reduce the
  header-shrink effect. Left as-is per the shrink design — say if you'd rather it
  stay 44px when scrolled.
