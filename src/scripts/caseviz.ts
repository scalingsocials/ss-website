/**
 * caseviz.ts — count-up for case-study stats. Tiny, progressive enhancement only.
 *
 * Every animated number already has its EXACT real value as static text in the
 * DOM (correct with JS off and for screen readers). This only interpolates the
 * display while the element scrolls into view, then restores the exact original
 * string — so the final text always equals the real figure, commas and all.
 *
 * Draw-in/reveal is handled by the site's existing [data-reveal] observer
 * (motion.ts); this file only owns the count-up.
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Parsed {
  prefix: string; // e.g. "₹", "+", ""
  value: number; // the numeric magnitude
  suffix: string; // e.g. " Cr", " L", "x", "%", " months"
  decimals: number; // digits after the decimal point in the source
  grouped: boolean; // had thousands separators (₹80,646)
}

function parseNumber(text: string): Parsed | null {
  const m = text.match(/^([^\d-]*?)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, rawNum, suffix] = m;
  const clean = rawNum.replace(/,/g, '');
  const value = parseFloat(clean);
  if (!Number.isFinite(value)) return null;
  const dot = clean.indexOf('.');
  const decimals = dot === -1 ? 0 : clean.length - dot - 1;
  return { prefix, value, suffix, decimals, grouped: rawNum.includes(',') };
}

function format(p: Parsed, current: number): string {
  let num: string;
  if (p.decimals > 0) num = current.toFixed(p.decimals);
  else num = p.grouped ? Math.round(current).toLocaleString('en-IN') : String(Math.round(current));
  return `${p.prefix}${num}${p.suffix}`;
}

function animate(el: HTMLElement): void {
  const target = (el.dataset.countup ?? el.textContent ?? '').trim();
  const p = parseNumber(target);
  if (!p) return;
  const fromAttr = el.dataset.countupFrom;
  const fromParsed = fromAttr ? parseNumber(fromAttr) : null;
  const start = fromParsed ? fromParsed.value : 0;
  const dur = 1100;
  const t0 = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const tick = (now: number) => {
    const t = Math.min(1, (now - t0) / dur);
    el.textContent = format(p, start + (p.value - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target; // restore the exact real string
  };
  requestAnimationFrame(tick);
}

function init(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-countup]')).filter(
    (el) => !el.dataset.countupDone,
  );
  if (!els.length) return;
  if (reduce || !('IntersectionObserver' in window)) {
    // Leave the exact static values in place; no animation.
    els.forEach((el) => (el.dataset.countupDone = '1'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.dataset.countupDone = '1';
        animate(el);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

init();
// Re-init after view transitions (header/footer persist; content swaps).
document.addEventListener('astro:page-load', init);
