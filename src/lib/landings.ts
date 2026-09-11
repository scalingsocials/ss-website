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
  /** Current client — adds a "still running" tag under the date. */
  stillRunning?: boolean;
  /** Ads Manager screenshot slot (owner-supplied). Placeholder shown until added. */
  image?: string;
  imageAlt?: string;
}

export interface LandingCard {
  glyph: string;
  title: string;
  body: string;
}

/** WhatsApp secondary CTA config. */
export interface LandingWhatsApp {
  number: string; // digits only, international
  text: string; // pre-filled message
}

/** "What happens next" three-step strip. */
export interface LandingStep {
  n: string;
  text: string;
}

/** Static "what your audit looks like" sample block (perf LP). */
export interface LandingSampleAudit {
  score: string;
  findings: { text: string; severity: 'High' | 'Medium' | 'Low' }[];
  changes: string[];
}

/** "A strong fit / probably not a fit" qualifier columns. */
export interface LandingFit {
  good: string[];
  bad: string[];
}

export interface LandingContent {
  slug: string;
  url: string;
  source: string;
  title: string;
  description: string;
  phoneCtaLabel: string;
  /** Page CTA label (nav short + sticky + section buttons). */
  ctaLabel: string;
  ctaLabelShort: string;
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    bullets: string[];
    /** One muted qualifier line under the bullets. */
    qualifier?: string;
    stats: { value: string; label: string }[];
    formHeading: string;
    formSub: string;
    submitLabel: string;
    questions: Field[];
  };
  trustLine: string;
  /** LP-scoped form overrides (keeps the shared LeadForm untouched elsewhere). */
  form?: {
    step1?: Field[];
    step2?: Field[];
    showMessage?: boolean;
    redirect?: string;
  };
  /** WhatsApp secondary CTA (under forms + sticky bar). */
  whatsapp?: LandingWhatsApp;
  /** "What happens next" strip after the hero form. */
  nextSteps?: LandingStep[];
  proof?: LandingProof[];
  showcase?: boolean;
  benefits: { eyebrow: string; heading: string; sub: string; items: LandingCard[] };
  process: { title: string; body: string }[];
  why: { eyebrow: string; heading: string; points: LandingCard[] };
  /** Optional "strong fit / not a fit" columns after why-us. */
  fit?: LandingFit;
  /** Optional labelled sample-audit block before the final CTA. */
  sampleAudit?: LandingSampleAudit;
  faqs: Faq[];
  /** Optional distinct bullets for the bottom CTA (else reuses hero bullets). */
  finalBullets?: string[];
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

