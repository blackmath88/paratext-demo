/**
 * Boot: env → scene → master → navigation → foreground.
 *
 * The scene is built once and survives mode changes. Only the timeline and the
 * navigator are torn down and rebuilt, because the protagonist must not be
 * destroyed by something as incidental as a window resize.
 */

// Latin subsets only. The piece is set in Latin and English; shipping the
// Cyrillic and latin-ext faces roughly tripled the font payload for glyphs
// that can never be reached.
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource/eb-garamond/latin-600.css';
import '@fontsource/caveat/latin-400.css';
import '@fontsource/caveat/latin-600.css';
import './styles/global.css';
import './styles/scene.css';

import { buildMaster, type Master } from './animation/master';
import { acts, actAnnotations, actAt, settlePoints, eraForAct, type Act } from './data/acts';
import { buildNavigation, type Navigation } from './navigation/actNavigation';
import { buildScene, type SceneRefs } from './scene/scene';
import { detectMode, onModeChange, type Mode } from './utils/env';

const stage = document.querySelector<HTMLElement>('#stage');
const sceneMount = document.querySelector<HTMLElement>('#scene-mount');
const navMount = document.querySelector<HTMLElement>('#nav-mount');
const foreground = document.querySelector<HTMLElement>('#foreground');
const enterButton = document.querySelector<HTMLButtonElement>('#enter-animation');
const transport = document.querySelector<HTMLElement>('#transport');
const backButton = document.querySelector<HTMLButtonElement>('#transport-back');
const playButton = document.querySelector<HTMLButtonElement>('#transport-play');
const nextButton = document.querySelector<HTMLButtonElement>('#transport-next');
const transportStatus = document.querySelector<HTMLElement>('#transport-status');
const transportPrompt = document.querySelector<HTMLElement>('#transport-prompt');

if (
  !stage || !sceneMount || !navMount || !foreground || !enterButton
  || !transport || !backButton || !playButton || !nextButton
  || !transportStatus || !transportPrompt
) {
  throw new Error('main: required mount points are missing from the document');
}

