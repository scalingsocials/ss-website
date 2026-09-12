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
import { brandsServed } from '@/data/proofStats';

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
  /** Optional checklist under the summary (What-you-get cards). */
  list?: string[];
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
  /** Optional softer line under the "not a fit" column. */
  note?: string;
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
  /** Case-study slugs to show as poster cards in the proof section (reuses the
   *  existing CaseStudyPoster with the full study detail). */
  proofStudies?: string[];
  proof?: LandingProof[];
  showcase?: boolean;
  benefits: { eyebrow: string; heading: string; sub: string; items: LandingCard[] };
  process: { title: string; body: string }[];
  /** Why-us: either explained cards (points) or a plain pointer list. */
  why: { eyebrow: string; heading: string; points?: LandingCard[]; pointers?: string[] };
  /** Optional "strong fit / not a fit" columns after why-us. */
  fit?: LandingFit;
  /** Optional labelled sample-audit block before the final CTA. */
  sampleAudit?: LandingSampleAudit;
  /** "Where you're starting from" cards. */
  startingFrom?: { title: string; body: string }[];
  /** "Getting started" timeline (rendered with the ProcessSteps component). */
  gettingStarted?: { title: string; body: string }[];
  /** A short founder note (photo + quote). */
  founderNote?: { quote: string; attribution: string; photo?: string };
  /** Show the in-house creative slider (reads /public/lp/creatives/). */
  creatives?: boolean;
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
  a: "A ₹40–60 K monthly testing budget is where we start most brands, enough for Meta and Google to learn and for us to find angles that clear your break-even ROAS before scaling. From there we run accounts all the way up to large monthly budgets, so this is a floor, not a ceiling. If you're below ₹40 K today, book the call anyway and we'll tell you what to fix on the store first so the money works when you're ready.",
};

// "What happens on the strategy call?" (Task 1e).
const CALL_FAQ: Faq = {
  q: 'What happens on the strategy call?',
  a: "We open your Ads Manager and store with you, show you where spend is leaking and what we'd change first, and tell you honestly whether we're the right fit. No deck, no pressure.",
};

