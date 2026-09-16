/**
 * Client ad reels shown on the social media page (owner-supplied, 2026-09-16).
 *
 * Source files were 20–30 s vertical reels at 10–57 MB with sound. The site's
 * media rule (CLAUDE.md §4) caps a clip at 8 s and 1.5 MB, muted, so each is the
 * FIRST 8 seconds of its reel — where an ad's hook lives — re-encoded to 540 px
 * wide, no audio, as mp4 (H.264) + webm (VP9), with a WebP poster from 0.5 s.
 * Assets live in /public/creatives/reels/.
 *
 * No brand names: the source files were supplied as "client video N", so the
 * labels stay generic rather than guessing which client each belongs to.
 */
export interface Reel {
  id: string;
  label: string;
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
}

const BASE = '/creatives/reels';

export const REELS: Reel[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: `reel-${n}`,
  label: `Client ad reel ${n}`,
  mp4: `${BASE}/reel-${n}.mp4`,
  webm: `${BASE}/reel-${n}.webm`,
  poster: `${BASE}/reel-${n}.webp`,
  // 1120x1960 sources scaled to 540 wide (ffmpeg rounds the height to an even 946).
  width: 540,
  height: 946,
}));
