/**
 * POST /api/subscribe — email list signups (the teardown list today).
 *
 * Deliberately NOT /api/lead. A subscription is not a sales enquiry, so this
 * endpoint does exactly one thing and nothing else:
 *
 *   - it upserts into public.subscribers (its own table, not website_leads)
 *   - it does NOT email the team; a signup is not an enquiry to respond to
 *   - it does NOT fire GA4 `generate_lead` or the Meta CAPI `Lead` event
 *   - it does NOT redirect to /thank-you/; the page confirms inline
 *
 * That last group is the point. An email-only signup counted as a `Lead` would
 * corrupt the conversion signal the ad campaigns optimise against, and it is far
 * cheaper to obtain than a real enquiry.
 *
 * Re-submitting the same address on the same list is an idempotent upsert, so a
 * visitor who signs up twice sees success rather than an error.
 */
import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const schema = z.object({
  email: z.string().email().max(160),
  /** Which list. Kept to a known set so the column cannot be filled with junk. */
  source: z.enum(['teardowns']).default('teardowns'),
  page: z.string().max(200).optional().default(''),
  utm_source: z.string().max(200).optional().default(''),
  utm_medium: z.string().max(200).optional().default(''),
  utm_campaign: z.string().max(200).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
  /** Honeypot — permissive here so a filled one reaches the silent-success path. */
  company_website: z.string().max(200).optional().default(''),
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/**
 * Minimal confirmation for a NO-JS submit. The page confirms inline when
 * JavaScript runs, so this is only ever seen with scripting off — it still has
 * to say something true and offer a way back.
 */
const page = (ok: boolean) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><title>${
      ok ? "You're on the list" : "That didn't go through"
    } — Scaling Socials</title></head>
<body><main>${
      ok
        ? `<h1>You're on the list</h1>
<p>The first teardown reaches you the day it publishes. Nothing else — we do not use this list for anything but the teardowns.</p>`
        : `<h1>That didn't go through</h1>
<p>We could not save your address. Please try again, or email
<a href="mailto:support@scalingsocials.com">support@scalingsocials.com</a> and we will add you by hand.</p>`
    }
<p><a href="/teardowns/">Back to teardowns</a></p></main></body></html>`,
    {
      status: ok ? 200 : 503,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    },
  );

function getEnv(locals: unknown) {
  const runtime = (locals as { runtime?: { env?: Record<string, string | undefined> } })?.runtime;
  const env = runtime?.env ?? {};
  const pick = (k: string) => env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
  return { supabaseUrl: pick('SUPABASE_URL'), supabaseKey: pick('SUPABASE_SERVICE_KEY') };
}

export const POST: APIRoute = async ({ request, locals }) => {
  const ct = request.headers.get('content-type') ?? '';
  const wantsJson = ct.includes('application/json') || request.headers.get('x-requested-with') === 'fetch';

  let raw: Record<string, unknown> = {};
  try {
    raw = ct.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return wantsJson ? json({ ok: false, error: 'bad_request' }, 400) : page(false);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => i.path.join('.')).filter(Boolean);
    return wantsJson ? json({ ok: false, error: 'invalid', fields }, 422) : page(false);
  }
  const sub = parsed.data;

  // Honeypot tripped: answer as if it worked so a bot learns nothing, store none.
  if (sub.company_website) return wantsJson ? json({ ok: true }) : page(true);

  const env = getEnv(locals);
  if (!env.supabaseUrl || !env.supabaseKey) {
    console.error('[subscribe] supabase not configured — signup LOST', sub.source);
    return wantsJson ? json({ ok: false, error: 'unavailable' }, 503) : page(false);
  }

  const row = {
    email: sub.email.trim().toLowerCase(),
    source: sub.source,
    page: sub.page || null,
    utm_source: sub.utm_source || null,
    utm_medium: sub.utm_medium || null,
    utm_campaign: sub.utm_campaign || null,
    referrer: sub.referrer || null,
    updated_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${env.supabaseUrl}/rest/v1/subscribers?on_conflict=email,source`, {
      method: 'POST',
      headers: {
        apikey: env.supabaseKey,
        Authorization: `Bearer ${env.supabaseKey}`,
        'content-type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`supabase ${res.status}: ${detail.slice(0, 300)}`);
    }
  } catch (e) {
    // Never claim success for something we did not store.
    console.error('[subscribe] upsert failed', (e as Error).message);
    return wantsJson ? json({ ok: false, error: 'unavailable' }, 503) : page(false);
  }

  console.log('[subscribe]', sub.source, 'stored');
  return wantsJson ? json({ ok: true }) : page(true);
};
