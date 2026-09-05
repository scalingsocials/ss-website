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
    description: 'Scaling Socials is a Meta Ads agency for D2C brands in India and the UAE: full-funnel Facebook and Instagram ads, run to your margin with in-house creative.',
    h1: 'Meta Ads agency for D2C brands in India',
    answer: 'Scaling Socials runs full-funnel Meta advertising, across Facebook and Instagram, for D2C and ecommerce brands in India and the UAE. That means prospecting, retargeting, and Advantage+ where it beats manual, all fed by an in-house creative pipeline and managed to your real margin rather than a platform-flattered ROAS.',
    sections: [
      { heading: 'Creative is the lever, not the settings', body: 'On Meta today the account structure matters far less than the volume and quality of creative running through it. We produce statics and video-led ads in-house and put them through a structured testing pipeline, so winners get found by spend rather than by the loudest opinion in the room. That is where the scaling actually comes from.' },
      { heading: 'Advantage+ where it earns its place', body: 'We reach for Advantage+ Shopping when it genuinely beats a manual structure, and stay manual where the control pays for itself. Your data and your margin make that call, never a fixed package, and everything gets held to your break-even ROAS.' },
    ],
    faqs: [
      { q: 'How much do Meta ads cost with an agency in India?', a: 'Scaling Socials starts performance marketing at ₹25,000 a month, and your fee scales with ad spend and creative volume. Your Meta ad spend is separate, goes straight to Meta, and is never marked up by us.' },
      { q: 'Do you make the Meta ad creative?', a: 'Yes. We produce statics and video-led ads in-house and test them in a structured pipeline. Creative is the single biggest lever on Meta right now, so it sits at the core of the engagement rather than off to the side as an add-on.' },
      { q: 'Should I use Advantage+ or manual campaigns?', a: 'It depends on your catalogue and your funnel. We run Advantage+ where it beats manual and stay manual where control pays off, and we test both against your break-even ROAS instead of following a rule of thumb.' },
      { q: 'My Meta ads get traffic but no sales. Is it the ads?', a: 'Often it is not. The most common mistake we see in Indian D2C is blaming Meta for a problem sitting somewhere else — when traffic is healthy and purchases are not, the cause is usually the product, the price, the website or the content, and no amount of campaign restructuring fixes any of those. Scaling Socials checks the whole path from ad to checkout before rebuilding an account, and will tell you when the ads are not what is holding sales back.' },
    ],
  },
  {
    slug: 'google-ads', url: '/google-ads-agency-bangalore/', name: 'Google Ads', parentSlug: 'performance-marketing', parentName: 'Performance marketing', parentUrl: '/performance-marketing-agency-bangalore/',
    title: 'Google Ads Agency in Bangalore for D2C | Scaling Socials',
    description: 'Scaling Socials is a Google Ads agency in Bangalore for D2C brands: Search, Shopping and Performance Max built around intent and margin, not impressions.',
    h1: 'Google Ads agency in Bangalore',
    answer: 'Scaling Socials runs Google Ads for D2C and ecommerce brands in India and the UAE, across Search, Shopping and Performance Max. We build around real search intent and your margin, so you capture existing demand profitably instead of buying impression share for its own sake.',
    sections: [
      { heading: 'Intent first, then structure', body: 'Google is where demand that already exists gets captured. We map the queries your buyers really use, from high-intent product terms down to category research, and build Search and Shopping around them. The result is that you pay for clicks that sit close to a purchase, not just for traffic.' },
      { heading: 'Performance Max, on a leash', body: 'Performance Max can scale, and it can also quietly spend on the wrong things. We feed it clean data, fence it with the right structure and exclusions, and hold it to your break-even ROAS, so it works for your P&L rather than for Google’s.' },
    ],
    faqs: [
      { q: 'How much does a Google Ads agency cost in India?', a: 'Scaling Socials starts performance marketing at ₹25,000 a month, depending on your spend and scope. Your Google ad spend is separate, paid straight to Google, and never marked up by us.' },
      { q: 'Do you run Performance Max?', a: 'Yes, where it fits, with clean data, the right exclusions and a sensible structure, all held to your break-even ROAS. We do not hand it a blank cheque; it earns its budget by clearing your margin.' },
      { q: 'Search or Shopping, which do I need?', a: 'For most ecommerce brands the answer is both: Search for high-intent queries, and Shopping and Performance Max for catalogue-led buying. We recommend the mix from your products and margins rather than a template.' },
    ],
  },
  {
    slug: 'ecommerce-ppc', url: '/ecommerce-ppc-services/', name: 'Ecommerce PPC', parentSlug: 'performance-marketing', parentName: 'Performance marketing', parentUrl: '/performance-marketing-agency-bangalore/',
    title: 'Ecommerce PPC Services for D2C Brands | Scaling Socials',
    description: 'Scaling Socials runs ecommerce PPC across Meta and Google for D2C brands: catalogue-led paid media built around your real SKUs, seasonality and margin.',
    h1: 'Ecommerce PPC services for D2C brands',
    answer: 'Scaling Socials runs ecommerce PPC across Meta and Google for D2C and ecommerce brands in India and the UAE. It is catalogue-led buying built around your real SKUs, seasonality and margin, so paid media scales the products that make money rather than the ones that only pull clicks.',
    sections: [
      { heading: 'Built for real catalogues', body: 'Ecommerce PPC is a different animal from lead-gen PPC. It lives and dies on your product feed, your bestsellers, your margin per SKU and your seasonality. We structure the buying around all of that, so spend follows the products that genuinely contribute profit.' },
      { heading: 'One number across channels', body: 'We run Meta and Google as a single account with a single target, your blended, margin-aware return, instead of letting each platform optimise to whichever metric flatters it. That is how you stop paying twice for the same sale.' },
    ],
    faqs: [
      { q: 'What is ecommerce PPC?', a: 'Ecommerce PPC is paid advertising built around a product catalogue, spanning Meta, Google Shopping, Performance Max and Search, and optimised to sell SKUs profitably rather than just drive clicks. It ties directly to your feed, your margins and your seasonality.' },
      { q: 'How much does ecommerce PPC cost?', a: 'Scaling Socials starts at ₹25,000 a month, depending on spend and scope. Your ad spend is separate, paid to the platforms directly, and never marked up.' },
      { q: 'Do you manage the product feed?', a: 'Yes. A clean, well-structured product feed is half of ecommerce PPC. We optimise it so Shopping and Performance Max have the data they need to sell your catalogue efficiently.' },
    ],
  },
  {
    slug: 'ecommerce-seo', url: '/ecommerce-seo-services/', name: 'Ecommerce SEO', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Ecommerce SEO Services for D2C Stores | Scaling Socials',
    description: 'Scaling Socials runs ecommerce SEO for D2C and Shopify brands: category and product page optimisation, structure and internal linking that grows revenue.',
    h1: 'Ecommerce SEO services for D2C stores',
    answer: 'Scaling Socials runs ecommerce SEO for D2C and Shopify brands in India and the UAE. We optimise category and product pages, structured data and internal linking so your store earns organic traffic that actually converts, and we measure it by revenue rather than by a vanity keyword count.',
    sections: [
      { heading: 'Category pages are your money pages', body: 'For an ecommerce store, the category and collection pages are usually the biggest organic opportunity you have. We optimise them for the commercial terms your buyers search, and give them the content, structure and internal links they need to rank and convert.' },
      { heading: 'Structure that scales with your catalogue', body: 'A growing store needs clean architecture: logical collections, structured data, and internal linking that pushes authority toward the pages you most want ranked. We build that foundation once, so new products start ranking faster.' },
    ],
    faqs: [
      { q: 'How is ecommerce SEO different from normal SEO?', a: 'It centres on category and product pages, product structured data, faceted navigation and internal linking across a whole catalogue. Those are the things that decide whether a store ranks and converts, rather than a handful of blog posts.' },
      { q: 'How much does ecommerce SEO cost?', a: 'Scaling Socials starts SEO at ₹25,000 a month, depending on keyword count, difficulty and how many pages need work. It compounds over quarters rather than paying off overnight.' },
      { q: 'Does SEO work with my paid ads?', a: 'Yes, and the two feed each other. SEO lowers your reliance on paid over time, while the query and conversion data from your ads sharpens which organic terms are worth prioritising.' },
    ],
  },
  {
    slug: 'technical-seo-audit', url: '/technical-seo-audit-services/', name: 'Technical SEO audits', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Technical SEO Audit Services | Scaling Socials Bangalore',
    description: 'Scaling Socials runs technical SEO audits for D2C and ecommerce sites: crawlability, speed, indexation and structure, with a prioritised fix list by impact.',
    h1: 'Technical SEO audit services',
    answer: 'Scaling Socials runs technical SEO audits for D2C and ecommerce sites in India and the UAE. We check crawlability, site speed, indexation, structured data and internal linking, then hand you a fix list ranked by impact. It is the foundation that decides whether your content can ever rank.',
    sections: [
      { heading: 'Foundations first', body: 'Content and links cannot rank a site that search engines struggle to crawl, that loads slowly, or whose pages compete with each other. A technical audit finds those problems and ranks the fixes by how much each one is quietly costing you.' },
      { heading: 'A fix list, not a 90-page PDF', body: 'You get a prioritised, plain-English list of what to fix and why, and if you want, we do the fixing. What you will not get is a box-ticking report that sits in a folder and never gets actioned.' },
    ],
    faqs: [
      { q: 'What does a technical SEO audit cover?', a: 'Crawlability and indexation, site speed and Core Web Vitals, site architecture, structured data, internal linking, duplicate content and mobile usability. Together these are the technical foundations that decide whether your content can rank at all.' },
      { q: 'How much does a technical SEO audit cost?', a: 'It is part of an SEO engagement, which starts at ₹25,000 a month, or it can be scoped as a one-off audit. Tell us your site and we will quote.' },
      { q: 'Will you fix the issues or just report them?', a: 'Either. You get a prioritised fix list you could hand to any developer, and we are happy to implement the fixes ourselves if you would rather we handled it.' },
    ],
  },
  {
    slug: 'local-seo', url: '/local-seo-services-bangalore/', name: 'Local SEO', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Local SEO Services in Bangalore for Brands | Scaling Socials',
    description: 'Scaling Socials runs local SEO in Bangalore: Google Business Profile, citations and local pages that get brands found by nearby, ready-to-buy customers.',
    h1: 'Local SEO services in Bangalore',
    answer: 'Scaling Socials runs local SEO for brands that also sell or serve in a city. We optimise your Google Business Profile, build consistent citations, and create local pages so nearby buyers with real intent find you first. It sits inside an SEO engagement from ₹25,000 a month.',
    sections: [
      { heading: 'The map pack is its own game', body: 'Ranking in Google’s local map pack runs on different signals from regular organic. It comes down to your Business Profile, consistent name, address and phone details across the web, and genuine reviews. We handle all three rather than treating local as an afterthought.' },
      { heading: 'Consistency wins', body: 'Inconsistent listings are the most common reason local rankings stall. We make your NAP identical everywhere it appears and keep your profile complete and active, which is exactly what local ranking rewards.' },
    ],
    faqs: [
      { q: 'What is local SEO?', a: 'Local SEO is the work of getting found by nearby searchers, in Google’s map pack and local results, through your Google Business Profile, consistent citations, reviews and location pages. It matters for any brand with a real presence in a city.' },
      { q: 'How much does local SEO cost?', a: 'It is part of an SEO engagement, from ₹25,000 a month, scoped to how many locations you run and how competitive your city and category are.' },
      { q: 'Do reviews matter for local SEO?', a: 'A great deal. Review count, recency and rating are strong signals for both local ranking and conversion. We help you build a systematic review request into your offboarding and your quarterly check-ins.' },
    ],
  },
  {
    slug: 'answer-engine-optimisation', url: '/answer-engine-optimisation-services/', name: 'Answer engine optimisation', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Answer Engine Optimisation Services | Scaling Socials',
    description: 'Scaling Socials offers answer engine optimisation: structuring content so it gets cited in Google AI Overviews and by ChatGPT, Perplexity and Gemini.',
    h1: 'Answer engine optimisation (AEO) services',
    answer: 'Scaling Socials offers answer engine optimisation, which means structuring your content so it gets quoted inside AI answers, from Google’s AI Overviews to ChatGPT, Perplexity and Gemini. It rewards specific, well-structured, well-cited pages, and almost nobody in India is doing it yet.',
    sections: [
      { heading: 'Search is being answered, not just ranked', body: 'More and more queries now get answered directly by an AI, with only a handful of cited sources underneath. Being one of those citations is a new discipline. It takes clear answer-first structure, definition sentences, tables, and genuine originating facts that models prefer to quote.' },
      { heading: 'First-mover advantage', body: 'Because so few brands in India optimise for this, the barrier to entry is low and the upside is high. We build your key pages to be the source an answer engine reaches for when someone asks about your category.' },
    ],
    faqs: [
      { q: 'What is answer engine optimisation (AEO)?', a: 'AEO is optimising content to be cited inside AI-generated answers, such as Google’s AI Overviews and tools like ChatGPT, Perplexity and Gemini, rather than only ranking in the classic blue links. It rewards structure, specificity and clear attribution.' },
      { q: 'How is AEO different from SEO?', a: 'SEO aims for a ranking position, while AEO aims to be the passage an answer engine quotes back. The tactics overlap, but AEO leans harder on answer-first structure, definition sentences, tables, and being the original source of a fact.' },
      { q: 'Is it too early to invest in AEO?', a: 'No, and that is precisely the opportunity. Use of AI answers is climbing fast while almost no brands in India optimise for it, so early, well-structured content can lock in citations before your competitors even notice.' },
    ],
  },
  {
    slug: 'shopify-store-migration', url: '/shopify-store-migration-services/', name: 'Shopify store migration', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Store Migration Services | Scaling Socials',
    description: 'Scaling Socials migrates stores to Shopify from WooCommerce, Wix and Magento without losing SEO, URLs or order history: a planned, rankings-safe migration.',
    h1: 'Shopify store migration services',
    answer: 'Scaling Socials migrates D2C stores to Shopify from WooCommerce, Wix, Magento and others without losing SEO, URLs or order history. Losing rankings in a migration is avoidable, so we plan the redirect map and data transfer up front, which means you keep your traffic and gain Shopify. It is priced by scope.',
    sections: [
      { heading: 'The redirect map is everything', body: 'Most migrations lose traffic for one reason: old URLs quietly start returning 404s. We map every old URL to its new Shopify equivalent with clean 301s, so your rankings and the link equity behind them carry across intact.' },
      { heading: 'Data, not just design', body: 'Products, variants, customers and order history all have to move cleanly, not just the theme. We handle the data migration alongside the rebuild so nothing important gets stranded on the old platform.' },
    ],
    faqs: [
      { q: 'Will I lose SEO when migrating to Shopify?', a: 'Not with a planned migration. We build a complete redirect map from your old URLs to the new ones with proper 301s, so rankings and link equity transfer across. Lost traffic in a migration is almost always avoidable.' },
      { q: 'What can you migrate from?', a: 'WooCommerce, Wix, Magento, custom builds and others. We move products, variants, customers and order history, and rebuild the theme on Shopify around conversion rather than just copying the old design.' },
      { q: 'How long does a Shopify migration take?', a: 'It depends on your catalogue size and any custom features. We scope it up front and give you a fixed timeline and quote before we start anything.' },
    ],
  },
  {
    slug: 'shopify-speed-optimisation', url: '/shopify-speed-optimisation-services/', name: 'Shopify speed optimisation', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Speed Optimisation Services | Scaling Socials',
    description: 'Scaling Socials runs Shopify speed optimisation: a dedicated pass on Core Web Vitals and load time, because a faster store converts more paid traffic.',
    h1: 'Shopify speed optimisation services',
    answer: 'Scaling Socials runs Shopify speed optimisation, a dedicated pass on Core Web Vitals and real-world load time. Speed feeds conversion directly: a faster store turns more of your paid traffic into orders and lowers your effective ad cost. It is priced by scope, and it usually pays for itself quickly.',
    sections: [
      { heading: 'Speed is money', body: 'A store that takes four seconds to load has lost buyers before they even see the product, and it pushes your ad costs up at the same time. We go after the things that actually move load time, meaning images, apps, theme code and third-party scripts, not a vanity score in a testing tool.' },
      { heading: 'Real Core Web Vitals, not a lab number', body: 'We optimise for the field metrics that Google and your customers actually experience, and then we measure the effect on conversion rather than stopping at a speed grade.' },
    ],
    faqs: [
      { q: 'Why does Shopify store speed matter?', a: 'Speed feeds straight into conversion and ad costs. Slow stores lose buyers before they act and get marked down on ad quality, so a faster store makes the same traffic worth more. It is often the cheapest conversion win on the table.' },
      { q: 'How much does Shopify speed optimisation cost?', a: 'It is scoped to your store, based on how heavy your theme, apps and images are. Tell us your store and we will quote within two working days.' },
      { q: 'What slows a Shopify store down?', a: 'Usually oversized images, too many apps, heavy third-party scripts and bloated theme code. We audit all of them and fix the ones costing you the most load time and conversion first.' },
    ],
  },
  {
    slug: 'shopify-store-redesign', url: '/shopify-store-redesign-services/', name: 'Shopify store redesign', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Store Redesign Services India | Scaling Socials',
    description: 'Scaling Socials redesigns Shopify stores for D2C brands: rebuilt around what actually converts, informed by session and heatmap data, not guesswork.',
    h1: 'Shopify store redesign services',
    answer: 'Scaling Socials redesigns Shopify stores for D2C and ecommerce brands in India and the UAE. We rebuild around what actually converts, across the product page, cart and checkout, using session recordings and heatmaps rather than opinion, so the new store lifts revenue instead of just looking nicer.',
    sections: [
      { heading: 'Redesign for conversion, not vibes', body: 'A redesign that looks better but converts worse is a loss dressed up as a win. We start from your data, meaning where buyers drop off, what they scroll past, and how they shop on mobile, and rebuild around the screens that actually decide purchases.' },
      { heading: 'Speed and tracking baked in', body: 'We rebuild lean and fast, with clean analytics wired in from day one, so the new store loads quickly and you can actually measure whether the redesign moved the numbers.' },
    ],
    faqs: [
      { q: 'When should I redesign my Shopify store?', a: 'When your conversion rate has plateaued, your store has gone slow, or the design is fighting your growth. We look at your session and analytics data first and tell you honestly whether a full redesign or a set of targeted fixes is the better use of your money.' },
      { q: 'How much does a Shopify redesign cost?', a: 'It is scoped to the work, since a targeted rebuild of key pages is a different job from a full store redesign. Tell us your store and goals and we will quote within two working days.' },
      { q: 'Will a redesign improve conversion?', a: 'Only if it is built from data. We base the redesign on where buyers actually drop off and test the changes, instead of redesigning on gut feel, which is how redesigns so often end up losing conversion.' },
    ],
  },
];

export const CLUSTER_BY_SLUG = Object.fromEntries(CLUSTERS.map((c) => [c.slug, c]));
