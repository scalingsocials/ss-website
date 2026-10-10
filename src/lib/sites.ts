/**
 * Client sites shown in SiteShowcase: label, what the brand sells, and the live
 * URL the card links to.
 *
 * Keyed by the screenshot slug in src/assets/sites/<slug>-desktop.webp and
 * -mobile.webp. A slug with no entry here still renders (title-cased, not
 * linked), so a new screenshot never breaks the wall — but add it here, or the
 * card says nothing useful.
 *
 * Descriptions and URLs are the owner's own, taken from the sales portfolio at
 * portfolio.scalingsocials.com (2026-10-10). Younglings is WOMENSWEAR — the
 * collections are women's dresses, tops, co-ords and denim — despite the name
 * reading like a kids' brand.
 *
 * `kind` separates stores we built on Shopify from custom sites built from
 * scratch, because the two answer different questions on different pages.
 */
export interface ClientSite {
  label: string;
  /** One-line category, shown under the brand name. */
  sector: string;
  /** Live site, linked from the card. No trailing path. */
  url: string;
  kind: 'shopify' | 'web';
}

export const CLIENT_SITES: Record<string, ClientSite> = {
  stilig: { label: 'Stilig', sector: "Women's occasion wear", url: 'https://stilig.in/', kind: 'shopify' },
  zaurum: { label: 'Zaurum', sector: 'Jewellery', url: 'https://zaurum.in/', kind: 'shopify' },
  koshkulture: { label: 'Kosh Kulture', sector: "Women's fashion", url: 'https://koshkulture.com/', kind: 'shopify' },
  namak: { label: 'Namak', sector: 'Artisan home décor', url: 'https://namakindia.com/', kind: 'shopify' },
  talesbythreads: { label: 'Tales by Threads', sector: "Girls' kidswear", url: 'https://talesbythreads.com/', kind: 'shopify' },
  mamkam: { label: 'Mamkam', sector: 'Designer womenswear', url: 'https://mamkam.in/', kind: 'shopify' },
  frenchtheory: { label: 'French Theory', sector: "Women's western wear", url: 'https://frenchtheory.in/', kind: 'shopify' },
  sanyamalik: { label: 'Sanya Malik', sector: 'Fine jewellery', url: 'https://sanyamalik.com/', kind: 'shopify' },
  joliindia: { label: 'Joli India', sector: 'Fashion accessories', url: 'https://joliindia.com/', kind: 'shopify' },
  eazywagon: { label: 'Eazy Wagon', sector: 'Home décor and gifting', url: 'https://eazywagon.com/', kind: 'shopify' },
  younglings: { label: 'Younglings', sector: "Women's made-to-order wear", url: 'https://younglings.in/', kind: 'shopify' },
  chinmaya: { label: 'Chinmaya Mission', sector: 'Spiritual books and gifts', url: 'https://eshop.chinmayamission.com/', kind: 'shopify' },
  conexus: { label: 'Conexus Services', sector: 'CSR consultancy', url: 'https://conexusservices.com/', kind: 'web' },
  evhome: { label: 'EV Home', sector: 'Artisan homeware brand', url: 'https://evhome.in/', kind: 'web' },
  // www only: the apex serves no valid certificate (checked 2026-10-10), so
  // https://paragonmetal.com/ fails to connect. Flagged to the owner.
  paragon: { label: 'Paragon Metal', sector: 'Metal crafts exporter', url: 'https://www.paragonmetal.com/', kind: 'web' },
  ruby: { label: 'Ruby, World Square', sector: 'Real estate launch', url: 'https://ruby.worldsquare.in/', kind: 'web' },
};
