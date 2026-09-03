/**
 * WebPage node. See 03 §1.2.
 *
 * The per-page hub of the graph: isPartOf → WebSite, about → the page's primary
 * entity (Service/Article/etc.), plus visible published/modified dates that MUST
 * match the dates rendered on the page (03 §0 AEO, §3.9). Breadcrumb is linked
 * by @id when present.
 */
import { ORG_ID, WEBSITE_ID, abs, webPageId, breadcrumbId, primaryImageId, type SchemaNode } from './ids';

export interface WebPageInput {
  url: string;
  name: string; // the page <title> or a clean page name
  description?: string;
  datePublished?: string; // ISO
  dateModified?: string; // ISO
  /** @id of the primary entity this page is about (service/article/dataset…). */
  aboutId?: string;
  /** Absolute URL of the primary image, if the page has one. */
  primaryImage?: string;
  hasBreadcrumb?: boolean;
  inLanguage?: string;
}

export function webPage(input: WebPageInput): SchemaNode {
  const node: SchemaNode = {
    '@type': 'WebPage',
    '@id': webPageId(input.url),
    url: abs(input.url),
    name: input.name,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: input.inLanguage ?? 'en-IN',
    publisher: { '@id': ORG_ID },
  };
  if (input.description) node.description = input.description;
  if (input.datePublished) node.datePublished = input.datePublished;
  if (input.dateModified) node.dateModified = input.dateModified;
  if (input.aboutId) node.about = { '@id': input.aboutId };
  if (input.hasBreadcrumb) node.breadcrumb = { '@id': breadcrumbId(input.url) };
  if (input.primaryImage) {
    node.primaryImageOfPage = { '@id': primaryImageId(input.url) };
    node.image = {
      '@type': 'ImageObject',
      '@id': primaryImageId(input.url),
      url: input.primaryImage,
    };
  }
  return node;
}
