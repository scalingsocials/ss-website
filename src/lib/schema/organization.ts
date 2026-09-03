/**
 * Organization + ProfessionalService nodes. See 03 §1.2–1.3.
 *
 * Every page's @graph includes the Organization node (by @id, ORG_ID). The
 * homepage and location pages additionally emit ProfessionalService (a
 * LocalBusiness subtype) with rooftop geo and opening hours (03 §8). All facts
 * come from entity.ts — never hardcoded here. The legalAddress is invoices only
 * and never reaches schema (CLAUDE.md entity rules), so we read `address`.
 */
import { ORG } from './entity';
import { ORG_ID, SITE, type SchemaNode } from './ids';

function postalAddress(): SchemaNode {
  const a = ORG.address;
  return {
    '@type': 'PostalAddress',
    streetAddress: a.streetAddress,
    addressLocality: a.addressLocality,
    addressRegion: a.addressRegion,
    postalCode: a.postalCode,
    addressCountry: a.addressCountry,
  };
}

/** The base Organization node. Present in every page graph, referenced by @id. */
export function organization(): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: ORG.name,
    legalName: ORG.legalName,
    url: `${SITE}/`,
    logo: {
      '@type': 'ImageObject',
      url: ORG.logo,
      width: 512,
      height: 512,
    },
    image: ORG.logo,
    foundingDate: ORG.foundingDate,
    founder: ORG.founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.jobTitle })),
    numberOfEmployees: { '@type': 'QuantitativeValue', value: ORG.numberOfEmployees },
    email: ORG.email,
    telephone: ORG.telephone,
    address: postalAddress(),
    areaServed: ORG.areaServed.map((code) => ({ '@type': 'Country', identifier: code })),
    sameAs: ORG.sameAs.filter(Boolean),
  };
}

/**
 * ProfessionalService — LocalBusiness subtype for the homepage and locations.
 * Carries the local-SEO signals: rooftop geo, opening hours, price range,
 * primary category. Shares the org @id so the two describe one entity.
 */
export function professionalService(): SchemaNode {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: ORG.name,
    legalName: ORG.legalName,
    url: `${SITE}/`,
    image: ORG.logo,
    logo: ORG.logo,
    email: ORG.email,
    telephone: ORG.telephone,
    priceRange: ORG.priceRange,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ORG.geo.latitude,
      longitude: ORG.geo.longitude,
    },
    areaServed: ORG.areaServed.map((code) => ({ '@type': 'Country', identifier: code })),
    openingHoursSpecification: ORG.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: ORG.sameAs.filter(Boolean),
    founder: ORG.founders.map((f) => ({ '@type': 'Person', name: f.name })),
  };
}
