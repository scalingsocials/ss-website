/**
 * money.ts — INR → AED conversion for the UAE landing page.
 *
 * The UAE LP shows the same documented India accounts as the India LP, with
 * every rupee figure converted and the page saying so ("Figures converted from
 * INR at AED 1 = ₹25.7"). Converting at render time from the one source
 * (caseStudies.ts) means the AED figures can never drift from the INR ones.
 *
 * Rate fixed on 5 Nov 2026 (owner brief). Change it here and every converted
 * figure on the page, and the note that states the rate, moves together.
 *
 * Rounding is deliberate: nobody wants to read "AED 3,891,051". Three
 * significant figures, with K and M suffixes.
 */
export const INR_PER_AED = 25.7;
export const RATE_NOTE = `Figures converted from INR at AED 1 = ₹${INR_PER_AED}.`;

const MULT: Record<string, number> = { cr: 1e7, crore: 1e7, l: 1e5, lakh: 1e5, k: 1e3 };

const sig3 = (n: number): string => String(Number(n.toPrecision(3)));

/** A plain AED amount, rounded to three significant figures. */
export function formatAed(aed: number): string {
  if (aed === 0) return 'AED 0';
  if (aed >= 1e6) return `AED ${sig3(aed / 1e6)}M`;
  if (aed >= 1e4) return `AED ${sig3(aed / 1e3)}K`;
  return `AED ${Number(aed.toPrecision(3)).toLocaleString('en-US')}`;
}

/** Convert a rupee amount (in rupees) to a rounded AED string. */
export const inrToAed = (inr: number): string => formatAed(inr / INR_PER_AED);

// ₹1.19 Cr · ₹1.19 crore · ₹7.60 L · ₹7.6 lakh · ₹3,50,000 · ₹42,000 · ₹0 · ₹40 K
const INR_RE = /₹\s?(\d[\d,]*(?:\.\d+)?)(?:\s?(Cr|crore|L|lakh|K)\b)?/gi;

/** Replace every rupee figure in a string with its AED equivalent. */
export function convertText(s: string): string {
  return s
    .replace(INR_RE, (_m, num: string, unit?: string) => {
      const n = Number(num.replace(/,/g, ''));
      const mult = unit ? MULT[unit.toLowerCase()] ?? 1 : 1;
      return inrToAed(n * mult);
    })
    .replace(/\brupee\b/g, 'dirham');
}

/**
 * Deep-convert every string in a value (a case study, a kicker map). Numbers
 * are left alone: they drive chart geometry, where only the ratios matter.
 * A bare "₹" unit field becomes "AED".
 */
export function convertDeep<T>(v: T): T {
  if (typeof v === 'string') return (v.trim() === '₹' ? 'AED ' : convertText(v)) as T;
  if (Array.isArray(v)) return v.map((x) => convertDeep(x)) as T;
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, convertDeep(x)])) as T;
  }
  return v;
}
