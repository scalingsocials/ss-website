/**
 * Case studies — the seven documented accounts, ANONYMISED.
 *
 * ── Anonymity is a hard requirement, not a placeholder ────────────────────────
 * These are high-performing brands and naming them hands competitors a target
 * list. No client name, handle, store URL or logo mapping belongs in this file
 * or anywhere else in the repo: anything committed here can end up rendered in
 * public HTML. Each account is identified by its NICHE and its SITUATION.
 * The owner holds the name↔niche mapping privately, off the repo.
 *
 * ── What makes an anonymous case study credible ───────────────────────────────
 * Specificity does the work a name used to do: a real niche, a real period, real
 * figures, and the worst month stated rather than hidden. Every number below is
 * taken from the client's own Meta Ads Manager account via the source case-study
 * PDFs (owner-supplied, 2026-09). Averages are blended across the whole period —
 * never a peak month dressed up as typical.
 *
 * ── Growth, not months (owner directive) ──────────────────────────────────────
 * Pages show the state change across the engagement, not a month-by-month grind.
 * `delta` is the before→after for accounts with a real transformation. The two
 * mature retainers have no honest before→after — their proof is a floor that
 * holds — so they carry `held` instead. Do NOT invent a Delta for them.
 */

export type Archetype = 'launch' | 'turnaround' | 'scale' | 'sustain';

export interface Delta {
  metric: string;
  before: string;
  after: string;
}

/** For mature accounts whose proof is stability, not a before→after. */
export interface Held {
  metric: string;
  value: string;
  note: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Move {
  title: string;
  body: string;
}

export interface OutcomeRow {
  before: string;
  after: string;
}

export interface CaseStudy {
  slug: string;
  /** Public identity. Never a brand name. */
  niche: string;
  /** Attribution string passed to Delta/CaseStudyCard in place of a name. */
  client: string;
  archetype: Archetype;
  period: string;
  channels: string;
  title: string; // <title>
  headline: string; // h1
  /** 40–60 words, self-contained, names "Scaling Socials" (CLAUDE.md §13). */
  answer: string;
  /** Meta description. Gate: 140–158 chars, unique per page (03 §2). */
  description: string;
  delta?: Delta;
  held?: Held;
  stats: Stat[];
  situation: string;
  moves: Move[];
  outcome: OutcomeRow[];
  /** The soft month, stated plainly. Every case study has one. */
  honesty: string;
  takeaway: string;
}

export const ARCHETYPES: Record<Archetype, { label: string; blurb: string }> = {
  launch: {
    label: 'Launched from zero',
    blurb:
      'No pixel data, no tested creative, no benchmark. Scaling Socials built the first performance engine these brands ever ran.',
  },
  turnaround: {
    label: 'Turned around an inherited account',
    blurb:
      'The budget was already being spent. Scaling Socials took the account over and changed what it returned.',
  },
  scale: {
    label: 'Found another gear in a mature account',
    blurb:
      'Years in, a stable account is not a finished one. These are the ceilings we decided to push past.',
  },
  sustain: {
    label: 'Kept a winner winning',
    blurb:
      'The least dramatic accounts on this page, which for a retainer client is exactly the point.',
  },
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'wellness-brand-zero-to-scale',
    niche: 'Wellness D2C',
    client: 'A wellness D2C brand',
    archetype: 'launch',
    period: 'Dec 2023 – Dec 2024',
    channels: 'Meta Ads',
    title: 'Wellness D2C Case Study: ₹0 to ₹1.19 Cr in Year One',
    description: 'How Scaling Socials took a wellness D2C brand from zero paid-media history to ₹1.19 crore in year one at 6.23x ROAS, including two dead months.',
    headline: 'Two months of nothing, then ₹1.19 crore',
    answer:
      'Scaling Socials took a wellness D2C brand from no paid-media history to ₹1.19 crore in revenue inside its first year, at 6.23x average return on ad spend. The first two months returned nothing at all while we tested product, content and audience — then monthly budget grew 44x against proven performance.',
    delta: { metric: 'Revenue, first year', before: '₹0', after: '₹1.19 Cr' },
    stats: [
      { value: '₹1.19 Cr', label: 'Year-one revenue' },
      { value: '₹19.17 L', label: 'Year-one ad spend' },
      { value: '6.23x', label: 'Average ROAS' },
      { value: '44x', label: 'Budget growth' },
    ],
    situation:
      'The brand had never run performance marketing. We were the first in India to crack and scale their hero product, which meant starting with no purchase data for the algorithm to learn from, no tested creative angle, and no benchmark to judge an early number against.',
    moves: [
      {
        title: 'Product, content and audience — all three, or none',
        body: 'The dead months were not a targeting problem or a creative problem. They were the absence of all three answers at once. Once the hero product proved itself against the right audience with the right content format, the account never needed rescuing again.',
      },
      {
        title: 'Scaled the moment the answer was real, not before',
        body: 'February returned ₹42,000. March returned ₹3,00,000 at 11.54x. Monthly spend went from ₹7,800 to ₹26,000 the moment there was something proven to put money behind.',
      },
      {
        title: 'Accepted a lower multiple to buy volume',
        body: 'The account peaked at 11.54x early on small spend. By late in the year it was running ₹3,50,000 a month at 6.00x — a lower multiple on a far larger base. Chasing the 11x would have capped the brand at a fraction of the size.',
      },
      {
        title: 'Grew budget only against proven performance',
        body: 'Monthly spend rose 44x inside one year, from ₹8,000 to ₹3,50,000. Every increase was made against results already on the board, never in anticipation of them.',
      },
    ],
    outcome: [
      { before: '₹8,000 monthly ad spend', after: '₹3,50,000 monthly ad spend' },
      { before: 'No revenue, no ROAS, no data', after: '₹1.19 Cr at 6.23x average' },
      { before: 'No proven product', after: 'A category-leading SKU cracked first in India' },
      { before: 'Two months from being dropped', after: 'A client relationship still running' },
    ],
    honesty:
      'The first two months produced no revenue at all — not weak revenue, none. Extending the engagement another three months was a genuinely difficult call for the founders. Everything in this case study happened after that call.',
    takeaway:
      'Every case study you read starts at the month things worked. This one starts two months earlier, because that period is the actual work — testing with nothing coming back, and holding your nerve while a client watches money leave with no revenue attached to it.',
  },

