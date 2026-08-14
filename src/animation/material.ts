import type { MaterialMode, MaterialState, SceneRefs } from '../scene/scene';

type MaterialTarget = Omit<MaterialState, 'mode'> & { mode: MaterialMode };

/** Single writer for the scene's material/background regime. */
export function tweenMaterial(
  tl: gsap.core.Timeline,
  refs: SceneRefs,
  target: MaterialTarget,
  vars: { duration: number; ease?: string },
  position: number,
): void {
  const state = refs.materialState;
  tl.set(state, { mode: 'transition' }, position);
  tl.to(state, {
    fieldColor: target.fieldColor,
    gridOpacity: target.gridOpacity,
    dustOpacity: target.dustOpacity,
    vignetteOpacity: target.vignetteOpacity,
    ...vars,
    onUpdate: () => {
      refs.fieldBase.setAttribute('fill', state.fieldColor);
      refs.screenGrid.style.opacity = String(state.gridOpacity);
      refs.dust.style.opacity = String(state.dustOpacity);
      refs.vignette.style.opacity = String(state.vignetteOpacity);
    },
  }, position);
  tl.set(state, { mode: target.mode }, position + vars.duration);
}
