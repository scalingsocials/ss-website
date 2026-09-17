/**
 * POST /api/lead — lead capture endpoint. See 04-LEAD-CAPTURE-AND-TRACKING.md.
 *
 * Handles BOTH a full submission and an abandoned/partial capture (Shopify-style):
 * the form posts `status: "partial"` the moment step 1 is completed (and again via
 * sendBeacon if the visitor leaves), then `status: "complete"` on submit. Both
 * carry the same `lead_id`, so the store upserts one row and can surface partials
 * as abandoned leads.
 *
 * Storage: a dependency-free PostgREST upsert into the Supabase `website_leads`
 * inbox table (in the Scaling Socials CRM project), keyed on lead_id, using the
 * service-role key. This is deliberately NOT the CRM's `leads` pipeline table —
 * raw/partial website captures land in website_leads and are promoted into
 * public.leads separately (with a rep + stage). Secrets are read from the
 * Cloudflare runtime env (`locals.runtime.env`) — never hardcoded, never in the
 * repo (CLAUDE.md §17). When SUPABASE_URL / SUPABASE_SERVICE_KEY are absent it
 * validates and acknowledges but persists nothing, and never throws.
 *
 * TODO (owner / infra): add the Turnstile + Resend keys to the deploy env and
 * wire verification + receipt emails, then a promote-to-CRM step (website_leads
 * -> public.leads) once a default assignee + stage are chosen.
 */
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { checkPhone, DEFAULT_ISO } from '@/lib/phone';
import { dialFor } from '@/lib/countries';

export const prerender = false;

const leadSchema = z.object({
  // Optional, with a server-generated fallback below. leadform.ts fills this in
  // the browser, but a NO-JS native form submit (CLAUDE.md §1) posts it empty —
  // which made every JS-disabled submission fail validation. Same for the
  // teardown waitlist, which has no island at all.
  lead_id: z.string().max(64).optional().default(''),
  source: z.string().max(64).default('website'),
  status: z.enum(['partial', 'abandoned', 'complete']).default('partial'),
  name: z.string().max(120).optional().default(''),
  email: z.string().email().max(160).optional().or(z.literal('')),
  phone: z.string().max(32).optional().default(''),
  // Dial-code select that FieldControl renders beside every `tel` input. The
  // server composes the two into E.164 and validates per country, so the rule
  // holds even for a no-JS post or a handcrafted request.
  phone_cc: z.string().max(2).optional().default(''),
  company: z.string().max(160).optional().default(''),
  website: z.string().max(200).optional().default(''),
  // Service-specific answers arrive as a flat map; keep them loose.
  answers: z.record(z.string(), z.string().max(500)).optional().default({}),
  message: z.string().max(2000).optional().default(''),
  page: z.string().max(200).optional().default(''),
  // Honeypot. Deliberately permissive HERE so a filled one parses cleanly and
  // falls to the explicit check below, which answers with a silent 200. If the
  // schema rejected it instead, the 422 would tell a bot it had been caught.
  company_website: z.string().max(200).optional().default(''),
  // Cloudflare Turnstile token (present on JS submissions once configured).
  'cf-turnstile-response': z.string().max(4096).optional().default(''),
  // Analytics stitching — the browser hands up its GA4 ids so the server-side
  // generate_lead (Measurement Protocol) joins the right session, plus a stable
  // event_id for future Meta CAPI/Pixel deduplication. See analytics-event-plan.
  ga_client_id: z.string().max(64).optional().default(''),
  ga_session_id: z.string().max(32).optional().default(''),
  event_id: z.string().max(64).optional().default(''),
  // Meta browser cookies for CAPI ↔ Pixel matching/dedup.
  fbp: z.string().max(128).optional().default(''),
  fbc: z.string().max(256).optional().default(''),
  // Campaign attribution. LeadForm renders these as hidden inputs on EVERY form
  // and leadform.ts fills them from the landing URL — but until 2026-09-12 they
  // were not declared here, so zod stripped them and they never reached the
  // store. They are columns on website_leads now; keep them declared.
  utm_source: z.string().max(200).optional().default(''),
  utm_medium: z.string().max(200).optional().default(''),
  utm_campaign: z.string().max(200).optional().default(''),
  utm_content: z.string().max(200).optional().default(''),
  utm_term: z.string().max(200).optional().default(''),
  gclid: z.string().max(255).optional().default(''),
  fbclid: z.string().max(255).optional().default(''),
  landing_page: z.string().max(500).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
});

