/** Magazine spread. Composition coordinates heterogeneous editorial material. */

import gsap from 'gsap';
import { MAGAZINE_LEAF, SEED } from '../scene/markup';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenLeafFrame, tweenRule } from './frames';

export function actMagazine(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.set(refs.magazine, { opacity: 1 }, 0);
  tweenLeafFrame(tl, refs, { ...MAGAZINE_LEAF, wobble: 0 }, {
    duration: 1.7,
    ease: 'power3.inOut',
  }, 0);
  tl.to(refs.leaf, { fill: '#eee9df', duration: 1.4, ease: 'power1.inOut' }, 0);
  tl.to(refs.leafEdge, { stroke: '#5d584e', opacity: 0.38, duration: 1.4 }, 0);

  tl.to(refs.printTitle, {
    attr: { x: 340, y: 158, 'text-anchor': 'start' },
    fontSize: 39,
    letterSpacing: '-0.015em',
    duration: 1.2,
    ease: 'power2.inOut',
  }, 0.12);
  tl.to(refs.printCaput, {
    attr: { x: 340, y: 205, 'text-anchor': 'start' },
    fontSize: 17,
    duration: 1.15,
    ease: 'power2.inOut',
  }, 0.16);
  tl.to(refs.printFolio, { attr: { x: 1110, y: 108 }, fontSize: 13, duration: 1 }, 0.12);
  tl.to(refs.printLineNums, { opacity: 0, duration: 0.4 }, 0);

  refs.bodyLines.forEach((line, i) => {
    const column = i < 7 ? 0 : 1;
    const row = column === 0 ? i : i - 7;
    tl.to(line, {
      attr: { x: 340 + column * 210 + (i === 0 ? 25 : 0), y: 298 + row * 32 },
      fontSize: 16,
      duration: 1.25,
      ease: 'power2.inOut',
    }, 0.22 + i * 0.012);
  });
  tl.to(refs.initial, { attr: { x: 340, y: 302 }, fontSize: 35, duration: 1.2, ease: 'power2.inOut' }, 0.22);

  refs.printNoteTexts.forEach((note, i) => {
    tl.to(note, {
      attr: { x: 340, y: 566 + i * 25 },
      fontSize: 12,
      duration: 1,
      ease: 'power2.inOut',
    }, 0.3 + i * 0.06);
  });

  if (refs.rulePaths[0]) {
    tweenRule(tl, refs, 0, { x1: 340, y1: 226, x2: 740, y2: 226 }, {
      duration: 1.2, ease: 'power2.inOut',
    }, 0.18, SEED + 18);
  }
  if (refs.rulePaths[1]) {
    tweenRule(tl, refs, 1, { x1: 340, y1: 536, x2: 740, y2: 536 }, {
      duration: 1.2, ease: 'power2.inOut',
    }, 0.2, SEED + 22);
    tl.to(refs.rulePaths[1], { opacity: 0.24, duration: 0.8 }, 0.2);
  }

  tl.from(refs.magazineLabels, { opacity: 0, y: 5, duration: 0.5, ease: 'power1.out' }, 0.2);
  tl.from(refs.magazineImage, { opacity: 0, x: 18, duration: 0.85, ease: 'power2.out' }, 0.52);
  tl.from(refs.magazineCaption, { opacity: 0, y: 7, duration: 0.55, ease: 'power1.out' }, 0.88);
  tl.from(refs.magazineDiagram, { opacity: 0, y: 9, duration: 0.7, ease: 'power2.out' }, 0.98);
  tl.from(refs.magazineDiagramPaths, { strokeDasharray: 500, strokeDashoffset: 500, duration: 0.8, ease: 'power1.inOut' }, 1.02);
  tl.from(refs.magazineQuote, { opacity: 0, y: 10, duration: 0.7, ease: 'power2.out' }, 1.28);
  tl.to(refs.editorial, { opacity: 0, duration: 0.55 }, 0.25);
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.1, duration: 1.7, ease: 'none' }, 0);
  return tl;
}
