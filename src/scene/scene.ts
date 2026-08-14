/**
 * Builds the scene exactly once and hands back typed references.
 *
 * This is the only module allowed to create scene elements. Act modules
 * receive `SceneRefs` and can therefore only ever transform what already
 * exists — which is how the "one object evolving" rule is enforced in code
 * rather than by convention.
 */

import { BODY_PROSE } from '../data/text';
import {
  buildBody,
  buildDefs,
  buildField,
  buildGlosses,
  buildLeaf,
  buildMarks,
  buildPrint,
  buildRules,
  el,
  VIEW,
} from './markup';

export type SceneRefs = {
  svg: SVGSVGElement;
  /** The single transform target that carries the object through every act. */
  page: SVGGElement;
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
  title.textContent = 'A page of text, acquiring apparatus';
  const desc = el('desc', { id: 'scene-desc' });
  desc.textContent =
    `An illustrated manuscript leaf carrying the passage: "${BODY_PROSE}" ` +
    'Across the piece the same leaf gains marginal notes, underlines and reference marks, ' +
    'which then regularize into printed apparatus: a title, a rule, line numbers and footnotes.';

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
  svg.appendChild(page);

  mount.appendChild(svg);

  return {
    svg,
    page,
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
  };
}

/**
 * Puts every animatable element into its Act 1 state.
 *
 * Called once after build and again whenever the timeline is rebuilt on a
 * mode change, so a resize cannot leave a half-played act on screen.
 */
export function resetScene(refs: SceneRefs): void {
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
