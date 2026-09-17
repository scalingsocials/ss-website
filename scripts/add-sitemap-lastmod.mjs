#!/usr/bin/env node
/**
 * Add <lastmod> to dist/sitemap-*.xml, taken from each page's own JSON-LD
 * dateModified. Runs after `astro build` (part of `npm run build`).
 *
 * Why from the page and not the file system or git: Google only trusts lastmod
 * that is "consistently and verifiably accurate", and the date it can verify is
 * the one on the page. Reading it from the page's own @graph keeps the sitemap
 * and the visible/structured date identical by construction (03 §3.9).
 *
 * A page with no dateModified gets no <lastmod> — never a made-up one.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://scalingsocials.com';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/;

function nodesOf(json) {
  if (Array.isArray(json)) return json.flatMap(nodesOf);
  if (json && typeof json === 'object') return json['@graph'] ? nodesOf(json['@graph']) : [json];
  return [];
}

/** The page's own dateModified: the node describing this URL wins, else the WebPage node. */
async function lastmodFor(url) {
  const path = new URL(url).pathname;
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) return null;
  const html = await readFile(file, 'utf8');
  const nodes = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { nodes.push(...nodesOf(JSON.parse(m[1]))); } catch { /* validate-schema reports bad JSON */ }
  }
  const dated = nodes.filter((n) => typeof n.dateModified === 'string' && ISO_DATE.test(n.dateModified));
  const types = (n) => [].concat(n['@type'] ?? []);
  const own =
    dated.find((n) => n.url === url || (typeof n['@id'] === 'string' && n['@id'].split('#')[0] === url)) ??
    dated.find((n) => types(n).some((t) => /WebPage$/.test(t))) ??
    null;
  return own?.dateModified ?? null;
}

const maps = (await readdir(DIST)).filter((f) => /^sitemap-\d+\.xml$/.test(f));
let added = 0;
let missing = 0;
for (const name of maps) {
  const file = join(DIST, name);
  let xml = await readFile(file, 'utf8');
  const urls = [...xml.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of urls) {
    if (!url.startsWith(SITE)) continue;
    const date = await lastmodFor(url);
    if (!date) { missing++; console.warn(`  no dateModified: ${url}`); continue; }
    xml = xml.replace(`<url><loc>${url}</loc>`, `<url><loc>${url}</loc><lastmod>${date}</lastmod>`);
    added++;
  }
  await writeFile(file, xml);
}
console.log(`sitemap lastmod: ${added} added, ${missing} without a date`);
