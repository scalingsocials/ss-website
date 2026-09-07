/**
 * Service node. See 03 §1.2–1.3.
 *
 * provider → the Organization (@id). Pillar pages add a hasOfferCatalog listing
 * the sub-services that link to cluster pages.
 *
 * No pricing is published on the site (owner directive, 2026-09-07), so no Offer
 * carries a price; the OfferInput type is retained but unused.
 */
import { ORG_ID, abs, serviceId, type SchemaNode } from './ids';

export interface OfferInput {
  price: number; // 25000
  priceCurrency?: string; // 'INR'
  unitText?: string; // 'MONTH'
}

export interface ServiceInput {
  url: string;
  name: string; // "Performance marketing"
  serviceType?: string;
  description?: string;
  areaServed?: string[]; // ['IN','AE']
  offer?: OfferInput;
  /** Sub-services: label + cluster URL. */
  offerCatalog?: { name: string; url: string }[];
}

export function service(input: ServiceInput): SchemaNode {
  const node: SchemaNode = {
    '@type': 'Service',
    '@id': serviceId(input.url),
    name: input.name,
    url: abs(input.url),
    provider: { '@id': ORG_ID },
  };
  if (input.serviceType) node.serviceType = input.serviceType;
  if (input.description) node.description = input.description;
  if (input.areaServed) {
    node.areaServed = input.areaServed.map((code) => ({ '@type': 'Country', identifier: code }));
  }
  if (input.offer) {
    node.offers = {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: input.offer.price,
        priceCurrency: input.offer.priceCurrency ?? 'INR',
        ...(input.offer.unitText
          ? { unitText: input.offer.unitText, referenceQuantity: { '@type': 'QuantitativeValue', unitText: input.offer.unitText } }
          : {}),
      },
    };
  }
  if (input.offerCatalog?.length) {
    node.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${input.name} services`,
      itemListElement: input.offerCatalog.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(s.url) },
      })),
    };
  }
  return node;
}
