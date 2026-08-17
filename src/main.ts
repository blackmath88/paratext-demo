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
import { acts, settlePoints } from './data/acts';
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
 */
const fragments = acts.map((act) => {
  const p = document.createElement('p');
  p.className = `fragment fragment--${act.id}`;
  p.setAttribute('aria-hidden', 'true');
  p.textContent = act.thesis;
  foreground.appendChild(p);
  return { act, node: p };
});
const openingRegimeEnd = acts.find((act) => act.id === 'magazine')?.end ?? 0;

function updateFragments(progress: number): void {
  for (const { act, node } of fragments) {
    const span = act.end - act.start;
    const isOpeningRegime = act.end <= openingRegimeEnd;
    const from = act.start + span * (isOpeningRegime ? 0.04 : 0.14);
    const to = act.start + span * (isOpeningRegime ? Math.min(0.94, act.settle + 0.16) : 0.52);
    node.classList.toggle('is-visible', progress >= from && progress <= to);
  }
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
