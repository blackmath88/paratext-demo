/**
 * Act 3 — Print, and the Act 2 → 3 transition it owns.
 *
 * This act does not begin with print. It begins by *regularizing Act 2*, because
 * that regularization is the argument: what one reader improvised, the press
 * makes systematic. The transition belongs to the arriving act.
 *
 * The four moves that carry the idea, in order:
 *
 *   1. The rough underline straightens into a typographic rule — same element,
 *      same seed, wobble tweened to zero. It does not crossfade into a rule; it
 *      *becomes* one.
 *   2. A reader's underline travels down the page and turns into the footnote
 *      separator. The apparatus is inherited, not invented.
 *   3. The marginal citations descend out of the margin and land as footnotes,
 *      handing off to typeset text at the moment they arrive.
 *   4. The handwritten headnote aligns to the centre and sets as the title.
 *
 * Everything else — folio, line numbers, systematic spacing — follows from
 * those, and the marks that were never standardized quietly recede.
 */

import gsap from 'gsap';
import { GLOSSES, UNDERLINES } from '../data/text';
import { ADMITTED_LEAF, LEAF, lineY, printLineX, printLineY, PRINT_TEXT, SEED, TEXT } from '../scene/markup';
import { wobblyLine, wobblyRect } from '../scene/geometry';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

// Timings below are authoring seconds. The master scales this timeline to the
// span declared for the act in data/acts.ts, so these are ratios in practice.

/** Index into GLOSSES of the notes that get promoted into print apparatus. */
const HEADNOTE = 0; // "nota: de natura = Aristoteles?"  → title
const PROMOTED = [2, 1]; // "cf. Boeth."  → footnote 1,  "vide lib. II" → footnote 2