/**
 * Sources that are a SUBSCRIPTION, not an enquiry.
 *
 * Nothing posts these here any more — list signups have their own endpoint and
 * their own table (`/api/subscribe` → `public.subscribers`). This stays as a
 * backstop: if a signup form is ever pointed at /api/lead by mistake, it must
 * not email the sales inbox or fire a GA4/Meta conversion. An email-only signup
 * counted as a `Lead` corrupts the exact signal the campaigns optimise against,
 * and it is far cheaper to obtain than a real enquiry.
 */
const SUBSCRIBE_SOURCES = new Set(['teardown-waitlist', 'teardowns', 'newsletter']);

/** The attribution fields, in one place — schema, row and email all read this. */
const ATTRIBUTION = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid', 'landing_page', 'referrer',
] as const;

type Lead = z.infer<typeof leadSchema>;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

/**
 * Minimal HTML for a NO-JS submit we could not keep. Deliberately not a
 * redirect to /thank-you/ — telling someone we have their enquiry when we do
 * not is the failure this endpoint was fixed to stop. Inline-style-free so the
 * production CSP (no unsafe-inline) does not strip it.
 */
const errorPage = () =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><title>We couldn't send that — Scaling Socials</title></head>
<body><main><h1>We couldn't send that</h1>
<p>Something went wrong on our side and your enquiry did not reach us. Nothing was saved, so please try again.</p>
<p>If it keeps failing, email <a href="mailto:support@scalingsocials.com">support@scalingsocials.com</a>
or WhatsApp <a href="https://wa.me/919606713608">+91 96067 13608</a> and we will pick it up from there.</p>
<p><a href="/">Back to scalingsocials.com</a></p></main></body></html>`,
    { status: 503, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );

/** Read config from the Cloudflare runtime env, with a local-dev fallback. */
function getEnv(locals: unknown) {
  const runtime = (locals as { runtime?: { env?: Record<string, string | undefined> } })?.runtime;
  const env = runtime?.env ?? {};
  const pick = (k: string) => env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
  return {
    supabaseUrl: pick('SUPABASE_URL'),
    supabaseKey: pick('SUPABASE_SERVICE_KEY'),
    resendKey: pick('RESEND_API_KEY'),
    turnstileSecret: pick('TURNSTILE_SECRET_KEY'),
    // GA4 server-side (Measurement Protocol). Measurement ID is public and has a
    // safe default; the API secret must come from the env (CLAUDE.md §17).
    ga4Id: pick('GA4_MEASUREMENT_ID') ?? 'G-DQH1656N5W',
    ga4Secret: pick('GA4_MP_API_SECRET'),
    // Meta Conversions API. Pixel ID is public (safe default); token is a secret
    // from the env. TEST code, when set, routes events to Events Manager → Test
    // Events instead of live reporting — set it while testing, remove after.
    metaPixelId: pick('META_PIXEL_ID') ?? '2381316206031576',
    metaCapiToken: pick('META_CAPI_TOKEN'),
    metaTestCode: pick('META_TEST_EVENT_CODE'),
    // scalingsocials.com is a verified Resend domain, so send from it by default.
    // Override with LEAD_ALERT_FROM / LEAD_ALERT_TO env vars if needed.
    alertFrom: pick('LEAD_ALERT_FROM') ?? 'Scaling Socials <leads@scalingsocials.com>',
    alertTo: pick('LEAD_ALERT_TO') ?? 'support@scalingsocials.com',
    // TeleCRM (owner's sales CRM). Both are secrets from the Cloudflare env; with
    // either missing the push is skipped and logged, never faked (CLAUDE.md §17).
    // Token: TeleCRM → Integrations → Website/API → create an "Async" token.
    telecrmToken: pick('TELECRM_API_TOKEN'),
    telecrmEnterprise: pick('TELECRM_ENTERPRISE_ID'),
    telecrmBase: pick('TELECRM_API_BASE') ?? 'https://next-api.telecrm.in',
    // Note action type (TeleCRM docs: SYSTEM_NOTE). Overridable if the workspace differs.
    telecrmNoteType: pick('TELECRM_NOTE_TYPE') ?? 'SYSTEM_NOTE',
  };
}

/**
 * Verify a Cloudflare Turnstile token server-side.
 *
 * Three outcomes, not two, and the distinction matters:
 *  - 'pass'  — Cloudflare says this is a human. Store it.
 *  - 'fail'  — Cloudflare says the token is invalid/expired/replayed. Drop it.
 *  - 'error' — we could not ask (network failure, non-2xx, no token produced
 *              because the widget never rendered). We do NOT know, so we must
 *              NOT guess "spam". A Turnstile outage or a blocked challenge
 *              script used to delete every real enquiry silently; now the lead
 *              is stored and flagged instead.
 */
type TurnstileResult = 'pass' | 'fail' | 'error' | 'skipped';

async function verifyTurnstile(secret: string, token: string, ip?: string): Promise<TurnstileResult> {
  // No token at all means the widget never produced one — a rendering or
  // network problem on the visitor's side, not evidence of a bot.
  if (!token) return 'error';
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) return 'error';
    const data = (await res.json()) as { success?: boolean };
    return data.success ? 'pass' : 'fail';
  } catch {
    return 'error';
  }
}

/** Email the team about a completed enquiry via Resend (best-effort). */
async function sendLeadEmail(apiKey: string, from: string, to: string, lead: Lead): Promise<void> {
  const score = scoreLead(lead);
  const temp = temperature(score);
  const who = lead.name || lead.company || lead.phone || 'Website enquiry';
  const when = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  // Contact rows, then the service-specific answers, then an optional message.
  const contact: [string, string, string?][] = [
    ['Email', lead.email || '—', lead.email ? `mailto:${lead.email}` : undefined],
    ['Phone', lead.phone || '—', lead.phone ? `tel:${lead.phone.replace(/[^+\d]/g, '')}` : undefined],
    ['Brand', lead.company || '—'],
    ['Website', lead.website || '—'],
    ['Source', humanise(lead.source)],
    ['Page', lead.page || '—'],
  ];
  const answers: [string, string][] = Object.entries(lead.answers).map(([k, v]) => [humanise(k), v]);
  // Where the lead came from. Only rows with a value — an organic lead should
  // not show nine empty attribution lines.
  const attribution: [string, string][] = ATTRIBUTION
    .filter((k) => lead[k])
    .map((k) => [humanise(k).replace(/^Utm /, 'UTM '), lead[k]]);

  // ---- plain-text fallback -------------------------------------------------
  const textRows = [
    `${temp.label} lead · score ${score}`,
    ...contact.map(([l, v]) => `${l}: ${v}`),
    ...(answers.length ? ['', 'What they told us:', ...answers.map(([l, v]) => `  ${l}: ${v}`)] : []),
    ...(attribution.length ? ['', 'Came from:', ...attribution.map(([l, v]) => `  ${l}: ${v}`)] : []),
    ...(lead.message ? ['', `Message: ${lead.message}`] : []),
    '',
    `Submitted ${when} IST · reply to this email to reach ${who}.`,
  ];

  // ---- HTML (inline styles + table layout for email clients) ---------------
  const row = (label: string, value: string, href?: string) => `
    <tr>
      <td style="padding:7px 0;color:#6a6a72;font-size:14px;width:110px;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:7px 0;color:#17171c;font-size:15px;vertical-align:top">${
        href ? `<a href="${escapeHtml(href)}" style="color:#4f52db;text-decoration:none">${escapeHtml(value)}</a>` : escapeHtml(value)
      }</td>
    </tr>`;
  const answersBlock = answers.length
    ? `<tr><td colspan="2" style="padding:14px 0 4px"><div style="border-top:1px solid #e6e5ec;padding-top:12px;color:#6a6a72;font-size:12px;letter-spacing:.05em;text-transform:uppercase">What they told us</div></td></tr>
       ${answers.map(([l, v]) => row(l, v)).join('')}`
    : '';
  const attributionBlock = attribution.length
    ? `<tr><td colspan="2" style="padding:14px 0 4px"><div style="border-top:1px solid #e6e5ec;padding-top:12px;color:#6a6a72;font-size:12px;letter-spacing:.05em;text-transform:uppercase">Came from</div></td></tr>
       ${attribution.map(([l, v]) => row(l, v)).join('')}`
    : '';
  const messageBlock = lead.message
    ? `<tr><td colspan="2" style="padding:14px 0 0"><div style="border-top:1px solid #e6e5ec;padding-top:12px;color:#6a6a72;font-size:12px;letter-spacing:.05em;text-transform:uppercase">Message</div>
       <div style="margin-top:6px;color:#17171c;font-size:15px;line-height:1.5">${escapeHtml(lead.message)}</div></td></tr>`
    : '';

  const html = `
  <div style="background:#f4f4f8;padding:24px;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e5ec;border-radius:14px;overflow:hidden">
      <tr>
        <td style="background:#4f52db;padding:20px 24px">
          <div style="color:#c9caff;font-size:12px;letter-spacing:.08em;text-transform:uppercase">New website lead</div>
          <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:3px">${escapeHtml(who)}</div>
        </td>
        <td style="background:#4f52db;padding:20px 24px;text-align:right;vertical-align:top;white-space:nowrap">
          <span style="display:inline-block;background:#ffffff;color:${temp.color};font-weight:bold;font-size:13px;border-radius:999px;padding:5px 13px">${temp.label} &middot; ${score}</span>
        </td>
      </tr>
      <tr><td colspan="2" style="padding:18px 24px 6px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${contact.map(([l, v, h]) => row(l, v, h)).join('')}
          ${answersBlock}
          ${attributionBlock}
          ${messageBlock}
        </table>
      </td></tr>
      <tr><td colspan="2" style="padding:8px 24px 22px">
        <div style="border-top:1px solid #e6e5ec;padding-top:14px;color:#9797a6;font-size:12.5px;line-height:1.5">
          Submitted ${escapeHtml(when)} IST. Reply to this email to respond to ${escapeHtml(who)} directly.<br>
          Sent by the scalingsocials.com lead form.
        </div>
      </td></tr>
    </table>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email || undefined,
      // A subscription is not a sales lead, so it must not arrive in the inbox
      // labelled Hot/Warm/Cool — that scoring only means something for enquiries.
      subject: SUBSCRIBE_SOURCES.has(lead.source)
        ? `New signup: ${who} (${humanise(lead.source)})`
        : `New ${temp.label} lead: ${who} (${humanise(lead.source)})`,
      html,
      text: textRows.join('\n'),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

