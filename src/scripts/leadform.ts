/**
 * leadform.ts — progressive enhancement for LeadForm.astro. See 04, 01 §2.1.
 *
 * Turns the single form into two steps, validates inline, and captures the lead
 * Shopify-style: a `partial` record is sent the instant step 1 is completed, and
 * an `abandoned` beacon fires if the visitor leaves without submitting. On submit
 * it posts `complete` and redirects to /thank-you/. Re-inits on view transitions.
 */
import { checkPhone } from '@/lib/phone';

type FormEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Field names /api/lead models as top-level columns. MUST stay in sync with
 * `leadSchema` in src/pages/api/lead.ts — anything not listed here is sent as
 * an `answers` entry instead of being silently dropped by the server's schema.
 */
const TOP_LEVEL = new Set([
  'lead_id', 'source', 'status', 'name', 'email', 'phone', 'phone_cc', 'company', 'website',
  'message', 'page', 'company_website', 'cf-turnstile-response',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid', 'landing_page', 'referrer',
]);

type GtagWin = Window & { gtag?: (...args: unknown[]) => void };
type FbqWin = Window & { fbq?: (...args: unknown[]) => void };

/**
 * Read the first-party tracking cookies so /api/lead can send the server-side
 * conversions into the same session/browser identity:
 *  - GA4: `_ga` = "GA1.1.<cid1>.<cid2>"; `_ga_DQH1656N5W` = "GS1.1.<sid>.…" or "GS2.1.s<sid>$…"
 *  - Meta: `_fbp` (browser id) and `_fbc` (click id, set when fbclid is present)
 * Empty strings when a cookie isn't set yet — the server just skips that platform.
 */
function trackingIds(): { clientId: string; sessionId: string; fbp: string; fbc: string } {
  const read = (re: RegExp) => document.cookie.match(re)?.[1] ?? '';
  const ga = read(/(?:^|;\s*)_ga=([^;]+)/);
  const clientId = ga ? ga.split('.').slice(-2).join('.') : '';
  const ses = read(/(?:^|;\s*)_ga_DQH1656N5W=([^;]+)/);
  const sessionId = ses ? (ses.match(/s(\d+)/)?.[1] ?? ses.split('.')[2] ?? '') : '';
  const fbp = read(/(?:^|;\s*)_fbp=([^;]+)/);
  const fbc = read(/(?:^|;\s*)_fbc=([^;]+)/);
  return { clientId, sessionId, fbp, fbc };
}

type TurnstileWin = Window & {
  turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string };
  __ssTsReady?: () => void;
  __ssTsQ?: Array<() => void>;
};

