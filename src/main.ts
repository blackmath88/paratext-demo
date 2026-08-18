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
import { acts, settlePoints, type Act } from './data/acts';
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
// Foreground editorial fragments
// ---------------------------------------------------------------------------

/**
 * Sparse, and deliberately not scrubbed. The scene is continuous; the copy
 * arrives and leaves. Scrubbing text opacity to scroll makes reading feel like
 * operating a slider.
 *
 * Every line becomes a cue with an absolute window on the master timeline, and
 * at most one cue is ever marked visible. All the lines occupy the same slot in
 * the lower-left corner, so two live windows would print one line across the
 * other — which is what a threshold line overlapping its own act's thesis used
 * to do.
 */
type Cue = { node: HTMLElement; from: number; to: number };

const openingRegimeEnd = acts.find((act) => act.id === 'magazine')?.end ?? 0;
const BRIDGE_AT = { from: 0.004, to: 0.1 };

/** Local window for an act's thesis line, unless the act declares its own. */
function thesisWindow(act: Act): { from: number; to: number } {
  if (act.thesisAt) return act.thesisAt;
  // The opening acts are short, so their line holds through the plateau. The
  // later, longer acts state themselves and then give the image the frame back.
  return act.end <= openingRegimeEnd
    ? { from: 0.04, to: Math.min(0.94, act.settle + 0.16) }
    : { from: 0.14, to: 0.52 };
}

function addCue(act: Act, text: string, at: { from: number; to: number }, className: string): Cue {
  const p = document.createElement('p');
  p.className = `fragment ${className}`;
  p.setAttribute('aria-hidden', 'true');
  p.textContent = text;
  foreground!.appendChild(p);
  const span = act.end - act.start;
  return { node: p, from: act.start + span * at.from, to: act.start + span * at.to };
}

const cues: Cue[] = acts.flatMap((act) => [
  ...(act.bridge
    ? [addCue(act, act.bridge, BRIDGE_AT, `fragment--bridge fragment--${act.id}-bridge`)]
    : []),
  addCue(act, act.thesis, thesisWindow(act), `fragment--${act.id}`),
  ...(act.beats ?? []).map((beat, index) =>
    addCue(act, beat.text, beat, `fragment--beat fragment--${act.id}-beat-${index}`)),
]);

let visibleCue: Cue | undefined;

function updateFragments(progress: number): void {
  // Last match wins, so a bridge yields to its thesis and a thesis to its
  // beats even where the authored windows touch.
  let active: Cue | undefined;
  for (const cue of cues) {
    if (progress >= cue.from && progress <= cue.to) active = cue;
  }
  if (active === visibleCue) return;
  visibleCue?.node.classList.remove('is-visible');
  active?.node.classList.add('is-visible');
  visibleCue = active;
}

// ---------------------------------------------------------------------------
// Timeline lifecycle
// ---------------------------------------------------------------------------

let master: Master | undefined;
let navigation: Navigation | undefined;
let frameSwitcher: FrameSwitcher | undefined;
let staticObserver: IntersectionObserver | undefined;
let renderedProgress = 0;
let resizeAnchorId: string | undefined;
let resizeAnchorTimer: number | undefined;
let lenis: Lenis | undefined;
let lenisTick: ((time: number) => void) | undefined;
const application = acts.find((act) => act.id === 'application');

/** Local position in an act, as a master-timeline progress. */
function localPoint(act: Act, at: number): number {
  return act.start + (act.end - act.start) * at;
}

// The action view is on screen from 0.31 and the scripted approval fires at
// 0.39; the button is offered over that stretch and lands on 0.48, where the
// state spine and both status labels have finished changing.
const ACTION_AVAILABLE = { from: 0.32, to: 0.44 };
const ACTION_TARGET = 0.48;

function performApplicationAction(): void {
  if (!master || !application) return;
  // Scroll rather than jump: the point of the control is to watch the state
  // change, and the target is deliberately not a settle point, so snapping is
  // held off until the move has finished.
  master.seek(localPoint(application, ACTION_TARGET), true, true);
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
  updateFragments(progress);
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
  navigation = buildNavigation(navMount!, master, startupActId);
  startupActId = undefined;
  if (mode === 'static') attachStaticObserver(master);
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
  navigation?.destroy();
  navigation = undefined;
  frameSwitcher?.destroy();
  frameSwitcher = undefined;
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
