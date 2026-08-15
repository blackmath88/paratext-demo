/** Projections. One operation field composes several coherent unities. */

import gsap from 'gsap';
import { frameLayout, type FrameId } from './operationLayouts';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperation } from './operations';

function arrange(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  frame: FrameId,
  position: number,
  duration: number,
): void {
  const layout = frameLayout(frame);
  refs.operationNodes.forEach((node, i) => {
    const id = node.dataset.operation;
    const placement = id ? layout[id] : undefined;
    if (!placement) return;
    tweenOperation(tl, refs, i, placement, {
      duration,
      ease: 'power3.inOut',
    }, position + i * 0.012);
  });
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

  tl.set(refs.reframe, { opacity: 1 }, 0);
  tl.from(refs.reframeOverview, { opacity: 0, duration: 0.5 }, 0);
  tl.to(refs.recovery, { opacity: 0, duration: 0.55 }, 0);

  arrange(tl, refs, 'structure', 0.08, 0.78);
  showFurniture(tl, refs, 'structure', 0.32);
  tl.set(refs.reframeCurrent, { textContent: 'FRAME / STRUCTURE' }, 0.32);

  arrange(tl, refs, 'spec', 1.05, 0.82);
  showFurniture(tl, refs, 'spec', 1.34);
  tl.set(refs.reframeCurrent, { textContent: 'FRAME / SPEC' }, 1.34);

  arrange(tl, refs, 'essay', 2.08, 0.9);
  tl.to(refs.reframeOverview, { opacity: 0, duration: 0.45 }, 2.32);
  showFurniture(tl, refs, 'essay', 2.42);
  tl.set(refs.reframeCurrent, { textContent: 'FRAME / READ' }, 2.42);

  return tl;
}
