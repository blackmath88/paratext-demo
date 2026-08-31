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

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Lenis from 'lenis';
import { buildMaster, type Master, type ScrollTo } from './animation/master';
import { acts, actAt, settlePoints, chapterForAct, type Act } from './data/acts';
import { buildNavigation, type Navigation } from './navigation/actNavigation';
import { buildFrameSwitcher, type FrameSwitcher } from './navigation/frameSwitcher';
import { buildScene, type SceneRefs } from './scene/scene';
import { detectMode, onModeChange, type Mode } from './utils/env';

const stage = document.querySelector<HTMLElement>('#stage');
const sceneMount = document.querySelector<HTMLElement>('#scene-mount');
const navMount = document.querySelector<HTMLElement>('#nav-mount');
const foreground = document.querySelector<HTMLElement>('#foreground');
const frameSwitcherMount = document.querySelector<HTMLElement>('#frame-switcher');

if (!stage || !sceneMount || !navMount || !foreground || !frameSwitcherMount) {
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
const projections = acts.find((act) => act.id === 'projections');
const projectionsSettle = projections
  ? projections.start + (projections.end - projections.start) * projections.settle
  : 1;
const cost = acts.find((act) => act.id === 'cost');
const costSettle = cost
  ? cost.start + (cost.end - cost.start) * cost.settle
  : 1;

// ---------------------------------------------------------------------------
// Foreground story layer
// ---------------------------------------------------------------------------

type StoryOverlay = {
  update(progress: number): void;
  setTransitioning(active: boolean): void;
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

function buildStoryOverlay(mount: HTMLElement): StoryOverlay {
  const layer = document.createElement('div');
  layer.className = 'story-layer';
  layer.setAttribute('aria-hidden', 'true');

  const station = document.createElement('section');
  station.className = 'story-station';

  const stationChapter = document.createElement('p');
  stationChapter.className = 'story-station__chapter';

  const stationTitle = document.createElement('h2');
  stationTitle.className = 'story-station__title';

  const stationCopy = document.createElement('p');
  stationCopy.className = 'story-station__copy';

  station.append(stationChapter, stationTitle, stationCopy);

  const chapterPlate = document.createElement('section');
  chapterPlate.className = 'chapter-plate';
  chapterPlate.hidden = true;

  const plateNumber = document.createElement('p');
  plateNumber.className = 'chapter-plate__number';

  const plateTitle = document.createElement('h2');
  plateTitle.className = 'chapter-plate__title';

  const plateSubtitle = document.createElement('p');
  plateSubtitle.className = 'chapter-plate__subtitle';

  const plateSupport = document.createElement('p');
  plateSupport.className = 'chapter-plate__support';

  const plateHint = document.createElement('p');
  plateHint.className = 'chapter-plate__hint';
  plateHint.textContent = 'scroll';

  chapterPlate.append(plateNumber, plateTitle, plateSubtitle, plateSupport, plateHint);

  const hint = document.createElement('p');
  hint.className = 'scroll-hint';
  hint.hidden = true;
  hint.textContent = 'scroll to continue';

  layer.append(station, chapterPlate, hint);
  mount.append(layer);

  let transitioning = false;
  let hintTimer: number | undefined;

  const hideHint = () => {
    if (hintTimer !== undefined) window.clearTimeout(hintTimer);
    hintTimer = undefined;
    hint.hidden = true;
  };

  const showHint = () => {
    if (transitioning) return;
    if (hintTimer !== undefined) window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (!transitioning) hint.hidden = false;
    }, 320);
  };

  const update = (progress: number) => {
    const act = actAt(progress);
    if (act.id === 'open') {
      station.hidden = true;
      chapterPlate.hidden = true;
      hideHint();
      return;
    }

    const chapter = chapterForAct(act);
    const index = acts.indexOf(act);
    const settle = settlePoints[index] ?? act.start;
    const activeBeat = beatAt(act, progress);
    const chapterPlateActive = Boolean(
      act.chapterIntro
      && (mode === 'static' || progress < settle - 0.002),
    );

    // A chapter plate owns the whole field. Keeping the station beneath it
    // produces two simultaneous narrator voices (and, at narrower ratios,
    // literal text-on-text collisions).
    station.hidden = chapterPlateActive;
    stationChapter.textContent = `${chapter.number} · ${chapter.title}`;
    stationTitle.textContent = act.title;
    stationCopy.textContent = activeBeat ?? act.thesis;
    stationCopy.classList.toggle('is-beat', Boolean(activeBeat));

    chapterPlate.hidden = !chapterPlateActive;
    if (chapterPlateActive) {
      plateNumber.textContent = chapter.number;
      plateTitle.textContent = chapter.title;
      plateSubtitle.textContent = chapter.subtitle;
      plateSupport.textContent = chapter.support ?? '';
    }

    if (transitioning || chapterPlateActive || Math.abs(progress - settle) > 0.004) {
      hideHint();
    } else {
      showHint();
    }
  };

  return {
    update,
    setTransitioning(active: boolean) {
      transitioning = active;
      if (active) hideHint();
      else showHint();
    },
    destroy() {
      hideHint();
      layer.remove();
    },
  };
}

