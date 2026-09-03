/**
 * Creative wall assets — real ad creatives from src/assets/Creatives/.
 * See 08 §7, 02 §1.2.
 *
 * Images only for now: the supplied videos are 14–118MB each, far over the
 * 1.5MB per-clip budget (08 §8), so they must be compressed to ~1.5MB webm+mp4
 * before they can ship. These stills are real client creatives, optimised by
 * astro:assets. Client permission is required before client creative appears
 * (02 §1.2) — confirm before launch.
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

const caseWord = (w: string) => {
  if (!w) return w;
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
  // Skip raw WhatsApp screenshots — not portfolio-ready.
  .filter(([path]) => !/\/WhatsApp /i.test(path))
  .map(([path, mod]) => {
    const raw = path.split('/').pop()!.replace(/\.\w+$/, '');
    const name = label(raw);
    return { src: mod.default, alt: name ? `Ad creative for ${name}` : 'Ad creative sample' };
  })
  .sort((a, b) => a.alt.localeCompare(b.alt));
