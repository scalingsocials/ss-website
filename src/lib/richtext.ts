/**
 * RichText — the body format for data-driven page prose (cluster sections,
 * comparison "fit" paragraphs, industry cards). See 03 §2 (contextual internal
 * linking) and the SEO review thread.
 *
 * WHY a segment model and not `set:html`: these bodies live in TypeScript data
 * files and need to carry the occasional contextual link. Rendering them with
 * `set:html` would open an HTML-injection surface and defeat escaping (the
 * strings contain raw `&`). A tagged segment array keeps every text run escaped
 * by Astro automatically and lets the type system enforce the shape — a link is
 * `{ text, href }`, never markup. `<RichText>` also fails the BUILD (throws) if
 * a text segment ever contains raw markup, so a pasted `<a>` cannot slip through
 * as convention — it is enforced mechanically.
 *
 * A plain string is still valid (the common case — most bodies carry no link),
 * so existing data needs no change.
 */

/** One run of body text, or an inline link. `text` is always escaped on render. */
export type RichSpan = string | { text: string; href: string };

/** A body value: a plain string, or an ordered list of text/link segments. */
export type RichText = string | RichSpan[];
