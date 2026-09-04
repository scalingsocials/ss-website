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
  const rows: string[] = [
    `Name:    ${lead.name || '—'}`,
    `Email:   ${lead.email || '—'}`,
    `Phone:   ${lead.phone || '—'}`,
    `Brand:   ${lead.company || '—'}`,
    `Website: ${lead.website || '—'}`,
    `Source:  ${lead.source}`,
    `Page:    ${lead.page || '—'}`,
    `Score:   ${scoreLead(lead)}`,
  ];
  for (const [k, v] of Object.entries(lead.answers)) rows.push(`${k}: ${v}`);
  if (lead.message) rows.push('', `Message: ${lead.message}`);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email || undefined,
      subject: `New lead: ${lead.name || lead.company || lead.phone || 'website enquiry'} (${lead.source})`,
      text: rows.join('\n'),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

/** A simple, transparent lead score. Audit requests are the hottest intent. */
function scoreLead(lead: Lead): number {
  let s = 0;
  if (lead.source === 'audit') s += 15;
  if (lead.status === 'complete') s += 10;
  if (lead.email) s += 10;
  if (lead.phone) s += 5;
  if (Object.keys(lead.answers).length) s += 5;
  return s;
}

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
