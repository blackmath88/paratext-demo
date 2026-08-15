/**
 * The single master timeline.
 *
 * One ScrollTrigger drives one timeline. No act owns a trigger of its own, so
 * there is exactly one source of truth for "where are we" — which is what lets
 * the navigator, the hash and the scene stay in agreement.
 *
 * Each act timeline is scaled to the span declared in `data/acts.ts`. That
 * makes the data authoritative: to re-pace the piece you edit the numbers in
 * acts.ts, not the choreography.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { acts, settlePoints } from '../data/acts';
import { resetScene, type SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { actBare } from './actBare';
import { actPage } from './actPage';
import { actGlosses } from './actGlosses';
import { actPrint } from './actPrint';
import { actEditorial } from './actEditorial';
import { actApplication } from './actApplication';
import { actFragments } from './actFragments';
import { actConversation } from './actConversation';
import { actTube } from './actTube';
import { actRecovery } from './actRecovery';

gsap.registerPlugin(ScrollTrigger);

/** Arbitrary internal time units; act spans are scaled into this. */
const TOTAL = 14;
const CHOREOGRAPHY_RATIO = 0.7;

function nearest(points: number[], value: number): number {
  // Preserve the true ends of the pinned range so snap can never pull a user
  // back into the piece while they are trying to leave it.
  if (value <= 0.002 || value >= 0.998 || points.length === 0) return value;
  return points.reduce((closest, point) =>
    Math.abs(point - value) < Math.abs(closest - value) ? point : closest,
  );
}

function fitWithPlateau(child: gsap.core.Timeline, duration: number): void {
  child.duration(duration * CHOREOGRAPHY_RATIO);
  child.to({ held: 0 }, { held: 1, duration: duration * (1 - CHOREOGRAPHY_RATIO), ease: 'none' });
}

const BUILDERS = {
  bare: actBare,
  page: actPage,
  glosses: actGlosses,
  print: actPrint,
  editorial: actEditorial,
  application: actApplication,
  fragments: actFragments,
  conversation: actConversation,
  tube: actTube,
  recovery: actRecovery,
} as const;

export type Master = {
  timeline: gsap.core.Timeline;
  trigger: ScrollTrigger | undefined;
  /** Scroll to a normalized master progress. Smooth unless motion is reduced. */
  seek(progress: number, smooth: boolean): void;
  destroy(): void;
};

export function buildMaster(
  refs: SceneRefs,
  mode: Mode,
  stage: HTMLElement,
  onProgress: (progress: number) => void,
): Master {
  gsap.set(refs.svg.querySelectorAll('*'), { clearProps: 'all' });
  resetScene(refs);
  gsap.set(refs.page, { x: 0, y: 0, scale: 1, transformOrigin: '50% 46%' });
  gsap.set(refs.surface, { x: 0, y: 0, scale: 1 });

  const timeline = gsap.timeline({ paused: mode === 'static' });

  for (const act of acts) {
    const build = BUILDERS[act.id as keyof typeof BUILDERS];
    if (!build) continue;
    const child = build(refs, mode);
    // Conform the act to its declared span; acts.ts owns all pacing.
    fitWithPlateau(child, (act.end - act.start) * TOTAL);
    timeline.add(child, act.start * TOTAL);
  }

  // Guarantee the master spans the full declared range even if the last act's
  // choreography finishes early — progress 1.0 means the latest stable state.
  timeline.to({ hold: 0 }, { hold: 1, duration: 0.001 }, TOTAL);

  if (mode === 'static') {
    // Reduced motion: the same timeline, seeked and held. Never played.
    timeline.progress(0);
    onProgress(0);
    return {
      timeline,
      trigger: undefined,
      seek: (progress) => {
        timeline.progress(gsap.utils.clamp(0, 1, progress));
        onProgress(progress);
      },
      destroy: () => {
        timeline.kill();
      },
    };
  }

  const scrollLength = mode === 'cinematic' ? '+=800%' : '+=460%';

  const trigger = ScrollTrigger.create({
    animation: timeline,
    trigger: stage,
    start: 'top top',
    end: scrollLength,
    // The whole stage pins, so the foreground copy and the margin navigator
    // hold with the scene rather than scrolling off it.
    pin: mode === 'cinematic' ? stage : false,
    pinSpacing: mode === 'cinematic',
    scrub: mode === 'cinematic' ? 1 : 0.6,
    snap: {
      snapTo: (value) => nearest(settlePoints, value),
      duration: { min: 0.15, max: 0.5 },
      delay: 0.06,
      ease: 'power2.inOut',
      inertia: false,
    },
    invalidateOnRefresh: true,
    onUpdate: (self) => onProgress(self.progress),
  });

  return {
    timeline,
    trigger,
    seek: (progress, smooth) => {
      const clamped = gsap.utils.clamp(0, 1, progress);
      const start = trigger.start;
      const target = start + (trigger.end - start) * clamped;
      window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
    },
    destroy: () => {
      trigger.kill();
      timeline.kill();
    },
  };
}
