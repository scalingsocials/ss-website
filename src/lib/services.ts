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
      'Scaling Socials is a performance marketing agency in Bangalore that runs Meta and Google Ads for D2C and ecommerce brands in India and the UAE. We manage campaigns to your real P&L, not platform-reported ROAS. Performance marketing starts at ₹25,000 a month; ad spend is separate and never marked up.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'ROAS that shows up in your bank account, not just the dashboard',
      paras: [
        'Most brands we audit are optimising to a platform-reported ROAS that quietly overstates real revenue. We start from your break-even ROAS — your actual gross margin — and buy media against that. If a campaign clears break-even, it scales; if it doesn’t, it gets cut. That is the whole discipline.',
        'Creative is where performance is won or lost. We produce video-led ads in-house, test angles in a structured pipeline, and let the market — not opinion — decide the winners. The account structure exists to serve the creative, not the other way round.',
        'You get a shared Slack channel, a live dashboard, and a monthly read on what changed and why. No vanity slides, no jargon — the numbers that move your P&L.',
      ],
    },
    subheading: 'What performance marketing with us includes',
    subservices: [
      { title: 'Meta Ads', body: 'Full-funnel Meta and Instagram: prospecting, retargeting, Advantage+ where it beats manual, and a creative pipeline behind it.', href: '/meta-ads-agency-india/' },
      { title: 'Google Ads', body: 'Search, Shopping and Performance Max built around real search intent and your margin, not just impression share.', href: '/google-ads-agency-bangalore/' },
      { title: 'Ecommerce PPC', body: 'Catalogue-led buying across Meta and Google for stores with real SKUs and real seasonality.', href: '/ecommerce-ppc-services/' },
      { title: 'Conversion rate optimisation', body: 'We fix the leaks between the click and the checkout so the traffic you buy actually converts.', href: '/conversion-rate-optimisation-services/' },
    ],
    comparison: {
      heading: 'Meta Advantage+ vs a manual campaign structure',
      cols: ['', 'Advantage+ only', 'Manual only', 'How we run it'],
      rows: [
        ['Best for', 'Simple catalogues, broad appeal', 'Tight targeting, complex funnels', 'Both, by account'],
        ['Creative demand', 'High', 'Moderate', 'High — it’s the lever'],
        ['Control', 'Low', 'High', 'As much as the data earns'],
        ['Risk', 'Overspend on weak creative', 'Slow to scale', 'Tested against break-even'],
      ],
      highlightCol: 3,
      caption: 'We use Advantage+ where it genuinely beats manual, and manual where control pays for itself.',
    },
    value: {
      heading: 'What you get for your money',
      lede: 'One team running media, creative and CRO to your P&L — not a media buyer optimising to a dashboard.',
      included: [
        'A senior team on your account — media, creative and CRO, never a junior with a template',
        'Ad creative produced in-house and tested every week',
        'A live dashboard and a shared Slack channel, so you always know what changed',
        'Weekly optimisation against your break-even ROAS and a monthly strategy read',
        'Ad spend paid directly to the platforms — we never mark it up',
      ],
      price: '₹25,000/month',
      note: 'Where you land depends on ad spend and creative volume. Managing ₹1L a month and ₹20L a month are different jobs.',
    },
    notForYou: [
      'Pre-launch brands with no data to work from. We can’t optimise an empty account.',
      'Anyone chasing a guaranteed ROAS number. We work to your margin and we won’t promise a figure we can’t control.',
      'Brands unwilling to produce creative. On Meta, creative is the growth lever — without a steady supply, there is little for us to scale.',
    ],
    faqs: [
      { q: 'How much does a performance marketing agency cost in India?', a: 'Scaling Socials starts performance marketing at ₹25,000 a month. The final number depends on your ad spend, how many platforms you run, and how much creative you need produced. Ad spend is separate and paid directly to Meta or Google — we never mark it up.' },
      { q: 'What ROAS can you promise?', a: 'None, honestly. Any agency promising a fixed ROAS is guessing. We target your break-even ROAS — the number set by your margins — and scale what clears it. We’ll show you the maths in the first audit so the target is yours, not ours.' },
      { q: 'Do you make the ad creative?', a: 'Yes. We produce statics and video-led ads in-house and run a structured testing pipeline. Creative is the single biggest lever in performance today, so it’s core to the engagement, not an add-on.' },
      { q: 'How soon do we see results?', a: 'The first audit lands in three working days. Meaningful account changes take a testing cycle — usually 30 to 60 days to read signal cleanly — before we scale what works. We won’t scale spend on unproven creative to show early numbers.' },
      { q: 'Which platforms do you run?', a: 'Primarily Meta (Facebook and Instagram) and Google (Search, Shopping, Performance Max), plus Amazon and YouTube where they fit the brand. We recommend the mix from your margins and buyer, not a fixed package.' },
      { q: 'Do you run ads for B2B or lead-generation businesses?', a: 'Yes. Alongside D2C and ecommerce, Scaling Socials runs performance marketing for B2B and service businesses — lead-generation campaigns on Meta and Google, with landing pages and tracking built to fill your pipeline, measured on cost per qualified lead rather than ROAS.' },
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
      'Scaling Socials is an SEO agency in Bangalore that grows organic traffic and revenue for D2C and ecommerce brands in India and the UAE. We handle technical, on-page and local SEO, and answer-engine optimisation, tied to revenue rather than rankings for their own sake. SEO starts at ₹25,000 a month.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'Rankings are a means; organic revenue is the point',
      paras: [
        'A first-page ranking that no one searches for is worth nothing. We start from the queries your buyers actually type — commercial and category terms with intent — and build the pages, structure and authority to win them. Traffic is measured against the revenue it drives, not vanity keyword counts.',
        'For ecommerce, technical health is half the battle: crawlability, site speed, category and product page structure, and clean internal linking. We fix the foundations first, then earn the content and links that compound.',
        'We also build for answer engines. When a founder asks ChatGPT or Google’s AI Overview a question in your category, structured, well-cited pages are what get quoted. That is where organic is heading, and most of your competitors aren’t ready for it.',
      ],
    },
    subheading: 'What SEO with us includes',
    subservices: [
      { title: 'Ecommerce SEO', body: 'Category and product page optimisation, structured data, and internal linking built for stores with real catalogues.', href: '/ecommerce-seo-services/' },
      { title: 'Technical SEO audits', body: 'Crawlability, speed, indexation and structure — the foundations that decide whether content ever ranks.', href: '/technical-seo-audit-services/' },
      { title: 'Local SEO', body: 'Google Business Profile, citations and local pages for brands that also sell or serve in a city.', href: '/local-seo-services-bangalore/' },
      { title: 'Answer engine optimisation', body: 'Structuring content so it gets cited in AI Overviews and by ChatGPT, Perplexity and Gemini.', href: '/answer-engine-optimisation-services/' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'Organic growth that compounds — technical foundations, content and authority, all tied to revenue.',
      included: [
        'A full technical audit and the fixes that unblock rankings',
        'Category and product pages optimised for terms that convert',
        'Content and internal linking that build topical authority',
        'Answer-engine optimisation, so you get cited in AI Overviews and ChatGPT',
        'A monthly report tied to organic revenue, not vanity keyword counts',
      ],
      price: '₹25,000/month',
      note: 'Where you land depends on keyword count and difficulty. SEO compounds over quarters, not weeks.',
    },
    notForYou: [
      'Brands that need revenue this month. SEO compounds over quarters; if you need sales now, start with performance marketing.',
      'Anyone wanting to buy links or game rankings. We build the kind of authority that survives an algorithm update.',
      'Sites with no product-market fit yet. SEO amplifies demand; it doesn’t create it.',
    ],
    faqs: [
      { q: 'How much does SEO cost in India?', a: 'Scaling Socials starts SEO at ₹25,000 a month. The final number depends on how many keywords you target and how competitive they are, how many pages need writing, and how much technical and link work is in scope.' },
      { q: 'How long does SEO take to work?', a: 'Expect the first ranking and traffic movement in roughly 8 to 12 weeks, and the meaningful revenue curve after two quarters. Anyone promising page one in 30 days is either buying risky links or targeting terms no one searches.' },
      { q: 'What is answer engine optimisation?', a: 'It’s structuring your content so it gets quoted inside AI answers — Google’s AI Overviews and tools like ChatGPT and Perplexity. It rewards specific, well-structured, well-cited pages, and almost nobody in this market is doing it yet.' },
      { q: 'Do you do technical SEO?', a: 'Yes, and we usually start there. Crawlability, site speed, indexation, structured data and internal linking decide whether your content can ever rank. We run a full technical audit and fix the foundations before scaling content.' },
      { q: 'Can you do SEO and performance marketing together?', a: 'Yes — many clients run both. Paid buys demand today while SEO compounds for tomorrow, and the data from each improves the other. We keep them on one team and one number so they don’t work at cross purposes.' },
      { q: 'Do you do SEO for B2B or service businesses?', a: 'Yes. Beyond ecommerce, Scaling Socials runs SEO for B2B and service businesses. The technical and intent work is similar — we target the commercial and service queries your buyers actually search, and build the pages that turn them into leads.' },
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
      'Scaling Socials is a Shopify development company in Bangalore that builds, migrates and optimises stores for D2C and ecommerce brands in India and the UAE. We build for conversion and speed, not just looks — the store is where your ad spend either pays off or leaks. Pricing is scoped to the build.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'A beautiful store that converts, not just one that photographs well',
      paras: [
        'A store’s job is to turn expensive traffic into orders. We build Shopify themes around the product page, cart and checkout — the three screens that decide your conversion rate — and we measure the build by what it does to your revenue per session, not by how it looks in a mockup.',
        'Speed is conversion. A store that loads in four seconds loses buyers before they see the product, and it quietly raises your ad costs too. We build lean, and for existing stores we run a dedicated speed pass that targets Core Web Vitals.',
        'Because we also run the ads, the store and the acquisition talk to each other. Landing pages match the creative, tracking is clean, and there’s no finger-pointing between the media team and the dev team — it’s one team.',
      ],
    },
    subheading: 'What Shopify work with us includes',
    subservices: [
      { title: 'Store builds', body: 'New Shopify stores built around the product page, cart and checkout, with clean tracking from day one.' },
      { title: 'Store migration', body: 'Moving from WooCommerce, Wix or Magento to Shopify without losing SEO, URLs or order history.', href: '/shopify-store-migration-services/' },
      { title: 'Speed optimisation', body: 'A dedicated pass on Core Web Vitals and load time — because speed is conversion and cheaper ads.', href: '/shopify-speed-optimisation-services/' },
      { title: 'Store redesign', body: 'Rebuilding an existing store around what actually converts, informed by session and heatmap data.', href: '/shopify-store-redesign-services/' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'A store built around revenue per session — fast, clean to track, and made to convert paid traffic.',
      included: [
        'A theme built around the product page, cart and checkout',
        'Core Web Vitals and load time optimised from the start',
        'Clean tracking and analytics wired in on day one',
        'A build your team can run without a developer on standby',
        'Honest advice — if a template fits you better than custom, we say so',
      ],
      note: 'Priced by scope — a speed pass differs from a full custom build or a migration. We quote in two working days.',
    },
    notForYou: [
      'Anyone who wants the cheapest possible theme install. A template store is fine — you don’t need us for that.',
      'Brands that want looks over conversion. We build for revenue per session, and we’ll push back on pretty-but-slow.',
      'Marketplaces or platforms that genuinely need custom backend engineering beyond Shopify.',
    ],
    faqs: [
      { q: 'How much does Shopify development cost?', a: 'It depends on scope — a speed optimisation pass, a full custom build and a migration with thousands of SKUs are very different jobs. Tell us what you need and we’ll give you a fixed quote within two working days. We never publish a number we can’t honour.' },
      { q: 'Can you migrate my store to Shopify?', a: 'Yes. We migrate from WooCommerce, Wix, Magento and others to Shopify while preserving your URLs and SEO with a proper 301 map, plus product data and order history. Losing rankings in a migration is avoidable, and we plan for it up front.' },
      { q: 'Will you make my store faster?', a: 'Yes — we run a dedicated speed pass targeting Core Web Vitals and real load time. Speed is conversion: a faster store turns more of your paid traffic into orders and lowers your effective ad cost.' },
      { q: 'Do you also run the ads for the store you build?', a: 'Often, yes. Because we run performance marketing too, the store and the acquisition are built to work together — landing pages match the creative and tracking is clean, so there’s no gap between the media and the dev.' },
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
      'Scaling Socials is a web development company in Bangalore that builds fast, measurable websites and landing pages for D2C and ecommerce brands in India and the UAE. We build sites that sell — quick to load, clean to track, and designed around the action you want a visitor to take. Pricing is scoped to the project.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'A site is a sales tool, measured like one',
      paras: [
        'A website exists to move a visitor toward one action — a purchase, a lead, a booking. We design around that action, build it to load fast, and wire clean analytics so you can actually see what’s working. Pretty is table stakes; measurable is the point.',
        'For ad-driven brands, landing pages are where the money is made or lost. We build message-matched pages that carry the promise of the ad through to the offer, with sub-1.5-second load times that protect your Quality Score and your budget.',
        'We build on the right tool for the job — Shopify for stores, a fast static or headless stack for content and landing pages — and we hand you something your team can actually run without a developer on standby.',
      ],
    },
    subheading: 'What web development with us includes',
    subservices: [
      { title: 'Websites', body: 'Fast, measurable marketing and brand sites built around a clear action and clean tracking.' },
      { title: 'Landing pages', body: 'Message-matched, sub-1.5s landing pages for ad campaigns that protect Quality Score and convert.' },
      { title: 'Rebuilds and migrations', body: 'Replacing a slow WordPress build with a fast modern stack, without losing your SEO.' },
      { title: 'Analytics and tracking', body: 'Clean GA4, server-side events and dashboards so decisions are made on real data, not guesses.' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'A site that sells — fast to load, clear on one action, and measurable so you can see what works.',
      included: [
        'Design around a single clear action, not decoration',
        'Sub-1.5s load times that protect Quality Score and budget',
        'Clean GA4 and event tracking, so decisions run on data',
        'Message-matched landing pages for your ad campaigns',
        'A stack your team can actually run and update',
      ],
      note: 'Priced by scope — landing pages differ from a full brand-site rebuild. We quote in two working days.',
    },
    notForYou: [
      'Anyone who just needs a one-page template site — a builder like Wix or Framer will serve you fine.',
      'Projects that need heavy custom backend engineering or a mobile app; that’s outside our lane.',
      'Brands that want a redesign with no way to measure whether it worked. We build to be measured.',
    ],
    faqs: [
      { q: 'How much does a website cost?', a: 'It depends on scope — a few landing pages and a full brand-site rebuild are very different projects. Tell us what you need and we’ll give you a fixed quote within two working days. We won’t publish a headline price we can’t stand behind.' },
      { q: 'Why does site speed matter?', a: 'Speed is money. A slow site loses visitors before they act, and for ad-driven pages it lowers your Quality Score and raises your cost per click. We build to load in well under two seconds, which protects both conversion and budget.' },
      { q: 'Can you rebuild my slow WordPress site?', a: 'Yes. We move brands off slow WordPress builds onto a fast modern stack while preserving SEO with a proper redirect map. You keep your rankings and gain the speed, and your team can run it without a developer on standby.' },
      { q: 'Do you build landing pages for ads?', a: 'Yes, and it’s one of the highest-return things we do. Message-matched landing pages that load fast convert far better than sending paid traffic to a generic homepage, and because we run the ads too, the page and the creative are built together.' },
      { q: 'Do you build websites for B2B or lead-gen businesses?', a: 'Yes. Beyond ecommerce, Scaling Socials builds fast, measurable websites and lead-generation landing pages for B2B and service businesses — designed around the enquiry or booking you want, with clean tracking so you can see what converts.' },
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
      'Scaling Socials is a social media marketing agency in Bangalore that handles content, community and creator-led growth for D2C and ecommerce brands in India and the UAE. We build organic social that supports paid and compounds brand — not vanity follower counts. Pricing is scoped to the work.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'Organic social that feeds performance, not a follower vanity chase',
      paras: [
        'Followers don’t pay invoices. We build organic social that does two jobs your P&L cares about: it warms an audience so paid works harder, and it produces the volume of native content that a testing pipeline needs. The content and the ads share one creative engine.',
        'That means a real content calendar, reels and statics produced at volume, and a community managed like it matters — because the comments and DMs are where trust and repeat purchase are built.',
        'For founder- and creator-led brands, we lean into that advantage: an operator’s point of view outperforms polished brand-speak on social, and we’d rather help you sound like you than like every other D2C account.',
      ],
    },
    subheading: 'What social media marketing with us includes',
    subservices: [
      { title: 'Content production', body: 'Reels, statics and short-form video produced in-house at the volume a testing engine needs.' },
      { title: 'Community management', body: 'Comments, DMs and engagement handled like the trust-and-retention channel it actually is.' },
      { title: 'Creator and UGC', body: 'Sourcing and running creator and UGC content that fuels both organic and paid.' },
      { title: 'Channel strategy', body: 'The right platform mix for your brand and buyer — Instagram, YouTube and beyond — not a fixed package.' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'Organic social that feeds performance — one creative engine behind both your content and your ads.',
      included: [
        'A real content calendar, with reels and statics at volume',
        'Community management on comments and DMs, where trust is built',
        'Creator and UGC sourcing that fuels organic and paid',
        'The right platform mix for your brand, not a fixed package',
        'Content built to be tested, so it makes your paid work harder',
      ],
      note: 'Priced by scope — how much content, how many channels, and whether creators are in the mix. We quote in two working days.',
    },
    notForYou: [
      'Brands chasing follower counts as the goal. We build social that supports revenue, and we’ll measure it that way.',
      'Anyone who wants a purely automated, template posting service. That’s not what moves a brand.',
      'Businesses with no interest in showing up as themselves. Founder-led social wins; faceless brand-speak rarely does.',
    ],
    faqs: [
      { q: 'How much does social media management cost?', a: 'It’s priced by scope — how much content you need each month, how many channels you run, and whether creators are involved. Tell us what you need and we’ll quote within two working days. We don’t publish a one-size price because social scope varies widely.' },
      { q: 'Do followers actually matter?', a: 'Not on their own. We build organic social to do two things your P&L cares about: warm an audience so paid works harder, and produce the native content volume a testing pipeline needs. Follower count is a byproduct, not the target.' },
      { q: 'Can social and paid ads work together?', a: 'That’s exactly how we run it. The same in-house creative engine feeds both organic and paid, so the content you post and the ads you run reinforce each other and you get more from every asset produced.' },
      { q: 'Do you work with creators?', a: 'Yes. We source and run creator and UGC content that fuels both organic and paid. For founder- and creator-led brands, we lean into that voice deliberately — an operator’s perspective outperforms polished brand-speak on social.' },
      { q: 'Do you handle social media for B2B brands?', a: 'Yes. Alongside D2C, Scaling Socials handles social media for B2B and service businesses — LinkedIn and founder-led content included — built to warm buyers and support lead generation, not just to chase followers.' },
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
      'Scaling Socials runs conversion rate optimisation for D2C and ecommerce brands in India and the UAE. We find and fix the leaks between the click and the checkout — product page, cart and checkout — so the traffic you already pay for converts more often. CRO is priced by scope and pays for itself fastest.',
    intro: {
      eyebrow: 'What it means for your P&L',
      heading: 'The cheapest growth you have is the traffic you already buy',
      paras: [
        'Before spending more on ads, it’s almost always cheaper to convert more of the traffic you already have. A lift from 1.5% to 2.2% conversion is a 47% revenue increase on the same spend — and it lowers your effective CAC across every channel at once.',
        'We work from data, not opinion: session recordings, funnel analytics and heatmaps tell us where buyers drop off. Then we test the fixes — product page, cart, checkout, mobile — and keep what wins. No redesign-by-vibes.',
        'CRO compounds with everything else we do. A higher-converting store makes the ads profitable at a higher CAC, which lets performance scale further. It’s the quiet multiplier on the whole account.',
      ],
    },
    subheading: 'What CRO with us includes',
    subservices: [
      { title: 'Funnel audit', body: 'Session recordings, analytics and heatmaps to find exactly where buyers drop off and why.' },
      { title: 'Product page optimisation', body: 'The screen that decides most purchases — layout, trust, offer and speed, tested.' },
      { title: 'Cart and checkout', body: 'Reducing the friction and abandonment in the two steps closest to the money.' },
      { title: 'Landing page testing', body: 'Message-matched pages for paid traffic, tested against real conversion, not opinion.' },
    ],
    value: {
      heading: 'What you get for your money',
      lede: 'More revenue from the traffic you already pay for — the cheapest growth you have.',
      included: [
        'A full funnel audit from session recordings, analytics and heatmaps',
        'Product page, cart and checkout tested where it matters most',
        'Message-matched landing pages for paid traffic',
        'A/B tests run and read properly, so winners actually ship',
        'A conversion lift that lowers your effective CAC across every channel',
      ],
      note: 'Priced by scope and traffic — there needs to be enough volume to test cleanly. We quote in two working days.',
    },
    notForYou: [
      'Stores with too little traffic to test cleanly. Below a few thousand sessions a month, spend on acquisition first.',
      'Anyone wanting a redesign on gut feel. We test, and we’ll resist changes we can’t measure.',
      'Brands unwilling to ship changes. CRO only works if winning tests actually go live.',
    ],
    faqs: [
      { q: 'What is conversion rate optimisation?', a: 'CRO is the practice of getting more of your existing traffic to buy — by finding and fixing the friction between the click and the checkout. It’s usually the cheapest growth available, because it lifts revenue on spend you’re already making.' },
      { q: 'How much does CRO cost?', a: 'It’s priced by scope and by traffic. There has to be enough volume to test cleanly, and the work scales with how many tests you run and whether we build the variants. Tell us your store and monthly sessions and we’ll quote in two working days.' },
      { q: 'How much can CRO actually lift revenue?', a: 'It compounds fast: moving from 1.5% to 2.2% conversion is roughly a 47% revenue increase on the same traffic and spend. It also lowers your effective CAC across every channel, which lets performance marketing scale further.' },
      { q: 'Do I need enough traffic for CRO?', a: 'Yes — CRO needs a few thousand sessions a month to test cleanly. If you’re below that, we’ll be honest and tell you to start with acquisition first, then bring in CRO once there’s enough volume to read results.' },
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
