/**
 * FAQPage node. See 03 §1.2 and §3.7, CLAUDE.md §12.
 *
 * Built from the SAME items rendered by FaqAccordion — never mark up an answer
 * that is not visible on the page (03 §1.3 hard rule). The FaqAccordion keeps
 * answers in the DOM whether open or closed, so the markup is honest.
 */
import { faqId, type SchemaNode } from './ids';

export interface FaqItem {
  q: string;
  a: string;
}

export function faqPage(pageUrl: string, items: FaqItem[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': faqId(pageUrl),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
