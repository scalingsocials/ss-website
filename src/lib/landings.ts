/**
 * Ad landing-page content — the pages under /lp/ (noindex, ad traffic only).
 * See 02 §5.4 and 04 (lead capture). Rendered by LandingLayout.
 *
 * These are conversion-first pages for paid campaigns: one goal (the lead form),
 * no site nav, message-matched to the ad, heavy on proof and objection-handling.
 * Copy is sharper and more benefit-led than the indexable service pages, but every
 * number is real — proof Deltas and totals are derived from CASE_STUDIES so they
 * can never drift, and no metric is invented for services without one (§15).
 *
 * Rebuilt 2026-09-15 against the conversion teardown: outcome-led hero with the
 * CTA in the first phone screen, the problem section moved up, results that
 * expand in place (no exits), real Ads Manager screenshots, founder video
 * testimonials, a fair comparison table, and a fee section with no figure (§18).
 */
import type { Field } from '@/lib/formFields';
import type { Faq } from '@/lib/services';
import type { VideoItem } from '@/lib/videoTestimonials';
import { SERVICE_BY_SLUG } from '@/lib/services';
import { CASE_STUDY_BY_SLUG, CASE_STUDY_TOTALS } from '@/lib/caseStudies';
import { brandsServed, adSpendManaged, brandsPast10L, googleReviews, teamSize, adSpendManagedAed, brandsPast10LAed } from '@/data/proofStats';
import { convertText, RATE_NOTE } from '@/lib/money';

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

/** "What happens next" three-step strip (thank-you page). */
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

/** "Sound familiar?" — founder-voice pain quotes + the pivot into proof. */
export interface LandingProblem {
  heading: string;
  quotes: string[];
  pivot: string;
}

/** Freelancer / large agency / us decision table (ComparisonTable props). */
export interface LandingWhyTable {
  columns: string[];
  rows: string[][];
  highlightCol: number;
  caption?: string;
}

/** Market a landing page is built for. Drives the hidden CRM fields
 *  (q_region / q_currency, so the lead arrives tagged), the region parameter on
 *  the Meta Lead + Contact events and the GA4 generate_lead hit, and the AED
 *  conversion of the documented case studies. */
export interface LandingRegion {
  code: 'UAE';
  currency: 'AED';
}

