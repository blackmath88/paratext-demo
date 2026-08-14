/** Act 06 — Fragmented frames. Each tool is coherent; their relationships are not. */

import gsap from 'gsap';
import { APP_FRAME, FRAGMENT_WINDOWS, fragmentPlacement, framePath } from '../scene/markup';
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
  // Coincident frames begin transparent; otherwise six stacked fills flash as
  // a false new surface before separation has occurred.
  tl.to(refs.fragmentFrames, { fill: 'rgba(233, 231, 223, 0.055)', duration: 0.65, stagger: 0.04 }, 0.9);
  tl.from(refs.fragmentWindows.map((window) => window.querySelector('.fragment-window-rule')), {
    opacity: 0, duration: 0.55, stagger: 0.07,
  }, 1.15);
  tl.from(refs.fragmentWindows.map((window) => window.querySelector('.fragment-window-title')), {
    opacity: 0, duration: 0.45, stagger: 0.06,
  }, 1.25);

  // Application regions are claimed by different tools before the parent
  // shell recedes. This makes the split causal rather than six new windows
  // appearing on top of an application screenshot.
  const navRegion = refs.application.querySelectorAll('#app-nav-section, .app-nav-item');
  const inspectorRegion = refs.application.querySelectorAll(
    '#app-inspector-label, [id^="app-meta"], #app-missing-reason, [id^="app-history"]',
  );
  const headerRegion = refs.application.querySelectorAll('#app-brand, #app-search, #app-content-label');
  tl.to(navRegion, { x: 690, y: 330, opacity: 0, duration: 1.25, ease: 'power3.inOut' }, 0.18);
  tl.to(refs.appRecords, { x: 505, y: -28, opacity: 0, duration: 1.25, ease: 'power3.inOut' }, 0.2);
  tl.to(inspectorRegion, { x: -790, y: 302, opacity: 0, duration: 1.3, ease: 'power3.inOut' }, 0.2);
  tl.to(headerRegion, { y: -32, opacity: 0, duration: 0.9, ease: 'power2.in' }, 0.25);
  tl.to(refs.appRules, { opacity: 0, duration: 0.85 }, 0.55);
  tl.to(refs.application, { opacity: 0.12, duration: 0.35 }, 1.3);
  tl.to(refs.leaf, { opacity: 0.08, duration: 1.3, ease: 'power2.inOut' }, 0.35);
  tl.to(refs.leafEdge, { opacity: 0.08, duration: 1.2 }, 0.35);
  tl.to([refs.rulePaths[0], refs.rulePaths[1]], { opacity: 0.06, duration: 0.9 }, 0.55);
  tl.to(refs.printNotes, { opacity: 0.12, duration: 0.8 }, 0.6);

  // The persistent document is claimed by the draft window rather than
  // replaced by a mock document.
  tl.to(refs.body, { x: 530, y: -80, scale: 0.52, transformOrigin: '466px 264px', duration: 1.55, ease: 'power3.inOut' }, 0.25);
  tl.to(refs.printTitle, { x: 530, y: -52, scale: 0.7, transformOrigin: '466px 206px', duration: 1.5, ease: 'power3.inOut' }, 0.25);
  tl.to(refs.printCaput, { opacity: 0.35, x: 530, y: -48, scale: 0.7, transformOrigin: '466px 234px', duration: 1.4 }, 0.3);

  tl.set(refs.operations, { opacity: 1 }, 0.4);
  refs.operationNodes.forEach((node, i) => {
    const operationId = node.dataset.operation;
    if (!operationId) return;
    const originX = Number(node.dataset.originX);
    const originY = Number(node.dataset.originY);
    const target = fragmentPlacement(operationId);
    tl.fromTo(node, { opacity: 0 }, {
      opacity: 1,
      x: target.x - originX,
      y: target.y - originY,
      duration: 1.3,
      ease: 'power3.inOut',
    }, 0.45 + i * 0.025);
  });

  // Only after the windows settle do formerly adjacent relations become
  // visible as lines stranded in the gaps between their owning tools.
  const relationPaths = refs.fragmentRelations.querySelectorAll<SVGPathElement>('.fragment-relation');
  relationPaths.forEach((path, i) => {
    const length = path.getTotalLength();
    tl.fromTo(path, { opacity: 0, strokeDasharray: length, strokeDashoffset: length }, {
      opacity: 0.72, strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut',
    }, 1.65 + i * 0.08);
    tl.set(path, { strokeDasharray: '4 7' }, 2.4 + i * 0.08);
  });
  if (mode === 'cinematic') tl.to(refs.dust, { opacity: 0.22, duration: 2, ease: 'none' }, 0);
  return tl;
}
