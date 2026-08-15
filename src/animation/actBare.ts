/** Presentation. The text is already present; apparent neutrality is the state. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export function actBare(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // No reveal: words already occupy a typographically framed field before
  // their material support becomes perceptible.
  tl.set([refs.leaf, refs.leafEdge, refs.leafVerso], { opacity: 0 }, 0);
  tl.set(refs.body, { scale: 1.34, transformOrigin: '50% 48%' }, 0);
  tl.set(refs.bodyLines, { fill: '#d4ccbc', opacity: 1 }, 0);
  tl.set(refs.initial, { fill: '#c78b80', opacity: 1 }, 0);
  tl.to({ held: 0 }, { held: 1, duration: 2.4, ease: 'none' }, 0);

  if (mode === 'cinematic') {
    tl.to(refs.dust, { y: -8, opacity: 0.34, duration: 2.4, ease: 'none' }, 0);
  }

  return tl;
}
