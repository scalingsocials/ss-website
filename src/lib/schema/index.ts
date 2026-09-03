/**
 * Schema graph assembler and public surface. See 03 §1.2.
 *
 * ONE @graph per page with @id cross-references — never isolated JSON-LD blobs
 * (03 §0 GEO, §1.2). Pages import the node builders, compose them, and pass the
 * array to <SchemaGraph nodes={...} />, which calls `graph()` to wrap them.
 *
 * `base()` returns the two nodes every page shares (Organization + WebSite) so
 * pages don't repeat them. Use `organization()`/`professionalService()` directly
 * on the homepage, which needs the LocalBusiness variant.
 */
import { organization } from './organization';
import { website } from './website';
import type { SchemaNode } from './ids';

export * from './ids';
export { organization, professionalService } from './organization';
export { website } from './website';
export { webPage } from './webPage';
export { breadcrumbs } from './breadcrumbs';
export { service } from './service';
export { article } from './article';
export { caseStudy } from './caseStudy';
export { faqPage } from './faqPage';
export { person } from './person';
export { definedTerm, definedTermSet } from './definedTerm';
export { dataset } from './dataset';
export { webApplication } from './webApplication';

export type { SchemaNode } from './ids';

/** The two nodes present in every page graph. */
export function base(): SchemaNode[] {
  return [organization(), website()];
}

/**
 * Wrap composed nodes into a single @graph document. Accepts nested arrays
 * (builders like caseStudy return several nodes) and flattens them.
 */
export function graph(...nodes: (SchemaNode | SchemaNode[])[]): SchemaNode {
  const flat = nodes.flat();
  return {
    '@context': 'https://schema.org',
    '@graph': flat,
  };
}
