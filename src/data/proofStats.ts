/**
 * proofStats.ts — THE single source of truth for the aggregate proof numbers.
 *
 * Every page that shows managed ad spend or a brand count imports from here, so
 * the figures can never drift between pages (which is what destroys the
 * credibility they are meant to build). `npm run check:stats` fails the build if
 * a hardcoded crore/Cr ad-spend figure, or an "N+ brands" string, appears
 * anywhere outside this file.
 *
 * Owner-confirmed (2026-09-12):
 *  - Ad spend managed is "₹10 Cr+ ad spend" — no channel qualifier, no
 *    all-channel total, and NO per-channel (e.g. Google Ads) spend figure
 *    anywhere on the site.
 *  - 400+ brands served.
 *
 * NOT covered here: per-account case-study result figures (e.g. a client's
 * ₹1.19 Cr year, the ₹2.77 Cr documented across the seven case studies). Those
 * are real, specific numbers in caseStudies.ts, not these aggregate stats, and
 * they are not gated.
 */
export const adSpendManaged = { value: '₹10 Cr+', label: 'Ad spend managed' };
export const brandsServed = { value: '400+', label: 'D2C and ecommerce brands' };
export const brandsPast10L = { value: '150+', label: 'brands scaled past ₹10 lakh in monthly revenue' };
export const brandsPast1Cr = { value: '50+', label: 'brands taken past ₹1 crore in cumulative sales' };
