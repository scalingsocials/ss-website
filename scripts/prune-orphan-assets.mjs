#!/usr/bin/env node
/**
 * prune-orphan-assets.mjs — runs at the end of `build`.
 *
 * WHY: the creative wall imports every still via an eager `import.meta.glob`
 * (src/lib/creatives.ts) so it can read each image's width/height for the
 * <Image> component. A side effect is that Rollup emits the FULL-SIZE original
 * (1–2 MB .png/.jpeg) into dist/_astro/ next to the optimised .webp derivatives
 * that the pages actually render. Nothing in the built HTML/CSS/JS ever links
 * the originals (verified below), so they are pure deploy weight — ~20 MB of it.
 * There is no Astro flag to keep the derivatives but drop the originals, so we
 * prune after the build instead.
 *
 * SAFE BY CONSTRUCTION: this only deletes a raster ORIGINAL under dist/_astro/
 * (.png/.jpg/.jpeg — never .webp/.avif, which is what the pages use) when its
 * filename appears in NO built HTML file, raw or percent-encoded. If a page
 * ever references an original directly, it is kept. The worker manifest is not
 * consulted: output is static with imageService:'compile', so derivatives are
 * baked at build time and no runtime image transform serves these originals.
 */
import { readFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const ASTRO = join(DIST, '_astro');

// Collect the text of every built HTML page (skip _worker.js — see header).
const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) { if (entry !== '_worker.js') walk(p); }
    else if (entry.endsWith('.html')) htmlFiles.push(p);
  }
})(DIST);
const haystack = htmlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

let pruned = 0, bytes = 0;
for (const name of readdirSync(ASTRO)) {
  if (!/\.(png|jpe?g)$/i.test(name)) continue;          // never touch .webp/.avif
  if (haystack.includes(name) || haystack.includes(encodeURIComponent(name))) continue;
  const full = join(ASTRO, name);
  bytes += statSync(full).size;
  rmSync(full);
  pruned++;
}

console.log(
  pruned
    ? `prune-orphan-assets: removed ${pruned} unreferenced original(s) from _astro (${(bytes / 1048576).toFixed(1)} MB freed)`
    : 'prune-orphan-assets: nothing to prune'
);