  {
    slug: 'womens-fashion-account-turnaround',
    niche: "Women's fashion",
    client: "A women's fashion label",
    archetype: 'turnaround',
    period: 'May – Jul 2026',
    channels: 'Meta Ads',
    title: 'Ad Account Turnaround: 1.75x to 3.94x ROAS in a Quarter',
    description: "How Scaling Socials rebuilt an inherited women's fashion ad account from 1.75x to 3.94x ROAS in one quarter, lifting revenue 204% on 35% more spend.",
    headline: '3x the revenue on 35% more spend',
    answer:
      'Scaling Socials inherited a women’s fashion ad account returning 1.75x under a previous agency and rebuilt it to 3.94x in a single quarter. Revenue rose 204% on 35% more spend — ₹7.6 lakh against ₹2.5 lakh the quarter before — with our worst month still comfortably beating the account’s previous best.',
    delta: { metric: 'Account ROAS', before: '1.75x', after: '3.94x' },
    stats: [
      { value: '3.94x', label: 'ROAS with us (May–Jul)' },
      { value: '1.75x', label: 'ROAS prior agency (Feb–Apr)' },
      { value: '₹7.60 L', label: 'Revenue, our first quarter' },
      { value: '+204%', label: 'Revenue growth' },
    ],
    situation:
      'The account was not new and it was not empty. It had budget behind it, campaign history and a full quarter of data under another agency. What it did not have was a return worth keeping: ROAS moved 1.30x to 2.00x to 1.63x with no direction, so a quarter of spend had bought no compounding advantage.',
    moves: [
      {
        title: 'Cut the drag before adding budget',
        body: 'The first move was subtraction. Individual campaigns were already capable of returning above 2.5x while the account as a whole sat at 1.63x — the potential was there and the drag was everything running alongside it. We consolidated onto what could demonstrably return above account average and stopped funding the rest.',
      },
      {
        title: 'Established a clean baseline month',
        body: 'May was run deliberately tight: ₹38,000 in spend for ₹2,00,000 in revenue at 5.26x. The goal was not volume. It was a trustworthy number to scale against.',
      },
      {
        title: 'Scaled with a floor, not a target',
        body: 'From June we roughly doubled spend. Return came down from the May peak, as it always does under scale, but was held above 3.5x — more than double the account’s own historical average. We traded peak efficiency for volume on purpose, and set the floor before we started.',
      },
      {
        title: 'Judged the increment, not the average',
        body: 'The ₹50,000 of additional spend over the prior quarter returned roughly ₹5,10,000 in additional revenue. That marginal return — over 10x on the incremental rupee — is the number that justified continuing to scale.',
      },
    ],
    outcome: [
      { before: '1.75x average ROAS', after: '3.94x average ROAS' },
      { before: '₹2,50,000 quarterly revenue', after: '₹7,60,000 quarterly revenue' },
      { before: 'Spend spread across positions that never earned it', after: 'Budget consolidated behind proven positions' },
      { before: 'Nothing compounding month to month', after: 'A baseline that scaled three months running' },
    ],
    honesty:
      'Our weakest month of the quarter returned 3.59x — down from a 5.26x opening month, because scaling always costs some efficiency. It still comfortably beat the 2.00x that was the best month the account had managed before we took it over.',
    takeaway:
      'Inherited accounts are rarely broken for want of budget. They break because spend is spread across positions that have not earned it, and nothing is left running long enough to compound. The first job on a takeover is not to spend more — it is to find out what the account can actually do.',
  },

