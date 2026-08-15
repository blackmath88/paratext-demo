# Architecture — A History of Framing

This document describes the scene graph, the timeline model and the responsive
strategy. It is written before implementation so the acts have something to
conform to, rather than the architecture being back-formed from whatever the
animation code happened to need.

---

## 1. The governing constraint

There is exactly **one continuous field of material and operations**. The page
is its first carrier; the software surface is its second. Both are created once
on load, and acts transform the same scene nodes rather than replacing them
with act-specific scenes.

This is the whole architectural argument. If any act were allowed to create its
own scene, the piece would become slides with transitions, which is the
one thing the brief forbids. So the codebase enforces continuity structurally:

- `scene/` may create elements. It runs **once**.
- `animation/` may only **animate elements that already exist**. Act modules
  receive a typed `SceneRefs` object and have no access to the document.

An act module physically cannot mint a new page. That is deliberate.

---

## 2. Scene graph

One inline `<svg>` with a fixed `viewBox="0 0 1440 900"`, so all act
choreography is authored in a stable coordinate space and the responsive work
is confined to how that box is fitted into the viewport.

```
svg#scene
├── defs           filters (paper grain, ink bleed), clip paths
├── g#field        the dark ground; vignette; drifting dust
├── g#page         ← material/codex carrier
    ├── g#leaf-verso    faint second leaf (codex feel, Act 1–2)
    ├── g#leaf          the paper itself — hand-drawn path, not a rect
    ├── g#body          the Latin text block (tspans)
    ├── g#rules         underlines → typographic rules   (Act 2 → 3)
    ├── g#glosses       marginalia, written not faded    (Act 2)
    ├── g#marks         reference marks, arrows, manicules
    ├── g#print         title, caput, folio, footnotes   (Act 3)
    └── g#editorial     construction grid and labels    (Act 4)
└── g#surface      ← software/screen carrier; sibling of #page
    ├── g#application
    ├── g#fragments
    ├── g#ai-conversation
    ├── g#conversation
    ├── g#reframe
    └── g#operations
```

`#surface` is a sibling of `#page` so software geometry is authored directly
in the 1440×900 viewBox and cannot inherit transforms used to settle the codex.
Page-owned text and rules remain continuous through the transition; Editorial
returns their carrier to identity before the software surface takes over.

The scene also owns two explicit mutable models. `materialState` is the source
for the field colour, grid, dust and vignette; only `tweenMaterial()` writes its
transition. `operationStates` gives every semantic operation one durable
position, scale and opacity; only `tweenOperation()` moves those identities
between application records, fragment windows, conversation turns and tube.

Layers exist **for parallax planes and z-order**, not for show/hide. A layer is
never `display:none`; it is either not yet drawn (path length 0, opacity 0) or
it is part of the composition.

`#page` is the shared transform target for the material sequence. Act 1 centres
it and Act 3 lifts and tightens it; Act 4 returns the carrier to identity.
`#surface` then owns software geometry in viewBox coordinates. Continuity comes
from page-owned text and rules travelling into alignment with the sibling
surface, not from software inheriting codex transforms.

---

## 3. Timeline model

One GSAP master timeline, scrubbed by one ScrollTrigger. No act owns a
ScrollTrigger of its own.

```
scroll position
      ↓
  ScrollTrigger (pin, scrub 1, end "+=800%")
      ↓
  master progress 0.0 ─────────────────────── 1.0
      ↓
  act timelines, added at labels
```

```ts
master
  .add(actBare(refs),     'bare')
  .add(actGlosses(refs),  'glosses')
  .add(actPrint(refs),    'print')
```

Rules that keep this honest:

- **Each act module returns a detached `gsap.timeline()`.** It never touches
  the master, never sets a ScrollTrigger, never reads `window`. This makes acts
  independently testable and re-orderable, and it is what lets reduced-motion
  mode reuse them by seeking instead of scrubbing.
- **Transitions belong to the act that is arriving**, not to a separate
  "transition" module. `actPrint` opens by regularizing Act 2's marginalia —
  it owns the 2→3 move, because that move *is* the argument of Act 3.
- Each authored act occupies 70% of its declared range. The remaining 30% is a
  real hold tail, giving scroll snapping, review links and reduced-motion seeks
  a stable endpoint rather than a frame inside active choreography.
- Act boundaries are declared once, as normalized progress, in `data/acts.ts`.
  Navigation and the timeline read the same numbers, so the navigator cannot
  drift out of sync with the animation.

### Morphing without paid plugins

MorphSVG is a Club GSAP plugin. Instead, path geometry is **generated** from a
parameter, and the parameter is tweened:

