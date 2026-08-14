/**
 * Act 2 — Glosses.
 *
 * Readers speak back. The rule for this act: nothing that a hand would have
 * written is allowed to simply fade in.
 *
 * - Stroked marks draw along their own length (dashoffset).
 * - Gloss text wipes in per line with a slight settle, at writing rhythm.
 * - Timing is uneven, because annotation is not a system.
 *
 * The parallax here carries the argument: the body text barely moves, the
 * marginalia moves more, the marks move most. The text is stable while the
 * apparatus accumulates around it.
 */

import gsap from 'gsap';
import { GLOSSES, INTERLINEAR, UNDERLINES } from '../data/text';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

/** Act 2 occupies this many timeline seconds; `at` values in data are 0..1. */
const SPAN = 4;

export function actGlosses(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // The page yields a little: it shrinks and lifts because its margins now
  // have to hold something. The text did not ask for this.
  tl.to(refs.page, { scale: 0.94, y: -8, duration: SPAN * 0.7, ease: 'power1.inOut', transformOrigin: '50% 46%' }, 0);

  // --- underlines: drawn, then re-drawn, as readers do ---------------------
  UNDERLINES.forEach((u, i) => {
    const path = refs.rulePaths[i];
    if (!path) return;
    tl.to(
      path,
      { strokeDashoffset: 0, duration: 0.42, ease: 'power2.inOut' },
      u.at * SPAN,
    );
  });

  // --- marginalia: written, line by line -----------------------------------
  GLOSSES.forEach((gloss, gi) => {
    const group = refs.glossGroups[gi];
    if (!group) return;
    const lines = [...group.querySelectorAll<SVGTextElement>('.gloss-line')];
    const at = gloss.at * SPAN;

    tl.set(group, { opacity: 1 }, at);

    lines.forEach((line, li) => {
      // The wipe is the pen travelling. Uneven duration per line so the hand
      // does not read as a machine.
      const dur = 0.26 + ((gi * 7 + li * 3) % 5) * 0.035;
      tl.fromTo(
        line,
        { clipPath: 'inset(-30% 101% -30% -6%)', opacity: 0.15 },
        { clipPath: 'inset(-30% -6% -30% -6%)', opacity: 1, duration: dur, ease: 'power1.out' },
        at + li * 0.14,
      );
      // A small settle after the stroke lands.
      tl.from(line, { y: 1.6, duration: 0.2, ease: 'power2.out' }, at + li * 0.14);
    });
  });

  // --- reference marks: arrows, brace, asterisk ----------------------------
  // These come *after* the note they belong to — the reader writes, then
  // points back at the line they meant.
  const markTimings: Record<string, number> = {
    'mark-cf': 0.4,
    'mark-contra': 0.54,
    'mark-huc': 0.64,
    'mark-brace': 0.3,
    'mark-idest': 0.78,
    'mark-bene': 0.9,
    'mark-star': 0.94,
  };
  for (const path of refs.markPaths) {
    const t = markTimings[path.id] ?? 0.5;
    tl.to(path, { strokeDashoffset: 0, duration: 0.34, ease: 'power2.out' }, t * SPAN);
  }

  // --- interlinear: squeezed into the gaps ---------------------------------
  // Scaled up from nothing in Y only, so it reads as text forced into a space
  // that was not left for it.
  INTERLINEAR.forEach((il, i) => {
    const t = refs.interlinear[i];
    if (!t) return;
    tl.fromTo(
      t,
      { opacity: 0, scaleY: 0.3, transformOrigin: '0% 100%' },
      { opacity: 1, scaleY: 1, duration: 0.3, ease: 'back.out(1.8)' },
      il.at * SPAN,
    );
  });

  // --- semantic parallax ----------------------------------------------------
  if (mode === 'cinematic') {
    // Body: almost still. Marginalia: more. Marks: most.
    tl.to(refs.body, { y: -4, duration: SPAN, ease: 'none' }, 0);
    const plane1 = refs.glossGroups.filter((g) => g.dataset.plane === '1');
    const plane2 = refs.glossGroups.filter((g) => g.dataset.plane === '2');
    tl.to(plane1, { y: -14, duration: SPAN, ease: 'none' }, 0);
    tl.to(plane2, { y: -26, duration: SPAN, ease: 'none' }, 0);
    tl.to(refs.marks, { y: -34, duration: SPAN, ease: 'none' }, 0);
  }

  return tl;
}
