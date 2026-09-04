/**
 * Service pillar content — the six pages under ServiceLayout. See 02 §5.1.
 *
 * Real, owner-aligned copy. Performance marketing and SEO publish the confirmed
 * ₹25,000/month floor (11 §2); Shopify, web and social are scoped (no floor
 * figure supplied, so none is invented — 11 §2 / CLAUDE.md §15). Meta titles are
 * 50–60 chars and descriptions 140–158, enforced by the build (03 §0).
 */
import type { Field } from '@/lib/formFields';

export interface SubService { title: string; body: string; href?: string }
export interface Faq { q: string; a: string }
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
  // Value-framed, not cost-framed. `price` is a quiet published floor; `included`
  // is what the client actually gets for it.
  value: { heading: string; lede: string; included: string[]; price?: string; note?: string };
  notForYou: string[];
  faqs: Faq[];
  formHeading: string;
  formQuestions: Field[];
  offer?: { price: number; priceCurrency?: string; unitText?: string };
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
      'Scaling Socials runs Meta and Google Ads for D2C brands in India and the UAE, managed to your P&L. Performance marketing from ₹25,000 a month.',
    h1: 'Performance marketing agency in Bangalore',
    answer:
      'Scaling Socials is a Bangalore performance marketing agency that runs Meta and Google Ads for D2C and ecommerce brands across India and the UAE. We buy media against your real P&L, not the ROAS a platform reports back to itself. It starts at ₹25,000 a month, and your ad spend stays separate and is never marked up.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'ROAS that shows up in your bank account, not just the dashboard',
      paras: [
        'Most accounts we audit are being optimised to a platform-reported ROAS that quietly flatters the real revenue. We work the other way round. We take your break-even ROAS, the number your gross margin actually sets, and buy media against it. Campaigns that clear it get more budget. Campaigns that don’t get switched off. That is most of the job, and it is the part most agencies skip.',
        'Paid social is won or lost on creative now, not on account settings. We shoot and edit video-led ads in-house, run them through a structured testing pipeline, and let spend decide which angles live and which die. Opinions in the room don’t get a vote. The account structure exists to serve the creative, not the reverse.',
        'You also get a shared Slack channel, a live dashboard, and a monthly call where we walk through what changed and why. No 90-slide decks and no jargon. Just the numbers that move your P&L and what we are doing about them next.',
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
    value: {
      heading: 'What you get for your money',
      lede: 'One team running media, creative and CRO against your P&L, instead of a lone buyer optimising to a dashboard.',
      included: [
        'A senior team on the account across media, creative and CRO, never a junior running a template',
        'Ad creative produced in-house and tested every week',
        'A live dashboard and a shared Slack channel, so you always know what changed',
        'Weekly optimisation against your break-even ROAS, plus a monthly strategy read',
        'Ad spend paid straight to the platforms, never marked up by us',
      ],
      price: '₹25,000/month',
      note: 'Where you land depends on ad spend and creative volume. Managing ₹1L a month and ₹20L a month are different jobs.',
    },
    notForYou: [
      'Pre-launch brands with no data to work from. There is nothing to optimise in an empty account.',
      'Anyone chasing a guaranteed ROAS number. We work to your margin, and we will not promise a figure we cannot control.',
      'Brands unwilling to produce creative. On Meta the creative is the whole growth lever, and without a steady supply there is little for us to scale.',
    ],
    faqs: [
      { q: 'How much does a performance marketing agency cost in India?', a: 'Scaling Socials starts performance marketing at ₹25,000 a month. What you actually pay depends on your ad spend, how many platforms you run, and how much creative you need us to produce. Ad spend is separate and goes straight to Meta or Google; we never mark it up.' },
      { q: 'What ROAS can you promise?', a: 'None, and be careful with anyone who does. A fixed ROAS promise is a guess dressed up as a number. We target your break-even ROAS, which your margins set, and scale whatever clears it. You will see the maths in the first audit, so the target is yours rather than something we made up.' },
      { q: 'Do you make the ad creative?', a: 'Yes. We produce statics and video-led ads in-house and run them through a structured testing pipeline. Creative is the single biggest lever in paid today, so it sits at the centre of the engagement, not on the side as an add-on.' },
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
    offer: { price: 25000, priceCurrency: 'INR', unitText: 'MONTH' },
  },
  {
    slug: 'seo',
    url: '/seo-agency-bangalore/',
    name: 'SEO',
    eyebrow: 'Search engine optimisation',
    title: 'SEO Agency in Bangalore for Ecommerce | Scaling Socials',
    description:
      'Scaling Socials is an SEO agency in Bangalore for ecommerce brands — technical, on-page and local SEO that grows organic revenue. From ₹25,000 a month.',
    h1: 'SEO agency in Bangalore for ecommerce brands',
    answer:
      'Scaling Socials is an SEO agency in Bangalore that grows organic traffic and revenue for D2C and ecommerce brands across India and the UAE. We cover technical, on-page and local SEO, plus answer-engine optimisation, and we tie all of it to revenue rather than rankings for their own sake. SEO starts at ₹25,000 a month.',
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
    value: {
      heading: 'What you get for your money',
      lede: 'Organic growth that compounds: technical foundations, content and authority, all pointed at revenue.',
      included: [
        'A full technical audit and the fixes that unblock rankings',
        'Category and product pages optimised for terms that convert',
        'Content and internal linking that build real topical authority',
        'Answer-engine optimisation, so you get cited in AI Overviews and ChatGPT',
        'A monthly report tied to organic revenue, not a vanity keyword count',
      ],
      price: '₹25,000/month',
      note: 'Where you land depends on keyword count and difficulty. SEO compounds over quarters, not weeks, so we scope it that way.',
    },
    notForYou: [
      'Brands that need revenue this month. SEO compounds over quarters; if you need sales now, start with performance marketing.',
      'Anyone wanting to buy links or game the rankings. We build the kind of authority that survives an algorithm update.',
      'Sites with no product-market fit yet. SEO amplifies demand that already exists; it does not create it.',
    ],
    faqs: [
      { q: 'How much does SEO cost in India?', a: 'Scaling Socials starts SEO at ₹25,000 a month. The final figure comes down to how many keywords you target and how competitive they are, how many pages need writing, and how much technical and link work sits in the plan.' },
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
    offer: { price: 25000, priceCurrency: 'INR', unitText: 'MONTH' },
  },
  {
    slug: 'shopify-development',
    url: '/shopify-development-company-bangalore/',
    name: 'Shopify development',
    eyebrow: 'Shopify development',
    title: 'Shopify Development Company in Bangalore | Scaling Socials',
    description:
      'Scaling Socials is a Shopify development company in Bangalore — stores built to convert, plus migrations, speed optimisation and redesigns for D2C brands.',
    h1: 'Shopify development company in Bangalore',
    answer:
      'Scaling Socials is a Shopify development company in Bangalore that builds, migrates and optimises stores for D2C and ecommerce brands across India and the UAE. We build for conversion and speed, not just for looks, because the store is where your ad spend either pays off or quietly leaks away. Pricing is scoped to the build.',
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
    value: {
      heading: 'What you get for your money',
      lede: 'A store built around revenue per session: fast, clean to track, and made to convert paid traffic.',
      included: [
        'A theme built around the product page, cart and checkout',
        'Core Web Vitals and load time handled from the start',
        'Clean tracking and analytics wired in on day one',
        'A build your team can run without a developer on standby',
        'Honest advice: if a template fits you better than custom, we will say so',
      ],
      note: 'Priced by scope. A speed pass is a different job from a full custom build or a migration. We quote inside two working days.',
    },
    notForYou: [
      'Anyone after the cheapest possible theme install. A template store is fine, and you do not need us for that.',
      'Brands that want looks over conversion. We build for revenue per session, and we will push back on pretty-but-slow.',
      'Marketplaces or platforms that genuinely need custom backend engineering beyond what Shopify does.',
    ],
    faqs: [
      { q: 'How much does Shopify development cost?', a: 'It depends on scope. A speed optimisation pass, a full custom build, and a migration with thousands of SKUs are very different jobs. Tell us what you need and you will have a fixed quote within two working days. We never publish a number we cannot honour.' },
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
    eyebrow: 'Web development',
    title: 'Web Development Company in Bangalore | Scaling Socials',
    description:
      'Scaling Socials is a web development company in Bangalore building fast, measurable websites and landing pages that convert for D2C ecommerce brands.',
    h1: 'Web development company in Bangalore',
    answer:
      'Scaling Socials is a web development company in Bangalore that builds fast, measurable websites and landing pages for D2C and ecommerce brands across India and the UAE. We build sites that sell: quick to load, clean to track, and designed around the one action you want a visitor to take. Pricing is scoped to the project.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'A site is a sales tool, so we measure it like one',
      paras: [
        'A website exists to move a visitor toward one action, whether that is a purchase, a lead or a booking. We design around that action, build it to load fast, and wire up clean analytics so you can see what is actually working. Looking good is table stakes. Being measurable is the point.',
        'For ad-driven brands, the landing page is where the money is made or lost. We build message-matched pages that carry the promise of the ad all the way through to the offer, and we keep them under a second and a half to load, which protects both your Quality Score and your budget.',
        'We build on whatever tool fits the job, Shopify for stores, a fast static or headless stack for content and landing pages, and we hand you something your team can run without a developer permanently on standby.',
      ],
    },
    subheading: 'What web development with us includes',
    subservices: [
      { title: 'Websites', body: 'Fast, measurable marketing and brand sites built around a clear action and clean tracking.' },
      { title: 'Landing pages', body: 'Message-matched, sub-1.5s landing pages for ad campaigns that protect Quality Score and convert.' },
      { title: 'Rebuilds and migrations', body: 'Replacing a slow WordPress build with a fast modern stack, without losing your SEO along the way.' },
      { title: 'Analytics and tracking', body: 'Clean GA4, server-side events and dashboards, so decisions run on real data instead of guesses.' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'A site that sells: fast to load, clear on one action, and measurable so you can see what works.',
      included: [
        'Design around a single clear action, not decoration',
        'Sub-1.5s load times that protect Quality Score and budget',
        'Clean GA4 and event tracking, so decisions run on data',
        'Message-matched landing pages for your ad campaigns',
        'A stack your team can actually run and update',
      ],
      note: 'Priced by scope. A few landing pages is a different job from a full brand-site rebuild. We quote inside two working days.',
    },
    notForYou: [
      'Anyone who just needs a one-page template site. A builder like Wix or Framer will serve you fine there.',
      'Projects that need heavy custom backend engineering or a mobile app. That sits outside our lane.',
      'Brands that want a redesign with no way to measure whether it worked. We build things to be measured.',
    ],
    faqs: [
      { q: 'How much does a website cost?', a: 'It depends on scope. A few landing pages and a full brand-site rebuild are very different projects. Tell us what you need and you will have a fixed quote within two working days. We will not publish a headline price we cannot stand behind.' },
      { q: 'Why does site speed matter?', a: 'Speed is money. A slow site loses visitors before they act, and on ad-driven pages it drags down your Quality Score and pushes your cost per click up. We build to load in well under two seconds, which protects both your conversion rate and your budget.' },
      { q: 'Can you rebuild my slow WordPress site?', a: 'Yes. We move brands off slow WordPress builds onto a fast modern stack while preserving SEO with a proper redirect map. You keep your rankings, you gain the speed, and your team can run the result without a developer on standby.' },
      { q: 'Do you build landing pages for ads?', a: 'Yes, and it is one of the highest-return things we do. A message-matched page that loads fast converts far better than pointing paid traffic at a generic homepage, and because we run the ads too, the page and the creative get built together.' },
      { q: 'Do you build websites for B2B or lead-gen businesses?', a: 'Yes. Beyond ecommerce, Scaling Socials builds fast, measurable websites and lead-generation landing pages for B2B and service businesses, designed around the enquiry or booking you want, with clean tracking so you can see what converts.' },
    ],
    formHeading: 'Get a free site review',
    formQuestions: [
      { name: 'need', label: 'What you need', type: 'select', required: true, options: ['New website', 'Rebuild', 'Landing pages', 'Not sure'] },
      { name: 'timeline', label: 'Timeline', type: 'select', required: false, options: ['As soon as possible', '1–2 months', 'Flexible'] },
    ],
  },
  {
    slug: 'social-media-marketing',
    url: '/social-media-marketing-agency-bangalore/',
    name: 'Social media marketing',
    eyebrow: 'Social media',
    title: 'Social Media Marketing Agency Bangalore | Scaling Socials',
    description:
      'Scaling Socials is a social media marketing agency in Bangalore — content, community and creator-led growth that supports paid, for D2C brands.',
    h1: 'Social media marketing agency in Bangalore',
    answer:
      'Scaling Socials is a social media marketing agency in Bangalore that handles content, community and creator-led growth for D2C and ecommerce brands across India and the UAE. We build organic social that supports paid and compounds the brand, rather than chasing vanity follower counts. Pricing is scoped to the work.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'Organic social that feeds performance, not a follower chase',
      paras: [
        'Followers don’t pay invoices. We build organic social to do two things your P&L cares about: warm an audience so paid works harder, and produce the volume of native content a testing pipeline runs on. The content and the ads pull from one creative engine, so nothing gets made twice.',
        'In practice that is a real content calendar, reels and statics produced at volume, and a community managed like it matters, because the comments and the DMs are where trust and repeat purchase are actually built.',
        'For founder- and creator-led brands, we lean into that edge on purpose. An operator’s point of view outperforms polished brand-speak on social almost every time, and we would rather help you sound like you than like every other D2C account in the feed.',
      ],
    },
    subheading: 'What social media marketing with us includes',
    subservices: [
      { title: 'Content production', body: 'Reels, statics and short-form video produced in-house at the volume a testing engine needs.' },
      { title: 'Community management', body: 'Comments, DMs and engagement handled like the trust-and-retention channel it actually is.' },
      { title: 'Creator and UGC', body: 'Sourcing and running creator and UGC content that fuels both organic and paid.' },
      { title: 'Channel strategy', body: 'The right platform mix for your brand and buyer, from Instagram to YouTube and beyond, not a fixed package.' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'Organic social that feeds performance, with one creative engine behind both your content and your ads.',
      included: [
        'A real content calendar, with reels and statics produced at volume',
        'Community management on comments and DMs, where trust gets built',
        'Creator and UGC sourcing that fuels organic and paid alike',
        'The right platform mix for your brand, not a fixed package',
        'Content built to be tested, so it makes your paid work harder',
      ],
      note: 'Priced by scope: how much content, how many channels, and whether creators are in the mix. We quote inside two working days.',
    },
    notForYou: [
      'Brands chasing follower counts as the goal. We build social that supports revenue, and we will measure it that way.',
      'Anyone who wants a purely automated, template posting service. That is not what moves a brand.',
      'Businesses with no interest in showing up as themselves. Founder-led social wins; faceless brand-speak rarely does.',
    ],
    faqs: [
      { q: 'How much does social media management cost?', a: 'It is priced by scope: how much content you need each month, how many channels you run, and whether creators are involved. Tell us what you need and you will have a quote within two working days. We do not publish a one-size price because social scope varies so widely.' },
      { q: 'Do followers actually matter?', a: 'Not on their own. We build organic social to do two jobs your P&L cares about: warm an audience so paid works harder, and produce the native content volume a testing pipeline needs. Follower count is a by-product of that, not the target we aim at.' },
      { q: 'Can social and paid ads work together?', a: 'That is exactly how we run it. One in-house creative engine feeds both organic and paid, so the content you post and the ads you run reinforce each other, and you get more out of every asset you produce.' },
      { q: 'Do you work with creators?', a: 'Yes. We source and run creator and UGC content that fuels both organic and paid. For founder- and creator-led brands we lean into that voice deliberately, because an operator’s perspective tends to beat polished brand-speak on social.' },
      { q: 'Do you handle social media for B2B brands?', a: 'Yes. Alongside D2C, Scaling Socials handles social media for B2B and service businesses, LinkedIn and founder-led content included, built to warm buyers and support lead generation rather than just to chase followers.' },
    ],
    formHeading: 'Get a free social review',
    formQuestions: [
      { name: 'platforms', label: 'Channels you care about', type: 'select', required: true, options: ['Instagram', 'YouTube', 'Instagram and YouTube', 'Other'] },
      { name: 'need', label: 'What you need', type: 'select', required: false, options: ['Content production', 'Community management', 'Both', 'Creator/UGC'] },
    ],
  },
  {
    slug: 'conversion-rate-optimisation',
    url: '/conversion-rate-optimisation-services/',
    name: 'Conversion rate optimisation',
    eyebrow: 'Conversion rate optimisation',
    title: 'Conversion Rate Optimisation Services | Scaling Socials',
    description:
      'Scaling Socials runs conversion rate optimisation for D2C and ecommerce brands in India and the UAE — fixing the leaks between click and checkout.',
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
    value: {
      heading: 'What you get for your money',
      lede: 'More revenue from the traffic you already pay for, which is the cheapest growth you have.',
      included: [
        'A full funnel audit from session recordings, analytics and heatmaps',
        'Product page, cart and checkout tested where it matters most',
        'Message-matched landing pages for paid traffic',
        'A/B tests run and read properly, so real winners actually ship',
        'A conversion lift that lowers your effective CAC across every channel',
      ],
      note: 'Priced by scope and traffic. There has to be enough volume to test cleanly. We quote inside two working days.',
    },
    notForYou: [
      'Stores with too little traffic to test cleanly. Below a few thousand sessions a month, put the money into acquisition first.',
      'Anyone wanting a redesign on gut feel. We test, and we will resist a change we cannot measure.',
      'Brands unwilling to ship changes. CRO only works if the winning tests actually go live.',
    ],
    faqs: [
      { q: 'What is conversion rate optimisation?', a: 'CRO is the practice of getting more of your existing traffic to buy, by finding and fixing the friction between the click and the checkout. It is usually the cheapest growth available, because it lifts revenue on spend you are already making.' },
      { q: 'How much does CRO cost?', a: 'It is priced by scope and by traffic. There has to be enough volume to test cleanly, and the work scales with how many tests you run and whether we build the variants for you. Tell us your store and monthly sessions and you will have a quote within two working days.' },
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
