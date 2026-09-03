/**
 * Case study nodes: Article + CreativeWork. See 03 §1.3.
 *
 * The case study is both an Article (the write-up) and a CreativeWork (the work
 * itself). A Review with AggregateRating is added ONLY where a genuine, verifiable
 * client review exists — never faked (03 §1.3 hard rule, CLAUDE.md §9). The
 * `review` input is optional and omitted by default.
 */
import { ORG_ID, abs, articleId, creativeWorkId, type SchemaNode } from './ids';
import { article, type ArticleInput } from './article';

export interface CaseStudyReview {
  ratingValue: number; // genuine, verifiable
  bestRating?: number;
  author: string; // client contact / brand
  body?: string;
}

export interface CaseStudyInput extends ArticleInput {
  clientName: string;
  category?: string;
  /** Only pass when a real, verifiable review exists. */
  review?: CaseStudyReview;
}

export function caseStudy(input: CaseStudyInput): SchemaNode[] {
  const articleNode = article({ ...input, type: 'Article' });

  const creativeWork: SchemaNode = {
    '@type': 'CreativeWork',
    '@id': creativeWorkId(input.url),
    name: input.headline,
    url: abs(input.url),
    creator: { '@id': ORG_ID },
    about: input.clientName,
    isPartOf: { '@id': articleId(input.url) },
  };
  if (input.category) creativeWork.genre = input.category;

  if (input.review) {
    creativeWork.review = {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: input.review.ratingValue,
        bestRating: input.review.bestRating ?? 5,
      },
      author: { '@type': 'Organization', name: input.review.author },
      ...(input.review.body ? { reviewBody: input.review.body } : {}),
    };
  }

  return [articleNode, creativeWork];
}
