/**
 * Ad landing-page content — the pages under /lp/ (noindex, ad traffic only).
 * See 02 §5.4 and 04 (lead capture). Rendered by LandingLayout.
 *
 * These are conversion-first pages for paid campaigns: one goal (the lead form),
 * no site nav, message-matched to the ad, heavy on proof and objection-handling.
 * Copy is sharper and more benefit-led than the indexable service pages, but every
 * number is real — proof Deltas and totals are derived from CASE_STUDIES so they
 * can never drift, and no metric is invented for services without one (§15).
 */
import type { Field } from '@/lib/formFields';
import type { Faq } from '@/lib/services';
import { SERVICE_BY_SLUG } from '@/lib/services';
import { CASE_STUDY_BY_SLUG, CASE_STUDY_TOTALS } from '@/lib/caseStudies';

export interface LandingProof {
  metric: string;
  before: string;
  after: string;
  client: string;
  period: string;
  channel?: string;
}

export interface LandingCard {
  glyph: string;
  title: string;
  body: string;
}

export interface LandingContent {
  slug: string;
  url: string;
  source: string;
  title: string;
  description: string;
  phoneCtaLabel: string;
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    bullets: string[];
    stats: { value: string; label: string }[];
    formHeading: string;
    formSub: string;
    submitLabel: string;
    questions: Field[];
  };
  trustLine: string;
  proof?: LandingProof[];
  showcase?: boolean;
  benefits: { eyebrow: string; heading: string; sub: string; items: LandingCard[] };
  process: { title: string; body: string }[];
  why: { eyebrow: string; heading: string; points: LandingCard[] };
  faqs: Faq[];
  finalCta: { heading: string; body: string; ctaLabel: string };
}

// ── Derive real proof from the documented case studies (no drift) ─────────────
const perf = SERVICE_BY_SLUG['performance-marketing']!;
const web = SERVICE_BY_SLUG['web-development']!;

const proofFrom = (slug: string): LandingProof => {
  const c = CASE_STUDY_BY_SLUG[slug];
  if (!c || !c.delta) throw new Error(`landings: ${slug} has no delta`);
  return { metric: c.delta.metric, before: c.delta.before, after: c.delta.after, client: c.client, period: c.period, channel: c.channels };
};

// Pick a subset of a service's FAQs by question keyword, in a deliberate order.
const faqsByKeyword = (slug: string, keys: string[]): Faq[] => {
  const all = SERVICE_BY_SLUG[slug]!.faqs;
  return keys.map((k) => all.find((f) => f.q.toLowerCase().includes(k.toLowerCase()))).filter((f): f is Faq => Boolean(f));
};