export function actPrint(refs: SceneRefs, mode: Mode): gsap.core.Timeline {
  const tl = gsap.timeline();

  // -------------------------------------------------------------------------
  // 1. The hand regularizes
  // -------------------------------------------------------------------------

  // The leaf edge stops being drawn and becomes trimmed.
  const leafState = { ...ADMITTED_LEAF, wobble: 1 };
  tl.to(
    leafState,
    {
      x: LEAF.x,
      y: LEAF.y,
      w: LEAF.w,
      h: LEAF.h,
      wobble: 0,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const d = wobblyRect(leafState.x, leafState.y, leafState.w, leafState.h, leafState.wobble, SEED);
        refs.leaf.setAttribute('d', d);
        refs.leafEdge.setAttribute('d', d);
        refs.leafVerso.setAttribute(
          'd',
          wobblyRect(leafState.x - 26, leafState.y + 14, leafState.w, leafState.h - 22, leafState.wobble, SEED + 400),
        );
      },
    },
    0,
  );
  tl.to(refs.leafEdge, { opacity: 0.16, strokeWidth: 0.7, duration: 1.6, ease: 'power2.inOut' }, 0);

  // A printed page is a single leaf. The codex withdraws.
  tl.to(refs.leafVerso, { opacity: 0, x: -14, duration: 1.2, ease: 'power2.in' }, 0.1);

  // Underline 1: straightens in place. The clearest statement of the idea, so
  // it happens first and alone.
  const rule0 = refs.rulePaths[0];
  const u0 = UNDERLINES[0];
  if (rule0 && u0) {
    const y = lineY(u0.lineIndex) + 7;
    const targetY = printLineY(u0.lineIndex) + 6;
    const s = { w: 1, y, x1: TEXT.x + TEXT.width * u0.from, x2: TEXT.x + TEXT.width * u0.to };
    tl.to(
      s,
      {
        w: 0,
        y: targetY,
        x1: printLineX(u0.lineIndex),
        x2: PRINT_TEXT.x + PRINT_TEXT.width,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => rule0.setAttribute('d', wobblyLine(s.x1, s.y, s.x2, s.y, s.w, SEED + u0.lineIndex)),
      },
      0.1,
    );
    tl.to(rule0, { opacity: 0.34, strokeWidth: 0.9, duration: 1.5, ease: 'power2.inOut' }, 0.1);
  }

  // Underline 2: straightens *and migrates*, becoming the footnote separator.
  const rule1 = refs.rulePaths[1];
  const u1 = UNDERLINES[1];
  if (rule1 && u1) {
    const s = {
      w: 1,
      y: lineY(u1.lineIndex) + 7,
      x1: TEXT.x + TEXT.width * u1.from,
      x2: TEXT.x + TEXT.width * u1.to,
    };
    tl.to(
      s,
      {
        w: 0,
        y: 702,
        x1: PRINT_TEXT.x,
        x2: PRINT_TEXT.x + 190,
        duration: 1.9,
        ease: 'power3.inOut',
        onUpdate: () => rule1.setAttribute('d', wobblyLine(s.x1, s.y, s.x2, s.y, s.w, SEED + u1.lineIndex)),
      },
      0.55,
    );
    tl.to(rule1, { opacity: 0.5, strokeWidth: 0.9, duration: 1.9, ease: 'power3.inOut' }, 0.55);
  }

  // Systematic spacing: jitter comes out of the body, leading tightens, the
  // paragraph indents appear. The text is unchanged; its setting is not.
  refs.bodyLines.forEach((line, i) => {
    tl.to(
      line,
      {
        attr: { x: i === 0 ? printLineX(i) + 34 : printLineX(i), y: printLineY(i) },
        duration: 1.7,
        ease: 'power2.inOut',
      },
      0.25 + i * 0.012,
    );
  });
  tl.to(
    refs.initial,
    { attr: { x: printLineX(0), y: printLineY(0) + 3 }, duration: 1.7, ease: 'power2.inOut' },
    0.25,
  );

  // -------------------------------------------------------------------------
  // 2. Marginalia is promoted or discarded
  // -------------------------------------------------------------------------

  PROMOTED.forEach((glossIndex, slot) => {
    const group = refs.glossGroups[glossIndex];
    const gloss = GLOSSES[glossIndex];
    const note = refs.printNoteTexts[slot];
    if (!group || !gloss || !note) return;

    const targetX = PRINT_TEXT.x;
    const targetY = 726 + slot * 22;
    const at = 1.15 + slot * 0.3;

    // The note leaves the margin and descends to the foot of the page,
    // straightening as it goes.
    tl.to(
      group,
      {
        x: targetX - gloss.x,
        y: targetY - gloss.y,
        rotation: 0,
        scale: 0.66,
        duration: 1.35,
        ease: 'power2.inOut',
        transformOrigin: '0% 50%',
      },
      at,
    );

    // Hand-off: the written note gives way to the typeset one at the moment it
    // lands, in the same place. Read as regularization, not replacement.
    tl.to(group, { opacity: 0, duration: 0.4, ease: 'power1.in' }, at + 0.95);
    tl.fromTo(
      note,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power1.out' },
      at + 1.0,
    );
  });

  // The headnote aligns and becomes the title.
  const head = refs.glossGroups[HEADNOTE];
  const headGloss = GLOSSES[HEADNOTE];
  if (head && headGloss) {
    tl.to(
      head,
      {
        x: 640 - headGloss.x,
        y: 174 - headGloss.y,
        rotation: 0,
        scale: 0.9,
        duration: 1.2,
        ease: 'power2.inOut',
        transformOrigin: '0% 50%',
      },
      1.5,
    );
    tl.to(head, { opacity: 0, duration: 0.4 }, 2.4);
    tl.fromTo(refs.printTitle, { opacity: 0, letterSpacing: '0.24em' }, { opacity: 1, letterSpacing: '0.08em', duration: 0.7, ease: 'power2.out' }, 2.45);
  }

  // What was not standardized recedes. It is not deleted — it is simply no
  // longer part of the apparatus.
  const leftovers = refs.glossGroups.filter((_, i) => i !== HEADNOTE && !PROMOTED.includes(i));
  tl.to(leftovers, { opacity: 0.08, duration: 1.2, ease: 'power2.inOut', stagger: 0.06 }, 0.9);
  tl.to(refs.markPaths, { opacity: 0.1, duration: 1.2, ease: 'power2.inOut', stagger: 0.04 }, 0.85);
  tl.to(refs.interlinear, { opacity: 0.12, duration: 1.0, ease: 'power2.inOut' }, 0.9);

  // -------------------------------------------------------------------------
  // 3. Page furniture
  // -------------------------------------------------------------------------

  tl.set(refs.print, { opacity: 1 }, 0);
  tl.set(refs.printNotes, { opacity: 1 }, 0);

  tl.fromTo(refs.printCaput, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 2.75);
  tl.fromTo(refs.printFolio, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 3.0);

  refs.printLineNums.forEach((num, i) => {
    const idx = Number(num.dataset.line ?? 0);
    num.setAttribute('y', String(printLineY(idx)));
    tl.fromTo(num, { opacity: 0, x: -6 }, { opacity: 0.55, x: 0, duration: 0.5, ease: 'power2.out' }, 3.1 + i * 0.12);
  });

  // The page settles into its printed proportion — a little smaller, a little
  // higher, composed rather than held.
  tl.to(refs.page, { scale: 0.99, y: -18, duration: 2.2, ease: 'power2.inOut', transformOrigin: '50% 46%' }, 1.4);

  if (mode === 'cinematic') {
    // Planes recoordinate: everything returns to a shared depth, because print
    // is the moment the apparatus and the text agree on one system.
    tl.to([refs.body, refs.glosses, refs.marks], { y: 0, duration: 2, ease: 'power2.inOut' }, 0.6);
    tl.to(refs.dust, { opacity: 0.3, duration: 2, ease: 'none' }, 0);
  }

  return tl;
}
