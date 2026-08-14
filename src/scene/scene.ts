/**
 * Builds the scene exactly once and hands back typed references.
 *
 * This is the only module allowed to create scene elements. Act modules
 * receive `SceneRefs` and can therefore only ever transform what already
 * exists — which is how the "one object evolving" rule is enforced in code
 * rather than by convention.
 */

import { BODY_PROSE, GLOSSES, UNDERLINES } from '../data/text';
import { noiseAt, wobblyLine, wobblyRect } from './geometry';
import {
  buildBody,
  buildApplication,
  buildDefs,
  buildEditorial,
  buildField,
  buildGlosses,
  buildFragments,
  buildLeaf,
  buildMarks,
  buildPrint,
  buildConversation,
  buildOperations,
  buildReframe,
  buildRules,
  el,
  VIEW,
  APP_FRAME,
  LEAF,
  PRINT_TEXT,
  SEED,
  TEXT,
  lineY,
  framePath,
} from './markup';

export type SceneRefs = {
  svg: SVGSVGElement;
  /** Material/codex carrier. Its transforms end before the software epoch. */
  page: SVGGElement;
  /** Software/screen substrate. A sibling so codex transforms cannot leak in. */
  surface: SVGGElement;
  field: SVGGElement;
  dust: SVGGElement;
  vignette: SVGElement;
  leafGroup: SVGGElement;
  leaf: SVGPathElement;
  leafEdge: SVGPathElement;
  leafVerso: SVGPathElement;
  body: SVGGElement;
  initial: SVGTextElement;
  bodyLines: SVGTextElement[];
  rules: SVGGElement;
  rulePaths: SVGPathElement[];
  glosses: SVGGElement;
  glossGroups: SVGGElement[];
  interlinear: SVGTextElement[];
  marks: SVGGElement;
  markPaths: SVGPathElement[];
  print: SVGGElement;
  printTitle: SVGTextElement;
  printCaput: SVGTextElement;
  printFolio: SVGTextElement;
  printLineNums: SVGTextElement[];
  printNotes: SVGGElement;
  printNoteTexts: SVGTextElement[];
  editorial: SVGGElement;
  editorialGrid: SVGGElement;
  editorialGridLines: SVGPathElement[];
  application: SVGGElement;
  appRules: SVGPathElement[];
  appRecords: SVGGElement[];
  appMissingReason: SVGGElement;
  fragments: SVGGElement;
  fragmentWindows: SVGGElement[];
  fragmentFrames: SVGPathElement[];
  fragmentRelations: SVGGElement;
  operations: SVGGElement;
  operationNodes: SVGGElement[];
  conversation: SVGGElement;
  conversationSupersession: SVGGElement;
  conversationOrphan: SVGGElement;
  reframe: SVGGElement;
  reframeOverview: SVGGElement;
  reframeRelations: SVGGElement;
  projectionPorts: SVGGElement[];
  frameFurniture: SVGGElement[];
  reframeCurrent: SVGTextElement;
};

function must<T extends Element>(root: ParentNode, selector: string): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`scene: expected element "${selector}"`);
  return found;
}

