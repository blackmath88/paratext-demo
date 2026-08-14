/**
 * Act 1 — Bare text.
 *
 * The restraint here is the point. A page, the words, nothing else. The only
 * motion is the ink arriving and the leaf settling, because the argument of
 * this act is that there is no apparatus yet to animate.
 *
 * Everything that could be added here has been deliberately left out.
 */

import gsap from 'gsap';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export function actBare(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // The leaf settles rather than enters — it was always there.
  tl.from(
    refs.leafGroup,
    { scale: 1.035, y: 14, opacity: 0, duration: 1.1, ease: 'power2.out', transformOrigin: '50% 50%' },
    0,
  );

  // Ink arrives line by line, top to bottom, at reading speed. No bounce, no
  // slide — script settling onto a surface, not UI animating in.
  tl.from(
    refs.bodyLines,
    { opacity: 0, duration: 0.5, ease: 'none', stagger: { each: 0.045, from: 'start' } },
    0.18,
  );

  tl.from(refs.initial, { opacity: 0, duration: 0.6, ease: 'power1.out' }, 0.1);

  // The second leaf is barely there; it establishes codex without asking for
  // attention. It will withdraw when the page becomes a printed sheet.
  tl.from(refs.leafVerso, { opacity: 0, x: 10, duration: 1.0, ease: 'power2.out' }, 0.3);

  // A very slow drift across the whole act. Below the threshold of notice,
  // but it stops the frame from reading as a static image.
  tl.to(refs.page, { y: -12, duration: 3, ease: 'none' }, 0.6);

  if (mode === 'cinematic') {
    tl.to(refs.dust, { y: -26, opacity: 0.75, duration: 3, ease: 'none' }, 0);
  }

  return tl;
}
