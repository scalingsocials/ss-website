/**
 * Case studies — the three real results Scaling Socials publishes, migrated from
 * the current site (owner confirms client permissions, 2026-09-04). Figures in
 * Indian units per CLAUDE.md (₹4.43 Cr, not "₹44.3 million"):
 *   ₹44.3M → ₹4.43 Cr · ₹1.4M → ₹14 L · ₹1M → ₹10 L.
 *
 * TODO from owner: the client name for each (to attach on the card) and the
 * before→after table for the full /case-studies/[slug]/ pages.
 */
export interface CaseStudy {
  result: string; // "₹4.43 Cr"
  metric: string; // "in revenue"
  period: string; // "in 90 days"
  channels: string;
  work: string;
  href: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  { result: '₹4.43 Cr', metric: 'in revenue', period: 'in 90 days', channels: 'Meta, Instagram, YouTube', work: 'Paid ads and content', href: '/case-studies/' },
  { result: '₹14 L', metric: 'in revenue', period: 'in 3 months', channels: 'Meta, Instagram, YouTube', work: 'Paid ads and content', href: '/case-studies/' },
  { result: '₹10 L', metric: 'in revenue', period: 'in 90 days', channels: 'Meta, Instagram, YouTube', work: 'Paid ads and content', href: '/case-studies/' },
];
