/**
 * Semantic tone → utility class.
 *
 * The islands used inline `style={{ color: ... }}` to read --pos/--neg/--fg,
 * but inline style attributes are blocked by the hash-based CSP style-src
 * (see astro.config.mjs), and hashes cannot cover style attributes. Mapping to
 * literal class strings keeps the semantic vars (CLAUDE.md §5) and lets Tailwind
 * see the classes at build time.
 */
export type Tone = 'pos' | 'neg' | 'fg';

export const toneClass: Record<Tone, string> = {
  pos: 'text-[var(--pos)]',
  neg: 'text-[var(--neg)]',
  fg: 'text-[var(--fg)]',
};
