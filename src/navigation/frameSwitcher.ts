// Activated only after the projections act reaches its stable endpoint.
import gsap from 'gsap';
import { frameLayout, FRAME_LABELS, type FrameId } from '../animation/operationLayouts';
import { tweenOperationLayout } from '../animation/operations';
import type { SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';

export type FrameSwitcher = {
  setEnabled(enabled: boolean, renderedFrame?: FrameId): void;
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
    tweenOperationLayout(transition, refs, layout, {
      duration: mode === 'static' ? 0.01 : 0.72,
      ease: 'power3.inOut',
    }, 0);
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
    setEnabled(next, renderedFrame) {
      if (next === enabled) {
        if (enabled && renderedFrame && current !== renderedFrame) {
          current = renderedFrame;
          reflect();
        }
        return;
      }
      enabled = next;
      mount.hidden = !enabled;
      buttons.forEach((button) => { button.disabled = !enabled; });
      if (enabled) {
        const rendered = refs.reframeCurrent.textContent.toLowerCase();
        current = renderedFrame ?? (Object.keys(FRAME_LABELS) as FrameId[]).find((frame) =>
          rendered.includes(FRAME_LABELS[frame].toLowerCase()),
        ) ?? 'essay';
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