// ---------------------------------------------------------------------------
// Timeline lifecycle
// ---------------------------------------------------------------------------

let master: Master | undefined;
let navigation: Navigation | undefined;
let frameSwitcher: FrameSwitcher | undefined;
let staticObserver: IntersectionObserver | undefined;
let storyOverlay: StoryOverlay | undefined;
let renderedProgress = 0;
let resizeAnchorId: string | undefined;
let resizeAnchorTimer: number | undefined;
let lenis: Lenis | undefined;
let lenisTick: ((time: number) => void) | undefined;
const application = acts.find((act) => act.id === 'application');
let transitionReleaseAt = 0;
let transitionTargetIndex: number | undefined;
let wheelAccumulated = 0;
let wheelLocked = false;

/** Local position in an act, as a master-timeline progress. */
function localPoint(act: Act, at: number): number {
  return act.start + (act.end - act.start) * at;
}

function progressForAct(act: Act): number {
  const index = acts.indexOf(act);
  return settlePoints[index] ?? act.start;
}

function beginTransition(targetProgress: number, smooth: boolean, targetIndex?: number): void {
  transitionTargetIndex = targetIndex;
  const animated = smooth && mode !== 'static';
  transitionReleaseAt = performance.now() + (animated ? 900 : 0);
  wheelAccumulated = 0;
  wheelLocked = animated;
  storyOverlay?.setTransitioning(animated);
  master?.seek(targetProgress, animated, true);
  if (!animated) {
    wheelLocked = false;
    storyOverlay?.setTransitioning(false);
  }
}

// The action view is on screen from 0.31 and the scripted approval fires at
// 0.39; the button is offered over that stretch and lands on 0.48, where the
// state spine and both status labels have finished changing.
const ACTION_AVAILABLE = { from: 0.32, to: 0.44 };
const ACTION_TARGET = 0.48;

function performApplicationAction(): void {
  if (!master || !application) return;
  // The action is authored as a deliberate internal move, not a new station.
  beginTransition(localPoint(application, ACTION_TARGET), true);
}

refs.appAction.addEventListener('click', performApplicationAction);
refs.appAction.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  performApplicationAction();
});

/** Lenis exists only while an animated master exists. */
function attachSmoothScroll(): ScrollTo | undefined {
  if (mode === 'static') return undefined;

  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  lenisTick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(lenisTick);
  gsap.ticker.lagSmoothing(0);

  return (target, immediate) => lenis?.scrollTo(target, { immediate });
}

function detachSmoothScroll(): void {
  if (lenisTick) gsap.ticker.remove(lenisTick);
  lenisTick = undefined;
  lenis?.destroy();
  lenis = undefined;
}

// Capture the stable act before ScrollTrigger remaps scroll coordinates. The
// anchor expires if the resize does not actually cross a responsive mode.
window.addEventListener('resize', () => {
  resizeAnchorId = location.hash.replace('#', '');
  if (resizeAnchorTimer !== undefined) window.clearTimeout(resizeAnchorTimer);
  resizeAnchorTimer = window.setTimeout(() => { resizeAnchorId = undefined; }, 400);
}, { passive: true });

function onProgress(progress: number): void {
  renderedProgress = progress;
  storyOverlay?.update(progress);
  const currentAct = actAt(progress);
  const currentIndex = acts.indexOf(currentAct);
  const settledProgress = settlePoints[currentIndex] ?? currentAct.start;
  if (wheelLocked && performance.now() >= transitionReleaseAt) {
    if (transitionTargetIndex === undefined || currentIndex === transitionTargetIndex || Math.abs(progress - settledProgress) < 0.004) {
      wheelLocked = false;
      storyOverlay?.setTransitioning(false);
    }
  }
  const actionAvailable = Boolean(application
    && progress >= localPoint(application, ACTION_AVAILABLE.from)
    && progress <= localPoint(application, ACTION_AVAILABLE.to));
  refs.appAction.setAttribute('tabindex', actionAvailable ? '0' : '-1');
  refs.appAction.setAttribute('aria-hidden', actionAvailable ? 'false' : 'true');
  // An SVG element at opacity 0 is still hit-testable: without this the button
  // stays clickable — and shows a pointer cursor — for the whole piece.
  refs.appAction.style.pointerEvents = actionAvailable ? 'auto' : 'none';
  navigation?.update(progress);
  const costIsMoving = Boolean(
    cost && progress >= cost.start - 0.001 && progress < costSettle - 0.001,
  );
  const authoredFrame = cost && progress >= costSettle - 0.001 ? 'spec' : 'essay';
  frameSwitcher?.setEnabled(
    progress >= projectionsSettle - 0.001 && !costIsMoving,
    authoredFrame,
  );
}

