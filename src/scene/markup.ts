/**
 * SVG element builders.
 *
 * Pure construction only — these functions create nodes and return them. They
 * never animate, never read layout, never touch the timeline. Everything the
 * animation needs to grab later is given an id here.
 */

import { BODY_LINES, GLOSSES, INTERLINEAR, PRINT, UNDERLINES } from '../data/text';
import { OPERATIONS } from '../data/operations';
import { arrowPath, bracePath, noiseAt, wobblyLine, wobblyRect } from './geometry';

export const NS = 'http://www.w3.org/2000/svg';

/** Authoring coordinate space. All act choreography is written in this box. */
export const VIEW = { w: 1440, h: 900 };

/** The manuscript leaf in its Act 1 position. */
export const LEAF = { x: 470, y: 100, w: 500, h: 700 };

/** The leaf after reception has forced its frame outward. */
export const ADMITTED_LEAF = { x: 320, y: 82, w: 800, h: 736 };

export const COMPOSED_LEAF = { x: 350, y: 70, w: 740, h: 760 };
export const APP_FRAME = { x: 250, y: 62, w: 940, h: 776 };

/** Body text metrics. `lh` is the manuscript leading; print will tighten it. */
export const TEXT = { x: 506, top: 172, lh: 38, width: 428 };

export const SEED = 20260814;

export function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  children: SVGElement[] = [],
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  for (const c of children) node.appendChild(c);
  return node;
}

/** Baseline y of a body line in the manuscript state. */
export function lineY(i: number): number {
  return TEXT.top + i * TEXT.lh;
}

/**
 * The printed setting: tighter leading, a systematic measure, and paragraph
 * breaks where the manuscript had none. Act 3 tweens between `lineY` and
 * `printLineY` — the words never change, only their setting.
 */
export const PRINT_TEXT = { x: 512, top: 262, lh: 30, width: 416, paragraphs: [0, 5, 10] };

export function printLineY(i: number): number {
  let y = PRINT_TEXT.top + i * PRINT_TEXT.lh;
  if (i >= 5) y += 12;
  if (i >= 10) y += 12;
  return y;
}

export function printLineX(i: number): number {
  return PRINT_TEXT.x + (PRINT_TEXT.paragraphs.includes(i) ? 20 : 0);
}

// ---------------------------------------------------------------------------
// defs
// ---------------------------------------------------------------------------

/**
 * Two filters for the whole piece. Paper grain is applied once, to the leaf.
 * Anything more would cost more than it is worth — the hand-drawn geometry,
 * not the filter stack, is what makes this read as illustration.
 */
export function buildDefs(): SVGDefsElement {
  const grain = el('filter', {
    id: 'f-grain',
    x: '-4%',
    y: '-3%',
    width: '108%',
    height: '106%',
    filterUnits: 'objectBoundingBox',
  });
  grain.appendChild(
    el('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.9',
      numOctaves: '3',
      seed: '7',
      result: 'noise',
    }),
  );
  grain.appendChild(
    el('feColorMatrix', {
      in: 'noise',
      type: 'saturate',
      values: '0',
      result: 'desat',
    }),
  );
  grain.appendChild(
    el('feComponentTransfer', { in: 'desat', result: 'speckle' }, [
      el('feFuncA', { type: 'linear', slope: '0.055' }),
    ]),
  );
  grain.appendChild(el('feComposite', { in: 'speckle', in2: 'SourceGraphic', operator: 'atop' }));

  // A very slight edge softening so ink does not look vector-crisp.
  const ink = el('filter', { id: 'f-ink', x: '-8%', y: '-8%', width: '116%', height: '116%' });
  ink.appendChild(el('feGaussianBlur', { stdDeviation: '0.28' }));

  const vignette = el('radialGradient', { id: 'g-vignette', cx: '50%', cy: '46%', r: '72%' });
  vignette.appendChild(el('stop', { offset: '0%', 'stop-color': '#0d0f12', 'stop-opacity': '0' }));
  vignette.appendChild(el('stop', { offset: '68%', 'stop-color': '#08090b', 'stop-opacity': '0.45' }));
  vignette.appendChild(el('stop', { offset: '100%', 'stop-color': '#050607', 'stop-opacity': '0.92' }));

  const chatClip = el('clipPath', { id: 'clip-chat' });
  chatClip.appendChild(el('rect', { id: 'chat-clip-rect', x: 390, y: 150, width: 660, height: 590 }));

  return el('defs', {}, [grain, ink, vignette, chatClip]) as SVGDefsElement;
}

