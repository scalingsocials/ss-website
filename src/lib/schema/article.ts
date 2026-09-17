/**
 * Article / TechArticle node. See 03 §1.3 (blog, guides).
 *
 * author → a Person (@id), publisher → the Organization, plus datePublished and
 * dateModified that MUST match the visible dates on the page (03 §3.9). Recency
 * is a heavy weighting factor for AI Overviews and LLM retrieval.
 */
import { ORG } from './entity';
import { ORG_ID, abs, articleId, isoDateTime, personId, type SchemaNode } from './ids';

export interface ArticleInput {
  url: string;
  headline: string;
  description?: string;
  datePublished: string; // ISO
  dateModified?: string; // ISO, defaults to datePublished
  authorSlug?: string; // links to a Person on /team/
  authorName?: string; // fallback when no team Person exists
  image?: string; // absolute URL
  /** 'TechArticle' for how-tos, else 'Article'. */
  type?: 'Article' | 'TechArticle';
}

export function article(input: ArticleInput): SchemaNode {
  const author = input.authorSlug
    ? { '@id': personId(input.authorSlug) }
    : input.authorName
      ? { '@type': 'Person', name: input.authorName }
      : { '@id': ORG_ID };

  const node: SchemaNode = {
    '@type': input.type ?? 'Article',
    '@id': articleId(input.url),
    headline: input.headline,
    url: abs(input.url),
    datePublished: isoDateTime(input.datePublished),
    dateModified: isoDateTime(input.dateModified ?? input.datePublished),
    author,
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: abs(input.url),
    // Google lists `image` as recommended for Article. Pages without their own
    // image fall back to the logo — the same image their OG card already uses.
    image: input.image ?? ORG.logo,
  };
  if (input.description) node.description = input.description;
  return node;
}
