/** AI conversation. Specialized frames collapse into language. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenFrame } from './frames';
import { tweenMaterial } from './material';
import { tweenOperation } from './operations';

const CHAT_FRAME = { x: 360, y: 88, w: 720, h: 724 };

export function actConversation(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  refs.fragmentFrames.forEach((_, i) => {
    tweenFrame(tl, refs, i, CHAT_FRAME, { duration: 1.35, ease: 'power4.inOut' }, i * 0.035);
  });
  tl.to(refs.fragments.querySelectorAll('.fragment-window-title, .fragment-window-rule'), {
    opacity: 0, duration: 0.55, stagger: 0.025,
  }, 0.12);
  tl.to(refs.fragmentRelations, { opacity: 0, duration: 0.45 }, 0.08);
  tl.to(refs.fragmentWindows.slice(1), { opacity: 0, duration: 0.45, stagger: 0.03 }, 0.92);

  tweenMaterial(tl, refs, {
    mode: 'screen',
    fieldColor: '#07090c',
    gridOpacity: 0.16,
    dustOpacity: 0,
    vignetteOpacity: 0.34,
  }, { duration: 1.45, ease: 'power2.inOut' }, 0.1);

  tl.to([refs.body, refs.printTitle, refs.printCaput, refs.printNotes], {
    x: 150, y: 120, scale: 0.28, opacity: 0, duration: 1.15, ease: 'power3.inOut',
  }, 0.18);
  tl.to([refs.leaf, refs.leafEdge], { opacity: 0, duration: 0.7 }, 0.55);

  tl.set(refs.aiConversation, { opacity: 1 }, 0.88);
  tl.from(refs.aiConversation.querySelectorAll('.ai-screen-rule, .ai-screen-title, .ai-screen-status'), {
    opacity: 0, duration: 0.45, stagger: 0.06,
  }, 0.92);
  tl.to(refs.fragmentWindows[0] ?? {}, { opacity: 0, duration: 0.35 }, 1.02);
  tl.from(refs.aiInput, { opacity: 0, y: 8, duration: 0.55, ease: 'power2.out' }, 1.05);
  tl.from(refs.aiScrollbar, { opacity: 0, duration: 0.4 }, 1.08);

  tl.set(refs.operations, { attr: { 'clip-path': 'url(#clip-chat)' } }, 0.82);
  refs.operationNodes.forEach((node, i) => {
    const visible = i < 4;
    const targetX = node.dataset.role === 'user' ? 470 : 410;
    const targetY = 220 + i * 128;
    tweenOperation(tl, refs, i, {
      x: targetX,
      y: targetY,
      scale: 1,
      opacity: visible ? 1 : 0,
    }, {
      duration: 1.0,
      ease: 'power3.inOut',
    }, 0.72 + i * 0.025);
  });
  tl.to(refs.operations.querySelectorAll('.operation-label'), { fill: '#d8dde3', duration: 0.6 }, 0.85);
  tl.to(refs.operations.querySelectorAll('.operation-kind'), { fill: '#727b85', duration: 0.6 }, 0.85);
  tl.to(refs.operations.querySelectorAll('.operation-mark'), { opacity: 0.72, duration: 0.5 }, 0.85);

  if (mode === 'static') tl.set(refs.screenGrid, { opacity: 0.16 }, 1.55);
  return tl;
}
