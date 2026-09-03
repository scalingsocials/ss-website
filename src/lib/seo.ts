/**
 * SEO title/description helpers and the build-time uniqueness gate.
 * See 03 §0 (launch blockers) and §2.
 *
 * Titles are 50–60 characters, descriptions 140–158, and BOTH must be unique
 * across the site. This module enforces that during `astro build`: Meta.astro
 * calls `registerTitle`/`registerDescription`, which THROW on a missing,
 * out-of-range, or duplicate value. A thrown error fails the build — which is
 * exactly the requirement ("Build fails on missing or duplicate").
 *
 * The registries are module-level Sets, shared across every page rendered in one
 * build process (Vite's SSR module graph is a singleton within a build).
 */
import { ORG } from '@/lib/schema/entity';

export const TITLE_MIN = 50;
export const TITLE_MAX = 60;
export const DESC_MIN = 140;
export const DESC_MAX = 158;

const seenTitles = new Map<string, string>(); // title -> first page path
const seenDescriptions = new Map<string, string>(); // description -> first page path

const len = (s: string) => Array.from(s.trim()).length;

/** Absolute, non-www, self-referencing canonical for a path (03 §2 Technical). */
export function canonicalFor(pathname: string): string {
  return new URL(pathname, ORG.url + '/').href;
}

export function registerTitle(title: string, path: string): string {
  const t = title?.trim() ?? '';
  if (!t) {
    throw new Error(`[SEO] ${path}: missing <title>. Every page needs a unique title (03 §0).`);
  }
  const n = len(t);
  if (n < TITLE_MIN || n > TITLE_MAX) {
    throw new Error(
      `[SEO] ${path}: title is ${n} chars, must be ${TITLE_MIN}–${TITLE_MAX} (03 §2). Title: "${t}"`
    );
  }
  const prior = seenTitles.get(t);
  if (prior && prior !== path) {
    throw new Error(`[SEO] duplicate <title> "${t}" on ${path} and ${prior} (03 §0).`);
  }
  seenTitles.set(t, path);
  return t;
}

export function registerDescription(description: string, path: string): string {
  const d = description?.trim() ?? '';
  if (!d) {
    throw new Error(
      `[SEO] ${path}: missing meta description. Every page needs a unique description (03 §0).`
    );
  }
  const n = len(d);
  if (n < DESC_MIN || n > DESC_MAX) {
    throw new Error(
      `[SEO] ${path}: description is ${n} chars, must be ${DESC_MIN}–${DESC_MAX} (03 §2). Description: "${d}"`
    );
  }
  const prior = seenDescriptions.get(d);
  if (prior && prior !== path) {
    throw new Error(`[SEO] duplicate meta description on ${path} and ${prior} (03 §0).`);
  }
  seenDescriptions.set(d, path);
  return d;
}