  {
    slug: 'gifting-brand-new-concept-launch',
    niche: 'Gifting',
    client: 'A gifting brand',
    archetype: 'launch',
    period: 'May – Jul 2026',
    channels: 'Meta Ads',
    title: 'Gifting Case Study: 11.82x ROAS on a Brand New Concept',
    description: 'How Scaling Socials launched a gifting brand from a blank ad account to 11.82x average ROAS in one quarter, with monthly return rising 9.62x to 14.23x.',
    headline: 'Return went up every month we scaled',
    answer:
      'Scaling Socials launched a gifting brand from a blank ad account to ₹9.53 lakh in revenue across its first quarter, at 11.82x average return on ad spend. Monthly return climbed from 9.62x to 14.23x while spend stayed flat, because budget kept concentrating behind one proven campaign instead of spreading.',
    delta: { metric: 'Monthly ROAS', before: '9.62x', after: '14.23x' },
    stats: [
      { value: '₹9.53 L', label: 'First-quarter revenue' },
      { value: '₹80,646', label: 'Ad spend' },
      { value: '11.82x', label: 'Average ROAS' },
      { value: '859', label: 'Purchases' },
    ],
    situation:
      'This was a genuinely new concept in the Indian gifting market, at roughly ₹1,100 average order value. There was no existing search demand to capture and no competitor already proving the offer worked — the customer has to understand what the product even is before deciding it is worth buying. We built the account from scratch, with no pixel history and no benchmark.',
    moves: [
      {
        title: 'Proved the concept before funding it',
        body: 'The first real month returned 9.62x — evidence the offer converted at all — before spend went anywhere near it.',
      },
      {
        title: 'Held spend flat and let efficiency compound',
        body: 'Monthly budget barely moved across the quarter while return rose from 9.62x to 11.40x to 14.23x, as the winning creative and audience locked together.',
      },
      {
        title: 'Concentrated budget behind the winner',
        body: 'Each month a single campaign returned between 14x and 18x and drove roughly three-quarters of revenue and about 80% of all orders. The account never depended on a volume of campaigns — it depended on finding the one and funding it.',
      },
      {
        title: 'Capped the losers early',
        body: 'Weak campaigns were held to a few hundred rupees of lifetime spend and shut off. Testing is only expensive when you let a loser run.',
      },
    ],
    outcome: [
      { before: 'A new concept with no proof it could sell on paid', after: '₹9,53,327 in tracked revenue' },
      { before: 'Zero pixel and purchase data', after: '859 purchases and a live optimisation signal' },
      { before: 'No performance benchmark', after: 'A proven winner returning 14–18x to scale from' },
      { before: 'Efficiency assumed to fall as spend rises', after: 'Return rose every month — 9.62x to 14.23x' },
    ],
    honesty:
      'This is a small base — ₹80,646 of spend across the quarter. The honest claim is efficiency and proof of concept on something genuinely new, not scale. The account has not yet been tested at serious budget.',
    takeaway:
      'Not every account is a scaling story. For a new concept on a small budget the win is to prove it converts, find the one campaign that works and pour budget into that — not to spread thin chasing more. Do it in that order and efficiency climbs while you grow.',
  },

