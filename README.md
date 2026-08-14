# A History of Framing

A scroll-driven editorial animation about paratext, interfaces and language.

One body of text persists through the whole piece. It is never replaced: its
presentation discloses a page boundary, outside annotations force that boundary
to expand, and those notes regularize into printed apparatus. The same context
then passes through software and fragmentation before Part II introduces AI
conversation and reveals its long chronological stream.

> Language may become the universal input. It does not have to become the
> universal interface.

**Status: Part II foundation complete.** AI enters as a calm conversational
surface, then grows into a scroll-like chronological tube. Apparatus returning
to that stream is intentionally deferred.

## Develop

```bash
npm install
npm run dev
```

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

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the scene graph, the timeline
model and the responsive strategy. In short:

- `src/scene/` builds the SVG **once** and hands back typed refs.
- `src/animation/` may only transform what already exists — act modules have no
  access to the document, which is what structurally enforces "one object
  evolving" rather than eight slides.
- `src/data/acts.ts` owns act metadata and the normalized timeline boundaries.
  The master timeline and the navigator both read those numbers, so they cannot
  drift apart. Re-pace the piece by editing that file.
- `src/data/operations.ts` defines stable work-unit identities for Acts 05–08;
  later frames arrange these units rather than inventing replacement content.

## Reference

- `reference/prototype.html` — concept/state reference for the Act 8 adaptive
  interface. Not production code.
- `reference/storyboard.png` — art direction and narrative reference.

## Accessibility

The argument lives in HTML, not in SVG. Every act has a real section with a
heading and prose; the scene carries `<title>`/`<desc>`; the navigator is a
list of real anchors that works from the keyboard and leaves a usable URL
  (`#bare`, `#page`, `#glosses`, `#print`, `#editorial`, `#application`,
  `#fragments`, `#conversation`, `#reframe`). Under `prefers-reduced-motion: reduce` the
piece renders as stacked, non-scrubbed plates — the same act timelines, seeked
and held rather than played.
