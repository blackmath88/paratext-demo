# Fix 02 — scene hierarchy

- **Persistent objects:** `#page` retains leaf, body, rules, glosses, marks,
  print and editorial construction; a new sibling `#surface` owns application,
  fragments, conversation, reframe and operation identities.
- **Change:** late software geometry no longer inherits the codex-only page
  transform. Editorial returns the page carrier to identity before the software
  surface becomes authoritative, preserving visual continuity for page-owned
  text and rules.
- **Timeline range:** the hierarchy affects Acts 05–08; the only timeline
  adjustment is the page carrier settling to identity during Act 04.
- **Reduced-motion endpoint:** Editorial ends with page and surface in the same
  1440×900 coordinate system; later held states are unchanged conceptually.
- **Verification:** typecheck, lint, production build, scene-tree assertions,
  late-surface ancestry checks, resize/reset inspection and `git diff --check`.
