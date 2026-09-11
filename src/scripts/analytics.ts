/**
 * analytics.ts — GA4 (gtag.js) bootstrap. See docs/spec/04 and the
 * analytics-event-plan: core funnel only (page_view, form_start, generate_lead).
 *
 * Loaded deferred from BaseLayout, so it never blocks render or the LCP <h1>.
 *
 * Two things to know:
 *  1. View transitions. <ClientRouter /> swaps the DOM without reloading, so
 *     gtag's automatic page_view fires only once. We set send_page_view:false and
 *     send page_view ourselves on every astro:page-load instead.
 *  2. No double counting. generate_lead is sent SERVER-SIDE only (Measurement
 *     Protocol, in /api/lead) — GA4 does NOT dedupe gtag vs MP hits, so a single
 *     source is the only way to avoid counting each lead twice. The browser hands
 *     the server its client_id/session_id (read from the _ga cookies in
 *     leadform.ts) so the server hit joins the right session and channel.
 *
 * Host gate: on any host other than the production domain (the pages.dev preview,
 * localhost) we flag hits with debug_mode so they surface in GA4 DebugView for
 * testing. Real reporting is driven by the production domain.
 */
const GA_ID = 'G-DQH1656N5W';
const PROD_HOST = 'scalingsocials.com';

type GtagWin = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __ssGaReady?: boolean;
};

function boot(): void {
  const w = window as GtagWin;
  if (w.__ssGaReady) return;
  w.__ssGaReady = true;

  const isProd = location.hostname === PROD_HOST;

  w.dataLayer = w.dataLayer || [];
  // The canonical gtag stub MUST push the `arguments` object verbatim — GA reads
  // it as an arguments-like, so a rest-param array would not work here.
  w.gtag = function gtag() {
    (w.dataLayer as unknown[]).push(arguments);
  };
  w.gtag('js', new Date());
  // send_page_view:false — we send page_view per view-transition navigation.
  w.gtag('config', GA_ID, {
    send_page_view: false,
    ...(isProd ? {} : { debug_mode: true }),
  });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

let lastLoc = document.referrer;
function pageView(): void {
  const w = window as GtagWin;
  w.gtag?.('event', 'page_view', {
    page_location: location.href,
    page_title: document.title,
    page_referrer: lastLoc,
  });
  lastLoc = location.href;
}

boot();
// astro:page-load fires on the initial load AND after every view transition, so
// this is the one page_view per rendered page (boot() stays idempotent).
document.addEventListener('astro:page-load', () => {
  boot();
  pageView();
});
