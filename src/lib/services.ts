/**
 * Service pillar content — the six pages under ServiceLayout. See 02 §5.1.
 *
 * Real, owner-aligned copy. No pricing is published on the site (owner directive,
 * 2026-09-07): every service is scoped to the brief and no fee figures appear
 * anywhere. Meta titles are 50–60 chars and descriptions 140–158 (build gate, 03 §0).
 *
 * `process` and `goodFit` are per-service so the "How an engagement runs" and
 * "A good fit if…" blocks are specific to each page, not shared boilerplate.
 * Creative model: the client supplies raw footage/photos; we handle ideation,
 * editing, production and posting — we do not film.
 */
import type { Field } from '@/lib/formFields';

export interface SubService { title: string; body: string; href?: string }
export interface Faq { q: string; a: string }
export interface Step { title: string; body: string }
export interface ServiceContent {
  slug: string;
  url: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  intro: { eyebrow: string; heading: string; paras: string[] };
  subheading: string;
  subservices: SubService[];
  comparison?: { heading: string; cols: string[]; rows: (string | number)[][]; highlightCol: number; caption?: string };
  // Hero highlights. Optional: performance marketing omits this and shows the
  // real Meta results (HERO_STATS). Every other pillar sets its own honest,
  // non-metric facts here rather than borrowing paid-media numbers (§15).
  heroStats?: { value: string; label: string }[];
  // Value-framed. `included` is what the client actually gets; no fee is shown.
  value: { heading: string; lede: string; included: string[]; note?: string };
  // The five engagement phases, specific to this service.
  process: Step[];
  // Who the service suits — the positive flip side of notForYou, specific to this service.
  goodFit: string[];
  notForYou: string[];
  faqs: Faq[];
  formHeading: string;
  formQuestions: Field[];
}

const spendQ: Field = { name: 'monthly_spend', label: 'Monthly ad spend', type: 'select', required: true, options: ['Under ₹1L', '₹1–3L', '₹3–5L', '₹5L+', 'Not running ads yet'] };
const revenueQ: Field = { name: 'monthly_revenue', label: 'Monthly online revenue', type: 'select', required: false, options: ['Under ₹5L', '₹5–20L', '₹20L–1Cr', 'Over ₹1Cr'] };

