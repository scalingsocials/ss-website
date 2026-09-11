export {}; // module scope

/**
 * clarity.ts — Microsoft Clarity (session replay + heatmaps). See analytics-event-plan.
 *
 * Loaded deferred from BaseLayout. Clarity records continuously and handles SPA
 * navigation itself, so unlike GA4/Meta it needs no per-navigation call — just
 * load the tag once. No conversions/events, so nothing to gate or dedupe.
 */
const CLARITY_ID = 'ygppsnwfcq';

function boot(): void {
  const w = window as unknown as { clarity?: unknown; __ssClarity?: boolean };
  if (w.__ssClarity) return;
  w.__ssClarity = true;

  // Official Clarity snippet (typed loosely — it self-replaces once the tag loads).
  (function (c: Record<string, unknown>, l: Document, a: string, r: string, i: string) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        ((c[a] as { q?: unknown[] }).q = (c[a] as { q?: unknown[] }).q || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window as unknown as Record<string, unknown>, document, 'clarity', 'script', CLARITY_ID);
}

boot();
