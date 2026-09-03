/**
 * Navigation behaviour — progressive enhancement only. See 01 §2.1.
 *
 * The nav is fully usable with JavaScript disabled: the mega-menu panels are
 * revealed by CSS :hover and :focus-within, so a keyboard user tabbing to a
 * trigger opens the panel and tabs into its links with no script at all.
 *
 * This module only *improves* that: it wires aria-expanded, lets a click/tap
 * toggle a panel (touch has no hover), and closes menus on Escape or an outside
 * click. It is a few dozen lines of vanilla JS, imported per-page — never a
 * React island (adding React for a disclosure widget costs ~45KB, 01 §2.1).
 */

function initDropdowns(): void {
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-group]'));

  const closeAll = (except?: HTMLElement) => {
    for (const g of groups) {
      if (g === except) continue;
      g.removeAttribute('data-open');
      g.querySelector<HTMLButtonElement>('[data-nav-trigger]')?.setAttribute('aria-expanded', 'false');
    }
  };

  for (const group of groups) {
    const trigger = group.querySelector<HTMLButtonElement>('[data-nav-trigger]');
    if (!trigger) continue;

    trigger.addEventListener('click', () => {
      const open = group.getAttribute('data-open') === 'true';
      closeAll(group);
      if (open) {
        group.removeAttribute('data-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        group.setAttribute('data-open', 'true');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
      (document.activeElement as HTMLElement | null)?.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('[data-nav-group]')) closeAll();
  });
}

function initMobileNav(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-nav]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-mobile-open]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-mobile-close]');
  if (!dialog || !openBtn) return;

  openBtn.addEventListener('click', () => dialog.showModal());
  closeBtn?.addEventListener('click', () => dialog.close());
  // Click on the backdrop (the dialog element itself, outside its content) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}

initDropdowns();
initMobileNav();
