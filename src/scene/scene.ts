/**
 * Builds the scene exactly once and hands back typed references.
 *
 * This is the only module allowed to create scene elements. Act modules
 * receive `SceneRefs` and can therefore only ever transform what already
 * exists — which is how the "one object evolving" rule is enforced in code
 * rather than by convention.
 */

import { BODY_PROSE, GLOSSES, UNDERLINES } from '../data/text';
import { OPERATIONS } from '../data/operations';
import { noiseAt, wobblyLine, wobblyRect } from './geometry';
import {
  buildBody,
  buildApplication,
  buildAIConversation,
  buildDefs,
  buildEditorial,
  buildMagazine,
  buildHypertext,
  buildField,
  buildGlosses,
  buildFragments,
  buildLeaf,
  buildMarks,
  buildPrint,
  buildConversation,
  buildOperations,
  buildReframe,
  buildRecovery,
  buildCost,
  buildOpen,
  buildRules,
  el,
  VIEW,
  APP_FRAME,
  FRAGMENT_WINDOWS,
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
  fieldBase: SVGRectElement;
  screenGrid: SVGGElement;
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
  magazine: SVGGElement;
  magazineImage: SVGGElement;
  magazineDiagram: SVGGElement;
  magazineDiagramPaths: SVGPathElement[];
  magazineCaption: SVGGElement;
  magazineQuote: SVGGElement;
  magazineLabels: SVGGElement;
  hypertext: SVGGElement;
  hypertextSubstrate: SVGRectElement;
  hypertextPlaces: SVGGElement[];
  hypertextControls: SVGGElement;
  hypertextHistoryMarks: SVGRectElement[];
  hypertextFocus: SVGRectElement;
  hypertextPointer: SVGPathElement;
  hypertextActions: SVGTextElement[];
  hypertextStatus: SVGTextElement;
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
  aiConversation: SVGGElement;
  aiScreenFrame: SVGPathElement;
  aiInput: SVGGElement;
  aiScrollbar: SVGGElement;
  aiScrollThumb: SVGPathElement;
  aiTube: SVGGElement;
  chatClipRect: SVGRectElement;
  recovery: SVGGElement;
  recoverySegment: SVGGElement;
  recoveryToolApparatus: SVGGElement;
  recoveryIdentifiers: SVGGElement;
  recoverySupersession: SVGGElement;
  cost: SVGGElement;
  costTrackedReference: SVGGElement;
  costSelectedView: SVGTextElement;
  costConsequences: SVGGElement;
  open: SVGGElement;
  openQuestion: SVGTextElement;
  materialState: MaterialState;
  /** Live geometry shared by every act that transforms the material leaf. */
  leafState: LeafFrameState;
  /** Live geometry for inherited rule paths. */
  ruleStates: LineState[];
  /** Live geometry for fragment frames; acts never keep private copies. */
  frameStates: FrameRect[];
  /** Shared projection geometry for durable operation identities. */
  operationStates: OperationPlacementState[];
};

