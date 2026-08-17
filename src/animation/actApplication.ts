/** Application. One durable state, observed and changed through several views. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenMaterial } from './material';

export function actApplication(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();
  const [detail, table, form, history, monitor] = refs.appViewLayers;
  const [detailName, tableName, actionName, historyName, monitorName] = refs.appViewNames;
  const stateNodes = refs.appStateSteps.map((step) => step.querySelector('.app-state-node'));
  const stateLabels = refs.appStateSteps.map((step) => step.querySelector('.app-state-label'));
  const monitorCopy = monitor?.querySelectorAll<SVGTextElement>('.app-view-heading, .app-monitor-title, .app-view-note');

  // Hypertext and application share a single digital substrate. The frame
  // changes function without pretending that a new physical page arrived.
  tl.set(refs.application, { opacity: 1 }, 0);
  tl.set(refs.appSubstrate, { opacity: 0 }, 0);
  tl.set([refs.appChrome, refs.appState, refs.appMetatext], { opacity: 0 }, 0);
  tl.set(refs.appViewLayers, { opacity: 0, x: 0, y: 0 }, 0);
  tl.set(refs.appViewNames, { opacity: 0 }, 0);
  tl.set(refs.appStatusReviewed, { opacity: 1 }, 0);
  tl.set(refs.appStatusApproved, { opacity: 0 }, 0);
  tl.set(refs.appStateReviewed, { opacity: 1 }, 0);
  tl.set(refs.appStateApproved, { opacity: 0 }, 0);
  tl.set(refs.appCodeAfter, { opacity: 0 }, 0);
  tl.set(refs.appGeneratedAside, { opacity: 0 }, 0);
  tl.to(refs.hypertext, { opacity: 0, duration: 0.72, ease: 'power1.inOut' }, 0);
  tl.fromTo(refs.appSubstrate, {
    attr: { x: 140, y: 42, width: 1160, height: 816 },
    fill: '#10171d',
    opacity: 0,
  }, {
    opacity: 1,
    fill: '#0d171e',
    duration: 0.8,
    ease: 'power1.inOut',
  }, 0.08);
  tweenMaterial(tl, refs, {
    mode: 'screen',
    fieldColor: '#071018',
    gridOpacity: mode === 'cinematic' ? 0.075 : 0.045,
    dustOpacity: 0,
    vignetteOpacity: 0.18,
  }, { duration: 1.1, ease: 'power1.inOut' }, 0);

  tl.to(refs.appChrome, { opacity: 1, duration: 0.55 }, 0.35);
  tl.to(refs.appState, { opacity: 1, duration: 0.65, y: 0, ease: 'power2.out' }, 0.5);
  if (detail) tl.to(detail, { opacity: 1, duration: 0.65, ease: 'power2.out' }, 0.85);
  if (detailName) tl.to(detailName, { opacity: 1, duration: 0.35 }, 0.85);

  // Different views arrive sequentially, but the state spine never leaves.
  if (detail && table) {
    tl.to(detail, { opacity: 0, x: -24, duration: 0.35, ease: 'power2.in' }, 1.8);
    tl.fromTo(table, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.48, ease: 'power2.out' }, 1.92);
  }
  if (detailName && tableName) {
    tl.to(detailName, { opacity: 0, duration: 0.2 }, 1.8);
    tl.to(tableName, { opacity: 1, duration: 0.3 }, 1.96);
  }
  if (table && form) {
    tl.to(table, { opacity: 0, x: -24, duration: 0.35, ease: 'power2.in' }, 2.82);
    tl.fromTo(form, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.48, ease: 'power2.out' }, 2.94);
  }
  if (tableName && actionName) {
    tl.to(tableName, { opacity: 0, duration: 0.2 }, 2.82);
    tl.to(actionName, { opacity: 1, duration: 0.3 }, 2.98);
  }

  // Paired labels keep the state change reversible under scroll scrubbing.
  tl.to(refs.appAction, { scale: 0.97, transformOrigin: '399px 495px', duration: 0.12, yoyo: true, repeat: 1 }, 3.68);
  tl.to(refs.appStateProgress, { attr: { d: 'M 330 758 H 850' }, duration: 0.7, ease: 'power2.inOut' }, 3.82);
  if (stateNodes[1]) tl.to(stateNodes[1], { fill: '#6e9d91', stroke: '#6e9d91', duration: 0.35 }, 3.9);
  if (stateLabels[1]) tl.to(stateLabels[1], { fill: '#9aa9b0', duration: 0.35 }, 3.9);
  if (stateNodes[2]) tl.to(stateNodes[2], { fill: '#d4ad5b', stroke: '#d4ad5b', duration: 0.45 }, 4.12);
  if (stateLabels[2]) tl.to(stateLabels[2], { fill: '#e8d5a8', duration: 0.45 }, 4.12);
  tl.to([...refs.appStatusReviewed, refs.appStateReviewed], { opacity: 0, duration: 0.24 }, 4.02);
  tl.to([...refs.appStatusApproved, refs.appStateApproved], { opacity: 1, duration: 0.34 }, 4.18);

  if (form && history) {
    tl.to(form, { opacity: 0, x: -24, duration: 0.36, ease: 'power2.in' }, 4.65);
    tl.fromTo(history, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 4.78);
  }
  if (actionName && historyName) {
    tl.to(actionName, { opacity: 0, duration: 0.2 }, 4.65);
    tl.to(historyName, { opacity: 1, duration: 0.3 }, 4.82);
  }
  if (history && monitor) {
    tl.to(history, { opacity: 0, x: -24, duration: 0.36, ease: 'power2.in' }, 5.55);
    tl.fromTo(monitor, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 5.68);
  }
  if (historyName && monitorName) {
    tl.to(historyName, { opacity: 0, duration: 0.2 }, 5.55);
    tl.to(monitorName, { opacity: 1, duration: 0.3 }, 5.72);
  }

  // Metatext acts on the current view instead of appearing as a detached demo.
  tl.to(refs.appMetatext, { opacity: 1, duration: 0.55, ease: 'power2.out' }, 6.5);
  tl.to(refs.appCodeBefore, { opacity: 0, duration: 0.25 }, 7.05);
  tl.to(refs.appCodeAfter, { opacity: 1, duration: 0.35 }, 7.16);
  tl.to(refs.appGeneratedMain, { attr: { d: 'M 520 172 H 1160 V 626 H 520 Z' }, duration: 0.8, ease: 'power3.inOut' }, 7.08);
  if (monitorCopy) tl.to(monitorCopy, { x: 250, duration: 0.8, ease: 'power3.inOut' }, 7.08);
  tl.to(refs.appGeneratedAside, { opacity: 1, duration: 0.48, ease: 'power2.out' }, 7.62);
  return tl;
}
