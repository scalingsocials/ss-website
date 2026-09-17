/**
 * Real cross-engine rendering gate. This is the check that would have caught the
 * iOS hero cut-off before a human ever saw it: it renders the site in REAL
 * WebKit (the iOS Safari / iOS Chrome engine) and REAL Chromium (Android / desktop
 * Chrome), across phone → desktop widths, and fails on any horizontal overflow,
 * naming the element that is too wide.
 *
 * Blink emulators (the in-app preview, puppeteer driving local Chrome) CANNOT
 * reproduce WebKit-only bugs — that blind spot is exactly why the cut-off shipped.
 * Playwright bundles a real WebKit build, so this closes the gap locally and in CI.
 *
 * Not wired into `npm run build` (Cloudflare Pages shouldn't download browsers on
 * every deploy). Run it locally with `npm run check:browsers`, and in CI via
 * .github/workflows/browsers.yml on every push/PR.
 *
 * Usage:
 *   npm run build              # produce dist/
 *   npm run check:browsers     # serves dist/ and drives WebKit + Chromium
 *
 * First run only: `npx playwright install webkit chromium`.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium, webkit } from 'playwright';

const DIST = 'dist';
const PORT = 8199;

// Representative pages — one of every template. Keep in sync with new templates.
//
// Every entry MUST be a real built page. `/ecommerce-ppc-services/` sat here for
// weeks after it became a 301 source: the probe was served the 404 body, which
// is a single centred column that can never overflow, so the ServiceLayout —
// the template with the hero form — was silently untested. The 404 guard in the
// run loop below now fails on a missing page instead of passing it.
const PAGES = [
  '/',                                          // home
  '/seo-agency-bangalore/',                     // ServiceLayout (hero lead form)
  '/audit/',                                     // standalone form page
  '/google-ads-agency-bangalore/',               // ClusterLayout (sub-service, ink hero)
  '/meta-ads-agency-india/',                     // bespoke sub-service (tables, bars, chips)
  '/technical-seo-audit-services/',              // bespoke sub-service
  '/glossary/cac/',                             // ClusterLayout leaf
  '/case-studies/',                             // case index
  '/case-studies/wellness-brand-zero-to-scale/',// CaseStudyLayout
  '/work/',                                      // creative wall
  '/contact/',                                   // NAP + form
  '/tools/break-even-roas-calculator/',          // tool page (React island)
  '/blog/what-realistic-roas-looks-like/',       // prose
  '/terms/',                                      // legal
  '/lp/performance-marketing/',                  // LandingLayout (ad LP)
  '/lp/web-development/',                         // LandingLayout (ad LP, showcase)
  '/team/jamal-khan/',                           // author page
  '/industries/',                                // industries hub
  '/industries/fashion-apparel/',               // IndustryLayout (proof grid)
  '/vs/',                                         // comparisons hub
  '/vs/shopify-vs-woocommerce/',                // VsLayout (comparison table)
];

// Widths that matter: small phone, iPhone, large phone, tablet, laptop, desktop.
const WIDTHS = [
  { w: 360, h: 780, label: 'small-phone' },
  { w: 375, h: 812, label: 'iphone' },
  { w: 414, h: 896, label: 'large-phone' },
  { w: 768, h: 1024, label: 'tablet' },
  { w: 1024, h: 800, label: 'laptop' },
  { w: 1280, h: 800, label: 'desktop' },
  { w: 1440, h: 900, label: 'wide' },
];

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
};

/** Minimal static server for dist/, with directory-index resolution. */
const serve = () =>
  new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(req.url.split('?')[0]);
        if (p.endsWith('/')) p += 'index.html';
        let file = join(DIST, p);
        try {
          if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
        } catch { /* fall through to read error below */ }
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404); res.end('not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });

/**
 * In-page probe: is anything laid out past the layout viewport? Return offenders.
 *
 * It does NOT gate on `scrollWidth > clientWidth`. That was this gate's blind
 * spot for the whole of Sept 2026: theme.css sets `html, body { overflow-x: clip }`
 * below 1024px, and a clipped root never grows its scrollWidth. Content really
 * was hanging 48px off the right of every page with a phone field, and the gate
 * reported ✓ on all 7 widths × both engines, because it was measuring the
 * SYMPTOM (a scrollbar) rather than the FAULT (a box wider than the screen).
 * Clipping is not a fix — the pixels are still missing, they just stopped
 * announcing themselves.
 *
 * So: measure every box, and treat a box past the right edge as a failure unless
 * an INTERMEDIATE ancestor deliberately contains it. A carousel that scrolls its
 * own track, or a marquee with `overflow: hidden`, is intentional and stays
 * inside its own bounds. Clipping at html/body is not that — it is the page
 * giving up — so those two are excluded from the "someone meant this" test.
 */
const OVERFLOW_PROBE = () => {
  const docW = document.documentElement.clientWidth;
  const scrollW = document.documentElement.scrollWidth;
  const CONTAINS = /^(hidden|clip|auto|scroll)$/;

  // Is this element's overflow the responsibility of something above it?
  const contained = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (CONTAINS.test(cs.overflowX)) return true;
      // A transform/animation can park a decorative layer offscreen on purpose.
      if (cs.position === 'fixed') return true;
    }
    return false;
  };

  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Past the right edge, or STRADDLING the left edge. Not "left is negative":
    // `left: -9999px` is the standard way to park a skip link and a honeypot
    // offscreen, and flagging it buried the report in 252 false positives. A box
    // that is entirely left of the viewport was put there on purpose; one that
    // crosses x=0 is genuinely cut.
    const pastRight = r.right > docW + 1;
    const cutLeft = r.left < -1 && r.right > 0;
    if (!pastRight && !cutLeft) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    if (contained(el)) continue;
    offenders.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.'),
      left: Math.round(r.left),
      right: Math.round(r.right),
      w: Math.round(r.width),
      // Depth lets the report lead with the deepest box — the one whose own
      // min-content is usually the cause, not the ancestors it inflated.
      depth: (() => { let d = 0; for (let p = el; p; p = p.parentElement) d++; return d; })(),
    });
  }
  offenders.sort((a, b) => b.depth - a.depth);

  // Controls whose label does not fit their own box. The page-edge test above
  // cannot see this: a button can sit well inside the viewport while its text
  // runs out of both sides of it. That is exactly how the service-page hero CTAs
  // shipped broken on iPhone (2026-09-17) with this gate green — a nowrap label
  // 183px wide in a 163px button. Buttons and pill links only (short boxes);
  // tall link-cards legitimately let artwork bleed to their edges.
  const cramped = [];
  for (const el of document.querySelectorAll('a, button')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.height > 90) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || !/(flex|grid|block)/.test(cs.display)) continue;
    const padR = parseFloat(cs.paddingRight) || 0;
    const padL = parseFloat(cs.paddingLeft) || 0;
    const spills = el.scrollWidth > el.clientWidth + 1;
    // Content pushed into the padding without overflowing (the iOS flex-gap
    // bug on the floating CTA) counts too.
    const intoPadding = [...el.children].some((c) => {
      const cr = c.getBoundingClientRect();
      return cr.width > 0 && (cr.right > r.right - padR + 1 || cr.left < r.left + padL - 1);
    });
    if (!spills && !intoPadding) continue;
    cramped.push({
      text: el.innerText.trim().replace(/\s+/g, ' ').slice(0, 40),
      w: Math.round(r.width),
      needs: el.scrollWidth,
    });
  }

  // `clipped` distinguishes the two shapes in the report: a scrollbar the user
  // can drag, vs content silently cut off. Both fail; they read differently.
  const rootClips = CONTAINS.test(getComputedStyle(document.documentElement).overflowX)
    || CONTAINS.test(getComputedStyle(document.body).overflowX);
  return {
    docW, scrollW,
    overflow: offenders.length > 0 || cramped.length > 0,
    cramped: cramped.slice(0, 8),
    edge: offenders.length > 0,
    clipped: rootClips,
    widest: offenders.reduce((m, o) => Math.max(m, o.right), 0),
    offenders: offenders.slice(0, 8),
  };
};

