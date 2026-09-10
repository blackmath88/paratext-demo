/**
 * The single master timeline.
 *
 * One paused timeline owns the whole piece. The transport moves its playhead;
 * no act owns playback of its own, so there is exactly one source of truth for
 * "where are we" — which is what lets the controls, navigator, hash and scene
 * stay in agreement.
 *
 * Each act timeline is scaled to the span declared in `data/acts.ts`. That
 * makes the data authoritative: to re-pace the piece you edit the numbers in
 * acts.ts, not the choreography.
 */

import gsap from 'gsap';
import { acts } from '../data/acts';
import { resetScene, type SceneRefs } from '../scene/scene';
import type { Mode } from '../utils/env';
import { actBare } from './actBare';
import { actPage } from './actPage';
import { actGlosses } from './actGlosses';
import { actPrint } from './actPrint';
import { actEditorial } from './actEditorial';
import { actMagazine } from './actMagazine';
import { actHypertext } from './actHypertext';
import { actApplication } from './actApplication';
import { actFragments } from './actFragments';
import { actConversation } from './actConversation';
import { actTube } from './actTube';
import { actRecovery } from './actRecovery';
import { actProjections } from './actProjections';
import { actCost } from './actCost';
import { actOpen } from './actOpen';

/** Arbitrary internal time units; act spans are scaled into this. */
const TOTAL = 15;

function fitWithPlateau(
  child: gsap.core.Timeline,
  duration: number,
  settle: number,
): gsap.core.Timeline {
  const fitted = gsap.timeline();
  const choreographyDuration = duration * settle;
  const naturalDuration = child.duration();
  if (naturalDuration > 0 && choreographyDuration > 0) {
    child.timeScale(naturalDuration / choreographyDuration);
  }
  fitted.add(child, 0);
  fitted.to(
    { held: 0 },
    { held: 1, duration: duration - choreographyDuration, ease: 'none' },
    '>',
  );
  if (
    Math.abs(child.endTime() - choreographyDuration) > 0.001
    || Math.abs(fitted.duration() - duration) > 0.001
  ) {
    throw new Error('Act timing invariant failed: choreography and plateau do not fit the declared span.');
  }
  return fitted;
}

const BUILDERS = {
  bare: actBare,
  page: actPage,
  glosses: actGlosses,
  print: actPrint,
  editorial: actEditorial,
  magazine: actMagazine,
  hypertext: actHypertext,
  application: actApplication,
  fragments: actFragments,
  conversation: actConversation,
  tube: actTube,
  recovery: actRecovery,
  projections: actProjections,
  cost: actCost,
  open: actOpen,
} as const;

export type Master = {
  timeline: gsap.core.Timeline;
  /** Place the playhead immediately at a normalized master progress. */
  seek(progress: number): void;
  /** Animate the playhead to a normalized progress in authored wall-clock time. */
  moveTo(progress: number, duration: number, onComplete?: () => void): void;
  /** Stop an in-flight move without changing the rendered progress. */
  pause(): void;
  destroy(): void;
};

export function buildMaster(
  refs: SceneRefs,
  mode: Mode,
  onProgress: (progress: number) => void,
): Master {
  gsap.set(refs.svg.querySelectorAll('*'), { clearProps: 'all' });
  resetScene(refs);
  gsap.set(refs.page, { x: 0, y: 0, scale: 1, transformOrigin: '50% 46%' });
  gsap.set(refs.surface, { x: 0, y: 0, scale: 1 });

  // Everything downstream — foreground copy, navigator and transport — reads
  // the progress the scene is actually rendering.
  const timeline = gsap.timeline({
    paused: true,
    onUpdate: () => onProgress(timeline.progress()),
  });

  for (const act of acts) {
    const build = BUILDERS[act.id as keyof typeof BUILDERS];
    if (!build) continue;
    const child = build(refs, mode);
    // Conform the act to its declared span; acts.ts owns all pacing.
    const fitted = fitWithPlateau(child, (act.end - act.start) * TOTAL, act.settle);
    timeline.add(fitted, act.start * TOTAL);
  }

  // Guarantee the master spans the full declared range even if the last act's
  // choreography finishes early — progress 1.0 means the latest stable state.
  timeline.to({ hold: 0 }, { hold: 1, duration: 0.001 }, TOTAL);

  let movement: gsap.core.Tween | undefined;

  const seek = (progress: number) => {
    movement?.kill();
    movement = undefined;
    const clamped = gsap.utils.clamp(0, 1, progress);
    timeline.progress(clamped);
    onProgress(clamped);
  };

  return {
    timeline,
    seek,
    moveTo: (progress, duration, onComplete) => {
      movement?.kill();
      const clamped = gsap.utils.clamp(0, 1, progress);
      if (mode === 'static' || duration <= 0) {
        seek(clamped);
        onComplete?.();
        return;
      }
      movement = gsap.to(timeline, {
        progress: clamped,
        duration,
        ease: 'none',
        overwrite: true,
        onComplete: () => {
          movement = undefined;
          onComplete?.();
        },
      });
    },
    pause: () => {
      movement?.kill();
      movement = undefined;
    },
    destroy: () => {
      movement?.kill();
      timeline.kill();
    },
  };
}
