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

  // People — the four co-founders live in src/lib/team.ts (names, LinkedIn,
  // bios, photos). organization.ts reads them from there; do not add a second
  // list here, it drifted once already.

  numberOfEmployees: 20,

  // Contact
  telephone: '+91-96067-13608',
  email: 'support@scalingsocials.com',

  /**
   * Address — the Google Business Profile / Maps form, VERBATIM. Public use only.
   *
   * This must match the Google Business Profile character for character: local
   * ranking leans on NAP consistency, and a website address that differs from
   * the listing weakens both. Confirmed against Maps by the owner 2026-09-13.
   * If the listing is ever edited, edit this in the same sitting — everything on
   * the site (footer, /contact/, the PostalAddress in schema, and the directions
   * link) reads from here.
   *
   * The landmark and both localities are part of the street line because that is
   * how Maps formats them, and splitting them across schema fields would produce
   * a different string from the listing.
   */
  address: {
    streetAddress:
      '203, CMR Main Rd, next to Vasan Eye Care, HRBR Layout 3rd Block, Keshava Nagar, Kacharakanahalli',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560043',
    addressCountry: 'IN',
  },

  // Rooftop coordinates from Google Business Profile, 6dp (~0.1m precision)
  geo: {
    latitude: 13.024282,
    longitude: 77.632886,
  },

  /**
   * Opening hours — the Google Business Profile values, VERBATIM.
   *
   * Was Monday–SATURDAY 10:00–18:00, which contradicted the listing on three
   * counts: the listing closes Saturday, opens at 10:30 and closes at 18:30.
   * That is worse than an SEO inconsistency — it could send someone to a closed
   * office on a Saturday. Corrected against Maps 2026-09-13.
   */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:30', closes: '18:30' },
  ],

  // Google Business Profile primary category. Mirror this wherever a
  // category field exists.
  primaryCategory: 'Marketing agency',

  areaServed: ['IN', 'AE'],

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