  {
    slug: 'womenswear-breaking-the-ceiling',
    niche: "Mid-luxury women's western wear",
    client: "A mid-luxury women's western wear label",
    archetype: 'scale',
    period: 'Jan – Jul 2026',
    channels: 'Meta Ads',
    title: 'Womenswear Case Study: Past a Ceiling to 7.09x ROAS',
    description: 'How Scaling Socials pushed a mid-luxury womenswear account past a year-long ceiling to ₹57.68 lakh in seven months at 7.09x average return on ad spend.',
    headline: 'Our worst month this year beat our best month last year',
    answer:
      'Scaling Socials scaled a mid-luxury women’s western wear account past a ceiling it had sat under for a year, delivering ₹57.68 lakh across seven months at 7.09x average return on ad spend. Every month of 2026 beat the brand’s entire 2025 operating range, and the weakest month still cleared the previous year’s best.',
    delta: { metric: 'Average ROAS', before: '3–5x', after: '7.09x' },
    stats: [
      { value: '₹57.68 L', label: 'Seven-month revenue' },
      { value: '₹8.13 L', label: 'Seven-month ad spend' },
      { value: '7.09x', label: 'Average ROAS' },
      { value: '5.83x', label: 'Worst month' },
    ],
    situation:
      'A three-year client, and one of our longest relationships. Through 2025 the account was stable but capped: good months returned 4.5x to 5x, bad months sat between 3x and 3.5x. It was healthy and predictable and it had stopped getting bigger. In January we made a deliberate call with the client — stop protecting the number, start pushing the ceiling.',
    moves: [
      {
        title: 'Raised the spend ceiling, not just the budget',
        body: 'January ran ₹65,000. May ran ₹1,63,000 — two and a half times as much on the same account, four months later. Scaling was the plan, not a reaction to a good month.',
      },
      {
        title: 'Took the swing when it appeared',
        body: 'May was the month everything lined up and we spent into it hard: ₹1,63,000 returning ₹14,00,000 at 8.59x. The account had never crossed ₹10,00,000 in a month before. Hesitating would have cost more than a bad month ever could.',
      },
      {
        title: 'Pulled back on the way down',
        body: 'June and July softened, so spend came down with them. Revenue fell, but return held at 6.99x and 6.14x. A quieter month is only a bad month if you keep paying full price for it.',
      },
      {
        title: 'Planned to a 6.5x average and beat it',
        body: 'The target for the year was 6.5x. The account delivered 7.09x while spending materially more than it ever had. Scaling did not cost efficiency here — it bought it.',
      },
    ],
    outcome: [
      { before: 'Good months at 4.5x – 5x', after: 'Good months at 8x+' },
      { before: 'Bad months at 3x – 3.5x', after: 'Weakest month at 5.83x' },
      { before: 'Monthly revenue capped under ₹10,00,000', after: '₹14,00,000 in a single month' },
      { before: 'A stable account that had stopped growing', after: '₹57.68 L in seven months at 7.09x' },
    ],
    honesty:
      'March was the weakest month of the year at 5.83x, and June and July both softened after the May peak. Every one of those months still landed above the account’s entire 2025 operating range.',
    takeaway:
      'A stable account is not the same as a finished one. This one spent a year returning reliable numbers that were quietly capping what the brand could earn, and the only way to find the real ceiling was to spend past the comfortable one. Three years of knowing the floor is what turns aggressive scaling from a gamble into a calculation.',
  },

