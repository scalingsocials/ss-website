export {}; // module scope

/**
 * meta.ts — Meta (Facebook) Pixel bootstrap. See analytics-event-plan.
 *
 * Loaded deferred from BaseLayout. Like GA4, the site uses <ClientRouter /> view
 * transitions, so we fire PageView ourselves on every astro:page-load rather than
 * relying on the base code's single auto-fire.
 *
 * Events: PageView (here), FormStart + Lead (leadform.ts). The Lead event also
 * fires server-side via the Conversions API (/api/lead) with the SAME event_id,
 * so Meta deduplicates browser + server automatically — the browser hit is
 * best-effort, the CAPI hit is the reliable one.
 */
const PIXEL_ID = '2381316206031576';

function boot(): void {
  const w = window as unknown as { fbq?: FbqFn; _fbq?: FbqFn; __ssFbReady?: boolean };
  if (w.__ssFbReady) return;
  w.__ssFbReady = true;

  if (!w.fbq) {
    const n = function (this: unknown, ...args: unknown[]) {
      // Once the real fbevents.js loads it sets callMethod; until then, queue.
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    } as FbqFn;
    n.queue = [];
    n.loaded = true;
    n.version = '2.0';
    n.push = n;
    w.fbq = n;
    if (!w._fbq) w._fbq = n;

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }

  // init only — PageView is sent per navigation below (no auto-fire here).
  w.fbq('init', PIXEL_ID);
}

function pageView(): void {
  (window as unknown as { fbq?: FbqFn }).fbq?.('track', 'PageView');
}

boot();
document.addEventListener('astro:page-load', () => {
  boot();
  pageView();
});

interface FbqFn {
  (...args: unknown[]): void;
  callMethod?: (...a: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
}