// Capture deep links before the browser can apply native anchor scrolling to
// content below the pinned range. Navigation restores the requested act once
// the master has measured its scroll coordinates.
let startupActId = location.hash.replace('#', '') || undefined;
if (startupActId) {
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

let mode: Mode = detectMode();
document.body.dataset.mode = mode;

const refs: SceneRefs = buildScene(sceneMount);

// ---------------------------------------------------------------------------
// Foreground story layer
// ---------------------------------------------------------------------------

type StoryOverlay = {
  update(progress: number): void;
  destroy(): void;
};

function beatAt(act: Act, progress: number): string | undefined {
  if (!act.beats || act.beats.length === 0) return undefined;
  const span = act.end - act.start;
  const local = span > 0 ? (progress - act.start) / span : 0;
  for (const beat of act.beats) {
    if (local >= beat.from && local <= beat.to) return beat.text;
  }
  return undefined;
}

function rangeProgress(value: number, from: number, to: number): number {
  return Math.max(0, Math.min(1, (value - from) / (to - from)));
}

function buildStoryOverlay(mount: HTMLElement): StoryOverlay {
  const layer = document.createElement('div');
  layer.className = 'story-layer';
  layer.setAttribute('aria-hidden', 'true');

  const station = document.createElement('section');
  station.className = 'story-station';

  const stationVoice = document.createElement('p');
  stationVoice.className = 'story-station__voice';
  stationVoice.innerHTML = '<span class="story-station__voice-dot"></span>Narration';

  const stationChapter = document.createElement('p');
  stationChapter.className = 'story-station__chapter';

  const stationTitle = document.createElement('h2');
  stationTitle.className = 'story-station__title';

  const stationCopy = document.createElement('p');
  stationCopy.className = 'story-station__copy';

  const stationBody = document.createElement('p');
  stationBody.className = 'story-station__body';

  station.append(stationVoice, stationChapter, stationTitle, stationCopy, stationBody);

  const annotation = document.createElement('aside');
  annotation.className = 'story-annotation';
  const annotationLabel = document.createElement('span');
  annotationLabel.className = 'story-annotation__label';
  annotationLabel.textContent = 'Why the frame changes';
  const annotationCopy = document.createElement('p');
  annotationCopy.className = 'story-annotation__copy';
  annotation.append(annotationLabel, annotationCopy);

  const threshold = document.createElement('section');
  threshold.className = 'paradigm-threshold';
  threshold.hidden = true;

  const monolith = document.createElement('div');
  monolith.className = 'paradigm-threshold__monolith';

  const thresholdTitle = document.createElement('p');
  thresholdTitle.className = 'paradigm-threshold__title';

  const thresholdTurn = document.createElement('p');
  thresholdTurn.className = 'paradigm-threshold__turn';

  threshold.append(monolith, thresholdTitle, thresholdTurn);
  layer.append(station, annotation, threshold);
  mount.append(layer);

  const update = (progress: number) => {
    const act = actAt(progress);
    const span = act.end - act.start;
    const local = span > 0 ? (progress - act.start) / span : 0;
    const thresholdConfig = act.threshold;
    const thresholdActive = Boolean(thresholdConfig && local < thresholdConfig.until);
    threshold.hidden = !thresholdActive;
    if (thresholdActive && thresholdConfig) {
      const enter = rangeProgress(local, 0, thresholdConfig.until * 0.16);
      const leaveFrom = thresholdConfig.until * 0.84;
      const leave = 1 - rangeProgress(local, leaveFrom, thresholdConfig.until);
      threshold.dataset.variant = thresholdConfig.variant;
      thresholdTitle.textContent = thresholdConfig.title;
      thresholdTurn.textContent = thresholdConfig.turn;
      threshold.style.opacity = String(Math.min(enter, leave));
      monolith.style.opacity = String(
        rangeProgress(local, thresholdConfig.until * 0.14, thresholdConfig.until * 0.34) * leave,
      );
      monolith.style.transform = `translate(-50%, -50%) scaleY(${
        0.12 + rangeProgress(local, thresholdConfig.until * 0.12, thresholdConfig.until * 0.42) * 0.88
      })`;
      thresholdTitle.style.opacity = String(
        rangeProgress(local, thresholdConfig.until * 0.28, thresholdConfig.until * 0.44)
        * (1 - rangeProgress(local, thresholdConfig.until * 0.58, thresholdConfig.until * 0.76)),
      );
      thresholdTurn.style.opacity = String(
        rangeProgress(local, thresholdConfig.until * 0.62, thresholdConfig.until * 0.78) * leave,
      );
    }

    if (act.id === 'open') {
      station.hidden = true;
      annotation.hidden = true;
      return;
    }

    const era = eraForAct(act);
    const activeBeat = beatAt(act, progress);

    station.hidden = thresholdActive;
    const annotationConfig = actAnnotations[act.id];
    annotation.hidden = thresholdActive || !annotationConfig;
    annotationCopy.textContent = annotationConfig?.text ?? '';
    annotationLabel.textContent = annotationConfig?.label ?? 'Why the frame changes';
    annotation.dataset.placement = annotationConfig?.placement ?? 'middle-right';
    if (annotation.dataset.act !== act.id) {
      annotation.dataset.act = act.id;
      annotation.classList.remove('is-entering');
      requestAnimationFrame(() => annotation.classList.add('is-entering'));
    }
    stationChapter.textContent = `${era.number} · ${era.title} / ${act.number}`;
    stationTitle.textContent = act.title;
    stationCopy.textContent = activeBeat ?? act.thesis;
    stationCopy.classList.toggle('is-beat', Boolean(activeBeat));
    const firstSentence = act.body.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ?? act.body;
    stationBody.textContent = firstSentence;
    station.classList.toggle('is-chapter-intro', Boolean(act.chapterIntro));
    if (station.dataset.act !== act.id) {
      station.dataset.act = act.id;
      station.classList.remove('is-entering');
      requestAnimationFrame(() => station.classList.add('is-entering'));
    }
  };

  return {
    update,
    destroy() {
      layer.remove();
    },
  };
}

// ---------------------------------------------------------------------------
// Timeline lifecycle
// ---------------------------------------------------------------------------

let master: Master | undefined;
let navigation: Navigation | undefined;
let staticObserver: IntersectionObserver | undefined;
let storyOverlay: StoryOverlay | undefined;
let renderedProgress = 0;
let resizeAnchorId: string | undefined;
let resizeAnchorTimer: number | undefined;
const application = acts.find((act) => act.id === 'application');
let playbackTargetIndex = 0;
let playing = false;
let stageVisible = false;
let hasStarted = false;
let holdTimer: number | undefined;

/** Local position in an act, as a master-timeline progress. */
function localPoint(act: Act, at: number): number {
  return act.start + (act.end - act.start) * at;
}

function progressForAct(act: Act): number {
  const index = acts.indexOf(act);
  return settlePoints[index] ?? act.start;
}

const PLAYBACK_SECONDS = 92;
const MIN_TRANSITION_SECONDS = 1.8;
const DEFAULT_HOLD_MS = 2800;
const HOLD_MS: Partial<Record<Act['id'], number>> = {
  bare: 3400,
  hypertext: 3600,
  application: 3600,
  conversation: 3400,
  recovery: 4800,
  projections: 5400,
  cost: 4600,
  open: 0,
};
const TRANSITION_SECONDS: Partial<Record<Act['id'], number>> = {
  conversation: 10,
  tube: 7,
  recovery: 9,
  projections: 10,
  cost: 8,
};

function clearPlaybackTimer(): void {
  if (holdTimer !== undefined) window.clearTimeout(holdTimer);
  holdTimer = undefined;
}

function transitionDuration(act: Act, targetProgress: number): number {
  const remaining = Math.abs(targetProgress - renderedProgress);
  const choreographySpan = (act.end - act.start) * act.settle;
  const authored = TRANSITION_SECONDS[act.id] ?? choreographySpan * PLAYBACK_SECONDS;
  const remainingRatio = choreographySpan > 0 ? Math.min(1, remaining / choreographySpan) : 1;
  return Math.max(MIN_TRANSITION_SECONDS, authored * remainingRatio);
}

function updateTransport(): void {
  const displayIndex = Math.max(0, playbackTargetIndex);
  const displayAct = acts[displayIndex] ?? acts[0];
  playButton!.textContent = playing ? 'Pause' : 'Play';
  playButton!.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
  playButton!.setAttribute('aria-pressed', playing ? 'true' : 'false');
  backButton!.disabled = displayIndex <= 0;
  nextButton!.disabled = displayIndex >= acts.length - 1;
  transportStatus!.textContent = `${displayAct?.number ?? '00'} / ${acts[acts.length - 1]?.number ?? '14'}`;
  transport!.dataset.state = playing ? 'playing' : 'paused';
  stage!.dataset.playback = playing ? 'playing' : 'paused';
  transportPrompt!.hidden = hasStarted || !stageVisible;
}

function scheduleAdvance(index: number): void {
  clearPlaybackTimer();
  if (!playing || !stageVisible || document.hidden || mode === 'static') return;
  if (index >= acts.length - 1) {
    playing = false;
    updateTransport();
    return;
  }
  const act = acts[index];
  holdTimer = window.setTimeout(
    () => transitionToAct(index + 1),
    HOLD_MS[act?.id ?? 'bare'] ?? DEFAULT_HOLD_MS,
  );
}

function transitionToAct(index: number, immediate = false): void {
  if (!master) return;
  clearPlaybackTimer();
  const boundedIndex = Math.max(0, Math.min(acts.length - 1, index));
  const act = acts[boundedIndex];
  if (!act) return;
  playbackTargetIndex = boundedIndex;
  const target = progressForAct(act);

  if (immediate || mode === 'static') {
    master.seek(target);
    updateTransport();
    if (playing) scheduleAdvance(boundedIndex);
    return;
  }

  // Plateaus exist to hold a resolved state. Skip the outgoing plateau before
  // an automatic forward move so it does not become a second, invisible delay.
  const currentIndex = acts.indexOf(actAt(renderedProgress));
  const currentAct = acts[currentIndex];
  if (boundedIndex > currentIndex && currentAct && renderedProgress >= progressForAct(currentAct)) {
    master.seek(currentAct.end);
  }

  master.moveTo(target, transitionDuration(act, target), () => {
    updateTransport();
    if (playing) scheduleAdvance(boundedIndex);
  });
  updateTransport();
}

function resumePlayback(): void {
  if (!master || !playing || !stageVisible || document.hidden || mode === 'static') return;
  const targetAct = acts[playbackTargetIndex];
  if (!targetAct) return;
  const target = progressForAct(targetAct);
  if (Math.abs(renderedProgress - target) < 0.001) {
    scheduleAdvance(playbackTargetIndex);
  } else {
    transitionToAct(playbackTargetIndex);
  }
}

function setPlaying(next: boolean): void {
  if (mode === 'static') return;
  if (
    next
    && playbackTargetIndex >= acts.length - 1
    && Math.abs(renderedProgress - progressForAct(acts[acts.length - 1]!)) < 0.001
  ) {
    playbackTargetIndex = 0;
    master?.seek(0);
  }
  playing = next;
  clearPlaybackTimer();
  if (!next) {
    master?.pause();
  }
  updateTransport();
  if (next) resumePlayback();
}

function requestTransportAct(index: number): void {
  hasStarted = true;
  setPlaying(false);
  transitionToAct(index);
}

// The action view is on screen from 0.31 and the scripted approval fires at
// 0.39; the button is offered over that stretch and lands on 0.48, where the
// state spine and both status labels have finished changing.
const ACTION_AVAILABLE = { from: 0.32, to: 0.44 };
const ACTION_TARGET = 0.48;

function performApplicationAction(): void {
  if (!master || !application) return;
  setPlaying(false);
  const target = localPoint(application, ACTION_TARGET);
  master.moveTo(target, 1.2);
}

refs.appAction.addEventListener('click', performApplicationAction);
refs.appAction.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  performApplicationAction();
});

