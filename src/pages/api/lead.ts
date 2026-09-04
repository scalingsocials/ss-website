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

export const prerender = false;

const leadSchema = z.object({
  lead_id: z.string().min(8).max(64),
  source: z.string().max(64).default('website'),
  status: z.enum(['partial', 'abandoned', 'complete']).default('partial'),
  name: z.string().max(120).optional().default(''),
  email: z.string().email().max(160).optional().or(z.literal('')),
  phone: z.string().max(32).optional().default(''),
  company: z.string().max(160).optional().default(''),
  website: z.string().max(200).optional().default(''),
  // Service-specific answers arrive as a flat map; keep them loose.
  answers: z.record(z.string(), z.string().max(500)).optional().default({}),
  message: z.string().max(2000).optional().default(''),
  page: z.string().max(200).optional().default(''),
  // honeypot — must be empty
  company_website: z.string().max(0).optional().default(''),
  // Cloudflare Turnstile token (present on JS submissions once configured).
  'cf-turnstile-response': z.string().max(4096).optional().default(''),
});

type Lead = z.infer<typeof leadSchema>;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

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
    // scalingsocials.com is a verified Resend domain, so send from it by default.
    // Override with LEAD_ALERT_FROM / LEAD_ALERT_TO env vars if needed.
    alertFrom: pick('LEAD_ALERT_FROM') ?? 'Scaling Socials <leads@scalingsocials.com>',
    alertTo: pick('LEAD_ALERT_TO') ?? 'support@scalingsocials.com',
  };
}

/** Verify a Cloudflare Turnstile token server-side. */
async function verifyTurnstile(secret: string, token: string, ip?: string): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
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

  // ---- plain-text fallback -------------------------------------------------
  const textRows = [
    `${temp.label} lead · score ${score}`,
    ...contact.map(([l, v]) => `${l}: ${v}`),
    ...(answers.length ? ['', 'What they told us:', ...answers.map(([l, v]) => `  ${l}: ${v}`)] : []),
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
      subject: `New ${temp.label} lead: ${who} (${humanise(lead.source)})`,
      html,
      text: textRows.join('\n'),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

// Points for the biggest budget/scale signal in the answers (ad spend, online
// revenue or monthly sessions). Bigger prospect => hotter lead.
function budgetPoints(answers: Record<string, string>): number {
  const vals = Object.values(answers);
  const top = ['₹5L+', 'Over ₹1Cr', 'Over 100k'];
  const high = ['₹3–5L', '₹20L–1Cr', '20k–100k'];
  const mid = ['₹1–3L', '₹5–20L', '5k–20k'];
  if (vals.some((v) => top.includes(v))) return 20;
  if (vals.some((v) => high.includes(v))) return 12;
  if (vals.some((v) => mid.includes(v))) return 6;
  return 0; // Under ₹1L / Under ₹5L / Under 5k / not running yet
}

/**
 * Transparent lead score (0–60). Intent + contactability + deal size:
 *   audit CTA +15 · completed the form +10 · email +5 · phone +5 ·
 *   answered the qualifying questions +5 · budget/scale tier +0/+6/+12/+20.
 */
function scoreLead(lead: Lead): number {
  let s = 0;
  if (lead.source === 'audit') s += 15;
  if (lead.status === 'complete') s += 10;
  if (lead.email) s += 5;
  if (lead.phone) s += 5;
  if (Object.keys(lead.answers).length) s += 5;
  s += budgetPoints(lead.answers);
  return s;
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

/** Upsert one lead row via PostgREST (merge on the unique lead_id). */
async function upsertLead(url: string, key: string, lead: Lead): Promise<void> {
  const row = {
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
    updated_at: new Date().toISOString(),
  };
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
    // Never leak validation internals; treat as accepted-but-ignored.
    return json({ ok: true, stored: false });
  }
  const lead = parsed.data;

  // Honeypot tripped → pretend success, store nothing.
  if (lead.company_website) return json({ ok: true, stored: false });

  const env = getEnv(locals);
  const wantsJson = ct.includes('application/json') || request.headers.get('x-requested-with') === 'fetch';

  // Turnstile: verify completed submissions from the JS path (where a token is
  // produced). Missing/invalid token → drop silently as spam. The no-JS native
  // form has no token and falls back to the honeypot, so it still works.
  if (lead.status === 'complete' && env.turnstileSecret && wantsJson) {
    const token = lead['cf-turnstile-response'];
    const ip = request.headers.get('cf-connecting-ip') ?? undefined;
    const ok = await verifyTurnstile(env.turnstileSecret, token, ip);
    if (!ok) return json({ ok: true, stored: false });
  }

  // Persist by lead_id if Supabase is configured; otherwise log and carry on.
  let stored = false;
  if (env.supabaseUrl && env.supabaseKey) {
    try {
      await upsertLead(env.supabaseUrl, env.supabaseKey, lead);
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
  if (lead.status === 'complete' && env.resendKey) {
    try {
      await sendLeadEmail(env.resendKey, env.alertFrom, env.alertTo, lead);
    } catch (e) {
      console.error('[lead] email failed', (e as Error).message);
    }
  }

  // Native (no-JS) form submit expects a redirect; fetch/beacon expects JSON.
  if (!wantsJson && lead.status === 'complete') return redirect('/thank-you/', 303);
  return json({ ok: true, stored });
};
