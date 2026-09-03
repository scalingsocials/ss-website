/**
 * Client logos — auto-discovered, never hand-listed. See 11-SUPPLIED-CONTENT.md §4.
 *
 * Drop a file in src/assets/logos/ and it appears on the next build. The
 * filename becomes the alt text, so name files properly (`lille-barn.svg`, never
 * `logo-9.png`) — Intent Farm's nine case-study links read `Group-1171276648`
 * because their thumbnails had no alt (03 §Images).
 *
 * The folder is currently empty, so LOGOS is []. LogoWall renders gracefully
 * with zero logos — nothing invented, no fake marks (CLAUDE.md §15).
 */
import type { ImageMetadata } from 'astro';

export interface Logo {
  slug: string;
  src: ImageMetadata;
  alt: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/logos/*.{svg,png,webp,avif}',
  { eager: true }
);

// Case one word for a brand name: fix ALL-CAPS words, otherwise keep the brand's
// own casing (KiddieHUG, blush9) and just capitalise the first letter.
const caseWord = (w: string) => {
  if (!w) return w;
  const allCaps = w === w.toUpperCase() && /[A-Z]/.test(w);
  if (allCaps && w.length > 1) return w[0]! + w.slice(1).toLowerCase();
  return w[0]!.toUpperCase() + w.slice(1);
};

// Derive a readable brand name from a messy filename: strip the extension,
// turn _/- into spaces, drop the word "logo" and any trailing index number.
const brandName = (raw: string) =>
  raw
    .replace(/[_-]+/g, ' ')
    .replace(/\blogo\b/gi, ' ')
    .replace(/\s+\d+\s*$/, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(caseWord)
    .join(' ');

export const LOGOS: Logo[] = Object.entries(files)
  .map(([path, mod]) => {
    const raw = path.split('/').pop()!.replace(/\.\w+$/, '');
    const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const name = brandName(raw);
    return { slug, src: mod.default, alt: `${name} logo` };
  })
  .sort((a, b) => a.alt.localeCompare(b.alt));

/**
 * Optional homepage subset: src/assets/logos/_featured.json listing 6–8 slugs.
 * Absent today, so `featuredLogos()` falls back to the full set.
 */
const featuredFiles = import.meta.glob<{ default: string[] }>(
  '/src/assets/logos/_featured.json',
  { eager: true }
);
const featuredSlugs = Object.values(featuredFiles)[0]?.default ?? null;

export function featuredLogos(): Logo[] {
  if (!featuredSlugs) return LOGOS;
  const bySlug = new Map(LOGOS.map((l) => [l.slug, l]));
  return featuredSlugs.map((s) => bySlug.get(s)).filter((l): l is Logo => Boolean(l));
}