export interface LandingContent {
  slug: string;
  url: string;
  source: string;
  title: string;
  description: string;
  phoneCtaLabel: string;
  /** Set for a non-India market: tags leads, converts proof figures to AED. */
  region?: LandingRegion;
  /** Hide every visible phone number (header, footer, thank-you page). The
   *  WhatsApp button becomes the only contact path (UAE LP: a +91 number is a
   *  trust leak to a Dubai founder, and there is no +971 line yet). */
  hidePhone?: boolean;
  /** Show the Ads Manager screenshot in the hero (default true). Off on the UAE
   *  LP: the screenshots are INR accounts and a ₹ column is the first "this
   *  isn't for me" moment for a Dubai founder. The proof slider further down
   *  still shows them, captioned honestly. */
  heroShot?: boolean;
  /** One factual line in the slim footer, after the legal name. */
  footerLine?: string;
  /** Label of the WhatsApp link under each form. */
  waFormLabel?: string;  /** Page CTA label (nav short + sticky + section buttons). */
  ctaLabel: string;
  ctaLabelShort: string;
  /** Sticky mobile bar label (default: ctaLabel). Keep under ~20 chars so it never wraps. */
  ctaLabelSticky?: string;
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    /** Feature bullets under the sub (web LP). The perf LP omits them so the
     *  CTA lands in the first phone screen. */
    bullets?: string[];
    /** One muted qualifier line under the CTA. */
    qualifier?: string;
    /** Micro-copy under the hero CTA ("30 minutes · no deck …"). */
    micro?: string;
    /** Proof strip / stat tiles. */
    stats?: { value: string; label: string }[];
    formHeading: string;
    formSub: string;
    submitLabel: string;
    /** Step-1 button label (default "Next"). */
    nextLabel?: string;
    questions: Field[];
  };
  trustLine: string;
  /** One-line niche list under the logo wall. */
  nicheLine?: string;
  /** Reply promise shown under both forms and on the thank-you page. */
  replyPromise?: string;
  /** LP-scoped form overrides (keeps the shared LeadForm untouched elsewhere). */
  form?: {
    step1?: Field[];
    step2?: Field[];
    showMessage?: boolean;
    redirect?: string;
  };
  /** WhatsApp secondary CTA (under forms + sticky bar). */
  whatsapp?: LandingWhatsApp;
  /** "What happens next" strip (thank-you page). */
  nextSteps?: LandingStep[];
  /** Pain section, rendered right after the trust strip. */
  problem?: LandingProblem;
  /** Case-study slugs to show as poster cards in the proof section (reuses the
   *  existing CaseStudyPoster with the full study detail). */
  proofStudies?: string[];
  proof?: LandingProof[];
  /** Lede under the results heading. */
  proofLede?: string;
  /** Caption under the Ads Manager screenshot row. */
  proofCaption?: string;
  /** One honest line under the case-study posters (e.g. the conversion rate). */
  proofNote?: string;
  showcase?: boolean;
  benefits: { eyebrow: string; heading: string; sub: string; items: LandingCard[] };
  processHeading?: string;
  process: { title: string; body: string }[];
  /** Why-us: a comparison table (perf LP), explained cards (points) or a plain pointer list. */
  why: { eyebrow: string; heading: string; table?: LandingWhyTable; points?: LandingCard[]; pointers?: string[] };
  /** Optional "strong fit / not a fit" columns after why-us. */
  fit?: LandingFit;
  /** Optional labelled sample-audit block before the final CTA. */
  sampleAudit?: LandingSampleAudit;
  /** A short founder note (photo + quote + one factual line). */
  founderNote?: { quote: string; attribution: string; line?: string; photo?: string };
  /** Show the in-house creative slider (reads /public/lp/creatives/). */
  creatives?: boolean;
  /** Founder video testimonials (perf LP). */
  videos?: { heading: string; lede?: string; items: VideoItem[] };
  /** "How the fee works" — scope lines, never a figure (CLAUDE.md §18). */
  fee?: { heading: string; lines: string[] };
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
  a: "A ₹40–60 K monthly testing budget is where we start most brands, enough for Meta and Google to learn and for us to find angles that clear your break-even ROAS before scaling. From there we run accounts all the way up to large monthly budgets, so this is a floor, not a ceiling. If you're below ₹40 K today, book the review anyway and we'll tell you what to fix on the store first so the money works when you're ready.",
};

// The offer is a free account review (owner, 2026-09-15) — one name everywhere:
// ads, hero, buttons, form, thank-you page.
const OFFER = 'free account review';
const CTA = 'Book my free account review';
const REPLY = 'No spam. We reply on WhatsApp within 2 working hours.';

/** Founder videos encoded to /public/lp/testimonials/ (540×954, mp4 + webm,
 *  each under the 1.5 MB per-video budget the perf gate enforces). A third,
 *  1:45 testimonial is held in raw-media/encoded until the owner OKs a cut or
 *  an explicit exception — it cannot fit the budget at any watchable quality. */
const VIDEOS: VideoItem[] = (
  [
    { n: 1, duration: '0:12' },
    { n: 2, duration: '0:25' },
  ] as const
).map(({ n, duration }) => ({
  mp4: `/lp/testimonials/testimonial-${n}.mp4`,
  webm: `/lp/testimonials/testimonial-${n}.webm`,
  poster: `/lp/testimonials/testimonial-${n}.webp`,
  label: 'Founder, D2C brand we run ads for',
  duration,
  width: 540,
  height: 954,
}));