export const LANDINGS: LandingContent[] = [
  {
    slug: 'performance-marketing',
    url: '/lp/performance-marketing/',
    source: 'lp-performance-marketing',
    title: 'Scale Meta & Google Ads Profitably | Scaling Socials',
    description:
      'Performance marketing for D2C & ecommerce, managed to your real margins. Creative made in-house, spend never marked up. Free audit in 3 working days.',
    phoneCtaLabel: 'Call us',
    hero: {
      eyebrow: 'Performance marketing for D2C & ecommerce',
      h1: 'Scale Meta & Google ads that actually turn a profit',
      sub: 'We buy media against your break-even ROAS, produce the ad creative in-house, and scale only what clears your margin. Your ad spend stays yours — paid straight to the platforms, never marked up.',
      bullets: [
        'Media, creative & CRO on one senior team',
        'Ad spend paid straight to the platforms — never marked up',
        'A written audit in 3 working days, whether or not you hire us',
      ],
      stats: [
        { value: CASE_STUDY_TOTALS.roas, label: `Average ROAS across ${CASE_STUDY_TOTALS.accounts} documented accounts` },
        { value: CASE_STUDY_TOTALS.revenue, label: 'Tracked revenue driven' },
        { value: CASE_STUDY_TOTALS.spend, label: 'Ad spend managed' },
      ],
      formHeading: 'Get your free growth plan',
      formSub: 'A written audit of what to change first — in 3 working days.',
      submitLabel: 'Get my free plan',
      questions: perf.formQuestions,
    },
    trustLine: 'Trusted by D2C & ecommerce brands across India and the UAE',
    proof: [
      proofFrom('womens-fashion-account-turnaround'),
      proofFrom('wellness-brand-zero-to-scale'),
      proofFrom('womenswear-breaking-the-ceiling'),
    ],
    benefits: {
      eyebrow: 'What you get',
      heading: 'One team on media, creative and the store — not a lone buyer',
      sub: 'Everything that actually moves a paid account, run by senior people against your P&L.',
      items: [
        { glyph: 'target', title: 'Meta & Instagram ads', body: 'Full-funnel prospecting and retargeting, Advantage+ where it beats manual, fed by a weekly creative pipeline.' },
        { glyph: 'search', title: 'Google Search, Shopping & PMax', body: 'Built around real buying intent and your margin — not impression share for its own sake.' },
        { glyph: 'spark', title: 'Ad creative, made in-house', body: 'You send raw footage; we cut video-led ads and statics and test them every week. Creative is the lever.' },
        { glyph: 'funnel', title: 'Conversion rate optimisation', body: 'We close the leaks between the click and the checkout so the traffic you pay for actually converts.' },
      ],
    },
    process: perf.process,
    why: {
      eyebrow: 'Why brands switch to us',
      heading: 'The difference you feel in the P&L',
      points: [
        { glyph: 'gauge', title: 'Bought against break-even ROAS', body: 'We buy to the number your margin sets — not the flattering ROAS the platform reports back to itself.' },
        { glyph: 'shield', title: 'No lock-in, no markup, no vanity promises', body: 'Your spend goes straight to Meta and Google. We will not promise a ROAS we cannot control.' },
        { glyph: 'chart', title: 'Scale only what clears', body: 'Winners get budget, losers get cut, testing stays cheap. Then we run the loop again.' },
        { glyph: 'handshake', title: 'A free audit, hire us or not', body: 'Send us access and you get a written audit in three working days. No sales deck, no obligation.' },
      ],
    },
    faqs: faqsByKeyword('performance-marketing', ['what roas', 'make the ad creative', 'how soon', 'pricing work', 'b2b or lead']),
    finalCta: {
      heading: 'Find out what is leaking money',
      body: 'Send us access to your ad accounts and store. Within three working days you get a written audit of what is working, what is not, and what we would change first — whether or not you hire us.',
      ctaLabel: 'Get my free growth plan',
    },
  },
  {
    slug: 'web-development',
    url: '/lp/web-development/',
    source: 'lp-web-development',
    title: 'High-Converting Websites & Landing Pages | Scaling Socials',
    description:
      'Scaling Socials builds fast, high-converting websites, landing pages and web & mobile apps for growth brands — sub-1.5s loads and a free site plan.',
    phoneCtaLabel: 'Call us',
    hero: {
      eyebrow: 'Web & app development for growth brands',
      h1: 'Fast, measurable sites that turn clicks into customers',
      sub: 'We design around one action, build pages that load in under 1.5 seconds, and wire clean tracking in from day one — so your traffic converts and you can see exactly what is working.',
      bullets: [
        'Sub-1.5s loads that protect Quality Score and budget',
        'Message-matched landing pages built to convert',
        'Clean GA4 + event tracking wired in from day one',
      ],
      stats: [
        { value: 'Sub-1.5s', label: 'Load-time target we build to' },
        { value: 'Design → deploy', label: 'One in-house build team' },
        { value: 'Measured', label: 'Clean tracking from day one' },
      ],
      formHeading: 'Get your free site plan',
      formSub: 'A review of your site or brief — with what to build first — in 2 working days.',
      submitLabel: 'Get my free plan',
      questions: web.formQuestions,
    },
    trustLine: 'Sites, stores and apps built for brands across India and the UAE',
    showcase: true,
    benefits: {
      eyebrow: 'What we build',
      heading: 'Things that sell, and things that scale',
      sub: 'Every build is designed around a single action and made to be measured.',
      items: [
        { glyph: 'code', title: 'Websites', body: 'Fast, measurable marketing and brand sites built around a clear action and clean tracking.' },
        { glyph: 'funnel', title: 'Landing pages', body: 'Message-matched, sub-1.5s pages for ad campaigns — built to protect Quality Score and convert.' },
        { glyph: 'layers', title: 'Web & mobile apps', body: 'Custom apps, dashboards, portals, booking and storefront tools, on a stack chosen for the job.' },
        { glyph: 'migrate', title: 'Rebuilds & migrations', body: 'Replace a slow WordPress build with a fast modern stack — without losing your SEO along the way.' },
        { glyph: 'gauge', title: 'Analytics & tracking', body: 'Clean GA4, server-side events and dashboards, so decisions run on real data instead of guesses.' },
      ],
    },
    process: web.process,
    why: {
      eyebrow: 'Why it converts',
      heading: 'Built to sell, not just to photograph well',
      points: [
        { glyph: 'target', title: 'Designed around one action', body: 'Every page or screen exists to drive a single outcome — a purchase, a lead, a booking. Decoration comes second.' },
        { glyph: 'speed', title: 'Speed is conversion', body: 'A store that takes four seconds to load has already lost buyers. We build lean, under 1.5 seconds.' },
        { glyph: 'chart', title: 'Measurable from day one', body: 'Clean GA4 and event tracking wired in, so you can see what works instead of guessing.' },
        { glyph: 'handshake', title: 'A stack your team can run', body: 'No black box. We hand over a build your team can update, with support as you grow.' },
      ],
    },
    faqs: faqsByKeyword('web-development', ['website pricing', 'site speed matter', 'web and mobile apps', 'rebuild my slow']),
    finalCta: {
      heading: 'Tell us what you need built',
      body: 'Send us your current site or your brief. Within two working days you get a review of what is slowing conversion and exactly what we would build first — whether or not you hire us.',
      ctaLabel: 'Get my free site plan',
    },
  },
];

export const LANDING_BY_SLUG: Record<string, LandingContent> = Object.fromEntries(
  LANDINGS.map((l) => [l.slug, l]),
);
