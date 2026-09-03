/**
 * Service cluster content — the focused sub-service pages under each pillar.
 * See 02 §1. Concise but real; each links up to its pillar and across to siblings.
 * Meta titles 50–60, descriptions 140–158 (enforced at build).
 */
export interface Cluster {
  slug: string;
  url: string;
  name: string;
  parentSlug: string;
  parentName: string;
  parentUrl: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const CLUSTERS: Cluster[] = [
  {
    slug: 'meta-ads', url: '/meta-ads-agency-india/', name: 'Meta Ads', parentSlug: 'performance-marketing', parentName: 'Performance marketing', parentUrl: '/performance-marketing-agency-bangalore/',
    title: 'Meta Ads Agency in India for D2C Brands | Scaling Socials',
    description: 'Scaling Socials is a Meta Ads agency for D2C brands in India and the UAE — full-funnel Facebook and Instagram ads, run to your margin with in-house creative.',
    h1: 'Meta Ads agency for D2C brands in India',
    answer: 'Scaling Socials runs full-funnel Meta advertising — Facebook and Instagram — for D2C and ecommerce brands in India and the UAE. Prospecting, retargeting and Advantage+ where it beats manual, all fed by an in-house creative pipeline and managed to your real margin.',
    sections: [
      { heading: 'Creative is the lever, not the settings', body: 'On Meta today, the account structure matters far less than the volume and quality of creative going through it. We produce statics and video-led ads in-house and run a structured testing pipeline, so winners are found by the market, not by opinion. That is where the scaling comes from.' },
      { heading: 'Advantage+ where it earns its place', body: 'We use Advantage+ Shopping when it genuinely beats a manual structure, and manual control where it pays for itself — decided by your data and margin, never by a fixed package. Everything is measured against your break-even ROAS.' },
    ],
    faqs: [
      { q: 'How much do Meta ads cost with an agency in India?', a: 'Scaling Socials starts performance marketing at ₹25,000 a month; your fee depends on ad spend and creative volume. Your Meta ad spend is separate, paid directly to Meta, and never marked up by us.' },
      { q: 'Do you make the Meta ad creative?', a: 'Yes — statics and video-led ads produced in-house and tested in a structured pipeline. Creative is the single biggest lever on Meta, so it is core to the engagement, not an add-on.' },
      { q: 'Should I use Advantage+ or manual campaigns?', a: 'It depends on your catalogue and funnel. We use Advantage+ where it beats manual and manual where control pays off, and we test both against your break-even ROAS rather than following a rule of thumb.' },
    ],
  },
  {
    slug: 'google-ads', url: '/google-ads-agency-bangalore/', name: 'Google Ads', parentSlug: 'performance-marketing', parentName: 'Performance marketing', parentUrl: '/performance-marketing-agency-bangalore/',
    title: 'Google Ads Agency in Bangalore for D2C | Scaling Socials',
    description: 'Scaling Socials is a Google Ads agency in Bangalore for D2C brands — Search, Shopping and Performance Max built around intent and margin, not impressions.',
    h1: 'Google Ads agency in Bangalore',
    answer: 'Scaling Socials runs Google Ads — Search, Shopping and Performance Max — for D2C and ecommerce brands in India and the UAE. We build around real search intent and your margin, capturing demand profitably rather than buying impression share for its own sake.',
    sections: [
      { heading: 'Intent first, then structure', body: 'Google is where demand that already exists gets captured. We map the queries your buyers actually use — from high-intent product terms to category research — and build Search and Shopping around them, so you pay for clicks that are close to a purchase, not just traffic.' },
      { heading: 'Performance Max, on a leash', body: 'Performance Max can scale, but it can also quietly spend on the wrong things. We feed it clean data, guard it with the right structure and exclusions, and hold it to your break-even ROAS so it works for your P&L, not Google’s.' },
    ],
    faqs: [
      { q: 'How much does a Google Ads agency cost in India?', a: 'Scaling Socials starts performance marketing at ₹25,000 a month, depending on spend and scope. Your Google ad spend is separate, paid directly to Google, and never marked up by us.' },
      { q: 'Do you run Performance Max?', a: 'Yes, where it fits — with clean data, the right exclusions and structure, and held to your break-even ROAS. We don’t hand it a blank cheque; it earns budget by clearing your margin.' },
      { q: 'Search or Shopping — which do I need?', a: 'For most ecommerce brands, both: Search for high-intent queries and Shopping and Performance Max for catalogue-led buying. We recommend the mix from your products and margins, not a template.' },
    ],
  },
  {
    slug: 'ecommerce-ppc', url: '/ecommerce-ppc-services/', name: 'Ecommerce PPC', parentSlug: 'performance-marketing', parentName: 'Performance marketing', parentUrl: '/performance-marketing-agency-bangalore/',
    title: 'Ecommerce PPC Services for D2C Brands | Scaling Socials',
    description: 'Scaling Socials runs ecommerce PPC across Meta and Google for D2C brands — catalogue-led paid media built around your real SKUs, seasonality and margin.',
    h1: 'Ecommerce PPC services for D2C brands',
    answer: 'Scaling Socials runs ecommerce PPC across Meta and Google for D2C and ecommerce brands in India and the UAE. Catalogue-led buying built around your real SKUs, seasonality and margin — so paid media scales the products that make money, not just the ones that get clicks.',
    sections: [
      { heading: 'Built for real catalogues', body: 'Ecommerce PPC is different from lead-gen PPC. It lives and dies on your product feed, your bestsellers, your margins per SKU and your seasonality. We structure buying around all of that, so spend follows the products that actually contribute profit.' },
      { heading: 'One number across channels', body: 'We run Meta and Google as one account with one target — your blended, margin-aware return — rather than letting each platform optimise to its own flattering metric. That’s how you avoid paying twice for the same sale.' },
    ],
    faqs: [
      { q: 'What is ecommerce PPC?', a: 'Ecommerce PPC is paid advertising built around a product catalogue — Meta and Google Shopping, Performance Max and Search — optimised to sell SKUs profitably rather than just drive clicks. It’s tied to your feed, margins and seasonality.' },
      { q: 'How much does ecommerce PPC cost?', a: 'Scaling Socials starts at ₹25,000 a month, depending on spend and scope. Ad spend is separate, paid to the platforms directly, and never marked up.' },
      { q: 'Do you manage the product feed?', a: 'Yes — a clean, well-structured product feed is half of ecommerce PPC. We optimise it so Shopping and Performance Max have the data they need to sell your catalogue efficiently.' },
    ],
  },
  {
    slug: 'ecommerce-seo', url: '/ecommerce-seo-services/', name: 'Ecommerce SEO', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Ecommerce SEO Services for D2C Stores | Scaling Socials',
    description: 'Scaling Socials runs ecommerce SEO for D2C and Shopify brands — category and product page optimisation, structure and internal linking that grows revenue.',
    h1: 'Ecommerce SEO services for D2C stores',
    answer: 'Scaling Socials runs ecommerce SEO for D2C and Shopify brands in India and the UAE. We optimise category and product pages, structured data and internal linking so your store earns organic traffic that converts — measured by revenue, not vanity keyword counts.',
    sections: [
      { heading: 'Category pages are your money pages', body: 'For an ecommerce store, category and collection pages are usually the biggest organic opportunity. We optimise them for the commercial terms your buyers search, with the content, structure and internal links to actually rank and convert.' },
      { heading: 'Structure that scales with your catalogue', body: 'A growing store needs clean architecture — logical collections, structured data, and internal linking that spreads authority to the pages you most want ranked. We build that foundation so new products rank faster.' },
    ],
    faqs: [
      { q: 'How is ecommerce SEO different from normal SEO?', a: 'It centres on category and product pages, product structured data, faceted navigation and internal linking across a catalogue — the things that decide whether a store ranks and converts, rather than a handful of blog posts.' },
      { q: 'How much does ecommerce SEO cost?', a: 'Scaling Socials starts SEO at ₹25,000 a month, depending on keyword count, difficulty and how many pages need work. It compounds over quarters rather than paying off instantly.' },
      { q: 'Does SEO work with my paid ads?', a: 'Yes — the two share data and reinforce each other. SEO lowers your reliance on paid over time, and the query and conversion data from ads sharpens which organic terms to prioritise.' },
    ],
  },
  {
    slug: 'technical-seo-audit', url: '/technical-seo-audit-services/', name: 'Technical SEO audits', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Technical SEO Audit Services | Scaling Socials Bangalore',
    description: 'Scaling Socials runs technical SEO audits for D2C and ecommerce sites — crawlability, speed, indexation and structure, with a prioritised fix list by impact.',
    h1: 'Technical SEO audit services',
    answer: 'Scaling Socials runs technical SEO audits for D2C and ecommerce sites in India and the UAE. We check crawlability, site speed, indexation, structured data and internal linking, and hand you a prioritised fix list ranked by impact — the foundation that decides whether content can ever rank.',
    sections: [
      { heading: 'Foundations first', body: 'Content and links can’t rank a site that search engines can’t crawl, that loads slowly, or that has its pages competing with each other. A technical audit finds those problems and ranks the fixes by how much they’re costing you.' },
      { heading: 'A fix list, not a 90-page PDF', body: 'You get a prioritised, plain-English list of what to fix and why — and, if you want, we do the fixing. No box-ticking report you’ll never action.' },
    ],
    faqs: [
      { q: 'What does a technical SEO audit cover?', a: 'Crawlability and indexation, site speed and Core Web Vitals, site architecture, structured data, internal linking, duplicate content and mobile usability — the technical foundations that decide whether your content can rank.' },
      { q: 'How much does a technical SEO audit cost?', a: 'It’s part of an SEO engagement, which starts at ₹25,000 a month, or can be scoped as a one-off audit. Tell us your site and we’ll quote.' },
      { q: 'Will you fix the issues or just report them?', a: 'Either. You get a prioritised fix list you could hand to any developer, and we’re happy to implement the fixes ourselves if you’d rather we handle it.' },
    ],
  },
  {
    slug: 'local-seo', url: '/local-seo-services-bangalore/', name: 'Local SEO', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Local SEO Services in Bangalore for Brands | Scaling Socials',
    description: 'Scaling Socials runs local SEO in Bangalore — Google Business Profile, citations and local pages that get brands found by nearby, ready-to-buy customers.',
    h1: 'Local SEO services in Bangalore',
    answer: 'Scaling Socials runs local SEO for brands that also sell or serve in a city. We optimise your Google Business Profile, build consistent citations, and create local pages so nearby buyers with high intent find you first. Part of an SEO engagement from ₹25,000 a month.',
    sections: [
      { heading: 'The map pack is its own game', body: 'Ranking in Google’s local map pack depends on your Business Profile, consistent name-address-phone details across the web, and genuine reviews — not the same signals as regular organic. We handle all three.' },
      { heading: 'Consistency wins', body: 'Inconsistent listings are the most common reason local rankings fail. We make your NAP identical everywhere it appears and keep your profile complete and active, which is what local ranking rewards.' },
    ],
    faqs: [
      { q: 'What is local SEO?', a: 'Local SEO is getting found by nearby searchers — in Google’s map pack and local results — through your Google Business Profile, consistent citations, reviews and location pages. It matters for any brand with a city presence.' },
      { q: 'How much does local SEO cost?', a: 'It’s part of an SEO engagement, from ₹25,000 a month, scoped to how many locations and how competitive your city and category are.' },
      { q: 'Do reviews matter for local SEO?', a: 'A lot. Review count, recency and rating are strong local ranking and conversion signals. We help you build a systematic review request into your offboarding and quarterly reviews.' },
    ],
  },
  {
    slug: 'answer-engine-optimisation', url: '/answer-engine-optimisation-services/', name: 'Answer engine optimisation', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Answer Engine Optimisation Services | Scaling Socials',
    description: 'Scaling Socials offers answer engine optimisation — structuring content so it gets cited in Google AI Overviews and by ChatGPT, Perplexity and Gemini.',
    h1: 'Answer engine optimisation (AEO) services',
    answer: 'Scaling Socials offers answer engine optimisation — structuring your content so it gets quoted inside AI answers, from Google’s AI Overviews to ChatGPT, Perplexity and Gemini. It rewards specific, well-structured, well-cited pages, and almost nobody in India is doing it yet.',
    sections: [
      { heading: 'Search is being answered, not just ranked', body: 'More and more queries are answered directly by an AI, with a handful of cited sources. Being one of those citations is a new discipline: clear answer-first structure, definition sentences, tables, and genuine originating facts that models prefer to quote.' },
      { heading: 'First-mover advantage', body: 'Because so few brands in India optimise for this, the barrier is low and the upside is high. We build your key pages to be the source an answer engine reaches for in your category.' },
    ],
    faqs: [
      { q: 'What is answer engine optimisation (AEO)?', a: 'AEO is optimising content to be cited inside AI-generated answers — Google’s AI Overviews and tools like ChatGPT, Perplexity and Gemini — rather than only ranking in the classic blue links. It rewards structure, specificity and attribution.' },
      { q: 'How is AEO different from SEO?', a: 'SEO aims for a ranking position; AEO aims to be the passage an answer engine quotes. The tactics overlap but AEO leans harder on answer-first structure, definition sentences, tables and being the original source of a fact.' },
      { q: 'Is it too early to invest in AEO?', a: 'No — that’s the opportunity. Adoption of AI answers is rising fast while almost no brands in India optimise for it, so early, well-structured content can lock in citations before your competitors notice.' },
    ],
  },
  {
    slug: 'shopify-store-migration', url: '/shopify-store-migration-services/', name: 'Shopify store migration', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Store Migration Services | Scaling Socials',
    description: 'Scaling Socials migrates stores to Shopify from WooCommerce, Wix and Magento without losing SEO, URLs or order history — a planned, rankings-safe migration.',
    h1: 'Shopify store migration services',
    answer: 'Scaling Socials migrates D2C stores to Shopify from WooCommerce, Wix, Magento and others without losing SEO, URLs or order history. Losing rankings in a migration is avoidable — we plan the redirect map and data transfer up front so you keep your traffic and gain Shopify. Priced by scope.',
    sections: [
      { heading: 'The redirect map is everything', body: 'Most migrations lose traffic because old URLs quietly 404. We map every old URL to its new Shopify equivalent with clean 301s, so your rankings and the equity behind them carry across intact.' },
      { heading: 'Data, not just design', body: 'Products, variants, customers and order history all need to move cleanly. We handle the data migration alongside the theme so nothing important is left behind on the old platform.' },
    ],
    faqs: [
      { q: 'Will I lose SEO when migrating to Shopify?', a: 'Not with a planned migration. We build a complete redirect map from your old URLs to the new ones with proper 301s, so rankings and link equity transfer. Lost traffic in a migration is almost always avoidable.' },
      { q: 'What can you migrate from?', a: 'WooCommerce, Wix, Magento, custom builds and others. We move products, variants, customers and order history, and rebuild the theme on Shopify around conversion.' },
      { q: 'How long does a Shopify migration take?', a: 'It depends on catalogue size and custom features. We scope it up front and give you a fixed timeline and quote before starting.' },
    ],
  },
  {
    slug: 'shopify-speed-optimisation', url: '/shopify-speed-optimisation-services/', name: 'Shopify speed optimisation', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Speed Optimisation Services | Scaling Socials',
    description: 'Scaling Socials runs Shopify speed optimisation — a dedicated pass on Core Web Vitals and load time, because a faster store converts more paid traffic.',
    h1: 'Shopify speed optimisation services',
    answer: 'Scaling Socials runs Shopify speed optimisation — a dedicated pass on Core Web Vitals and real load time. Speed is conversion: a faster store turns more of your paid traffic into orders and lowers your effective ad cost. Priced by scope, and it usually pays for itself quickly.',
    sections: [
      { heading: 'Speed is money', body: 'A store that loads in four seconds loses buyers before they see the product, and it quietly raises your ad costs too. We target the things that actually move load time — images, apps, theme code and third-party scripts — not a vanity score.' },
      { heading: 'Real Core Web Vitals, not a lab number', body: 'We optimise for the field metrics Google and your customers actually experience, and we measure the impact on conversion, not just a speed grade.' },
    ],
    faqs: [
      { q: 'Why does Shopify store speed matter?', a: 'Speed directly affects conversion and ad costs. Slow stores lose buyers before they act and get penalised on ad quality, so a faster store makes the same traffic worth more. It’s often the cheapest conversion win available.' },
      { q: 'How much does Shopify speed optimisation cost?', a: 'It’s scoped to your store — how heavy your theme, apps and images are. Tell us your store and we’ll quote within two working days.' },
      { q: 'What slows a Shopify store down?', a: 'Usually oversized images, too many apps, heavy third-party scripts and bloated theme code. We audit all of these and fix the ones costing you the most load time and conversion.' },
    ],
  },
  {
    slug: 'shopify-store-redesign', url: '/shopify-store-redesign-services/', name: 'Shopify store redesign', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Store Redesign Services India | Scaling Socials',
    description: 'Scaling Socials redesigns Shopify stores for D2C brands — rebuilt around what actually converts, informed by session and heatmap data, not guesswork.',
    h1: 'Shopify store redesign services',
    answer: 'Scaling Socials redesigns Shopify stores for D2C and ecommerce brands in India and the UAE. We rebuild around what actually converts — product page, cart and checkout — informed by session recordings and heatmaps rather than opinion, so the new store lifts revenue, not just looks.',
    sections: [
      { heading: 'Redesign for conversion, not vibes', body: 'A redesign that looks better but converts worse is a loss. We start from your data — where buyers drop off, what they ignore, how they shop on mobile — and rebuild around the screens that decide purchases.' },
      { heading: 'Speed and tracking baked in', body: 'We rebuild lean and fast, with clean analytics from day one, so the new store is quick to load and you can actually measure whether the redesign worked.' },
    ],
    faqs: [
      { q: 'When should I redesign my Shopify store?', a: 'When your conversion rate has plateaued, your store is slow, or the design is fighting your growth. We’ll look at your session and analytics data first and tell you honestly whether a redesign or a set of targeted fixes is the better spend.' },
      { q: 'How much does a Shopify redesign cost?', a: 'It’s scoped to the work — a targeted rebuild of key pages differs from a full store redesign. Tell us your store and goals and we’ll quote within two working days.' },
      { q: 'Will a redesign improve conversion?', a: 'Only if it’s built from data. We base the redesign on where buyers actually drop off and test the changes, rather than redesigning on gut feel — which is how redesigns often lose conversion.' },
    ],
  },
];

export const CLUSTER_BY_SLUG = Object.fromEntries(CLUSTERS.map((c) => [c.slug, c]));
