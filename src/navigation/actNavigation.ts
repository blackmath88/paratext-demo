/**
 * The era navigator.
 *
 * Five persistent status tracks make the historical regimes and the viewer's
 * position legible without occupying the right side of the scene.
 *
 * It is built from real anchors so it works before the timeline boots, works
 * with the keyboard, and leaves a usable URL behind.
 */

import {
  actAt,
  actById,
  eraForAct,
  experienceEras,
  type Act,
  type ExperienceEra,
} from '../data/acts';

export type Navigation = {
  update(progress: number): void;
  destroy(): void;
};

export function buildNavigation(
  mount: HTMLElement,
  requestAct: (act: Act, smooth: boolean) => void,
  initialHash = location.hash.replace('#', ''),
): Navigation {
  const nav = document.createElement('nav');
  nav.className = 'actnav';
  nav.setAttribute('aria-label', 'Historical regimes');

  const header = document.createElement('div');
  header.className = 'actnav__header';

  const stationLine = document.createElement('p');
  stationLine.className = 'actnav__station';

  header.append(stationLine);

  const list = document.createElement('ol');
  list.className = 'actnav__list';

  const entries = new Map<string, { era: ExperienceEra; link: HTMLAnchorElement; fill: HTMLElement }>();
  const actEntries = new Map<string, HTMLAnchorElement>();

  for (const era of experienceEras) {
    const firstAct = actById(era.actIds[0]!);
    if (!firstAct) continue;
    const item = document.createElement('li');
    item.className = 'actnav__item';

    const link = document.createElement('a');
    link.className = 'actnav__link';
    link.href = `#${firstAct.id}`;
    link.dataset.era = era.id;
    link.innerHTML =
      `<span class="actnav__label"><span class="actnav__num">${era.number}</span>` +
      `<span class="actnav__title">${era.title}</span></span>`;
    link.title = era.description;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      requestAct(firstAct, false);
      history.replaceState(null, '', `#${firstAct.id}`);
    });

    const track = document.createElement('span');
    track.className = 'actnav__track';
    const fill = document.createElement('span');
    fill.className = 'actnav__fill';
    fill.setAttribute('aria-hidden', 'true');
    const stations = document.createElement('span');
    stations.className = 'actnav__stations';
    stations.style.gridTemplateColumns = `repeat(${era.actIds.length}, 1fr)`;
    for (const id of era.actIds) {
      const stationAct = actById(id);
      if (!stationAct) continue;
      const station = document.createElement('a');
      station.className = 'actnav__station-link';
      station.href = `#${stationAct.id}`;
      station.title = `${stationAct.number} · ${stationAct.title}`;
      station.setAttribute('aria-label', `Go directly to ${stationAct.title}`);
      station.addEventListener('click', (event) => {
        event.preventDefault();
        requestAct(stationAct, false);
        history.replaceState(null, '', `#${stationAct.id}`);
      });
      stations.appendChild(station);
      actEntries.set(stationAct.id, station);
    }
    track.append(fill, stations);
    item.append(link, track);
    list.appendChild(item);
    entries.set(era.id, { era, link, fill });
  }

  nav.append(list, header);
  mount.appendChild(nav);

  let currentId = '';
  let hashSyncReady = document.readyState === 'complete';
  const enableHashSync = () => { hashSyncReady = true; };
  if (!hashSyncReady) window.addEventListener('load', enableHashSync, { once: true });

  const update = (progress: number) => {
    const act = actAt(progress);
    const currentEra = eraForAct(act);
    if (act.id !== currentId) {
      currentId = act.id;
      stationLine.textContent = `${act.number} · ${act.title}`;
      for (const [id, station] of actEntries) {
        const isCurrent = id === act.id;
        station.classList.toggle('is-current', isCurrent);
        if (isCurrent) station.setAttribute('aria-current', 'step');
        else station.removeAttribute('aria-current');
      }
    }
    for (const { era, link, fill } of entries.values()) {
      const first = actById(era.actIds[0]!);
      const last = actById(era.actIds[era.actIds.length - 1]!);
      if (!first || !last) continue;
      const eraProgress = Math.max(0, Math.min(1, (progress - first.start) / (last.end - first.start)));
      fill.style.transform = `scaleX(${eraProgress})`;
      const isCurrent = era.id === currentEra.id;
      link.classList.toggle('is-current', isCurrent);
      link.classList.toggle('is-complete', eraProgress >= 0.999);
    }
    // Do not introduce an act hash during the initial load task. Browsers may
    // still perform native anchor placement then, which would skip both the
    // landing and animation and land in the plain-text carrier below.
    if (hashSyncReady && location.hash !== `#${act.id}`) {
      history.replaceState(null, '', `#${act.id}`);
    }
  };

  // Direct navigation to a hash.
  const applyHash = (id = location.hash.replace('#', '')) => {
    const act = actById(id);
    if (!act) return;
    requestAct(act, false);
    if (!document.body.dataset.mode || document.body.dataset.mode === 'static') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });
    }
  };

  const onHashChange = () => applyHash();
  window.addEventListener('hashchange', onHashChange);

  // Defer until the master timeline has been built.
  let initialHashTimer: number | undefined;
  const applyInitialHash = () => {
    // Native anchor placement happens at the end of the load task even though
    // the hash was removed during boot. Restore on the following task so it
    // cannot overwrite the authored timeline position.
    initialHashTimer = window.setTimeout(() => applyHash(initialHash), 0);
  };
  if (initialHash) {
    if (document.readyState === 'complete') applyInitialHash();
    else window.addEventListener('load', applyInitialHash, { once: true });
  }

  return {
    update,
    destroy: () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('load', applyInitialHash);
      window.removeEventListener('load', enableHashSync);
      if (initialHashTimer !== undefined) window.clearTimeout(initialHashTimer);
      nav.remove();
    },
  };
}
