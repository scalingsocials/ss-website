/**
 * GET /api/geo — the visitor's country, for defaulting the phone dial code.
 *
 * The site is static, so a page cannot be rendered per-visitor; this is the one
 * on-demand route that can read the request. Cloudflare puts the IP's country in
 * `CF-IPCountry` at the edge, which is far better than guessing from the
 * browser timezone (a UAE visitor whose laptop is still on Asia/Kolkata, or any
 * VPN, defeats the timezone heuristic).
 *
 * Returns ONLY a 2-letter country code. No IP, no city, nothing that identifies
 * anyone, and nothing is stored — so there is nothing here to leak.
 *
 * Fails soft by design: an empty string when the header is missing, absent, or
 * one of Cloudflare's non-country values. leadform.ts then falls back to the
 * timezone hint and finally to India, so the form is never blocked on this.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const raw = request.headers.get('cf-ipcountry') ?? '';
  // 'XX' = unknown, 'T1' = Tor. Neither is a country we can default to.
  const country = /^[A-Z]{2}$/.test(raw) && raw !== 'XX' && raw !== 'T1' ? raw : '';
  return new Response(JSON.stringify({ country }), {
    headers: {
      'content-type': 'application/json',
      // Per-visitor, so it must not be shared by a cache.
      'cache-control': 'no-store',
    },
  });
};
