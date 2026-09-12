/**
 * Service cluster content — the focused sub-service pages under each pillar.
 * See 02 §1. Concise but real; each links up to its pillar and across to siblings.
 * Meta titles 50–60, descriptions 140–158 (enforced at build).
 */
import type { RichText } from './richtext';

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
  sections: { heading: string; body: RichText }[];
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
      { q: 'How does pricing work for a Meta ads agency in India?', a: 'We scope every engagement to the brand rather than a fixed package, it reflects your ad spend and creative volume. Whatever the scope, your Meta ad spend stays separate: it goes straight to Meta and is never marked up by us.' },
      { q: 'Do you make the Meta ad creative?', a: 'Yes. We produce statics and video-led ads in-house and test them in a structured pipeline. Creative is the single biggest lever on Meta right now, so it sits at the core of the engagement rather than off to the side as an add-on.' },
      { q: 'Should I use Advantage+ or manual campaigns?', a: 'It depends on your catalogue and your funnel. We run Advantage+ where it beats manual and stay manual where control pays off, and we test both against your break-even ROAS instead of following a rule of thumb.' },
      { q: 'My Meta ads get traffic but no sales. Is it the ads?', a: 'Often it is not. The most common mistake we see in Indian D2C is blaming Meta for a problem sitting somewhere else, when traffic is healthy and purchases are not, the cause is usually the product, the price, the website or the content, and no amount of campaign restructuring fixes any of those. Scaling Socials checks the whole path from ad to checkout before rebuilding an account, and will tell you when the ads are not what is holding sales back.' },
    ],
  },
  {
    slug: 'google-ads', url: '/google-ads-agency-bangalore/', name: 'Google Ads', parentSlug: 'performance-marketing', parentName: 'Performance marketing', parentUrl: '/performance-marketing-agency-bangalore/',
    title: 'Google Ads Agency in Bangalore for D2C | Scaling Socials',
    description: 'Scaling Socials runs Google Ads for D2C brands in Bangalore: Search, Shopping, Performance Max and ecommerce PPC built around buying intent and your margin.',
    h1: 'Google Ads agency in Bangalore',
    answer: 'Scaling Socials runs Google Ads for D2C and ecommerce brands in India and the UAE, across Search, Shopping, Performance Max and catalogue-led ecommerce PPC. We build around real buying intent and your margin, and run Google alongside Meta so the demand you create and the demand you capture compound instead of competing.',
    sections: [
      { heading: 'Google captures the demand your Meta ads create', body: ['For most D2C brands, Google and Meta do opposite jobs. ', { text: 'Meta creates demand', href: '/meta-ads-agency-india/' }, ' — it puts a product in front of someone who was not looking for it. Google captures demand that already exists, the moment a buyer types your category or your brand into search. Run only one and you either generate interest you never close, or harvest interest you never created. We build Google Ads for brands already running Meta, so the two compound instead of fighting over the same last click.'] },
      { heading: 'Search: paying for the clicks closest to a purchase', body: 'We map the queries your buyers actually use, from high-intent product terms through category research, and split branded search into its own campaign so it is never credited with demand it did not create. Non-brand Search is where incremental growth lives; brand Search protects a term you already own from competitors bidding on your name. You pay for clicks that sit close to a decision, not for impression share that only flatters a dashboard.' },
      { heading: 'Shopping and the product feed do the heavy lifting', body: 'For a store with a real catalogue, Shopping is usually the highest-return surface Google offers, and it lives or dies on the product feed. Titles, images, availability, GTINs and pricing move results more than any bid setting. We treat the feed as the core asset — structured, complete and written the way people actually search — so Shopping and Performance Max have the data to sell the SKUs that carry real margin.' },
      { heading: 'Performance Max, on a leash', body: ['The most expensive mistake with ', { text: 'Performance Max', href: '/glossary/performance-max/' }, ' is letting it absorb branded search, which makes it report a glowing return for demand you already had. We fence it with the right exclusions, feed it clean data, and hold it to a target set from your ', { text: 'break-even ROAS', href: '/tools/break-even-roas-calculator/' }, ', so it works for your P&L rather than for Google’s.'] },
      { heading: 'One margin-aware number across Meta and Google', body: ['Run each platform to its own reported ROAS and both will claim the same sale, so the two totals sum to more than the business earned. We run Meta and Google against a single ', { text: 'blended, margin-aware target', href: '/glossary/blended-roas/' }, ' and read the account against the revenue your bank actually sees. That is how a catalogue scales on profit rather than on whichever platform flatters itself that month.'] },
      { heading: 'Built for real catalogues and Indian seasonality', body: 'Ecommerce PPC is not lead-gen with a different logo. It turns on your bestsellers, your margin per SKU, and a calendar — festive, wedding and sale seasons that reprice the whole auction. We structure spend so it follows the products that contribute profit and leans into the windows that matter, instead of spreading evenly across a catalogue that never earned evenly.' },
    ],
    faqs: [
      { q: 'Should I run Google Ads if I already run Meta?', a: 'Usually yes. Meta creates demand and Google captures it, so a brand running only Meta generates searches it never closes, and a brand running only Google harvests interest it never created. For most D2C brands the two compound, and we run them against one blended, margin-aware target so neither is judged in its own flattering silo.' },
      { q: 'What is ecommerce PPC, and how is it different from lead-gen PPC?', a: 'Ecommerce PPC is paid search built around a product catalogue rather than a single cost per lead. It spans Search, Shopping and Performance Max, ties directly to your product feed, margins and seasonality, and is optimised to sell profitable SKUs — not just to drive clicks. It is most of what a Google Ads account for a store actually does.' },
      { q: 'Do you manage the product feed?', a: 'Yes — a clean, well-structured feed is most of ecommerce Google Ads. Titles, images, availability and pricing decide what Shopping and Performance Max can sell, so we optimise the feed as a core deliverable rather than an afterthought.' },
      { q: 'Do you run Performance Max?', a: 'Yes, where it fits, with clean data, the right exclusions and branded search kept separate, all held to your break-even ROAS. We do not hand it a blank cheque; it earns its budget by clearing your margin.' },
      { q: 'Search or Shopping — which do I need?', a: 'For most ecommerce brands the answer is both: Search for high-intent queries, Shopping and Performance Max for catalogue-led buying. We recommend the mix from your products and margins rather than a template.' },
      { q: 'How does pricing work for a Google Ads agency in India?', a: 'We scope it to your account, catalogue and spend rather than a fixed package. Whatever the scope, your Google ad spend stays separate, paid straight to Google, and is never marked up by us.' },
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
      { q: 'How does ecommerce SEO pricing work?', a: 'We scope it to your store, how many keywords you target and how competitive they are, and how many pages need work. It compounds over quarters rather than paying off overnight, so we plan it that way.' },
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
      { q: 'How does a technical SEO audit fit into an engagement?', a: 'It is part of an SEO engagement, or it can be scoped as a one-off audit. Tell us your site and we will map out what it needs.' },
      { q: 'Will you fix the issues or just report them?', a: 'Either. You get a prioritised fix list you could hand to any developer, and we are happy to implement the fixes ourselves if you would rather we handled it.' },
    ],
  },
  {
    slug: 'local-seo', url: '/local-seo-services-bangalore/', name: 'Local SEO', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Local SEO Services in Bangalore for Brands | Scaling Socials',
    description: 'Scaling Socials runs local SEO in Bangalore: Google Business Profile, citations and local pages that get brands found by nearby, ready-to-buy customers.',
    h1: 'Local SEO services in Bangalore',
    answer: 'Scaling Socials runs local SEO for brands that also sell or serve in a city. We optimise your Google Business Profile, build consistent citations, and create local pages so nearby buyers with real intent find you first. It sits inside a broader SEO engagement, scoped to your locations and category.',
    sections: [
      { heading: 'The map pack is its own game', body: 'Ranking in Google’s local map pack runs on different signals from regular organic. It comes down to your Business Profile, consistent name, address and phone details across the web, and genuine reviews. We handle all three rather than treating local as an afterthought.' },
      { heading: 'Consistency wins', body: 'Inconsistent listings are the most common reason local rankings stall. We make your NAP identical everywhere it appears and keep your profile complete and active, which is exactly what local ranking rewards.' },
    ],
    faqs: [
      { q: 'What is local SEO?', a: 'Local SEO is the work of getting found by nearby searchers, in Google’s map pack and local results, through your Google Business Profile, consistent citations, reviews and location pages. It matters for any brand with a real presence in a city.' },
      { q: 'How does local SEO pricing work?', a: 'It is part of an SEO engagement, scoped to how many locations you run and how competitive your city and category are.' },
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
    answer: 'Scaling Socials migrates D2C stores to Shopify from WooCommerce, Wix, Magento and others without losing SEO, URLs or order history. Losing rankings in a migration is avoidable, so we plan the redirect map and data transfer up front, which means you keep your traffic and gain Shopify. It is scoped to your catalogue and the platform you are moving from.',
    sections: [
      { heading: 'The redirect map is everything', body: 'Most migrations lose traffic for one reason: old URLs quietly start returning 404s. We map every old URL to its new Shopify equivalent with clean 301s, so your rankings and the link equity behind them carry across intact.' },
      { heading: 'Data, not just design', body: ['Products, variants, customers and order history all have to move cleanly, not just the theme. We handle the data migration alongside the ', { text: 'store rebuild', href: '/web-development-company-bangalore/' }, ' so nothing important gets stranded on the old platform.'] },
    ],
    faqs: [
      { q: 'Will I lose SEO when migrating to Shopify?', a: 'Not with a planned migration. We build a complete redirect map from your old URLs to the new ones with proper 301s, so rankings and link equity transfer across. Lost traffic in a migration is almost always avoidable.' },
      { q: 'What can you migrate from?', a: 'WooCommerce, Wix, Magento, custom builds and others. We move products, variants, customers and order history, and rebuild the theme on Shopify around conversion rather than just copying the old design.' },
      { q: 'How long does a Shopify migration take?', a: 'It depends on your catalogue size and any custom features. We scope it up front and give you a clear plan and timeline before we start anything.' },
    ],
  },
  {
    slug: 'shopify-speed-optimisation', url: '/shopify-speed-optimisation-services/', name: 'Shopify speed optimisation', parentSlug: 'shopify-development', parentName: 'Shopify development', parentUrl: '/shopify-development-company-bangalore/',
    title: 'Shopify Speed Optimisation Services | Scaling Socials',
    description: 'Scaling Socials runs Shopify speed optimisation: a dedicated pass on Core Web Vitals and load time, because a faster store converts more paid traffic.',
    h1: 'Shopify speed optimisation services',
    answer: 'Scaling Socials runs Shopify speed optimisation, a dedicated pass on Core Web Vitals and real-world load time. Speed feeds conversion directly: a faster store turns more of your paid traffic into orders and lowers your effective ad cost. It is scoped to your store, and it usually pays for itself quickly.',
    sections: [
      { heading: 'Speed is money', body: 'A store that takes four seconds to load has lost buyers before they even see the product, and it pushes your ad costs up at the same time. We go after the things that actually move load time, meaning images, apps, theme code and third-party scripts, not a vanity score in a testing tool.' },
      { heading: 'Real Core Web Vitals, not a lab number', body: 'We optimise for the field metrics that Google and your customers actually experience, and then we measure the effect on conversion rather than stopping at a speed grade.' },
    ],
    faqs: [
      { q: 'Why does Shopify store speed matter?', a: 'Speed feeds straight into conversion and ad costs. Slow stores lose buyers before they act and get marked down on ad quality, so a faster store makes the same traffic worth more. It is often the cheapest conversion win on the table.' },
      { q: 'How does Shopify speed optimisation pricing work?', a: 'It is scoped to your store, based on how heavy your theme, apps and images are. Tell us your store and we will map it out within two working days.' },
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
      { q: 'How does a Shopify redesign scope work?', a: 'It is scoped to the work, since a targeted rebuild of key pages is a different job from a full store redesign. Tell us your store and goals and we will map it out within two working days.' },
      { q: 'Will a redesign improve conversion?', a: 'Only if it is built from data. We base the redesign on where buyers actually drop off and test the changes, instead of redesigning on gut feel, which is how redesigns so often end up losing conversion.' },
    ],
  },
];

export const CLUSTER_BY_SLUG = Object.fromEntries(CLUSTERS.map((c) => [c.slug, c]));
