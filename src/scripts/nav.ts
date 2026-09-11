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

  // Fully dismiss every panel, including defeating a lingering :hover / :focus-within.
  // The header persists across client-side navigation (transition:persist), so after
  // a link is chosen the panel the pointer is still hovering would otherwise stay
  // open on the page just navigated to. `is-dismissed` suppresses the hover-open
  // (see Header.astro) until the pointer genuinely leaves the group.
  const dismissAll = () => {
    closeAll();
    for (const g of groups) g.classList.add('is-dismissed');
    (document.activeElement as HTMLElement | null)?.blur();
  };

  for (const group of groups) {
    const trigger = group.querySelector<HTMLButtonElement>('[data-nav-trigger]');
    if (!trigger) continue;

    trigger.addEventListener('click', () => {
      const open = group.getAttribute('data-open') === 'true';
      closeAll(group);
      group.classList.remove('is-dismissed'); // an explicit tap should open
      if (open) {
        group.removeAttribute('data-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        group.setAttribute('data-open', 'true');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // A real pointer-leave clears the dismissed state so the next hover opens again.
    group.addEventListener('mouseleave', () => group.classList.remove('is-dismissed'));

    // Choosing any link in the panel closes the menu immediately (before navigation).
    group.querySelectorAll<HTMLAnchorElement>('.ss-nav-panel a[href]').forEach((link) => {
      link.addEventListener('click', dismissAll);
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

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    // Lock background scroll while the menu is open (iOS still scrolls behind a
    // modal <dialog> otherwise). Unlocked on the dialog's `close` event below.
    document.documentElement.style.overflow = 'hidden';
  });
  closeBtn?.addEventListener('click', () => dialog.close());
  // Click on the backdrop (the dialog element itself, outside its content) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  // Choosing any link closes the sheet (the header persists across navigation, so
  // it would otherwise stay open on the next page). A <details> summary is not an
  // anchor, so tapping to expand a group does not close the sheet — only real links.
  dialog.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    link.addEventListener('click', () => dialog.close());
  });
  // Fires for every close path (button, backdrop, Esc, link) — restore scroll here.
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
  });
}

// Reset all nav UI on every client-side navigation. The header is persisted
// (transition:persist), so any panel/dialog left open would carry to the next page.
function resetNavOnNavigate(): void {
  document.addEventListener('astro:after-swap', () => {
    document.querySelectorAll<HTMLElement>('[data-nav-group]').forEach((g) => {
      g.removeAttribute('data-open');
      g.querySelector<HTMLButtonElement>('[data-nav-trigger]')?.setAttribute('aria-expanded', 'false');
    });
    const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-nav]');
    if (dialog?.open) dialog.close();
    document.documentElement.style.overflow = '';
  });
}

initDropdowns();
initMobileNav();
resetNavOnNavigate();