// ---------------------------------------------------------------------------
// field — the ground the page sits on
// ---------------------------------------------------------------------------

export function buildField(): SVGGElement {
  const g = el('g', { id: 'field' });
  g.appendChild(el('rect', { id: 'field-base', x: 0, y: 0, width: VIEW.w, height: VIEW.h, fill: '#0b0d10' }));

  const screenGrid = el('g', { id: 'screen-grid', opacity: '0' });
  for (let x = 0; x <= VIEW.w; x += 48) {
    screenGrid.appendChild(el('path', { class: 'screen-grid-line', d: `M ${x} 0 V ${VIEW.h}` }));
  }
  for (let y = 0; y <= VIEW.h; y += 48) {
    screenGrid.appendChild(el('path', { class: 'screen-grid-line', d: `M 0 ${y} H ${VIEW.w}` }));
  }
  g.appendChild(screenGrid);

  // Sparse dust. Deterministic, so it does not shimmer on re-render.
  const dust = el('g', { id: 'dust', opacity: '0.5' });
  for (let i = 0; i < 26; i++) {
    const x = (noiseAt(SEED + 31, i) * 0.5 + 0.5) * VIEW.w;
    const y = (noiseAt(SEED + 67, i) * 0.5 + 0.5) * VIEW.h;
    const r = 0.5 + (noiseAt(SEED + 101, i) * 0.5 + 0.5) * 1.1;
    dust.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(2), fill: '#c9bda4', opacity: '0.16' }));
  }
  g.appendChild(dust);
  g.appendChild(el('rect', { id: 'vignette', x: 0, y: 0, width: VIEW.w, height: VIEW.h, fill: 'url(#g-vignette)' }));
  return g as SVGGElement;
}

// ---------------------------------------------------------------------------
// the protagonist
// ---------------------------------------------------------------------------

export function buildLeaf(): SVGGElement {
  const g = el('g', { id: 'leaf-group' });

  // A faint second leaf behind, so Act 1 reads as a codex rather than a sheet.
  // It withdraws during the move to print, where a page is a single leaf.
  const verso = el('path', {
    id: 'leaf-verso',
    d: wobblyRect(LEAF.x - 26, LEAF.y + 14, LEAF.w, LEAF.h - 22, 1, SEED + 400),
    fill: '#d9cdb4',
    opacity: '0.34',
  });

  const leaf = el('path', {
    id: 'leaf',
    d: wobblyRect(LEAF.x, LEAF.y, LEAF.w, LEAF.h, 1, SEED),
    fill: '#efe6d2',
    filter: 'url(#f-grain)',
  });

  // The edge is drawn separately so it can thin into a printed trim later.
  const edge = el('path', {
    id: 'leaf-edge',
    d: wobblyRect(LEAF.x, LEAF.y, LEAF.w, LEAF.h, 1, SEED),
    fill: 'none',
    stroke: '#2b2419',
    'stroke-width': '1.1',
    opacity: '0.28',
  });

  g.appendChild(verso);
  g.appendChild(leaf);
  g.appendChild(edge);
  return g as SVGGElement;
}

export function buildBody(): SVGGElement {
  const g = el('g', { id: 'body' });

  // Rubricated initial, as the storyboard has it.
  const initial = el('text', {
    id: 'initial',
    x: TEXT.x,
    y: lineY(0) + 4,
    class: 'ms-initial',
  });
  initial.textContent = 'Q';
  g.appendChild(initial);

  BODY_LINES.forEach((line, i) => {
    // A scribe does not hit the same left edge twice. Act 3 tweens this jitter
    // out, which is what makes "spacing becomes systematic" legible.
    const jx = noiseAt(SEED + 313, i) * 2.4;
    const jy = noiseAt(SEED + 719, i) * 1.3;
    const t = el('text', {
      class: 'ms-line',
      'data-line': i,
      x: (i === 0 ? TEXT.x + 34 : TEXT.x) + jx,
      y: lineY(i) + jy,
    });
    // The first line loses its Q to the initial.
    t.textContent = i === 0 ? line.slice(1) : line;
    g.appendChild(t);
  });

  return g as SVGGElement;
}

