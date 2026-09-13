/**
 * subscribe.ts — progressive enhancement for the teardown signup form.
 *
 * Without JavaScript the form posts natively and /api/subscribe returns a small
 * confirmation page. With JavaScript it never leaves the page: the form is
 * replaced in place by a confirmation, which is what a one-field email signup
 * should do. There is no /thank-you/ redirect — that page is for enquiries, and
 * telling a subscriber "a real person will reply within one working day" was
 * never true.
 *
 * No analytics events fire here, deliberately. A list signup is not a
 * conversion; counting it as one would corrupt the signal the ad campaigns
 * optimise against.
 */
export {}; // module scope

function init(form: HTMLFormElement): void {
  if (form.dataset.enh) return;
  form.dataset.enh = '1';

  const status = form.parentElement?.querySelector<HTMLElement>('[data-sub-status]') ?? null;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const input = form.querySelector<HTMLInputElement>('input[type="email"]');

  // Attribution, read from the URL at submit time. Same fields as the lead form,
  // so a teardown signup that came from a campaign can be traced to it.
  const fill = () => {
    const p = new URLSearchParams(location.search);
    const set = (n: string, v: string) => {
      const el = form.querySelector<HTMLInputElement>(`[name="${n}"]`);
      if (el) el.value = v;
    };
    set('page', location.pathname);
    set('referrer', document.referrer || '');
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) set(k, p.get(k) ?? '');
  };

  const say = (msg: string, bad = false) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.dataset.state = bad ? 'error' : 'ok';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (input?.value ?? '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input?.setAttribute('aria-invalid', 'true');
      say('Enter a valid email address.', true);
      input?.focus();
      return;
    }
    input?.setAttribute('aria-invalid', 'false');
    fill();

    if (button) {
      button.disabled = true;
      button.textContent = 'Adding…';
    }

    try {
      const body: Record<string, string> = {};
      for (const [k, v] of new FormData(form).entries()) if (typeof v === 'string') body[k] = v;

      const r = await fetch('/api/subscribe/', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-requested-with': 'fetch' },
        body: JSON.stringify(body),
      });
      const data = (await r.json().catch(() => null)) as { ok?: boolean } | null;
      if (!r.ok || data?.ok !== true) throw new Error('failed');

      // Replace the form with the confirmation rather than leaving a dead field
      // on screen. aria-live on the status node announces it.
      form.hidden = true;
      say('You’re on the list. The first teardown reaches you the day it publishes.');
    } catch {
      if (button) {
        button.disabled = false;
        button.textContent = 'Notify me';
      }
      say('That didn’t go through. Try again, or email support@scalingsocials.com.', true);
    }
  });
}

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<HTMLFormElement>('[data-subscribe-form]').forEach(init);
});