backButton.addEventListener('click', () => requestTransportAct(playbackTargetIndex - 1));
nextButton.addEventListener('click', () => requestTransportAct(playbackTargetIndex + 1));
playButton.addEventListener('click', () => {
  hasStarted = true;
  setPlaying(!playing);
});
enterButton.addEventListener('click', () => {
  stage.scrollIntoView({
    behavior: mode === 'static' ? 'auto' : 'smooth',
    block: 'start',
  });
  window.setTimeout(() => playButton.focus({ preventScroll: true }), mode === 'static' ? 0 : 700);
});

// Capture the stable act before responsive reconstruction. The anchor expires
// if the resize does not actually cross a presentation mode.
window.addEventListener('resize', () => {
  resizeAnchorId = location.hash.replace('#', '');
  if (resizeAnchorTimer !== undefined) window.clearTimeout(resizeAnchorTimer);
  resizeAnchorTimer = window.setTimeout(() => { resizeAnchorId = undefined; }, 400);
}, { passive: true });

function onProgress(progress: number): void {
  renderedProgress = progress;
  const activeAct = actAt(progress);
  stage!.dataset.act = activeAct.id;
  stage!.dataset.era = eraForAct(activeAct).id;
  storyOverlay?.update(progress);
  const actionAvailable = Boolean(application
    && progress >= localPoint(application, ACTION_AVAILABLE.from)
    && progress <= localPoint(application, ACTION_AVAILABLE.to));
  refs.appAction.setAttribute('tabindex', actionAvailable ? '0' : '-1');
  refs.appAction.setAttribute('aria-hidden', actionAvailable ? 'false' : 'true');
  // An SVG element at opacity 0 is still hit-testable: without this the button
  // stays clickable — and shows a pointer cursor — for the whole piece.
  refs.appAction.style.pointerEvents = actionAvailable ? 'auto' : 'none';
  navigation?.update(progress);
  updateTransport();
}

