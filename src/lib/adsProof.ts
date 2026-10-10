/**
 * Twelve live client ad accounts, screenshotted from Meta Ads Manager's own
 * totals row. Owner-supplied from the sales portfolio (2026-10-10).
 *
 * Every figure here is READ OFF the screenshot beside it — the totals row is in
 * the image, so the claim and its evidence ship together and cannot drift
 * (CLAUDE.md §10, §15). Verified against the images: account 01 totals
 * ₹18,20,806.60 at 13.21 ROAS, account 06 totals ₹14,04,176.50 at 8.60.
 *
 * Accounts stay anonymous: campaign and account names are cropped or hidden in
 * the screenshots, matching the anonymity rule the case studies follow. These
 * are PER-ACCOUNT figures, not an aggregate claim, so they are outside the
 * proof-stat gate (scripts/check-proofstats.mjs) by design.
 */
export interface AdAccountProof {
  /** 1-12, matching src/assets/ads-manager/account-N.webp */
  n: number;
  /** Average purchase ROAS, as shown in the totals row. */
  roas: string;
  /** Purchase value for the window, as shown in the totals row. */
  revenue: string;
}

export const AD_ACCOUNTS: AdAccountProof[] = [
  { n: 1, roas: '13.21', revenue: '₹18.21 L' },
  { n: 2, roas: '9.27', revenue: '₹2.53 Cr' },
  { n: 3, roas: '10.94', revenue: '₹1.44 Cr' },
  { n: 4, roas: '8.03', revenue: '₹2.84 Cr' },
  { n: 5, roas: '16.41', revenue: '₹7.32 L' },
  { n: 6, roas: '8.60', revenue: '₹14.04 L' },
  { n: 7, roas: '9.01', revenue: '₹5.03 L' },
  { n: 8, roas: '6.09', revenue: '₹21.40 L' },
  { n: 9, roas: '6.52', revenue: '₹7.09 L' },
  { n: 10, roas: '9.16', revenue: '₹11.78 L' },
  { n: 11, roas: '5.28', revenue: '₹18.59 L' },
  { n: 12, roas: '13.71', revenue: '₹4.84 L' },
];
