/** Projections. One operation field composes several coherent unities. */

import gsap from 'gsap';
import { frameLayout, type FrameId } from './operationLayouts';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperationLayout } from './operations';

function arrange(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  frame: FrameId,
  position: number,
  duration: number,
): void {
  tweenOperationLayout(tl, refs, frameLayout(frame), {
    duration,
    ease: 'power3.inOut',
  }, position);
}

function showFurniture(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  frame: FrameId,
  position: number,
): void {
  refs.frameFurniture.forEach((group) => {
    tl.set(group, { opacity: group.dataset.frame === frame ? 1 : 0 }, position);
  });
}

export function actProjections(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();
  const before = refs.reframeOverview.querySelector('.delta-before');
  const pivot = refs.reframeOverview.querySelector('.delta-pivot');
  const after = refs.reframeOverview.querySelector('.delta-after');

  tl.set(refs.reframe, { opacity: 1 }, 0);
  tl.set(refs.reframeOverview, { opacity: 1 }, 0);
  tl.from(before, { opacity: 0, x: -18, duration: 0.6, ease: 'power2.out' }, 0);
  tl.from(pivot, { opacity: 0, scaleX: 0.3, transformOrigin: 'center', duration: 0.5 }, 0.62);
  tl.from(after, { opacity: 0, x: 18, duration: 0.7, ease: 'power2.out' }, 0.9);
  tl.to(refs.recovery, { opacity: 0, duration: 0.55 }, 0);
  tl.to(refs.aiConversation, { opacity: 0, duration: 0.35 }, 0);
  tl.to(refs.operations, { opacity: 0.12, duration: 0.45 }, 0);

  arrange(tl, refs, 'structure', 0.08, 0.78);
  showFurniture(tl, refs, 'structure', 0.32);
  tl.set(refs.reframeCurrent, { textContent: 'PARADIGM SHIFT 02 / CHECKOUT AS VIEW' }, 0.32);

  arrange(tl, refs, 'spec', 1.05, 0.82);
  showFurniture(tl, refs, 'spec', 1.34);
  tl.set(refs.reframeCurrent, { textContent: 'CHECKOUT / CODE' }, 1.34);

  arrange(tl, refs, 'essay', 2.08, 0.9);
  showFurniture(tl, refs, 'essay', 2.42);
  tl.set(refs.reframeCurrent, { textContent: 'CHECKOUT / REVIEW' }, 2.42);

  return tl;
}
