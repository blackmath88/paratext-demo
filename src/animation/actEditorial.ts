/** Editorial composition. Apparatus becomes an engineered reading environment. */

import gsap from 'gsap';
import { COMPOSED_LEAF, SEED } from '../scene/markup';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenLeafFrame, tweenRule } from './frames';

export function actEditorial(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Print's small codex-only carrier transform has done its work. Resolve it
  // before the software sibling becomes authoritative so both coordinate
  // systems meet without a cut or inherited compensation.
  tl.to(refs.page, { scale: 1, y: 0, duration: 1.1, ease: 'power2.inOut' }, 0);

  tl.set(refs.editorial, { opacity: 1 }, 0);
  refs.editorialGridLines.forEach((line, i) => {
    const length = line.getTotalLength();
    tl.fromTo(
      line,
      { strokeDasharray: length, strokeDashoffset: length, opacity: 0.18 },
      { strokeDashoffset: 0, opacity: 0.46, duration: 0.7, ease: 'power1.inOut' },
      i * 0.055,
    );
  });

  tweenLeafFrame(tl, refs, { ...COMPOSED_LEAF, wobble: 0 }, {
    duration: 1.8,
    ease: 'power2.inOut',
  }, 0.15);

  // The body becomes a deliberate reading column rather than a fitted block.
  refs.bodyLines.forEach((line, i) => {
    tl.to(line, {
      attr: { x: 430 + (i === 0 ? 20 : 0), y: 282 + i * 27 },
      fontSize: 19,
      duration: 1.45,
      ease: 'power2.inOut',
    }, 0.42 + i * 0.018);
  });
  tl.to(refs.initial, { attr: { x: 430, y: 285 }, duration: 1.45, ease: 'power2.inOut' }, 0.42);
  tl.to(refs.printTitle, { attr: { x: 430, y: 162, 'text-anchor': 'start' }, fontSize: 31, duration: 1.2, ease: 'power2.inOut' }, 0.3);
  tl.to(refs.printCaput, { attr: { x: 430, y: 204, 'text-anchor': 'start' }, duration: 1.2, ease: 'power2.inOut' }, 0.35);
  tl.to(refs.printFolio, { attr: { x: 1040, y: 162 }, duration: 1.2, ease: 'power2.inOut' }, 0.35);
  tl.to(refs.printLineNums, { opacity: 0.22, x: -44, duration: 0.8, ease: 'power1.inOut' }, 0.5);

  refs.printNoteTexts.forEach((note, i) => {
    tl.to(note, {
      attr: { x: 820, y: 292 + i * 70 },
      fontSize: 15,
      duration: 1.3,
      ease: 'power2.inOut',
    }, 0.6 + i * 0.08);
  });

  // The inherited footnote separator rotates into the boundary between the
  // argument and its source zone: composition is a relationship, not polish.
  const separator = refs.rulePaths[1];
  if (separator) {
    tweenRule(tl, refs, 1, {
      x1: 790, y1: 258, x2: 790, y2: 680,
    }, { duration: 1.5, ease: 'power3.inOut' }, 0.52, SEED + 12);
    tl.to(separator, { opacity: 0.3, duration: 1.2 }, 0.52);
  }

  const headingRule = refs.rulePaths[0];
  if (headingRule) {
    tweenRule(tl, refs, 0, {
      x1: 430, y1: 222, x2: 760, y2: 222,
    }, { duration: 1.35, ease: 'power2.inOut' }, 0.45, SEED + 8);
  }

  tl.to(refs.editorialGrid, { opacity: 0, duration: 0.9, ease: 'power1.out' }, 1.65);
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.18, duration: 2, ease: 'none' }, 0);
  return tl;
}
