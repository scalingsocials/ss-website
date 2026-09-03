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

const titleCase = (slug: string) =>
  slug
    .split('-')
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');

export const LOGOS: Logo[] = Object.entries(files)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.\w+$/, '');
    return { slug, src: mod.default, alt: `${titleCase(slug)} logo` };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

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
