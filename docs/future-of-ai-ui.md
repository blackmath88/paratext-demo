# The future of AI UI

## A concept for threads that grow into interfaces

This document develops the argument behind the final movement of **A History of
Framing**. It is a product and interaction concept, not a claim that every
described capability already exists.

The central proposition is:

> A thread may begin as conversation. It does not have to remain one.

AI has introduced a new kind of computational agency, but its dominant interface
is still a chronological chat window. We have new intelligence inside an old
form: a prompt box at the bottom, messages above it, and a scrollbar standing in
for memory, structure, and navigation.

That form was useful for making AI approachable. It should not be mistaken for
the final form of working with AI.

---

## 1. The historical argument

Text has never been “just text.” Every period developed forms suited to the work
being done:

- the page established boundary, measure, and position;
- marginalia created a place for commentary beside a source;
- print regularized notes into repeatable editorial apparatus;
- magazines composed different kinds of material into directed layouts;
- hypertext made references addressable and traversable;
- applications created specialized views and operations over shared state;
- project-management tools coordinated files, status, responsibility, and time.

These forms did more than display text. They encoded ways of reading, deciding,
editing, navigating, and collaborating.

Current AI interfaces collapse much of that specificity back into one stream.
Documents, decisions, tool calls, explanations, errors, alternatives, and
finished artifacts all accumulate in the same vertical tube.

### Design commentary

Chat is not the problem by itself. It is an excellent **entry state**: familiar,
low-friction, and open-ended. The problem is treating chat as the only durable
shape of the work.

The useful distinction is therefore not **chat versus no chat**. It is:

- **chat as input**, where intent can remain conversational; and
- **interface as output**, where the system develops structure appropriate to
  the work.

Language may become the universal input. It does not have to become the
universal interface.

---

## 2. The chronological tube

The conventional AI conversation has several structural limits:

1. **Everything has the same visual status.** A passing suggestion and a final
   decision are both messages.
2. **Position substitutes for meaning.** “Earlier” and “later” are easy to
   represent; “supports,” “revises,” “implements,” and “depends on” are not.
3. **Artifacts drift away from their context.** A file, preview, explanation,
   and review comment may refer to one another without sharing a visible place.
4. **Navigation degrades with length.** Search, chat lists, projects, and small
   progress dots help locate material but do not organize the work itself.
5. **Collaboration becomes observational.** People can read the same transcript,
   but it is difficult to act in parallel on a shared, spatially legible state.
6. **The interface does not learn from the work.** A research thread, software
   project, publication, and planning process retain essentially the same frame.

The result is paradoxical: the model may understand relations within the work,
while the interface continues to present only chronology.

---

## 3. Delta as a first step

Delta points toward a different model through **two distinct paradigm
revolutions**. They should not be collapsed into a generic claim about better
collaboration:

1. the checkout becomes a virtualized view into file state whose source of truth
   lives in Delta DB; and
2. the thread becomes a canvas where a person can type anywhere.

The proposed next step is to bring these ideas together: virtualize not only the
file view, but also the interface through which a thread is understood and used.

### Revolution one — Checkouts as virtualized file views

A checkout is not an independent copy that must become the new source of truth.
It is a coherent, virtualized view into shared file state. Delta DB holds the
underlying state while checkouts let people and agents work through distinct,
usable projections of it.

This changes the conceptual order:

```text
conventional model
repository → checkout → local changes → eventual reconciliation

Delta direction
Delta DB shared state → multiple coherent checkout views
```

The checkout therefore becomes a projection, not the project itself. Several
collaborators can occupy different working views without pretending that each
view is an isolated reality.

### Revolution two — The thread as a typing canvas

The canvas is not merely chat with movable messages. Its fundamental affordance
is: **type anywhere**.

Writing no longer has to enter through one prompt box and append at the bottom.
A person can begin beside the relevant material. Commentary and action can
attach to exact places. Explanations can sit beside the change they explain.
Review becomes part of the working surface rather than a separate terminal
phase.

This recovers an old and powerful editorial idea: the note should have a visible
relationship to its subject. But it also goes further: the interface becomes a
place that can be directly authored, rather than a feed that can only be
extended.

