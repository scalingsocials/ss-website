/**
 * DUMMY media — placeholders only. See 11 §6 (real photos/creatives pending).
 *
 * Poster images are stand-ins so the creative wall reads as a real section. NO
 * dummy video is presented as our creative (that would misrepresent the work,
 * CLAUDE.md §15) — clips carry a poster and NO `src`, so the wall renders posters
 * only until real, cleared client creatives are added (each then gets a `src` and
 * the poster→video→click-to-expand mechanism in motion.ts lights up).
 *
 * Remote dummies never enter dist, so they are not subject to the perf media
 * budgets. Swap for real, self-hosted, optimised assets before launch.
 */

// Picsum — deterministic photos via seed. Generic imagery only.
const pic = (seed: string, w = 600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export interface CreativeClip {
  poster: string;
  /** Real, cleared client creative. Omitted for now → poster-only. */
  src?: string;
  tag: string; // generic platform/format label — never a client or metric
}

export const CREATIVE_CLIPS: CreativeClip[] = [
  { poster: pic('ss-clip-1'), tag: 'Meta · Reel' },
  { poster: pic('ss-clip-2'), tag: 'Instagram · Story' },
  { poster: pic('ss-clip-3'), tag: 'YouTube · Pre-roll' },
  { poster: pic('ss-clip-4'), tag: 'Meta · UGC' },
  { poster: pic('ss-clip-5'), tag: 'Google · Demand Gen' },
  { poster: pic('ss-clip-6'), tag: 'Amazon · Sponsored' },
];
