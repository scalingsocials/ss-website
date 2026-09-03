/**
 * DUMMY media — placeholders only. See 11 §6 (real photos/creatives pending).
 *
 * Every URL here is a stand-in so the homepage reads as complete. Swap these for
 * real, self-hosted, optimised assets (astro:assets) before launch — remote
 * dummies are not subject to the perf image/video budgets because they never
 * enter dist. Nothing here implies a specific client, metric or endorsement.
 */

// Picsum — deterministic photos via seed. Generic imagery only.
const pic = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Stable public sample videos (w3.org). Posters are picsum portraits so each
// card looks distinct. Swap all of these for real, permissioned client creatives.
const W3 = 'https://media.w3.org/2010/05';

export interface CreativeClip {
  poster: string;
  src: string;
  tag: string; // generic platform/format label — never a client or metric
}

export const CREATIVE_CLIPS: CreativeClip[] = [
  { poster: pic('ss-clip-1', 600, 900), src: `${W3}/sintel/trailer.mp4`,  tag: 'Meta · Reel' },
  { poster: pic('ss-clip-2', 600, 900), src: `${W3}/bunny/movie.mp4`,     tag: 'Instagram · Story' },
  { poster: pic('ss-clip-3', 600, 900), src: `${W3}/video/movie_300.mp4`, tag: 'YouTube · Pre-roll' },
  { poster: pic('ss-clip-4', 600, 900), src: `${W3}/bunny/trailer.mp4`,   tag: 'Meta · UGC' },
  { poster: pic('ss-clip-5', 600, 900), src: `${W3}/sintel/trailer.mp4`,  tag: 'Google · Demand Gen' },
  { poster: pic('ss-clip-6', 600, 900), src: `${W3}/bunny/movie.mp4`,     tag: 'Amazon · Sponsored' },
];

export interface CaseTeaser {
  image: string;
  category: string;   // generic vertical, not a client name
  summary: string;    // no fabricated numbers
  href: string;
}

export const CASE_TEASERS: CaseTeaser[] = [
  { image: pic('ss-fashion'),  category: 'Fashion & apparel',       summary: 'Scaling a D2C fashion label on Meta with a creative-led testing loop.', href: '/case-studies/' },
  { image: pic('ss-beauty'),   category: 'Beauty & skincare',       summary: 'Rebuilding a skincare brand’s funnel from click to checkout.',          href: '/case-studies/' },
  { image: pic('ss-homedecor'),category: 'Home & decor',            summary: 'Google Shopping and Performance Max for a home-decor catalogue.',       href: '/case-studies/' },
];
