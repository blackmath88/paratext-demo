# Part II — AI enters: implementation report

## 1. Files changed

- Scene and styling: `src/scene/markup.ts`, `src/scene/scene.ts`,
  `src/styles/scene.css`
- Animation: `src/animation/act06Fragments.ts`,
  `src/animation/act07Conversation.ts`, `src/animation/act08Reframe.ts`, plus
  new shared writers in `material.ts` and `operations.ts`
- Content and boot: `src/data/acts.ts`, `src/data/operations.ts`, `src/main.ts`,
  `index.html`
- Documentation: `README.md`, `ARCHITECTURE.md`, and the implementation note

## 2. Shared state

`SceneRefs.materialState` owns the current background regime. The page-to-screen
change is routed through `tweenMaterial()`, the sole writer for field colour,
screen grid, dust and vignette.

`SceneRefs.operationStates` owns the x/y position, scale and opacity of every
operation. Acts move these identities through `tweenOperation()` rather than
keeping private positional state.

## 3. Semantic operation model

The existing 16 operation IDs survive application, fragmentation, conversation
and tube states. Each carries a kind, cluster, projection and conversational
role. Copy now reads as representative user, assistant and tool turns. The
first four establish a useful, calm exchange; the remainder imply increasing
chronology without generating a large synthetic transcript.

## 4. Material/background architecture

Part I's paper field transitions to a near-black computational surface with a
restrained grid. No gradient, glass panel, neon palette or new raster asset is
introduced. Page traces contract and recede while the shared software surface
takes ownership of the composition.

## 5. Act ranges and settle points

- `II·01` AI / Conversation: `.66–.84`, settle at 84% of the act
- `II·02` The tube: `.84–1`, settle at 90% of the act

The master fits authored motion into 70% of every range and appends a 30% hold
tail. ScrollTrigger snaps to the declared settle points with inertia disabled.

## 6. Reduced motion

Reduced-motion mode uses the same master timeline without ScrollTrigger. Section
navigation seeks directly to stable endpoints: the four-turn conversation and
the pulled-back tube. Rebuild starts by clearing GSAP presentation properties
and restoring deterministic scene, material, frame and operation state.

## 7. Remaining risk before later Part II slices

- The latent legacy `conversation`/`reframe` projection furniture and unused
  selector modules should be retired or deliberately migrated before apparatus
  return is implemented.
- The tube uses representative SVG turns, not virtualization. A later expanded
  transcript needs a bounded rendering strategy.
- Apparatus return, segmentation, addressability and supersession remain
  intentionally unimplemented; they should reuse the durable operation IDs and
  shared material state rather than introduce parallel scene ownership.