export function buildScene(mount: HTMLElement): SceneRefs {
  const svg = el('svg', {
    id: 'scene',
    viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-labelledby': 'scene-title scene-desc',
  }) as SVGSVGElement;

  const title = el('title', { id: 'scene-title' });
  title.textContent = 'One body of text, acquiring and changing frames';
  const desc = el('desc', { id: 'scene-desc' });
  desc.textContent =
    `The passage "${BODY_PROSE}" begins without a visible paper boundary. ` +
    'Its page resolves around it; readers then annotate from outside until the page expands to admit them. ' +
    'Their irregular marks regularize into print, settle into editorial composition, and become ' +
    'structured application records. That application separates into tool windows before the same ' +
    'operations reunite as chronology beside an artifact. Finally the artifact and chronology yield ' +
    'to durable context arranged as essay, thread, structure and specification.';

  svg.appendChild(title);
  svg.appendChild(desc);
  svg.appendChild(buildDefs());
  svg.appendChild(buildField());

  const page = el('g', { id: 'page' }) as SVGGElement;
  page.appendChild(buildLeaf());
  page.appendChild(buildBody());
  page.appendChild(buildRules());
  page.appendChild(buildGlosses());
  page.appendChild(buildMarks());
  page.appendChild(buildPrint());
  page.appendChild(buildEditorial());
  svg.appendChild(page);

  const surface = el('g', { id: 'surface' }) as SVGGElement;
  surface.appendChild(buildApplication());
  surface.appendChild(buildFragments());
  surface.appendChild(buildConversation());
  surface.appendChild(buildReframe());
  surface.appendChild(buildOperations());
  svg.appendChild(surface);

  mount.appendChild(svg);

  return {
    svg,
    page,
    surface,
    field: must(svg, '#field'),
    dust: must(svg, '#dust'),
    vignette: must(svg, '#vignette'),
    leafGroup: must(svg, '#leaf-group'),
    leaf: must(svg, '#leaf'),
    leafEdge: must(svg, '#leaf-edge'),
    leafVerso: must(svg, '#leaf-verso'),
    body: must(svg, '#body'),
    initial: must(svg, '#initial'),
    bodyLines: [...svg.querySelectorAll<SVGTextElement>('.ms-line')],
    rules: must(svg, '#rules'),
    rulePaths: [...svg.querySelectorAll<SVGPathElement>('.ms-rule')],
    glosses: must(svg, '#glosses'),
    glossGroups: [...svg.querySelectorAll<SVGGElement>('.gloss')],
    interlinear: [...svg.querySelectorAll<SVGTextElement>('.interlinear')],
    marks: must(svg, '#marks'),
    markPaths: [...svg.querySelectorAll<SVGPathElement>('.mark')],
    print: must(svg, '#print'),
    printTitle: must(svg, '#print-title'),
    printCaput: must(svg, '#print-caput'),
    printFolio: must(svg, '#print-folio'),
    printLineNums: [...svg.querySelectorAll<SVGTextElement>('.pr-linenum')],
    printNotes: must(svg, '#print-footnotes'),
    printNoteTexts: [...svg.querySelectorAll<SVGTextElement>('.pr-note')],
    editorial: must(svg, '#editorial'),
    editorialGrid: must(svg, '#editorial-grid'),
    editorialGridLines: [...svg.querySelectorAll<SVGPathElement>('.editorial-grid-line')],
    application: must(svg, '#application'),
    appRules: [...svg.querySelectorAll<SVGPathElement>('.app-rule')],
    appRecords: [...svg.querySelectorAll<SVGGElement>('.app-record')],
    appMissingReason: must(svg, '#app-missing-reason'),
    fragments: must(svg, '#fragments'),
    fragmentWindows: [...svg.querySelectorAll<SVGGElement>('.fragment-window')],
    fragmentFrames: [...svg.querySelectorAll<SVGPathElement>('.fragment-window-frame')],
    fragmentRelations: must(svg, '#fragment-relations'),
    operations: must(svg, '#operations'),
    operationNodes: [...svg.querySelectorAll<SVGGElement>('.operation')],
    conversation: must(svg, '#conversation'),
    conversationSupersession: must(svg, '#conversation-supersession'),
    conversationOrphan: must(svg, '#conversation-orphan'),
    reframe: must(svg, '#reframe'),
    reframeOverview: must(svg, '#reframe-overview'),
    reframeRelations: must(svg, '#reframe-relations'),
    projectionPorts: [...svg.querySelectorAll<SVGGElement>('.projection-port')],
    frameFurniture: [...svg.querySelectorAll<SVGGElement>('.frame-layout-furniture')],
    reframeCurrent: must(svg, '#reframe-current'),
  };
}

/**
 * Puts every animatable element into its Act 1 state.
 *
 * Called once after build and again whenever the timeline is rebuilt on a
 * mode change, so a resize cannot leave a half-played act on screen.
 */