export const LANDINGS: LandingContent[] = [
  {
    slug: 'performance-marketing',
    url: '/lp/performance-marketing/',
    source: 'lp-performance-marketing',
    title: 'Scale Meta & Google Ads Profitably | Scaling Socials',
    description:
      'Performance marketing for D2C brands, run to your real margins. Creative made in-house, ad spend never marked up. Book a free 30-minute account review.',
    phoneCtaLabel: 'Call us',
    ctaLabel: CTA,
    ctaLabelShort: 'Book a review',
    ctaLabelSticky: 'Book my free review',
    hero: {
      eyebrow: 'Performance marketing for D2C and Shopify brands',
      h1: 'Scale Meta & Google ads without losing your margin',
      sub: `Your spend run against your break-even ROAS, creative made in-house, and one weekly number you can take to your P&L. ${brandsServed.value} ecommerce brands, ${adSpendManaged.value} managed.`,
      micro: '30 minutes. Your account on screen. No deck, no pressure. You keep the plan.',
      qualifier: 'Best fit for brands ready to put ₹40–60 K a month into testing.',
      // All three owner-confirmed aggregates from proofStats.ts. The ₹2.77 Cr
      // documented-account total moves to the results section, next to the
      // seven accounts it describes, so it no longer argues with the brand count.
      stats: [
        { value: brandsServed.value, label: 'ecommerce brands' },
        { value: adSpendManaged.value, label: 'ad spend managed' },
        { value: brandsPast10L.value, label: 'brands past ₹10 L a month' },
      ],
      formHeading: 'Book your free account review',
      formSub: '30 minutes. Your account on screen. You keep the plan.',
      submitLabel: CTA,
      nextLabel: 'Continue to book my review',
      questions: perf.formQuestions,
    },
    trustLine: 'Trusted by D2C & ecommerce brands across India and the UAE',
    nicheLine: "Women's wear, kidswear, jewellery, maternity, crafts, beauty and home",
    replyPromise: REPLY,
    // Step 1 = three taps, no typing (qualification first: spend, platforms,
    // start date). Step 2 = who you are (name, WhatsApp, email); the brand
    // website is required so every lead can be looked up before the call, and
    // role filters agencies fishing.
    // Email is not asked on the LP: a founder on a phone gives a WhatsApp number
    // far more readily, and WhatsApp is how the follow-up happens anyway.
    form: {
      step1: [
        { name: 'ad_spend', label: 'Monthly ad spend', type: 'select', required: true, options: ['Under ₹40 K', '₹40–60 K', '₹60 K–2 L', '₹2–5 L', '₹5 L+'] },
        { name: 'platforms', label: 'Where you run ads today', type: 'select', required: true, options: ['Meta only', 'Google only', 'Meta and Google', 'Not running yet'] },
        { name: 'start', label: 'When do you want to start?', type: 'select', required: true, options: ['This month', 'In the next 30 days', 'In 2 to 3 months', 'Just exploring'] },
      ],
      step2: [
        { name: 'name', label: 'Your name', type: 'text', required: true, autocomplete: 'name' },
        { name: 'phone', label: 'WhatsApp number', type: 'tel', required: true, autocomplete: 'tel', placeholder: '50 123 4567' },
        { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' },
        { name: 'website', label: 'Brand website or Instagram', type: 'text', required: true, autocomplete: 'url', placeholder: 'yourbrand.com or @handle' },
        { name: 'role', label: 'Your role', type: 'select', required: true, options: ['Founder or owner', 'Marketing lead', 'Agency or freelancer', 'Other'] },
      ],
      showMessage: false,
      redirect: '/lp/performance-marketing/thanks/',
    },
    whatsapp: { number: '919606713608', text: `Hi, I'd like a ${OFFER} for my brand` },
    nextSteps: [
      { n: '01', text: 'We message you on WhatsApp within 2 working hours to fix a time.' },
      { n: '02', text: 'Send us read-only access before the call so we come prepared.' },
      { n: '03', text: '30 minutes, your account on screen, a clear first-30-days plan.' },
    ],
    problem: {
      heading: "Most D2C brands aren't losing on product. They're losing on ads.",
      quotes: [
        "ROAS was 4x last year. It's under 2x now and nobody can tell me why.",
        'My agency sends a PDF full of impressions. I want to know if I made money.',
        'Every time we push spend, profit disappears.',
        "Creatives die in a week and there's no one to make the next batch.",
      ],
      pivot: 'Whichever one it is, the review is the same 30 minutes. Here is what it has done for accounts like yours.',
    },
    creatives: true,
    proofStudies: ['womens-fashion-account-turnaround', 'wellness-brand-zero-to-scale', 'womenswear-breaking-the-ceiling'],
    proof: [
      proofFrom('womens-fashion-account-turnaround'),
      proofFrom('wellness-brand-zero-to-scale'),
      proofFrom('womenswear-breaking-the-ceiling'),
    ],
    proofLede: `Every figure is from the client's own Meta Ads Manager, anonymised by niche. Across the ${CASE_STUDY_TOTALS.accounts} accounts we document: ${CASE_STUDY_TOTALS.revenue} revenue on ${CASE_STUDY_TOTALS.spend} spend, ${CASE_STUDY_TOTALS.roas} average.`,
    proofCaption: 'Live Meta Ads Manager views from four client accounts, account names hidden. Tap to enlarge.',
    benefits: {
      eyebrow: 'What you get',
      heading: 'Media, creative and the store, under one roof',
      sub: 'Everything that moves a paid account, run by senior people against your P&L.',
      items: [
        { glyph: 'target', title: 'Meta & Instagram ads', body: 'Full-funnel buying, run against your margin.', list: [
          'Prospecting, retargeting and retention, structured to your margin',
          'Advantage+, manual or hybrid, whichever wins your account',
          'Budget moved daily against break-even ROAS',
        ] },
        { glyph: 'search', title: 'Google Search, Shopping & PMax', body: 'Built around buying intent, not impression share.', list: [
          'Brand and non-brand Search built on buying intent',
          'Shopping and Performance Max with a clean feed',
          'Negatives and placements cleaned weekly',
        ] },
        { glyph: 'spark', title: 'Ad creative, made in-house', body: 'You send raw footage; we send back ads that get tested every week.', list: [
          'UGC-style and founder-led edits from your footage',
          'Hook, angle and offer variations for every winner',
          'A creative scorecard every week',
        ] },
        { glyph: 'funnel', title: 'Store & tracking', body: "More clicks won't fix a leaking store.", list: [
          'Product page, cart and checkout fixes',
          'Pixel and CAPI set up properly',
          'A weekly report you can read in two minutes',
        ] },
      ],
    },
    processHeading: 'What working with us actually looks like',
    // One dated timeline (the old "how it works" + "10 days" strips, merged).
    process: [
      { title: 'Review, day 0', body: 'Your account on screen, your break-even ROAS with the maths shown, and a first-30-days plan. Yours whether you sign or not.' },
      { title: 'Set up, days 1 to 3', body: 'Read-only access, tracking and CAPI check, margins confirmed, a brief for your first footage.' },
      { title: 'Build, days 4 to 10', body: 'First creative batch cut, campaigns structured, live by day 10. Weekly report from week one.' },
      { title: 'Test, days 10 to 60', body: 'Angles and audiences tested against your real margin. You hear what is losing before you ask.' },
      { title: 'Scale, month 2 on', body: 'Winners get budget, losers get cut, Google added when Meta demand needs capturing.' },
    ],
    why: {
      eyebrow: 'The decision you are actually making',
      heading: 'Freelancer, big agency, or us',
      table: {
        columns: ['', 'Freelancer', 'Large agency', 'Scaling Socials'],
        highlightCol: 3,
        caption: 'Kept fair on purpose. A freelancer is the right call under ₹40 K a month; a large agency is the right call for brand campaigns in crores.',
        rows: [
          ['Who runs the account', 'One person, when available', 'An account manager relays to a junior buyer', 'The senior buyer you meet on the review call'],
          ['Creative', 'Usually yours to supply finished', 'Separate studio, separate invoice', 'Cut in-house from your raw footage, weekly'],
          ['Reporting', 'Ad hoc', 'Monthly deck', 'Weekly number against your break-even ROAS'],
          ['Ad spend', 'Paid direct', 'Often marked up or bundled', 'Paid direct to Meta and Google, never marked up'],
          ['Contract', 'None', '6 to 12 month lock-in', 'No lock-in, month to month'],
          ['Store and CRO', 'Not usually', 'Separate team', 'Same team fixes the product page'],
          ['Best when', 'Spend under ₹40 K a month', 'Spend in crores, brand campaigns', '₹40 K to ₹50 L a month and margin matters'],
        ],
      },
    },
    founderNote: {
      quote: "Every account here is run the way I would run my own money: to your margins, not a vanity ROAS. My team and I are in the numbers every week, and if something is not working you will hear it from us straight. That is the standard we built Scaling Socials on, and it is on every account we take.",
      attribution: 'Jamal Khan, Co-founder',
      line: `A ${teamSize.value} ${teamSize.label}, on your account every week.`,
      photo: '/lp/founders.jpg',
    },
    fit: {
      good: [
        'Already sell online with steady revenue and want the next level',
        'Can put ₹40–60 K a month into the testing phase',
        'Can shoot raw footage for us every month',
        'Care about contribution margin, not just a ROAS number',
        'Own the decision and can move in days',
      ],
      bad: [
        'Are spending under ₹40 K a month on ads',
        "Want a fixed ROAS promised before we've seen the account",
        'Are still validating whether people want the product',
        'Are choosing on the lowest fee',
      ],
      note: "If that's you today, book the review anyway. We'll tell you what to fix first so the money works when you're ready.",
    },
    videos: {
      heading: 'What founders say after 90 days',
      lede: `Clients in their own words. Plus ${googleReviews.value} five-star ${googleReviews.label}.`,
      items: VIDEOS,
    },
    fee: {
      heading: 'How the fee works',
      lines: [
        'Scoped to your ad spend and creative volume, quoted on the review call',
        'Ad spend is paid by you, direct to Meta and Google, never marked up',
        'No lock-in. Month to month; stay because it is working',
        'Minimum recommended testing budget: ₹40–60 K a month in ad spend',
      ],
    },
    faqs: [
      { q: 'Is there a lock-in contract?', a: "No. Month to month from day one. The first 60 to 90 days is a testing cycle and we'll ask you to judge us on that, but nothing binds you to it. Brands stay because the weekly number is going the right way, not because a contract says so." },
      { q: 'Who actually runs my account?', a: 'The senior buyer you meet on the review call. No account manager relaying messages to a junior. Media, creative and store fixes sit on the same small team, so nobody blames the other.' },
      { q: 'What does the weekly report look like, and will I understand it?', a: "One page: spend, revenue, blended and platform ROAS against your break-even, what we changed and why, and what we're testing next. Numbers you can take straight to your P&L, not a deck of impressions." },
      MIN_SPEND_FAQ,
      { q: 'Do you make the ad creative, or do I?', a: 'We edit and produce it in-house. You supply the raw footage and product shots against a brief we give you; we cut the statics and video-led ads and run them through a structured testing pipeline. Creative is the single biggest lever in paid today, so it sits at the centre of the engagement.' },
      { q: 'How soon will I see results?', a: 'You leave the review with a first-30-days plan. Real account changes need a testing cycle to read cleanly, usually 30 to 60 days, before we put weight behind what is working. We will not pour spend into unproven creative just to hand you an early number.' },
      { q: 'Do you work with Dubai and GCC brands?', a: 'Yes. We run Meta and Google for brands selling in the UAE and the wider GCC, from our team in Bangalore. Same review, same weekly reporting, budgets and reporting in AED where you need it.' },
      { q: 'My ad account is restricted or has a bad history. Can you still help?', a: 'Usually. We start by reading the account history and the reasons behind the restriction, fix the policy or tracking problems that caused it, and appeal with a clean setup. If the account cannot be recovered we tell you on the review and plan a fresh structure instead.' },
    ],
    finalBullets: [
      'Where your spend is leaking and why',
      'Your break-even ROAS, with the maths shown',
      "What we'd change in the first 30 days",
    ],
    finalCta: {
      heading: "Find out what's leaking in your ad account",
      body: 'Free 30-minute review. You leave with your break-even ROAS, the three biggest fixes and a first-30-days plan. No pitch deck.',
      ctaLabel: 'Book your free account review',
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

// ── UAE performance LP ───────────────────────────────────────────────────────
// /lp/performance-marketing-uae/ — the India perf LP, same sections in the same
// order, with the owner's UAE swaps (brief, 5 Nov 2026): no phone number
// anywhere (WhatsApp is the only contact path), AED throughout at AED 1 = ₹25.7,
// COD returns and VAT in the ROAS maths, Dubai-agency comparison, Bangalore
// framed as 1.5 hours ahead of Dubai. Separate URL, no geo-redirect; NOINDEX
// like every /lp/ page, so it never competes with the India page in search.
//
// Deliberately NOT on the page until the owner confirms (CLAUDE.md §15/§18):
//   - any agency fee figure (the brief's "AED 10–20K+ retainer" row and the
//     "AED 15K a month" quote) — §18 bars fee figures anywhere on the site;
//   - Tabby/Tamara checkout events, Arabic edits, VAT handling, payment methods,
//     and "UAE accounts since [year]" — unconfirmed claims;
//   - a UAE case study or testimonial — none exists yet, so the India accounts
//     show converted, and labelled as India accounts.
const PERF_IN = LANDINGS.find((l) => l.slug === 'performance-marketing')!;
const UAE_MIN = 'AED 10K';
const UAE_REPLY = 'No spam. We reply on WhatsApp within 2 working hours, Mon–Fri, 9am–7pm Dubai time.';
const UAE_SPEND_FAQ: Faq = {
  q: 'What monthly ad spend do you work with?',
  a: `${UAE_MIN} a month in ad spend is where we start most UAE brands: enough for Meta and Google to learn and for us to find angles that clear your break-even ROAS before scaling. It is a floor, not a ceiling; we run accounts well beyond it. If you are below ${UAE_MIN} today, book the review anyway and we will tell you what to fix on the store first, so the money works when you are ready.`,
};
const faqIn = (key: string): Faq => {
  const f = PERF_IN.faqs.find((x) => x.q.toLowerCase().includes(key.toLowerCase()));
  if (!f) throw new Error(`landings: India LP has no FAQ matching "${key}"`);
  return f;
};

LANDINGS.push({
  ...PERF_IN,
  slug: 'performance-marketing-uae',
  url: '/lp/performance-marketing-uae/',
  source: 'lp-performance-marketing-uae',
  // Brief asked for "Scale Meta & Google Ads Profitably in the UAE | Scaling Socials"
  // (63 chars); the SEO gate caps titles at 60 (03 §2).
  title: 'Profitable Meta & Google Ads in the UAE | Scaling Socials',
  description:
    'Meta and Google ads for UAE D2C brands, run to break-even ROAS with COD returns and VAT in the maths. Quoted in AED. Book a free 30-minute account review.',
  region: { code: 'UAE', currency: 'AED' },
  hidePhone: true,
  heroShot: false,
  footerLine: 'Bangalore, India. Serving UAE and GCC brands.',
  waFormLabel: 'Prefer WhatsApp? Start a chat',
  hero: {
    ...PERF_IN.hero,
    eyebrow: 'Performance marketing for D2C & Shopify brands in the UAE',
    // A/B variant to test: "Scale Meta & Google ads in the UAE without losing your margin"
    h1: 'Scale Meta & Google ads without losing your margin',
    sub: `Your spend run against your break-even ROAS, with COD returns and VAT in the maths, creative made in-house, and one weekly number you can take to your P&L. ${brandsServed.value} ecommerce brands, ${adSpendManagedAed.value} in ad spend managed.`,
    qualifier: `Best fit for brands ready to put ${UAE_MIN}+ a month into testing.`,
    stats: [
      { value: brandsServed.value, label: 'ecommerce brands across India and the GCC' },
      { value: adSpendManagedAed.value, label: adSpendManagedAed.label },
      { value: brandsPast10LAed.value, label: brandsPast10LAed.label },
    ],
  },
  trustLine: 'Trusted by D2C & ecommerce brands across the UAE, GCC and India',
  nicheLine: 'Modest wear, abayas, fragrance, jewellery, beauty, kidswear and home',
  replyPromise: UAE_REPLY,
  form: {
    ...PERF_IN.form,
    step1: [
      { name: 'ad_spend', label: 'Monthly ad spend (AED)', type: 'select', required: true, options: ['Under AED 10K', 'AED 10K – AED 20K', 'AED 20K – AED 50K', 'AED 50K – AED 100K', 'AED 100K+'] },
      { name: 'platforms', label: 'Where you run ads today', type: 'select', required: true, options: ['Meta only', 'Google only', 'Meta and Google', 'TikTok / Snap as well', 'Not running yet'] },
      { name: 'start', label: 'When do you want to start?', type: 'select', required: true, options: ['This month', 'In the next 30 days', 'In 2 to 3 months', 'Just exploring'] },
    ],
    step2: (PERF_IN.form?.step2 ?? []).map((f) =>
      f.type === 'tel' ? { ...f, placeholder: '50 123 4567', pinned: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IN'] } : f,
    ),
    redirect: '/lp/performance-marketing-uae/thanks/',
  },
  // The +91 number is only seen inside the chat, once they have decided to
  // talk. Swap to a +971 line here later without touching the page. The
  // trailing tag tells the BDE which page the chat came from.
  whatsapp: { number: '919606713608', text: 'Hi, I run a D2C brand in the UAE and want a free account review [UAE-LP]' },
  nextSteps: [
    { n: '01', text: 'We message you on WhatsApp within 2 working hours (Mon–Fri, 9am–7pm Dubai time) to fix a time.' },
    { n: '02', text: 'Send us read-only access before the call so we come prepared.' },
    { n: '03', text: '30 minutes in Dubai working hours, your account on screen, a clear first-30-days plan.' },
  ],
  problem: {
    ...PERF_IN.problem!,
    quotes: [
      "ROAS was 4x last year. It's under 2x now and nobody can tell me why.",
      'My agency sends a PDF full of impressions. I want to know if I made money.',
      'ROAS looks fine on the dashboard, then 30% of orders come back as COD returns.',
      "The Dubai agency wanted a monthly retainer signed before they'd even look at the account.",
    ],
  },
  proofLede: `Every figure is from the client's own Meta Ads Manager, anonymised by niche. Across the ${CASE_STUDY_TOTALS.accounts} accounts we document: ${convertText(CASE_STUDY_TOTALS.revenue)} revenue on ${convertText(CASE_STUDY_TOTALS.spend)} spend, ${CASE_STUDY_TOTALS.roas} average.`,
  proofNote: `India accounts, anonymised by niche. ${RATE_NOTE}`,
  proofCaption: 'Live Meta Ads Manager views from four India client accounts, shown in ₹ as recorded, account names hidden. Tap to enlarge.',
  benefits: {
    ...PERF_IN.benefits,
    items: PERF_IN.benefits.items.map((it) => {
      if (it.title === 'Meta & Instagram ads') {
        return { ...it, list: (it.list ?? []).map((li) => (li === 'Budget moved daily against break-even ROAS' ? 'Budget moved daily against break-even ROAS, net of returns and VAT' : li)) };
      }
      if (it.title === 'Store & tracking') {
        return { ...it, list: ['Product page, cart and checkout fixes', 'COD vs prepaid split tracked separately, so ROAS reflects what you actually keep', 'Pixel and CAPI set up properly', 'A weekly report you can read in two minutes'] };
      }
      return it;
    }),
  },
  process: PERF_IN.process.map((p, i) =>
    i === 0 ? { ...p, body: 'On a call in Dubai hours: your account on screen, your break-even ROAS with the maths shown, COD returns and VAT included, and a first-30-days plan. Yours whether you sign or not.' } : p,
  ),
  why: {
    ...PERF_IN.why,
    heading: 'Freelancer, Dubai agency, or us',
    table: {
      columns: ['', 'Freelancer', 'Dubai agency', 'Scaling Socials'],
      highlightCol: 3,
      caption: `Kept fair on purpose. A freelancer is the right call under ${UAE_MIN} a month; a large Dubai agency is the right call for brand campaigns in the millions.`,
      rows: [
        ['Who runs the account', 'One person, when available', 'An account manager relays to a junior buyer', 'The senior buyer you meet on the review call'],
        ['Creative', 'Yours to supply finished', 'Separate studio, separate invoice', 'Cut in-house from your raw footage, weekly'],
        ['Reporting', 'Ad hoc', 'Monthly deck', 'Weekly number against your break-even ROAS, net of COD returns'],
        ['Ad spend', 'Paid direct', 'Often marked up or bundled', 'Paid direct to Meta and Google, never marked up'],
        ['Contract', 'None', '6 to 12 month lock-in', 'No lock-in, month to month'],
        ['Store and CRO', 'Not usually', 'Separate team', 'Same team fixes the product page'],
        // No fee figures in any column (CLAUDE.md §18), including competitors'.
        ['Fee', 'Usually the lowest', 'A fixed monthly retainer, set before anyone opens the account', 'Scoped to your spend, quoted in AED on the review call'],
        ['Best when', `Spend under ${UAE_MIN} a month`, 'Spend in the millions, brand campaigns', `${UAE_MIN} to AED 500K a month and margin matters`],
      ],
    },
  },
  founderNote: {
    ...PERF_IN.founderNote!,
    line: `A ${teamSize.value} ${teamSize.label}, 1.5 hours ahead of Dubai, on your account every week.`,
  },
  fit: {
    good: [
      'Already sell online in the UAE or GCC with steady revenue',
      `Can put ${UAE_MIN}+ a month into the testing phase`,
      'Can shoot raw footage for us every month',
      'Care about contribution margin after COD returns, not just a ROAS number',
      'Own the decision and can move in days',
    ],
    bad: [
      `Are spending under ${UAE_MIN} a month on ads`,
      "Want a fixed ROAS promised before we've seen the account",
      'Are still validating whether people want the product',
      'Are choosing on the lowest fee',
    ],
    note: PERF_IN.fit?.note,
  },
  fee: {
    heading: 'How the fee works',
    lines: [
      'Scoped to your ad spend and creative volume, quoted in AED on the review call',
      'Ad spend is paid by you, direct to Meta and Google, never marked up',
      'No lock-in. Month to month',
      `Minimum recommended testing budget: ${UAE_MIN} a month in ad spend`,
      'Invoiced in AED',
    ],
  },
  faqs: [
    faqIn('lock-in'),
    faqIn('who actually runs'),
    {
      q: 'What does the weekly report look like, and will I understand it?',
      a: "One page: spend, revenue, blended and platform ROAS against your break-even, net of COD returns, what we changed and why, and what we're testing next. Numbers you can take straight to your P&L, not a deck of impressions.",
    },
    UAE_SPEND_FAQ,
    {
      q: 'Do you have a team in Dubai?',
      a: 'No. Our buyers and creative team are in Bangalore, 1.5 hours ahead of Dubai. Calls happen in your working hours, Monday to Friday, and WhatsApp replies come within 2 working hours. The senior buyer you meet on the review call is the one who runs your account.',
    },
    {
      q: 'How do you handle COD returns in the ROAS maths?',
      a: 'We track COD and prepaid orders separately and set your break-even ROAS on delivered revenue, not ordered revenue, with your return rate, delivery cost and 5% VAT in the calculation. If a third of COD orders come back, the target moves to cover it, so a good-looking dashboard cannot hide a losing month.',
    },
    {
      q: 'Do you run TikTok or Snapchat ads?',
      a: "Meta and Google only. If TikTok or Snapchat is a big channel for you, we'll say so on the review call and you should factor that in.",
    },
    {
      q: 'Do you also work with KSA and the wider GCC?',
      a: 'Yes. We run Meta and Google for brands selling across the UAE and the wider GCC, from the same team, with the same review and the same weekly report.',
    },
    faqIn('creative'),
    faqIn('how soon'),
    {
      q: 'How do I pay?',
      a: 'We quote and invoice in AED. Your ad spend is billed by Meta and Google directly to you, never through us, so it is never marked up.',
    },
    faqIn('restricted'),
  ],
  finalBullets: [
    'Where your spend is leaking and why',
    'Your break-even ROAS, with the maths shown, including COD return rate, delivery cost and 5% VAT',
    "What we'd change in the first 30 days",
  ],
  finalCta: {
    ...PERF_IN.finalCta,
    body: 'Free 30-minute review. You leave with your break-even ROAS, net of COD returns, the three biggest fixes and a first-30-days plan. No pitch deck.',
  },
});

export const LANDING_BY_SLUG: Record<string, LandingContent> = Object.fromEntries(
  LANDINGS.map((l) => [l.slug, l]),
);
