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

  // --- header scroll-state + over-hero mode (header persists across nav) ------
  const header = document.querySelector<El & { __hdr?: () => void }>('.ss-header');
  if (header) {
    // Per page: is a dark (ink) section sitting under the header at the top? If so
    // the header rides transparent + white until the page scrolls. Re-evaluated on
    // every page-load because the header element itself persists across nav.
    const firstReg = document.querySelector('main [data-register]');
    header.dataset.overHero = firstReg?.getAttribute('data-register') === 'ink' ? '1' : '';

    if (!header.dataset.scrollBound) {
      header.dataset.scrollBound = '1';
      // Publish the header height as --hh so a full-viewport hero can size below it.
      // MUST be measured only when NOT scrolled and NEVER on every scroll frame:
      // reading offsetHeight while the header animates its shrink, and feeding that
      // back into the hero's min-height, makes the page height oscillate (a shake).
      const setHH = () => {
        const was = header.classList.contains('is-scrolled');
        if (was) header.classList.remove('is-scrolled');
        document.documentElement.style.setProperty('--hh', `${header.offsetHeight}px`);
        if (was) header.classList.add('is-scrolled');
      };
      // Hysteresis: turn the compact state ON past 24px and OFF below 6px. The dead
      // zone stops it flipping back and forth when a scroll lands near the boundary.
      let scrolled = false;
      const update = () => {
        const y = window.scrollY;
        if (!scrolled && y > 24) scrolled = true;
        else if (scrolled && y < 6) scrolled = false;
        header.classList.toggle('is-scrolled', scrolled);
        // Over-hero: transparent + white (ink register) only while at the top of a
        // dark-hero page; solid paper header once scrolled or on a light page.
        const over = header.dataset.overHero === '1' && !scrolled;
        header.classList.toggle('is-over', over);
        header.setAttribute('data-register', over ? 'ink' : 'paper');
      };
      header.__hdr = update;
      setHH();
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', setHH, { passive: true });
    } else {
      // Listeners already bound; just re-apply for the new page's over-hero state.
      header.__hdr?.();
    }
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
