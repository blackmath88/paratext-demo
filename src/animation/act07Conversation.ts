/** Act 07 — Conversation + artifact. Proximity returns; provenance does not. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenFrame, tweenLeafFrame } from './frames';

export function actConversation(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Six local frames contract into the now-familiar two-region answer.
  refs.fragmentFrames.forEach((_, i) => {
    const left = i < 4;
    const target = left
      ? { x: 160, y: 70, w: 520, h: 768 }
      : { x: 680, y: 70, w: 600, h: 768 };
    tweenFrame(tl, refs, i, target, { duration: 1.25, ease: 'power3.inOut' }, i * 0.035);
  });
  tl.to(refs.fragmentWindows, { opacity: 0, duration: 0.55, stagger: 0.025 }, 0.85);
  tl.to(refs.fragmentRelations, { opacity: 0, duration: 0.45 }, 0.15);

  // The original application surface returns as the shared split frame.
  tweenLeafFrame(tl, refs, { x: 160, y: 70, w: 1120, h: 768, wobble: 0 }, {
    duration: 1.25,
    ease: 'power3.inOut',
  }, 0.2);
  tl.to(refs.leaf, { opacity: 0.96, fill: '#e9e7df', duration: 0.9 }, 0.45);
  tl.to(refs.leafEdge, { opacity: 0.45, duration: 0.8 }, 0.45);
  tl.set(refs.conversation, { opacity: 1 }, 0.55);
  tl.from(refs.conversation.querySelectorAll('.conversation-rule, .conversation-heading'), {
    opacity: 0, duration: 0.55, stagger: 0.08,
  }, 0.55);

  refs.operationNodes.forEach((node, i) => {
    const originX = Number(node.dataset.originX);
    const originY = Number(node.dataset.originY);
    const isArtifact = node.dataset.kind === 'artifact';
    const targetX = isArtifact ? 730 : 190;
    const artifactSlot = node.dataset.operation === 'artifact-print' ? 0 : 1;
    const targetY = isArtifact ? 650 + artifactSlot * 42 : 158 + i * 38;
    tl.to(node, {
      x: targetX - originX,
      y: targetY - originY,
      scale: isArtifact ? 0.92 : 0.88,
      transformOrigin: `${originX}px ${originY}px`,
      duration: 1.3,
      ease: 'power3.inOut',
    }, 0.25 + i * 0.018);
  });
  tl.to(refs.operations.querySelectorAll('.operation-label'), { fill: '#393b37', duration: 0.75 }, 0.55);
  tl.to(refs.operations.querySelectorAll('.operation-kind'), { fill: '#777a74', duration: 0.75 }, 0.55);

  // The same text leaves the draft window and becomes the artifact pane.
  tl.to(refs.body, { x: 275, y: -80, scale: 0.86, transformOrigin: '466px 264px', duration: 1.35, ease: 'power3.inOut' }, 0.3);
  tl.to(refs.printTitle, { x: 275, y: -48, scale: 0.9, transformOrigin: '466px 206px', duration: 1.3, ease: 'power3.inOut' }, 0.3);
  tl.to(refs.printCaput, { opacity: 0.5, x: 275, y: -42, scale: 0.82, transformOrigin: '466px 234px', duration: 1.2 }, 0.34);
  tl.to(refs.printNotes, { opacity: 0.3, x: -210, y: 210, duration: 1.15, ease: 'power2.inOut' }, 0.4);
  tl.to(refs.application, { opacity: 0, duration: 0.65 }, 0.25);

  // Relief first; only then do the two unresolved failures assert themselves.
  tl.fromTo(refs.conversationSupersession, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.65);
  tl.fromTo(refs.conversationOrphan, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.9);
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.05, duration: 1.6, ease: 'none' }, 0);
  return tl;
}