### Proposed extension — Virtualized interface views

The deeper opportunity is to apply the checkout principle to the thread UI:

> If file state can be virtualized into checkouts, interface state can be
> projected into task-specific frames.

Just as a checkout is a coherent view into shared file state, a dynamic
interface could be a coherent view into shared thread state. The conversation
would not need one canonical layout. The same underlying thread could be
projected as a discussion, document, decision map, implementation workspace,
review surface, or timeline without duplicating its content.

This is the speculative step beyond Delta's two current paradigm shifts:

```text
Delta DB state       → checkout views
thread/canvas state  → dynamic interface views
```

The key continuity is **one shared state, multiple coherent projections**.

### Threads before pull requests

Pull requests remain useful as publication, integration, and governance
boundaries. But they are often too late and too narrow to contain the actual
development conversation.

The thread is where intent is formed, alternatives are compared, code is
changed, previews are interpreted, and decisions are made. Treating that thread
as a first-class collaborative object preserves the reasoning that a final diff
cannot show.

### Design commentary

The important Delta idea is not “put more tools around chat.” It is to make
**conversation, artifacts, and state addressable within one collaborative
space**. A successful interface should reduce the distance between:

- discussing a thing;
- pointing to the thing;
- changing the thing;
- seeing the result; and
- recording why the change survived.

---

## 4. A thread that develops form

Imagine a new thread beginning as an ordinary conversation. At first, a chat
layout is appropriate because neither the user nor the system yet knows what
kind of work will emerge.

As the thread grows, the interface recognizes durable structures:

- a question becomes a research track;
- repeated references become an index;
- a proposal and its objections become a decision surface;
- generated files become an artifact collection;
- tasks and owners become a project frame;
- code changes, tests, and previews become an implementation workspace;
- accepted conclusions become a living specification.

The system does not replace the thread. It progressively **frames** it.

```text
conversation
    ↓
recognizable relations
    ↓
suggested structure
    ↓
user-approved frame
    ↓
multiple live projections of the same thread state
```

This is closer to simple HTML growing into a site than to a chatbot gaining more
sidebar items. Text acquires hierarchy, navigation, controls, and specialized
views as those forms become useful.

### The interface is a projection, not a generated picture

A dynamic UI must remain grounded in stable, inspectable state. Otherwise every
adaptation feels like the floor moving underneath the user.

The underlying objects should remain addressable:

- messages;
- files and file versions;
- comments and annotations;
- decisions;
- tasks;
- people and agents;
- tool operations;
- previews and outputs;
- links between those objects.

Layouts are then projections over these objects. Changing a projection changes
how the work is seen and operated on, not what the work *is*.

---

## 5. Interaction principles

### 5.1 Begin with the least structure

Do not force users to choose a project schema before they understand the work.
Start conversationally and introduce structure only when there is evidence for
it.

### 5.2 Propose structure; do not silently impose it

The system might say:

> This thread now contains three competing proposals, two implementation tasks,
> and an unresolved decision. Organize them?

The user can accept, modify, postpone, or reject the frame.

### 5.3 Preserve a stable way back

Every derived frame should retain access to the chronological source. Users need
to know where a statement came from and how an artifact developed.

### 5.4 Make transformations legible

When a conversation becomes a specification or a group of comments becomes a
review queue, the transition should show what moved and why. Objects should not
vanish and reappear without continuity.

### 5.5 Let one state support several views

A developer may need a file-and-test view, a designer a preview-and-comment
view, and a project lead a decision-and-status view. These should be coordinated
projections, not competing copies of the project.

### 5.6 Keep narration separate from operation

AI explanation is useful, but it should not cover or displace the object being
changed. Narration can remain prominent while occupying a deliberate rail,
annotation layer, or temporary focus mode.

### 5.7 Make agency visible

The interface must distinguish:

- what a person wrote;
- what an agent proposed;
- what an agent changed;
- what the system inferred;
- what has been reviewed; and
- what remains reversible.

### 5.8 Allow the user to freeze the frame

