/**
 * Phone rules, shared by the browser and by /api/lead so the message a visitor
 * sees and the rule the server enforces can never drift apart.
 *
 * The old check was `digits.length < 7`, which accepted almost anything — a
 * phone field on a lead form is a contact path, and an unreachable number is a
 * lost lead just as surely as a dropped submission.
 *
 * STRICT rules exist only for the two markets Scaling Socials sells into, where
 * the numbering plan is worth asserting. Every other country gets a generic
 * E.164 sanity check instead of a guessed regex: inventing a rule for a
 * numbering plan nobody here has verified would reject real customers, which is
 * a worse failure than letting an odd number through.
 *
 * This module must stay free of the ~200-row country table (src/lib/countries.ts)
 * — it ships in the client bundle, and the browser reads the dial code straight
 * off the selected <option>'s data-dial attribute instead.
 */

export interface StrictRule {
  /** Local number (no country code, no trunk zero) must match. */
  valid: RegExp;
  /** Shown inline when it does not. */
  hint: string;
}

export const STRICT: Record<string, StrictRule> = {
  // Indian mobile: 10 digits, and the range actually starts at 6.
  IN: {
    valid: /^[6-9]\d{9}$/,
    hint: 'An Indian mobile is 10 digits starting 6, 7, 8 or 9.',
  },
  // UAE mobile: 5X + 7 digits. Landline: area code (2,3,4,6,7,9) + 7 digits.
  AE: {
    valid: /^(5\d{8}|[234679]\d{7})$/,
    hint: 'A UAE mobile is 9 digits starting 5. A landline is 8 digits.',
  },
};

export const DEFAULT_ISO = 'IN';

/**
 * Reduce whatever the visitor typed to the LOCAL part: no punctuation, no
 * country code, no trunk zero. People paste all three, and rejecting them for
 * it would be the site's fault, not theirs.
 */
export function localPart(raw: string, dial: string): string {
  let d = (raw || '').replace(/\D/g, '');
  const cc = (dial || '').replace(/\D/g, '');
  if (!d) return '';
  if (cc) {
    // "0091…" / "00971…" international prefix.
    if (d.startsWith('00' + cc)) d = d.slice(2 + cc.length);
    // A leading country code, but only when enough digits remain to still be a
    // number — otherwise "919…" (a real Indian mobile) would lose its first two.
    else if (d.startsWith(cc) && d.length > cc.length + 6) d = d.slice(cc.length);
  }
  return d.replace(/^0+/, ''); // trunk prefix
}

export interface PhoneResult {
  ok: boolean;
  /** E.164, e.g. "+919606713608". Empty when invalid. */
  e164: string;
  /** Inline message to show when `ok` is false. */
  error: string;
}

/**
 * @param raw   what the visitor typed
 * @param iso   selected country, e.g. "IN"
 * @param dial  that country's dial code, e.g. "+91" (from the <option>)
 */
export function checkPhone(raw: string, iso: string | undefined | null, dial: string): PhoneResult {
  const local = localPart(raw, dial);
  if (!local) return { ok: false, e164: '', error: 'Enter your phone number.' };

  const strict = iso ? STRICT[iso] : undefined;
  if (strict) {
    if (!strict.valid.test(local)) return { ok: false, e164: '', error: strict.hint };
    return { ok: true, e164: `${dial}${local}`, error: '' };
  }

  // Generic E.164: the whole number, country code included, is at most 15
  // digits, and a national number is realistically at least 4.
  const cc = (dial || '').replace(/\D/g, '');
  if (local.length < 4 || cc.length + local.length > 15) {
    return { ok: false, e164: '', error: 'Enter a valid phone number for the country you picked.' };
  }
  return { ok: true, e164: `${dial}${local}`, error: '' };
}