  {
    slug: 'kids-accessories-seven-month-floor',
    niche: 'Kids accessories',
    client: 'A kids accessories brand',
    archetype: 'sustain',
    period: 'Jan – Jul 2026',
    channels: 'Meta Ads',
    title: 'Kids Accessories: Seven Months Never Below 6.95x ROAS',
    description: 'How Scaling Socials held a kids accessories account above a 6.95x floor for seven consecutive months, returning ₹60.89 lakh on ₹8.15 lakh of ad spend.',
    headline: 'Seven months. Never below 6.95x.',
    answer:
      'Scaling Socials runs a kids accessories account that returned ₹60.89 lakh across seven consecutive months at 7.47x average return on ad spend, with a worst month of 6.95x. Monthly budget flexed 47% to match conditions while the return floor held — no month in the period needs a caveat attached to it.',
    held: {
      metric: 'Return floor',
      value: '6.95x',
      note: 'The worst month across seven consecutive months, not the average.',
    },
    stats: [
      { value: '₹60.89 L', label: 'Seven-month revenue' },
      { value: '₹8.15 L', label: 'Seven-month ad spend' },
      { value: '7.47x', label: 'Average ROAS' },
      { value: '6.95x', label: 'Worst month' },
    ],
    situation:
      'A client of over a year. This is not a launch and not a turnaround — it is a mature account doing what a mature account is supposed to do. Most reporting leads with an average because an average can hide a lot: a 7.47x could be built from two spectacular months carrying five poor ones. Here every month landed between 6.95x and 8.75x.',
    moves: [
      {
        title: 'Spend flexes, standards do not',
        body: 'Budget ranged from ₹89,000 in the lightest month to ₹1,31,000 in the heaviest — a 47% swing. Return across that same span stayed inside a 1.8x band. Spend is the variable we move; the return threshold is not.',
      },
      {
        title: 'The lightest month returned the most',
        body: 'February ran the lowest spend of the seven and delivered the highest return at 8.75x. That is what pulling back looks like when conditions do not support volume. Most accounts push through a soft month; we spend less in it.',
      },
      {
        title: 'Push hard when the month allows it',
        body: 'March and May both took ₹1,31,000, the two heaviest budgets of the period, and returned ₹9,74,000 and ₹10,00,000. When a month is working, restraint is just as expensive as recklessness.',
      },
      {
        title: 'No rebuilds mid-flight',
        body: 'A mature account earns the right to be left alone. Structural changes get made deliberately, not in reaction to a single week’s numbers.',
      },
    ],
    outcome: [
      { before: 'A strong average built on volatile months', after: 'A 6.95x floor across seven months' },
      { before: 'Budget held flat regardless of conditions', after: 'Spend flexed 47% to match conditions' },
      { before: 'Soft months pushed through', after: 'Soft months spent lighter, returned more' },
      { before: 'Reporting that needs explaining', after: 'No month requiring a caveat' },
    ],
    honesty:
      'April was the weakest month of the seven at 6.95x. That is the floor this case study is named after — we publish it rather than the 8.75x peak, because the floor is the number a brand can actually plan around.',
    takeaway:
      'Not every month is going to be a good month, but a mature account should not have bad ones either. The difference is what you do with budget when a month is soft. Ask an agency for their average, then ask for their worst month — the second answer tells you far more.',
  },

