# A History of Framing — retrospective

## Intent

The animation presents one continuous history of text interfaces: page,
marginalia, print, editorial composition, hypertext, applications, fragmented
tools, AI chat, Delta, and a proposed future of dynamic interface projections.

The argument is that text has never been “just text.” Each period developed
forms suited to reading, deciding, navigating, editing, and collaborating. AI
introduced new intelligence, but its dominant interface collapsed much of that
specificity back into a chronological chat window.

The piece therefore distinguishes:

- **chat as input**, where intent can remain conversational; and
- **interface as output**, where the work can acquire the structure it needs.

Language may become the universal input. It does not have to become the
universal interface.

## Narrative plan

1. Show one body of text gaining a page, commentary, apparatus, and editorial
   composition.
2. Move from physical arrangement to addressable hypertext and operational
   application views.
3. Show the power of specialized software and the fragmentation between its
   frames.
4. Give AI a dramatic entrance, then reveal the limitations of the
   chronological chat tube.
5. Introduce two Delta paradigm shifts:
   - the thread becomes a canvas where a person can type anywhere;
   - Delta DB becomes shared file state, with checkouts as coherent working
     views for people and agents.
6. Propose the next step: apply the same projection principle to thread UI so a
   conversation can develop into a document, review, project, code, or decision
   frame without duplicating its underlying state.

## What was implemented

- The experience is divided into Paper, Computer, AI, Delta, and Expanded
  Vision eras with distinct visual treatments.
- Precision scrolling was replaced by autoplay with authored pauses plus Play,
  Pause, Back, and Next controls.
- The top era navigation links directly to every scene without replaying the
  preceding animation.
- Narration is timed to scene events, while scene-specific handwritten notes
  move explanatory material into the picture.
- Full-field threshold sequences mark “Then AI enters the space,” “Delta.dev
  changes the game,” and “What now?”
- The AI sequence uses a recognizable ChatGPT window and visualizes the
  conversation growing while usable context recedes.
- The Delta DB scene compares a conventional VS Code, Git, and pull-request
  workflow with shared state, coherent checkouts, and a thread as the
  development room.
- The final scenes clearly distinguish existing Delta ideas from the proposed
  extension toward virtualized interface views.

## What works well

- The paper sequence is the strongest movement. Page, marginalia, print
  apparatus, editorial composition, and magazine layout visibly enrich the same
  body of text.
- Era changes are easy to recognize through background, color, typography, and
  scene furniture.
- Fragmented tools now read as distinct browser, file manager, mail, PDF, and
  application frames.
- The AI entrance creates the intended break, while the tube makes context loss
  into a visual argument rather than a caption.
- Delta receives enough time to explain the canvas and virtualized-state
  paradigms separately.
- Autoplay gives the argument an authored rhythm without taking navigation away
  from the viewer.

## What should improve next

- Later digital scenes are denser and lower-contrast than the paper sequence;
  important details can become too small beside the narration rail.
- Narration is clear but occasionally feels like a slide caption rather than
  something emerging from the visual field.
- Handwritten notes should eventually use target-specific SVG leaders anchored
  to real scene geometry. A note should be omitted when there is no meaningful
  target.
- “Type anywhere” needs a larger, more unmistakable visual demonstration of
  writing in several spatial locations.
- The proposed-extension scene carries too many simultaneous explanations. One
  clear morph from a thread into two or three coherent projections would be
  stronger.
- The ending is intentionally open, but its visual payoff is quieter than the
  paper, AI, and Delta transitions.
- A browser smoke test should visit every station. Static builds did not catch a
  stale SVG selector after the Delta scene was redesigned; the screenshot pass
  did.

## Screenshots

The [`screenshots`](./screenshots/) directory contains the landing page and all
15 scenes at their authored finished-state positions. These stills document
composition and legibility; threshold timing and transformation quality must
still be reviewed through live playback.

A single downloadable archive is available at
[`paratext-scenes-finished.zip`](./paratext-scenes-finished.zip).

