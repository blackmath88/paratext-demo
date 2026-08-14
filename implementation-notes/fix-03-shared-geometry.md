# Fix 03 — shared geometry ownership

- **Persistent objects:** leaf/edge/verso geometry, both inherited rule paths
  and all six fragment-window paths.
- **Change:** live numeric geometry belongs to `SceneRefs`.
  `animation/frames.ts` is the only writer of their `d` attributes; acts only
  declare targets, durations and easings.
- **Timeline range:** path transitions in Acts 02–07. No target coordinate,
  easing, duration, stagger, styling or pacing changes.
- **Reduced-motion endpoint:** unchanged. Rebuilds reset both DOM geometry and
  the exact shared numeric state used by subsequent timeline renders.
- **Verification:** private-writer grep, forward/reverse ownership inspection,
  direct-navigation initialization, reset-state inspection, typecheck, lint,
  production build and `git diff --check`.
