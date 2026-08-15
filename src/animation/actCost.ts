/** The cost. A projection changes while the reader is tracking an operation. */

import gsap from 'gsap';
import { frameLayout } from './operationLayouts';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperationLayout } from './operations';

export function actCost(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Establish a shared pointing position before the system changes the frame.
  tl.set(refs.cost, { opacity: 1 }, 0);
  tl.from(refs.costTrackedReference, { opacity: 0, duration: 0.45 }, 0);

  // The reader does not initiate this transition. claim-presentation travels
  // from the Read column into Spec's subordinate context; it is never removed.
  tweenOperationLayout(tl, refs, frameLayout('spec'), {
    duration: 1.05,
    ease: 'power3.inOut',
  }, 0.62);
  refs.frameFurniture.forEach((group) => {
    tl.set(group, { opacity: group.dataset.frame === 'spec' ? 1 : 0 }, 0.9);
  });
  tl.set(refs.reframeCurrent, { textContent: 'FRAME / SPEC / SELECTED FOR YOU' }, 0.9);
  tl.from(refs.costSelectedView, { opacity: 0, y: -5, duration: 0.45 }, 0.78);

  // The empty marker stays at the prior coordinate: identity survived, shared
  // spatial certainty did not.
  tl.from(refs.costConsequences.querySelectorAll('.cost-consequence'), {
    opacity: 0,
    x: 8,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out',
  }, 1.62);

  return tl;
}
