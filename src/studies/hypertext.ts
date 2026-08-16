type PlaceRoute =
  | { kind: 'section'; id: string }
  | { kind: 'claim'; id: string }
  | { kind: 'source'; id: string; from: string };

type Section = {
  id: string;
  number: string;
  label: string;
  title: string;
  thesis: string;
  nodes: HTMLElement[];
};

const sourceFrame = document.querySelector<HTMLIFrameElement>('#canonicalSource')!;
const place = document.querySelector<HTMLElement>('#place')!;
const sectionNavigation = document.querySelector<HTMLElement>('#sectionNavigation')!;
const mobileSections = document.querySelector<HTMLSelectElement>('#mobileSections')!;
const breadcrumb = document.querySelector<HTMLElement>('#breadcrumb')!;
const backButton = document.querySelector<HTMLButtonElement>('#backButton')!;

let sections: Section[] = [];
let canonicalStream: HTMLElement;
let currentRoute: PlaceRoute;
const canonicalVisitKey = 'frame-problem-visited';
const priorCanonicalVisit = sessionStorage.getItem(canonicalVisitKey);

function routeKey(route: PlaceRoute): string {
  if (route.kind === 'source') return `source/${route.id}?from=${encodeURIComponent(route.from)}`;
  return `${route.kind}/${route.id}`;
}

function parseRoute(): PlaceRoute {
  const raw = location.hash.slice(1) || 'section/1';
  const [path, query = ''] = raw.split('?');
  const [kind, id] = (path || 'section/1').split('/');
  if (kind === 'claim' && id) return { kind, id };
  if (kind === 'source' && id) {
    const from = new URLSearchParams(query).get('from') || 'section/1';
    return { kind, id, from };
  }
  return { kind: 'section', id: id || '1' };
}

function navigate(route: PlaceRoute): void {
  const nextHash = `#${routeKey(route)}`;
  if (location.hash === nextHash) render(route);
  else location.hash = nextHash;
}

function sectionForNode(node: Element | null): Section {
  const directId = node?.getAttribute('data-in-sec');
  const direct = sections.find((section) => section.id === directId);
  if (direct) return direct;
  let cursor = node?.closest('#stream > *') || node;
  while (cursor) {
    if (cursor.matches('.sechead[data-sec]')) {
      const section = sections.find((item) => item.id === (cursor as HTMLElement).dataset.sec);
      if (section) return section;
    }
    cursor = cursor.previousElementSibling;
  }
  const fallback = sections[0];
  if (!fallback) throw new Error('The canonical essay has no derivable sections.');
  return fallback;
}

function deriveSections(): void {
  const heads = Array.from(canonicalStream.querySelectorAll<HTMLElement>(':scope > .sechead[data-sec]'));
  sections = heads.map((head, index) => {
    const nodes: HTMLElement[] = [];
    let cursor = head.nextElementSibling;
    while (cursor && !cursor.matches('.sechead[data-sec]')) {
      if (cursor instanceof HTMLElement && cursor.dataset.frames?.split(' ').includes('essay')) nodes.push(cursor);
      cursor = cursor.nextElementSibling;
    }
    return {
      id: head.dataset.sec!,
      number: String(index + 1).padStart(2, '0'),
      label: head.querySelector<HTMLElement>('.no')?.textContent?.split('—')[1]?.trim() || 'Section',
      title: head.querySelector('h2')?.textContent?.trim() || `Section ${index + 1}`,
      thesis: head.querySelector<HTMLElement>('.thesis')?.textContent?.trim() || '',
      nodes,
    };
  });
}

function buildNavigation(): void {
  sectionNavigation.replaceChildren();
  mobileSections.replaceChildren();
  for (const section of sections) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'section-link';
    button.dataset.section = section.id;
    button.innerHTML = `<span>${section.number}</span>${section.label}`;
    button.addEventListener('click', () => navigate({ kind: 'section', id: section.id }));
    sectionNavigation.append(button);

    const option = document.createElement('option');
    option.value = section.id;
    option.textContent = `${section.number} — ${section.label}`;
    mobileSections.append(option);
  }
  mobileSections.addEventListener('change', () => navigate({ kind: 'section', id: mobileSections.value }));
}

