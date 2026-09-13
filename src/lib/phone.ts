/**
 * Phone rules for the two markets Scaling Socials sells into (entity.ts
 * `areaServed`: IN, AE). Shared by the browser and by /api/lead, so the message
 * a visitor sees and the rule the server enforces can never drift apart.
 *
 * The old check was `digits.length < 7`, which accepted almost anything — a
 * phone field on a lead form is a contact path, and an unreachable number is a
 * lost lead just as surely as a dropped submission.
 *
 * Deliberately generous within each country: mobile AND landline both pass. The
 * whole point of this work has been to stop losing real enquiries, so a rule
 * tight enough to reject a genuine customer would be a worse bug than the one it
 * replaces.
 */

export interface Country {
  /** ISO code, used as the select value. */
  iso: 'IN' | 'AE';
  /** Dial prefix as displayed, e.g. "+91". */
  dial: string;
  /** Digits of the dial prefix, e.g. "91". */
  cc: string;
  label: string;
  /** Example local number, shown as the placeholder. */
  example: string;
  /** Local number (no country code, no leading zero) must match this. */
  valid: RegExp;
  /** Human explanation used in the inline error. */
  hint: string;
}

export const COUNTRIES: Country[] = [
  {
    iso: 'IN',
    dial: '+91',
    cc: '91',
    label: 'India',
    example: '96067 13608',
    // Indian mobile: 10 digits, and the range actually starts at 6.
    valid: /^[6-9]\d{9}$/,
    hint: 'An Indian mobile is 10 digits starting 6, 7, 8 or 9.',
  },
  {
    iso: 'AE',
    dial: '+971',
    cc: '971',
    label: 'UAE',
    example: '50 123 4567',
    // UAE mobile: 5X + 7 digits. Landline: area code (2,3,4,6,7,9) + 7 digits.
    valid: /^(5\d{8}|[234679]\d{7})$/,
    hint: 'A UAE mobile is 9 digits starting 5. A landline is 8 digits.',
  },
];

export const DEFAULT_ISO: Country['iso'] = 'IN';

export function countryOf(iso: string | undefined | null): Country {
  return COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0]!;
}

/**
 * Reduce whatever the visitor typed to the LOCAL part: no punctuation, no
 * country code, no trunk zero. People paste all three, and rejecting them for
 * it would be the site's fault, not theirs.
 */
export function localPart(raw: string, c: Country): string {
  let d = (raw || '').replace(/\D/g, '');
  if (!d) return '';
  // "0091..." / "00971..." international prefix.
  if (d.startsWith('00' + c.cc)) d = d.slice(2 + c.cc.length);
  // Leading country code, but only when what remains is still a plausible
  // number — otherwise "919..." (a real Indian mobile) would lose its first two
  // digits.
  else if (d.startsWith(c.cc) && d.length > c.cc.length + 6) d = d.slice(c.cc.length);
  // Trunk prefix.
  d = d.replace(/^0+/, '');
  return d;
}

export interface PhoneResult {
  ok: boolean;
  /** E.164, e.g. "+919606713608". Empty when invalid. */
  e164: string;
  /** Inline message to show when `ok` is false. */
  error: string;
}

export function checkPhone(raw: string, iso: string | undefined | null): PhoneResult {
  const c = countryOf(iso);
  const local = localPart(raw, c);
  if (!local) return { ok: false, e164: '', error: 'Enter your phone number.' };
  if (!c.valid.test(local)) return { ok: false, e164: '', error: c.hint };
  return { ok: true, e164: `${c.dial}${local}`, error: '' };
}
