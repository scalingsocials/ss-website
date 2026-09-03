/**
 * Person node. See 03 §1.3 (Team, blog/guide authors).
 *
 * worksFor → the Organization (@id), jobTitle, and sameAs → LinkedIn only
 * (11 §1: ship links that exist, never fabricated Facebook/Twitter icons at `#`).
 * Author bylines on articles reference a Person by the same @id.
 */
import { ORG_ID, personId, type SchemaNode } from './ids';

export interface PersonInput {
  slug: string; // 'jamal-khan'
  name: string;
  jobTitle?: string;
  linkedin?: string;
  image?: string; // absolute URL
  description?: string;
}

export function person(input: PersonInput): SchemaNode {
  const node: SchemaNode = {
    '@type': 'Person',
    '@id': personId(input.slug),
    name: input.name,
    worksFor: { '@id': ORG_ID },
  };
  if (input.jobTitle) node.jobTitle = input.jobTitle;
  if (input.image) node.image = input.image;
  if (input.description) node.description = input.description;
  const sameAs = [input.linkedin].filter(Boolean);
  if (sameAs.length) node.sameAs = sameAs;
  return node;
}
