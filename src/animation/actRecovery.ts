/** Recovery. The chronological stream rediscovers framing apparatus. */

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
  tl.to(refs.aiConversation, { opacity: 0.12, duration: 0.65 }, 0.08);
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

  // 3. Addressability: folio-like stable identifiers appear in the margin.
  tl.from(refs.recoveryIdentifiers.querySelectorAll('.recovery-identifier'), {
    opacity: 0,
    x: -6,
    duration: 0.35,
    stagger: 0.025,
    ease: 'power2.out',
  }, 1.38);

  // 4. Supersession: the editorial strike preserves history and names its
  // relation to the decision that replaced it.
  tl.from(refs.recoverySupersession.querySelector('.recovery-strike'), {
    strokeDasharray: 420,
    strokeDashoffset: 420,
    duration: 0.5,
    ease: 'power2.inOut',
  }, 1.9);
  tl.from(refs.recoverySupersession.querySelector('.recovery-supersession-relation'), {
    strokeDasharray: 140,
    strokeDashoffset: 140,
    duration: 0.55,
    ease: 'power2.inOut',
  }, 2.05);
  tl.from(refs.recoverySupersession.querySelector('.recovery-supersession-label'), {
    opacity: 0,
    duration: 0.4,
  }, 2.28);

  return tl;
}