// Minimum-spend qualifier FAQ (this is the client's AD spend, not our fee — no
// pricing is published anywhere, per CLAUDE.md §18).
const MIN_SPEND_FAQ: Faq = {
  q: 'What monthly ad spend do you work with?',
  a: 'We are the best fit for brands able to put at least ₹1,000 a day into paid ads, roughly ₹30,000 a month, so there is enough budget to test, find the winners and scale them. Below that, paid rarely has the room to prove itself and we would usually tell you to keep testing organically first. If you are close to that level and growing, talk to us anyway and we will be straight about whether it is worth starting.',
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
    ctaLabel: 'Get my free growth audit',
    ctaLabelShort: 'Free growth audit',
    hero: {
      eyebrow: 'Performance marketing for D2C & ecommerce',
      h1: 'Scale Meta & Google ads that actually turn a profit',
      sub: 'We buy media against your break-even ROAS, produce the ad creative in-house, and scale only what clears your margin. Your ad spend stays yours — paid straight to the platforms, never marked up.',
      bullets: [
        'Media, creative & CRO on one senior team',
        'Ad spend paid straight to the platforms — never marked up',
        'A written audit in 3 working days, whether or not you hire us',
      ],
      qualifier: 'Best fit for brands spending at least ₹1,000 a day on ads.',
      // TODO(owner): replace the third stat with a real agency-wide spend or
      // revenue figure. The three below are all true, derived from the seven
      // documented case studies (CASE_STUDY_TOTALS) so nothing is invented.
      stats: [
        { value: CASE_STUDY_TOTALS.roas, label: 'Average blended ROAS' },
        { value: CASE_STUDY_TOTALS.revenue, label: 'Tracked revenue driven' },
        { value: CASE_STUDY_TOTALS.accounts, label: 'D2C accounts documented in full' },
      ],
      formHeading: 'Get your free growth audit',
      formSub: 'A written audit of what to change first — in 3 working days.',
      submitLabel: 'Send me my audit',
      questions: perf.formQuestions,
    },
    trustLine: 'Trusted by D2C & ecommerce brands across India and the UAE',
    form: {
      step1: [
        { name: 'name', label: 'Full name', type: 'text', required: true, autocomplete: 'name' },
        { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' },
        { name: 'phone', label: 'Phone or WhatsApp', type: 'tel', required: true, autocomplete: 'tel', placeholder: '+91 or +971' },
      ],
      step2: [
        { name: 'website', label: 'Website or Instagram URL', type: 'text', required: false, autocomplete: 'url', placeholder: 'yourbrand.com or @handle' },
        { name: 'ad_spend', label: 'Monthly ad spend', type: 'select', required: false, options: ['Under ₹1 L', '₹1–5 L', '₹5–20 L', '₹20 L+'] },
      ],
      showMessage: false,
      redirect: '/lp/performance-marketing/thanks/',
    },
    whatsapp: { number: '919606713608', text: "Hi, I'd like a free growth audit for my brand" },
    nextSteps: [
      { n: '01', text: 'We reply within one working day.' },
      { n: '02', text: 'You share ad-account access (read-only is fine).' },
      { n: '03', text: 'Written audit in your inbox within 3 working days. No sales deck, no obligation.' },
    ],
    proof: [
      { ...proofFrom('womens-fashion-account-turnaround'), stillRunning: true, image: '/lp/proof/case-1.png', imageAlt: "Meta Ads Manager showing account ROAS rising from 1.75x to 3.94x, women's fashion label" },
      { ...proofFrom('wellness-brand-zero-to-scale'), image: '/lp/proof/case-2.png', imageAlt: 'Meta Ads Manager showing revenue growing from zero to ₹1.19 crore in year one, wellness D2C brand' },
      { ...proofFrom('womenswear-breaking-the-ceiling'), stillRunning: true, image: '/lp/proof/case-3.png', imageAlt: "Meta Ads Manager showing average ROAS at 7.09x, mid-luxury women's western wear" },
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
    fit: {
      good: [
        'You already sell online',
        'You spend at least ₹1,000 a day on Meta or Google',
        'You have margin to scale',
        'You can send us raw creative footage',
        'You care about contribution margin, not just platform ROAS',
      ],
      bad: [
        'You want a guaranteed ROAS',
        'You want ads run with no creative input from you',
        'You have not yet validated demand for the product',
      ],
    },
    // Static, clearly-labelled sample. Owner will replace the copy with a real
    // redacted audit; the text here is generic on purpose.
    sampleAudit: {
      score: '62 / 100',
      findings: [
        { text: 'Spend concentrated in one fatigued audience; frequency past 3.5 with falling CTR.', severity: 'High' },
        { text: 'Retargeting and prospecting share one campaign, so the platform over-credits branded traffic.', severity: 'Medium' },
        { text: 'Product-page load over 3s on mobile is quietly costing you paid conversions.', severity: 'Low' },
      ],
      changes: [
        'Split prospecting and retargeting so each is judged on its own return.',
        'Refresh the top creative and set a weekly testing slot to stop fatigue recurring.',
        'Fix the mobile product-page speed before adding any more budget.',
      ],
    },
    // B2B FAQ removed from this page (5a); min-spend qualifier added on top (5b).
    faqs: [MIN_SPEND_FAQ, ...faqsByKeyword('performance-marketing', ['what roas', 'make the ad creative', 'how soon', 'pricing work'])],
    finalBullets: [
      "What's working, what's wasting money, and what we'd change first",
      'Your break-even ROAS, with the maths shown',
      "Where we'd scale next, whether or not you hire us",
    ],
    finalCta: {
      heading: 'Find out what is leaking money',
      body: 'Send us access to your ad accounts and store. Within three working days you get a written audit of what is working, what is not, and what we would change first — whether or not you hire us.',
      ctaLabel: 'Get your free growth audit',
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
    ctaLabel: 'Get my free site plan',
    ctaLabelShort: 'Free site plan',
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
