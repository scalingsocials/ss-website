#!/usr/bin/env node
/**
 * Internal link + orphan gate. See 03 §0 (Zero orphan pages), §2 (internal linking).
 *
 * Two checks over the built site:
 *  1. Broken internal links — every internal <a href> must resolve to a built
 *     page or a static asset in dist. Never a 404 (03 §7 redirect rules).
 *  2. Orphans — every indexable page must have at least one inbound internal
 *     link from another page. The home page is exempt (it is the root), and
 *     noindex / out-of-sitemap routes are exempt (styleguide, thank-you, lp, api).
 *
 * External links, mailto:, tel:, and pure #fragments are not checked here.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://scalingsocials.com';

// Routes exempt from the orphan requirement (noindex / out-of-sitemap).
const ORPHAN_EXEMPT = [/^\/styleguide\//, /^\/thank-you\//, /^\/lp\//, /^\/api\//, /^\/keystatic/, /^\/404\//];
const isExempt = (route) => route === '/' || ORPHAN_EXEMPT.some((re) => re.test(route));

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
};

const fileToRoute = (file) => {
  let r = '/' + relative(DIST, file).split(sep).join('/');
  if (r.endsWith('/index.html')) r = r.slice(0, -'index.html'.length);
  else if (r.endsWith('.html')) r = r.slice(0, -'.html'.length) + '/';
  return r;
};

let dist;
try {
  dist = await walk(DIST);
} catch {
  console.error(`✗ ${DIST}/ not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const htmlFiles = dist.filter((f) => extname(f) === '.html');
const routes = new Set(htmlFiles.map(fileToRoute));
const distRel = new Set(dist.map((f) => '/' + relative(DIST, f).split(sep).join('/')));

const inbound = new Map(); // route -> count of inbound internal links
for (const r of routes) inbound.set(r, 0);

const HREF_RE = /<a\b[^>]*\bhref=["']([^"']+)["']/gi;
const broken = [];

const normalise = (href) => {
  let h = href.trim();
  if (h.startsWith(SITE)) h = h.slice(SITE.length) || '/';
  return h;
};

for (const file of htmlFiles) {
  const fromRoute = fileToRoute(file);
  const src = await readFile(file, 'utf8');
  for (const m of src.matchAll(HREF_RE)) {
    const raw = m[1];
    if (/^(https?:)?\/\//i.test(raw) && !raw.startsWith(SITE)) continue; // external
    if (/^(mailto:|tel:|#|data:|javascript:)/i.test(raw)) continue;

    let target = normalise(raw).split('#')[0].split('?')[0];
    if (!target) continue;
    if (!target.startsWith('/')) continue; // ignore anything relative/odd

    // Resolve: a known route, or a static asset present in dist.
    const asRoute = target.endsWith('/') ? target : target + '/';
    if (routes.has(target) || routes.has(asRoute)) {
      const hit = routes.has(target) ? target : asRoute;
      if (hit !== fromRoute) inbound.set(hit, (inbound.get(hit) ?? 0) + 1);
      continue;
    }
    if (distRel.has(target)) continue; // static file (image, pdf, txt…)

    broken.push(`${fileToRoute(file)} → ${raw} (does not resolve to a built page or asset)`);
  }
}

const orphans = [...routes].filter((r) => !isExempt(r) && (inbound.get(r) ?? 0) === 0);

console.log(`Links: ${routes.size} page(s), ${broken.length} broken, ${orphans.length} orphan(s).`);

const fails = [];
for (const b of broken) fails.push(`broken link: ${b}`);
for (const o of orphans) fails.push(`orphan page (zero inbound internal links): ${o}`);

if (fails.length) {
  console.error('\nLink check FAILED:');
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('Link check passed.');
