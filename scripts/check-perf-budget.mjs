#!/usr/bin/env node
/**
 * Performance budget gate. Fails the build on breach.
 * Budgets from docs/spec/08-DESIGN-BRIEF.md §8.
 *
 * The JS budget is about JAVASCRIPT, not visual richness. Images, video,
 * illustration and type do not count against it. If you exceed it, remove an
 * island — do not raise the number.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';

const BUDGET = {
  jsContent: 60 * 1024,
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

const gz = async (p) => gzipSync(await readFile(p)).length;
const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

const files = await walk(DIST);
const fails = [];
const warns = [];

// --- JavaScript ------------------------------------------------------------
const js = files.filter((f) => extname(f) === '.js' && !f.includes('/pagefind/'));
let jsTotal = 0;
for (const f of js) jsTotal += await gz(f);
if (jsTotal > BUDGET.jsContent) {
  fails.push(`JS ${kb(jsTotal)} gzipped exceeds ${kb(BUDGET.jsContent)}. Remove an island.`);
}

// --- CSS -------------------------------------------------------------------
let cssTotal = 0;
for (const f of files.filter((f) => extname(f) === '.css')) cssTotal += await gz(f);
if (cssTotal > BUDGET.cssTotal) {
  fails.push(`CSS ${kb(cssTotal)} gzipped exceeds ${kb(BUDGET.cssTotal)}.`);
}

// --- HTML + content checks -------------------------------------------------
const html = files.filter((f) => extname(f) === '.html');
for (const f of html) {
  const size = (await stat(f)).size;
  if (size > BUDGET.htmlDoc) warns.push(`${f} is ${kb(size)} (budget ${kb(BUDGET.htmlDoc)})`);

  const src = await readFile(f, 'utf8');

  // Placeholder-zero counters. This is the bug live on scalingsocials.com and
  // on intentfarm.com: Google and every LLM crawler sees `0 Cr+`.
  if (/>\s*0\s*(Cr\+|\+|x|×|%)\s*</i.test(src)) {
    fails.push(`${f} renders a placeholder zero counter. Ship the real number in the HTML.`);
  }

  // Images without alt. Intent Farm's nine case study links have anchor text
  // like "Group-1171276648" for exactly this reason.
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
console.log(`JS ${kb(jsTotal)} / ${kb(BUDGET.jsContent)}   CSS ${kb(cssTotal)} / ${kb(BUDGET.cssTotal)}   ${html.length} pages`);
for (const w of warns) console.warn(`  warn  ${w}`);

if (fails.length) {
  console.error('\nPerformance budget FAILED:');
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('Performance budget passed.');
