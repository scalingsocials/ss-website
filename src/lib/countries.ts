/**
 * ISO 3166-1 alpha-2 codes with their E.164 dial codes.
 *
 * Used at BUILD time by FieldControl to render the dial-code select, and by
 * /api/lead on the server to map a submitted ISO back to its dial code. It is
 * deliberately NOT imported by src/scripts/leadform.ts — the browser reads the
 * dial code straight off the selected <option>'s data-dial attribute, so this
 * table never reaches the client bundle or the JS budget.
 *
 * Stored as one delimited string rather than ~200 object literals: it is a
 * third of the bytes and no harder to read a row of.
 */
const TABLE =
  'AF:93,AL:355,DZ:213,AD:376,AO:244,AG:1268,AR:54,AM:374,AW:297,AU:61,AT:43,AZ:994,' +
  'BS:1242,BH:973,BD:880,BB:1246,BY:375,BE:32,BZ:501,BJ:229,BM:1441,BT:975,BO:591,' +
  'BA:387,BW:267,BR:55,BN:673,BG:359,BF:226,BI:257,KH:855,CM:237,CA:1,CV:238,KY:1345,' +
  'CF:236,TD:235,CL:56,CN:86,CO:57,KM:269,CG:242,CD:243,CR:506,CI:225,HR:385,CU:53,' +
  'CW:599,CY:357,CZ:420,DK:45,DJ:253,DM:1767,DO:1809,EC:593,EG:20,SV:503,GQ:240,ER:291,' +
  'EE:372,ET:251,FJ:679,FI:358,FR:33,GF:594,PF:689,GA:241,GM:220,GE:995,DE:49,GH:233,' +
  'GI:350,GR:30,GL:299,GD:1473,GP:590,GU:1671,GT:502,GN:224,GW:245,GY:592,HT:509,' +
  'HN:504,HK:852,HU:36,IS:354,IN:91,ID:62,IR:98,IQ:964,IE:353,IL:972,IT:39,JM:1876,' +
  'JP:81,JO:962,KZ:7,KE:254,KI:686,KW:965,KG:996,LA:856,LV:371,LB:961,LS:266,LR:231,' +
  'LY:218,LI:423,LT:370,LU:352,MO:853,MK:389,MG:261,MW:265,MY:60,MV:960,ML:223,MT:356,' +
  'MH:692,MQ:596,MR:222,MU:230,MX:52,FM:691,MD:373,MC:377,MN:976,ME:382,MA:212,MZ:258,' +
  'MM:95,NA:264,NR:674,NP:977,NL:31,NC:687,NZ:64,NI:505,NE:227,NG:234,KP:850,NO:47,' +
  'OM:968,PK:92,PW:680,PS:970,PA:507,PG:675,PY:595,PE:51,PH:63,PL:48,PT:351,PR:1787,' +
  'QA:974,RE:262,RO:40,RU:7,RW:250,WS:685,SM:378,ST:239,SA:966,SN:221,RS:381,SC:248,' +
  'SL:232,SG:65,SK:421,SI:386,SB:677,SO:252,ZA:27,KR:82,SS:211,ES:34,LK:94,SD:249,' +
  'SR:597,SZ:268,SE:46,CH:41,SY:963,TW:886,TJ:992,TZ:255,TH:66,TL:670,TG:228,TO:676,' +
  'TT:1868,TN:216,TR:90,TM:993,TC:1649,TV:688,UG:256,UA:380,AE:971,GB:44,US:1,UY:598,' +
  'UZ:998,VU:678,VE:58,VN:84,YE:967,ZM:260,ZW:263';

export interface CountryRow {
  iso: string;
  /** Digits only, e.g. "91". */
  cc: string;
  /** As displayed, e.g. "+91". */
  dial: string;
  /** English name from the platform's own data — no hand-maintained list. */
  name: string;
  /** Emoji flag, e.g. "🇮🇳". */
  flag: string;
}

/**
 * ISO alpha-2 → emoji flag, by mapping each letter to its regional indicator.
 * No image assets, no sprite sheet, nothing to load.
 *
 * Windows does not render regional indicator pairs as flags — it shows the two
 * letters instead. That is a clean degradation: "IN +91 India" still reads
 * correctly, so no fallback is needed.
 */
export function flagOf(iso: string): string {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

// Intl.DisplayNames ships with Node and every target browser, so the country
// names come from the platform rather than 200 hand-typed strings that would
// drift and be wrong in places.
const NAMES = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    return null;
  }
})();

export const COUNTRIES: CountryRow[] = TABLE.split(',')
  .map((row) => {
    const [iso, cc] = row.split(':') as [string, string];
    let name = iso;
    try {
      name = NAMES?.of(iso) ?? iso;
    } catch {
      /* unknown region code — fall back to the ISO */
    }
    return { iso, cc, dial: `+${cc}`, name, flag: flagOf(iso) };
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'en'));

/**
 * Pinned to the top of the select so the common case is the first thing a
 * visitor sees, with everything else alphabetically below a plain separator.
 * Deliberately unlabelled in the markup — a group heading naming these as our
 * markets tells a visitor more about us than a phone field needs to.
 */
export const PRIMARY_ISO = ['IN', 'AE'] as const;

export const PRIMARY: CountryRow[] = PRIMARY_ISO.map(
  (iso) => COUNTRIES.find((c) => c.iso === iso)!,
);

export const REST: CountryRow[] = COUNTRIES.filter(
  (c) => !(PRIMARY_ISO as readonly string[]).includes(c.iso),
);

export function dialFor(iso: string | undefined | null): string {
  return COUNTRIES.find((c) => c.iso === iso)?.dial ?? '';
}
