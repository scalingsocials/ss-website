#!/usr/bin/env node
/**
 * Performance budget gate. Fails the build on breach.
 * Budgets from docs/spec/01-STACK-AND-ARCHITECTURE.md §4 and 08-DESIGN-BRIEF.md §8.
 *
 * JavaScript is now measured PER PAGE against the two documented tiers:
 *   - content page: < 60 KB gzipped
 *   - tool page (/tools/…): < 140 KB gzipped — the only place a React island loads
 * A page's JS is every module it references (script src + modulepreload/preload)
 * plus everything those modules statically import, transitively. React loads only
 * on island (tool) pages, so content pages stay lean. This replaces the old global
 * sum, which could not represent the two tiers the spec has always defined.
 *
 * The JS budget is about JAVASCRIPT, not visual richness. Images, video, type and
 * illustration do not count against it.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, normalize, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';

const BUDGET = {
  jsContent: 60 * 1024,
  jsTool: 140 * 1024,
  cssTotal: 40 * 1024,
  htmlDoc: 100 * 1024,
  heroPoster: 120 * 1024,
  videoFile: 1.5 * 1024 * 1024,
};

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    e.isDirectory() ? await walk(p, out) : out.push(p);
  }
  return out;
};

const gzCache = new Map();
const gz = async (p) => {
  if (gzCache.has(p)) return gzCache.get(p);
  const v = gzipSync(await readFile(p)).length;
  gzCache.set(p, v);
  return v;
};
const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

const files = await walk(DIST);
const fails = [];
const warns = [];

// --- JavaScript, per page --------------------------------------------------
const isPagefind = (f) => f.split(sep).join('/').includes('/pagefind/');

// Map a page-absolute URL (/_astro/x.js) to a dist file path.
const urlToFile = (url) => {
  const clean = url.split('?')[0].split('#')[0];
  if (!clean.startsWith('/')) return null;
  return normalize(join(DIST, clean));
};

// Static import specifiers inside a built JS module.
const IMPORT_RE =
  /(?:import|export)\b[^'"`]*?\bfrom\s*['"]([^'"]+)['"]|(?:^|[^\w$.])import\s*['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

async function reachableFrom(entries) {
  const seen = new Set();
  const stack = entries.filter(Boolean);
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f) || extname(f) !== '.js') continue;
    let src;
    try {
      src = await readFile(f, 'utf8');
    } catch {
      continue;
    }
    seen.add(f);
    IMPORT_RE.lastIndex = 0;
    let m;
    while ((m = IMPORT_RE.exec(src))) {
      const spec = m[1] || m[2] || m[3];
      if (!spec || !(spec.startsWith('./') || spec.startsWith('../'))) continue;
      stack.push(normalize(join(dirname(f), spec)));
    }
  }
  return seen;
}

const htmlFiles = files.filter((f) => extname(f) === '.html');

const fileToRoute = (f) => {
  let r = '/' + relative(DIST, f).split(sep).join('/');
  if (r.endsWith('/index.html')) r = r.slice(0, -'index.html'.length);
  else if (r.endsWith('.html')) r = r.slice(0, -'.html'.length) + '/';
  return r;
};

const SCRIPT_SRC = /<script[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["']/gi;
const SCRIPT_SRC2 = /<script[^>]*\bsrc=["']([^"']+)["'][^>]*\btype=["']module["']/gi;
const MODPRELOAD = /<link[^>]*\brel=["']modulepreload["'][^>]*\bhref=["']([^"']+)["']/gi;
const PRELOAD_SCRIPT = /<link[^>]*\brel=["']preload["'][^>]*\bas=["']script["'][^>]*\bhref=["']([^"']+)["']/gi;
// Astro islands reference their component + renderer (React) via these attrs,
// not via <script src>. They load on hydration, so they count toward the page.
const ISLAND = /\b(?:component-url|renderer-url|before-hydration-url)=["']([^"']+)["']/gi;

let worstContent = { route: '(none)', size: 0 };
let worstTool = { route: '(none)', size: 0 };

for (const file of htmlFiles) {
  const route = fileToRoute(file);
  const src = await readFile(file, 'utf8');
  const urls = new Set();
  for (const re of [SCRIPT_SRC, SCRIPT_SRC2, MODPRELOAD, PRELOAD_SCRIPT, ISLAND]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) urls.add(m[1]);
  }
  const entries = [...urls].map(urlToFile).filter((p) => p && !isPagefind(p));
  const reachable = await reachableFrom(entries);
  let total = 0;
  for (const p of reachable) total += await gz(p);

  const isTool = route.startsWith('/tools/');
  const budget = isTool ? BUDGET.jsTool : BUDGET.jsContent;
  const tierName = isTool ? 'tool' : 'content';
  if (total > budget) {
    fails.push(`${route}: JS ${kb(total)} gzipped exceeds the ${tierName} budget ${kb(budget)}.`);
  }
  if (isTool) {
    if (total > worstTool.size) worstTool = { route, size: total };
  } else if (total > worstContent.size) {
    worstContent = { route, size: total };
  }
}

// --- CSS -------------------------------------------------------------------
let cssTotal = 0;
for (const f of files.filter((f) => extname(f) === '.css')) cssTotal += await gz(f);
if (cssTotal > BUDGET.cssTotal) {
  fails.push(`CSS ${kb(cssTotal)} gzipped exceeds ${kb(BUDGET.cssTotal)}.`);
}

// --- HTML + content checks -------------------------------------------------
for (const f of htmlFiles) {
  const size = (await stat(f)).size;
  if (size > BUDGET.htmlDoc) warns.push(`${f} is ${kb(size)} (budget ${kb(BUDGET.htmlDoc)})`);

  const src = await readFile(f, 'utf8');

  // Placeholder-zero counters. This is the bug live on scalingsocials.com and
  // on intentfarm.com: Google and every LLM crawler sees `0 Cr+`.
  if (/>\s*0\s*(Cr\+|\+|x|×|%)\s*</i.test(src)) {
    fails.push(`${f} renders a placeholder zero counter. Ship the real number in the HTML.`);
  }

  // Images without alt.
  const imgs = src.match(/<img\b[^>]*>/g) || [];
  for (const img of imgs) {
    if (!/\salt\s*=/.test(img)) fails.push(`${f} has an <img> with no alt attribute.`);
    if (!/\swidth\s*=/.test(img) || !/\sheight\s*=/.test(img)) {
      warns.push(`${f} has an <img> without explicit width/height (CLS risk).`);
    }
  }

  // Video must never be the LCP element.
  if (/<video\b[^>]*\bautoplay\b[^>]*>/.test(src) && !/poster=/.test(src)) {
    fails.push(`${f} autoplays video with no poster. LCP element must never be a video.`);
  }

  if ((src.match(/<h1\b/g) || []).length !== 1) {
    fails.push(`${f} must have exactly one <h1>.`);
  }
}

// --- Media -----------------------------------------------------------------
for (const f of files.filter((f) => ['.mp4', '.webm'].includes(extname(f)))) {
  const size = (await stat(f)).size;
  if (size > BUDGET.videoFile) {
    fails.push(`${f} is ${kb(size)}, over the ${kb(BUDGET.videoFile)} per-video budget.`);
  }
}

// --- Report ----------------------------------------------------------------
console.log(
  `JS worst content ${worstContent.route} ${kb(worstContent.size)} / ${kb(BUDGET.jsContent)}   ` +
    `worst tool ${worstTool.route} ${kb(worstTool.size)} / ${kb(BUDGET.jsTool)}   ` +
    `CSS ${kb(cssTotal)} / ${kb(BUDGET.cssTotal)}   ${htmlFiles.length} pages`
);
for (const w of warns) console.warn(`  warn  ${w}`);

if (fails.length) {
  console.error('\nPerformance budget FAILED:');
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('Performance budget passed.');
