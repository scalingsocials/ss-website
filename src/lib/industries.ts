/**
 * Industry pages — /industries/ hub + one page per vertical we have real proof
 * or genuine experience in (02 §5, C-industries). NOT thin city/industry clones:
 * each page is anchored to real case-study proof (derived from caseStudies.ts, so
 * figures can't drift) or a real client testimonial — never an invented metric (§15).
 */
import type { Faq } from '@/lib/services';
import type { RichText } from './richtext';

export interface IndustryCard { glyph: string; title: string; body: RichText }
export interface IndustryQuote { quote: string; name: string; brand?: string; tag: string }

export interface IndustryContent {
  slug: string;
  url: string;
  name: string;        // hub card label, e.g. 'Fashion & apparel'
  title: string;       // <title> 50–60 chars
  description: string; // 140–158 chars
  eyebrow: string;
  h1: string;
  answer: string;      // 40–60 words, names Scaling Socials (§13)
  blurb: string;       // one line for the hub card
  /** Case-study slugs whose real proof anchors the page (delta or top stat). */
  proofSlugs: string[];
  /** Real testimonial(s) for verticals without a paid case study. */
  quotes?: IndustryQuote[];
  whatWeDo: IndustryCard[];
  services: string[];  // service slugs (real routes)
  faqs: Faq[];
}