Dynamic does not mean perpetually unstable. Users should be able to pin a useful
layout, name it, share it, and prevent automatic reorganization.

---

## 6. Example: from conversation to software workspace

### Stage 1 — Chat

A person describes an idea. The agent asks questions and explores possible
directions. A simple chronological conversation is enough.

### Stage 2 — Canvas

The person selects a claim and writes beside it. The agent attaches a prototype
to the relevant requirement. Comments remain anchored to their subjects.

### Stage 3 — Structured thread

The interface identifies requirements, open questions, decisions, and
artifacts. It offers an index and a compact map of their relationships.

### Stage 4 — Implementation frame

Once code exists, the same thread gains coordinated file, diff, preview, test,
and terminal regions. Each operation still points back to the request or
decision that motivated it.

### Stage 5 — Parallel checkouts

People and agents work concurrently through coherent checkouts. Their changes
remain visible as branches of activity inside the thread rather than appearing
only at merge time.

### Stage 6 — Review and publication

The interface projects unresolved comments, risky changes, evidence, and final
decisions into a review frame. A pull request can be produced as an integration
boundary, but the thread remains the richer record of how the work developed.

---

## 7. Product directions

The concept can be explored incrementally.

### Near term — stronger thread anatomy

- anchored comments and artifact references;
- visible relations between prompts, changes, tests, and previews;
- a persistent thread index;
- named decisions and unresolved questions;
- user-created regions or clusters on the canvas.

### Medium term — multiple projections

- conversation, canvas, files, decisions, and review views over the same state;
- saved role-specific frames;
- suggested organization with explicit user approval;
- stable links that survive layout changes;
- checkout activity represented inside the thread.

### Long term — adaptive project interfaces

- interfaces that develop as the project develops;
- project-specific controls generated from durable operations;
- collaborative frames shared across people and agents;
- reversible transitions between representations;
- a thread that can become the project's navigable memory without becoming
  another static archive.

---

## 8. Risks and constraints

### Adaptive interfaces can destroy orientation

An interface that continually rearranges itself may be intelligent but
unusable. Spatial memory, stable landmarks, undo, and user control are
non-negotiable.

### Generated UI can hide system behavior

Specialized frames must not obscure permissions, provenance, tool execution, or
state changes. The more fluid the presentation becomes, the stronger the audit
model must be.

### Structure can become premature bureaucracy

Not every conversation needs a dashboard. Organization should pay for itself by
reducing real cognitive load.

### One inferred ontology will not fit every project

The system should support plural, revisable frames rather than claiming to
discover the single correct structure of the work.

### Compression can erase disagreement

Summaries and synthesized decisions must preserve dissent, uncertainty, and
source links. A clean frame should not manufacture false consensus.

---

## 9. Open design questions

1. What evidence should trigger an offer to reorganize a thread?
2. Which structures should be inferred, and which must be explicitly authored?
3. How does a user see and edit the relations behind a generated frame?
4. What is the smallest stable object model shared by chat, canvas, files,
   checkouts, comments, and decisions?
5. How should frames behave when several collaborators organize the same thread
   differently?
6. Which layouts are private working views, and which become shared project
   artifacts?
7. How can an interface evolve without sacrificing accessibility and keyboard
   predictability?
8. When should the system preserve chronology, and when should it foreground
   another relation?
9. What belongs in the thread, and what should remain in external specialized
   tools?
10. How do we evaluate whether a new frame clarifies work rather than merely
    making it look organized?

---

## 10. The larger claim

The next generation of AI UI is unlikely to be a more decorated chat window.
Nor is it simply a return to conventional applications with a prompt box added.

It is a collaborative environment in which language can initiate action, the
resulting work remains addressable, and the interface develops forms appropriate
to that work.

Delta's canvas-like thread and virtualized checkout model provide concrete
starting points. The larger possibility is to virtualize not only file state,
but also the way a project is framed:

- one shared body of work;
- multiple coherent projections;
- conversation preserved as provenance;
- structure that grows with use;
- people and agents collaborating in the same legible state.

The question is no longer only:

> What should the AI answer?

It becomes:

> What should this thread become?
