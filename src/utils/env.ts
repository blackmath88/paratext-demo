/**
 * Presentation mode. Decided once at boot, re-evaluated on a debounced resize.
 *
 * `compact` is not the desktop timeline squeezed into a phone — it is a
 * different pin/scrub configuration over the same act timelines. `static` is
 * the same timelines again, seeked and held rather than played.
 */

export type Mode = 'cinematic' | 'compact' | 'static';

const CINEMATIC_MIN_WIDTH = 900;

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function detectMode(): Mode {
  if (prefersReducedMotion()) return 'static';
  const wide = window.innerWidth >= CINEMATIC_MIN_WIDTH;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const tall = window.innerHeight >= 520;
  return wide && fine && tall ? 'cinematic' : 'compact';
}

/**
 * Calls back only when the mode actually changes, and only after the resize
 * has settled. Rebuilding the master timeline is expensive and visibly
 * disruptive, so it must not happen on every resize frame.
 */
export function onModeChange(handler: (mode: Mode) => void, delay = 240): () => void {
  let current = detectMode();
  let timer: number | undefined;

  const evaluate = () => {
    const next = detectMode();
    if (next === current) return;
    current = next;
    handler(next);
  };

  const schedule = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = window.setTimeout(evaluate, delay);
  };

  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', evaluate);

  return () => {
    if (timer !== undefined) window.clearTimeout(timer);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('orientationchange', schedule);
    motionQuery.removeEventListener('change', evaluate);
  };
}
