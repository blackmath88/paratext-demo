type CaseId = 'source' | 'related' | 'supersession';
type Primary = { kind: 'claim' | 'section' | 'source'; id: string };
type Context = { kind: 'claim' | 'section' | 'source'; id: string; relation: string };

const frame = document.querySelector<HTMLIFrameElement>('#canonicalSource')!;
const field = document.querySelector<HTMLElement>('#field')!;
const primaryPlane = document.querySelector<HTMLElement>('#primaryPlane')!;
const secondaryPlane = document.querySelector<HTMLElement>('#secondaryPlane')!;
const locationLabel = document.querySelector<HTMLElement>('#location')!;
const directionControls = document.querySelector<HTMLElement>('#directions')!;
const caseControls = document.querySelector<HTMLElement>('#cases')!;

let stream: HTMLElement;
let currentCase: CaseId = 'source';
let primary: Primary = { kind: 'claim', id: 'c2' };
let context: Context | undefined;
let inspectTrigger: HTMLButtonElement | undefined;
const visitKey = 'frame-problem-visited';
const priorVisit = sessionStorage.getItem(visitKey);

function canonicalNode(selector: string): HTMLElement {
  const node = stream.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Layering study could not derive ${selector}`);
  return node;
}

function sectionHead(id: string): HTMLElement {
  return canonicalNode(`#sec-${CSS.escape(id)}`);
}

function sectionFor(node: Element): HTMLElement {
  const direct = node.getAttribute('data-in-sec');
  if (direct) return sectionHead(direct);
  let cursor: Element | null = node.closest('#stream > *');
  while (cursor && !cursor.matches('.sechead[data-sec]')) cursor = cursor.previousElementSibling;
  return cursor instanceof HTMLElement ? cursor : sectionHead('1');
}

function sectionNodes(id: string): HTMLElement[] {
  const nodes: HTMLElement[] = [];
  let cursor = sectionHead(id).nextElementSibling;
  while (cursor && !cursor.matches('.sechead')) {
    if (cursor instanceof HTMLElement && cursor.dataset.frames?.split(' ').includes('essay')) nodes.push(cursor);
    cursor = cursor.nextElementSibling;
  }
  return nodes;
}

function cloneContent(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((item) => item.removeAttribute('id'));
  clone.querySelectorAll('.sidenote,.source-detail,.xrow').forEach((item) => item.remove());
  clone.querySelectorAll('button').forEach((button) => { button.disabled = true; button.removeAttribute('aria-expanded'); });
  return clone;
}

function primaryTitle(item: Primary): { kicker: string; title: string; thesis: string; content: HTMLElement } {
  if (item.kind === 'claim') {
    const node = canonicalNode(`[data-id="${CSS.escape(item.id)}"]`);
    const head = sectionFor(node);
    return {
      kicker: `${node.dataset.type || 'claim'} · ${item.id} · ${head.querySelector('.no')?.textContent?.trim() || ''}`,
      title: node.dataset.label || item.id,
      thesis: head.querySelector<HTMLElement>('.thesis')?.textContent?.trim() || '',
      content: cloneContent(node),
    };
  }
  if (item.kind === 'section') {
    const head = sectionHead(item.id);
    const content = document.createElement('div');
    sectionNodes(item.id).filter((node) => !node.matches('.piece')).slice(0, 3).forEach((node) => content.append(cloneContent(node)));
    return {
      kicker: head.querySelector('.no')?.textContent?.trim() || `Section ${item.id}`,
      title: head.querySelector('h2')?.textContent?.trim() || `Section ${item.id}`,
      thesis: head.querySelector<HTMLElement>('.thesis')?.textContent?.trim() || '',
      content,
    };
  }
  const citation = canonicalNode(`.chip[data-src="${CSS.escape(item.id)}"]`);
  const detail = citation.nextElementSibling as HTMLElement;
  const content = cloneContent(detail);
  content.classList.remove('source-detail');
  content.classList.add('promoted-source');
  return { kicker: 'Source', title: citation.textContent?.trim() || item.id, thesis: 'Evidence promoted into the primary place.', content };
}

function deriveContext(caseId: CaseId): Context {
  if (caseId === 'source') {
    const claim = canonicalNode('[data-id="c2"]');
    const citation = claim.querySelector<HTMLElement>('.chip[data-src]')!;
    return { kind: 'source', id: citation.dataset.src!, relation: 'Supporting source' };
  }
  if (caseId === 'related') {
    const claim = canonicalNode('[data-id="c3"]');
    let cursor = claim.nextElementSibling;
    while (cursor && !cursor.querySelector('[data-goto]')) cursor = cursor.nextElementSibling;
    const goto = cursor?.querySelector<HTMLElement>('[data-goto]')?.dataset.goto;
    if (!goto) throw new Error('The authored c3 cross-reference is missing.');
    return { kind: 'section', id: goto.replace('sec-', ''), relation: 'Authored cross-reference' };
  }
  const current = canonicalNode('[data-id="c13"]');
  const prior = canonicalNode(`[data-superseded="${CSS.escape(current.dataset.id!)}"]`);
  return { kind: 'claim', id: prior.dataset.id!, relation: 'Superseded formulation' };
}

