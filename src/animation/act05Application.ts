/** Act 05 — Application. Explicit, competent structure with one consequential absence. */

import gsap from 'gsap';
import { APP_FRAME, SEED } from '../scene/markup';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenLeafFrame, tweenRule } from './frames';

export function actApplication(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();
  tweenLeafFrame(tl, refs, { ...APP_FRAME, wobble: 0 }, {
    duration: 1.7,
    ease: 'power3.inOut',
  }, 0);
  tl.to(refs.leaf, { fill: '#e9e7df', duration: 1.5, ease: 'power1.inOut' }, 0);
  tl.to(refs.leafEdge, { stroke: '#62645f', opacity: 0.5, duration: 1.5 }, 0);

  tl.set(refs.application, { opacity: 1 }, 0.35);
  tl.from(refs.appRules, { strokeDasharray: 900, strokeDashoffset: 900, duration: 1.15, stagger: 0.12, ease: 'power2.inOut' }, 0.35);
  tl.from(refs.application.querySelectorAll(':scope > text'), { opacity: 0, duration: 0.45, stagger: 0.035, ease: 'power1.out' }, 0.62);

  // Existing page furniture takes on application duties.
  tl.to(refs.printTitle, { attr: { x: 466, y: 206, 'text-anchor': 'start' }, fontSize: 24, letterSpacing: '0.02em', duration: 1.25, ease: 'power2.inOut' }, 0.35);
  tl.to(refs.printCaput, { attr: { x: 466, y: 234, 'text-anchor': 'start' }, fontSize: 15, duration: 1.2, ease: 'power2.inOut' }, 0.38);
  tl.to(refs.printFolio, { attr: { x: 1154, y: 105 }, fontSize: 14, duration: 1.1, ease: 'power2.inOut' }, 0.35);
  tl.to(refs.printLineNums, { opacity: 0, duration: 0.5 }, 0.2);

  refs.bodyLines.forEach((line, i) => {
    const gap = i >= 10 ? 92 : i >= 5 ? 46 : 0;
    tl.to(line, {
      attr: { x: 466 + (i === 0 ? 18 : 0), y: 264 + i * 22 + gap },
      fontSize: 16,
      duration: 1.35,
      ease: 'power2.inOut',
    }, 0.38 + i * 0.012);
  });
  tl.to(refs.initial, { attr: { x: 466, y: 267 }, fontSize: 35, duration: 1.3, ease: 'power2.inOut' }, 0.38);
  tl.from(refs.appRecords, { opacity: 0, y: 8, duration: 0.55, stagger: 0.1, ease: 'power2.out' }, 0.8);

  refs.printNoteTexts.forEach((note, i) => {
    tl.to(note, { attr: { x: 952, y: 486 + i * 25 }, fontSize: 12, duration: 1.1, ease: 'power2.inOut' }, 0.42 + i * 0.08);
  });

  const inspectorRule = refs.rulePaths[1];
  if (inspectorRule) {
    tweenRule(tl, refs, 1, {
      x1: 932, y1: 132, x2: 932, y2: 838,
    }, { duration: 1.45, ease: 'power3.inOut' }, 0.28, SEED + 12);
    tl.to(inspectorRule, { opacity: 0.28, stroke: '#62645f', duration: 1.2 }, 0.28);
  }
  const recordRule = refs.rulePaths[0];
  if (recordRule) {
    tweenRule(tl, refs, 0, {
      x1: 466, y1: 336, x2: 916, y2: 336,
    }, { duration: 1.25, ease: 'power2.inOut' }, 0.4, SEED + 8);
    tl.to(recordRule, { stroke: '#747872', opacity: 0.22, duration: 1 }, 0.4);
  }

  tl.to(refs.editorial, { opacity: 0, duration: 0.6 }, 0.35);
  // The application first reads as a solution. Its missing relation arrives
  // only after the rest has settled, without condemning the useful structure.
  tl.fromTo(refs.appMissingReason, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 1.75);
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.08, duration: 1.8, ease: 'none' }, 0);
  return tl;
}
