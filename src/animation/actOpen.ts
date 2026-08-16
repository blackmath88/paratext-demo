/** Open. The material remains visible; the viewer chooses its frame. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export function actOpen(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();
  const specFurniture = refs.frameFurniture.filter((group) => group.dataset.frame === 'spec');

  tl.set(refs.open, { opacity: 1 }, 0);
  tl.to(refs.cost, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0);
  tl.to(refs.reframeCurrent, { opacity: 0, duration: 0.45 }, 0.05);
  tl.to(specFurniture, { opacity: 0.36, duration: 0.5 }, 0.05);
  tl.from(refs.openQuestion, {
    opacity: 0,
    y: 7,
    letterSpacing: '0.08em',
    duration: 0.75,
    ease: 'power2.out',
  }, 0.25);

  return tl;
}
