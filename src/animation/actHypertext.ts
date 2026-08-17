/** Hypertext. Addressable places replace physical adjacency with topology. */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenMaterial } from './material';

function linkPosition(place: SVGGElement): { x: number; y: number } {
  const link = place.querySelector<SVGTextElement>('.hypertext-link');
  return {
    x: Number(link?.dataset.linkX ?? 340),
    y: Number(link?.dataset.linkY ?? 430),
  };
}

export function actHypertext(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();
  const places = refs.hypertextPlaces;
  const travel = mode === 'compact' ? 34 : 62;
  const home = places[0];

  tl.set(refs.hypertext, { opacity: 1 }, 0);
  tl.set(places, { opacity: 0, x: 0, y: 0, scale: 1, transformOrigin: '50% 50%' }, 0);
  tl.set(refs.hypertextControls, { opacity: 0 }, 0);
  tl.set(refs.hypertextHistoryMarks, { opacity: 0.18 }, 0);
  tl.set(refs.hypertextActions, { opacity: 0, y: 5 }, 0);
  tl.set(refs.hypertextStatus, { opacity: 0 }, 0);
  tl.set(refs.hypertextFocus, { opacity: 0 }, 0);
  tl.set(refs.hypertextPointer, { opacity: 0, x: 520, y: 396, scale: 1 }, 0);

  // The screen begins at the exact Magazine footprint, then exceeds the leaf.
  tl.fromTo(refs.hypertextSubstrate, {
    attr: { x: 250, y: 54, width: 940, height: 792 },
    fill: '#eee9df',
    opacity: 0,
  }, {
    attr: { x: 140, y: 42, width: 1160, height: 816 },
    fill: '#10171d',
    opacity: 1,
    duration: 1.65,
    ease: 'power3.inOut',
  }, 0.72);

  tweenMaterial(tl, refs, {
    mode: 'screen',
    fieldColor: '#071018',
    gridOpacity: 0.055,
    dustOpacity: 0,
    vignetteOpacity: 0.22,
  }, { duration: 1.7, ease: 'power2.inOut' }, 0.7);

  // Actionability appears before the medium changes decisively.
  tl.to(refs.hypertextFocus, { opacity: 0.9, duration: 0.35 }, 0.28);
  tl.to(refs.hypertextPointer, { opacity: 1, x: 514, y: 406, duration: 0.48, ease: 'power2.out' }, 0.38);
  tl.to(refs.hypertextPointer, { scale: 0.82, duration: 0.1, yoyo: true, repeat: 1 }, 0.92);
  tl.to(refs.hypertextFocus, { fill: 'rgba(212, 173, 91, 0.18)', duration: 0.18, yoyo: true, repeat: 1 }, 0.9);

  if (home) {
    tl.fromTo(home, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: 'power1.out' }, 1.05);
  }
  tl.to([
    refs.leafGroup,
    refs.body,
    refs.rules,
    refs.print,
    refs.editorial,
    refs.magazine,
  ], { opacity: 0, duration: 0.8, ease: 'power1.inOut' }, 1.15);
  tl.to(refs.hypertextControls, { opacity: 1, duration: 0.55 }, 1.42);
  const firstMark = refs.hypertextHistoryMarks[0];
  if (firstMark) tl.to(firstMark, { opacity: 0.9, duration: 0.3 }, 1.5);

  const forwardTimes = [2.45, 3.75, 4.98, 6.14, 7.23, 8.25, 9.21, 10.12];
  forwardTimes.forEach((at, index) => {
    const current = places[index];
    const next = places[index + 1];
    if (!current || !next) return;
    const currentLink = linkPosition(current);
    tl.to(refs.hypertextFocus, {
      attr: { x: currentLink.x - 12, y: currentLink.y - 25, width: 210 },
      opacity: 0.88,
      duration: 0.28,
      ease: 'power1.out',
    }, at - 0.42);
    tl.to(refs.hypertextPointer, {
      x: currentLink.x + 174,
      y: currentLink.y - 17,
      opacity: 1,
      duration: 0.32,
      ease: 'power2.out',
    }, at - 0.4);
    tl.to(refs.hypertextPointer, { scale: 0.8, duration: 0.09, yoyo: true, repeat: 1 }, at);
    tl.to(current, {
      opacity: 0, x: -travel, scale: 0.975,
      duration: 0.46, ease: 'power2.in',
    }, at + 0.08);
    tl.fromTo(next, {
      opacity: 0, x: travel, scale: 1.025,
    }, {
      opacity: 1, x: 0, scale: 1,
      duration: 0.58, ease: 'power3.out',
    }, at + 0.22);
    const mark = refs.hypertextHistoryMarks[index + 1];
    if (mark) tl.to(mark, { opacity: 0.9, duration: 0.24 }, at + 0.38);
    tl.to(refs.hypertextFocus, { opacity: 0, duration: 0.2 }, at + 0.18);
  });

  // Four explicit history reversals. Incoming places return from the direction
  // they previously left, so Back reads as memory rather than another link.
  const backTimes = [11.45, 12.28, 13.05, 13.77];
  backTimes.forEach((at, backIndex) => {
    const fromIndex = 8 - backIndex;
    const toIndex = fromIndex - 1;
    const current = places[fromIndex];
    const previous = places[toIndex];
    const action = refs.hypertextActions[backIndex];
    if (!current || !previous) return;
    tl.to(refs.hypertextPointer, { x: 206, y: 82, duration: 0.3, ease: 'power2.out' }, at - 0.3);
    tl.to(refs.hypertextPointer, { scale: 0.8, duration: 0.08, yoyo: true, repeat: 1 }, at);
    if (action) {
      tl.fromTo(action, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.2 }, at - 0.12);
      tl.to(action, { opacity: 0, duration: 0.24 }, at + 0.42);
    }
    tl.to(current, { opacity: 0, x: travel, scale: 1.02, duration: 0.36, ease: 'power2.in' }, at + 0.04);
    tl.fromTo(previous, { opacity: 0, x: -travel, scale: 0.98 }, {
      opacity: 1, x: 0, scale: 1, duration: 0.46, ease: 'power3.out',
    }, at + 0.14);
  });

  // Home is deliberately distinct from repeated Back: it resolves the act at
  // the origin while retaining visible evidence that a deep route occurred.
  const currentAfterBack = places[4];
  const homeAction = refs.hypertextActions[4];
  if (currentAfterBack && home) {
    tl.to(refs.hypertextPointer, { x: 1244, y: 82, duration: 0.38, ease: 'power2.out' }, 14.46);
    tl.to(refs.hypertextPointer, { scale: 0.8, duration: 0.09, yoyo: true, repeat: 1 }, 14.86);
    if (homeAction) {
      tl.fromTo(homeAction, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.24 }, 14.7);
      tl.to(homeAction, { opacity: 0, duration: 0.32 }, 15.35);
    }
    tl.to(currentAfterBack, { opacity: 0, x: travel, scale: 1.02, duration: 0.42 }, 14.9);
    tl.fromTo(home, { opacity: 0, x: -travel, scale: 0.98 }, {
      opacity: 1, x: 0, scale: 1, duration: 0.62, ease: 'power3.out',
    }, 15.08);
  }
  tl.to(refs.hypertextPointer, { opacity: 0, duration: 0.3 }, 15.45);
  tl.to(refs.hypertextStatus, { opacity: 1, duration: 0.55, ease: 'power1.out' }, 15.52);
  return tl;
}