const run = async () => {
  const server = await serve();
  const base = `http://localhost:${PORT}`;
  const failures = [];
  const engines = [
    { name: 'webkit', launcher: webkit },
    { name: 'chromium', launcher: chromium },
  ];

  for (const { name, launcher } of engines) {
    let browser;
    try {
      browser = await launcher.launch();
    } catch (err) {
      console.error(`\nCould not launch ${name}: ${err.message}`);
      console.error(`Run once:  npx playwright install ${name}`);
      await new Promise((r) => server.close(r));
      process.exit(2);
    }
    for (const vp of WIDTHS) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      for (const path of PAGES) {
        const resp = await page.goto(base + path, { waitUntil: 'load', timeout: 20000 });
        // A PAGES entry that no longer builds used to pass silently — the 404
        // body cannot overflow. Fail loudly so the list stays honest.
        if (!resp || resp.status() !== 200) {
          failures.push({ engine: name, vp: vp.label, w: vp.w, path, res: null });
          console.error(`✗ ${name} ${vp.label}(${vp.w}) ${path} — not built (HTTP ${resp?.status()}). Fix PAGES.`);
          continue;
        }
        // allow reveal transforms to settle (a mid-animation transform can
        // legitimately extend past the edge, then land back inside)
        // The floating CTA only appears after the hero scrolls away; show it so
        // its label is measured too.
        await page.evaluate(() => document.querySelector('.ss-fab__cta')?.classList.add('is-visible'));
        await page.waitForTimeout(450);
        const res = await page.evaluate(OVERFLOW_PROBE);
        if (res.overflow) {
          failures.push({ engine: name, vp: vp.label, w: vp.w, path, res });
          if (res.edge) {
            const how = res.clipped
              ? `content CLIPPED at ${res.widest}px inside a ${res.docW}px viewport (root overflow-x hides it — no scrollbar, pixels still lost)`
              : `content reaches ${res.widest}px in a ${res.docW}px viewport (scrollW ${res.scrollW})`;
            console.error(`✗ ${name} ${vp.label}(${vp.w}) ${path} — ${how}`);
            res.offenders.forEach((o) =>
              console.error(`     <${o.tag} class="${o.cls}"> left=${o.left} right=${o.right} w=${o.w}`));
          }
          if (res.cramped.length) {
            console.error(`✗ ${name} ${vp.label}(${vp.w}) ${path} — button label does not fit its button`);
            res.cramped.forEach((c) => console.error(`     "${c.text}" box=${c.w}px needs=${c.needs}px`));
          }
        } else {
          console.log(`✓ ${name} ${vp.label}(${vp.w}) ${path}`);
        }
      }
      await page.close();
    }
    await browser.close();
  }

  await new Promise((r) => server.close(r));

  if (failures.length) {
    console.error(`\nBrowser check FAILED — ${failures.length} overflow case(s) above.`);
    process.exit(1);
  }
  console.log(`\nBrowser check passed — no horizontal overflow in WebKit or Chromium across ${WIDTHS.length} widths × ${PAGES.length} pages.`);
};

run().catch((err) => { console.error(err); process.exit(1); });