export const SERVICES: ServiceContent[] = [
  {
    slug: 'performance-marketing',
    url: '/performance-marketing-agency-bangalore/',
    name: 'Performance marketing',
    eyebrow: 'Performance marketing',
    title: 'Performance Marketing Agency in Bangalore | Scaling Socials',
    description:
      'Scaling Socials runs Meta and Google Ads for D2C and ecommerce brands in India and the UAE, managed to your real P&L, with ad creative produced in-house.',
    h1: 'Performance marketing agency in Bangalore',
    answer:
      'Scaling Socials is a Bangalore performance marketing agency that runs Meta and Google Ads for D2C and ecommerce brands across India and the UAE. We buy media against your real P&L, not the ROAS a platform reports back to itself. Your ad spend stays separate and is never marked up by us.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'ROAS that shows up in your bank account, not just the dashboard',
      paras: [
        'Most accounts we audit are being optimised to a platform-reported ROAS that quietly flatters the real revenue. We work the other way round. We take your break-even ROAS, the number your gross margin actually sets, and buy media against it. Campaigns that clear it get more budget. Campaigns that don’t get switched off. That is most of the job, and it is the part most agencies skip.',
        'Paid social is won or lost on creative now, not on account settings. You send us the raw footage and product shots; we turn them into video-led ads and statics in-house, run them through a structured testing pipeline, and let spend decide which angles live and which die. Opinions in the room don’t get a vote.',
        'You also get a monthly call where we walk through what changed and why. No 90-slide decks and no jargon. Just the numbers that move your P&L and what we are doing about them next.',
      ],
    },
    subheading: 'What performance marketing with us includes',
    subservices: [
      { title: 'Meta Ads', body: 'Full-funnel Meta and Instagram: prospecting, retargeting, Advantage+ where it beats manual, and a creative pipeline feeding all of it.', href: '/meta-ads-agency-india/' },
      { title: 'Google Ads', body: 'Search, Shopping and Performance Max built around real buying intent and your margin, not impression share for its own sake.', href: '/google-ads-agency-bangalore/' },
      { title: 'Ecommerce PPC', body: 'Catalogue-led buying across Meta and Google for stores that carry real SKUs and real seasonality.', href: '/ecommerce-ppc-services/' },
      { title: 'Conversion rate optimisation', body: 'We close the leaks between the click and the checkout so the traffic you pay for actually converts.', href: '/conversion-rate-optimisation-services/' },
    ],
    comparison: {
      heading: 'Meta Advantage+ vs a manual campaign structure',
      cols: ['', 'Advantage+ only', 'Manual only', 'How we run it'],
      rows: [
        ['Best for', 'Simple catalogues, broad appeal', 'Tight targeting, complex funnels', 'Both, by account'],
        ['Creative demand', 'High', 'Moderate', 'High. It is the lever'],
        ['Control', 'Low', 'High', 'As much as the data earns'],
        ['Risk', 'Overspend on weak creative', 'Slow to scale', 'Tested against break-even'],
      ],
      highlightCol: 3,
      caption: 'We reach for Advantage+ where it genuinely beats manual, and go manual where the control pays for itself.',
    },
    process: [
      { title: 'Audit', body: 'We read your ad accounts and your store and find where spend leaks and where it can scale.' },
      { title: 'Plan', body: 'A 30-60-90 media plan built on your break-even ROAS, in the order we would change things.' },
      { title: 'Create', body: 'We cut your raw footage into video-led ads and statics, built to be tested against each other.' },
      { title: 'Test', body: 'We test angles and audiences against your real margins, not a vanity benchmark.' },
      { title: 'Scale', body: 'What clears break-even gets more budget; what doesn’t gets cut. Then we run the loop again.' },
    ],
    value: {
      heading: 'What you actually get',
      lede: 'One team running media, creative and CRO against your P&L, instead of a lone buyer optimising to a dashboard.',
      included: [
        'A senior team on the account across media, creative and CRO, never a junior running a template',
        'Ad creative edited and produced in-house from your footage, tested every week',
        'Weekly optimisation against your break-even ROAS, plus a monthly strategy read',
        'A monthly call and report on what changed and why, in plain numbers',
        'Ad spend paid straight to the platforms, never marked up by us',
      ],
      note: 'Scope depends on ad spend and creative volume, running a lean account and a heavy one are different jobs, so we shape the engagement to yours.',
    },
    goodFit: [
      'You’re a D2C or ecommerce brand already running ads, with some data to work from',
      'You can supply a steady stream of raw footage and product for creative',
      'You want spend judged against your break-even ROAS, not platform-reported ROAS',
      'You’d rather see the maths than be handed a fixed number',
    ],
    notForYou: [
      'Pre-launch brands with no data to work from. There is nothing to optimise in an empty account.',
      'Anyone chasing a guaranteed ROAS number. We work to your margin, and we will not promise a figure we cannot control.',
      'Brands who can’t supply creative footage. On Meta the creative is the whole growth lever, and we edit it, but the raw material comes from you.',
    ],
    faqs: [
      { q: 'How does performance marketing pricing work?', a: 'We scope every engagement to the brand rather than a one-size package, it depends on your ad spend, how many platforms you run, and how much creative you need produced. Whatever the scope, your ad spend stays separate: it goes straight to Meta or Google and we never mark it up.' },
      { q: 'What ROAS can you promise?', a: 'None, and be careful with anyone who does. A fixed ROAS promise is a guess dressed up as a number. We target your break-even ROAS, which your margins set, and scale whatever clears it. You will see the maths in the first audit, so the target is yours rather than something we made up.' },
      { q: 'Do you make the ad creative?', a: 'Yes, we edit and produce it in-house. You supply the raw footage and product shots against a brief we give you; we cut the statics and video-led ads and run them through a structured testing pipeline. Creative is the single biggest lever in paid today, so it sits at the centre of the engagement.' },
      { q: 'How soon do we see results?', a: 'The first audit lands in three working days. Real account changes need a testing cycle to read cleanly, usually 30 to 60 days, before we put weight behind what is working. We will not pour spend into unproven creative just to hand you an early number.' },
      { q: 'Which platforms do you run?', a: 'Mostly Meta (Facebook and Instagram) and Google (Search, Shopping, Performance Max), with Amazon and YouTube added where they suit the brand. We recommend the mix from your margins and your buyer, not from a fixed package.' },
      { q: 'Do you run ads for B2B or lead-generation businesses?', a: 'Yes. Alongside D2C and ecommerce, Scaling Socials runs performance marketing for B2B and service businesses. That means lead-generation campaigns on Meta and Google, with landing pages and tracking built to fill a pipeline, measured on cost per qualified lead instead of ROAS.' },
    ],
    formHeading: 'Get a free performance audit',
    formQuestions: [
      spendQ,
      { name: 'platforms', label: 'Where you run ads', type: 'select', required: true, options: ['Meta only', 'Google only', 'Meta and Google', 'Not running yet'] },
      { name: 'goal', label: 'Main goal', type: 'select', required: false, options: ['Scale profitably', 'Lower CAC', 'Launch a new brand', 'Not sure yet'] },
    ],
  },
  {
    slug: 'seo',
    url: '/seo-agency-bangalore/',
    name: 'SEO',
    heroStats: [
      { value: 'Technical + content', label: 'Both sides of SEO, in one team' },
      { value: 'India + UAE', label: 'Markets we rank brands in' },
      { value: '3 working days', label: 'From access to a written audit' },
    ],
    eyebrow: 'Search engine optimisation',
    title: 'SEO Agency in Bangalore for Ecommerce | Scaling Socials',
    description:
      'Scaling Socials is an SEO agency in Bangalore for ecommerce brands: technical, on-page and local SEO that grows organic revenue, not vanity rankings.',
    h1: 'SEO agency in Bangalore for ecommerce brands',
    answer:
      'Scaling Socials is an SEO agency in Bangalore that grows organic traffic and revenue for D2C and ecommerce brands across India and the UAE. We cover technical, on-page and local SEO, plus answer-engine optimisation, and we tie all of it to revenue rather than rankings for their own sake.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'Rankings are a means. Organic revenue is the point',
      paras: [
        'A first-page ranking for a term nobody searches is worth nothing to you. So we start from the queries your buyers actually type, the commercial and category terms that carry intent, and build the pages, structure and authority to win them. Then we judge the traffic by the revenue it brings in, not by a keyword count that looks good in a report.',
        'For ecommerce, half the battle is technical health. Crawlability, site speed, the way category and product pages are built, clean internal linking. We fix those foundations first, because content and links only compound once the plumbing works.',
        'We also write for answer engines. When a founder asks ChatGPT or Google’s AI Overview a question in your category, it is the structured, well-cited pages that get quoted back. That is where organic search is heading, and most of your competitors have not noticed yet.',
      ],
    },
    subheading: 'What SEO with us includes',
    subservices: [
      { title: 'Ecommerce SEO', body: 'Category and product page optimisation, structured data and internal linking, built for stores with real catalogues.', href: '/ecommerce-seo-services/' },
      { title: 'Technical SEO audits', body: 'Crawlability, speed, indexation and structure. The foundations that decide whether your content ever ranks.', href: '/technical-seo-audit-services/' },
      { title: 'Local SEO', body: 'Google Business Profile, citations and local pages for brands that also sell or serve in a city.', href: '/local-seo-services-bangalore/' },
      { title: 'Answer engine optimisation', body: 'Structuring content so it gets cited in AI Overviews and by ChatGPT, Perplexity and Gemini.', href: '/answer-engine-optimisation-services/' },
    ],
    process: [
      { title: 'Technical audit', body: 'Crawlability, speed, indexation and structure, ranked by how much each is costing you.' },
      { title: 'Intent map', body: 'The commercial and category terms your buyers actually search, mapped to pages.' },
      { title: 'Fix', body: 'We clear the technical blockers first, so anything we build afterwards can actually rank.' },
      { title: 'Build', body: 'Answer-first pages, on-page work and the internal links and authority that compound.' },
      { title: 'Measure', body: 'A monthly read tied to organic revenue, not a vanity keyword count. Then we push the next terms.' },
    ],
    value: {
      heading: 'What you actually get',
      lede: 'Organic growth that compounds: technical foundations, content and authority, all pointed at revenue.',
      included: [
        'A full technical audit and the fixes that unblock rankings',
        'Category and product pages optimised for terms that convert',
        'Content and internal linking that build real topical authority',
        'Answer-engine optimisation, so you get cited in AI Overviews and ChatGPT',
        'A monthly report tied to organic revenue, not a vanity keyword count',
      ],
      note: 'Scope depends on keyword count and difficulty. SEO compounds over quarters, not weeks, so we plan the engagement that way.',
    },
    goodFit: [
      'You’re a D2C or ecommerce brand with product-market fit and room to grow organically',
      'You can wait a couple of quarters for compounding, not next-week sales',
      'You want traffic judged by the revenue it drives, not keyword counts',
      'You’d rather build authority that survives an update than buy risky links',
    ],
    notForYou: [
      'Brands that need revenue this month. SEO compounds over quarters; if you need sales now, start with performance marketing.',
      'Anyone wanting to buy links or game the rankings. We build the kind of authority that survives an algorithm update.',
      'Sites with no product-market fit yet. SEO amplifies demand that already exists; it does not create it.',
    ],
    faqs: [
      { q: 'How does SEO pricing work?', a: 'We scope it to your site rather than a fixed package. It comes down to how many keywords you target and how competitive they are, how many pages need writing, and how much technical and link work sits in the plan, so we map that out with you before anything starts.' },
      { q: 'How long does SEO take to work?', a: 'Expect the first ranking and traffic movement in roughly 8 to 12 weeks, and the meaningful revenue curve after two quarters. Anyone promising page one in 30 days is either buying risky links or targeting terms nobody searches for.' },
      { q: 'What is answer engine optimisation?', a: 'It is the work of getting your content quoted inside AI answers, such as Google’s AI Overviews and tools like ChatGPT and Perplexity. It rewards specific, well-structured, well-cited pages, and almost nobody in this market is doing it properly yet.' },
      { q: 'Do you do technical SEO?', a: 'Yes, and we usually start there. Crawlability, site speed, indexation, structured data and internal linking decide whether your content can rank at all. We run a full technical audit and fix the foundations before we scale any content.' },
      { q: 'Can you do SEO and performance marketing together?', a: 'Yes, and plenty of clients run both. Paid buys demand today while SEO compounds for tomorrow, and the data from each sharpens the other. We keep them on one team and one number so they are not quietly working against each other.' },
      { q: 'Do you do SEO for B2B or service businesses?', a: 'Yes. Beyond ecommerce, Scaling Socials runs SEO for B2B and service businesses. The technical and intent work is much the same: we target the commercial and service queries your buyers search, then build the pages that turn those searches into leads.' },
    ],
    formHeading: 'Get a free SEO audit',
    formQuestions: [
      { name: 'website', label: 'Website to audit', type: 'text', required: true, placeholder: 'yourbrand.com' },
      { name: 'market', label: 'Where you want to rank', type: 'select', required: false, options: ['India', 'UAE', 'Both', 'A specific city'] },
      { name: 'goal', label: 'Main goal', type: 'select', required: false, options: ['Grow ecommerce category pages', 'Rank nationally', 'Local visibility', 'Get cited in AI answers'] },
    ],
  },
  {
    slug: 'shopify-development',
    url: '/shopify-development-company-bangalore/',
    name: 'Shopify development',
    heroStats: [
      { value: 'Design to deploy', label: 'Built in-house, one team' },
      { value: 'Speed-first', label: 'Core Web Vitals built in' },
      { value: 'India + UAE', label: 'Stores we build and run' },
    ],
    eyebrow: 'Shopify development',
    title: 'Shopify Development Company in Bangalore | Scaling Socials',
    description:
      'Scaling Socials is a Shopify development company in Bangalore: stores built to convert, plus migrations, speed optimisation and redesigns for D2C brands.',
    h1: 'Shopify development company in Bangalore',
    answer:
      'Scaling Socials is a Shopify development company in Bangalore that builds, migrates and optimises stores for D2C and ecommerce brands across India and the UAE. We build for conversion and speed, not just for looks, because the store is where your ad spend either pays off or quietly leaks away. Every build is scoped to what your store needs.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'A store that converts, not one that only photographs well',
      paras: [
        'A store has one job: turn expensive traffic into orders. We build Shopify themes around the three screens that actually decide your conversion rate, the product page, the cart and the checkout. Then we judge the work by what it does to revenue per session, not by how it looks in a mockup.',
        'Speed is part of conversion. A store that takes four seconds to load has already lost buyers before they see the product, and it pushes your ad costs up at the same time. We build lean, and on existing stores we run a dedicated speed pass aimed squarely at Core Web Vitals.',
        'Because we also run the ads, the store and the acquisition talk to each other. Landing pages match the creative, tracking is clean from the start, and there is no finger-pointing between a media team and a dev team, because it is one team.',
      ],
    },
    subheading: 'What Shopify work with us includes',
    subservices: [
      { title: 'Store builds', body: 'New Shopify stores built around the product page, cart and checkout, with clean tracking from day one.' },
      { title: 'Store migration', body: 'Moving from WooCommerce, Wix or Magento to Shopify without losing your SEO, URLs or order history.', href: '/shopify-store-migration-services/' },
      { title: 'Speed optimisation', body: 'A dedicated pass on Core Web Vitals and load time, because a faster store means more orders and cheaper ads.', href: '/shopify-speed-optimisation-services/' },
      { title: 'Store redesign', body: 'Rebuilding an existing store around what actually converts, guided by session and heatmap data.', href: '/shopify-store-redesign-services/' },
    ],
    process: [
      { title: 'Store review', body: 'We read your product page, cart, checkout and load speed, and find where revenue leaks.' },
      { title: 'Plan', body: 'What to build or fix first, in order, each tied to revenue per session.' },
      { title: 'Build', body: 'The theme, migration or speed work, with clean tracking wired in from day one.' },
      { title: 'Test', body: 'We check it against real Core Web Vitals and conversion, not how it looks in a mockup.' },
      { title: 'Hand over', body: 'A store your team can run, with the analytics to see what is working and what to fix next.' },
    ],
    value: {
      heading: 'What you actually get',
      lede: 'A store built around revenue per session: fast, clean to track, and made to convert paid traffic.',
      included: [
        'A theme built around the product page, cart and checkout',
        'Core Web Vitals and load time handled from the start',
        'Clean tracking and analytics wired in on day one',
        'A build your team can run without a developer on standby',
        'Honest advice: if a template fits you better than custom, we will say so',
      ],
      note: 'Scope depends on the job, a speed pass, a full custom build and a migration are very different, so tell us what you need and we will map it out.',
    },
    goodFit: [
      'You’re a D2C or ecommerce brand whose store is holding back paid or organic',
      'You care about revenue per session, not just how the store looks',
      'You want speed and clean tracking built in, not bolted on later',
      'You’d rather have honest advice on custom-vs-template than an upsell',
    ],
    notForYou: [
      'Anyone after the cheapest possible theme install. A template store is fine, and you do not need us for that.',
      'Brands that want looks over conversion. We build for revenue per session, and we will push back on pretty-but-slow.',
      'Marketplaces or platforms that genuinely need custom backend engineering beyond what Shopify does, for those, see our web and app development.',
    ],
    faqs: [
      { q: 'How does Shopify development pricing work?', a: 'It is scoped to the job: a speed optimisation pass, a full custom build, and a migration with thousands of SKUs are very different pieces of work. Tell us what you need and we will scope it and come back within two working days.' },
      { q: 'Can you migrate my store to Shopify?', a: 'Yes. We migrate from WooCommerce, Wix, Magento and others while preserving your URLs and SEO with a proper 301 map, along with product data and order history. Losing rankings in a migration is avoidable, so we plan for it before we touch anything.' },
      { q: 'Will you make my store faster?', a: 'Yes. We run a dedicated speed pass targeting Core Web Vitals and real-world load time. Speed feeds conversion directly: a faster store turns more of your paid traffic into orders and lowers your effective ad cost at the same time.' },
      { q: 'Do you also run the ads for the store you build?', a: 'Often, yes. Because we run performance marketing as well, the store and the acquisition are built to work together. Landing pages match the creative and tracking is clean, so nothing falls through the gap between the media and the dev.' },
    ],
    formHeading: 'Get a free store review',
    formQuestions: [
      { name: 'need', label: 'What you need', type: 'select', required: true, options: ['New store build', 'Migration to Shopify', 'Redesign', 'Speed fix', 'Not sure'] },
      { name: 'platform', label: 'Current platform', type: 'select', required: false, options: ['Shopify', 'WooCommerce', 'Wix', 'Magento', 'None yet'] },
      revenueQ,
    ],
  },
  {
    slug: 'web-development',
    url: '/web-development-company-bangalore/',
    name: 'Web development',
    heroStats: [
      { value: 'Web + apps', label: 'Sites and mobile apps' },
      { value: 'Design to deploy', label: 'One in-house build team' },
      { value: 'Headless-ready', label: 'A modern, fast stack' },
    ],
    eyebrow: 'Web & app development',
    title: 'Web Development Company in Bangalore | Scaling Socials',
    description:
      'Scaling Socials is a web development company in Bangalore building fast, measurable websites, landing pages and web and mobile apps for D2C brands.',
    h1: 'Web and app development company in Bangalore',
    answer:
      'Scaling Socials is a web development company in Bangalore that builds fast, measurable websites, landing pages and web and mobile apps for D2C and ecommerce brands across India and the UAE. We build things that sell and things that scale: quick to load, clean to track, and designed around the action you want. Every project is scoped to what it needs.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'A site or app that earns its place, and gets measured like one',
      paras: [
        'A website or app exists to move a user toward one action, whether that is a purchase, a lead, a booking or a task inside a product. We design around that action, build it to load fast, and wire up clean analytics so you can see what is actually working. Looking good is table stakes. Being measurable is the point.',
        'For ad-driven brands, the landing page is where the money is made or lost. We build message-matched pages that carry the promise of the ad all the way through to the offer, and we keep them under a second and a half to load, which protects both your Quality Score and your budget.',
        'And when you need more than a brochure site, we build it. Web and mobile applications, dashboards, portals, booking flows, custom storefront and internal tools, on a stack chosen for the job and built to scale, handed over so your team can actually run it.',
      ],
    },
    subheading: 'What web and app development with us includes',
    subservices: [
      { title: 'Websites', body: 'Fast, measurable marketing and brand sites built around a clear action and clean tracking.' },
      { title: 'Landing pages', body: 'Message-matched, sub-1.5s landing pages for ad campaigns that protect Quality Score and convert.' },
      { title: 'Web & mobile apps', body: 'Custom web and mobile applications, dashboards, portals, booking and storefront tools, built to scale.' },
      { title: 'Rebuilds and migrations', body: 'Replacing a slow WordPress build with a fast modern stack, without losing your SEO along the way.' },
      { title: 'Analytics and tracking', body: 'Clean GA4, server-side events and dashboards, so decisions run on real data instead of guesses.' },
    ],
    process: [
      { title: 'Scope', body: 'We map the one action each page or screen exists to drive, and what success looks like.' },
      { title: 'Plan', body: 'Architecture, stack and tracking, chosen for the job, a fast site or a proper application.' },
      { title: 'Build', body: 'Fast, measurable web or app builds, with clean analytics wired in from day one.' },
      { title: 'Test', body: 'Load speed, Core Web Vitals and the conversion or task path, tested on real devices.' },
      { title: 'Ship & support', body: 'Handed over so your team can run it, with support as you grow and add to it.' },
    ],
    value: {
      heading: 'What you actually get',
      lede: 'A site or app that sells and scales: fast to load, clear on the action, and measurable so you can see what works.',
      included: [
        'Design around a single clear action, not decoration',
        'Sub-1.5s load times that protect Quality Score and budget',
        'Web and mobile app builds on a stack chosen for the job',
        'Clean GA4 and event tracking, so decisions run on data',
        'A stack your team can actually run and update',
      ],
      note: 'Scope depends on the job, a few landing pages, a full brand-site rebuild and an app build are very different, so tell us what you need and we will map it out.',
    },
    goodFit: [
      'You need a fast, measurable website, landing pages, or a web or mobile app',
      'You want the build judged on the action it drives, not just how it looks',
      'You care about load speed protecting Quality Score and conversion',
      'You’d rather have a stack your team can run than a black box',
    ],
    notForYou: [
      'Anyone who just needs a one-page template site. A builder like Wix or Framer will serve you fine there.',
      'Projects with no defined goal or owner on your side. A site or app only works when someone can make decisions and supply content.',
      'Brands that want a build with no way to measure whether it worked. We build things to be measured.',
    ],
    faqs: [
      { q: 'How does website pricing work?', a: 'It is scoped to the project: a few landing pages, a full brand-site rebuild and an app build are very different pieces of work. Tell us what you need and we will scope it and come back within two working days.' },
      { q: 'Do you build web and mobile apps?', a: 'Yes. Alongside websites and landing pages, we build web and mobile applications, dashboards, portals, booking flows and custom storefront or internal tools. We scope the stack to the job and build it to scale, with clean analytics wired in so you can see how it is used.' },
      { q: 'Why does site speed matter?', a: 'Speed is money. A slow site loses visitors before they act, and on ad-driven pages it drags down your Quality Score and pushes your cost per click up. We build to load in well under two seconds, which protects both your conversion rate and your budget.' },
      { q: 'Can you rebuild my slow WordPress site?', a: 'Yes. We move brands off slow WordPress builds onto a fast modern stack while preserving SEO with a proper redirect map. You keep your rankings, you gain the speed, and your team can run the result without a developer on standby.' },
      { q: 'Do you build websites for B2B or lead-gen businesses?', a: 'Yes. Beyond ecommerce, Scaling Socials builds fast, measurable websites, lead-generation landing pages and web apps for B2B and service businesses, designed around the enquiry, booking or task you want, with clean tracking so you can see what converts.' },
    ],
    formHeading: 'Get a free site review',
    formQuestions: [
      { name: 'need', label: 'What you need', type: 'select', required: true, options: ['New website', 'Rebuild', 'Landing pages', 'Web or mobile app', 'Not sure'] },
      { name: 'timeline', label: 'Timeline', type: 'select', required: false, options: ['As soon as possible', '1–2 months', 'Flexible'] },
    ],
  },
  {
    slug: 'social-media-marketing',
    url: '/social-media-marketing-agency-bangalore/',
    name: 'Social media marketing',
    heroStats: [
      { value: 'You shoot', label: 'We plan, edit and post' },
      { value: 'Monthly calendar', label: 'Planned a month ahead' },
      { value: 'Grid to Reels', label: 'Full post-production' },
    ],
    eyebrow: 'Social media',
    title: 'Social Media Marketing Agency Bangalore | Scaling Socials',
    description:
      'Scaling Socials plans, edits and posts organic social for D2C brands in India and the UAE: ideation, content calendar, editing and grid, and community.',
    h1: 'Social media marketing agency in Bangalore',
    answer:
      'Scaling Socials is a social media marketing agency in Bangalore that plans, edits and runs organic social for D2C and ecommerce brands across India and the UAE. We handle the ideas, the monthly content calendar, the editing and the posting; you capture the raw footage from a shot list we give you.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'Organic social that feeds performance, not a follower chase',
      paras: [
        'Followers don’t pay invoices. We build organic social to warm an audience so paid works harder, and to produce the native content a testing pipeline runs on. It shares one creative engine with your ads, so nothing gets made twice.',
        'Here is how it actually works. We plan the whole month’s content in advance and hand you a shot list, what to film, how, and why. You capture the raw footage and photos on your end; we take it from there, editing the reels and statics, planning the grid, then scheduling and posting.',
        'We also run the community, because the comments and DMs are where trust and repeat purchase get built. For founder- and creator-led brands we lean into your voice on purpose, and on creators we give you the ideas and a shortlist rather than running cold outreach.',
      ],
    },
    subheading: 'What social media marketing with us includes',
    subservices: [
      { title: 'Ideation & content calendar', body: 'A month of content planned in advance, angles, hooks and a shot list of exactly what to capture.' },
      { title: 'Editing & production', body: 'You send the raw footage; we cut the reels, statics and short-form, and plan the grid.' },
      { title: 'Posting & community', body: 'Scheduling, posting and grid management, plus comments and DMs handled like the retention channel they are.' },
      { title: 'Creator & UGC direction', body: 'Ideas, briefs and a creator shortlist that fuel organic and paid, direction, not cold outreach.' },
    ],
    process: [
      { title: 'Strategy', body: 'We set the channel mix and the content angles that support your paid, from your brand and buyer.' },
      { title: 'Calendar', body: 'A full month planned in advance, with a shot list of exactly what to capture and why.' },
      { title: 'You capture', body: 'You film the raw footage and photos on your end, from the shot list we give you.' },
      { title: 'Edit & produce', body: 'We cut the reels, statics and short-form from your footage, and plan the grid.' },
      { title: 'Post & manage', body: 'We schedule, post and run the community, then read what worked into next month’s plan.' },
    ],
    value: {
      heading: 'What you actually get',
      lede: 'Organic social that feeds performance, one team on the ideas, the editing, the posting and the community.',
      included: [
        'A month of content planned ahead, with a clear shot list for you to capture',
        'Reels, statics and short-form edited and produced in-house from your footage',
        'Grid planning, scheduling and posting handled end to end',
        'Community management on comments and DMs, where trust gets built',
        'Creator and UGC direction that fuels organic and paid alike',
      ],
      note: 'Scope depends on how much content you need, how many channels you run, and whether creators are in the mix, tell us and we will map it out.',
    },
    goodFit: [
      'You’re a founder- or creator-led brand happy to show up on camera',
      'You can capture raw footage and photos from a monthly shot list we send',
      'You want social that feeds paid and repeat purchase, not vanity followers',
      'You’d rather sound like yourself than like every other D2C account',
    ],
    notForYou: [
      'Brands chasing follower counts as the goal. We build social that supports revenue, and we measure it that way.',
      'Anyone who can’t capture raw footage. We direct, edit and post, but the filming happens on your end.',
      'Businesses with no interest in showing up as themselves. Founder-led social wins; faceless brand-speak rarely does.',
    ],
    faqs: [
      { q: 'Do you shoot the content?', a: 'No, you capture the raw footage and photos, and we do everything around it. We plan the month, give you a shot list of what to film and how, then edit the reels and statics, plan the grid, and schedule and post. You film; we handle the rest.' },
      { q: 'What exactly do you handle each month?', a: 'Ideation and the content calendar up front, then editing, grid planning, scheduling, posting and community management. You supply raw footage against the shot list we send; we turn it into finished content and run the channels.' },
      { q: 'How does social media pricing work?', a: 'It comes down to how much content you need each month, how many channels you run, and whether creators are involved. Social scope varies widely, so we shape it around your brand rather than a one-size package, tell us what you need and we will map it out.' },
      { q: 'Do followers actually matter?', a: 'Not on their own. We build organic social to warm an audience so paid works harder, and to produce the native content a testing pipeline needs. Follower count is a by-product of that, not the target we aim at.' },
      { q: 'Do you work with creators?', a: 'Yes, but as direction rather than cold outreach. We give you the ideas, the briefs and a shortlist of creators to work with, and we fold the content that comes back into both organic and paid.' },
      { q: 'Do you handle social media for B2B brands?', a: 'Yes. Alongside D2C, Scaling Socials handles social media for B2B and service businesses, LinkedIn and founder-led content included, built to warm buyers and support lead generation rather than just to chase followers.' },
    ],
    formHeading: 'Get a free social review',
    formQuestions: [
      { name: 'platforms', label: 'Channels you care about', type: 'select', required: true, options: ['Instagram', 'YouTube', 'Instagram and YouTube', 'Other'] },
      { name: 'need', label: 'What you need', type: 'select', required: false, options: ['Content and editing', 'Posting and community', 'Both', 'Creator/UGC direction'] },
    ],
  },
  {
    slug: 'conversion-rate-optimisation',
    url: '/conversion-rate-optimisation-services/',
    name: 'Conversion rate optimisation',
    heroStats: [
      { value: 'Click to cart', label: 'Where we find the lift' },
      { value: 'Test-led', label: 'Decisions from data, not opinion' },
      { value: '3 working days', label: 'From access to a written audit' },
    ],
    eyebrow: 'Conversion rate optimisation',
    title: 'Conversion Rate Optimisation Services | Scaling Socials',
    description:
      'Scaling Socials runs conversion rate optimisation for D2C and ecommerce brands in India and the UAE: fixing the leaks between click and checkout.',
    h1: 'Conversion rate optimisation services',
    answer:
      'Scaling Socials runs conversion rate optimisation for D2C and ecommerce brands across India and the UAE. We find and close the leaks between the click and the checkout, across the product page, cart and checkout, so the traffic you already pay for converts more often. CRO is scoped to the work, and it usually pays for itself fastest.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'The cheapest growth you have is the traffic you already buy',
      paras: [
        'Before you spend more on ads, it is almost always cheaper to convert more of the traffic you already have. Lifting conversion from 1.5% to 2.2% is a 47% revenue increase on the same spend, and it lowers your effective CAC across every channel at once. That is a lot of upside sitting in a store you have already paid to send people to.',
        'We work from data rather than opinion. Session recordings, funnel analytics and heatmaps show us where buyers actually drop off. Then we test the fixes across the product page, cart, checkout and mobile, and we keep only what wins. No redesign-by-vibes.',
        'CRO compounds with everything else. A higher-converting store makes the ads profitable at a higher CAC, which lets performance scale further, which sends more traffic into a store that now converts better. It is the quiet multiplier on the whole account.',
      ],
    },
    subheading: 'What CRO with us includes',
    subservices: [
      { title: 'Funnel audit', body: 'Session recordings, analytics and heatmaps to find exactly where buyers drop off, and why.' },
      { title: 'Product page optimisation', body: 'The screen that decides most purchases: layout, trust, offer and speed, all tested.' },
      { title: 'Cart and checkout', body: 'Cutting the friction and abandonment in the two steps closest to the money.' },
      { title: 'Landing page testing', body: 'Message-matched pages for paid traffic, tested against real conversion instead of opinion.' },
    ],
    process: [
      { title: 'Funnel audit', body: 'Session recordings, analytics and heatmaps to find where buyers actually drop off.' },
      { title: 'Prioritise', body: 'The fixes ranked by likely lift and how cheaply and cleanly we can test them.' },
      { title: 'Build variants', body: 'We build the product-page, cart, checkout and landing-page tests to run.' },
      { title: 'Test', body: 'A/B tests run and read properly, so only real winners ship, not opinions.' },
      { title: 'Scale', body: 'Winners go live and compound; then we run the next round on the biggest leak left.' },
    ],
    value: {
      heading: 'What you actually get',
      lede: 'More revenue from the traffic you already pay for, which is the cheapest growth you have.',
      included: [
        'A full funnel audit from session recordings, analytics and heatmaps',
        'Product page, cart and checkout tested where it matters most',
        'Message-matched landing pages for paid traffic',
        'A/B tests run and read properly, so real winners actually ship',
        'A conversion lift that lowers your effective CAC across every channel',
      ],
      note: 'Scope depends on your traffic and how many tests we run, there has to be enough volume to test cleanly, so tell us your numbers and we will map it out.',
    },
    goodFit: [
      'You have a few thousand sessions a month, enough to test cleanly',
      'You’re willing to ship the changes that win, not just read the report',
      'You want conversion judged by revenue and effective CAC, not opinion',
      'You’d rather test a change than redesign on gut feel',
    ],
    notForYou: [
      'Stores with too little traffic to test cleanly. Below a few thousand sessions a month, put the money into acquisition first.',
      'Anyone wanting a redesign on gut feel. We test, and we will resist a change we cannot measure.',
      'Brands unwilling to ship changes. CRO only works if the winning tests actually go live.',
    ],
    faqs: [
      { q: 'What is conversion rate optimisation?', a: 'CRO is the practice of getting more of your existing traffic to buy, by finding and fixing the friction between the click and the checkout. It is usually the cheapest growth available, because it lifts revenue on spend you are already making.' },
      { q: 'How does CRO pricing work?', a: 'It comes down to your traffic and how many tests we run, there has to be enough volume to test cleanly, and it scales with whether we build the variants for you. Tell us your store and monthly sessions and we will scope it with you.' },
      { q: 'How much can CRO actually lift revenue?', a: 'It compounds fast. Moving from 1.5% to 2.2% conversion is roughly a 47% revenue increase on the same traffic and spend. It also lowers your effective CAC across every channel, which is what lets performance marketing scale further.' },
      { q: 'Do I need enough traffic for CRO?', a: 'Yes. CRO needs a few thousand sessions a month to test cleanly. If you are below that, we will say so plainly and point you at acquisition first, then bring CRO in once there is enough volume to read a result you can trust.' },
    ],
    formHeading: 'Get a free funnel review',
    formQuestions: [
      { name: 'platform', label: 'Store platform', type: 'select', required: true, options: ['Shopify', 'WooCommerce', 'Custom', 'Other'] },
      { name: 'sessions', label: 'Monthly sessions', type: 'select', required: false, options: ['Under 5k', '5k–20k', '20k–100k', 'Over 100k'] },
      { name: 'dropoff', label: 'Where you think you lose people', type: 'select', required: false, options: ['Product page', 'Cart', 'Checkout', 'Not sure'] },
    ],
  },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));