  {
    slug: 'indo-western-launch-90-days',
    niche: 'Premium Indo-western occasion wear',
    client: 'A premium Indo-western occasion wear label',
    archetype: 'launch',
    period: 'Apr – Jul 2026',
    channels: 'Meta Ads',
    title: 'Occasion Wear Case Study: Zero to 6.33x in 90 Days',
    description: "How Scaling Socials built a premium occasion wear label's first ad engine from zero pixel data to ₹6.16 lakh and 6.33x return inside 90 days.",
    headline: 'From zero to 6.33x in 90 days',
    answer:
      'Scaling Socials built a premium Indo-western occasion wear label’s first performance marketing engine from zero pixel data, reaching ₹6.16 lakh in revenue at 6.33x return across 90 days. Testing stayed cheap — the three weakest campaigns took under 8% of budget — while the top campaign returned 9.46x.',
    delta: { metric: 'Revenue in the first 90 days', before: '₹0', after: '₹6.16 L' },
    stats: [
      { value: '₹6.16 L', label: '90-day revenue' },
      { value: '₹97,402', label: '90-day ad spend' },
      { value: '6.33x', label: 'Average ROAS' },
      { value: '177', label: 'Purchases' },
    ],
    situation:
      'We were the first agency ever to run performance marketing for this label — not the first to improve it, the first to run it at all. That meant zero pixel data, no creative library, no benchmarks, and a premium price point in a category where most competitors compete on markdown. That route was closed to us.',
    moves: [
      {
        title: 'Let the product do the selling',
        body: 'We went video-first, and the winning creatives had one thing in common: they showed the product properly — drape, movement, fabric, fit. At a premium ticket the customer is trying to answer “is this actually worth it?” before checkout. Styled video that displays the garment honestly answers that; clever creative that hides it does not.',
      },
      {
        title: 'Tested wide, capped losers early',
        body: 'Every underperforming campaign was held under ₹3,200 in lifetime spend. The three weakest campaigns combined consumed less than 8% of total budget across the whole quarter.',
      },
      {
        title: 'Concentrated budget behind the winner',
        body: 'The top campaign took ₹42,564 — 44% of total spend — and returned ₹4,02,552 at 9.46x, producing 121 of 177 total purchases.',
      },
      {
        title: 'Scaled in good months, held in bad ones',
        body: 'Budget moved up when efficiency held and stayed flat when it did not. No panic increases, no panic cuts.',
      },
    ],
    outcome: [
      { before: 'No performance marketing running', after: '₹6,16,134 in tracked revenue' },
      { before: 'Zero pixel and purchase data', after: '177 purchases and a live optimisation signal' },
      { before: 'No tested creative', after: 'A proven video-first angle and a scalable winner' },
      { before: 'No performance benchmark', after: '6.33x as the baseline to beat' },
    ],
    honesty:
      'Month three fell to 4.83x, well down on the 7.31x and 7.00x of the first two months. We publish it rather than hide it — first quarters on a brand-new account rarely move in a straight line, and the quarter still closed above 6x.',
    takeaway:
      'For a brand starting at absolute zero, the first quarter is not really about revenue. It is about buying answers as cheaply as possible, and then having the nerve to put real money behind the ones you find. Never make a structural decision off thirty days of data.',
  },

