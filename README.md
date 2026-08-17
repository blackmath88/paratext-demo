# A History of Framing

A scroll-driven editorial animation about how material, computational, and
linguistic regimes frame text and structured work.

One body of text persists through the whole piece. It is never replaced: its
presentation discloses a page boundary, outside annotations force that boundary
to expand, and those notes regularize into printed apparatus and editorial
composition. Hypertext then replaces physical adjacency with addressable,
navigable places. Application turns the frame into several operational views
onto one persistent state, then exposes the metatext that composes the frame.
Fragmentation follows before the later sequence introduces AI
conversation and reveals its long chronological stream.

> Language may become the universal input. It does not have to become the
> universal interface.

**Status: complete through Part II.** AI enters as conversation, grows into a
chronological tube, recovers apparatus, recomposes into live frames, names the
cost of unsolicited framing, and ends with the viewer choosing the frame.

The larger conceptual revision is documented in
[`docs/animation-paradigm-structure.md`](./docs/animation-paradigm-structure.md).
The material-to-digital shift is now implemented through Magazine → Hypertext
→ Application / State / Metatext; the later regime changes remain intentionally
unchanged.

## Develop

```bash
npm install
npm run dev
```

The single Vite workflow serves both first-class artifacts:

- `/` — the scroll-driven animation
- `/essay.html` — the performative essay, integrated from the v12 standalone

With the default GitHub Pages base these become `/paratext-demo/` and
`/paratext-demo/essay.html` in a production preview or deployment.

## Verify

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # typecheck + production build to dist/
npm run preview     # serve dist/ locally
```

`npm run build` sets no base path of its own, so a local `preview` serves from
`/paratext-demo/`. To preview at the root instead:

```bash
BASE_PATH=/ npm run build && npm run preview
```

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`.

One-time setup in the repository: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The workflow passes `BASE_PATH=/<repo>/` so asset
URLs resolve under the project subpath; nothing needs editing if the repo is
renamed.

## Structure

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the implemented scene graph,
timeline model, and responsive strategy. See the
[`animation paradigm brief`](./docs/animation-paradigm-structure.md) for the
intended conceptual revision. In short:

- `src/scene/` builds the SVG **once** and hands back typed refs.
- `src/animation/` may only transform what already exists — act modules have no
  access to the document, which is what structurally enforces "one object
  evolving" rather than eight slides.
- `src/data/acts.ts` owns act metadata and the normalized timeline boundaries.
  The master timeline and the navigator both read those numbers, so they cannot
  drift apart. Re-pace the piece by editing that file.
- `src/data/operations.ts` defines stable work-unit identities for the later digital acts;
  the essay extends the same operation type, and both artifacts project those
  semantic records rather than treating layout as the source of truth.
- `src/essay/` contains the v12 essay runtime, styling, and its explicit station
  and operation data. A station belongs in this artifact only when it is real
  on this content; animation milestones are not copied into the dial.

## Reference

- `reference/prototype.html` — concept/state reference for the Act 8 adaptive
  interface. Not production code.
- `reference/storyboard.png` — art direction and narrative reference.
- `bridge-work-frame-problem-v12.html` remains an external source reference;
  `essay.html` plus `src/essay/` are the canonical integrated implementation.

## Accessibility

The argument lives in HTML, not in SVG. Every act has a real section with a
heading and prose; the scene carries `<title>`/`<desc>`; the navigator is a
list of real anchors that works from the keyboard and leaves a usable URL
  (`#bare`, `#page`, `#glosses`, `#print`, `#editorial`, `#magazine`,
  `#hypertext`, `#application`, `#fragments`, `#conversation`, `#tube`, `#recovery`,
  `#projections`, `#cost`, `#open`). Under `prefers-reduced-motion: reduce` the
piece renders as stacked, non-scrubbed plates — the same act timelines, seeked
and held rather than played.