export function buildRules(): SVGGElement {
  const g = el('g', { id: 'rules' });
  for (const u of UNDERLINES) {
    const y = lineY(u.lineIndex) + 7;
    const x1 = TEXT.x + TEXT.width * u.from;
    const x2 = TEXT.x + TEXT.width * u.to;
    const p = el('path', {
      id: u.id,
      class: 'ms-rule',
      'data-x1': x1,
      'data-x2': x2,
      'data-y': y,
      d: wobblyLine(x1, y, x2, y, 1, SEED + u.lineIndex),
      fill: 'none',
    });
    g.appendChild(p);
  }
  return g as SVGGElement;
}

export function buildGlosses(): SVGGElement {
  const g = el('g', { id: 'glosses' });
  for (const gloss of GLOSSES) {
    const wrap = el('g', {
      id: `gloss-${gloss.id}`,
      class: `gloss gloss--${gloss.accent}`,
      'data-plane': gloss.plane,
      transform: `rotate(${gloss.tilt} ${gloss.x} ${gloss.y})`,
    });
    gloss.text.forEach((line, i) => {
      const t = el('text', {
        class: 'gloss-line',
        x: gloss.x + noiseAt(SEED + 13, i) * 1.8,
        y: gloss.y + i * 26,
        'text-anchor': gloss.anchor,
      });
      t.textContent = line;
      wrap.appendChild(t);
    });
    g.appendChild(wrap);
  }

  for (const il of INTERLINEAR) {
    const t = el('text', {
      id: il.id,
      class: `interlinear gloss--${il.accent}`,
      x: TEXT.x + il.dx,
      y: lineY(il.lineIndex) - 11,
    });
    t.textContent = il.text;
    g.appendChild(t);
  }

  return g as SVGGElement;
}

/**
 * Reference marks: the arrows, brace and asterisk that tie a note to a line.
 * These are the most "hand" of the marks, so they carry the most wobble.
 */
