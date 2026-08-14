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
import { buildMaster, type Master } from './animation/master';
import { acts } from './data/acts';
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

let mode: Mode = detectMode();
document.body.dataset.mode = mode;

const refs: SceneRefs = buildScene(sceneMount);

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

function updateFragments(progress: number): void {
  for (const { act, node } of fragments) {
    const span = act.end - act.start;
    const from = act.start + span * 0.14;
    const to = act.start + span * 0.52;
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

function onProgress(progress: number): void {
  navigation?.update(progress);
  updateFragments(progress);
  frameSwitcher?.setEnabled(progress >= 0.995);
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
      current.seek(act.end - 0.001, false);
    },
    { threshold: [0.25, 0.6] },
  );
  for (const s of sections) staticObserver.observe(s);
}

function boot(): void {
  master = buildMaster(refs, mode, stage!, onProgress);
  navigation = buildNavigation(navMount!, master);
  frameSwitcher = buildFrameSwitcher(frameSwitcherMount!, refs, mode);
  if (mode === 'static') attachStaticObserver(master);
  ScrollTrigger.refresh();
  onProgress(0);
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
}

boot();

onModeChange((next) => {
  mode = next;
  document.body.dataset.mode = mode;
  teardown();
  boot();
});

// Fonts change text metrics, which changes nothing we measure — but ScrollTrigger
// measures the document, and webfont swap can change its height.
document.fonts?.ready.then(() => ScrollTrigger.refresh());

document.documentElement.classList.add('is-ready');
