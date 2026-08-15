/** The tube. Conversation grows until chronology becomes a scroll. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperation } from './operations';

export function actTube(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(refs.aiInput, { opacity: 0.34, duration: 0.55 }, 0);
  tl.to(refs.chatClipRect, { attr: { x: 420, width: 600 }, duration: 1.0, ease: 'power2.inOut' }, 0.15);
  tl.to(refs.aiScrollThumb, { attr: { d: 'M 1058 430 V 486' }, duration: 1.2, ease: 'power3.inOut' }, 0.15);

  // Representative turns imply scale without manufacturing hundreds of nodes.
  // Older turns travel above the viewport as later turns enter below.
  refs.operationNodes.forEach((node, i) => {
    const targetX = node.dataset.role === 'user' ? 470 : 410;
    const streamY = -260 + i * 100;
    tweenOperation(tl, refs, i, {
      x: targetX,
      y: streamY,
      scale: 0.92,
      opacity: 1,
    }, {
      duration: 1.25,
      ease: 'power3.inOut',
    }, 0.08 + i * 0.055);
  });

  // Pull back: the screen remains a viewport, while the chronological surface
  // is revealed to extend far beyond it in both directions.
  tl.set(refs.operations, { attr: { 'clip-path': '' } }, 1.55);
  tl.set(refs.aiTube, { opacity: 1 }, 1.5);
  tl.from(refs.aiTube.querySelector('.ai-tube-surface'), { opacity: 0, duration: 0.65 }, 1.5);
  tl.from(refs.aiTube.querySelectorAll('.ai-continuation'), { opacity: 0, duration: 0.55, stagger: 0.12 }, 1.72);
  refs.operationNodes.forEach((node, i) => {
    const streamX = node.dataset.role === 'user' ? 470 : 410;
    const streamY = -260 + i * 100;
    tweenOperation(tl, refs, i, {
      x: 720 + (streamX - 720) * 0.48,
      y: 450 + (streamY - 450) * 0.48 + 12,
      scale: 0.92 * 0.48,
      opacity: 1,
    }, {
      duration: 1.2,
      ease: 'power3.inOut',
    }, 1.55);
  });
  tl.to(refs.aiScreenFrame, { opacity: 0.42, duration: 0.8 }, 1.62);
  tl.to(refs.aiConversation.querySelectorAll('.ai-screen-rule, .ai-screen-title, .ai-screen-status, #ai-input'), {
    opacity: 0.28, duration: 0.7,
  }, 1.62);
  tl.to(refs.aiScrollbar, { opacity: 0.7, duration: 0.65 }, 1.7);

  // Stable endpoint before the master timeline's own plateau is applied.
  tl.to({ held: 0 }, { held: 1, duration: 0.25, ease: 'none' }, 2.8);
  return tl;
}
