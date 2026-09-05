/**
 * Unify the per-page CSP into one policy shared by every page.
 *
 * WHY THIS EXISTS
 * Astro's CSP emits a per-page policy containing SHA-256 hashes of only that
 * page's inline <script> and <style> elements. That is correct for full page
 * loads and WRONG the moment <ClientRouter /> is in play: a CSP delivered in a
 * <meta> tag is only honoured while the document is first parsed, and view
 * transitions swap the DOM without ever reloading the document. So the policy
 * from whichever page you landed on stays in force for the whole session, and
 * every subsequent page's inline <style> is refused:
 *
 *   Refused to apply inline style because it violates the following Content
 *   Security Policy directive: "style-src 'self' 'sha256-…'"
 *
 * The visible symptom is a page that renders correctly on a hard load and loses
 * its component-scoped styles when you navigate to it by clicking a link — the
 * shared external stylesheet still applies, so the header and footer look fine
 * while things like the logo marquee collapse.
 *
 * Delivering the policy as a header instead does not help: the document's policy
 * is still fixed at load. The only correct fix while ClientRouter is enabled is
 * for every page to carry the SAME policy, so that whichever page the visitor
 * lands on already permits the inline content of every page they can reach.
 *
 * This script therefore rewrites each page's CSP to the union of all pages'
 * hashes. It runs after `astro build`, derives everything from the built output,
 * and so cannot drift from the source. `scripts/check-csp.mjs` verifies the
 * result and fails the build if any page's own inline content is not covered.
 *
 * If <ClientRouter /> is ever removed, this step becomes unnecessary (though
 * harmless) and the tighter per-page policy could be restored.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const META_RE =
  /<meta\s+http-equiv="content-security-policy"\s+content="([^"]*)"\s*\/?>/i;

/** Directives whose value is a source list we need to merge across pages. */
const MERGED = new Set(['script-src', 'style-src']);

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
};

const parse = (policy) => {
  const map = new Map();
  for (const part of policy.split(';')) {
    const t = part.trim();
    if (!t) continue;
    const i = t.indexOf(' ');
    if (i === -1) map.set(t, []);
    else map.set(t.slice(0, i), t.slice(i + 1).trim().split(/\s+/));
  }
  return map;
};

let files;
try {
  files = await walk(DIST);
} catch {
  console.error(`✗ ${DIST}/ not found. Run \`astro build\` first.`);
  process.exit(1);
}

// Pass 1 — union every page's directives.
const union = new Map(); // directive -> Set(values)
const order = []; // preserve first-seen directive order for a stable policy
let seen = 0;

for (const f of files) {
  const html = await readFile(f, 'utf8');
  const m = html.match(META_RE);
  if (!m) continue;
  seen++;
  for (const [dir, vals] of parse(m[1])) {
    if (!union.has(dir)) {
      union.set(dir, new Set());
      order.push(dir);
    }
    const set = union.get(dir);
    if (MERGED.has(dir)) for (const v of vals) set.add(v);
    else for (const v of vals) set.add(v);
  }
}

if (seen === 0) {
  console.log('CSP: no policy found in the build — nothing to unify.');
  process.exit(0);
}

// Keep source lists deterministic: keywords/origins first, then sorted hashes.
const render = (dir) => {
  const vals = [...union.get(dir)];
  const hashes = vals.filter((v) => v.startsWith("'sha")).sort();
  const rest = vals.filter((v) => !v.startsWith("'sha"));
  const all = [...rest, ...hashes];
  return all.length ? `${dir} ${all.join(' ')}` : dir;
};

const policy = order.map(render).join('; ');

// Pass 2 — write the same policy into every page that carries one.
let written = 0;
for (const f of files) {
  const html = await readFile(f, 'utf8');
  if (!META_RE.test(html)) continue;
  const next = html.replace(
    META_RE,
    `<meta http-equiv="content-security-policy" content="${policy}">`,
  );
  if (next !== html) {
    await writeFile(f, next);
    written++;
  }
}

const counts = order
  .filter((d) => MERGED.has(d))
  .map((d) => `${d}: ${[...union.get(d)].filter((v) => v.startsWith("'sha")).length} hashes`)
  .join(', ');

console.log(
  `CSP: unified one policy across ${seen} page(s) (${written} rewritten) — ${counts}, ${(policy.length / 1024).toFixed(1)}KB.`,
);
