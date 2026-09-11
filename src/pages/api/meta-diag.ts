/**
 * TEMPORARY diagnostic — remove after debugging Meta CAPI.
 * GET /api/meta-diag/ → reports whether the Worker sees META_CAPI_TOKEN (boolean
 * only) and sends one test `Lead` to the Conversions API (with the test_event_code
 * if set), returning Meta's response (events_received / messages / fbtrace_id).
 * The token is used server-side and never returned.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as { runtime?: { env?: Record<string, string | undefined> } })?.runtime?.env ?? {};
  const pick = (k: string) => env[k] ?? (import.meta.env as Record<string, string | undefined>)[k];
  const token = pick('META_CAPI_TOKEN');
  const pixel = pick('META_PIXEL_ID') ?? '2381316206031576';
  const testCode = pick('META_TEST_EVENT_CODE');

  const out: Record<string, unknown> = {
    hasToken: Boolean(token),
    tokenLen: token ? token.length : 0,
    pixel,
    hasTestCode: Boolean(testCode),
    testCode: testCode ?? null,
  };

  if (token) {
    try {
      const body: Record<string, unknown> = {
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: 'diag-' + Date.now(),
            action_source: 'website',
            event_source_url: 'https://scalingsocials.com/audit/',
            user_data: { em: [await sha256('diagtest@example.com')], client_user_agent: 'diag' },
          },
        ],
      };
      if (testCode) body.test_event_code = testCode;
      const r = await fetch(
        `https://graph.facebook.com/v21.0/${pixel}/events?access_token=${encodeURIComponent(token)}`,
        { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) },
      );
      out.capiStatus = r.status;
      out.capiResponse = await r.json().catch(() => null);
    } catch (e) {
      out.capiError = (e as Error).message;
    }
  }

  return new Response(JSON.stringify(out, null, 2), { headers: { 'content-type': 'application/json' } });
};
