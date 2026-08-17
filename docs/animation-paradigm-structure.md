# Animation paradigm structure

This document records the intended next conceptual revision of the scroll
animation. It is a design brief, not a description of behavior already in the
runtime and not authorization to implement it.

The current animation remains the implementation source of truth for act IDs,
order, copy, timing, geometry, and responsive behavior. Those facts live in
`src/data/acts.ts`, `src/animation/`, and `ARCHITECTURE.md`.

## Governing revision

The animation should no longer read as one continuous accumulation of framing
devices. It should read as three regimes separated by two paradigm shifts:

1. **Material / editorial framing**
2. **Computational / digital framing**
3. **Linguistic / AI framing**

The shifts are not ordinary act seams. Eventually the presentation substrate
itself should change so the viewer feels that the frame has acquired different
physics.

This revision preserves the governing continuity constraint: one field of
material and semantic operations persists. A change of substrate must transform
that field, not replace it with slides.

## Current implementation versus intended direction

The implemented runtime currently contains:

`Presentation → Page → Gloss → Print → Editorial → Application → Fragments →
AI Conversation → Tube → Recovery → Projections → Cost → Open`

The revised direction proposes a clearer conceptual sequence:

```text
MATERIAL / EDITORIAL
Presentation → Page → Gloss → Print → Editorial

             PARADIGM SHIFT I — DIGITAL

COMPUTATIONAL / DIGITAL
Hypertext → Application (+ metatext) → Specialized frames → Fragmentation

             PARADIGM SHIFT II — AI

LINGUISTIC / AI
AI Conversation → Tube → Recovery → Projections → Cost → Open
```

Hypertext is not currently a runtime animation act. Application and Fragments
already exist, but their conceptual emphasis will need revision. Metatext may
live inside Application rather than becoming an act. No runtime names, numbers,
or ranges should change until those choices are explicitly made.

---

## Regime I — Material / editorial framing

Emotional register: **maturity**.

These five acts are broadly successful. They should remain restrained,
typographic, editorial, and materially specific. Serif typography may belong
inside the depicted artifact.

### Presentation

Core line: **Text is never just there.**

It is somewhere: separated from the world around it and already framed. The
act establishes that text always appears within a boundary, medium,
arrangement, or context.

### Page

Core idea: **The frame becomes a page.**

The page gives text boundary, measure, position, and separation from the
surrounding world.

### Gloss

Core idea: **Another voice finds a place in the margin.**

Attached commentary begins. The margin becomes usable semantic space.

### Print

Preferred line: **The margins become part of the system.**

Titles, sections, notes, references, numbering, and repeatable hierarchy turn
an improvised framing practice into standardized apparatus. Gloss discovers
marginal commentary; Print regularizes it.

### Editorial

Core line: **The frame begins to direct attention.**

Composition becomes part of the argument. This is the mature endpoint of
material/editorial framing.

---

## Paradigm shift I — Digital

Possible transition line: **Then the frame changes nature.**

Before this boundary, framing is mainly representational and compositional.
After it, framing becomes computational, stateful, interactive, addressable,
generated, mutable, and potentially multi-representational.

Future implementation should investigate a substrate break, not merely the
arrival of another object. Possible qualities include:

- screen-native rather than page-native presentation;
- neutral sans typography;
- sharper geometry and windowed surfaces;
- cursor, focus, and address behavior;
- subtle technical texture and luminous spatial behavior;
- recognizable application and web conventions.

The desired feeling is that **the screen has acquired different physics**.
Avoid cyberpunk, neon, science-fiction HUDs, glassmorphism, AI orbs, and generic
futuristic decoration.

---

## Regime II — Computational / digital framing

Emotional register: **expansion → agency → power → complexity**.

The argument of this regime is not that applications are a mistake. Digital
frames first exceed the page, then become extraordinarily capable, and only
then reveal the cost of specialization.

### Hypertext

Core line: **The page no longer has to contain the text.**

Supporting thought: **Text folds into a virtual space of many dimensions.**

Physical text has adjacency; hypertext has topology. The capability is not
merely that websites contain links. Textual place becomes addressable and is no
longer governed by physical adjacency.

An eventual sequence might follow several links into deeper locations, make
the changing address perceptible, move backward through history, and return
Home. The viewer should experience travel through textual topology.

### Application

Core line: **The frame becomes a window onto state.**

Supporting thought: **We can monitor it. Change it. Act through it.**

The work, state, or process persists underneath while an interface provides
one view onto it. Detail, table, form, timeline, and status views may open onto
the same underlying thing; closing a view does not destroy its state.

This establishes, without yet stating the final thesis, that **the interface
is not the work**.

### Metatext / programming language

This is a documented concept, not necessarily a separate act.

Core idea: **The frame itself can now be written in language.**

