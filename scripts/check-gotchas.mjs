/**
 * Cross-browser gotcha gate. Catches, statically, the classes of bug that only
 * surface on one engine (usually iOS Safari / WebKit) and are invisible in a
 * Blink-based emulator — the exact bugs that shipped in Sept 2026:
 *
 *   - a hero clipped on the right on iOS (a hand-written grid track sized to its
 *     widest child's max-content because it lacked `minmax(0, …)`);
 *   - a header whose blur silently no-op'd on iPhone (`backdrop-filter` with no
 *     `-webkit-` prefix);
 *   - safe-area insets that were always 0 on notched iPhones (viewport meta
 *     missing `viewport-fit=cover`).
 *
 * This runs on the SOURCE (fast, no browser, safe inside the Cloudflare build).
 * Empirical overflow across real engines is covered separately by
 * `npm run check:browsers` (Playwright WebKit + Chromium).
 *
 * Two severities:
 *   ERROR — a well-defined, always-wrong pattern. Fails the build.
 *   WARN  — a heuristic worth a human glance. Prints, never fails.
 *
 * A line may opt out of a single rule with a trailing `/* gotcha-ok: <id> *\/`
 * comment (e.g. a deliberate `100vh`). Use sparingly and say why.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = 'src';
const SCAN_EXT = /\.(astro|css)$/;

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (SCAN_EXT.test(e.name)) out.push(p);
  }
  return out;
};

const errors = [];
const warns = [];
const add = (bucket, file, line, id, msg) =>
  bucket.push({ file: relative('.', file), line, id, msg });

/** True when `text` contains a `gotcha-ok: <id>` opt-out for this rule. */
const optedOut = (text, id) =>
  new RegExp(`gotcha-ok:\\s*${id}\\b`).test(text);

