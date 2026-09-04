/**
 * POST /api/lead — lead capture endpoint. See 04-LEAD-CAPTURE-AND-TRACKING.md.
 *
 * Handles BOTH a full submission and an abandoned/partial capture (Shopify-style):
 * the form posts `status: "partial"` the moment step 1 is completed (and again via
 * sendBeacon if the visitor leaves), then `status: "complete"` on submit. Both
 * carry the same `lead_id`, so the store upserts one row and can surface partials
 * as abandoned leads.
 *
 * Storage: a dependency-free PostgREST upsert into Supabase, keyed on lead_id,
 * using the service-role key. Secrets are read from the Cloudflare runtime env
 * (`locals.runtime.env`) — never hardcoded, never in the repo (CLAUDE.md §17).
 * When SUPABASE_URL / SUPABASE_SERVICE_KEY are absent (e.g. local dev before the
 * vars are set) it validates and acknowledges but persists nothing, and never
 * throws on a bad payload.
 *
 * TODO (owner / infra): also add the Turnstile + Resend keys to the deploy env and
 * wire verification + receipt emails. Confirm the Supabase table matches the
 * columns written below (see docs/DEPLOY-CLOUDFLARE.md / the leads table SQL).
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
});

type Lead = z.infer<typeof leadSchema>;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

/** Supabase config from the Cloudflare runtime env, with a local-dev fallback. */
function supabaseConfig(locals: unknown): { url?: string; key?: string } {
  const runtime = (locals as { runtime?: { env?: Record<string, string | undefined> } })?.runtime;
  const env = runtime?.env ?? {};
  return {
    url: env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL,
    key: env.SUPABASE_SERVICE_KEY ?? import.meta.env.SUPABASE_SERVICE_KEY,
  };
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
  const res = await fetch(`${url}/rest/v1/leads?on_conflict=lead_id`, {
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

  // Persist by lead_id if Supabase is configured; otherwise log and carry on.
  const { url, key } = supabaseConfig(locals);
  let stored = false;
  if (url && key) {
    try {
      await upsertLead(url, key, lead);
      stored = true;
    } catch (e) {
      // Don't fail the visitor's submission on a store error — log it.
      console.error('[lead] supabase upsert failed', (e as Error).message);
    }
  } else {
    const usable = Boolean(lead.email || lead.phone);
    console.log('[lead]', lead.status, lead.source, lead.lead_id, usable ? '(usable)' : '(no contact)', '(supabase not configured)');
  }

  // Native (no-JS) form submit expects a redirect; fetch/beacon expects JSON.
  const wantsJson = ct.includes('application/json') || request.headers.get('x-requested-with') === 'fetch';
  if (!wantsJson && lead.status === 'complete') return redirect('/thank-you/', 303);
  return json({ ok: true, stored });
};
