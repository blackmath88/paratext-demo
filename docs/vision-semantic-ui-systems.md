# Vision: Semantic UI Systems

## State belongs to the thing. Form belongs to the projection.

Paratext began from a historical observation: text is never simply "there." It is framed.

Pages, margins, editorial apparatus, hypertext, applications, and now conversational AI all provide different structures for making the same underlying material legible and actionable. The current AI interface often collapses much of that history back into one chronological stream.

The next step is not merely to decorate chat.

It is to separate **state from frame**.

> **State belongs to the thing. Form belongs to the projection.**

This document develops that idea into a broader architecture for dynamic, AI-assisted interfaces.

---

## 1. From Delta to dynamic framing

Delta suggests a change in how software work is represented.

Git largely presents work through snapshots and integration points:

```text
commit
commit
commit
```

A Delta-style system preserves something finer-grained:

```text
operation
operation
operation
operation
operation
```

Those operations can retain stable identity and provenance across a changing worktree.

That shift matters for interface design because a useful interface should not need to treat the current file tree, current chat transcript, or current dashboard as the source of truth.

Instead:

```text
operations / deltas
        ↓
shared state
        ↓
coherent projections
```

The checkout becomes one projection over shared state.

Paratext proposes the same move for interface state:

```text
Delta DB state       → checkout views
thread/canvas state  → dynamic interface views
```

The deeper continuity is:

> **one shared state, multiple coherent projections.**

---

## 2. The artifact should not own its interface

Conventional software tends to bind an object to a fixed presentation.

A document has its editor.
A repository has its tree and pull-request UI.
A project has its dashboard.
A conversation has its chat transcript.

But if the underlying state is addressable and typed, the interface does not need to be canonical.

The same body of work might be projected as:

- a chronological discussion;
- a decision map;
- a review surface;
- a dependency graph;
- an implementation workspace;
- a project map;
- a timeline;
- an evidence view.

Changing the projection should change how the work is seen and operated on, not what the work *is*.

This suggests a stronger architectural principle:

> **The artifact should not own its interface. The interface should be compiled from the semantics of the artifact and the task at hand.**

---

## 3. State → Semantics → Projection

The architecture can be described as three layers:

```text
STATE
  ↓
SEMANTICS
  ↓
PROJECTION
```

### State

The durable, inspectable substrate:

- messages;
- files and versions;
- operations;
- comments;
- decisions;
- tasks;
- people and agents;
- tool calls;
- tests;
- outputs;
- provenance.

### Semantics

Typed meaning derived from that state:

- what changed;
- what depends on what;
- what contradicts what;
- what is unresolved;
- what is evidence;
- what belongs together;
- what needs attention;
- what was observed, declared, inferred, or proposed.

### Projection

A task-specific interface composed from those semantics.

The projection may change. The underlying state and object identity do not.

---

## 4. The missing primitive may be the delta

A stable object model alone may not be enough.

A richer substrate for dynamic interfaces is likely:

```text
ENTITY
RELATION
OPERATION
EVIDENCE
PROVENANCE
```

For example:

```text
Entity
  id
  type
  state

Operation
  id
  actor
  target
  change
  time
  provenance

Relation
  source
  target
  type
  evidence
```

This makes change first-class.

A snapshot can tell us:

```text
PR #12 touches store.py
PR #14 touches store.py
```

A delta-aware substrate can tell us something richer:

```text
operation 1841
modify persistence contract

operation 1847
change the same function

operation 1850
test fails

operation 1854
revert part of the change

operation 1858
introduce alternate implementation
```

The UI can then project not only objects, but the **meaning of change**.

---

## 5. The semantic UI compiler

This leads to a specific architectural layer:

> **Semantic UI compiler**

A semantic UI compiler does not generate arbitrary pixels or arbitrary frontend code.

It consumes typed semantic state and produces a constrained visual scene.

```text
semantic state
      ↓
frame intent
      ↓
semantic UI compiler
      ↓
scene / UI IR
      ↓
renderer
      ↓
interface
```

A minimal visual grammar might contain primitives such as:

```text
ZONE
GROUP
NODE
EDGE
ATTENTION
EVIDENCE
GATE
COMMITMENT
```

The renderer understands how those primitives should behave.

It may decide:

- ordering;
- grouping;
- responsive placement;
- progressive disclosure;
- relationship geometry;
- collapsed versus expanded regions;
- attention emphasis;
- evidence inspection.

The semantic layer decides *what the interface means*.

The renderer decides *how that meaning becomes visible*.

---

## 6. Observstory as a concrete example

Observstory has independently arrived at this architecture.

Its current chain is:

```text
GitHub evidence
      ↓
typed project snapshot
      ↓
semantic scene
      ↓
Project Map
```

The scene contains semantic primitives such as zones, groups, nodes, edges, attention items, and evidence.

It deliberately contains no hand-authored coordinates.

