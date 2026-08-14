import gsap from 'gsap';
import { frameLayout, FRAME_LABELS, type FrameId } from '../animation/operationLayouts';
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
    gsap.killTweensOf(refs.operationNodes);
    refs.operationNodes.forEach((node) => {
      const id = node.dataset.operation;
      const placement = id ? layout[id] : undefined;
      if (!placement) return;
      const originX = Number(node.dataset.originX);
      const originY = Number(node.dataset.originY);
      gsap.to(node, {
        x: placement.x - originX,
        y: placement.y - originY,
        scale: placement.scale,
        opacity: placement.opacity,
        transformOrigin: `${originX}px ${originY}px`,
        duration: mode === 'static' ? 0 : 0.72,
        ease: 'power3.inOut',
        overwrite: true,
      });
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
        gsap.killTweensOf(refs.operationNodes);
      }
    },
    destroy() {
      listeners.forEach(({ button, handler }) => button.removeEventListener('click', handler));
      gsap.killTweensOf(refs.operationNodes);
      mount.hidden = true;
    },
  };
}