function contextContent(item: Context): { title: string; content: HTMLElement } {
  if (item.kind === 'source') {
    const citation = canonicalNode(`.chip[data-src="${CSS.escape(item.id)}"]`);
    const detail = citation.nextElementSibling as HTMLElement;
    return { title: citation.textContent?.trim() || item.id, content: cloneContent(detail) };
  }
  if (item.kind === 'claim') {
    const node = canonicalNode(`[data-id="${CSS.escape(item.id)}"]`);
    return { title: node.dataset.label || item.id, content: cloneContent(node) };
  }
  const head = sectionHead(item.id);
  const content = document.createElement('div');
  sectionNodes(item.id).filter((node) => node.dataset.id).slice(0, 2).forEach((node) => content.append(cloneContent(node)));
  return { title: head.querySelector('h2')?.textContent?.trim() || `Section ${item.id}`, content };
}

function closeContext(restoreFocus = true): void {
  context = undefined;
  field.classList.remove('has-depth');
  secondaryPlane.hidden = true;
  secondaryPlane.replaceChildren();
  updateLocation();
  updateHash();
  if (restoreFocus) inspectTrigger?.focus();
}

function inspect(): void {
  context = deriveContext(currentCase);
  const derived = contextContent(context);
  secondaryPlane.replaceChildren();
  const depth = document.createElement('p'); depth.className = 'depth'; depth.textContent = `Secondary depth · ${context.relation}`;
  const heading = document.createElement('h2'); heading.textContent = derived.title;
  const content = document.createElement('div'); content.className = 'secondary-content'; content.append(derived.content);
  const actions = document.createElement('div'); actions.className = 'secondary-actions';
  const promote = document.createElement('button'); promote.type = 'button'; promote.textContent = 'Navigate: make primary'; promote.setAttribute('aria-label', `Navigate to ${derived.title} as the primary place`);
  promote.addEventListener('click', () => { primary = { kind: context!.kind, id: context!.id }; closeContext(false); renderPrimary(); primaryPlane.focus(); });
  const close = document.createElement('button'); close.type = 'button'; close.className = 'close'; close.textContent = 'Close context'; close.setAttribute('aria-label', 'Close inspected context and retain the primary place'); close.addEventListener('click', () => closeContext());
  actions.append(promote, close); secondaryPlane.append(depth, heading, content, actions);
  secondaryPlane.hidden = false; field.classList.add('has-depth'); updateHash(); secondaryPlane.focus();
  updateLocation();
}

function updateLocation(): void {
  const title = primaryTitle(primary).title;
  locationLabel.innerHTML = `Primary place · <strong>${title}</strong>${context ? ' · secondary depth open' : ''}`;
}

function renderPrimary(): void {
  const derived = primaryTitle(primary);
  primaryPlane.replaceChildren();
  const kicker = document.createElement('p'); kicker.className = 'eyebrow'; kicker.textContent = derived.kicker;
  const heading = document.createElement('h1'); heading.textContent = derived.title;
  const thesis = document.createElement('p'); thesis.className = 'section-thesis'; thesis.textContent = derived.thesis;
  const content = document.createElement('div'); content.className = 'primary-content'; content.append(derived.content);
  const actions = document.createElement('div'); actions.className = 'inspect-actions';
  const baseId = currentCase === 'source' ? 'c2' : currentCase === 'related' ? 'c3' : 'c13';
  if (primary.kind === 'claim' && primary.id === baseId) {
    inspectTrigger = document.createElement('button'); inspectTrigger.type = 'button'; inspectTrigger.textContent = 'Inspect related context'; inspectTrigger.setAttribute('aria-label', `Inspect context related to ${derived.title} without leaving this place`); inspectTrigger.addEventListener('click', inspect);
    const hint = document.createElement('span'); hint.textContent = 'Primary place remains fixed';
    actions.append(inspectTrigger, hint);
  } else {
    const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Return to test origin'; reset.addEventListener('click', () => resetCase(currentCase)); actions.append(reset);
  }
  primaryPlane.append(kicker, heading, thesis, content, actions);
  updateLocation();
  updateHash();
}

function resetCase(caseId: CaseId): void {
  closeContext(false); currentCase = caseId;
  primary = caseId === 'source' ? { kind: 'claim', id: 'c2' } : caseId === 'related' ? { kind: 'claim', id: 'c3' } : { kind: 'claim', id: 'c13' };
  caseControls.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String((button as HTMLElement).dataset.case === caseId)));
  renderPrimary(); primaryPlane.focus();
}

function updateHash(): void {
  if (!stream) return;
  const params = new URLSearchParams({ case: currentCase, primary: `${primary.kind}/${primary.id}` });
  if (context) params.set('inspect', `${context.kind}/${context.id}`);
  history.replaceState(null, '', `#${params}`);
}

directionControls.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-direction]'); if (!button) return;
  document.documentElement.dataset.direction = button.dataset.direction;
  directionControls.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
});
caseControls.addEventListener('click', (event) => { const button = (event.target as Element).closest<HTMLButtonElement>('button[data-case]'); if (button) resetCase(button.dataset.case as CaseId); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && context) { event.preventDefault(); closeContext(); } });

frame.addEventListener('load', () => {
  const source = frame.contentDocument?.querySelector<HTMLElement>('#stream');
  if (!source) return;
  stream = source;
  if (priorVisit === null) sessionStorage.removeItem(visitKey); else sessionStorage.setItem(visitKey, priorVisit);
  const params = new URLSearchParams(location.hash.slice(1));
  const restoredCase = params.get('case');
  if (restoredCase === 'source' || restoredCase === 'related' || restoredCase === 'supersession') currentCase = restoredCase;
  const [kind, id] = (params.get('primary') || '').split('/');
  if ((kind === 'claim' || kind === 'section' || kind === 'source') && id) primary = { kind, id };
  caseControls.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String((button as HTMLElement).dataset.case === currentCase)));
  renderPrimary();
  if (params.has('inspect')) inspect();
});
frame.src = new URL('../essay.html', location.href).href;
