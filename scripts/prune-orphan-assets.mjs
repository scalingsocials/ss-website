#!/usr/bin/env node
/**
 * prune-orphan-assets.mjs — runs at the end of `build`.
 *
 * WHY: the creative wall imports every still via an eager `import.meta.glob`
 * (src/lib/creatives.ts) so it can read each image's width/height for the
 * <Image> component. A side effect is that Vite emits the FULL-SIZE original
 * (1–2 MB .png/.jpeg) into dist/_astro/ next to the optimised .webp derivatives
 * that the pages actually render. Nothing in the built output links the
 * originals, so they are ~20 MB of pure deploy weight.
 *
 * A source fix (making the glob lazy) would force every consumer of CREATIVES
 * to become async and still would not reliably stop emission for used images,
 * so we prune after the build — but conservatively, because deleting build
 * output by a heuristic is dangerous if it ever eats a real asset.
 *
 * FOUR GUARDS so this can never silently eat something that ships:
 *  1. Signature: only dist/_astro/*.{png,jpg,jpeg} (page images are .webp/.avif),
 *     with an Astro content hash (name.<hash>.ext), above MIN_BYTES.
 *  2. Reference check: the filename must appear in NO built HTML/CSS/JS, raw or
 *     percent-encoded. A page that references an original (even dynamically via
 *     a literal path) keeps it.
 *  3. Every removed filename is printed to the build log — never a silent delete.
 *  4. Bounds: if the number removed exceeds MAX_PRUNE the build FAILS (something
 *     unexpected is being deleted — a human must look). Removing zero is allowed
 *     and only warns (the emission may have stopped, e.g. a future source fix).
 *
 * If a legitimately-referenced original is ever built via a NON-literal path
 * (constructed at runtime from parts), add it to KEEP below.
 */
import { readFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const ASTRO = join(DIST, '_astro');
const MIN_BYTES = 250 * 1024;   // originals are >500KB; well clear of any stray small raster
const MAX_PRUNE = 45;           // current steady state is ~30; fail if it jumps past headroom
const KEEP = new Set([]);       // filenames to never prune (referenced via constructed paths)
const HASHED = /\.[A-Za-z0-9_-]{8,}\.(png|jpe?g)$/i;  // Astro emits name.<hash>.ext

// Text of every built HTML/CSS/JS page (skip _worker.js: it is the SSR manifest,
// not what ships to the browser, and it references originals by design).
const text = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) { if (entry !== '_worker.js') walk(p); }
    else if (/\.(html|css|js)$/i.test(entry)) text.push(readFileSync(p, 'utf8'));
  }
})(DIST);
const haystack = text.join('\n');

const removed = [];
for (const name of readdirSync(ASTRO)) {
  if (!HASHED.test(name)) continue;                 // guard 1a: raster original signature
  if (KEEP.has(name)) continue;
  const full = join(ASTRO, name);
  if (statSync(full).size < MIN_BYTES) continue;    // guard 1b: size floor
  if (haystack.includes(name) || haystack.includes(encodeURIComponent(name))) continue; // guard 2
  removed.push(name);
}

// Guard 4: refuse to delete more than expected without a human looking.
if (removed.length > MAX_PRUNE) {
  console.error(
    `prune-orphan-assets: ABORT — ${removed.length} candidates exceeds MAX_PRUNE (${MAX_PRUNE}). ` +
    `Nothing deleted. Review this list before raising the cap:\n` +
    removed.map((n) => `  - ${n}`).join('\n')
  );
  process.exit(1);
}

let bytes = 0;
for (const name of removed) {                         // guard 3: log every deletion
  const full = join(ASTRO, name);
  bytes += statSync(full).size;
  rmSync(full);
  console.log(`  pruned _astro/${name}`);
}

if (!removed.length) {
  console.warn('prune-orphan-assets: nothing matched — if the creative wall still builds, the eager-glob emission may have changed; verify no orphans remain.');
} else {
  console.log(`prune-orphan-assets: removed ${removed.length} unreferenced original(s), ${(bytes / 1048576).toFixed(1)} MB freed`);
}
