/**
 * SINGLE SOURCE OF TRUTH for the Scaling Socials entity.
 *
 * Every schema block, footer, contact page, and meta tag reads from here.
 * Nothing about the organisation is hardcoded anywhere else in the codebase.
 *
 * Confirmed 2 September 2026 against Google Business Profile, Google Maps,
 * and the LLP registry. Values marked TODO still need supplying — see
 * docs/spec/05-CONTENT-REQUIREMENTS.md.
 *
 * Rules:
 *  - `url` is NON-www. Every internal and outbound self-reference uses it.
 *  - `address` is the Google Maps form. The GST/legal address is DIFFERENT and
 *    is used only on invoices and contracts — it never appears on the website.
 *  - `foundingDate` is 2021 (partnership). The 2022 LLP incorporation is
 *    mentioned only in About-page prose, never in a structured field.
 */

export const ORG = {
  // Naming
  name: 'Scaling Socials',
  legalName: 'Scaling Socials Media LLP',
  alternateName: 'Scaling Socials Media LLP',

  // Web
  url: 'https://scalingsocials.com',
  logo: 'https://scalingsocials.com/logo.png', // TODO: 512x512 PNG, square, transparent bg

  // Founding — partnership 2021, incorporated as LLP Nov 2022.
  // Structured fields get 2021 only.
  foundingDate: '2021',

  // People — all four partners. Each needs a Person entry on /team/.
  founders: [
    { name: 'Tayeb Khan', jobTitle: 'Co-founder', linkedin: '' },   // TODO
    { name: 'Jamal Mohammed Khan', jobTitle: 'Co-founder', linkedin: '' }, // TODO
    { name: 'Maaz', jobTitle: 'Co-founder', linkedin: '' },          // TODO: full name
    { name: 'Kushal Sharma', jobTitle: 'Co-founder', linkedin: '' }, // TODO
  ],

  numberOfEmployees: 20,

  // Contact
  telephone: '+91-96067-13608',
  email: 'support@scalingsocials.com',

  // Address — Google Maps form. Public use only.
  address: {
    streetAddress: '203, CMR Main Road, HRBR Layout 3rd Block',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560043',
    addressCountry: 'IN',
    neighborhood: 'Kacharakanahalli',
  },

  // Rooftop coordinates from Google Business Profile, 6dp (~0.1m precision)
  geo: {
    latitude: 13.024282,
    longitude: 77.632886,
  },

  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00', closes: '18:00' },
  ],

  // Google Business Profile primary category. Mirror this wherever a
  // category field exists.
  primaryCategory: 'Marketing agency',

  areaServed: ['IN', 'AE'],
  priceRange: '₹₹',

  /**
   * sameAs — the entity graph. Every profile that describes this business.
   * More complete = less confusion between Scaling Socials, Scale Socials,
   * Scaling Wolves, and OU Social Scaling. Add each URL as it is claimed and
   * corrected. Order does not matter; completeness does.
   */
  sameAs: [
    'https://www.linkedin.com/company/scaling-socials/',
    'https://www.instagram.com/scalingsocialsofficial/',
    'https://www.facebook.com/scalingsocials/',
    // TODO — add once claimed/corrected (see ss-nap-checklist.xlsx):
    // Google Business Profile share URL
    // https://www.justdial.com/... (existing listing)
    // https://www.zoominfo.com/c/scaling-socials/1314166081
    // https://www.zipleaf.in/Companies/Scaling-Socials
    // https://trends.builtwith.com/agency/Scaling-Socials
    // Clutch, GoodFirms, DesignRush, Sortlist, The Manifest
    // Shopify Partners, Google Partners, Meta Business Partners
    // Crunchbase, AmbitionBox, YouTube, X
  ],

  /**
   * LEGAL/TAX ONLY. Same physical building as `address` above —
   * HRBR = Hennur Road Banaswadi Road Layout. This form appears on invoices,
   * contracts, and statutory filings. It must NEVER appear on the website,
   * in schema, or in any directory listing.
   */
  legalAddress: {
    streetAddress: 'No. 203, 4th Cross, Hennur Main Road, Banaswadi Road',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560043',
    addressCountry: 'IN',
    llpin: 'ABZ-2054',
  },
} as const;

export type Org = typeof ORG;
