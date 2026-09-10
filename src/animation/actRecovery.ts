/** Type Anywhere. An append-only stream becomes spatially authorable. */

import gsap from 'gsap';
import { OPERATIONS } from '../data/operations';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { tweenOperation } from './operations';

export function actRecovery(refs: SceneRefs, _mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // 1. Segment: a resolved stretch gains a boundary, title and folio.
  tl.set(refs.recovery, { opacity: 1 }, 0);
  tl.from(refs.recoverySegment.querySelectorAll('.recovery-boundary, .recovery-title-rule'), {
    strokeDasharray: 2400,
    strokeDashoffset: 2400,
    duration: 0.75,
    stagger: 0.08,
    ease: 'power2.inOut',
  }, 0);
  tl.from(refs.recoverySegment.querySelectorAll('.recovery-title, .recovery-folio'), {
    opacity: 0,
    y: 5,
    duration: 0.45,
    stagger: 0.08,
    ease: 'power2.out',
  }, 0.42);
  tl.from(refs.recoverySegment.querySelector('.recovery-paradigm'), {
    opacity: 0, x: -8, duration: 0.45, ease: 'power2.out',
  }, 0.55);
  tl.from(refs.recoveryAppendInput, {
    opacity: 0, y: 8, duration: 0.5, ease: 'power2.out',
  }, 0.55);
  tl.to(refs.aiConversation, { opacity: 0, duration: 0.65 }, 0.08);
  tl.to(refs.page, { opacity: 0, duration: 0.55 }, 0.08);

  let primary = 0;
  const toolIndices: number[] = [];
  OPERATIONS.forEach((operation, i) => {
    if (operation.kind === 'tool') {
      toolIndices.push(i);
      return;
    }
    tweenOperation(tl, refs, i, {
      x: 400,
      y: 230 + primary++ * 40,
      scale: 0.7,
      opacity: 1,
    }, { duration: 0.9, ease: 'power3.inOut' }, 0.25 + primary * 0.025);
  });

  // 2. Apparatus: tool results leave the primary column and become support.
  tl.from(refs.recoveryToolApparatus, { opacity: 0, duration: 0.5 }, 0.78);
  toolIndices.forEach((operationIndex, toolSlot) => {
    tweenOperation(tl, refs, operationIndex, {
      x: 900,
      y: 292 + toolSlot * 88,
      scale: 0.62,
      opacity: 0.58,
    }, { duration: 0.85, ease: 'power3.inOut' }, 0.88 + toolSlot * 0.08);
  });

  // 3. The spatial rule changes. The single append-only input recedes; focus
  // attaches successively beside a paragraph, tool output and artifact.
  tl.to(refs.recoveryAppendInput, {
    opacity: 0, y: 8, duration: 0.4, ease: 'power2.in',
  }, 1.48);
  refs.recoveryInsertions.forEach((insertion, index) => {
    const at = 1.72 + index * 0.62;
    tl.from(insertion.querySelector('.recovery-focus-ring'), {
      opacity: 0,
      scale: 0.35,
      transformOrigin: 'center',
      duration: 0.32,
      ease: 'back.out(2)',
    }, at);
    tl.from(insertion.querySelector('.recovery-anchor-line'), {
      strokeDasharray: 260,
      strokeDashoffset: 260,
      duration: 0.42,
      ease: 'power2.inOut',
    }, at + 0.12);
    tl.from(insertion.querySelectorAll(
      '.recovery-insertion-location, .recovery-insertion-copy, .recovery-insertion-cursor',
    ), {
      opacity: 0,
      x: -6,
      duration: 0.36,
      stagger: 0.06,
      ease: 'power2.out',
    }, at + 0.34);
  });

  return tl;
}
