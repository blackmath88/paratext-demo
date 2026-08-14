import type { OperationPlacementState, SceneRefs } from '../scene/scene';

type OperationTarget = Partial<OperationPlacementState> & Pick<OperationPlacementState, 'x' | 'y'>;

/** Single positional writer for a durable operation identity. */
export function tweenOperation(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  index: number,
  target: OperationTarget,
  vars: { duration: number; ease?: string },
  position: number,
): void {
  const state = refs.operationStates[index];
  const node = refs.operationNodes[index];
  if (!state || !node) return;
  const originX = Number(node.dataset.originX);
  const originY = Number(node.dataset.originY);
  tl.to(state, {
    ...target,
    ...vars,
    onUpdate: () => {
      const dx = state.x - originX;
      const dy = state.y - originY;
      node.setAttribute(
        'transform',
        `translate(${dx} ${dy}) translate(${originX} ${originY}) scale(${state.scale}) translate(${-originX} ${-originY})`,
      );
      node.style.opacity = String(state.opacity);
    },
  }, position);
}
