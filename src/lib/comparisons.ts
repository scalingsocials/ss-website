/**
 * /vs/ comparison pages — high-intent, genuinely useful comparisons (C-vs).
 * Balanced and honest: each says plainly when the OTHER option wins, then where
 * Scaling Socials fits. Not doorway/thin content (§15) — real decision guidance.
 */
import type { Faq } from '@/lib/services';
import type { RichText } from './richtext';

export interface VsContent {
  slug: string;
  url: string;
  name: string;        // hub label, e.g. 'Agency vs freelancer'
  title: string;       // 50–60 chars
  description: string; // 140–158 chars
  eyebrow: string;
  h1: string;
  answer: string;      // 40–60 words, names Scaling Socials (§13)
  blurb: string;
  table: { cols: string[]; rows: string[][]; highlightCol: number; caption?: string };
  whenA: { heading: string; points: string[] };
  whenB: { heading: string; points: string[] };
  fit: RichText[];     // where Scaling Socials fits (paragraphs)
  faqs: Faq[];
  relatedServices?: string[];
}

export const COMPARISONS: VsContent[] = [
  {
    slug: 'agency-vs-freelancer',
    url: '/vs/agency-vs-freelancer/',
    name: 'Agency vs freelancer',
    title: 'Agency vs Freelancer for D2C Brands | Scaling Socials',
    description:
      'Agency or freelance media buyer for your D2C brand? An honest comparison of cost, creative, reliability and scale — and when each one is the right call.',
    eyebrow: 'Comparison',
    h1: 'Marketing agency vs freelancer: which does your brand need?',
    answer:
      'For a D2C brand, a freelancer is cheaper and fine for a single lever; an agency like Scaling Socials brings media, creative and CRO on one team with cover when someone is away. The honest rule: a freelancer suits a small, stable account, an agency suits a brand that needs creative volume and to scale reliably.',
    blurb: 'Cost and simplicity vs a full team and reliable scale.',
    table: {
      cols: ['', 'Freelancer', 'Agency (how we run it)'],
      rows: [
        ['Cost', 'Lower monthly fee', 'Higher, but media + creative + CRO in one'],
        ['Creative', 'Usually you supply it', 'Produced and tested in-house weekly'],
        ['Cover', 'One person — gaps when away', 'A team; the account is never unattended'],
        ['Scale', 'Fine on a small account', 'Built to scale spend against a floor'],
        ['Range', 'One skill, one platform', 'Media, creative, CRO and store together'],
      ],
      highlightCol: 2,
      caption: 'Neither is “better” — they fit different stages. Match the choice to your account, not the fee.',
    },
    whenA: {
      heading: 'When a freelancer is the right call',
      points: [
        'Your account is small and stable, and you mainly need one platform managed',
        'You already produce your own creative and just need a competent buyer',
        'Budget is genuinely tight and you can live with single-person cover',
        'The work is a one-off or short project, not ongoing scale',
      ],
    },
    whenB: {
      heading: 'When an agency earns its fee',
      points: [
        'Creative is your growth lever and you need volume produced and tested',
        'You want media, CRO and the store working off one number, not finger-pointing',
        'You need the account covered every day, not paused when one person is away',
        'You intend to scale spend and want a team that sets a floor before it does',
      ],
    },
    fit: [
      'Scaling Socials is run by its four founders, not a junior on a template, with senior people across media, creative and CRO on every account. That range is the whole point: on paid social today the creative is the lever, so an agency that produces and tests it in-house has an advantage a lone buyer relying on your footage rarely matches.',
      'We are also honest about the boundary. If your account is small and stable and you already make your own creative, a good freelancer will serve you well and cost less — and we will tell you so in the free audit rather than sell you a retainer you do not need yet.',
    ],
    faqs: [
      { q: 'Is an agency worth the extra cost over a freelancer?', a: 'It depends on your stage. If you need creative produced and tested, want cover every day, and intend to scale, the range an agency brings usually pays for itself. If you have a small, stable account and make your own creative, a freelancer is the cheaper, sensible choice.' },
      { q: 'Can I start with a freelancer and move to an agency later?', a: 'Yes, and many brands do. The trigger is usually creative volume and scale — the point where one person can no longer produce, test and buy fast enough. Our free audit will tell you honestly whether you are at that point yet.' },
    ],
    relatedServices: ['performance-marketing', 'conversion-rate-optimisation'],
  },
  {
    slug: 'in-house-vs-agency',
    url: '/vs/in-house-vs-agency/',
    name: 'In-house vs agency',
    title: 'In-House Team vs Agency for Marketing | Scaling Socials',
    description:
      'Build an in-house marketing team or hire an agency? An honest comparison of cost, hiring risk, creative capacity and control for growing D2C brands.',
    eyebrow: 'Comparison',
    h1: 'In-house marketing team vs an agency',
    answer:
      'Building in-house gives you control and focus but means hiring, managing and covering several specialists before you know the roles are right. An agency like Scaling Socials gives you that full team immediately, with no hiring risk. Most brands run an agency until the volume justifies the fixed cost of hiring in-house.',
    blurb: 'Control and focus vs a full team now, with no hiring risk.',
    table: {
      cols: ['', 'In-house team', 'Agency (how we run it)'],
      rows: [
        ['Time to running', 'Months to hire and ramp', 'Days — the team already exists'],
        ['Cost shape', 'Fixed salaries + tools + management', 'One scoped fee, scaled to the work'],
        ['Hiring risk', 'On you — wrong hires are costly', 'None — you hire an assembled team'],
        ['Breadth', 'Only the roles you can afford to fill', 'Media, creative, CRO and dev together'],
        ['Cross-account learning', 'Only your own account', 'Patterns seen across many accounts'],
      ],
      highlightCol: 2,
      caption: 'The real question is fixed cost vs flexibility at your current stage — not which is “better”.',
    },
    whenA: {
      heading: 'When in-house makes sense',
      points: [
        'Spend and volume are high enough to keep several specialists fully busy',
        'You want the knowledge and IP to live permanently inside the company',
        'Brand and product context are deep enough that daily proximity matters',
        'You can hire, manage and retain marketing specialists well',
      ],
    },
    whenB: {
      heading: 'When an agency makes sense',
      points: [
        'You need a full team now and cannot wait months to hire and ramp',
        'You want to avoid the cost and risk of wrong specialist hires',
        'Your creative and testing needs swing with seasons and launches',
        'You value patterns learned across many accounts, not just your own',
      ],
    },
    fit: [
      'Scaling Socials functions as your outsourced growth team: media, creative, CRO and development under one roof, available from day one with no recruitment. Because we run many D2C accounts, we bring patterns a single in-house team never sees — what a soft month looks like, when to scale, when to pull back.',
      'We also do not pretend in-house is always wrong. Past a certain spend, a dedicated internal team can be the right permanent move, and several strong brands run a hybrid — an in-house lead with us on media and creative. We will give you the honest read for your stage in the free audit.',
    ],
    faqs: [
      { q: 'Is an agency cheaper than hiring in-house?', a: 'Usually, until you are large enough to keep several specialists fully busy. An agency is one scoped fee for a whole team versus multiple fixed salaries plus tools and management. Past a high spend threshold, in-house can become the more efficient option.' },
      { q: 'Can we run an in-house lead alongside an agency?', a: 'Yes — it is a common and effective setup. An in-house marketing lead who owns strategy and brand context, with us providing the media, creative and CRO horsepower, gives you control without carrying the full fixed cost of every specialist.' },
    ],
    relatedServices: ['performance-marketing', 'social-media-marketing', 'conversion-rate-optimisation'],
  },
  {
    slug: 'shopify-vs-woocommerce',
    url: '/vs/shopify-vs-woocommerce/',
    name: 'Shopify vs WooCommerce',
    title: 'Shopify vs WooCommerce for D2C Stores | Scaling Socials',
    description:
      'Shopify or WooCommerce for your ecommerce store? An honest comparison of speed, maintenance, cost and control — and which suits a growing D2C brand.',
    eyebrow: 'Comparison',
    h1: 'Shopify vs WooCommerce: which should your store run on?',
    answer:
      'Shopify is hosted, fast to launch and low-maintenance; WooCommerce is open, endlessly customisable and cheaper in licence terms but needs hosting, security and upkeep. For most D2C brands Scaling Socials recommends Shopify for speed and reliability — WooCommerce when you need deep custom control and have the team to maintain it.',
    blurb: 'Hosted speed and simplicity vs open, custom control.',
    table: {
      cols: ['', 'WooCommerce', 'Shopify (what we usually build)'],
      rows: [
        ['Setup', 'Self-hosted; you manage the stack', 'Hosted; live faster, less to break'],
        ['Maintenance', 'Updates, security, backups on you', 'Handled by the platform'],
        ['Speed', 'Depends entirely on your hosting', 'Fast baseline, tunable for Core Web Vitals'],
        ['Customisation', 'Effectively unlimited (with a dev)', 'High, within a stable framework'],
        ['Total cost', 'Lower licence, higher upkeep', 'Platform fee, far lower upkeep'],
      ],
      highlightCol: 2,
      caption: 'Speed and low maintenance vs maximum control. Pick for the team you actually have.',
    },
    whenA: {
      heading: 'When WooCommerce fits',
      points: [
        'You need deep custom functionality WordPress plugins already provide',
        'You have (or will keep) a developer to maintain hosting and security',
        'Your content and store are tightly integrated in one WordPress install',
        'Licence cost matters more than time spent on upkeep',
      ],
    },
    whenB: {
      heading: 'When Shopify fits',
      points: [
        'You want to launch quickly and not manage servers or security',
        'Speed and reliability directly affect your paid conversion rate',
        'You would rather spend on growth than on store maintenance',
        'You want clean, well-supported tracking and app integrations',
      ],
    },
    fit: [
      'Scaling Socials builds and migrates stores on both, and we give an honest recommendation rather than a default. For most D2C brands we build on Shopify: a store’s job is to turn expensive traffic into orders, and Shopify’s speed baseline and low maintenance protect both conversion and your team’s time. We migrate from WooCommerce, Wix or Magento without losing SEO, URLs or order history.',
      ['Where a brand genuinely needs custom backend logic beyond what Shopify does, we will say so — and either build it properly or point you to the ', { text: 'web-and-app route', href: '/web-development-company-bangalore/' }, '. We build for revenue per session, not for whichever platform is easiest to sell.'],
    ],
    faqs: [
      { q: 'Should I migrate from WooCommerce to Shopify?', a: 'If upkeep, speed or security are costing you conversion or team time, usually yes. We migrate while preserving URLs and SEO with a proper 301 map, plus product data and order history — losing rankings in a migration is avoidable if it is planned before anything moves.' },
      { q: 'Is Shopify faster than WooCommerce?', a: 'Shopify has a fast, reliable baseline out of the box, while WooCommerce speed depends entirely on your hosting and configuration. Either can be made fast, but Shopify gets you there with far less ongoing work — and speed feeds conversion and lowers ad cost.' },
    ],
    relatedServices: ['shopify-development', 'web-development', 'conversion-rate-optimisation'],
  },
  {
    slug: 'advantage-plus-vs-manual',
    url: '/vs/advantage-plus-vs-manual/',
    name: 'Advantage+ vs manual',
    title: 'Meta Advantage+ vs Manual Campaigns | Scaling Socials',
    description:
      'Meta Advantage+ or manual campaign structure? An honest comparison of control, creative demand and risk — and how Scaling Socials decides per account.',
    eyebrow: 'Comparison',
    h1: 'Meta Advantage+ vs manual campaigns',
    answer:
      'Advantage+ automates targeting and budget and scales simple catalogues well; manual campaigns give control for tight targeting and complex funnels. Scaling Socials does not pick a side — we reach for Advantage+ where it genuinely beats manual and go manual where the control pays for itself, and both demand strong, frequently tested creative.',
    blurb: 'Automation and reach vs control — decided per account.',
    table: {
      cols: ['', 'Advantage+ only', 'Manual only', 'How we run it'],
      rows: [
        ['Best for', 'Simple catalogues, broad appeal', 'Tight targeting, complex funnels', 'Both, by account'],
        ['Creative demand', 'High', 'Moderate', 'High — it is the lever'],
        ['Control', 'Low', 'High', 'As much as the data earns'],
        ['Risk', 'Overspend on weak creative', 'Slow to scale', 'Tested against break-even'],
      ],
      highlightCol: 3,
      caption: 'The winning setup is usually a mix, chosen from your catalogue, funnel and margins — not a fixed template.',
    },
    whenA: {
      heading: 'When Advantage+ wins',
      points: [
        'A broad-appeal catalogue where Meta’s signal beats manual segments',
        'You can feed it a steady stream of strong, varied creative',
        'You want to capture demand at scale without micro-managing audiences',
        'Prospecting where broad targeting genuinely outperforms',
      ],
    },
    whenB: {
      heading: 'When manual wins',
      points: [
        'Tight targeting or exclusions the automation cannot respect',
        'Complex, multi-step funnels that need deliberate structure',
        'Retargeting and audiences you want precise control over',
        'Accounts where control demonstrably pays for itself',
      ],
    },
    fit: [
      'Scaling Socials treats this as a per-account decision, not a belief. We reach for Advantage+ where it genuinely beats a manual structure and go manual where the control earns its keep — and we let spend, measured against your break-even ROAS, decide, not opinions in the room.',
      'What does not change either way is the creative. On Meta today the creative is the single biggest lever, so whichever structure runs, we produce video-led ads and statics in-house and run them through a weekly testing pipeline. Automation with weak creative just overspends faster.',
    ],
    faqs: [
      { q: 'Is Advantage+ better than manual campaigns?', a: 'Neither is universally better. Advantage+ tends to win on broad-appeal catalogues fed with strong creative; manual wins where tight targeting or complex funnels need control. We run both and let performance against your margin decide the mix.' },
      { q: 'Does Advantage+ mean I need less creative?', a: 'No — usually more. Automation scales whatever you give it, so weak creative just loses money faster. Both approaches depend on a steady flow of tested creative, which is exactly why we produce and test it in-house every week.' },
    ],
    relatedServices: ['performance-marketing'],
  },
  {
    slug: 'seo-vs-performance-marketing',
    url: '/vs/seo-vs-performance-marketing/',
    name: 'SEO vs performance marketing',
    title: 'SEO vs Performance Marketing for D2C | Scaling Socials',
    description:
      'SEO or performance marketing for your D2C brand? An honest comparison of speed, cost, durability and risk — and why most brands should run both.',
    eyebrow: 'Comparison',
    h1: 'SEO vs performance marketing: where should you invest?',
    answer:
      'Performance marketing buys demand today and shows results in weeks; SEO compounds demand for tomorrow over quarters. They are not rivals — Scaling Socials runs both on one team, because paid funds growth now while SEO lowers your reliance on ad spend later, and the data from each sharpens the other.',
    blurb: 'Fast paid demand vs compounding organic — usually both.',
    table: {
      cols: ['', 'SEO', 'Performance marketing'],
      rows: [
        ['Time to results', 'Quarters (compounds)', 'Weeks (once creative is tested)'],
        ['Cost pattern', 'Front-loaded, compounds', 'Ongoing spend, stops when you stop'],
        ['Durability', 'Survives if you pause spend', 'Traffic ends when budget ends'],
        ['Best for', 'Existing demand, long game', 'Demand now, launches, scale'],
        ['Main risk', 'Algorithm updates, patience', 'Rising CAC, creative fatigue'],
      ],
      highlightCol: 0,
      caption: 'Different jobs on different timelines. For most brands the answer is not either/or.',
    },
    whenA: {
      heading: 'When to lead with SEO',
      points: [
        'You have product-market fit and can wait a couple of quarters',
        'There is real search demand in your category to capture',
        'You want to reduce long-term dependence on paid spend',
        'You would rather build an asset than rent traffic',
      ],
    },
    whenB: {
      heading: 'When to lead with performance',
      points: [
        'You need revenue this month, not next quarter',
        'You are launching and need demand you cannot wait for',
        'You have creative and margin to scale profitably now',
        'You want fast, testable feedback on offers and audiences',
      ],
    },
    fit: [
      'Scaling Socials runs both, on one team and one number, so they are not quietly working against each other. Paid buys demand today while SEO compounds for tomorrow — and each sharpens the other: the queries that convert in paid tell us what to rank for, and organic landing pages give paid somewhere better to send traffic.',
      'If you have to start with one, we will say which from your situation, not our preference. Need sales now? Start with performance. Sitting on real search demand with room to wait? Start building SEO. Most brands with product-market fit should be running both before long.',
    ],
    faqs: [
      { q: 'Should I do SEO or paid ads first?', a: 'If you need revenue this month, start with performance marketing — it works in weeks. If you have product-market fit and can wait a couple of quarters, SEO builds a compounding asset. Most brands end up running both; we will tell you where to start.' },
      { q: 'Can SEO and performance marketing work together?', a: 'Yes, and they are stronger together. Paid reveals which queries and offers convert, which sharpens SEO targeting; SEO builds landing pages and authority that make paid traffic convert better. We keep both on one team so the data flows between them.' },
    ],
    relatedServices: ['seo', 'performance-marketing'],
  },
];

export const COMPARISON_BY_SLUG: Record<string, VsContent> = Object.fromEntries(
  COMPARISONS.map((c) => [c.slug, c]),
);