Programming languages become metatext that generates pages, interfaces,
behavior, structure, and state transitions. A future demonstration may expose
HTML, CSS, or TypeScript beneath a visible interface and show metatext altering
the frame. Its role is historical and conceptual, not instructional. It also
foreshadows the AI shift.

### Specialized frames and fragmentation

First line: **Specific frames become extraordinarily powerful.**

Spreadsheets, code editors, design canvases, maps, timelines, and domain
control systems are productive because they are specific, concentrated,
dense, and optimized for particular work.

Only after that strength is legible should the second line arrive:
**And the work fragments between them.**

Context and state become distributed across systems. Work travels through
files, tabs, APIs, exports, copy/paste, and notifications. Each application
owns a powerful but partial representation. This is the condition into which
AI enters.

---

## Paradigm shift II — AI

The digital shift accumulates density, windows, controls, specialization, code,
and technical complexity. The AI shift should initially remove them.

Windows, toolbars, code, and navigation drain away until a calm conversational
field remains. The intended emotion is relief: after all this machinery,
perhaps the viewer can simply say what they want.

The absence of apparatus is the transition. Do not substitute a futuristic AI
aesthetic for that absence.

---

## Regime III — Linguistic / AI framing

Emotional register: **release → wonder → recognition**.

### AI Conversation

Preferred line: **Then the interface collapses back into language.**

“Back” matters. The history begins with text, framing apparatus accumulates
around it, digital systems vastly expand that apparatus, and AI appears to
collapse much of the complexity back into language.

The act must initially feel genuinely good: general, simple, expressive, and
liberating. **Ask. Describe. Revise. Act.** Do not introduce the limitation
before this state has settled.

### Tube

Preferred sequence:

1. **But language brings an old structure with it.**
2. **Everything still arrives in time.**

Conversation accumulates, previous work moves upward, later turns arrive, and
the scrollbar changes before the larger chronological tube is revealed.

The historical loop becomes visible:

`page → apparatus → hypertext → applications → generated interfaces →
language → chronological text again`

The point is not that chat interfaces are bad. Language recovers enormous
generality, while chronology quietly becomes the dominant organizing
structure again.

### Recovery

Preferred idea: **So the apparatus comes back.**

Sections, references, addressability, state, supersession, and contextual
relations reappear inside the AI environment. This should feel like historical
recovery, not the invention of generic “AI UX.”

### Projections

This remains the conceptual climax. The same semantic work can appear through
multiple representations without becoming several separate objects.

Preferred framing: **But perhaps the frame no longer belongs to the work.**

> **State belongs to the thing.**  
> **Form belongs to the projection.**

Keep the act restrained. Additional projections are not inherently stronger.

### Cost

Possible line: **If every view can change, what remains shared?**

A moving frame threatens orientation, stable reference, shared composition,
and the ability to point at a spatially persistent thing. This complicates the
climax without undoing it.

### Open

Preferred line: **Which frame now?**

The ending should be extremely quiet. The system stops asserting and leaves
the question open; no explanatory paragraph is required.

---

## Narration as a distinct layer

The framing voice should no longer look like generic scene text or slide
titles. A restrained neutral sans belongs to the voice discussing framing;
serif may remain inside the historical/editorial artifact.

Narration should:

- occupy a consistent spatial zone outside the depicted artifact where possible;
- arrive early enough to prepare decisive motion;
- remain long enough to be read;
- sometimes resolve in two beats;
- avoid competing with the scene.

Preferred pacing pattern:

`read → anticipate → transform → understand → rest`

not:

`scroll → text and animation simultaneously → next act`

## Future pacing investigation

The current implementation already has authored act spans, per-act settle
points, scrub smoothing, and stable snap targets. A later implementation pass
should nevertheless evaluate whether the revised regimes need:

- greater total physical scroll distance;
- less direct response to small scroll movements;
- more breathing room around paradigm shifts;
- narration timing independent from scene choreography;
- crisp local transformations within slower narrative spans.

Priority QA boundaries are Editorial → Digital, Hypertext navigation,
Application → specialization, Digital → AI, Conversation → Tube, the Tube
reveal, Projections → Cost, and Open.

## Guardrails

This concept explicitly rejects:

- treating the animation as a uniform catalogue of framing devices;
- presenting applications as a simple failure;
- rushing AI Conversation into its limitation;
- making either paradigm shift an ordinary crossfade;
- futuristic decoration in place of a real substrate change;
- adding projections for spectacle;
- changing runtime acts, copy, or timing as part of documentation work.

## Decisions required before implementation

1. Does Hypertext become a new runtime act, and where do act numbers move?
2. Does metatext live inside Application or receive its own beat?
3. Are specialized power and fragmentation one act with two phases, or two acts?
4. What exact substrate properties change at each paradigm boundary while the
   single-field continuity constraint remains intact?
5. Which preferred lines replace runtime narration, and which remain internal
   design language only?
6. Does the total scroll budget grow, or is the existing budget redistributed?

