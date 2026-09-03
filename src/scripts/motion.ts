/**
 * Motion — progressive enhancement only. See 01 §2.1, 08 §6, CLAUDE.md §10.
 *
 * Re-runs on every view-transition navigation via `astro:page-load` (fires on the
 * initial load too). Content is visible with JS disabled; this only layers on:
 *  - header scroll-state (lift-off)
 *  - scroll reveals ([data-reveal])
 *  - creative-wall videos: load/play on intersection, pause off-screen, click to
 *    unmute + expand (only clips that carry a real src)
 *  - Delta count-up: animate FROM the real "before" value to the real "after"
 *    value. Non-numeric values (TODO placeholders) are left untouched — never
 *    animate from zero, never invent a value (CLAUDE.md §10).
 *  - sticky mini-CTA once the hero scrolls out of view
 *
 * All bindings are idempotent (dataset guards) so repeated page-loads don't stack.
 */

type El = HTMLElement & { dataset: DOMStringMap };

function parseNum(s: string): { pre: string; num: number; suf: string } | null {
  const m = s.trim().match(/^(\D*)(-?[\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  return { pre: m[1]!, num: parseFloat(m[2]!.replace(/,/g, '')), suf: m[3]! };
}

function setupPage(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // --- header scroll-state (attach once; the header persists across nav) -----
  const header = document.querySelector<El>('.ss-header');
  if (header && !header.dataset.scrollBound) {
    header.dataset.scrollBound = '1';
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- scroll reveals --------------------------------------------------------
  const reveals = Array.from(document.querySelectorAll<El>('[data-reveal]:not(.is-visible)'));
  if (reveals.length && !reduce && hasIO) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    for (const t of reveals) io.observe(t);
  }

  // --- creative-wall videos --------------------------------------------------
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-src]'));
  if (videos.length && hasIO) {
    const vio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (!v.src) v.src = v.dataset.src!;
            if (!reduce) v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.35 }
    );
    for (const v of videos) {
      if ((v as El).dataset.bound) continue;
      (v as El).dataset.bound = '1';
      vio.observe(v);
    }
  }
  // click a clip → unmute + expand (fullscreen)
  document.querySelectorAll<El>('[data-clip]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const v = btn.querySelector('video');
      if (!v) return;
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.muted = false;
      v.play().catch(() => {});
      v.requestFullscreen?.().catch(() => {});
    });
  });

  // --- Delta count-up --------------------------------------------------------
  if (!reduce && hasIO) {
    const cio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          cio.unobserve(e.target);
          const el = e.target as HTMLElement;
          const after = parseNum(el.textContent ?? '');
          if (!after) continue;
          const wrap = el.closest('[data-delta]');
          const beforeEl = wrap?.querySelector('[data-delta-before]');
          const before = beforeEl ? parseNum(beforeEl.textContent ?? '') : null;
          const start = before ? before.num : after.num;
          const dec = Number.isInteger(after.num) && Number.isInteger(start) ? 0 : 1;
          const dur = 800;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = start + (after.num - start) * eased;
            el.textContent = after.pre + val.toFixed(dec) + after.suf;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = after.pre + after.num.toFixed(dec) + after.suf;
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll<El>('[data-delta-value]').forEach((el) => {
      if (el.dataset.cbound) return;
      if (!parseNum(el.textContent ?? '')) return; // TODO / non-numeric → skip
      el.dataset.cbound = '1';
      cio.observe(el);
    });
  }

  // --- sticky mini-CTA -------------------------------------------------------
  const sticky = document.querySelector<El>('[data-sticky-cta]');
  const hero = document.querySelector<El>('.hero');
  if (sticky && hero && hasIO && !sticky.dataset.bound) {
    sticky.dataset.bound = '1';
    const sio = new IntersectionObserver(
      (entries) => sticky.classList.toggle('is-visible', !entries[0]!.isIntersecting),
      { threshold: 0 }
    );
    sio.observe(hero);
  } else if (sticky && !hero) {
    // Not on the homepage — keep it hidden.
    sticky.classList.remove('is-visible');
  }
}

document.addEventListener('astro:page-load', setupPage);
