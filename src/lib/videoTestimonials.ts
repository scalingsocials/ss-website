/**
 * Shared type for founder video testimonials (VideoTestimonials block + the
 * landing-page content). Kept in a .ts module so both .astro components and
 * .ts data files can import it (tsc cannot resolve types out of .astro files).
 */
export interface VideoItem {
  mp4: string;
  webm?: string;
  poster: string;
  /** Who is speaking, without naming a brand (owner directive 2026-09-15). */
  label: string;
  /** Display duration, e.g. "1:45". */
  duration: string;
  width: number;
  height: number;
}