function cleanClone(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((item) => item.removeAttribute('id'));
  clone.querySelectorAll('.xrow,.sidenote').forEach((item) => item.remove());
  clone.querySelectorAll<HTMLButtonElement>('.chip[data-src]').forEach((chip) => {
    const sourceId = chip.dataset.src!;
    chip.type = 'button';
    chip.setAttribute('aria-label', `Open source: ${chip.textContent?.trim()}`);
    chip.addEventListener('click', () => navigate({ kind: 'source', id: sourceId, from: routeKey(currentRoute) }));
  });
  return clone;
}

function pageHeader(kicker: string, title: string, thesis: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const label = document.createElement('p');
  label.className = 'place-kicker';
  label.textContent = kicker;
  const heading = document.createElement('h1');
  heading.textContent = title;
  const dek = document.createElement('p');
  dek.className = 'place-dek';
  dek.textContent = thesis;
  fragment.append(label, heading, dek);
  return fragment;
}

function relation(kind: string, label: string, route: PlaceRoute): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'relation';
  button.innerHTML = `<small>${kind}</small><span>${label} →</span>`;
  button.addEventListener('click', () => navigate(route));
  return button;
}

function relationsFor(section: Section): HTMLElement {
  const region = document.createElement('aside');
  region.className = 'relations';
  region.innerHTML = '<h2>Follow the argument</h2>';
  const list = document.createElement('div');
  list.className = 'relation-list';

  if (section.id === '2') list.append(relation('Claim', 'Less fixed UI, not less UI', { kind: 'claim', id: 'c3' }));
  if (section.id === '6') list.append(relation('Argument continues', 'Where context lives', { kind: 'section', id: '7' }));
  const crossLink = section.nodes.flatMap((node) => Array.from(node.querySelectorAll<HTMLElement>('[data-goto]')))[0];
  if (crossLink?.dataset.goto) {
    const target = crossLink.dataset.goto.replace('sec-', '');
    list.append(relation('Existing cross-link', crossLink.textContent?.trim() || 'Related section', { kind: 'section', id: target }));
  }
  const source = section.nodes.flatMap((node) => Array.from(node.querySelectorAll<HTMLButtonElement>('.chip[data-src]')))[0];
  if (source?.dataset.src) list.append(relation('Source', source.textContent?.trim() || 'Inspect evidence', { kind: 'source', id: source.dataset.src, from: `section/${section.id}` }));
  const next = sections[Number(section.id)];
  if (!list.children.length && next) list.append(relation('Next place', next.title, { kind: 'section', id: next.id }));
  region.append(list);
  return region;
}

function setBreadcrumb(section: Section, detail?: string): void {
  breadcrumb.replaceChildren();
  const root = document.createElement('button');
  root.type = 'button';
  root.textContent = 'The frame problem';
  root.addEventListener('click', () => navigate({ kind: 'section', id: '1' }));
  const divider = document.createElement('span');
  divider.textContent = '/';
  const sectionCrumb = document.createElement('button');
  sectionCrumb.type = 'button';
  sectionCrumb.textContent = `${section.number} ${section.label}`;
  sectionCrumb.addEventListener('click', () => navigate({ kind: 'section', id: section.id }));
  breadcrumb.append(root, divider, sectionCrumb);
  if (detail) {
    const detailDivider = document.createElement('span');
    detailDivider.textContent = '/';
    const current = document.createElement('span');
    current.className = 'current';
    current.textContent = detail;
    breadcrumb.append(detailDivider, current);
  } else sectionCrumb.className = 'current';
}

function renderSection(section: Section): void {
  place.replaceChildren(pageHeader(`${section.number} — ${section.label}`, section.title, section.thesis));
  const body = document.createElement('div');
  body.className = 'place-body';
  section.nodes.filter((node) => !node.matches('.xrow')).forEach((node) => body.append(cleanClone(node)));
  place.append(body, relationsFor(section));
  setBreadcrumb(section);
}

