#!/usr/bin/env node
/**
 * JSON-LD validation gate. Fails CI on any invalid or malformed schema block.
 * Rules from docs/spec/03-SEO-AEO-GEO-SPEC.md §1.2 and §1.3.
 *
 * Enforces:
 *  - Every emitted <script type="application/ld+json"> parses as JSON.
 *  - ONE @graph per page — a page must not carry more than one JSON-LD block,
 *    and each block must be a { @context, @graph:[...] } document, never an
 *    isolated node ("no isolated JSON-LD blobs", §1.2).
 *  - Every node has an @type.
 *  - No duplicate @id within a graph.
 *  - Required fields per type for the types we emit.
 *  - Every intra-page @id reference resolves to a node in the same graph OR to a
 *    known site-global / cross-page id (organization, website, team person).
 *
 * A page with no JSON-LD is allowed (e.g. /styleguide/, noindex utility pages).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

const DIST = 'dist';
const SITE = 'https://scalingsocials.com';

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
};

const LD_RE = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

// Required fields by @type (only the types this site emits).
const REQUIRED = {
  Organization: ['name', 'url'],
  ProfessionalService: ['name', 'url', 'address'],
  WebSite: ['url'],
  WebPage: ['url', 'name'],
  Service: ['name', 'provider'],
  Article: ['headline', 'datePublished', 'author'],
  TechArticle: ['headline', 'datePublished', 'author'],
  CreativeWork: ['name'],
  BreadcrumbList: ['itemListElement'],
  FAQPage: ['mainEntity'],
  Person: ['name'],
  DefinedTerm: ['name', 'description'],
  DefinedTermSet: ['name'],
  Dataset: ['name', 'description', 'license'],
  WebApplication: ['name'],
  SoftwareApplication: ['name'],
};

const typeList = (t) => (Array.isArray(t) ? t : [t]);
const fails = [];

let dist;
try {
  dist = await walk(DIST);
} catch {
  console.error(`✗ ${DIST}/ not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const htmlFiles = dist.filter((f) => extname(f) === '.html');
let blocksChecked = 0;

for (const file of htmlFiles) {
  const rel = relative(DIST, file);
  const src = await readFile(file, 'utf8');
  const blocks = [...src.matchAll(LD_RE)];

  if (blocks.length === 0) continue; // pages may legitimately carry no schema
  if (blocks.length > 1) {
    fails.push(`${rel}: ${blocks.length} JSON-LD blocks. Emit ONE @graph per page (§1.2).`);
    continue;
  }

  let doc;
  try {
    doc = JSON.parse(blocks[0][1].replace(/\\u003c/gi, '<'));
  } catch (e) {
    fails.push(`${rel}: JSON-LD does not parse — ${e.message}`);
    continue;
  }

  if (!doc['@context']) fails.push(`${rel}: JSON-LD missing @context.`);
  if (!Array.isArray(doc['@graph'])) {
    fails.push(`${rel}: JSON-LD is not a @graph document (isolated blob forbidden, §1.2).`);
    continue;
  }

  blocksChecked++;
  const nodes = doc['@graph'];
  const definedIds = new Set();
  const referencedIds = [];

  for (const node of nodes) {
    if (!node || typeof node !== 'object') {
      fails.push(`${rel}: @graph contains a non-object node.`);
      continue;
    }
    if (!node['@type']) {
      fails.push(`${rel}: a @graph node has no @type.`);
      continue;
    }
    if (node['@id']) {
      if (definedIds.has(node['@id'])) {
        fails.push(`${rel}: duplicate @id ${node['@id']} in the graph.`);
      }
      definedIds.add(node['@id']);
    }

    for (const t of typeList(node['@type'])) {
      const req = REQUIRED[t];
      if (!req) continue;
      for (const field of req) {
        if (node[field] === undefined || node[field] === null || node[field] === '') {
          fails.push(`${rel}: ${t} node missing required field "${field}".`);
        }
      }
    }

    // FAQPage: each Question must carry an acceptedAnswer with text.
    if (typeList(node['@type']).includes('FAQPage')) {
      for (const q of node.mainEntity ?? []) {
        if (!q.name || !q.acceptedAnswer?.text) {
          fails.push(`${rel}: FAQPage has a Question without a name or acceptedAnswer.text.`);
        }
      }
    }

    // Collect {@id} references (excluding the node's own @id declaration).
    collectRefs(node, referencedIds);
  }

  // Cross-reference integrity: a reference resolves if it is defined in-graph,
  // or is a known site-global / cross-page id.
  for (const ref of referencedIds) {
    const external =
      ref === `${SITE}/#organization` ||
      ref === `${SITE}/#website` ||
      ref.startsWith(`${SITE}/team/#`); // person nodes live on /team/
    if (!definedIds.has(ref) && !external) {
      fails.push(`${rel}: @id reference ${ref} is not defined in the graph and is not a known global id.`);
    }
  }
}

function collectRefs(value, out, isRoot = true) {
  if (Array.isArray(value)) {
    for (const v of value) collectRefs(v, out, false);
    return;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    // A pure reference object: { "@id": "..." } with no other schema keys.
    if (!isRoot && keys.length === 1 && keys[0] === '@id') {
      out.push(value['@id']);
      return;
    }
    for (const [k, v] of Object.entries(value)) {
      if (k === '@id') continue; // declaration, not a reference
      collectRefs(v, out, false);
    }
  }
}

console.log(`Schema: ${blocksChecked} @graph block(s) across ${htmlFiles.length} page(s).`);
if (fails.length) {
  console.error('\nSchema validation FAILED:');
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('Schema validation passed.');