The same renderer can compose:

```text
Intent → Build → Verify → Ship
```

or:

```text
Data → Pipeline → Model → Eval → API → Docs
```

depending on the semantic state and project configuration.

The UI therefore behaves less like a fixed dashboard and more like a constrained visual compiler.

This is a practical demonstration of the Paratext claim:

> **State belongs to the thing. Form belongs to the projection.**

---

## 7. AI should not have to own rendering

A dynamic AI interface does not require an LLM to emit arbitrary HTML or React.

A safer and more legible architecture is:

```text
messy human intent
      ↓
LLM / classifier / heuristic
      ↓
typed frame intent
      ↓
semantic UI compiler
      ↓
bounded visual grammar
      ↓
interface
```

The AI can help answer questions such as:

- What kind of work is happening?
- Which relations matter?
- Is there an unresolved decision?
- Would a comparison, timeline, map, or review frame help?
- Which objects should be foregrounded?

But the output can remain typed, inspectable, reversible, and bounded.

For example:

```json
{
  "focus": "decision",
  "subjects": ["proposal:a", "proposal:b"],
  "relations": ["contradicts", "supported_by"],
  "evidence": ["test:42", "comment:81"]
}
```

The compiler then renders a known interaction pattern.

This preserves the advantages of generative adaptation without making the interface itself opaque.

---

## 8. Semantic compiler and semantic UI compiler

There is a useful symmetry.

### Semantic compiler

```text
human language
      ↓
typed executable structure
```

It turns ambiguous intent into constrained action.

### Semantic UI compiler

```text
machine state
      ↓
typed visual structure
```

It turns complex state into constrained perception.

The two operate in opposite directions:

> **One compiles intent into action.  
> The other compiles state into perception.**

Together they suggest a broader architecture for human–AI systems:

```text
LANGUAGE
   ↓
semantic interpretation

DELTAS
   ↓
state reconstruction

STATE
   ↓
semantic normalization

SEMANTICS
   ↓
frame selection

FRAME
   ↓
semantic UI compiler

UI
```

---

## 9. Dynamic does not mean unstable

A generated interface must not feel like the floor is moving underneath the user.

Dynamic framing therefore needs strong constraints:

- object identity must remain stable;
- provenance must remain visible;
- transformations must be explainable;
- users need a stable route back to source chronology;
- projections should be pinnable and shareable;
- automatic reframing should be proposed, not silently imposed;
- users should be able to freeze a useful frame;
- the system must distinguish observed, inferred, proposed, declared, and reviewed state.

The more adaptive the frame becomes, the stronger the audit model must become.

---

## 10. A possible product direction: Semantic UI Systems

This suggests a broader research and product space:

### Semantic UI Systems

Systems in which:

1. **Work has addressable state**  
   The source of truth is not pixels, layout, or a chronological transcript.

2. **Changes are first-class**  
   Delta-like operations preserve how the state developed.

3. **State is normalized into semantic primitives**  
   Entities, relations, operations, evidence, provenance.

4. **Interfaces consume semantic state**  
   They do not directly mirror backend objects.

5. **A semantic UI compiler composes the frame**  
   Using a constrained visual grammar.

6. **AI can participate upstream**  
   Interpreting intent, recognizing relations, proposing frames, and helping choose what deserves attention.

7. **Rendering remains bounded and inspectable**  
   AI does not need unrestricted control over the UI.

---

## 11. What this changes about the AI interface question

The conventional question is:

> What should the AI answer?

Paratext already proposes a more useful one:

> What should this thread become?

The semantic UI systems perspective adds another:

> **What projection best makes the current state understandable and actionable?**

That projection does not have to be permanent.

It only has to be coherent, grounded, and useful for the work happening now.

---

## 12. Research questions

This direction raises concrete questions worth testing:

1. What is the smallest useful semantic state model shared by chat, files, operations, decisions, and artifacts?
2. Which relations can be derived deterministically, and which benefit from model inference?
3. Which interface structures should emerge automatically, and which should require explicit user approval?
4. How much of a useful UI can be generated from typed state before project-specific authored design becomes necessary?
5. How should delta history influence the current frame?
6. When should the UI show current state, and when should it show how that state came to be?
7. Which visual primitives are general enough to compose many task-specific interfaces?
8. How can multiple collaborators use different projections without losing a shared reference point?
9. How do we measure whether a generated frame clarifies work rather than merely making it look organized?
10. Can a semantic UI compiler become a reusable layer between agentic systems and frontend rendering?

---

## 13. Working thesis

The emerging thesis across Delta, Paratext, and Observstory is:

> **The future of AI interface design may not be a single adaptive application or a model that generates arbitrary screens. It may be a system where durable semantic state is continuously projected through constrained, task-specific frames.**

Language can remain the universal input.

It does not have to become the universal interface.

And the interface itself does not have to remain fixed.