export function resetScene(refs: SceneRefs): void {
  // GSAP may have left presentation properties on elements when a responsive
  // mode rebuild occurs. The master clears inline styles before this reset;
  // restore authored SVG attributes here as the deterministic source state.
  const leafPath = wobblyRect(LEAF.x, LEAF.y, LEAF.w, LEAF.h, 1, SEED);
  refs.leaf.setAttribute('d', leafPath);
  refs.leaf.setAttribute('fill', '#efe6d2');
  refs.leafEdge.setAttribute('d', leafPath);
  refs.leafEdge.setAttribute('stroke', '#2b2419');
  refs.leafEdge.setAttribute('stroke-width', '1.1');
  refs.leafVerso.setAttribute(
    'd',
    wobblyRect(LEAF.x - 26, LEAF.y + 14, LEAF.w, LEAF.h - 22, 1, SEED + 400),
  );
  refs.initial.setAttribute('x', String(TEXT.x));
  refs.initial.setAttribute('y', String(lineY(0) + 4));
  refs.bodyLines.forEach((line, i) => {
    const jx = noiseAt(SEED + 313, i) * 2.4;
    const jy = noiseAt(SEED + 719, i) * 1.3;
    line.setAttribute('x', String((i === 0 ? TEXT.x + 34 : TEXT.x) + jx));
    line.setAttribute('y', String(lineY(i) + jy));
  });
  refs.glossGroups.forEach((group, i) => {
    const gloss = GLOSSES[i];
    if (gloss) group.setAttribute('transform', `rotate(${gloss.tilt} ${gloss.x} ${gloss.y})`);
  });
  UNDERLINES.forEach((underline, i) => {
    const path = refs.rulePaths[i];
    if (!path) return;
    const y = lineY(underline.lineIndex) + 7;
    const x1 = TEXT.x + TEXT.width * underline.from;
    const x2 = TEXT.x + TEXT.width * underline.to;
    path.setAttribute('d', wobblyLine(x1, y, x2, y, 1, SEED + underline.lineIndex));
    path.setAttribute('stroke', '#2b2318');
  });
  refs.printTitle.setAttribute('x', '720');
  refs.printTitle.setAttribute('y', '176');
  refs.printTitle.setAttribute('text-anchor', 'middle');
  refs.printCaput.setAttribute('x', '720');
  refs.printCaput.setAttribute('y', '208');
  refs.printCaput.setAttribute('text-anchor', 'middle');
  refs.printFolio.setAttribute('x', '934');
  refs.printFolio.setAttribute('y', '176');
  refs.printNoteTexts.forEach((note, i) => {
    note.setAttribute('x', String(PRINT_TEXT.x));
    note.setAttribute('y', String(726 + i * 22));
  });
  refs.fragmentFrames.forEach((frame) => frame.setAttribute('d', framePath(APP_FRAME.x, APP_FRAME.y, APP_FRAME.w, APP_FRAME.h)));
  for (const p of [...refs.rulePaths, ...refs.markPaths]) {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    p.style.opacity = '1';
  }
  for (const g of refs.glossGroups) g.style.opacity = '0';
  for (const t of refs.interlinear) t.style.opacity = '0';

  // The print group is revealed early in Act 3, so each piece of apparatus
  // hides itself rather than relying on the parent — otherwise the whole
  // printed page would appear the moment the act starts.
  refs.print.style.opacity = '0';
  refs.editorial.style.opacity = '0';
  refs.application.style.opacity = '0';
  refs.fragments.style.opacity = '0';
  refs.operations.style.opacity = '0';
  refs.conversation.style.opacity = '0';
  refs.reframe.style.opacity = '0';
  refs.printNotes.style.opacity = '0';
  for (const t of [
    refs.printTitle,
    refs.printCaput,
    refs.printFolio,
    ...refs.printLineNums,
    ...refs.printNoteTexts,
  ]) {
    t.style.opacity = '0';
  }
}
