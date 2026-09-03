/**
 * Canonical @id helpers for the schema graph. See 03-SEO-AEO-GEO-SPEC.md §1.2.
 *
 * Every page emits ONE @graph whose nodes reference each other by @id. The
 * Organization and WebSite nodes have site-global @ids (they are the same entity
 * on every page); everything page-specific hangs off the page URL with a #fragment.
 *
 * All ids are absolute and non-www — ORG.url is the single source (CLAUDE.md,
 * entity.ts). Never hand-write a "#organization" string in a template; use these.
 */
import { ORG } from './entity';

export type SchemaNode = Record<string, unknown>;

/** Site root, always trailing-slashed to match astro.config `trailingSlash: 'always'`. */
export const SITE = ORG.url; // https://scalingsocials.com (no trailing slash)

/** Absolute URL for a path. Accepts '/', '/about/', or an already-absolute URL. */
export function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, SITE + '/').href;
}

// Site-global entity ids.
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

// Page-scoped id builders.
export const webPageId = (url: string) => `${abs(url)}#webpage`;
export const primaryImageId = (url: string) => `${abs(url)}#primaryimage`;
export const serviceId = (url: string) => `${abs(url)}#service`;
export const articleId = (url: string) => `${abs(url)}#article`;
export const creativeWorkId = (url: string) => `${abs(url)}#creativework`;
export const breadcrumbId = (url: string) => `${abs(url)}#breadcrumb`;
export const faqId = (url: string) => `${abs(url)}#faq`;
export const datasetId = (url: string) => `${abs(url)}#dataset`;
export const webAppId = (url: string) => `${abs(url)}#webapp`;
export const definedTermSetId = (url: string) => `${abs(url)}#termset`;
export const definedTermId = (url: string, slug: string) => `${abs(url)}#term-${slug}`;
export const personId = (slug: string) => `${SITE}/team/#${slug}`;
