/** Open. The operation field recedes and the final proposition holds. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export function actOpen(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.set(refs.open, { opacity: 1 }, 0);
  tl.to(refs.cost, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0);
  tl.to(refs.reframeOverview, { opacity: 0, duration: 0.45 }, 0);
  tl.to(refs.reframeCurrent, { opacity: 0, duration: 0.45 }, 0.05);
  tl.to(refs.frameFurniture, { opacity: 0, duration: 0.5 }, 0.05);
  tl.to(refs.operations, { opacity: 0.055, duration: 0.65 }, 0.05);
  tl.from(refs.openQuestion, {
    opacity: 0,
    y: 9,
    letterSpacing: '0.08em',
    duration: 0.9,
    ease: 'power2.out',
  }, 0.3);
  tl.from(refs.openSupport, {
    opacity: 0,
    y: 6,
    duration: 0.7,
    ease: 'power2.out',
  }, 0.82);

  return tl;
}
