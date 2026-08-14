/** Act 06 — Fragmented frames. Each tool is coherent; their relationships are not. */

import gsap from 'gsap';
import { APP_FRAME, FRAGMENT_WINDOWS, framePath } from '../scene/markup';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export function actFragments(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.set(refs.fragments, { opacity: 1 }, 0);
  refs.fragmentFrames.forEach((path, i) => {
    const target = FRAGMENT_WINDOWS[i];
    if (!target) return;
    const state = { ...APP_FRAME };
    tl.to(state, {
      x: target.x, y: target.y, w: target.w, h: target.h,
      duration: 1.55,
      ease: 'power3.inOut',
      onUpdate: () => path.setAttribute('d', framePath(state.x, state.y, state.w, state.h)),
    }, i * 0.07);
  });
  tl.from(refs.fragmentWindows.map((window) => window.querySelector('.fragment-window-rule')), {
    opacity: 0, duration: 0.55, stagger: 0.07,
  }, 0.95);
  tl.from(refs.fragmentWindows.map((window) => window.querySelector('.fragment-window-title')), {
    opacity: 0, duration: 0.45, stagger: 0.06,
  }, 1.05);

  // The application shell loses its authority as each local frame claims a
  // different part of the work. It remains faintly visible as their ancestor.
  tl.to(refs.leaf, { opacity: 0.08, duration: 1.3, ease: 'power2.inOut' }, 0.25);
  tl.to(refs.leafEdge, { opacity: 0.08, duration: 1.2 }, 0.25);
  tl.to(refs.application, { opacity: 0.08, duration: 1.2, ease: 'power2.inOut' }, 0.3);
  tl.to([refs.rulePaths[0], refs.rulePaths[1]], { opacity: 0.06, duration: 0.9 }, 0.3);
  tl.to(refs.printNotes, { opacity: 0.12, duration: 0.8 }, 0.35);

  // The persistent document is claimed by the draft window rather than
  // replaced by a mock document.
  tl.to(refs.body, { x: 530, y: -80, scale: 0.52, transformOrigin: '466px 264px', duration: 1.55, ease: 'power3.inOut' }, 0.25);
  tl.to(refs.printTitle, { x: 530, y: -52, scale: 0.7, transformOrigin: '466px 206px', duration: 1.5, ease: 'power3.inOut' }, 0.25);
  tl.to(refs.printCaput, { opacity: 0.35, x: 530, y: -48, scale: 0.7, transformOrigin: '466px 234px', duration: 1.4 }, 0.3);

  tl.set(refs.operations, { opacity: 1 }, 0.4);
  refs.operationNodes.forEach((node, i) => {
    const winIndex = i % FRAGMENT_WINDOWS.length;
    const slot = Math.floor(i / FRAGMENT_WINDOWS.length);
    const win = FRAGMENT_WINDOWS[winIndex];
    if (!win) return;
    const originX = Number(node.dataset.originX);
    const originY = Number(node.dataset.originY);
    const targetX = win.x + 20;
    const targetY = win.y + 70 + slot * 58;
    tl.fromTo(node, { opacity: 0 }, {
      opacity: 1,
      x: targetX - originX,
      y: targetY - originY,
      duration: 1.3,
      ease: 'power3.inOut',
    }, 0.45 + i * 0.025);
  });

  // Only after the windows settle do formerly adjacent relations become
  // visible as lines stranded in the gaps between their owning tools.
  tl.fromTo(refs.fragmentRelations, { opacity: 0 }, { opacity: 0.7, duration: 0.9, ease: 'power1.out' }, 1.75);
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.22, duration: 2, ease: 'none' }, 0);
  return tl;
}
