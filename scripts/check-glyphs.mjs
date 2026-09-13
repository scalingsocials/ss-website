/**
 * Sub-service glyph gate.
 *
 * Every sub-service card on a service page carries a line glyph chosen by
 * src/lib/glyphFor.ts from the card's title. The rules are first-match-wins, so
 * a generic pattern placed too early silently swallows the specific ones: before
 * 2026-09-13 all four SEO sub-services resolved to the same 'chart' because
 * /seo/ ran before /answer engine/, /local/ and /technical/. Four identical
 * icons on one grid carry no information — the reader learns nothing from them,
 * and it reads as a bug rather than a style.
 *
 * The invariant this enforces: no two sub-services WITHIN one service may share
 * a glyph. Reuse ACROSS services is fine and expected — nobody sees two services'
 * grids at once, and forcing global uniqueness across 24 cards would push later
 * cards onto glyphs that do not fit their meaning.
 *
 * Also checks every chosen glyph actually exists in Glyph.astro: a typo there
 * renders an empty <span> with no error anywhere.
 *
 * Runs inside `npm run build`.
 */
import { readFile } from 'node:fs/promises';

const fail = [];

// --- the rules, read from the real module -----------------------------------
// Imported rather than re-implemented: a second copy of these patterns in a test
// would keep passing while the page went wrong, which is the failure mode this
// gate exists to prevent. Stripped of TS syntax so plain node can run it.
const libSrc = await readFile('src/lib/glyphFor.ts', 'utf8');
const rulesBody = libSrc
  .slice(libSrc.indexOf('const RULES'), libSrc.indexOf('export function'))
  .replace(/const RULES: \[RegExp, string\]\[\]/, 'const RULES');
const glyphFor = new Function(`
  ${rulesBody}
  return function (title) {
    const t = title.toLowerCase();
    for (const [re, g] of RULES) if (re.test(t)) return g;
    return 'spark';
  };
`)();

// --- the sub-services, read from the real content ---------------------------
const svcSrc = await readFile('src/lib/services.ts', 'utf8');
const blocks = [...svcSrc.matchAll(/slug:\s*'([^']+)'[\s\S]*?subservices:\s*\[([\s\S]*?)\n\s{4}\],/g)];
if (blocks.length === 0) {
  console.error('check:glyphs could not parse any service blocks from src/lib/services.ts.');
  console.error('The shape of that file changed — update this gate rather than deleting it.');
  process.exit(1);
}

// --- the glyphs that actually exist -----------------------------------------
const glyphSrc = await readFile('src/components/graphics/Glyph.astro', 'utf8');
const known = new Set(
  [...glyphSrc.matchAll(/^\s+'?([a-z0-9-]+)'?:/gm)].map((m) => m[1])
);

let cards = 0;
for (const [, slug, body] of blocks) {
  const titles = [...body.matchAll(/\{\s*title:\s*'([^']+)'/g)].map((m) => m[1]);
  const seen = new Map();
  for (const title of titles) {
    cards++;
    const g = glyphFor(title);
    if (!known.has(g)) {
      fail.push(`${slug}: "${title}" -> '${g}', which Glyph.astro does not define.`);
    }
    if (seen.has(g)) {
      fail.push(`${slug}: "${title}" and "${seen.get(g)}" both -> '${g}'. Add a more specific rule ABOVE the one that caught them in src/lib/glyphFor.ts.`);
    } else {
      seen.set(g, title);
    }
  }
  console.log(`  ${slug.padEnd(30)} ${titles.map((t) => glyphFor(t)).join(', ')}`);
}

if (fail.length) {
  console.error(`\nGlyph check FAILED — ${fail.length} problem(s):`);
  fail.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log(`\nGlyph check passed — ${cards} sub-service cards across ${blocks.length} services, all distinct within their service.`);
