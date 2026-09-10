/** Proposed extension. One durable operation field changes projection. */

import gsap from 'gsap';
import { frameLayout } from './operationLayouts';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperationLayout } from './operations';

export function actCost(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  const showFurniture = (frame: 'thread' | 'essay' | 'structure', at: number) => {
    refs.frameFurniture.forEach((group) => {
      tl.set(group, { opacity: group.dataset.frame === frame ? 1 : 0 }, at);
    });
  };
  const activateStage = (index: number, at: number) => {
    refs.costProjectionStages.forEach((stage, stageIndex) => {
      tl.to(stage, {
        opacity: stageIndex === index ? 1 : 0.28,
        duration: 0.3,
      }, at);
    });
  };

  tl.set(refs.cost, { opacity: 1 }, 0);
  tl.set(refs.costProjectionStages, { opacity: 0.28 }, 0);
  tl.to(refs.operations, { opacity: 1, duration: 0.45 }, 0);
  tl.to(refs.reframeOverview, { opacity: 0, duration: 0.35 }, 0);
  tl.set(refs.reframeCurrent, { opacity: 0 }, 0);
  tl.from(refs.cost.querySelectorAll(
    '.cost-projection-title, .cost-projection-rail, .cost-projection-continuity',
  ), {
    opacity: 0, y: -8, duration: 0.65, ease: 'power2.out',
  }, 0);

  // Begin in a chronological thread, then recompose exactly the same operation
  // nodes as a document and a review surface. Identity belongs to the object;
  // arrangement belongs to the projection.
  tweenOperationLayout(tl, refs, frameLayout('thread'), {
    duration: 0.72,
    ease: 'power3.inOut',
  }, 0.08);
  showFurniture('thread', 0.42);
  activateStage(0, 0.42);

  tweenOperationLayout(tl, refs, frameLayout('essay'), {
    duration: 0.82,
    ease: 'power3.inOut',
  }, 1.5);
  showFurniture('essay', 1.84);
  activateStage(1, 1.84);

  tweenOperationLayout(tl, refs, frameLayout('structure'), {
    duration: 0.88,
    ease: 'power3.inOut',
  }, 2.72);
  showFurniture('structure', 3.08);
  activateStage(2, 3.08);

  refs.costProjectionStages.forEach((stage) => {
    tl.from(stage.querySelector('.cost-projection-node'), {
      scale: 0,
      transformOrigin: 'center',
      duration: 0.28,
      ease: 'back.out(2)',
    }, 0.25);
  });

  return tl;
}
