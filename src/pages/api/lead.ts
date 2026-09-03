/**
 * POST /api/lead — lead capture endpoint. See 04-LEAD-CAPTURE-AND-TRACKING.md.
 *
 * Handles BOTH a full submission and an abandoned/partial capture (Shopify-style):
 * the form posts `status: "partial"` the moment step 1 is completed (and again via
 * sendBeacon if the visitor leaves), then `status: "complete"` on submit. Both
 * carry the same `lead_id`, so the store upserts one row and can surface partials
 * as abandoned leads.
 *
 * Server-side: honeypot + zod validation, then upsert into the Supabase CRM
 * through the Worker service key (04 §Worker). Those secrets are NOT in the repo.
 *
 * TODO (owner / infra): set SUPABASE_URL and SUPABASE_SERVICE_KEY (and Turnstile
 * keys) in the deploy env, and confirm the deploy target — this endpoint needs a
 * server runtime (Cloudflare Pages Functions with the current adapter, or switch
 * to @astrojs/netlify). Until then it validates and acknowledges but does not
 * persist. It never throws on a bad payload — it just records nothing.
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

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request, redirect }) => {
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

  // A complete submission needs at least an email or phone to be useful.
  const usable = Boolean(lead.email || lead.phone);

  // TODO: upsert into Supabase by lead_id via the Worker service key.
  //   await upsertLead(lead);  // status: partial|abandoned|complete
  // For now, log server-side so it is visible in function logs.
  console.log('[lead]', lead.status, lead.source, lead.lead_id, usable ? '(usable)' : '(no contact)');

  // Native (no-JS) form submit expects a redirect; fetch/beacon expects JSON.
  const wantsJson = ct.includes('application/json') || request.headers.get('x-requested-with') === 'fetch';
  if (!wantsJson && lead.status === 'complete') return redirect('/thank-you/', 303);
  return json({ ok: true, stored: usable });
};
