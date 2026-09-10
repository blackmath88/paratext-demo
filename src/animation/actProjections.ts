/** Virtualized state. Shared state fans out into coherent checkout views. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

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
  tl.to(refs.operations, { opacity: 0, duration: 0.35 }, 0);
  tl.set(refs.frameFurniture, { opacity: 0 }, 0);
  tl.set(refs.reframeCurrent, { opacity: 0 }, 0);

  return tl;
}