export const LANDINGS: LandingContent[] = [
  {
    slug: 'performance-marketing',
    url: '/lp/performance-marketing/',
    source: 'lp-performance-marketing',
    title: 'Scale Meta & Google Ads Profitably | Scaling Socials',
    description:
      'Performance marketing for D2C & ecommerce, managed to your real margins. Creative made in-house, ad spend never marked up. Book a free 30-min strategy call.',
    phoneCtaLabel: 'Call us',
    ctaLabel: 'Book my free strategy call',
    ctaLabelShort: 'Book a call',
    hero: {
      eyebrow: 'Performance marketing for D2C & ecommerce',
      h1: 'Scale Meta & Google ads that actually turn a profit',
      sub: 'We buy media against your break-even ROAS, produce the ad creative in-house, and scale only what clears your margin. Your ad spend stays yours — paid straight to the platforms, never marked up.',
      bullets: [
        'Media, creative & CRO on one senior team',
        'Ad spend paid straight to the platforms — never marked up',
        `${brandsServed.value} ecommerce brands worked with across India and the UAE`,
      ],
      qualifier: 'Best fit for brands ready to put at least ₹40–60 K a month into testing.',
      // "400+" is a worked-with count across services (owner to confirm it is
      // defensible on the call). The other two are true, derived from the seven
      // documented case studies (CASE_STUDY_TOTALS).
      stats: [
        { value: brandsServed.value, label: 'Ecommerce brands worked with' },
        { value: CASE_STUDY_TOTALS.roas, label: 'Average ROAS, documented ad accounts' },
        { value: CASE_STUDY_TOTALS.revenue, label: 'Tracked revenue driven' },
      ],
      formHeading: 'Book your free strategy call',
      formSub: "30 minutes. We look at your account live and tell you what we'd change first.",
      submitLabel: 'Book my call',
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
        { name: 'ad_spend', label: 'Monthly ad spend', type: 'select', required: false, options: ['Under ₹40 K', '₹40–60 K', '₹60 K–2 L', '₹2–5 L', '₹5 L+'] },
      ],
      showMessage: false,
      redirect: '/lp/performance-marketing/thanks/',
    },
    whatsapp: { number: '919606713608', text: "Hi, I'd like a free strategy call for my brand" },
    nextSteps: [
      { n: '01', text: 'We reply the same day, or the next working day, to fix a time.' },
      { n: '02', text: 'Send us read-only access before the call so we come prepared.' },
      { n: '03', text: '30 minutes, your account on screen, a clear first-30-days plan.' },
    ],
    creatives: true,
    proofStudies: ['womens-fashion-account-turnaround', 'wellness-brand-zero-to-scale', 'womenswear-breaking-the-ceiling'],
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
        { glyph: 'target', title: 'Meta & Instagram ads', body: 'Full-funnel buying across every campaign type Meta offers, run against your margin.', list: [
          'Prospecting, retargeting and retention structures',
          'Advantage+ Shopping, manual and hybrid — whichever wins your account',
          'Catalog / DPA for your full range',
          'Weekly creative refresh so fatigue never sets in',
          'Daily budget moves against break-even ROAS',
        ] },
        { glyph: 'search', title: 'Google Search, Shopping & PMax', body: 'Built around buying intent, not impression share.', list: [
          'Brand and non-brand Search',
          'Standard Shopping and Performance Max with proper feed structure',
          'YouTube and Demand Gen when the funnel needs it',
          'Negative keyword and placement hygiene, weekly',
          'Merchant Center and feed optimisation',
        ] },
        { glyph: 'spark', title: 'Ad creative, made in-house', body: 'You send raw footage; we send back ads that get tested every week.', list: [
          'UGC-style and founder-led video edits',
          'Statics, carousels and catalog overlays',
          'Hook, angle and offer variations for every winner',
          'Landing-page-matched creative',
          'A creative scorecard every week',
        ] },
        { glyph: 'funnel', title: 'Conversion rate optimisation', body: "More clicks won't fix a leaking store.", list: [
          'Product page and landing page fixes',
          'Checkout and cart drop-off analysis',
          'Offer, bundle and AOV testing',
          'Speed and mobile UX passes',
          'Tracking and pixel/CAPI setup done properly',
        ] },
      ],
    },
    // Offer is a call now, so the first phase is an "account review" on the LP
    // (the only allowed use of that phrase) — the service page keeps "Audit".
    process: perf.process.map((s) => (s.title === 'Audit' ? { ...s, title: 'Account review' } : s)),
    why: {
      eyebrow: 'Why brands switch to us',
      heading: 'The difference you feel in the P&L',
      pointers: [
        "We buy to your break-even ROAS, not the platform's flattering one",
        'Your spend goes straight to Meta and Google — we never mark it up',
        'Media, creative and CRO on one team, so nobody blames the other',
        'Winners get budget, losers get cut, every week',
        "No lock-in. Stay because it's working",
        'You talk to the people running your account, not an account manager',
      ],
    },
    founderNote: {
      quote: "Every account here is run the way I would run my own money: to your margins, not a vanity ROAS. My team and I are in the numbers every week, and if something is not working you will hear it from us straight. That is the standard we built Scaling Socials on, and it is on every account we take.",
      attribution: 'Jamal Khan, Co-founder',
      photo: '/lp/founders.jpg',
    },
    fit: {
      good: [
        'Are already selling online with steady revenue and want to reach the next level',
        'Own the decision and can move fast',
        'Can put at least ₹40–60 K a month into the testing phase',
        'Can shoot raw footage for us every month — creative is half the work',
        'Care about profit and contribution margin, not just a ROAS number',
      ],
      bad: [
        "Want a fixed ROAS promised before we've seen the account",
        "Aren't able to invest in creative yet",
        'Are still validating whether people want the product',
      ],
      note: "If that's where you are today, book the call anyway. We'll tell you what to fix first so the money works when you're ready.",
    },
    startingFrom: [
      { title: 'Running ads in-house and stuck', body: "You've hit a ceiling. Spend goes up, ROAS goes down, and nobody has time to make new creative." },
      { title: 'Running it yourself and out of time', body: "You're the founder, the media buyer and everything else. It works, but there aren't enough hours to test and scale it properly." },
      { title: 'Working with a freelancer', body: "Campaigns run, but there's no plan to scale, no creative pipeline, and no one accountable when it dips." },
      { title: 'Already with an agency, not seeing growth', body: "Reports look fine, the P&L doesn't. The team keeps changing and you're never sure who's actually on your account." },
    ],
    gettingStarted: [
      { title: 'Day 0 — Strategy call', body: 'Your account on screen, first-30-days plan agreed.' },
      { title: 'Day 1–3 — Access & review', body: 'Read-only access, tracking check, margins and break-even ROAS confirmed.' },
      { title: 'Day 4–7 — Creative & build', body: 'First batch of ads cut from your footage, campaigns structured.' },
      { title: 'Day 8–10 — Live', body: 'Testing starts. Weekly report from week one.' },
    ],
    faqs: [
      MIN_SPEND_FAQ,
      CALL_FAQ,
      { q: 'What ROAS can you promise?', a: "None, and be careful with anyone who does. A fixed ROAS promise is a guess dressed up as a number. We target your break-even ROAS, which your margins set, and scale whatever clears it. We'll show you the maths on the call." },
      { q: 'Do you make the ad creative?', a: 'Yes, we edit and produce it in-house. You supply the raw footage and product shots against a brief we give you; we cut the statics and video-led ads and run them through a structured testing pipeline. Creative is the single biggest lever in paid today, so it sits at the centre of the engagement.' },
      { q: 'How soon do we see results?', a: 'You leave the strategy call with a first-30-days plan. Real account changes need a testing cycle to read cleanly, usually 30 to 60 days, before we put weight behind what is working. We will not pour spend into unproven creative just to hand you an early number.' },
    ],
    finalBullets: [
      'Where your spend is leaking and why',
      'Your break-even ROAS, with the maths shown',
      "What we'd change in the first 30 days",
    ],
    finalCta: {
      heading: 'Find out what is leaking money',
      body: 'Book a 30-minute call. We look at your ad accounts and store with you and show you what we would change first — you leave with a plan either way.',
      ctaLabel: 'Book your free strategy call',
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
