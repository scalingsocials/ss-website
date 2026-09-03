/**
 * DefinedTerm inside a DefinedTermSet. See 03 §1.3 and §6 (glossary).
 *
 * Glossary term pages are among the highest-hit-rate GEO pages on the site. Each
 * term is a DefinedTerm belonging to the site's glossary DefinedTermSet, so the
 * whole vocabulary links together. The one-sentence definition marked up here is
 * the exact sentence rendered on the page.
 */
import { abs, definedTermSetId, definedTermId, type SchemaNode } from './ids';

const GLOSSARY_URL = '/glossary/';

export function definedTermSet(): SchemaNode {
  return {
    '@type': 'DefinedTermSet',
    '@id': definedTermSetId(GLOSSARY_URL),
    name: 'Scaling Socials D2C marketing glossary',
    url: abs(GLOSSARY_URL),
  };
}

export interface DefinedTermInput {
  slug: string; // 'roas'
  term: string; // 'ROAS'
  definition: string; // the one-sentence definition
  url: string; // the term page URL
}

export function definedTerm(input: DefinedTermInput): SchemaNode {
  return {
    '@type': 'DefinedTerm',
    '@id': definedTermId(GLOSSARY_URL, input.slug),
    name: input.term,
    description: input.definition,
    url: abs(input.url),
    inDefinedTermSet: { '@id': definedTermSetId(GLOSSARY_URL) },
  };
}