export function buildMarks(): SVGGElement {
  const g = el('g', { id: 'marks' });

  const mark = (id: string, d: string, accent: string) =>
    el('path', { id, class: `mark mark--${accent}`, d, fill: 'none' });

  g.appendChild(mark('mark-cf', arrowPath(444, 268, 496, 288, 1, SEED + 5), 'rose'));
  g.appendChild(mark('mark-huc', arrowPath(996, 392, 946, 372, 1, SEED + 6), 'amber'));
  g.appendChild(mark('mark-idest', arrowPath(432, 556, 492, 540, 1, SEED + 7), 'purple'));
  g.appendChild(mark('mark-bene', arrowPath(1000, 578, 952, 566, 1, SEED + 8), 'rose'));
  g.appendChild(mark('mark-brace', bracePath(978, lineY(5) - 14, lineY(8) + 6, 14, SEED + 9), 'ink'));
  g.appendChild(mark('mark-contra', arrowPath(440, 360, 494, 372, 1, SEED + 10), 'rose'));

  // A drawn asterisk — six strokes from a centre, none of them even.
  const cx = 1036;
  const cy = 618;
  let star = '';
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3 + noiseAt(SEED + 21, i) * 0.2;
    const r = 9 + noiseAt(SEED + 22, i) * 1.6;
    star += ` M ${(cx - Math.cos(a) * r).toFixed(1)} ${(cy - Math.sin(a) * r).toFixed(1)} L ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  }
  g.appendChild(mark('mark-star', star.trim(), 'rose'));

  return g as SVGGElement;
}

/**
 * Print apparatus. Built in place but not yet visible — Act 3 reveals it, and
 * in several cases reveals it *by moving a handwritten element into it*.
 */
export function buildPrint(): SVGGElement {
  const g = el('g', { id: 'print', opacity: '0' });

  const title = el('text', { id: 'print-title', class: 'pr-title', x: 720, y: 176, 'text-anchor': 'middle' });
  title.textContent = PRINT.title;

  const caput = el('text', { id: 'print-caput', class: 'pr-caput', x: 720, y: 208, 'text-anchor': 'middle' });
  const caputBold = el('tspan', { class: 'pr-caput-num' });
  caputBold.textContent = `${PRINT.caput} `;
  const caputRub = el('tspan', { class: 'pr-caput-rubric' });
  caputRub.textContent = PRINT.caputRubric;
  caput.appendChild(caputBold);
  caput.appendChild(caputRub);

  const folio = el('text', { id: 'print-folio', class: 'pr-folio', x: 934, y: 176, 'text-anchor': 'end' });
  folio.textContent = PRINT.folio;

  g.appendChild(title);
  g.appendChild(caput);
  g.appendChild(folio);

  const nums = el('g', { id: 'print-linenumbers' });
  for (const ln of PRINT.lineNumbers) {
    const t = el('text', { class: 'pr-linenum', x: 486, y: 0, 'data-line': ln.lineIndex, 'text-anchor': 'end' });
    t.textContent = ln.n;
    nums.appendChild(t);
  }
  g.appendChild(nums);

  // There is no separate footnote rule element on purpose: in Act 3 a reader's
  // underline migrates down the page and becomes it.
  const notes = el('g', { id: 'print-footnotes' });
  PRINT.footnotes.forEach((fn, i) => {
    const t = el('text', { class: 'pr-note', id: `print-note-${i}`, x: PRINT_TEXT.x, y: 726 + i * 22 });
    const m = el('tspan', { class: 'pr-note-marker', dy: '-4' });
    m.textContent = fn.marker;
    const a = el('tspan', { dy: '4' });
    a.textContent = ` ${fn.text}`;
    const it = el('tspan', { 'font-style': 'italic' });
    it.textContent = fn.italic;
    const tail = el('tspan', {});
    tail.textContent = fn.tail;
    t.appendChild(m);
    t.appendChild(a);
    t.appendChild(it);
    t.appendChild(tail);
    notes.appendChild(t);
  });
  g.appendChild(notes);

  return g as SVGGElement;
}

/** Latent editorial construction marks. They explain composition, then recede. */
export function buildEditorial(): SVGGElement {
  const g = el('g', { id: 'editorial', opacity: '0' });
  const grid = el('g', { id: 'editorial-grid' });
  const lines = [
    [410, 118, 410, 782], [790, 118, 790, 782], [1040, 118, 1040, 782],
    [382, 142, 1058, 142], [382, 218, 1058, 218], [382, 690, 1058, 690],
  ];
  lines.forEach(([x1, y1, x2, y2], i) => {
    grid.appendChild(el('path', { id: `editorial-grid-${i}`, class: 'editorial-grid-line', d: `M ${x1} ${y1} L ${x2} ${y2}` }));
  });
  g.appendChild(grid);

  const sourceLabel = el('text', { id: 'editorial-source-label', class: 'editorial-label', x: 820, y: 244 });
  sourceLabel.textContent = 'SOURCES / APPARATUS';
  const bodyLabel = el('text', { id: 'editorial-body-label', class: 'editorial-label', x: 430, y: 244 });
  bodyLabel.textContent = 'ARGUMENT';
  g.appendChild(bodyLabel);
  g.appendChild(sourceLabel);
  return g as SVGGElement;
}

/** Restrained software furniture; the historical page remains visible within it. */
export function buildApplication(): SVGGElement {
  const g = el('g', { id: 'application', opacity: '0' });
  g.appendChild(el('path', { id: 'app-top-rule', class: 'app-rule', d: 'M 250 132 L 1190 132' }));
  g.appendChild(el('path', { id: 'app-nav-rule', class: 'app-rule', d: 'M 430 132 L 430 838' }));

  const label = (id: string, text: string, x: number, y: number, className = 'app-label') => {
    const node = el('text', { id, class: className, x, y });
    node.textContent = text;
    g.appendChild(node);
  };

  label('app-brand', 'PARATEXT / WORKSPACE', 278, 104, 'app-brand');
  label('app-search', 'Search claims, sources, status…', 780, 104, 'app-search');
  label('app-nav-section', 'ARGUMENT', 278, 174);
  label('app-nav-claims', 'Claims', 296, 210, 'app-nav-item app-nav-item--active');
  label('app-nav-sources', 'Sources', 296, 246, 'app-nav-item');
  label('app-nav-decisions', 'Decisions', 296, 282, 'app-nav-item');
  label('app-nav-open', 'Open questions', 296, 318, 'app-nav-item');
  label('app-content-label', 'CLAIMS / CURRENT ORDER', 466, 174);
  label('app-inspector-label', 'INSPECTOR', 952, 174);

  const recordOps = OPERATIONS.filter((op) => op.kind === 'claim').slice(0, 3);
  recordOps.forEach((op, i) => {
    const y = 224 + i * 154;
    const row = el('g', { class: 'app-record', id: `app-record-${op.id}` });
    row.appendChild(el('path', { class: 'app-record-rule', d: `M 466 ${y + 112} L 916 ${y + 112}` }));
    const kind = el('text', { class: 'app-record-kind', x: 466, y });
    kind.textContent = `CLAIM 0${i + 1}`;
    const status = el('text', { class: 'app-record-status', x: 916, y, 'text-anchor': 'end' });
    status.textContent = i === 2 ? 'DRAFT' : 'CURRENT';
    row.appendChild(kind);
    row.appendChild(status);
    g.appendChild(row);
  });

  label('app-meta-type', 'TYPE', 952, 224);
  label('app-meta-type-value', 'Claim', 952, 248, 'app-meta-value');
  label('app-meta-status', 'STATUS', 952, 294);
  label('app-meta-status-value', 'Current', 952, 318, 'app-meta-value');
  label('app-meta-source', 'SOURCE', 952, 364);
  label('app-meta-source-value', 'Dembeck / Genette', 952, 388, 'app-meta-value');
  label('app-meta-section', 'SECTION', 952, 434);
  label('app-meta-section-value', 'Framing', 952, 458, 'app-meta-value');

  const missing = el('g', { id: 'app-missing-reason' });
  const missingLabel = el('text', { class: 'app-missing-label', x: 952, y: 536 });
  missingLabel.textContent = 'REASON / CONTEXT';
  const missingLine = el('path', { class: 'app-missing-line', d: 'M 952 566 L 1148 566' });
  const missingValue = el('text', { class: 'app-missing-value', x: 952, y: 594 });
  missingValue.textContent = 'No relation in schema';
  missing.appendChild(missingLabel);
  missing.appendChild(missingLine);
  missing.appendChild(missingValue);
  g.appendChild(missing);

  label('app-history-label', 'HISTORY', 952, 664);
  label('app-history-old', 'Superseded · 12 Aug', 952, 694, 'app-history-item');
  label('app-history-current', 'Current · 14 Aug', 952, 726, 'app-history-item');
  return g as SVGGElement;
}

export type WindowGeometry = { id: string; title: string; x: number; y: number; w: number; h: number };

export const FRAGMENT_WINDOWS: WindowGeometry[] = [
  { id: 'memo', title: 'VOICE MEMO', x: 110, y: 96, w: 350, h: 220 },
  { id: 'research', title: 'RESEARCH', x: 545, y: 68, w: 350, h: 252 },
  { id: 'draft', title: 'DRAFT', x: 980, y: 112, w: 330, h: 220 },
  { id: 'sources', title: 'PDF / SOURCES', x: 146, y: 500, w: 326, h: 214 },
  { id: 'chat', title: 'CHAT', x: 548, y: 438, w: 348, h: 264 },
  { id: 'files', title: 'FILES', x: 970, y: 502, w: 340, h: 210 },
];

/** Semantic tool ownership for Act 06. Never derive this from array order. */
export const FRAGMENT_ASSIGNMENTS: Record<string, { window: string; slot: number }> = {
  'q-frame': { window: 'memo', slot: 0 },
  'q-source': { window: 'memo', slot: 1 },
  'src-dembeck': { window: 'research', slot: 0 },
  'src-genette': { window: 'research', slot: 1 },
  'artifact-print': { window: 'sources', slot: 0 },
  'claim-outside': { window: 'sources', slot: 1 },
  'claim-presentation': { window: 'draft', slot: 0 },
  'artifact-essay': { window: 'draft', slot: 1 },
  'decision-admit': { window: 'chat', slot: 0 },
  'decision-grid': { window: 'chat', slot: 1 },
  'decision-reason': { window: 'chat', slot: 2 },
  'open-reason': { window: 'chat', slot: 3 },
  'claim-schema': { window: 'files', slot: 0 },
  'tool-records': { window: 'files', slot: 1 },
  'superseded-history': { window: 'files', slot: 2 },
  'claim-context': { window: 'files', slot: 3 },
};

export function fragmentPlacement(operationId: string): { x: number; y: number } {
  const assignment = FRAGMENT_ASSIGNMENTS[operationId] ?? { window: 'files', slot: 0 };
  const win = FRAGMENT_WINDOWS.find((candidate) => candidate.id === assignment.window) ?? FRAGMENT_WINDOWS[0];
  if (!win) return { x: 130, y: 170 };
  return { x: win.x + 20, y: win.y + 72 + assignment.slot * 43 };
}

export function framePath(x: number, y: number, w: number, h: number): string {
  return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
}

/** Six competent frames, initially coincident with the single application. */
export function buildFragments(): SVGGElement {
  const g = el('g', { id: 'fragments', opacity: '0' });
  for (const win of FRAGMENT_WINDOWS) {
    const group = el('g', { id: `fragment-${win.id}`, class: 'fragment-window', 'data-window': win.id });
    group.appendChild(el('path', {
      class: 'fragment-window-frame',
      d: framePath(APP_FRAME.x, APP_FRAME.y, APP_FRAME.w, APP_FRAME.h),
      'data-target': framePath(win.x, win.y, win.w, win.h),
    }));
    group.appendChild(el('path', { class: 'fragment-window-rule', d: `M ${win.x} ${win.y + 34} H ${win.x + win.w}` }));
    const title = el('text', { class: 'fragment-window-title', x: win.x + 18, y: win.y + 23 });
    title.textContent = win.title;
    group.appendChild(title);
    g.appendChild(group);
  }
  const relations = el('g', { id: 'fragment-relations' });
  const relationPairs = [
    ['q-frame', 'src-dembeck'],
    ['claim-outside', 'decision-admit'],
    ['decision-reason', 'artifact-essay'],
    ['q-source', 'claim-context'],
  ];
  relationPairs.forEach(([fromId, toId]) => {
    const from = fragmentPlacement(fromId ?? '');
    const to = fragmentPlacement(toId ?? '');
    const bend = (from.x + to.x) / 2;
    relations.appendChild(el('path', {
      class: 'fragment-relation',
      'data-from': fromId ?? '',
      'data-to': toId ?? '',
      d: `M ${from.x + 4} ${from.y - 4} C ${bend} ${from.y - 4} ${bend} ${to.y - 4} ${to.x + 4} ${to.y - 4}`,
    }));
  });
  g.appendChild(relations);
  return g as SVGGElement;
}

/** Stable work identities. Later acts only change these groups' arrangements. */
export function buildOperations(): SVGGElement {
  const g = el('g', { id: 'operations', opacity: '0' });
  OPERATIONS.forEach((operation, i) => {
    const x = 474 + (i % 2) * 224;
    const y = 262 + Math.floor(i / 2) * 47;
    const item = el('g', {
      id: `operation-${operation.id}`,
      class: `operation operation--${operation.kind} operation--role-${operation.role ?? 'assistant'}`,
      'data-operation': operation.id,
      'data-kind': operation.kind,
      'data-role': operation.role ?? 'assistant',
      'data-origin-x': x,
      'data-origin-y': y,
    });
    item.appendChild(el('circle', { class: 'operation-mark', cx: x, cy: y - 4, r: 4 }));
    const kind = el('text', { class: 'operation-kind', x: x + 13, y: y - 12 });
    kind.textContent = operation.kind.toUpperCase();
    const text = el('text', { class: 'operation-label', x: x + 13, y: y + 7 });
    text.textContent = operation.label;
    item.appendChild(kind);
    item.appendChild(text);
    g.appendChild(item);
  });
  return g as SVGGElement;
}

/** Furniture for the apparent relief of conversation beside its artifact. */
export function buildConversation(): SVGGElement {
  const g = el('g', { id: 'conversation', opacity: '0' });
  g.appendChild(el('path', { id: 'conversation-top', class: 'conversation-rule', d: 'M 160 120 H 1280' }));
  g.appendChild(el('path', { id: 'conversation-divider', class: 'conversation-rule', d: 'M 680 120 V 830' }));
  const left = el('text', { class: 'conversation-heading', x: 190, y: 100 });
  left.textContent = 'CONVERSATION / OPERATIONS';
  const right = el('text', { class: 'conversation-heading', x: 720, y: 100 });
  right.textContent = 'CURRENT ARTIFACT';
  g.appendChild(left);
  g.appendChild(right);

  const supersession = el('g', { id: 'conversation-supersession' });
  supersession.appendChild(el('path', { class: 'conversation-problem', d: 'M 630 516 h 18 v 70 h -18' }));
  const superLabel = el('text', { class: 'conversation-problem-label', x: 620, y: 610, 'text-anchor': 'end' });
  superLabel.textContent = 'same chronological weight';
  supersession.appendChild(superLabel);
  g.appendChild(supersession);

  const orphan = el('g', { id: 'conversation-orphan' });
  orphan.appendChild(el('path', { class: 'conversation-orphan-line', d: 'M 650 700 C 676 700 684 700 708 700' }));
  const orphanLabel = el('text', { class: 'conversation-problem-label', x: 720, y: 724 });
  orphanLabel.textContent = 'context stops at the boundary';
  orphan.appendChild(orphanLabel);
  g.appendChild(orphan);
  return g as SVGGElement;
}

/** Context field and projection furniture for the final inversion. */
export function buildReframe(): SVGGElement {
  const g = el('g', { id: 'reframe', opacity: '0' });
  const overview = el('g', { id: 'reframe-overview' });
  const clusterLabel = (text: string, x: number, y: number) => {
    const label = el('text', { class: 'reframe-cluster-label', x, y });
    label.textContent = text;
    overview.appendChild(label);
  };
  clusterLabel('FRAME', 180, 158);
  clusterLabel('PARATEXT', 180, 358);
  clusterLabel('COMPOSITION', 500, 158);
  clusterLabel('APPLICATION', 500, 358);
  clusterLabel('CONTEXT', 790, 158);
  clusterLabel('ARTIFACT', 790, 358);

  const relations = el('g', { id: 'reframe-relations' });
  relations.appendChild(el('path', { class: 'reframe-relation reframe-relation--supersedes', d: 'M 504 478 C 470 500 470 522 504 524' }));
  relations.appendChild(el('path', { class: 'reframe-relation', d: 'M 184 232 C 340 152 420 152 504 186' }));
  relations.appendChild(el('path', { class: 'reframe-relation', d: 'M 794 232 C 920 270 960 360 1032 410' }));
  overview.appendChild(relations);

  const projectionBranch = el('g', { id: 'projection-branches' });
  projectionBranch.appendChild(el('path', { class: 'projection-trunk', d: 'M 930 470 H 1000 M 1000 202 V 622' }));
  const projections = [
    { id: 'essay', label: 'ESSAY', y: 202 },
    { id: 'thread', label: 'THREAD', y: 342 },
    { id: 'structure', label: 'STRUCTURE', y: 482 },
    { id: 'spec', label: 'SPEC', y: 622 },
  ];
  projections.forEach((projection) => {
    const port = el('g', { class: 'projection-port', 'data-frame': projection.id });
    port.appendChild(el('path', { class: 'projection-port-line', d: `M 1000 ${projection.y} H 1220` }));
    const name = el('text', { class: 'projection-port-label', x: 1030, y: projection.y - 12 });
    name.textContent = projection.label;
    const note = el('text', { class: 'projection-port-note', x: 1030, y: projection.y + 18 });
    note.textContent = 'same operations / different unity';
    port.appendChild(name);
    port.appendChild(note);
    projectionBranch.appendChild(port);
  });
  overview.appendChild(projectionBranch);
  g.appendChild(overview);

  const furniture = el('g', { id: 'frame-furniture' });
  const frameGroup = (id: string, labels: Array<[string, number, number]>) => {
    const group = el('g', { class: 'frame-layout-furniture', 'data-frame': id, opacity: '0' });
    labels.forEach(([text, x, y]) => {
      const label = el('text', { class: 'frame-layout-label', x, y });
      label.textContent = text;
      group.appendChild(label);
    });
    furniture.appendChild(group);
  };
  frameGroup('essay', [['INTENDED ORDER', 270, 118], ['HELD CONTEXT', 950, 178]]);
  frameGroup('thread', [['CHRONOLOGICAL ORIGIN', 250, 112]]);
  frameGroup('structure', [['QUESTIONS', 190, 140], ['CLAIMS', 470, 140], ['SOURCES / TOOLS', 750, 140], ['DECISIONS', 1010, 140]]);
  frameGroup('spec', [['ENGINEERING-RELEVANT DECISIONS', 260, 138], ['HELD CONTEXT', 850, 158]]);
  g.appendChild(furniture);

  const current = el('text', { id: 'reframe-current', class: 'reframe-current', x: 1220, y: 92, 'text-anchor': 'end' });
  current.textContent = 'FRAME / READ';
  g.appendChild(current);
  return g as SVGGElement;
}

/** Part II screen furniture. Operations remain the actual conversation turns. */
export function buildAIConversation(): SVGGElement {
  const g = el('g', { id: 'ai-conversation', opacity: '0' });
  g.appendChild(el('path', { id: 'ai-screen-frame', class: 'ai-screen-frame', d: framePath(360, 88, 720, 724) }));
  g.appendChild(el('path', { class: 'ai-screen-rule', d: 'M 360 142 H 1080' }));
  const title = el('text', { class: 'ai-screen-title', x: 390, y: 122 });
  title.textContent = 'CONVERSATION';
  const status = el('text', { class: 'ai-screen-status', x: 1050, y: 122, 'text-anchor': 'end' });
  status.textContent = 'READY';
  g.appendChild(title);
  g.appendChild(status);

  const input = el('g', { id: 'ai-input' });
  input.appendChild(el('path', { class: 'ai-input-line', d: 'M 390 758 H 1050' }));
  const prompt = el('text', { class: 'ai-input-text', x: 410, y: 786 });
  prompt.textContent = 'Describe the change you want…';
  input.appendChild(prompt);
  g.appendChild(input);

  const scrollbar = el('g', { id: 'ai-scrollbar' });
  scrollbar.appendChild(el('path', { class: 'ai-scroll-track', d: 'M 1058 164 V 730' }));
  scrollbar.appendChild(el('path', { id: 'ai-scroll-thumb', class: 'ai-scroll-thumb', d: 'M 1058 172 V 310' }));
  g.appendChild(scrollbar);

  const tube = el('g', { id: 'ai-tube', opacity: '0' });
  tube.appendChild(el('path', { class: 'ai-tube-surface', d: framePath(390, -420, 660, 1740) }));
  const top = el('text', { class: 'ai-continuation', x: 720, y: 42, 'text-anchor': 'middle' });
  top.textContent = 'EARLIER CONTEXT CONTINUES ABOVE';
  const bottom = el('text', { class: 'ai-continuation', x: 720, y: 866, 'text-anchor': 'middle' });
  bottom.textContent = 'CONVERSATION CONTINUES BELOW';
  tube.appendChild(top);
  tube.appendChild(bottom);
  g.appendChild(tube);
  return g as SVGGElement;
}

/** Latent apparatus recovered from the chronological stream in Part II. */
export function buildRecovery(): SVGGElement {
  const g = el('g', { id: 'recovery-apparatus', opacity: '0' });

  const segment = el('g', { id: 'recovery-segment' });
  segment.appendChild(el('path', {
    class: 'recovery-boundary',
    d: 'M 300 110 H 1140 V 800 H 300 Z',
  }));
  segment.appendChild(el('path', {
    class: 'recovery-title-rule',
    d: 'M 330 180 H 1110',
  }));
  const title = el('text', { class: 'recovery-title', x: 330, y: 151 });
  title.textContent = 'RESOLVED STRETCH / DECISION AND CONTEXT';
  const folio = el('text', {
    class: 'recovery-folio', x: 1110, y: 151, 'text-anchor': 'end',
  });
  folio.textContent = 'SEGMENT 01 / 16';
  segment.appendChild(title);
  segment.appendChild(folio);
  g.appendChild(segment);

  const apparatus = el('g', { id: 'recovery-tool-apparatus' });
  apparatus.appendChild(el('path', {
    class: 'recovery-apparatus-rule',
    d: 'M 860 204 V 748',
  }));
  const apparatusTitle = el('text', { class: 'recovery-apparatus-title', x: 900, y: 224 });
  apparatusTitle.textContent = 'TOOLS / APPARATUS';
  const apparatusNote = el('text', { class: 'recovery-apparatus-note', x: 900, y: 246 });
  apparatusNote.textContent = 'supports the argument / no longer the argument';
  apparatus.appendChild(apparatusTitle);
  apparatus.appendChild(apparatusNote);
  g.appendChild(apparatus);

  const identifiers = el('g', { id: 'recovery-identifiers' });
  let primary = 0;
  let tool = 0;
  OPERATIONS.forEach((operation, i) => {
    const isTool = operation.kind === 'tool';
    const y = isTool ? 292 + tool++ * 88 : 230 + primary++ * 40;
    const label = el('text', {
      class: 'recovery-identifier',
      x: isTool ? 880 : 380,
      y: y - 5,
      'text-anchor': 'end',
      'data-operation': operation.id,
    });
    label.textContent = `§${String(i + 1).padStart(2, '0')}`;
    identifiers.appendChild(label);
  });
  g.appendChild(identifiers);

  const supersession = el('g', { id: 'recovery-supersession' });
  supersession.appendChild(el('path', {
    class: 'recovery-strike',
    d: 'M 410 592 H 812',
  }));
  supersession.appendChild(el('path', {
    class: 'recovery-supersession-relation',
    d: 'M 820 590 C 842 590 842 630 820 630 M 820 630 l 8 -5 M 820 630 l 8 5',
  }));
  const relationLabel = el('text', {
    class: 'recovery-supersession-label', x: 842, y: 614,
  });
  relationLabel.textContent = 'SUPERSEDED BY';
  supersession.appendChild(relationLabel);
  g.appendChild(supersession);

  return g as SVGGElement;
}
