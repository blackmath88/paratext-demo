import type { OperationPlacementState, SceneRefs } from '../scene/scene';
import type { OperationLayout } from './operationLayouts';

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

/** Move the complete semantic field into one projection through shared state. */
export function tweenOperationLayout(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  layout: OperationLayout,
  vars: { duration: number; ease?: string },
  position: number,
  stagger = 0.012,
): void {
  refs.operationNodes.forEach((node, i) => {
    const id = node.dataset.operation;
    const placement = id ? layout[id] : undefined;
    if (!placement) return;
    tweenOperation(tl, refs, i, placement, vars, position + i * stagger);
  });
}
