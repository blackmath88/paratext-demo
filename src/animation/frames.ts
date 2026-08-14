import gsap from 'gsap';
import { framePath, SEED } from '../scene/markup';
import { wobblyLine, wobblyRect } from '../scene/geometry';
import type { FrameRect, LeafFrameState, LineState, SceneRefs } from '../scene/scene';

type TweenVars = { duration: number; ease?: string };

/** The only writer of a fragment frame's `d`. */
export function tweenFrame(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  index: number,
  target: FrameRect,
  vars: TweenVars,
  position: number,
): void {
  const state = refs.frameStates[index];
  const path = refs.fragmentFrames[index];
  if (!state || !path) return;
  tl.to(state, {
    ...target,
    ...vars,
    onUpdate: () => path.setAttribute('d', framePath(state.x, state.y, state.w, state.h)),
  }, position);
}

/** The only writer of the persistent leaf paths' `d`. */
export function tweenLeafFrame(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  target: Partial<LeafFrameState>,
  vars: TweenVars,
  position: number,
): void {
  const state = refs.leafState;
  tl.to(state, {
    ...target,
    ...vars,
    onUpdate: () => {
      const d = wobblyRect(state.x, state.y, state.w, state.h, state.wobble, SEED);
      refs.leaf.setAttribute('d', d);
      refs.leafEdge.setAttribute('d', d);
      refs.leafVerso.setAttribute(
        'd',
        wobblyRect(state.x - 26, state.y + 14, state.w, state.h - 22, state.wobble, SEED + 400),
      );
    },
  }, position);
}

/** The only writer of an inherited rule path's `d`. */
export function tweenRule(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  index: number,
  target: Partial<LineState>,
  vars: TweenVars,
  position: number,
  seed: number,
): void {
  const state = refs.ruleStates[index];
  const path = refs.rulePaths[index];
  if (!state || !path) return;
  tl.to(state, {
    ...target,
    ...vars,
    onUpdate: () => path.setAttribute(
      'd',
      wobblyLine(state.x1, state.y1, state.x2, state.y2, state.wobble, seed),
    ),
  }, position);
}