function renderClaim(id: string): void {
  const source = canonicalStream.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`);
  if (!source) return renderSection(sectionForNode(null));
  const section = sectionForNode(source);
  const title = source.dataset.label || 'Claim';
  place.replaceChildren(pageHeader(`Claim · ${section.number} ${section.label}`, title, 'A directly addressable argument node from the canonical essay.'));
  const body = document.createElement('div');
  body.className = 'place-body';
  const claim = cleanClone(source);
  claim.classList.add('claim-place');
  body.append(claim);
  const related = document.createElement('aside');
  related.className = 'relations';
  related.innerHTML = '<h2>Follow the argument</h2>';
  const list = document.createElement('div');
  list.className = 'relation-list';
  if (id === 'c3') list.append(relation('Picked up in theory', 'Textrahmen', { kind: 'section', id: '6' }));
  list.append(relation('Return to section', section.title, { kind: 'section', id: section.id }));
  related.append(list);
  place.append(body, related);
  setBreadcrumb(section, title);
}

function renderSource(id: string, from: string): void {
  const citation = canonicalStream.querySelector<HTMLButtonElement>(`.chip[data-src="${CSS.escape(id)}"]`);
  const detail = citation?.nextElementSibling;
  const section = sectionForNode(citation?.closest('[data-in-sec]') || citation?.closest('.node') || null);
  const title = citation?.textContent?.trim() || 'Source';
  place.replaceChildren(pageHeader(`Source · subordinate to ${section.number} ${section.label}`, title, 'Inspectable evidence for the current argument place.'));
  if (detail instanceof HTMLElement && detail.classList.contains('source-detail')) {
    const sourceView = detail.cloneNode(true) as HTMLElement;
    sourceView.className = 'source-place';
    place.append(sourceView);
  }
  const related = document.createElement('aside');
  related.className = 'relations';
  related.innerHTML = '<h2>Return with orientation</h2>';
  const list = document.createElement('div');
  list.className = 'relation-list';
  const [kind, targetId] = from.split('/');
  const returnRoute: PlaceRoute = kind === 'claim' && targetId ? { kind: 'claim', id: targetId } : { kind: 'section', id: targetId || section.id };
  list.append(relation('Return', kind === 'claim' ? 'Back to claim' : section.title, returnRoute));
  related.append(list);
  place.append(related);
  setBreadcrumb(section, title);
}

function render(route: PlaceRoute): void {
  currentRoute = route;
  const section = route.kind === 'section'
    ? sections.find((item) => item.id === route.id) || sectionForNode(null)
    : sectionForNode(canonicalStream.querySelector(route.kind === 'claim' ? `[data-id="${CSS.escape(route.id)}"]` : `.chip[data-src="${CSS.escape(route.id)}"]`));
  sectionNavigation.querySelectorAll('.section-link').forEach((item) => item.classList.toggle('active', (item as HTMLElement).dataset.section === section.id));
  mobileSections.value = section.id;
  if (route.kind === 'claim') renderClaim(route.id);
  else if (route.kind === 'source') renderSource(route.id, route.from);
  else renderSection(section);
  backButton.disabled = history.length <= 1;
  place.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

backButton.addEventListener('click', () => history.back());
window.addEventListener('hashchange', () => render(parseRoute()));
sourceFrame.addEventListener('load', () => {
  const sourceDocument = sourceFrame.contentDocument;
  const stream = sourceDocument?.querySelector<HTMLElement>('#stream');
  if (!stream) {
    place.innerHTML = '<p class="loading">The canonical essay could not be loaded.</p>';
    return;
  }
  canonicalStream = stream;
  if (priorCanonicalVisit === null) sessionStorage.removeItem(canonicalVisitKey);
  else sessionStorage.setItem(canonicalVisitKey, priorCanonicalVisit);
  deriveSections();
  buildNavigation();
  render(parseRoute());
});
sourceFrame.src = new URL('../essay.html', location.href).href;
