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
      { heading: 'Category and collection pages are your money pages', body: 'For a store, the collection pages are usually the biggest organic opportunity you have. They target the commercial, high-intent terms people search when they are ready to buy a type of product, not a single SKU. Most Shopify stores leave them as bare grids with a templated title and no copy. We give them intro content, structured headings, internal links and metadata written for those category terms, so they rank and then convert the traffic once it lands.' },
      { heading: 'Product pages that earn both the click and the sale', body: 'Product pages win or lose on two things: whether they can show up as a rich result, and whether the copy is yours rather than the manufacturer’s. We add product structured data for price, availability and review stars, write descriptions that answer the questions buyers actually have instead of pasting the supplier sheet, and handle variants and out-of-stock lines so Google indexes the right URL. Duplicate manufacturer copy sitting on a thousand competitors is why most product pages never rank.' },
      { heading: 'Faceted navigation is the biggest technical trap', body: 'Filters and sort options quietly generate thousands of near-duplicate, crawlable URLs — colour, size, price, in-stock — and left unmanaged they burn your crawl budget and split ranking signals across pages that should be one. Deciding which facets are indexable, which get canonicalised away, and which are blocked entirely is one of the highest-impact and most-skipped jobs in ecommerce SEO. We map it deliberately instead of letting the theme decide by accident.' },
      { heading: 'Architecture and internal linking that scale with the catalogue', body: 'A growing store needs clean architecture: logical collections, a sensible URL structure, and internal linking that pushes authority toward the pages you most want ranked — including links from blog and guide content down into the collections that sell. We build that foundation once, so new products inherit authority and start ranking faster instead of launching into the void.' },
      { heading: 'Technical foundations and Core Web Vitals', body: ['Content and links cannot rank a store that is slow or hard to crawl. We run the ', { text: 'technical foundations', href: '/technical-seo-audit-services/' }, ' — crawlability, indexation, structured data and duplicate content — and treat ', { text: 'store speed', href: '/shopify-speed-optimisation-services/' }, ' as an SEO factor and a conversion one at once, because on Indian mobile networks it is both.'] },
      { heading: 'SEO and paid pull in the same direction', body: ['Organic and paid are not rivals for one budget. SEO lowers your reliance on paid over the quarters, while the query and conversion data from your ', { text: 'Google Ads', href: '/google-ads-agency-bangalore/' }, ' sharpens which organic terms are genuinely worth prioritising. We run them so each one makes the other cheaper.'] },
    ],
    faqs: [
      { q: 'How is ecommerce SEO different from normal SEO?', a: 'It centres on category and product pages, product structured data, faceted navigation and internal linking across a whole catalogue. Those are the things that decide whether a store ranks and converts, rather than a handful of blog posts sitting off to the side.' },
      { q: 'How long does ecommerce SEO take to work?', a: 'It compounds over quarters rather than paying off in weeks. Category and technical fixes can move things within a couple of months; building authority for competitive commercial terms is a two-to-three-quarter horizon. We scope and report it that way rather than promising overnight rankings.' },
      { q: 'Do you handle Shopify’s SEO limitations?', a: 'Yes. Shopify has known quirks — forced URL structures for products and collections, duplicate paths, and app scripts that slow pages — and we work within and around them: canonical handling, collection architecture, structured data and speed, so the platform’s defaults do not cap your organic ceiling.' },
      { q: 'How does ecommerce SEO pricing work?', a: 'We scope it to your store, how many terms you target and how competitive they are, and how many pages need work. It compounds over quarters rather than paying off overnight, so we plan and report it on that horizon.' },
      { q: 'Does SEO work with my paid ads?', a: 'Yes, and the two feed each other. SEO lowers your reliance on paid over time, while the query and conversion data from your ads sharpens which organic terms are worth prioritising first.' },
    ],
  },
  {
    slug: 'local-seo', url: '/local-seo-services-bangalore/', name: 'Local SEO', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Local SEO for Bangalore Businesses | Scaling Socials',
    description: 'Scaling Socials runs local SEO in Bangalore for clinics, salons, restaurants and local retailers: Google Business Profile, reviews and map-pack ranking.',
    h1: 'Local SEO services in Bangalore',
    answer: 'Scaling Socials runs local SEO for service businesses and retailers with a physical presence in a city — clinics, salons, restaurants, showrooms, studios and local shops. We optimise your Google Business Profile, build consistent citations and earn genuine reviews, so nearby customers searching with real intent find you in the map pack first.',
    sections: [
      { heading: 'The map pack is a different game from organic', body: 'Google shows local searchers a map with three business listings above the normal results, and ranking there runs on different signals: how close you are to the person searching, how relevant your profile is to what they typed, and how prominent your business looks across the web. Most of that is decided by your Google Business Profile, not your website — so local SEO starts there rather than with page content.' },
      { heading: 'Your Google Business Profile is the product', body: 'For a local business the profile often gets seen far more than the website. We complete every field, set the correct primary category, list your services and areas, add real photos, keep hours and holidays accurate, publish posts, and seed the Q&A with the questions customers actually ask. A complete, active profile both ranks better and turns the person who finds it into a call or a visit.' },
      { heading: 'Consistent name, address and phone across the web', body: 'Inconsistent listings are the most common reason local rankings stall. If your name, address and phone number read differently on Justdial, your website, a directory and your profile, Google trusts none of them fully. We make your details identical everywhere they appear and clean up the duplicate and wrong entries that quietly drag you down.' },
      { heading: 'Reviews are ranking and persuasion at once', body: 'Review count, recency and rating are strong signals for local ranking, and they are often the deciding factor for the customer choosing between you and the business listed just above you. We build a simple, repeatable review request into how you close a job or a sale, and reply to reviews — including the difficult ones — because responding is a signal too.' },
      { heading: 'Pages that rank for “near me” and for each service', body: ['Beyond the profile, a local business needs real pages: one per location and one per core service, written for how people actually search rather than thin copies of each other with the city name swapped. Those pages have to load fast and be easy to crawl, so they belong on ', { text: 'a solid website', href: '/web-development-company-bangalore/' }, ' with the ', { text: 'technical foundations', href: '/technical-seo-audit-services/' }, ' in place.'] },
      { heading: 'Multi-location and service-area businesses', body: 'If you run several branches, or serve an area without a storefront customers visit, the setup changes: a profile per location, service-area settings done correctly, and location pages that do not cannibalise one another. We structure it so each branch ranks in its own neighbourhood instead of competing with your other branches for the same three map-pack spots.' },
    ],
    faqs: [
      { q: 'What is local SEO?', a: 'Local SEO is the work of getting found by nearby searchers — in Google’s map pack and local results — through your Google Business Profile, consistent listings, reviews and location pages. It matters for any business people find and then visit or call locally: clinics, salons, restaurants, showrooms, studios and shops.' },
      { q: 'How long does local SEO take?', a: 'A properly completed and consistent Google Business Profile can move within weeks, because much of local ranking is profile and citation hygiene rather than long-horizon authority building. Competitive categories in a large city take longer, but local usually shows results sooner than broad organic SEO does.' },
      { q: 'Do reviews matter for local SEO?', a: 'A great deal. Review count, recency and rating are strong signals for both ranking and the customer’s choice. We build a systematic, genuine review request into how you finish a job or a sale, and help you respond to them consistently.' },
      { q: 'Do I still need a website for local SEO?', a: 'Yes. The profile does much of the work, but a fast website with real location and service pages is what lets you rank for “near me” and service-specific searches, and it is where a serious customer checks you out before calling. The two reinforce each other.' },
      { q: 'How does local SEO pricing work?', a: 'It is scoped to how many locations you run and how competitive your city and category are, and it can sit inside a broader SEO engagement or stand alone. We map it to your locations rather than sell a fixed package.' },
    ],
  },
  {
    slug: 'answer-engine-optimisation', url: '/answer-engine-optimisation-services/', name: 'Answer engine optimisation', parentSlug: 'seo', parentName: 'SEO', parentUrl: '/seo-agency-bangalore/',
    title: 'Answer Engine Optimisation Services | Scaling Socials',
    description: 'Scaling Socials offers answer engine optimisation: structuring content so it gets cited in Google AI Overviews and by ChatGPT, Perplexity and Gemini.',
    h1: 'Answer engine optimisation (AEO) services',
    answer: 'Scaling Socials offers answer engine optimisation, which means structuring your content so it gets quoted inside AI answers, from Google’s AI Overviews to ChatGPT, Perplexity and Gemini. It rewards specific, well-structured, well-cited pages, and almost nobody in India is doing it yet.',
    sections: [
      { heading: 'Search is increasingly answered, not just ranked', body: 'A growing share of queries now resolve inside an AI answer — Google’s AI Overviews, People Also Ask, and assistants like ChatGPT, Perplexity and Gemini — with only a handful of cited sources beneath. For those queries the ten blue links are never seen. The job is no longer only to rank; it is to be one of the few sources the answer is built from. That is a distinct discipline, and almost no brand in India is doing it deliberately yet.' },
      { heading: 'SEO wins a position; AEO wins the passage', body: 'Classic SEO optimises a whole page for a ranking slot. Answer engines do something different: they lift a short, self-contained passage out of a page and quote it. So the unit of success is the extractable passage, not the position. We write so those passages are easy to find and safe to lift — one idea per paragraph, a direct answer before the elaboration, and the subject named inside the sentence, so the quote still makes sense once it has been pulled out of its page.' },
      { heading: 'How Scaling Socials engineers a page to be quoted', body: ['Every commercial page opens with a 40–60 word answer that stands on its own. Headings are shaped like the questions buyers actually ask. Definitions follow a clean, one-sentence pattern, and anything enumerable becomes a list or a table, because those are what get lifted. FAQ answers sit in the HTML whether the accordion is open or shut. Our ', { text: 'glossary', href: '/glossary/' }, ' is built exactly this way — one definitional page per metric, each with a worked example in rupees — because that is the shape an answer engine reaches for.'] },
      { heading: 'Structure and clean HTML the models can parse', body: ['Answer-engine crawlers largely do not execute JavaScript, so anything rendered client-side is invisible to them. We server-render everything, connect the page’s schema into one graph so the entities link, and use semantic HTML — real tables, definition lists, figures and dated content — because retrieval pipelines chunk on structure. A page that is ', { text: 'clean to crawl and parse', href: '/technical-seo-audit-services/' }, ' is a page that can be quoted; one that hides its content behind scripts cannot.'] },
      { heading: 'Being the origin of a fact is what earns the citation', body: ['Models cite sources that are specific, attributed and recent, and they prefer the page that originates a fact over the ten that merely repeat it. A generic claim never gets quoted; a precise, sourced number does. So we write attribution into the sentence itself — “Scaling Socials measured…”, not “we measured…” — cite primary sources, and put real, current figures on the page. It overlaps with ', { text: 'SEO', href: '/seo-agency-bangalore/' }, ', but rewards different things: specificity and originality over sheer volume.'] },
      { heading: 'The Indian first-mover window', body: 'Because so few brands in India optimise for this, the barrier is low and the upside is real. Well-structured, genuinely useful pages can lock in citations for your category before competitors notice the channel exists. We prioritise the pages your buyers ask about at 11pm — the definitional and comparison questions — because those are the queries answer engines serve most often, and the ones that quietly decide which brands get recommended.' },
    ],
    faqs: [
      { q: 'What is answer engine optimisation (AEO)?', a: 'AEO is optimising content to be cited inside AI-generated answers, such as Google’s AI Overviews and tools like ChatGPT, Perplexity and Gemini, rather than only ranking in the classic blue links. It rewards structure, specificity and clear attribution over keyword volume.' },
      { q: 'How is AEO different from SEO?', a: 'SEO aims for a ranking position; AEO aims to be the passage an answer engine quotes back. The tactics overlap, but AEO leans harder on answer-first structure, one-sentence definitions, tables, clean schema, and being the original source of a fact rather than a page that repeats one.' },
      { q: 'How do you measure answer engine optimisation?', a: 'We track it directly: whether your pages are quoted in AI Overviews and named by ChatGPT, Perplexity and Gemini for a fixed set of buyer questions, run as the same prompts each month, plus referral traffic from those assistants in analytics. It is more manual than rank tracking, but it is honest and repeatable.' },
      { q: 'Does AEO also help my traditional SEO?', a: 'Yes. The structure that gets you quoted — answer-first passages, question-shaped headings, clean schema and fast, server-rendered pages — is the same foundation that earns featured snippets and strong rankings. AEO does not replace SEO; it optimises the same page for a second, faster-growing surface.' },
      { q: 'Is it too early to invest in AEO?', a: 'No, and that is precisely the opportunity. Use of AI answers is climbing fast while almost no brands in India optimise for it, so early, well-structured content can lock in citations before your competitors even notice the channel.' },
      { q: 'How does AEO pricing work?', a: 'It is scoped to the pages and topics worth owning rather than sold as a fixed package, and it usually sits inside a broader SEO engagement. The highest-leverage work is often a focused set of definitional and comparison pages, not a large volume of content.' },
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
