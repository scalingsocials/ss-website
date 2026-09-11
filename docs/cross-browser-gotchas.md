# Cross-browser correctness — gotchas & gates

The site must render correctly on **desktop, laptop, tablet, iOS (Safari + Chrome,
both WebKit) and Android (Chrome, Blink)**. Most one-engine bugs are WebKit-only and
are invisible in a Blink emulator (the in-app preview pane and puppeteer both drive
Blink), which is why they used to reach real iPhones before we caught them.

Two automated gates now cover this, plus a manual checklist for the classes a static
scan can't judge.

## Gate 1 — `npm run check:gotchas` (static, in every `build`)

Scans `src/**/*.{astro,css}`. Fast, no browser, safe inside the Cloudflare build.

**Fails the build (always-wrong):**
- `backdrop-filter` without a `-webkit-backdrop-filter` sibling — the blur silently
  no-ops on iOS Safari.
- `mask-image` / `mask` without a `-webkit-mask-image` sibling — the mask is dropped on
  older iOS Safari.
- Viewport meta missing `viewport-fit=cover` — `env(safe-area-inset-*)` is **0** on
  notched iPhones without it, so all notch / home-indicator handling silently dies.
- Viewport meta blocking zoom (`user-scalable=no` / `maximum-scale=1`) — a11y failure.

**Warns (worth a glance, never fails):**
- Multi-track `grid-template-columns` using `fr` without `minmax(0, …)` — on WebKit a
  track floors at a child's *min-content* width and can blow past a phone viewport (this
  was the Sept 2026 iOS hero cut-off). Tailwind's `grid-cols-*` already compile to
  `minmax(0,1fr)`, so only hand-written CSS is at risk.
- Bare `100vh` in a size property with no `svh`/`dvh` nearby — `100vh` includes the iOS
  address bar, so the element is taller than the visible screen.

Opt a single line out of one rule with a trailing `/* gotcha-ok: <rule-id> */`
(rule-ids: `backdrop-webkit`, `mask-webkit`, `viewport-fit`, `viewport-zoom`,
`grid-minmax`, `vh`; or `gotcha-ok: all` for the whole line). Use sparingly, say why.

## Gate 2 — `npm run check:browsers` (real engines, CI)

Renders the site in **real WebKit** (the iOS Safari / iOS Chrome engine) and **real
Chromium** (Android / desktop Chrome) via Playwright, across 7 widths
(360, 375, 414, 768, 1024, 1280, 1440) × one page of every template, and **fails on any
horizontal overflow, naming the element that is too wide**. This is the empirical proof
that nothing is clipped or scrolling sideways on any device.

Not in `npm run build` (Cloudflare shouldn't download browsers per deploy). It runs:
- locally: `npm run build && npm run check:browsers` (first time:
  `npx playwright install webkit chromium`);
- in CI: `.github/workflows/ci.yml`, on every push/PR to `main`.

Add a page to the `PAGES` array in `scripts/check-browsers.mjs` whenever a new template
is introduced.

## Manual checklist (the classes a scan can't judge)

Run through these on a real iPhone (or BrowserStack) before a launch:

- **Tap targets** ≥ 44px, or ≥ 24px with spacing (WCAG 2.5.8). Audited in
  `docs/mobile-audit.md`; re-check any new interactive control.
- **Form inputs** ≥ 16px font-size, or iOS zooms the page on focus. (Ours use
  `--text-body`/`1rem`.)
- **`position: sticky`** needs no `overflow: hidden`/`clip`/`auto` on an ancestor, or it
  silently stops sticking. We use `overflow-x: clip` only below the desktop breakpoint,
  where the sticky asides don't run.
- **Momentum scroll rails** carry `-webkit-overflow-scrolling: touch`.
- **Reduced motion** — every animation respects `prefers-reduced-motion: reduce`.
- **Safe areas** — full-bleed fixed elements pad with `env(safe-area-inset-*)` (now live,
  since `viewport-fit=cover` is set).
- **Backdrop-filter over animated bordered elements** can leave a 1px repaint ghost on
  Chrome; promote the animated element to its own layer (`translate3d` + `will-change`),
  as the desktop nav panels do.

## History — bugs this would have caught

- **iOS hero cut-off** (WebKit grid track sized to max-content) → Gate 2 would have failed
  at 360/375/414 in WebKit; Gate 1 warns on the grid pattern.
- **Header blur missing on iPhone** (`backdrop-filter` unprefixed) → Gate 1 error.
- **Safe-area code doing nothing on iOS** (no `viewport-fit=cover`) → Gate 1 error.
