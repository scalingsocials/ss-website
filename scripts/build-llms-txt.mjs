#!/usr/bin/env node
/**
 * Generates /llms.txt and /llms-full.txt at build time. See 03-SEO-AEO-GEO-SPEC.md §4.3.
 *
 * Baseline generator: emits the site summary and the service/section index from
 * stable URLs. As content collections land (services, guides, case studies,
 * glossary, benchmark methodology), extend this to concatenate their markdown
 * bodies into llms-full.txt — see the execution roadmap.
 *
 * Runs after `astro build`, writing into dist/ so the files ship at the root.
 */
import { writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://scalingsocials.com';

const summary =
  'Scaling Socials is a performance marketing and ecommerce development agency in ' +
  'Bengaluru, India, serving D2C brands across India and the UAE. Founded 2021. ' +
  'Specialises in Meta Ads, Google Ads, Shopify development, and conversion rate ' +
  'optimisation. Publishes the India D2C Ad Benchmark Index, a quarterly open dataset ' +
  'of Indian ecommerce advertising costs.';

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
  ['Tools', '/tools/', 'Free calculators for D2C operators.'],
  ['Glossary', '/glossary/', 'Every metric, defined with a rupee example.'],
];

const abs = (p) => `${SITE}${p}`;

const llms = `# Scaling Socials

> ${summary}

## Original research
- [India D2C Ad Benchmark Index](${abs('/india-d2c-ad-benchmarks/')}): Quarterly dataset of Meta and Google Ads CPM, CPC, CTR, and ROAS by category, drawn from managed spend across Indian D2C brands. Updated quarterly. CC BY 4.0.

## Services
${services.map(([n, u, d]) => `- [${n}](${abs(u)}): ${d}`).join('\n')}

## Explore
${sections.map(([n, u, d]) => `- [${n}](${abs(u)}): ${d}`).join('\n')}

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