/**
 * Send the GA4 `generate_lead` conversion server-side via the Measurement
 * Protocol. Server-side is deliberate: it can't be dropped by ad-blockers or
 * ITP, and it's the SINGLE source for this event (GA4 does not dedupe gtag vs
 * MP), so the conversion is counted exactly once. Needs the client_id the
 * browser read from its _ga cookie; without it we can't attribute the hit, so we
 * skip rather than create a phantom session. Best-effort — never blocks the reply.
 */
async function sendGa4Lead(
  measurementId: string,
  apiSecret: string,
  lead: Lead,
  debug: boolean,
): Promise<void> {
  if (!lead.ga_client_id) return; // no client_id → can't attribute; skip cleanly
  const body = {
    client_id: lead.ga_client_id,
    events: [
      {
        name: 'generate_lead',
        params: {
          // session_id + a non-zero engagement time make this an active,
          // session-attributed event rather than an orphaned one.
          ...(lead.ga_session_id ? { session_id: lead.ga_session_id } : {}),
          engagement_time_msec: 1,
          lead_source: lead.source,
          lead_score: scoreLead(lead),
          page_location: lead.page ? `https://scalingsocials.com${lead.page}` : undefined,
          ...(debug ? { debug_mode: true } : {}),
        },
      },
    ],
  };
  const url =
    `https://www.google-analytics.com/mp/collect` +
    `?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
  const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  // MP returns 204 on success and never a useful error body; log non-2xx only.
  if (!res.ok) throw new Error(`ga4 mp ${res.status}`);
}

/** SHA-256 hex (Web Crypto, available in the Cloudflare Worker runtime). */
async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Send the Meta `Lead` conversion server-side via the Conversions API. Uses the
 * SAME event_id the browser Pixel sent, so Meta deduplicates the two. PII (email,
 * phone) is SHA-256 hashed per Meta's requirement; _fbp/_fbc + IP + UA improve
 * match quality. test_event_code (when set) routes to Events Manager → Test
 * Events. Best-effort — never blocks the reply.
 */
async function sendMetaLead(
  pixelId: string,
  token: string,
  testCode: string | undefined,
  lead: Lead,
  request: Request,
): Promise<{ events_received?: number; fbtrace_id?: string }> {
  const email = (lead.email || '').trim().toLowerCase();
  const phone = (lead.phone || '').replace(/[^\d]/g, ''); // digits incl. country code
  const user_data: Record<string, unknown> = {};
  if (email) user_data.em = [await sha256(email)];
  if (phone) user_data.ph = [await sha256(phone)];
  if (lead.fbp) user_data.fbp = lead.fbp;
  if (lead.fbc) user_data.fbc = lead.fbc;
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) user_data.client_ip_address = ip;
  const ua = request.headers.get('user-agent');
  if (ua) user_data.client_user_agent = ua;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.event_id || undefined,
        action_source: 'website',
        event_source_url: lead.page ? `https://scalingsocials.com${lead.page}` : undefined,
        user_data,
        custom_data: { lead_source: lead.source, lead_score: scoreLead(lead) },
      },
    ],
  };
  if (testCode) body.test_event_code = testCode;

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
    { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) },
  );
  const j = (await res.json().catch(() => ({}))) as { events_received?: number; fbtrace_id?: string };
  if (!res.ok) throw new Error(`meta capi ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
  return j;
}

/**
 * Points for the biggest budget/scale signal in the answers (ad spend, online
 * revenue or monthly sessions). Bigger prospect => hotter lead.
 *
 * These are matched as EXACT option strings, so every set of options rendered
 * anywhere on the site has to appear below or it scores zero. Five sets exist:
 *   A. /audit/ + /contact/ "Monthly budget"      src/pages/{audit,contact}/index.astro
 *   B. service-page "Monthly ad spend"           src/lib/services.ts
 *   C. /lp/ "Monthly ad spend" (spaced units)    src/lib/landings.ts
 *   D. "Monthly online revenue"                  src/lib/services.ts
 *   E. "Monthly sessions"                        src/lib/services.ts
 * Sets A and C were missing entirely until 2026-09-12, so no lead from /audit/
 * — the primary conversion page — could reach the 40-point "Hot" threshold.
 * `unscored()` below logs anything budget-shaped that matches nothing, so the
 * next set of options cannot drift out of this list silently.
 */
const BUDGET_TIERS: [points: number, options: string[]][] = [
  [20, ['₹3L+', '₹5L+', '₹5 L+', 'Over ₹1Cr', 'Over 100k']],
  [12, ['₹3–5L', '₹2–5 L', '₹20L–1Cr', '20k–100k']],
  [6, ['₹1–3L', '₹60 K–2 L', '₹5–20L', '5k–20k']],
  [2, ['₹50k–1L', '₹40–60 K']],
];
// Everything else is a deliberate zero, not an oversight: the bottom tier of
// each set, plus the "haven't started" answers.
const BUDGET_ZERO = [
  'Under ₹50k', 'Under ₹1L', 'Under ₹5L', 'Under ₹40 K', 'Under 5k',
  'Not running ads yet', 'Not sure yet', 'Not running yet', '',
];

function budgetPoints(answers: Record<string, string>): number {
  const vals = Object.values(answers);
  for (const [points, options] of BUDGET_TIERS) {
    if (vals.some((v) => options.includes(v))) return points;
  }
  return 0;
}

/** Surface option strings that match no tier, so scoring drift is visible. */
function warnUnscoredBudget(answers: Record<string, string>): void {
  const known = new Set([...BUDGET_TIERS.flatMap(([, o]) => o), ...BUDGET_ZERO]);
  for (const [k, v] of Object.entries(answers)) {
    // Only complain about budget-shaped answers, not free text.
    if (!/₹|\bk\b|Cr\b/i.test(v) || known.has(v)) continue;
    console.error(`[lead] budget option "${v}" (${k}) matches no scoring tier — update BUDGET_TIERS`);
  }
}

/**
 * Points for stated intent on the /lp/ forms: how soon they want to start and
 * who is asking. Exact option strings from src/lib/landings.ts. An agency or
 * freelancer enquiring on a D2C ad page is almost never a client, so it costs
 * points rather than earning them.
 */
const START_POINTS: Record<string, number> = { 'This month': 8, 'In the next 30 days': 5, 'In 2 to 3 months': 2, 'Just exploring': 0 };
const ROLE_POINTS: Record<string, number> = { 'Founder or owner': 4, 'Marketing lead': 2, 'Other': 0, 'Agency or freelancer': -8 };
function intentPoints(answers: Record<string, string>): number {
  return (START_POINTS[answers.start ?? ''] ?? 0) + (ROLE_POINTS[answers.role ?? ''] ?? 0);
}

/**
 * Transparent lead score (0–72). Intent + contactability + deal size:
 *   audit CTA +15 · completed the form +10 · email +5 · phone +5 ·
 *   answered the qualifying questions +5 · budget/scale tier +0/+6/+12/+20 ·
 *   start date +0/+2/+5/+8 · role +4/+2/0/−8 (never below 0).
 */
function scoreLead(lead: Lead): number {
  let s = 0;
  if (lead.source === 'audit') s += 15;
  if (lead.status === 'complete') s += 10;
  if (lead.email) s += 5;
  if (lead.phone) s += 5;
  if (Object.keys(lead.answers).length) s += 5;
  s += budgetPoints(lead.answers);
  s += intentPoints(lead.answers);
  return Math.max(0, s);
}

/** Triage label from the score. */
function temperature(score: number): { label: string; color: string } {
  if (score >= 40) return { label: 'Hot', color: '#d81f52' };
  if (score >= 25) return { label: 'Warm', color: '#a25a12' };
  return { label: 'Cool', color: '#2f8f86' };
}

/** "monthly_spend" -> "Monthly spend"; "performance-marketing" -> "Performance marketing". */
function humanise(key: string): string {
  const t = key.replace(/[_-]+/g, ' ').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Push a completed enquiry into TeleCRM (Async "autoupdatelead" API).
 *
 *   POST {base}/enterprise/{enterpriseId}/autoupdatelead
 *   Authorization: Bearer <token>   { fields: {...}, actions: [...] }
 *
 * Field mapping (owner-supplied TeleCRM API names, 2026-09-16):
 *   phone, email, name + customer_name (the person), brand_name (when a form
 *   collects a brand), and the brand link split by shape — an @handle or an
 *   instagram.com URL goes to instagram_link, anything else to website_link.
 * Everything else — the qualifying answers, score, source, page, attribution —
 * goes into one note on the lead. TeleCRM matches on the phone (digits with
 * country code, no "+") and creates or updates the lead. The API is
 * fire-and-forget (a 2xx means accepted); 18,000 req/hour.
 */
/** "@brand" / "instagram.com/brand" → instagram_link; anything else → website_link. */
function splitBrandLink(raw: string): { instagram_link?: string; website_link?: string } {
  const v = raw.trim();
  if (!v) return {};
  const handle = v.match(/^@([A-Za-z0-9._]{1,30})$/);
  if (handle) return { instagram_link: `https://www.instagram.com/${handle[1]}/` };
  if (/instagram\.com\//i.test(v)) return { instagram_link: /^https?:\/\//i.test(v) ? v : `https://${v}` };
  return { website_link: /^https?:\/\//i.test(v) ? v : `https://${v}` };
}
async function sendTeleCrmLead(base: string, enterpriseId: string, token: string, noteType: string, lead: Lead): Promise<number> {
  const score = scoreLead(lead);
  const person = lead.name || lead.company || 'Website enquiry';
  const fields: Record<string, string> = {
    phone: (lead.phone || '').replace(/[^\d]/g, ''),
    name: person,
    customer_name: person,
  };
  if (lead.email) fields.email = lead.email;
  if (lead.company) fields.brand_name = lead.company;
  if (lead.website) Object.assign(fields, splitBrandLink(lead.website));

  const lines: string[] = [`Website enquiry — ${lead.source}${lead.page ? ` (${lead.page})` : ''}`];
  if (lead.website) lines.push(`Brand website / Instagram: ${lead.website}`);
  if (lead.company) lines.push(`Brand: ${lead.company}`);
  for (const [k, v] of Object.entries(lead.answers)) if (v) lines.push(`${humanise(k)}: ${v}`);
  if (lead.message) lines.push(`Message: ${lead.message}`);
  lines.push(`Lead score: ${score} (${temperature(score).label})`);
  const attrib = ATTRIBUTION.filter((k) => lead[k]).map((k) => `${k}=${lead[k]}`);
  if (attrib.length) lines.push(`Attribution: ${attrib.join(' · ')}`);
  lines.push(`Lead id: ${lead.lead_id}`);

  const res = await fetch(`${base.replace(/\/$/, '')}/enterprise/${encodeURIComponent(enterpriseId)}/autoupdatelead`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ fields, actions: [{ type: noteType, text: lines.join('\n') }] }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`telecrm ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.status;
}

/** Upsert one lead row via PostgREST (merge on the unique lead_id). */
async function upsertLead(url: string, key: string, lead: Lead, turnstile: TurnstileResult): Promise<void> {
  const row: Record<string, unknown> = {
    lead_id: lead.lead_id,
    status: lead.status,
    source: lead.source,
    name: lead.name || null,
    email: lead.email || null,
    phone: lead.phone || null,
    company: lead.company || null,
    website: lead.website || null,
    message: lead.message || null,
    answers: lead.answers,
    page: lead.page || null,
    score: scoreLead(lead),
    turnstile,
    updated_at: new Date().toISOString(),
  };
  // Attribution: only write a key when we actually have a value, so a later
  // `complete` upsert cannot blank what the `partial` already captured.
  for (const k of ATTRIBUTION) if (lead[k]) row[k] = lead[k];
  const res = await fetch(`${url}/rest/v1/website_leads?on_conflict=lead_id`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`supabase ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  let raw: Record<string, unknown> = {};
  const ct = request.headers.get('content-type') ?? '';
  // Hoisted: the phone and validation branches below both need it to decide
  // between a JSON body and an HTML page for a no-JS submit.
  const wantsJson = ct.includes('application/json') || request.headers.get('x-requested-with') === 'fetch';
  try {
    if (ct.includes('application/json')) {
      raw = await request.json();
    } else {
      const form = await request.formData();
      raw = Object.fromEntries(form.entries());
    }
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Gather service-specific answers: any `q_<key>` field, plus an `answers` map.
  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith('q_') && typeof v === 'string' && v) answers[k.slice(2)] = v;
  }
  if (raw.answers && typeof raw.answers === 'object') {
    for (const [k, v] of Object.entries(raw.answers as Record<string, unknown>)) {
      if (typeof v === 'string' && v) answers[k] = v;
    }
  }
  raw.answers = answers;

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    // A real person whose input we rejected. This used to return 200 with
    // {ok:true}, so the browser redirected them to /thank-you/ and the enquiry
    // vanished with nothing logged. Answer honestly: the client shows an error
    // and keeps what they typed. Field names only — never echo their values.
    const fields = parsed.error.issues.map((i) => i.path.join('.')).filter(Boolean);
    console.error('[lead] rejected', fields.join(',') || 'unknown');
    return json({ ok: false, error: 'invalid', fields }, 422);
  }
  const lead = parsed.data;
  const isSubscribe = SUBSCRIBE_SOURCES.has(lead.source);

  // Normalise the phone to E.164 so the CRM gets one consistent format instead
  // of whatever punctuation each visitor used. Only a COMPLETED enquiry is
  // rejected for a bad number — a partial or an abandon beacon is a best-effort
  // capture of someone mid-typing, and refusing it would throw away the very
  // lead the abandoned-capture feature exists to save.
  if (lead.phone) {
    const iso = lead.phone_cc || DEFAULT_ISO;
    const r = checkPhone(lead.phone, iso, dialFor(iso));
    if (r.ok) {
      lead.phone = r.e164;
    } else if (lead.status === 'complete') {
      console.error('[lead] rejected phone', lead.phone_cc || DEFAULT_ISO);
      const body = { ok: false, error: 'invalid', fields: ['phone'] };
      return wantsJson ? json(body, 422) : errorPage();
    }
  }
  // No-JS and non-island forms post no lead_id; mint one so the row still
  // upserts cleanly. (A JS submission always supplies its own, so partial and
  // complete continue to merge onto the same row.)
  if (!lead.lead_id || lead.lead_id.length < 8) lead.lead_id = crypto.randomUUID();
  warnUnscoredBudget(lead.answers);

  // Honeypot tripped → pretend success, store nothing. This is the ONE case
  // where a silent 200 is correct: a bot should not learn it was caught.
  if (lead.company_website) return json({ ok: true, stored: false });

  const env = getEnv(locals);

  // Turnstile: verify completed submissions from the JS path (where a token is
  // produced). The no-JS native form has no token and falls back to the
  // honeypot, so it still works.
  //
  // Only a definitive 'fail' — Cloudflare telling us the token is bad — drops
  // the submission. An 'error' (outage, blocked challenge script, no token
  // rendered) stores the lead flagged `turnstile: error` instead. Storing a
  // spam row costs nothing; discarding a real enquiry costs a customer.
  let turnstile: TurnstileResult = 'skipped';
  if (lead.status === 'complete' && env.turnstileSecret && wantsJson) {
    const token = lead['cf-turnstile-response'];
    const ip = request.headers.get('cf-connecting-ip') ?? undefined;
    turnstile = await verifyTurnstile(env.turnstileSecret, token, ip);
    if (turnstile === 'fail') return json({ ok: true, stored: false });
    if (turnstile === 'error') console.error('[lead] turnstile unverifiable, storing anyway', lead.lead_id);
  }

  // Persist by lead_id if Supabase is configured; otherwise log and carry on.
  let stored = false;
  if (env.supabaseUrl && env.supabaseKey) {
    try {
      await upsertLead(env.supabaseUrl, env.supabaseKey, lead, turnstile);
      stored = true;
    } catch (e) {
      // Don't fail the visitor's submission on a store error — log it.
      console.error('[lead] supabase upsert failed', (e as Error).message);
    }
  } else {
    const usable = Boolean(lead.email || lead.phone);
    console.log('[lead]', lead.status, lead.source, lead.lead_id, usable ? '(usable)' : '(no contact)', '(supabase not configured)');
  }

  // Email the team about completed enquiries (best-effort; never blocks the reply).
  let emailed = false;
  if (lead.status === 'complete' && env.resendKey) {
    try {
      await sendLeadEmail(env.resendKey, env.alertFrom, env.alertTo, lead);
      emailed = true;
    } catch (e) {
      console.error('[lead] email failed', (e as Error).message);
    }
  }

  // If a COMPLETED enquiry reached neither the store nor the inbox, it is lost.
  // Say so instead of redirecting the visitor to a thank-you page: they see the
  // error, keep what they typed, and can retry or email us directly.
  // Partials/abandoned beacons are fire-and-forget and never surface an error.
  if (lead.status === 'complete' && !stored && !emailed) {
    console.error('[lead] LOST — neither stored nor emailed', lead.lead_id, lead.source);
    // A no-JS submit would otherwise be shown raw JSON. Give it a real page.
    if (!wantsJson) return errorPage();
    return json({ ok: false, error: 'unavailable' }, 503);
  }

  // GA4 conversion, server-side (best-effort). Only on completed enquiries with a
  // client_id; debug_mode on any non-production host so preview/localhost hits
  // show in GA4 DebugView without being mistaken for real traffic.
  if (lead.status === 'complete' && !isSubscribe && env.ga4Secret && lead.ga_client_id) {
    const host = (() => {
      try { return new URL(request.url).hostname; } catch { return ''; }
    })();
    // Matches isProdHost() in src/scripts/analytics.ts — www counts as
    // production, or a lead that arrived via www would be flagged debug_mode
    // and dropped from standard GA4 reports.
    const isProd = host === 'scalingsocials.com' || host === 'www.scalingsocials.com';
    try {
      await sendGa4Lead(env.ga4Id, env.ga4Secret, lead, !isProd);
    } catch (e) {
      console.error('[lead] ga4 mp failed', (e as Error).message);
    }
  }

  // Meta Conversions API Lead (best-effort). Deduped against the browser Pixel
  // by the shared event_id; test_event_code (when set) routes to Test Events.
  if (lead.status === 'complete' && !isSubscribe && env.metaCapiToken) {
    try {
      const r = await sendMetaLead(env.metaPixelId, env.metaCapiToken, env.metaTestCode, lead, request);
      console.log('[lead] meta capi', r.events_received ?? 0, 'received', r.fbtrace_id ?? '');
    } catch (e) {
      console.error('[lead] meta capi failed', (e as Error).message);
    }
  }

  // TeleCRM (best-effort). Completed enquiries with a phone number only — the
  // CRM keys on phone, and a partial without one has nothing to dial.
  if (lead.status === 'complete' && !isSubscribe && lead.phone) {
    if (env.telecrmToken && env.telecrmEnterprise) {
      try {
        const status = await sendTeleCrmLead(env.telecrmBase, env.telecrmEnterprise, env.telecrmToken, env.telecrmNoteType, lead);
        console.log('[lead] telecrm accepted', status, lead.lead_id);
      } catch (e) {
        console.error('[lead] telecrm failed', (e as Error).message);
      }
    } else {
      console.log('[lead] telecrm skipped (TELECRM_API_TOKEN / TELECRM_ENTERPRISE_ID not set)');
    }
  }

  // Native (no-JS) form submit expects a redirect; fetch/beacon expects JSON.
  if (!wantsJson && lead.status === 'complete') return redirect('/thank-you/', 303);
  return json({ ok: true, stored });
};
