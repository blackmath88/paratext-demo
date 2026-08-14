/**
 * The margin navigator.
 *
 * An editorial annotation, not a stepper: a column of act numbers with a single
 * mark against the current one, and the title revealed only for that act.
 *
 * It is built from real anchors so it works before the timeline boots, works
 * with the keyboard, and leaves a usable URL behind.
 */

import { acts, actAt, actById, plannedActs, settlePoints } from '../data/acts';
import type { Master } from '../animation/master';

export type Navigation = {
  update(progress: number): void;
  destroy(): void;
};

export function buildNavigation(mount: HTMLElement, master: Master): Navigation {
  const nav = document.createElement('nav');
  nav.className = 'actnav';
  nav.setAttribute('aria-label', 'Acts');

  const list = document.createElement('ol');
  list.className = 'actnav__list';

  const entries = new Map<string, HTMLAnchorElement>();

  for (const [index, act] of acts.entries()) {
    const item = document.createElement('li');
    item.className = 'actnav__item';

    const link = document.createElement('a');
    link.className = 'actnav__link';
    link.href = `#${act.id}`;
    link.innerHTML =
      `<span class="actnav__num">${act.number}</span>` +
      `<span class="actnav__dot" aria-hidden="true"></span>` +
      `<span class="actnav__title">${act.shortTitle}</span>`;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Land on the same stable argument state used by scroll snapping.
      const target = settlePoints[index] ?? act.start;
      master.seek(target, true);
      history.replaceState(null, '', `#${act.id}`);
    });

    item.appendChild(link);
    list.appendChild(item);
    entries.set(act.id, link);
  }

  // During sliced development, future acts can remain visible but disabled.
  for (const act of plannedActs) {
    const item = document.createElement('li');
    item.className = 'actnav__item actnav__item--planned';
    item.innerHTML =
      `<span class="actnav__link" aria-disabled="true">` +
      `<span class="actnav__num">${act.number}</span>` +
      `<span class="actnav__dot" aria-hidden="true"></span>` +
      `<span class="actnav__title">${act.shortTitle}</span></span>`;
    list.appendChild(item);
  }

  nav.appendChild(list);
  mount.appendChild(nav);

  let currentId = '';

  const update = (progress: number) => {
    const act = actAt(progress);
    if (act.id === currentId) return;
    currentId = act.id;
    for (const [id, link] of entries) {
      link.classList.toggle('is-current', id === act.id);
      if (id === act.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    if (location.hash !== `#${act.id}`) {
      history.replaceState(null, '', `#${act.id}`);
    }
  };

  // Direct navigation to a hash.
  const applyHash = () => {
    const id = location.hash.replace('#', '');
    const act = actById(id);
    if (!act) return;
    const index = acts.indexOf(act);
    master.seek(settlePoints[index] ?? act.start, false);
  };

  const onHashChange = () => applyHash();
  window.addEventListener('hashchange', onHashChange);

  // Defer so ScrollTrigger has measured before we scroll into position.
  if (location.hash) requestAnimationFrame(() => requestAnimationFrame(applyHash));

  return {
    update,
    destroy: () => {
      window.removeEventListener('hashchange', onHashChange);
      nav.remove();
    },
  };
}
