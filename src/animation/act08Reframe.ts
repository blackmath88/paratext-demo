/** Act 08 — Reframed. Context operations become source; views become projections. */

import gsap from 'gsap';
import { frameLayout, overviewLayout, type FrameId, type OperationLayout } from './operationLayouts';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

function placeOperations(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  layout: OperationLayout,
  at: number,
  duration: number,
): void {
  refs.operationNodes.forEach((node, i) => {
    const id = node.dataset.operation;
    const placement = id ? layout[id] : undefined;
    if (!placement) return;
    const originX = Number(node.dataset.originX);
    const originY = Number(node.dataset.originY);
    tl.to(node, {
      x: placement.x - originX,
      y: placement.y - originY,
      scale: placement.scale,
      opacity: placement.opacity,
      transformOrigin: `${originX}px ${originY}px`,
      duration,
      ease: 'power3.inOut',
    }, at + i * 0.006);
  });
}

function showFrame(tl: gsap.core.Timeline, refs: SceneRefs, frame: FrameId, at: number): void {
  refs.frameFurniture.forEach((group) => {
    tl.set(group, { opacity: group.dataset.frame === frame ? 1 : 0 }, at);
  });
  tl.set(refs.reframeCurrent, { textContent: `FRAME / ${frame === 'essay' ? 'READ' : frame.toUpperCase()}` }, at);
}

export function actReframe(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to([refs.conversationSupersession, refs.conversationOrphan], { opacity: 0, duration: 0.45 }, 0);
  tl.to(refs.conversation, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0.15);
  tl.to([refs.leaf, refs.leafEdge], { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 0.2);

  // The artifact contracts toward its durable artifact operation. Its words
  // are not replaced; they become one identified result among the operations.
  tl.to(refs.body, { x: 330, y: 145, scale: 0.18, opacity: 0, transformOrigin: '466px 264px', duration: 1.15, ease: 'power3.inOut' }, 0.05);
  tl.to([refs.printTitle, refs.printCaput, refs.printNotes], { x: 330, y: 145, scale: 0.2, opacity: 0, duration: 1.05, ease: 'power3.inOut' }, 0.08);

  tl.set(refs.reframe, { opacity: 1 }, 0.45);
  tl.from(refs.reframeOverview.querySelectorAll('.reframe-cluster-label'), { opacity: 0, duration: 0.45, stagger: 0.05 }, 0.55);
  placeOperations(tl, refs, overviewLayout(), 0.25, 1.25);
  tl.to(refs.operations.querySelectorAll('.operation-label'), { fill: '#d0cabd', duration: 0.65 }, 0.35);
  tl.to(refs.operations.querySelectorAll('.operation-kind'), { fill: '#8d8b84', duration: 0.65 }, 0.35);

  // Relations appear after identity has stabilized: supersession is structure,
  // no longer an annotation laid over two equivalent chronological rows.
  tl.fromTo(refs.reframeRelations, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.05);
  tl.from(refs.projectionPorts, { opacity: 0, x: -18, duration: 0.65, stagger: 0.09, ease: 'power2.out' }, 1.2);

  // The scroll demonstrates that each named frame recomposes these exact
  // nodes. There are no duplicated view-specific operation elements.
  const demonstrations: Array<{ frame: FrameId; at: number }> = [
    { frame: 'essay', at: 2.0 },
    { frame: 'thread', at: 2.95 },
    { frame: 'structure', at: 3.9 },
    { frame: 'spec', at: 4.85 },
    { frame: 'essay', at: 5.8 },
  ];
  tl.to(refs.reframeOverview, { opacity: 0, duration: 0.55 }, 1.8);
  demonstrations.forEach(({ frame, at }) => {
    showFrame(tl, refs, frame, at);
    placeOperations(tl, refs, frameLayout(frame), at, mode === 'static' ? 0.01 : 0.72);
  });

  tl.to(refs.reframeCurrent, { opacity: 1, duration: 0.4 }, 5.9);
  // Reserve a stable endpoint before control is handed to the live selector.
  tl.to({ held: 0 }, { held: 1, duration: 0.3, ease: 'none' }, 6.9);
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.18, duration: 2, ease: 'none' }, 0);
  return tl;
}
