/**
 * CSP gate. Catches, statically, the bug class that broke the site on
 * 2026-09-05: a page whose own inline <style>/<script> is not permitted by the
 * policy the visitor's document is actually running under.
 *
 * Two invariants, both required while <ClientRouter /> is enabled:
 *
 *   1. EVERY page carries an IDENTICAL policy. With client-side navigation the
 *      landing page's policy governs the whole session, so any per-page
 *      variation means some page will be refused its inline styles depending on
 *      where the visitor entered the site.
 *
 *   2. EVERY inline <style> and <script> hashes to a value present in that
 *      policy. This is what actually proves a page will render, and it is
 *      checked by recomputing the SHA-256 the browser would compute rather than
 *      by trusting the build.
 *
 * It also refuses 'unsafe-inline'/'unsafe-eval' in script-src or style-src, so
 * nobody can quietly "fix" a violation by widening the policy instead.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';
const META_RE =
  /<meta\s+http-equiv="content-security-policy"\s+content="([^"]*)"\s*\/?>/i;

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
};

const sha256 = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

const directive = (policy, name) => {
  const m = policy.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`));
  return m ? m[1].trim().split(/\s+/) : [];
};

/** Inline elements of a tag, excluding those with a src and non-executable types. */
const inlineOf = (html, tag) => {
  const out = [];
  const re = new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)</${tag}>`, 'gi');
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\ssrc\s*=/.test(attrs)) continue;
    if (tag === 'script') {
      // JSON-LD and other data blocks are not executed, so they are not hashed.
      const type = attrs.match(/type\s*=\s*"([^"]*)"/i)?.[1] ?? '';
      if (type && !/^(module|text\/javascript|application\/javascript)$/i.test(type)) continue;
    }
    out.push(m[2]);
  }
  return out;
};

let files;
try {
  files = await walk(DIST);
} catch {
  console.error(`✗ ${DIST}/ not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const fails = [];
const policies = new Map(); // policy -> sample page
let checked = 0;
let hashed = 0;

for (const f of files) {
  const html = await readFile(f, 'utf8');
  const m = html.match(META_RE);
  const page = f.replace(/^dist/, '') || '/';

  const inlineStyles = inlineOf(html, 'style');
  const inlineScripts = inlineOf(html, 'script');

  if (!m) {
    if (inlineStyles.length || inlineScripts.length) {
      fails.push(`${page}: has inline style/script but no CSP policy`);
    }
    continue;
  }
  checked++;
  const policy = m[1];
  if (!policies.has(policy)) policies.set(policy, page);

  for (const d of ['script-src', 'style-src']) {
    const vals = directive(policy, d);
    for (const bad of ["'unsafe-inline'", "'unsafe-eval'"]) {
      if (vals.includes(bad)) fails.push(`${page}: ${d} contains ${bad}`);
    }
  }

  const styleSrc = new Set(directive(policy, 'style-src'));
  const scriptSrc = new Set(directive(policy, 'script-src'));

  for (const s of inlineStyles) {
    hashed++;
    if (!styleSrc.has(sha256(s))) {
      fails.push(`${page}: an inline <style> is not covered by style-src (would be refused)`);
      break;
    }
  }
  for (const s of inlineScripts) {
    hashed++;
    if (!scriptSrc.has(sha256(s))) {
      fails.push(`${page}: an inline <script> is not covered by script-src (would be refused)`);
      break;
    }
  }
}

if (policies.size > 1) {
  const sample = [...policies.values()].slice(0, 4).join(', ');
  fails.push(
    `pages do not share one policy (${policies.size} distinct). With <ClientRouter /> the ` +
      `landing page's policy governs the whole session, so the others will lose their ` +
      `inline styles when reached by a link. Seen on: ${sample}. ` +
      `scripts/unify-csp.mjs should have merged these.`,
  );
}

console.log(
  `CSP: ${checked} page(s), ${policies.size} distinct policy(ies), ${hashed} inline block(s) verified.`,
);

if (fails.length) {
  for (const f of fails.slice(0, 12)) console.error(`  ✗ ${f}`);
  if (fails.length > 12) console.error(`  … and ${fails.length - 12} more`);
  console.error('CSP check failed.');
  process.exit(1);
}
console.log('CSP check passed.');
