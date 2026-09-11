/**
 * TEMPORARY diagnostic — remove after debugging GA4 MP.
 * GET /api/ga-diag?cid=<client_id> → reports whether the Worker sees
 * GA4_MP_API_SECRET (boolean only, never the value) and runs Google's
 * Measurement Protocol validation endpoint so we can see why generate_lead
 * isn't landing. Safe: the secret is used server-side and never returned.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env?: Record<string, string | undefined> } })?.runtime?.env ?? {};
  const pick = (k: string) => env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
  const secret = pick('GA4_MP_API_SECRET');
  const mid = pick('GA4_MEASUREMENT_ID') ?? 'G-DQH1656N5W';
  const cid = new URL(request.url).searchParams.get('cid') || '1234567890.1234567890';

  const out: Record<string, unknown> = {
    hasSecret: Boolean(secret),
    secretLen: secret ? secret.length : 0,
    measurementId: mid,
    host: (() => { try { return new URL(request.url).hostname; } catch { return ''; } })(),
  };

  if (secret) {
    try {
      const body = {
        client_id: cid,
        events: [{ name: 'generate_lead', params: { engagement_time_msec: 1, session_id: '123', debug_mode: true } }],
      };
      const r = await fetch(
        `https://www.google-analytics.com/debug/mp/collect?measurement_id=${encodeURIComponent(mid)}&api_secret=${encodeURIComponent(secret)}`,
        { method: 'POST', body: JSON.stringify(body) },
      );
      out.mpDebugStatus = r.status;
      out.mpValidation = await r.json().catch(() => null);
    } catch (e) {
      out.mpError = (e as Error).message;
    }
  }

  return new Response(JSON.stringify(out, null, 2), { headers: { 'content-type': 'application/json' } });
};
