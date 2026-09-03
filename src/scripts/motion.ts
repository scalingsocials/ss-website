/**
 * Motion — progressive enhancement only. See 01 §2.1 and 08 §6.
 *
 * Two tiny behaviours, no library:
 *  1. Header scroll-state: toggles `.is-scrolled` so the header lifts off the page.
 *  2. Scroll reveals: sections tagged [data-reveal] fade/rise in once as they
 *     enter the viewport. Content is visible by default; this script adds a
 *     `js-reveal` marker to <html> that CSS uses to arm the hidden→shown
 *     transition, so with JS disabled everything is simply shown (JS-off safe).
 *
 * Respects prefers-reduced-motion: reveals are shown immediately, not animated.
 */

// Header lift on scroll.
const header = document.querySelector<HTMLElement>('.ss-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Scroll reveals.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

if (targets.length && !reduce && 'IntersectionObserver' in window) {
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
  for (const t of targets) io.observe(t);
}

// Creative-wall videos: load + play only in view, pause out (08 §8 media rules).
// data-src holds the source so nothing downloads until it is near the viewport.
const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-src]'));
if (videos.length && 'IntersectionObserver' in window) {
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
  for (const v of videos) vio.observe(v);
}
