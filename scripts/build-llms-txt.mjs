#!/usr/bin/env node
/**
 * Generates /llms.txt and /llms-full.txt at build time. See 03-SEO-AEO-GEO-SPEC.md §4.3.
 *
 * llms.txt is the index: the site summary plus every section an LLM should know
 * about. llms-full.txt additionally carries the extractable substance — the
 * one-sentence definition of every glossary term, the answer block of every
 * guide, post and case study — so a model that fetches one file gets the claims
 * rather than a list of links it then has to crawl.
 *
 * Content is read from the built HTML and the MDX frontmatter rather than
 * retyped, so these files cannot drift from the pages they describe.
 *
 * Runs after `astro build`, writing into dist/ so the files ship at the root.
 */
import { writeFile, access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Pull a scalar out of MDX frontmatter without a YAML dependency. */
const fm = (src, key) => {
  const m = src.match(new RegExp(`^${key}: "((?:[^"\\\\]|\\\\.)*)"$`, 'm'));
  return m ? m[1].replace(/\\"/g, '"') : null;
};

const readCollection = async (dir) => {
  let files;
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];
  }
  const out = [];
  for (const f of files.sort()) {
    const src = await readFile(join(dir, f), 'utf8');
    if (/^draft: true$/m.test(src)) continue;
    out.push({ slug: f.replace(/\.mdx$/, ''), src });
  }
  return out;
};

const DIST = 'dist';
const SITE = 'https://scalingsocials.com';

const summary =
  'Scaling Socials is an omni-channel ecommerce growth agency in Bengaluru, India, ' +
  'serving D2C brands across India and the UAE. Founded 2021. Specialises in Meta Ads, ' +
  'Google Ads, Shopify development, web development, SEO, social media, and conversion ' +
  'rate optimisation. Publishes honest public teardowns of real D2C brands.';

const services = [
  ['Performance marketing', '/performance-marketing-agency-bangalore/', 'Meta and Google Ads for D2C and ecommerce brands.'],
  ['SEO', '/seo-agency-bangalore/', 'Ecommerce, technical, and local SEO.'],
  ['Shopify development', '/shopify-development-company-bangalore/', 'Store builds, migrations, speed and redesign.'],
  ['Web development', '/web-development-company-bangalore/', 'Fast, measurable sites that sell.'],
  ['Social media marketing', '/social-media-marketing-agency-bangalore/', 'Content and community that supports paid.'],
  ['Conversion rate optimisation', '/conversion-rate-optimisation-services/', 'Fix the leaks between click and checkout.'],
];

const sections = [
  ['Case studies', '/case-studies/', 'Real, attributed result tables.'],
  ['Creative gallery', '/work/', 'Ad creatives with results attached.'],
  ['Teardowns', '/teardowns/', 'Honest public CRO and ads teardowns of real D2C brands.'],
  ['Tools', '/tools/', 'Free calculators for D2C operators.'],
  ['Glossary', '/glossary/', 'Every metric, defined with a rupee example.'],
];

const abs = (p) => `${SITE}${p}`;

const glossary = await readCollection('src/content/glossary');
const guides = await readCollection('src/content/guides');
const posts = await readCollection('src/content/blog');

const llms = `# Scaling Socials

> ${summary}

## Services
${services.map(([n, u, d]) => `- [${n}](${abs(u)}): ${d}`).join('\n')}

## Explore
${sections.map(([n, u, d]) => `- [${n}](${abs(u)}): ${d}`).join('\n')}

## Guides
${guides.map((g) => `- [${fm(g.src, 'title')}](${abs(`/guides/${g.slug}/`)}): ${fm(g.src, 'description')}`).join('\n')}

## Writing
${posts.map((p) => `- [${fm(p.src, 'title')}](${abs(`/blog/${p.slug}/`)}): ${fm(p.src, 'description')}`).join('\n')}

## Feeds
- RSS: ${SITE}/rss.xml
- JSON Feed: ${SITE}/feed.json

## Contact
- Website: ${SITE}/
- Email: support@scalingsocials.com
`;

const llmsFull = `${llms}
---

## About

${summary}

Scaling Socials manages Meta and Google Ads for D2C and ecommerce brands and builds and
optimises their Shopify stores. Engagements run on a build-test-scale cycle. Performance
marketing and SEO start at INR 25,000/month; ad spend is separate and never marked up.

## Results

Across the seven client ad accounts Scaling Socials documents publicly: INR 2.77 crore in
tracked revenue on INR 42.1 lakh of ad spend, a blended 6.58x return. Client names are
withheld to protect competitive accounts; each is identified by niche and situation, and
every case study publishes that account's worst month alongside its average.

## Glossary definitions

${glossary
  .map((t) => `### ${fm(t.src, 'term')}\n${fm(t.src, 'definition')}\nSource: ${abs(`/glossary/${t.slug}/`)}`)
  .join('\n\n')}

## Guide summaries

${guides
  .map((g) => `### ${fm(g.src, 'title')}\n${fm(g.src, 'answer')}\nSource: ${abs(`/guides/${g.slug}/`)}`)
  .join('\n\n')}

## Article summaries

${posts
  .map((p) => `### ${fm(p.src, 'title')}\n${fm(p.src, 'answer')}\nSource: ${abs(`/blog/${p.slug}/`)}`)
  .join('\n\n')}
`;

async function main() {
  try {
    await access(DIST);
  } catch {
    console.error(`✗ ${DIST}/ not found. Run \`astro build\` first.`);
    process.exit(1);
  }
  await writeFile(join(DIST, 'llms.txt'), llms, 'utf8');
  await writeFile(join(DIST, 'llms-full.txt'), llmsFull, 'utf8');
  console.log('Wrote dist/llms.txt and dist/llms-full.txt');
}

main();
