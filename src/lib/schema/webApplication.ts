/**
 * WebApplication + SoftwareApplication node. See 03 §1.3 (tool pages).
 *
 * The free calculators (break-even ROAS, CAC payback, budget planner, speed
 * grader) are the link and citation magnets. offers is free; the tool runs in
 * the browser. Register-agnostic content; this only builds the JSON-LD node.
 */
import { ORG_ID, abs, webAppId, type SchemaNode } from './ids';

export interface WebApplicationInput {
  url: string;
  name: string;
  description: string;
  applicationCategory?: string; // 'BusinessApplication'
}

export function webApplication(input: WebApplicationInput): SchemaNode {
  return {
    '@type': ['WebApplication', 'SoftwareApplication'],
    '@id': webAppId(input.url),
    name: input.name,
    description: input.description,
    url: abs(input.url),
    applicationCategory: input.applicationCategory ?? 'BusinessApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    publisher: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'INR',
    },
    isAccessibleForFree: true,
  };
}