// Load the Turnstile API once (explicit render so widgets survive View
// Transitions), then run the callback when it is ready.
function loadTurnstile(cb: () => void): void {
  const w = window as TurnstileWin;
  if (w.turnstile) return cb();
  w.__ssTsQ = w.__ssTsQ ?? [];
  w.__ssTsQ.push(cb);
  if (document.getElementById('cf-turnstile-api')) return;
  w.__ssTsReady = () => {
    for (const f of w.__ssTsQ ?? []) f();
    w.__ssTsQ = [];
  };
  const s = document.createElement('script');
  s.id = 'cf-turnstile-api';
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__ssTsReady';
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

function initForm(form: HTMLFormElement): void {
  if (form.dataset.enh) return;
  form.dataset.enh = '1';

  const source = form.dataset.source ?? 'website';
  const uid = () =>
    (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  const leadId = uid();
  // Stable per-submission id — carried to /api/lead so a future Meta CAPI Lead
  // event can be deduplicated against the browser Pixel by event_id.
  const eventId = uid();
  const set = (name: string, value: string) => {
    const el = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (el) el.value = value;
  };
  set('lead_id', leadId);
  set('page', location.pathname);

  // Populate attribution fields from the URL (persist across both steps because
  // they are hidden inputs in the same form). utm_* / gclid / fbclid come from
  // the query string; landing_page + referrer from the document.
  const params = new URLSearchParams(location.search);
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']) {
    const v = params.get(k);
    if (v) set(k, v);
  }
  set('landing_page', location.href.split('#')[0]);
  set('referrer', document.referrer || '');

  // Where to go on success: the form's own data-redirect (LP pages), else the
  // default. The ad-spend selection rides along as ?spend= for later events.
  const redirectTo = () => {
    const target = form.dataset.redirect;
    if (!target) return '/thank-you/';
    const spend = form.querySelector<HTMLSelectElement>('[name="ad_spend"], [name$="ad_spend"]')?.value ?? '';
    return spend ? `${target}?spend=${encodeURIComponent(spend)}` : target;
  };

  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-step]'));
  const progress = form.querySelector<HTMLElement>('[data-lf-progress]');
  const stepNum = form.querySelector<HTMLElement>('[data-lf-step]');
  const status = form.querySelector<HTMLElement>('[data-lf-status]');
  const backBtn = form.querySelector<HTMLButtonElement>('[data-back]');
  if (progress) progress.hidden = false;

  // Render the Turnstile widget for this form (if present + configured).
  const turnstileEl = form.querySelector<HTMLElement>('.ss-turnstile');
  if (turnstileEl && turnstileEl.dataset.sitekey && !turnstileEl.dataset.rendered) {
    loadTurnstile(() => {
      if (turnstileEl.dataset.rendered) return;
      try {
        (window as TurnstileWin).turnstile?.render(turnstileEl, { sitekey: turnstileEl.dataset.sitekey });
        turnstileEl.dataset.rendered = '1';
      } catch {
        /* ignore — server treats a missing token as unverified */
      }
    });
  }
  // Wait briefly for the token so a fast submit isn't dropped as unverified.
  const ensureToken = async (): Promise<void> => {
    if (!turnstileEl) return;
    const val = () => form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value;
    for (let i = 0; i < 30 && !val(); i++) await new Promise((r) => setTimeout(r, 100));
  };

  let partialSent = false;
  let submitted = false;

  const stepFields = (n: number): FormEl[] =>
    Array.from(steps[n - 1]?.querySelectorAll<FormEl>('input, select, textarea') ?? []).filter(
      (el) => el.name && el.type !== 'hidden'
    );

  const show = (n: number, focus = true) => {
    for (const s of steps) s.hidden = Number(s.dataset.step) !== n;
    if (stepNum) stepNum.textContent = String(n);
    if (backBtn) backBtn.hidden = n === 1;
    // Only move focus on a user-driven step change. Focusing on initial render
    // would blur a prior form's first field (two forms share the page on the LP),
    // firing its validation and flashing "Required." before any input.
    if (focus) stepFields(n)[0]?.focus();
  };
  show(1, false);

  // Default the dial code to the visitor's region. India is the fallback, so a
  // UAE visitor is the only one who sees a change — and either can override it.
  const tz = (() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
  })();
  if (/Dubai|Abu_Dhabi|Muscat|Qatar|Bahrain|Riyadh/.test(tz)) {
    for (const sel of form.querySelectorAll<HTMLSelectElement>('[data-phone-cc]')) {
      if (!sel.dataset.touched) sel.value = 'AE';
    }
  }
  const validate = (el: FormEl): boolean => {
    const err = el.closest('label')?.querySelector<HTMLElement>('[data-err]');
    const v = el.value.trim();
    let msg = '';
    if (el.required && !v) msg = 'Required.';
    else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email.';
    else if (el.type === 'tel' && v) {
      // Country-aware. The old rule was "7 or more digits", which accepted
      // almost any string and let unreachable numbers through as leads.
      const iso = el.parentElement?.querySelector<HTMLSelectElement>('[data-phone-cc]')?.value;
      const r = checkPhone(v, iso);
      if (!r.ok) msg = r.error;
    }
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      err.textContent = msg;
      err.hidden = !msg;
    }
    return !msg;
  };
  const validateStep = (n: number) => stepFields(n).map(validate).every(Boolean);
  const step1Filled = () => stepFields(1).every((el) => !el.required || el.value.trim() !== '');

  for (const el of form.querySelectorAll<FormEl>('input, select, textarea')) {
    el.addEventListener('blur', () => validate(el));
  }

  // Changing the dial code re-checks the number against the new country's rule,
  // and marks the select as chosen so nothing overwrites it afterwards.
  for (const sel of form.querySelectorAll<HTMLSelectElement>('[data-phone-cc]')) {
    sel.addEventListener('change', () => {
      sel.dataset.touched = '1';
      const num = sel.parentElement?.querySelector<HTMLInputElement>('[data-phone-num]');
      if (num && num.value.trim()) validate(num);
    });
  }

  const collect = (statusVal: string): Record<string, unknown> => {
    const { clientId, sessionId, fbp, fbc } = trackingIds();
    const base: Record<string, unknown> = {
      lead_id: leadId,
      source,
      status: statusVal,
      page: location.pathname,
      event_id: eventId,
      ga_client_id: clientId,
      ga_session_id: sessionId,
      fbp,
      fbc,
    };
    const answers: Record<string, string> = {};
    for (const [k, v] of new FormData(form).entries()) {
      if (typeof v !== 'string') continue;
      if (k.startsWith('q_')) answers[k.slice(2)] = v;
      // Anything the API does not model as a top-level column belongs in
      // `answers`. Pages that build their own steps (/audit/, /contact/, the
      // /lp/ pages, the technical-SEO audit) name fields like `budget`,
      // `ad_spend` or `category` without the q_ prefix; those used to be
      // stripped by the server's schema and lost, which also left `answers`
      // empty so lead scoring could never award the deal-size points.
      else if (TOP_LEVEL.has(k)) base[k] = v;
      else answers[k] = v;
    }
    base.answers = answers;
    return base;
  };

  const send = (statusVal: string, beacon = false) => {
    const body = JSON.stringify(collect(statusVal));
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/lead/', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/lead/', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-requested-with': 'fetch' },
      body,
      keepalive: true,
    }).catch(() => {});
  };

  form.querySelector<HTMLButtonElement>('[data-next]')?.addEventListener('click', () => {
    if (!validateStep(1)) return;
    if (!partialSent) {
      send('partial');
      // Micro-conversion: the visitor completed step 1. Client-side is fine here
      // (a lost form_start to an ad-blocker doesn't matter); the real conversion,
      // generate_lead, is sent reliably server-side. See analytics-event-plan.
      (window as GtagWin).gtag?.('event', 'form_start', { form_source: source, page: location.pathname });
      (window as FbqWin).fbq?.('trackCustom', 'FormStart', { form_source: source });
      partialSent = true;
    }
    show(2);
  });
  backBtn?.addEventListener('click', () => show(1));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(1)) return show(1);
    if (!validateStep(2)) return;
    submitted = true;
    if (status) {
      status.hidden = false;
      status.textContent = 'Sending…';
      status.style.color = 'var(--fg-muted)';
    }
    await ensureToken();
    try {
      const r = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-requested-with': 'fetch' },
        body: JSON.stringify(collect('complete')),
      });
      // A 200 is not by itself success. The endpoint answers {ok:false} when it
      // rejected or could not keep the enquiry; trusting r.ok alone used to send
      // people to /thank-you/ for submissions that were thrown away.
      const body = (await r.json().catch(() => null)) as
        | { ok?: boolean; error?: string; fields?: string[] }
        | null;
      if (r.ok && body?.ok !== false) {
        // Browser Pixel Lead — best-effort; the server CAPI fires the same event
        // with this event_id, so Meta dedupes if both arrive. eventID is the
        // dedup key (note the capitalisation fbq expects).
        (window as FbqWin).fbq?.('track', 'Lead', { source }, { eventID: eventId });
        location.assign(redirectTo());
        return;
      }
      submitted = false; // let the abandon beacon fire again if they now leave
      if (body?.error === 'invalid' && body.fields?.length) {
        // Point at the offending fields so they can actually fix it.
        for (const name of body.fields) {
          const el = form.querySelector<FormEl>(`[name="${CSS.escape(name)}"]`);
          if (!el) continue;
          el.setAttribute('aria-invalid', 'true');
          const err = el.closest('label')?.querySelector<HTMLElement>('[data-err]');
          if (err) {
            err.textContent = 'Please check this.';
            err.hidden = false;
          }
        }
        const first = form.querySelector<FormEl>('[aria-invalid="true"]');
        if (first) {
          if (first.closest('[data-step="1"]')) show(1);
          first.focus();
        }
        throw new Error('invalid');
      }
      throw new Error(body?.error ?? 'bad');
    } catch (e) {
      if (status) {
        status.textContent =
          (e as Error)?.message === 'invalid'
            ? 'Please check the highlighted fields and send again.'
            : "We couldn't send that — please try again, or email support@scalingsocials.com.";
        status.style.color = 'var(--neg)';
      }
    }
  });

  const onLeave = () => {
    if (submitted) return;
    if (!partialSent && !step1Filled()) return;
    send('abandoned', true);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') onLeave();
  });
  window.addEventListener('pagehide', onLeave);
}

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach(initForm);
});
