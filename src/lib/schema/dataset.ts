/**
 * Dataset + DataCatalog nodes. See 03 §1.3 and §7 (the Benchmark Index moat).
 *
 * This is the important one: Dataset schema is how the India D2C Ad Benchmark
 * Index enters Google Dataset Search and becomes a strong LLM citation signal.
 * Published CC BY 4.0 with an explicit citation string (03 §4.4). creator →
 * the Organization. Every figure is real, aggregated, anonymised (03 §7) —
 * never a fabricated benchmark (CLAUDE.md §9).
 */
import { ORG } from './entity';
import { ORG_ID, abs, datasetId, type SchemaNode } from './ids';

export interface DatasetInput {
  url: string;
  name: string; // "India D2C Ad Benchmark Index, Q3 2026"
  description: string;
  datePublished: string; // ISO
  dateModified?: string;
  temporalCoverage?: string; // "2026-07/2026-09"
  /** Download distributions (CSV, JSON) — absolute URLs. */
  distributions?: { url: string; encodingFormat: string }[];
  keywords?: string[];
  version?: string;
}

export function dataset(input: DatasetInput): SchemaNode {
  const node: SchemaNode = {
    '@type': 'Dataset',
    '@id': datasetId(input.url),
    name: input.name,
    description: input.description,
    url: abs(input.url),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    inLanguage: 'en-IN',
    spatialCoverage: ORG.areaServed.map((code) => ({ '@type': 'Country', identifier: code })),
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'India D2C Ad Benchmark Index',
      url: abs('/india-d2c-ad-benchmarks/'),
    },
  };
  if (input.temporalCoverage) node.temporalCoverage = input.temporalCoverage;
  if (input.version) node.version = input.version;
  if (input.keywords?.length) node.keywords = input.keywords;
  if (input.distributions?.length) {
    node.distribution = input.distributions.map((d) => ({
      '@type': 'DataDownload',
      contentUrl: abs(d.url),
      encodingFormat: d.encodingFormat,
    }));
  }
  return node;
}
