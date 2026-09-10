/** The tube. New turns accumulate while earlier knowledge leaves usable context. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperation } from './operations';

export function actTube(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(refs.aiInput, { opacity: 0.34, duration: 0.55 }, 0);
  tl.to(refs.chatClipRect, { attr: { x: 575, width: 520 }, duration: 1.0, ease: 'power2.inOut' }, 0.15);
  tl.to(refs.aiScrollThumb, { attr: { d: 'M 1142 430 V 486' }, duration: 1.2, ease: 'power3.inOut' }, 0.15);

  // First preserve the familiar chat scale: the viewer sees useful exchanges
  // physically pushed away as new turns arrive.
  refs.operationNodes.forEach((node, i) => {
    const targetX = node.dataset.role === 'user' ? 650 : 590;
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

  // Only after accumulation has made the viewport inadequate do we expose the
  // governing structure: a small working-context aperture in a much longer tube.
  tl.set(refs.operations, { attr: { 'clip-path': '' } }, 2.05);
  tl.set(refs.aiTube, { opacity: 1 }, 2.0);
  tl.from(refs.aiTube.querySelector('.ai-tube-spine'), {
    opacity: 0, scaleY: 0.1, transformOrigin: 'center', duration: 0.65,
  }, 2.0);
  tl.from(refs.aiTube.querySelector('.ai-context-window'), {
    opacity: 0, scaleY: 0.15, transformOrigin: 'center', duration: 0.7, ease: 'power2.out',
  }, 2.1);
  tl.from(refs.aiTube.querySelectorAll('.ai-continuation, .ai-context-label'), {
    opacity: 0, duration: 0.45, stagger: 0.07,
  }, 2.2);
  tl.from(refs.aiTube.querySelector('.ai-context-statement'), {
    opacity: 0, y: 12, duration: 0.55,
  }, 2.42);
  tl.from(refs.aiTube.querySelectorAll('.ai-memory-trace'), {
    opacity: 0, y: 14, duration: 0.45, stagger: 0.08,
  }, 2.18);
  refs.operationNodes.forEach((node, i) => {
    const isEarlier = i < 7;
    const streamX = node.dataset.role === 'user' ? 720 : 670;
    const streamY = isEarlier ? 132 + i * 35 : 322 + (i - 7) * 38;
    tweenOperation(tl, refs, i, {
      x: streamX,
      y: streamY,
      scale: isEarlier ? 0.58 : 0.68,
      opacity: isEarlier ? 0.13 : Math.min(0.82, 0.28 + (i - 7) * 0.09),
    }, {
      duration: 1.2,
      ease: 'power3.inOut',
    }, 2.05);
  });
  tl.to(refs.aiScreenFrame, { opacity: 0.38, duration: 0.8 }, 2.12);
  tl.to(refs.aiConversation.querySelectorAll(
    '.ai-screen-rule, .ai-screen-title, .ai-screen-status, #ai-input, .ai-sidebar-surface, .ai-sidebar-brand, .ai-sidebar-item, .ai-sidebar-section, .ai-sidebar-account',
  ), {
    opacity: 0.28, duration: 0.7,
  }, 2.12);
  tl.to(refs.aiScrollbar, { opacity: 0.24, duration: 0.65 }, 2.2);

  // Stable endpoint before the master timeline's own plateau is applied.
  tl.to({ held: 0 }, { held: 1, duration: 0.25, ease: 'none' }, 3.3);
  return tl;
}
