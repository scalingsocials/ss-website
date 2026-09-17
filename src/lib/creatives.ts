/**
 * Creative wall assets — real ad creatives from src/assets/Creatives/.
 * See 08 §7, 02 §1.2.
 *
 * Images only for now: the supplied videos are 14–118MB each, far over the
 * 1.5MB per-clip budget (08 §8), so they must be compressed to ~1.5MB webm+mp4
 * before they can ship. These stills are real client creatives, optimised by
 * astro:assets.
 *
 * CLIENT PERMISSION: confirmed by the owner on 2026-09-12. The brand names are
 * derived from the filenames and surface publicly in the alt text on /work/
 * (Avila International, Meraki, Sanmal, Senren, Tessuti, Tritiksha, Urbanrac),
 * so renaming a file renames the brand on the live page — check the name is one
 * we are permitted to show before adding a creative here. Note this is a
 * DIFFERENT permission from the case studies, which stay anonymised.
 *
 * Added 2026-09-16, supplied by the owner for the gallery: Doma, Get and Glow,
 * GetSetWear, Luxeraa (x2), Sanmal (x2 more), Tots n Weaves, Vara India. File
 * names follow each brand's own spelling as printed on the creative; "Get and
 * Glow" is the one inferred from the supplied filename alone (no wordmark on the
 * creative), so confirm it before relying on it.
 *
 * Added 2026-09-16, the ten creatives that had been sitting here as "WhatsApp
 * Image 2026-09-03 …" files: they are finished ad creatives that were simply
 * shared over WhatsApp, and the screenshot filter below had been hiding them.
 * Renamed to the brand printed on each: PixieThreads (x2), Zozuzi (x2), Crostyl
 * (x2), Namak, Nakhroo, Luxeraa. "creative 31" carries no wordmark, so it is
 * left unbranded like the other "creative N" files. Namak was taken back out
 * of the gallery at the owner's request on 2026-09-17.
 *
 * Client ad VIDEOS are not here — they are reels in /public/creatives/reels/,
 * listed in src/lib/reels.ts and shown by ReelWall.
 */
import type { ImageMetadata } from 'astro';

export interface Creative {
  src: ImageMetadata;
  alt: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/Creatives/*.{png,jpg,jpeg,webp,avif}',
  { eager: true }
);

const MONTHS = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\b/gi;

// Joining words stay lowercase, so "Tots n Weaves" and "Get and Glow" read the
// way the brands write them rather than as "Tots N Weaves".
const SMALL = new Set(['n', 'and', 'of', 'the']);

const caseWord = (w: string, i = 0) => {
  if (!w) return w;
  if (i > 0 && SMALL.has(w.toLowerCase())) return w.toLowerCase();
  const allCaps = w === w.toUpperCase() && /[A-Z]/.test(w);
  if (allCaps && w.length > 1) return w[0]! + w.slice(1).toLowerCase();
  return w[0]!.toUpperCase() + w.slice(1);
};

// Pull a brand-ish label out of a messy creative filename (drops dates, indices,
// the words "creative"/"copy", and parenthetical date stamps).
const label = (raw: string) =>
  raw
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(MONTHS, ' ')
    .replace(/\b(creative|copy|final|image)\b/gi, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(caseWord)
    .join(' ');

export const CREATIVES: Creative[] = Object.entries(files)
  // Skip files still named as raw WhatsApp exports. Check before assuming they
  // are screenshots: the ten here on 2026-09-16 turned out to be finished
  // creatives and were renamed by brand instead.
  .filter(([path]) => !/\/WhatsApp /i.test(path))
  .map(([path, mod]) => {
    const raw = path.split('/').pop()!.replace(/\.\w+$/, '');
    const name = label(raw);
    return { src: mod.default, alt: name ? `Ad creative for ${name}` : 'Ad creative sample' };
  })
  .sort((a, b) => a.alt.localeCompare(b.alt));
