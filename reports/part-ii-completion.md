# Part II completion report

Part II now fills `.52–1` with six acts: Conversation, Tube, Recovery,
Projections, Cost and Open. The final state keeps all 16 semantic operations
visible, asks `Which frame now?`, and leaves Read, Thread, Structure and Spec
available through the live switcher.

## Architecture

- Frame, material and operation geometry retain one persistent state owner.
- Animated and interactive layouts both use `tweenOperationLayout()` over
  `operationStates`; the switcher cancels only its own transition timeline.
- No act creates scene nodes, duplicates an operation, or introduces a new
  dependency.
- Responsive rebuilds preserve the active act and restore its declared settle
  state after ScrollTrigger remaps viewport-dependent coordinates.

## Verification

- Forward and backward navigation through Cost and Open
- Fast-scroll landing at authored endpoints
- All four live projection choices with 16 operations retained
- Cinematic → compact → cinematic rebuild at Open
- Reduced-motion Open endpoint and live Thread selection
- TypeScript, ESLint, production build and diff validation