export const INDUSTRIES: IndustryContent[] = [
  {
    slug: 'fashion-apparel',
    url: '/industries/fashion-apparel/',
    name: 'Fashion & apparel',
    title: 'Fashion & Apparel Marketing Agency | Scaling Socials',
    description:
      'Scaling Socials runs performance marketing and ecommerce for fashion & apparel D2C brands in India and the UAE — creative-led paid media that scales.',
    eyebrow: 'Industries',
    h1: 'Performance marketing for fashion & apparel brands',
    answer:
      'Scaling Socials runs Meta and Google Ads, creative and CRO for fashion and apparel D2C brands across India and the UAE. Fashion is won on creative that shows the product properly, so we produce video-led ads in-house and scale only what clears your margin — from turnarounds to breaking a long-standing ceiling.',
    blurb: 'Creative-led paid media for clothing and accessories labels.',
    proofSlugs: ['womens-fashion-account-turnaround', 'womenswear-breaking-the-ceiling', 'indo-western-launch-90-days'],
    whatWeDo: [
      { glyph: 'spark', title: 'Video-led creative', body: 'Drape, movement, fit — shown honestly. At a fashion price point the creative has to answer "is it worth it?" before checkout.' },
      { glyph: 'target', title: 'Full-funnel Meta & Google', body: [{ text: 'Prospecting and retargeting', href: '/meta-ads-agency-india/' }, ' built around real buying intent, tested every week against your break-even ROAS.'] },
      { glyph: 'chart', title: 'Scale with a floor', body: 'We take the swing when a month lines up and pull back when it does not — trading peak efficiency for volume on purpose.' },
    ],
    services: ['performance-marketing', 'shopify-development', 'social-media-marketing'],
    faqs: [
      { q: 'Do you work with new fashion labels with no ad history?', a: 'Yes. Several of our documented accounts started from zero pixel data — including a premium occasion-wear label taken from no performance marketing to a scalable winner inside 90 days. We test cheaply first, then put budget behind what proves out.' },
      { q: 'Who makes the ad creative for fashion ads?', a: 'We do, in-house. You supply raw footage and product shots against a brief; we cut the video-led ads and statics and run them through a weekly testing pipeline. On fashion, creative that shows the garment properly is the single biggest lever.' },
    ],
  },
  {
    slug: 'kids-baby',
    url: '/industries/kids-baby/',
    name: 'Kids & baby',
    title: 'Kids & Baby Brand Marketing Agency | Scaling Socials',
    description:
      'Scaling Socials runs performance marketing for kids, baby and kidswear D2C brands in India — built for a replenishing audience and campaign longevity.',
    eyebrow: 'Industries',
    h1: 'Performance marketing for kids & baby brands',
    answer:
      'Scaling Socials runs Meta and Google Ads for kids, baby and kidswear D2C brands across India and the UAE. This is a category built on a replenishing audience, so we build for longevity — one kidswear campaign has held for eight months without a rebuild, and a kids accessories account held a 6.95x floor across seven straight months.',
    blurb: 'Built for a replenishing audience and campaign longevity.',
    proofSlugs: ['kids-accessories-seven-month-floor', 'kidswear-campaign-longevity'],
    whatWeDo: [
      { glyph: 'gauge', title: 'A return floor, not just an average', body: 'We plan to a worst-month floor a brand can actually budget around — one account never dropped below 6.95x across seven months.' },
      { glyph: 'chart', title: 'Longevity over churn', body: 'Kids creative fatigues fast. We build campaigns that survive repetition instead of rebuilding every few weeks and resetting the learning.' },
      { glyph: 'target', title: 'Audiences that refill', body: 'A new cohort of parents enters the market continuously — we build targeting to catch them, so spend scales a known asset.' },
    ],
    services: ['performance-marketing', 'social-media-marketing', 'shopify-development'],
    faqs: [
      { q: 'How do you keep kids ad accounts stable?', a: 'By optimising for consistency, not a single spectacular month. We flex budget to match conditions while holding the return threshold, and we resist rebuilding a working campaign — one has run eight months straight without one.' },
      { q: 'Can you scale a mature kids account further?', a: 'Yes, deliberately. A mature account is not a finished one; we raise the spend ceiling against proven performance rather than protecting a comfortable number, and pull back cleanly when a month softens.' },
    ],
  },
  {
    slug: 'wellness-health',
    url: '/industries/wellness-health/',
    name: 'Wellness & health',
    title: 'Wellness & Health D2C Marketing Agency | Scaling Socials',
    description:
      'Scaling Socials scales wellness and health D2C brands with Meta and Google Ads in India and the UAE — from zero paid history to crore-scale revenue.',
    eyebrow: 'Industries',
    h1: 'Performance marketing for wellness & health brands',
    answer:
      'Scaling Socials builds and scales paid media for wellness and health D2C brands across India and the UAE. We took one wellness brand from no paid-media history to ₹1.19 crore in year one at 6.23x average ROAS — including two months that returned nothing while we found the product, content and audience that worked.',
    blurb: 'From zero paid history to crore-scale, at a real ROAS.',
    proofSlugs: ['wellness-brand-zero-to-scale'],
    whatWeDo: [
      { glyph: 'spark', title: 'Crack the hero product first', body: 'Wellness lives or dies on proving one hero SKU against the right audience with the right content — all three, or none.' },
      { glyph: 'chart', title: 'Scale against proof, not hope', body: 'Every budget increase is made against results already on the board. One account grew monthly spend 44x that way.' },
      { glyph: 'gauge', title: 'Accept the right multiple', body: 'We will trade a high early multiple for a far larger base when the maths supports it, instead of capping the brand small.' },
    ],
    services: ['performance-marketing', 'conversion-rate-optimisation', 'shopify-development'],
    faqs: [
      { q: 'Wellness ads keep getting rejected — can you help?', a: 'Compliant, honest creative is part of the job. We build claims and creative that stand up, and lean on video that shows the product and its use rather than promises a platform will reject.' },
      { q: 'We are pre-revenue in wellness. Is that a fit?', a: 'Sometimes. We were the first to crack and scale one brand’s hero product from zero — but that took holding nerve through two dead months. If there is nothing proven yet, we will tell you plainly what testing will cost before it works.' },
    ],
  },
  {
    slug: 'gifting',
    url: '/industries/gifting/',
    name: 'Gifting',
    title: 'Gifting Brand Marketing Agency in India | Scaling Socials',
    description:
      'Scaling Socials launches and scales gifting D2C brands with Meta and Google Ads in India — proving new concepts efficiently before pouring in budget.',
    eyebrow: 'Industries',
    h1: 'Performance marketing for gifting brands',
    answer:
      'Scaling Socials launches and scales gifting D2C brands across India and the UAE. Gifting often means a new concept with no existing search demand, so we prove it converts on a small budget first — one gifting brand reached 11.82x average ROAS in its first quarter, with monthly return climbing as we concentrated budget behind the winner.',
    blurb: 'Prove a new gifting concept, then pour budget into the winner.',
    proofSlugs: ['gifting-brand-new-concept-launch'],
    whatWeDo: [
      { glyph: 'spark', title: 'Prove the concept before funding', body: 'A genuinely new concept has to be understood before it is bought. We prove it converts at all before spend goes anywhere near it.' },
      { glyph: 'funnel', title: 'Concentrate behind the winner', body: 'One campaign usually drives the bulk of orders. We find it and fund it instead of spreading thin across many.' },
      { glyph: 'chart', title: 'Let efficiency compound', body: 'Held flat on spend, a winning gifting account can climb in return month over month as creative and audience lock together.' },
    ],
    services: ['performance-marketing', 'shopify-development', 'social-media-marketing'],
    faqs: [
      { q: 'Our gifting concept is new — no one searches for it. Can ads work?', a: 'Yes, and that is exactly the case we have run. With no search demand, paid social has to teach the concept and prove it converts. We test cheaply, cap losers early, and scale the one angle that lands.' },
      { q: 'Gifting is seasonal — how do you handle peaks?', a: 'We build a proven baseline so a peak is something to spend into hard, not a scramble. Budget flexes up when a month works and pulls back when it does not, without losing the winning campaign.' },
    ],
  },
  {
    slug: 'beauty-cosmetics',
    url: '/industries/beauty-cosmetics/',
    name: 'Beauty & cosmetics',
    title: 'Beauty & Cosmetics Marketing Agency | Scaling Socials',
    description:
      'Scaling Socials builds Shopify stores, creative and paid media for beauty and cosmetics D2C brands in India and the UAE, designed around repeat purchase.',
    eyebrow: 'Industries',
    h1: 'Ecommerce & performance marketing for beauty brands',
    answer:
      'Scaling Socials builds stores, creative and paid media for beauty and cosmetics D2C brands across India and the UAE. Beauty runs on repeat purchase and fast-moving creative, so we build the store around revenue per session and feed a weekly creative pipeline — with ecommerce growth led by a founder who has scaled beauty brands.',
    blurb: 'Stores, creative and paid built around repeat purchase.',
    proofSlugs: [],
    quotes: [
      { quote: 'They revamped our cosmetic brand Timri’s ecommerce Shopify website. On-time delivery, a good sense of our business, and available whenever we need assistance. Highly recommended for ecommerce Shopify development.', name: 'Nikunj Vavadiya', brand: 'Timri', tag: 'Cosmetics · Shopify development' },
    ],
    whatWeDo: [
      { glyph: 'cart', title: 'A store built for repeat purchase', body: ['Beauty is bought again and again. We build the ', { text: 'product page, cart and checkout', href: '/web-development-company-bangalore/' }, ' around revenue per session, not just how it photographs.'] },
      { glyph: 'spark', title: 'Creative that keeps moving', body: 'Beauty creative fatigues fast. You supply footage; we cut and test video-led ads and statics weekly so the account never runs stale.' },
      { glyph: 'chart', title: 'Growth led by beauty experience', body: 'Our ecommerce growth is led by a founder who has scaled brands across beauty, fashion and home — not a template applied blind.' },
    ],
    services: ['shopify-development', 'performance-marketing', 'conversion-rate-optimisation'],
    faqs: [
      { q: 'Do you build Shopify stores for beauty brands?', a: 'Yes. We build and migrate beauty and cosmetics stores on Shopify around the product page, cart and checkout, with clean tracking from day one — a recent example being cosmetics brand Timri’s ecommerce store.' },
      { q: 'Can you run both our store and our ads?', a: 'Often, yes. Because we run performance marketing as well as development, the store and the acquisition are built to work together — landing pages match the creative and tracking is clean end to end.' },
    ],
  },
];

export const INDUSTRY_BY_SLUG: Record<string, IndustryContent> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.slug, i]),
);
