/**
 * Pick the line glyph for a sub-service card.
 *
 * Lives here rather than inside ServiceLayout so `npm run check:glyphs` can
 * import the real function instead of re-implementing it — a duplicated copy of
 * these rules in a test would pass while the page stayed wrong.
 *
 * First match wins, so the list runs SPECIFIC to GENERIC. Order is the whole
 * design here, not decoration. The previous generic-first ordering gave all four
 * SEO sub-services the same 'chart' — "Ecommerce SEO", "Technical SEO audits",
 * "Local SEO" and "Answer engine optimisation" each hit the /seo/ rule before
 * anything more specific could run, and four identical icons on one grid carry
 * no information at all.
 *
 * The rule: no two sub-services WITHIN one service may share a glyph. Across
 * services, reuse is fine and expected — a reader never sees two services' grids
 * at once. check:glyphs enforces exactly that and fails the build otherwise.
 */
const RULES: [RegExp, string][] = [
  [/answer engine|\baeo\b/, 'spark'],
  [/\bfunnel\b/, 'funnel'],
  [/migration|migrat|rebuild|replatform/, 'migrate'],
  [/\bspeed\b|core web|pagespeed/, 'speed'],
  [/redesign|editing|production|\btheme\b/, 'layers'],
  [/cart|checkout/, 'cart'],
  [/local\b|gmb|google business|\bmap\b/, 'target'],
  // Before the audit rule: "Analytics and tracking" is a measurement card, not
  // an audit card, and /analys/ used to swallow it.
  [/analytics|tracking|measure|report|dashboard/, 'gauge'],
  [/technical|audit|research|review/, 'audit'],
  [/ecommerce seo|store build|\bstore\b/, 'cart'],
  [/calendar|ideation|strateg/, 'plan'],
  [/creator|\bugc\b|community/, 'handshake'],
  [/grid|posting|social|instagram/, 'social'],
  [/mobile app|\bapps?\b/, 'phone'],
  // Before the page rule: "Landing page testing" is the test card, and "Product
  // page optimisation" is the one that should keep the page glyph.
  [/\btest(ing)?\b|experiment|variant/, 'test'],
  [/landing page|product page|\bpages?\b/, 'doc'],
  [/meta|facebook|paid social/, 'target'],
  [/google ads|search ads|\bppc\b|shopping/, 'search'],
  [/\bseo\b|ranking|organic/, 'chart'],
  [/email|crm|retention|lifecycle/, 'mail'],
  [/web|site|develop|headless|code|build/, 'code'],
  [/conversion|\bcro\b/, 'funnel'],
];

export function glyphFor(title: string): string {
  const t = title.toLowerCase();
  for (const [re, g] of RULES) if (re.test(t)) return g;
  return 'spark';
}