export type FrameRect = { x: number; y: number; w: number; h: number };
export type LeafFrameState = FrameRect & { wobble: number };
export type LineState = { x1: number; y1: number; x2: number; y2: number; wobble: number };
export type MaterialMode = 'paper' | 'transition' | 'screen';
export type MaterialState = {
  mode: MaterialMode;
  fieldColor: string;
  gridOpacity: number;
  dustOpacity: number;
  vignetteOpacity: number;
};
export type OperationPlacementState = { x: number; y: number; scale: number; opacity: number };

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
    'Their irregular marks regularize into print, settle into editorial composition, and open into ' +
    'a contemporary spread of text, image and diagram. One phrase then becomes actionable, and the ' +
    'reader moves through addressable textual places before returning home through digital history. ' +
    'The same material then becomes structured application records. ' +
    'That application separates into specialized tool windows. ' +
    'Those frames then converge on a calm AI conversation whose turns accumulate until the screen ' +
    'is revealed as a small viewport onto a much longer chronological stream. The stream then ' +
    'recovers segmentation, apparatus, stable addresses and explicit supersession before the ' +
    'same operations recompose into several coherent projections. One projection then changes ' +
    'without the reader asking, displacing a tracked claim and its shared pointing position. ' +
    'The operation field remains visible under the final question: Which frame now?';

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
  page.appendChild(buildMagazine());
  svg.appendChild(page);

  const surface = el('g', { id: 'surface' }) as SVGGElement;
  surface.appendChild(buildHypertext());
  surface.appendChild(buildApplication());
  surface.appendChild(buildFragments());
  surface.appendChild(buildConversation());
  surface.appendChild(buildReframe());
  surface.appendChild(buildAIConversation());
  surface.appendChild(buildRecovery());
  surface.appendChild(buildCost());
  surface.appendChild(buildOpen());
  surface.appendChild(buildOperations());
  svg.appendChild(surface);

  mount.appendChild(svg);

  return {
    svg,
    page,
    surface,
    field: must(svg, '#field'),
    fieldBase: must(svg, '#field-base'),
    screenGrid: must(svg, '#screen-grid'),
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
    magazine: must(svg, '#magazine'),
    magazineImage: must(svg, '#magazine-image'),
    magazineDiagram: must(svg, '#magazine-diagram'),
    magazineDiagramPaths: [...svg.querySelectorAll<SVGPathElement>('.magazine-diagram-path')],
    magazineCaption: must(svg, '#magazine-caption'),
    magazineQuote: must(svg, '#magazine-quote'),
    magazineLabels: must(svg, '#magazine-labels'),
    hypertext: must(svg, '#hypertext'),
    hypertextSubstrate: must(svg, '#hypertext-substrate'),
    hypertextPlaces: [...svg.querySelectorAll<SVGGElement>('.hypertext-place')],
    hypertextControls: must(svg, '#hypertext-controls'),
    hypertextHistoryMarks: [...svg.querySelectorAll<SVGRectElement>('.hypertext-history-mark')],
    hypertextFocus: must(svg, '#hypertext-focus'),
    hypertextPointer: must(svg, '#hypertext-pointer'),
    hypertextActions: [...svg.querySelectorAll<SVGTextElement>('.hypertext-action')],
    hypertextStatus: must(svg, '#hypertext-status'),
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
    aiConversation: must(svg, '#ai-conversation'),
    aiScreenFrame: must(svg, '#ai-screen-frame'),
    aiInput: must(svg, '#ai-input'),
    aiScrollbar: must(svg, '#ai-scrollbar'),
    aiScrollThumb: must(svg, '#ai-scroll-thumb'),
    aiTube: must(svg, '#ai-tube'),
    chatClipRect: must(svg, '#chat-clip-rect'),
    recovery: must(svg, '#recovery-apparatus'),
    recoverySegment: must(svg, '#recovery-segment'),
    recoveryToolApparatus: must(svg, '#recovery-tool-apparatus'),
    recoveryIdentifiers: must(svg, '#recovery-identifiers'),
    recoverySupersession: must(svg, '#recovery-supersession'),
    cost: must(svg, '#cost-annotations'),
    costTrackedReference: must(svg, '#cost-tracked-reference'),
    costSelectedView: must(svg, '#cost-selected-view'),
    costConsequences: must(svg, '#cost-consequences'),
    open: must(svg, '#open-question'),
    openQuestion: must(svg, '.open-question-text'),
    materialState: {
      mode: 'paper',
      fieldColor: '#0b0d10',
      gridOpacity: 0,
      dustOpacity: 0.5,
      vignetteOpacity: 1,
    },
    leafState: { ...LEAF, wobble: 1 },
    ruleStates: UNDERLINES.map((underline) => {
      const y = lineY(underline.lineIndex) + 7;
      return {
        x1: TEXT.x + TEXT.width * underline.from,
        y1: y,
        x2: TEXT.x + TEXT.width * underline.to,
        y2: y,
        wobble: 1,
      };
    }),
    frameStates: FRAGMENT_WINDOWS.map(() => ({ ...APP_FRAME })),
    operationStates: OPERATIONS.map((_, i) => ({
      x: 474 + (i % 2) * 224,
      y: 262 + Math.floor(i / 2) * 47,
      scale: 1,
      opacity: 0,
    })),
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
  Object.assign(refs.leafState, { ...LEAF, wobble: 1 });
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
    const state = refs.ruleStates[i];
    if (state) Object.assign(state, { x1, y1: y, x2, y2: y, wobble: 1 });
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
  refs.fragmentFrames.forEach((frame, i) => {
    frame.setAttribute('d', framePath(APP_FRAME.x, APP_FRAME.y, APP_FRAME.w, APP_FRAME.h));
    const state = refs.frameStates[i];
    if (state) Object.assign(state, APP_FRAME);
  });
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
  refs.magazine.style.opacity = '0';
  refs.hypertext.style.opacity = '0';
  refs.application.style.opacity = '0';
  refs.fragments.style.opacity = '0';
  refs.operations.style.opacity = '0';
  refs.conversation.style.opacity = '0';
  refs.reframe.style.opacity = '0';
  refs.aiConversation.style.opacity = '0';
  refs.recovery.style.opacity = '0';
  refs.cost.style.opacity = '0';
  refs.open.style.opacity = '0';
  refs.operations.removeAttribute('clip-path');
  Object.assign(refs.materialState, {
    mode: 'paper',
    fieldColor: '#0b0d10',
    gridOpacity: 0,
    dustOpacity: 0.5,
    vignetteOpacity: 1,
  });
  refs.fieldBase.setAttribute('fill', '#0b0d10');
  refs.screenGrid.setAttribute('opacity', '0');
  refs.screenGrid.style.opacity = '0';
  refs.dust.style.opacity = '0.5';
  refs.vignette.style.opacity = '1';
  refs.chatClipRect.setAttribute('x', '390');
  refs.chatClipRect.setAttribute('width', '660');
  refs.aiScrollThumb.setAttribute('d', 'M 1058 172 V 310');
  refs.operationNodes.forEach((node, i) => {
    node.removeAttribute('transform');
    node.style.opacity = '0';
    const state = refs.operationStates[i];
    if (state) Object.assign(state, {
      x: 474 + (i % 2) * 224,
      y: 262 + Math.floor(i / 2) * 47,
      scale: 1,
      opacity: 0,
    });
  });
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
