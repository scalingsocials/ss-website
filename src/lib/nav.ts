/**
 * Primary navigation model. See 02-SITEMAP-AND-PAGE-SPECS.md §6.
 *
 * Five top-level items, no more (§6). Three are mega/dropdown menus, one is a
 * direct link (Benchmarks — the differentiator gets its own top-level slot), and
 * the CTA sits outside this list.
 *
 * URLs are the real sitemap URLs from §1. Trailing slashes always (astro.config
 * trailingSlash: 'always'). Descriptors are plain one-liners describing services
 * the agency genuinely offers — not fabricated metrics.
 *
 * The Services pillar list is data-driven: add a pillar here and the mega menu
 * grows. Only pillars that exist as real routes appear.
 */

export interface NavLeaf {
  label: string;
  href: string;
  descriptor?: string;
  external?: boolean;
}

export interface NavItem {
  label: string;
  href?: string; // set for a direct link; omit for a dropdown
  kind: 'link' | 'dropdown' | 'mega';
  items?: NavLeaf[];
}

/** The six service pillars, in mega-menu order (two columns). */
export const SERVICE_PILLARS: NavLeaf[] = [
  {
    label: 'Performance marketing',
    href: '/performance-marketing-agency-bangalore/',
    descriptor: 'Meta and Google Ads built to move ROAS, not impressions.',
  },
  {
    label: 'SEO',
    href: '/seo-agency-bangalore/',
    descriptor: 'Organic growth for ecommerce, technical and local.',
  },
  {
    label: 'Shopify development',
    href: '/shopify-development-company-bangalore/',
    descriptor: 'Stores built to convert, migrate and load fast.',
  },
  {
    label: 'Web development',
    href: '/web-development-company-bangalore/',
    descriptor: 'Fast, measurable sites that sell.',
  },
  {
    label: 'Social media marketing',
    href: '/social-media-marketing-agency-bangalore/',
    descriptor: 'Content and community that supports paid.',
  },
  {
    label: 'Conversion rate optimisation',
    href: '/conversion-rate-optimisation-services/',
    descriptor: 'Fix the leaks between click and checkout.',
  },
];

export const NAV: NavItem[] = [
  {
    label: 'Services',
    kind: 'mega',
    items: SERVICE_PILLARS,
  },
  {
    label: 'Work',
    kind: 'dropdown',
    items: [
      // Both descriptors used to overclaim, on every page in the site header:
      // the case studies are deliberately ANONYMISED (the page itself has a
      // "Why these brands aren't named" section), and /work/ attaches no results
      // to the creatives. Same two overclaims were in llms.txt.
      { label: 'Case studies', href: '/case-studies/', descriptor: 'Seven accounts, real before/after numbers.' },
      { label: 'Industries', href: '/industries/', descriptor: 'Proof by category: fashion, kids, wellness, gifting, beauty.' },
      { label: 'Creative gallery', href: '/work/', descriptor: 'The ad creative we make in-house.' },
    ],
  },
  {
    label: 'Teardowns',
    href: '/teardowns/',
    kind: 'link',
  },
  {
    label: 'Resources',
    kind: 'dropdown',
    items: [
      { label: 'Blog', href: '/blog/', descriptor: 'Notes from the accounts we run.' },
      { label: 'Guides', href: '/guides/', descriptor: 'Long-form, evergreen.' },
      { label: 'Comparisons', href: '/vs/', descriptor: "Straight answers to the 'which should I choose?' questions." },
      { label: 'Tools', href: '/tools/', descriptor: 'Free calculators for D2C operators.' },
      { label: 'Glossary', href: '/glossary/', descriptor: 'Every metric, defined with a rupee example.' },
    ],
  },
  {
    label: 'Company',
    kind: 'dropdown',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'Team', href: '/team/' },
      { label: 'Careers', href: 'https://careers.scalingsocials.com/', external: true },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/** Primary header CTA. The indexed audit page, not the ad landing page. */
export const NAV_CTA = { label: 'Get a free growth plan', href: '/audit/' };
