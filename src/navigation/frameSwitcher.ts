// Activated only after the projections act reaches its stable endpoint.
import gsap from 'gsap';
import { frameLayout, FRAME_LABELS, type FrameId } from '../animation/operationLayouts';
import { tweenOperation } from '../animation/operations';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export type FrameSwitcher = {
  setEnabled(enabled: boolean): void;
  destroy(): void;
};

export function buildFrameSwitcher(mount: HTMLElement, refs: SceneRefs, mode: Mode): FrameSwitcher {
  const buttons = [...mount.querySelectorAll<HTMLButtonElement>('button[data-frame]')];
  let current: FrameId = 'essay';
  let enabled = false;
  let transition: gsap.core.Timeline | undefined;

  const reflect = () => {
    buttons.forEach((button) => {
      const selected = button.dataset.frame === current;
      button.classList.toggle('is-current', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };

  const select = (frame: FrameId) => {
    if (!enabled || frame === current) return;
    current = frame;
    const layout = frameLayout(frame);
    transition?.kill();
    transition = gsap.timeline();
    refs.operationNodes.forEach((node, i) => {
      const id = node.dataset.operation;
      const placement = id ? layout[id] : undefined;
      if (!placement) return;
      tweenOperation(transition!, refs, i, placement, {
        duration: mode === 'static' ? 0.01 : 0.72,
        ease: 'power3.inOut',
      }, i * 0.012);
    });
    refs.frameFurniture.forEach((group) => gsap.set(group, { opacity: group.dataset.frame === frame ? 1 : 0 }));
    refs.reframeCurrent.textContent = `FRAME / ${FRAME_LABELS[frame].toUpperCase()}`;
    reflect();
  };

  const listeners = buttons.map((button) => {
    const handler = () => select(button.dataset.frame as FrameId);
    button.addEventListener('click', handler);
    return { button, handler };
  });

  reflect();
  return {
    setEnabled(next) {
      if (next === enabled) return;
      enabled = next;
      mount.hidden = !enabled;
      buttons.forEach((button) => { button.disabled = !enabled; });
      if (enabled) {
        current = 'essay';
        reflect();
      } else {
        transition?.kill();
        transition = undefined;
      }
    },
    destroy() {
      listeners.forEach(({ button, handler }) => button.removeEventListener('click', handler));
      transition?.kill();
      mount.hidden = true;
    },
  };
}