for (const file of await walk(ROOT)) {
  const src = await readFile(file, 'utf8');
  const lines = src.split(/\r?\n/);

  // --- File-level pairing rules (a property that needs a -webkit- sibling) ----
  // backdrop-filter MUST be paired with -webkit-backdrop-filter (iOS Safari).
  const hasBackdrop = /(^|[^-])backdrop-filter\s*:/m.test(src);
  const hasWebkitBackdrop = /-webkit-backdrop-filter\s*:/.test(src);
  if (hasBackdrop && !hasWebkitBackdrop && !optedOut(src, 'backdrop-webkit')) {
    const ln = lines.findIndex((l) => /(^|[^-])backdrop-filter\s*:/.test(l)) + 1;
    add(errors, file, ln, 'backdrop-webkit',
      'backdrop-filter without -webkit-backdrop-filter — blur silently no-ops on iOS Safari. Add the -webkit- line first.');
  }
  // mask-image / mask MUST be paired with -webkit-mask-image (older WebKit).
  const hasMask = /(^|[^-])mask-image\s*:/m.test(src);
  const hasWebkitMask = /-webkit-mask-image\s*:/.test(src);
  if (hasMask && !hasWebkitMask && !optedOut(src, 'mask-webkit')) {
    const ln = lines.findIndex((l) => /(^|[^-])mask-image\s*:/.test(l)) + 1;
    add(errors, file, ln, 'mask-webkit',
      'mask-image without -webkit-mask-image — mask is dropped on older iOS Safari.');
  }

  // Children whose min-content width is set by content the author never sized:
  // a <select> is as wide as its widest <option>, a table as wide as its widest
  // unbreakable cell, <pre> as its longest line. Drop one of these into an
  // unfloored `fr` track and the track adopts that width. LeadForm counts —
  // it renders the country-dial <select> for every `tel` field.
  const hasWideChild = /<select\b|<table\b|<pre\b|<LeadForm\b|<FieldControl\b/.test(src);
  // The other accepted remedy: floor the CHILDREN instead of the track, either
  // per-grid with Tailwind's `[&>*]:min-w-0` (checked on the line) or in this
  // file's <style> with a `> * { min-width: 0 }` rule (checked here).
  const floorsChildren = />\s*\*\s*\{[^}]*min-width:\s*0/.test(src);

  // --- Line-level rules ------------------------------------------------------
  lines.forEach((line, i) => {
    const ln = i + 1;
    if (/gotcha-ok:\s*all\b/.test(line)) return;

    // Hand-written grid tracks using fr WITHOUT minmax(0, …). On WebKit an
    // implicit/auto/fr track floors at the child's min-content width and can
    // blow past a phone viewport (the iOS hero cut-off). Tailwind's grid-cols-*
    // already compile to minmax(0,1fr); only raw CSS is at risk.
    const gt = line.match(/grid-template-columns\s*:\s*([^;]+)/);
    // Only MULTI-track fr grids are at risk — a lone `1fr` column always fills
    // its container and can't overflow. Multiple tracks (a comma or repeat())
    // must each be floored with minmax(0, …).
    const isMultiTrack = gt && (/,/.test(gt[1]) || /repeat\(/.test(gt[1]));
    if (gt && isMultiTrack && /\dfr\b/.test(gt[1]) && !/minmax\(\s*0/.test(gt[1])
        && !optedOut(line, 'grid-minmax')) {
      add(warns, file, ln, 'grid-minmax',
        `grid-template-columns uses fr without minmax(0, …): "${gt[1].trim()}". On WebKit the track can floor at a child's min-content and overflow. Prefer minmax(0, 1fr).`);
    }

    // The SAME hazard in Tailwind's arbitrary-value form. The comment above is
    // only half true: numeric utilities (grid-cols-2) compile to
    // repeat(2, minmax(0,1fr)) and are safe, but an arbitrary track list
    // (grid-cols-[1.05fr_0.95fr]) compiles to exactly what you wrote — no
    // minmax floor — and behaves like the hand-written rule.
    //
    // This is the gap that let the Sept 2026 phone-field clip through: every
    // hero grid on the site is a Tailwind arbitrary value, so a regex looking
    // for `grid-template-columns:` in raw CSS never saw any of them. A <select>
    // reports its widest <option> as its min-content width (276px for the
    // country list), the unfloored track adopted it, and the column grew to
    // 438px inside a 390px phone.
    // Scoped to files that actually render a wide-min-content child, because
    // unfloored arbitrary tracks are everywhere on this site and only a handful
    // can overflow. A gate that prints 30 warnings gets ignored, and an ignored
    // gate is how this shipped. `hasWideChild` is set per file above.
    for (const m of (hasWideChild && !floorsChildren ? line.matchAll(/grid-cols-\[([^\]]+)\]/g) : [])) {
      const tracks = m[1];
      // Tailwind spells the space between tracks as `_`. One track can't overflow.
      const multi = tracks.includes('_') || /repeat\(/.test(tracks);
      // NOT \bfr\b: in `1.05fr_0.95fr` the `fr` is flanked by word characters on
      // both sides, so a word-boundary test silently matches nothing.
      if (!multi || !/\dfr(?![a-z])/i.test(tracks) || /minmax\(\s*0/.test(tracks)) continue;
      if (/\[&>\*\]:min-w-0|\bmin-w-0\b/.test(line)) continue;
      if (optedOut(line, 'grid-minmax')) continue;
      add(warns, file, ln, 'grid-minmax',
        `Tailwind grid-cols-[${tracks}] compiles to a raw fr track list with no minmax(0, …). A child with a large min-content (a <select>, a long unbroken string, a wide table) will push the track past the viewport. Use grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)], or add [&>*]:min-w-0.`);
    }

    // 100vh (and its friends) in a size property, when not paired with a small/
    // dynamic viewport unit anywhere in the file. iOS counts the address bar in
    // vh, so 100vh is taller than the visible area.
    if (/\b(min-height|height)\s*:\s*100vh\b/.test(line)
        && !/\b100(s|d)vh\b/.test(src) && !optedOut(line, 'vh')) {
      add(warns, file, ln, 'vh',
        '100vh includes the iOS address bar (element taller than the screen). Use 100svh/100dvh, or keep 100vh as a fallback line immediately before an svh/dvh line.');
    }
  });
}

// --- Whole-site rules --------------------------------------------------------
const VIEWPORT_FILE = 'src/layouts/BaseLayout.astro';
try {
  const base = await readFile(VIEWPORT_FILE, 'utf8');
  const meta = base.match(/<meta\s+name="viewport"[^>]*content="([^"]*)"/i);
  if (!meta) {
    add(errors, VIEWPORT_FILE, 0, 'viewport-missing', 'No viewport meta found.');
  } else {
    const content = meta[1];
    if (!/viewport-fit\s*=\s*cover/.test(content)) {
      add(errors, VIEWPORT_FILE, 0, 'viewport-fit',
        'viewport meta is missing viewport-fit=cover — env(safe-area-inset-*) is 0 on notched iPhones without it.');
    }
    if (/user-scalable\s*=\s*no/.test(content) || /maximum-scale\s*=\s*1/.test(content)) {
      add(errors, VIEWPORT_FILE, 0, 'viewport-zoom',
        'viewport meta blocks zoom (user-scalable=no / maximum-scale=1) — an accessibility failure and an iOS quirk source.');
    }
  }
} catch {
  add(errors, VIEWPORT_FILE, 0, 'viewport-missing', `Could not read ${VIEWPORT_FILE}.`);
}

// --- Report ------------------------------------------------------------------
const fmt = (x) => `  ${x.file}:${x.line}  [${x.id}]\n      ${x.msg}`;
if (warns.length) {
  console.log(`\nGotchas — ${warns.length} warning(s):`);
  warns.forEach((w) => console.log(fmt(w)));
}
if (errors.length) {
  console.error(`\nGotchas — ${errors.length} error(s):`);
  errors.forEach((e) => console.error(fmt(e)));
  console.error('\nCross-browser gotcha check FAILED.');
  process.exit(1);
}
console.log(`\nGotcha check passed${warns.length ? ` (${warns.length} warning(s) above)` : ''}.`);
