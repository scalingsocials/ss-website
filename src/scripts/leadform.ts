/**
 * leadform.ts — progressive enhancement for LeadForm.astro. See 04, 01 §2.1.
 *
 * Turns the single form into two steps, validates inline, and captures the lead
 * Shopify-style: a `partial` record is sent the instant step 1 is completed, and
 * an `abandoned` beacon fires if the visitor leaves without submitting. On submit
 * it posts `complete` and redirects to /thank-you/. Re-inits on view transitions.
 */
type FormEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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
  const leadId =
    (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
    `l_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  const set = (name: string, value: string) => {
    const el = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (el) el.value = value;
  };
  set('lead_id', leadId);
  set('page', location.pathname);

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

  const show = (n: number) => {
    for (const s of steps) s.hidden = Number(s.dataset.step) !== n;
    if (stepNum) stepNum.textContent = String(n);
    if (backBtn) backBtn.hidden = n === 1;
    stepFields(n)[0]?.focus();
  };
  show(1);

  const validate = (el: FormEl): boolean => {
    const err = el.closest('label')?.querySelector<HTMLElement>('[data-err]');
    const v = el.value.trim();
    let msg = '';
    if (el.required && !v) msg = 'Required.';
    else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email.';
    else if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 7) msg = 'Enter a valid number.';
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

  const collect = (statusVal: string): Record<string, unknown> => {
    const base: Record<string, unknown> = { lead_id: leadId, source, status: statusVal, page: location.pathname };
    const answers: Record<string, string> = {};
    for (const [k, v] of new FormData(form).entries()) {
      if (typeof v !== 'string') continue;
      if (k.startsWith('q_')) answers[k.slice(2)] = v;
      else base[k] = v;
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
      if (r.ok) {
        location.assign('/thank-you/');
        return;
      }
      throw new Error('bad');
    } catch {
      if (status) {
        status.textContent = 'Something went wrong — email support@scalingsocials.com.';
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