function currentStationIndex(progress: number): number {
  return acts.indexOf(actAt(progress));
}

function requestAct(act: Act, smooth: boolean): void {
  if (!master) return;
  beginTransition(progressForAct(act), smooth, acts.indexOf(act));
}

function handleWheel(event: WheelEvent): void {
  if (!master?.trigger || mode === 'static' || !master.trigger.isActive) return;
  if (wheelLocked && performance.now() < transitionReleaseAt) {
    event.preventDefault();
    return;
  }

  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  if (!delta) return;
  event.preventDefault();

  const normalized = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? delta * 22
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? delta * window.innerHeight
      : delta;

  if (wheelAccumulated && Math.sign(normalized) !== Math.sign(wheelAccumulated)) {
    wheelAccumulated = 0;
  }
  wheelAccumulated += normalized;

  const threshold = mode === 'compact' ? 84 : 120;
  if (Math.abs(wheelAccumulated) < threshold) return;

  const direction = wheelAccumulated > 0 ? 1 : -1;
  wheelAccumulated = 0;
  const index = currentStationIndex(renderedProgress);
  const nextIndex = Math.max(0, Math.min(acts.length - 1, index + direction));
  if (nextIndex === index) return;
  const nextAct = acts[nextIndex];
  if (!nextAct) return;
  requestAct(nextAct, true);
}

function handleKeydown(event: KeyboardEvent): void {
  if (!master?.trigger || mode === 'static' || !master.trigger.isActive) return;
  const advanceKeys = ['PageDown', 'ArrowDown', ' '];
  const retreatKeys = ['PageUp', 'ArrowUp'];
  if (!advanceKeys.includes(event.key) && !retreatKeys.includes(event.key)) return;
  event.preventDefault();
  if (wheelLocked && performance.now() < transitionReleaseAt) return;
  const direction = advanceKeys.includes(event.key) ? 1 : -1;
  const index = currentStationIndex(renderedProgress);
  const nextIndex = Math.max(0, Math.min(acts.length - 1, index + direction));
  if (nextIndex === index) return;
  const nextAct = acts[nextIndex];
  if (!nextAct) return;
  requestAct(nextAct, true);
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
      current.seek(settlePoints[index] ?? act.start, false);
    },
    { threshold: [0.25, 0.6] },
  );
  for (const s of sections) staticObserver.observe(s);
}

function boot(initialProgress = 0): void {
  const scrollTo = attachSmoothScroll();
  master = buildMaster(refs, mode, stage!, onProgress, scrollTo);
  frameSwitcher = buildFrameSwitcher(frameSwitcherMount!, refs, mode);
  storyOverlay = buildStoryOverlay(foreground!);
  navigation = buildNavigation(navMount!, requestAct, startupActId);
  startupActId = undefined;
  if (mode === 'static') attachStaticObserver(master);
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeydown, { passive: false });
  ScrollTrigger.refresh();
  if (initialProgress > 0) {
    requestAnimationFrame(() => {
      master?.seek(initialProgress, false);
      requestAnimationFrame(() => {
        master?.timeline.progress(initialProgress);
        onProgress(initialProgress);
      });
    });
  } else {
    onProgress(0);
  }
}

function teardown(): void {
  staticObserver?.disconnect();
  staticObserver = undefined;
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('keydown', handleKeydown);
  navigation?.destroy();
  navigation = undefined;
  frameSwitcher?.destroy();
  frameSwitcher = undefined;
  storyOverlay?.destroy();
  storyOverlay = undefined;
  master?.destroy();
  master = undefined;
  detachSmoothScroll();
}

boot();

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

// Fonts change text metrics, which changes nothing we measure — but ScrollTrigger
// measures the document, and webfont swap can change its height.
document.fonts?.ready.then(() => ScrollTrigger.refresh());

document.documentElement.classList.add('is-ready');
