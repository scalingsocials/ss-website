/**
 * BreadcrumbList node. See 03 §1.2–1.3.
 *
 * Every indexable page carries one. Positions are 1-based; the last crumb is the
 * current page. Pass real, resolving URLs — a breadcrumb to a 404 is a defect.
 */
import { abs, breadcrumbId, type SchemaNode } from './ids';

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbs(pageUrl: string, crumbs: Crumb[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(pageUrl),
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.url),
    })),
  };
}