function requestAct(act: Act, smooth: boolean): void {
  if (!master) return;
  hasStarted = true;
  setPlaying(false);
  transitionToAct(acts.indexOf(act), !smooth);
}

function handleKeydown(event: KeyboardEvent): void {
  if (!stageVisible || mode === 'static') return;
  const target = event.target as HTMLElement | null;
  if (target?.matches('button, a, input, textarea, select')) return;
  if (!['ArrowLeft', 'ArrowRight', ' '].includes(event.key)) return;
  event.preventDefault();
  if (event.key === ' ') {
    setPlaying(!playing);
    return;
  }
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  requestTransportAct(playbackTargetIndex + direction);
}

/**
 * Reduced motion: no scrubbing at all. Each act section snaps the scene to
 * that act's end state as it comes into view, so the piece reads as a sequence
 * of drawn plates with the argument carried by the text.
 */
function attachStaticObserver(current: Master): void {
  const sections = [...document.querySelectorAll<HTMLElement>('.act[data-act]')];
  staticObserver = new IntersectionObserver(
    (records) => {
      const visible = records
        .filter((r) => r.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.getAttribute('data-act');
      const act = acts.find((a) => a.id === id);
      if (!act) return;
      const index = acts.indexOf(act);
      current.seek(settlePoints[index] ?? act.start);
    },
    { threshold: [0.25, 0.6] },
  );
  for (const s of sections) staticObserver.observe(s);
}

function boot(initialProgress = 0): void {
  master = buildMaster(refs, mode, onProgress);
  storyOverlay = buildStoryOverlay(foreground!);
  navigation = buildNavigation(navMount!, requestAct, startupActId);
  startupActId = undefined;
  if (mode === 'static') attachStaticObserver(master);
  window.addEventListener('keydown', handleKeydown, { passive: false });
  if (initialProgress > 0) {
    requestAnimationFrame(() => {
      master?.seek(initialProgress);
      requestAnimationFrame(() => {
        master?.timeline.progress(initialProgress);
        onProgress(initialProgress);
      });
    });
  } else {
    onProgress(0);
  }
  transport!.hidden = mode === 'static';
  updateTransport();
  if (playing) resumePlayback();
}

function teardown(): void {
  clearPlaybackTimer();
  staticObserver?.disconnect();
  staticObserver = undefined;
  window.removeEventListener('keydown', handleKeydown);
  navigation?.destroy();
  navigation = undefined;
  storyOverlay?.destroy();
  storyOverlay = undefined;
  master?.destroy();
  master = undefined;
}

boot();

function suspendPlayback(): void {
  clearPlaybackTimer();
  master?.pause();
}

function handlePlaybackAvailability(): void {
  if (!playing) return;
  if (stageVisible && !document.hidden) resumePlayback();
  else suspendPlayback();
}

const stageObserver = new IntersectionObserver(
  ([entry]) => {
    stageVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.45);
    if (!stageVisible) {
      suspendPlayback();
      updateTransport();
      return;
    }
    updateTransport();
    handlePlaybackAvailability();
  },
  { threshold: [0, 0.45, 0.75] },
);
stageObserver.observe(stage);

document.addEventListener('visibilitychange', handlePlaybackAvailability);

onModeChange((next) => {
  const activeId = resizeAnchorId ?? location.hash.replace('#', '');
  resizeAnchorId = undefined;
  const activeAct = acts.find((act) => act.id === activeId);
  const activeIndex = activeAct ? acts.indexOf(activeAct) : -1;
  const progress = activeIndex >= 0
    ? settlePoints[activeIndex] ?? renderedProgress
    : renderedProgress;
  mode = next;
  document.body.dataset.mode = mode;
  teardown();
  boot(progress);
});

document.documentElement.classList.add('is-ready');