  {
    slug: 'kidswear-campaign-longevity',
    niche: 'Kidswear',
    client: 'A kidswear brand',
    archetype: 'sustain',
    period: 'May – Jul 2026',
    channels: 'Meta Ads',
    title: 'Kidswear Case Study: Eight Months on One Ad Campaign',
    description: 'How Scaling Socials kept one kidswear campaign running eight months without a rebuild, returning ₹15.85 lakh in a quarter at 5.39x average ROAS.',
    headline: 'Eight months on the same winning campaign',
    answer:
      'Scaling Socials has run a kidswear brand’s paid media on a single winning campaign for eight straight months, returning ₹15.85 lakh in the most recent quarter at 5.39x. In a category where creative fatigues fast, the account compounds on one proven asset instead of being rebuilt every few weeks.',
    held: {
      metric: 'Longest unbroken run',
      value: '8 months',
      note: 'One campaign, live since December, through a full seasonal cycle without a rebuild.',
    },
    stats: [
      { value: '₹15.85 L', label: 'Quarterly revenue' },
      { value: '₹2.94 L', label: 'Quarterly ad spend' },
      { value: '5.39x', label: 'Average ROAS' },
      { value: '8 months', label: 'Longest run' },
    ],
    situation:
      'Kidswear is a category built on churn. Children outgrow sizes, parents cycle through needs and move on, and creative fatigues faster here than almost anywhere else in fashion. The standard response is to keep rebuilding — new campaigns, new structures, new audiences, every few weeks. Every rebuild resets the learning phase and buys the same answers a second time.',
    moves: [
      {
        title: 'Product that sells repeatedly, not once',
        body: 'Not the SKU that spikes during a launch, but the one that sells to a replenishing audience. In kidswear that usually means a staple, not a statement piece.',
      },
      {
        title: 'Content that survives repetition',
        body: 'Not the creative with the best first-week hook rate, but the one that still works in month six. A hook that burns out in three weeks costs more than a slightly weaker one that runs for eight months.',
      },
      {
        title: 'An audience that refills itself',
        body: 'Not the segment that converts best today, but the one that replenishes. Kidswear has a natural advantage — a new cohort of parents enters the market continuously — provided the targeting is built to catch them.',
      },
      {
        title: 'Budget into scaling a known asset',
        body: 'When all three hold, you stop rebuilding. The campaign driving this quarter launched in December and was still running in July, so budget went into scaling a known asset instead of re-discovering one.',
      },
    ],
    outcome: [
      { before: 'Rebuild campaigns every few weeks', after: 'One campaign live for eight months' },
      { before: 'Reset learning with each rebuild', after: 'Compounding signal on a single asset' },
      { before: 'Return swings month to month', after: '5.20x – 5.76x across the quarter' },
      { before: 'Budget spent re-finding answers', after: 'Budget spent scaling known ones' },
    ],
    honesty:
      'This is a stability story, not a scaling one. Revenue moved very little across the quarter and spend stayed in a narrow band — the account is optimised for consistency, and the numbers look correspondingly undramatic.',
    takeaway:
      'Most brands ask how quickly something can scale. The more useful question is how long it can run once it works. Longevity is what happens when product, content and audience are all correct at the same time, so nothing needs rescuing.',
  },
];

export const CASE_STUDY_BY_SLUG: Record<string, CaseStudy> = Object.fromEntries(
  CASE_STUDIES.map((c) => [c.slug, c]),
);

/**
 * Verified aggregate — the sum of the seven accounts documented above, and
 * nothing else. Deliberately narrower than any lifetime agency figure, because
 * every rupee here traces back to a client ad account we can produce on request.
 */
export const CASE_STUDY_TOTALS = {
  revenue: '₹2.77 Cr',
  spend: '₹42.1 L',
  roas: '6.58x',
  accounts: '7',
} as const;

/**
 * Homepage / service-page proof, DERIVED from CASE_STUDIES above rather than
 * duplicated, so the numbers can never drift from the case studies themselves.
 *
 * Two different selections because they do two different jobs:
 *   HERO_STATS         — the three biggest revenue figures, for scanning.
 *   FEATURED_STUDIES   — one launch, one turnaround, one scale, each with a real
 *                        before→after. The homepage proof cards are Deltas
 *                        (08 §7.8: "real result tables, not thumbnails"), so a
 *                        study without a `delta` cannot be featured there.
 */
const pick = (slug: string): CaseStudy => {
  const c = CASE_STUDY_BY_SLUG[slug];
  if (!c) throw new Error(`Unknown case study slug: ${slug}`);
  return c;
};

export const HERO_STATS = [
  'wellness-brand-zero-to-scale',
  'kids-accessories-seven-month-floor',
  'womenswear-breaking-the-ceiling',
].map((slug) => {
  const c = pick(slug);
  return {
    value: c.stats[0]!.value,
    label: c.stats[0]!.label,
    niche: c.niche,
    href: `/case-studies/${c.slug}/`,
  };
});

export const FEATURED_STUDIES = [
  'wellness-brand-zero-to-scale',
  'womens-fashion-account-turnaround',
  'womenswear-breaking-the-ceiling',
].map((slug) => {
  const c = pick(slug);
  if (!c.delta) throw new Error(`Featured study ${slug} has no delta to show.`);
  return c;
});