```ts
const state = { wobble: 1 };
tl.to(state, {
  wobble: 0,
  onUpdate: () => rule.setAttribute('d', wobblyLine(x1, y1, x2, y2, state.wobble, seed)),
});
```

`wobble: 1` is a hand-drawn underline. `wobble: 0` is a typographic rule. Same
element, same seed, so the line visibly *straightens* rather than crossfading.
This single mechanism carries the entire 2→3 transition and is the reason the
imperfection is parametric rather than decorative.

### Handwriting that is written, not faded

Marginalia uses `stroke-dasharray`/`stroke-dashoffset` on stroked paths for
drawn marks, and a per-word clip reveal for gloss text, so notes accumulate at
a writing rhythm with slight overshoot and uneven timing. No opacity fades for
anything that is supposed to have been *written by a hand*.

---

## 4. Deliberate imperfection

`scene/geometry.ts` owns a seeded PRNG (mulberry32). All wobble, all jitter,
all irregular geometry derives from it.

Seeded, not random, because: the same page must be identical across reloads,
across reduced-motion snapshots and across resize re-renders. Imperfection is
authored, so it has to be reproducible. A fresh `Math.random()` per frame would
read as noise; a fixed seed reads as a drawn object.

---

## 5. Responsive strategy

Three modes, decided once at boot in `utils/env.ts` and re-evaluated on a
debounced resize:

| Mode | Trigger | Behaviour |
|---|---|---|
| `cinematic` | `≥ 900px` and fine pointer and motion allowed | Full pinned scene, 800vh scrub, parallax planes, margin navigator |
| `compact` | `< 900px` | Scene sticky at the top ~55vh, act text flows beneath it, shorter scrub per act, parallax reduced to two planes, navigator collapses to a horizontal rule of act ticks |
| `static` | `prefers-reduced-motion: reduce` | No pin, no scrub. Each act renders as a stacked section; the scene is seeked to that act's end progress and held. Full text content, keyboard navigable |

`compact` is not the desktop timeline squeezed. The master timeline is rebuilt
with a different pin/scrub configuration and acts read `mode` to drop layers
they cannot afford. The narrative order and the protagonist are identical.

`static` reuses the exact same act timelines — it seeks to each act's declared
settle point and never plays. This is why act modules must be
pure timeline factories: the reduced-motion fallback is not a second
implementation, it is the same one held still.

---

## 6. Content and accessibility

`data/acts.ts` holds narrative metadata (id, number, title, thesis, start,
end). `data/text.ts` holds the Latin, the glosses and the print apparatus.
Animation code contains no copy.

The meaning of the piece lives in HTML, not in SVG:

- Each act has a real `<section>` with a heading and its thesis text. On
  desktop these are the sparse foreground fragments; in `static` mode they are
  the document.
- The `<svg>` carries `role="img"` with `<title>`/`<desc>`, and is
  `aria-hidden` where it merely restates the HTML.
- The navigator is a `<nav>` of real links to `#bare`, `#glosses`, `#print`.
  It works with the keyboard, works with JS-driven smooth scrolling, and works
  as plain anchors if the timeline never boots.
- Scroll is never trapped: the pin is a normal ScrollTrigger pin and the page
  continues past the end of the piece.

---

## 7. Directory layout

```
src/
  main.ts                 boot: env → scene → master → navigation
  styles/
    global.css            type scale, colour, layout, foreground copy
    scene.css             svg-specific rules, layer paint, media queries
  data/
    acts.ts               act metadata + normalized timeline boundaries
    text.ts               Latin body, glosses, print apparatus
  scene/
    geometry.ts           seeded PRNG, wobbly paths, jitter
    markup.ts             SVG element builders (pure, no side effects)
    scene.ts              builds the scene once, returns typed SceneRefs
  animation/
    master.ts             ScrollTrigger + master assembly per mode
    actBare.ts
    actGlosses.ts
    actPrint.ts
  navigation/
    actNavigation.ts      margin navigator, hash sync, click-to-seek
  utils/
    env.ts                mode detection, reduced motion, debounced resize
```

Acts 4–8 add one module each under `animation/` and one entry in `acts.ts`.
Shared path, material and operation writers live beside those act factories so
later acts cannot accidentally introduce competing geometry ownership.

---

## 8. Deferred decisions

Recorded so later milestones do not have to re-litigate them:

- Part II currently uses 16 durable semantic operation nodes. Later scale must
  remain implied or virtualized; it must not manufacture hundreds of SVG nodes.
- Projection furniture and the HTML frame switcher become live only after the
  Projections act settles. Both animated and interactive arrangements write
  through the shared operation model; Cost and Open remain later slices.
- **Canvas/WebGL** stays out. If Act 7 cannot hit frame rate with DOM, the
  answer is fewer elements, not a renderer change.
