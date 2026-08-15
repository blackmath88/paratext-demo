/** Page. The presentation discloses the material boundary latent in it. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export function actPage(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Contracting measure and emerging material are one movement: the paper is
  // not placed behind a finished block; the existing presentation finds its edge.
  tl.to(refs.body, { scale: 1, duration: 2.2, ease: 'power2.inOut', transformOrigin: '50% 48%' }, 0);
  tl.to(refs.bodyLines, { fill: '#2b2318', duration: 1.65, ease: 'power1.inOut' }, 0.35);
  tl.to(refs.initial, { fill: '#9d3f38', duration: 1.65, ease: 'power1.inOut' }, 0.35);
  tl.to(refs.leaf, { opacity: 1, duration: 1.75, ease: 'power1.inOut' }, 0.28);
  tl.to(refs.leafEdge, { opacity: 0.28, duration: 1.45, ease: 'power1.inOut' }, 0.55);
  tl.to(refs.leafVerso, { opacity: 0.34, x: 0, duration: 1.4, ease: 'power2.out' }, 0.8);

  if (mode === 'cinematic') {
    tl.to(refs.dust, { opacity: 0.52, duration: 2, ease: 'none' }, 0);
  }
  return tl;
}
