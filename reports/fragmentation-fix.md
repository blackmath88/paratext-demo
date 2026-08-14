# Act 06 fragmentation — diagnosis and fix

## Intended claim

The application should not be replaced by a collage of windows. Its locally
coherent regions should be claimed by different tools, pulling related work
apart until the work becomes perceptible in the gaps between frames.

## What was wrong

1. **Tool ownership was accidental.** Operations were assigned with
   `index % windowCount`. Questions, sources, decisions and artifacts therefore
   landed in arbitrary tools, so the fragmentation had no readable cause.
2. **Relations were decorative.** Three fixed curves crossed the field but had
   no source or target operation. They suggested connectivity without showing
   which relationship had been severed.
3. **The application did not fragment.** Its entire UI faded nearly uniformly
   while six coincident outlines expanded. The result read as newly spawned
   windows over a disappearing app rather than the app's regions being pulled
   into separate owners.
4. **Window furniture arrived too early.** Titles and header rules appeared
   while several outlines were still close to the original application frame,
   weakening visible ancestry.
5. **Coincident surfaces stacked.** All six window fills became visible while
   sharing the application outline, briefly producing a false bright panel.

## Changes

- Added explicit semantic ownership in `FRAGMENT_ASSIGNMENTS`:
  questions → voice memo; theoretical sources → research; document claims and
  artifact → draft; print/source material → PDF/sources; decisions and open
  questions → chat; schema, tools, status history and context claim → files.
- Added `fragmentPlacement()` as the single source of truth used by both scene
  construction and animation.
- Replaced arbitrary curves with four named cross-tool relations whose paths
  terminate at their actual operation nodes.
- Animated application regions toward their successor tools before fading:
  navigation → files, records → draft, inspector metadata → sources.
- Delayed window titles/rules until frame separation is legible.
- Kept coincident window fills transparent and introduced their surfaces only
  after their boundaries had separated.
- Drew cross-frame relations only after the tools settle, making the gap—not
  window quantity—the endpoint of the act.

## Expected result

The viewer should now read a causal sequence:

1. one competent application;
2. its regions pulled toward different owners;
3. stable operations landing in semantically appropriate tools;
4. specific relationships visibly crossing tool boundaries;
5. the work residing between otherwise sensible frames.

## Verification

- TypeScript typecheck
- ESLint
- production Vite build
- whitespace/error check with `git diff --check`
