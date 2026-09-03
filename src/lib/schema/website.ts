/**
 * WebSite node. See 03 §1.2–1.3.
 *
 * One per site, referenced by @id. Carries the SearchAction (sitelinks search
 * box) and names the Organization as publisher. Present on every page graph so
 * each WebPage can declare isPartOf → the site.
 */
import { ORG } from './entity';
import { ORG_ID, WEBSITE_ID, SITE, type SchemaNode } from './ids';

export function website(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: ORG.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/blog/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
