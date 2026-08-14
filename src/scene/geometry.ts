/**
 * Deliberate imperfection, made reproducible.
 *
 * Every irregular line in the piece comes from here. The randomness is seeded
 * so the same page is drawn identically on every reload, on resize, and in the
 * reduced-motion snapshot. Imperfection is authored, so it has to be stable —
 * a fresh Math.random() each frame reads as noise, a fixed seed reads as a
 * drawn object.
 */

/** mulberry32 — small, fast, good enough distribution for visual jitter. */
export function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic signed noise in [-1, 1] for a given seed and index. */
export function noiseAt(seed: number, index: number): number {
  const r = prng(seed + index * 2654435761);
  return r() * 2 - 1;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * A line that can be tuned continuously from hand-drawn to typeset.
 *
 * `wobble` 1 is a reader's underline: uneven, overshooting, slightly off-axis.
 * `wobble` 0 is a printer's rule: dead straight.
 *
 * The same seed is used at every wobble value, so animating wobble 1 → 0
 * *straightens the existing line* rather than crossfading between two shapes.
 * This is the mechanism that carries the Act 2 → Act 3 transition, and the
 * reason no morph plugin is needed.
 */
export function wobblyLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  wobble: number,
  seed: number,
  segments = 8,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular unit vector — displacement is across the line, not along it.
  const nx = -dy / len;
  const ny = dx / len;

  const amp = wobble * Math.min(3.2, len * 0.012);
  // A hand starts before and ends after the mark it intends.
  const overshoot = wobble * 3.4;

  const pts: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const off = noiseAt(seed, i) * amp;
    // Displacement tapers at the ends: the pen is steadier where it lands.
    const taper = Math.sin(t * Math.PI) * 0.75 + 0.25;
    const ext = (t - 0.5) * 2 * overshoot;
    const px = x1 + dx * t + nx * off * taper + (dx / len) * ext;
    const py = y1 + dy * t + ny * off * taper + (dy / len) * ext;
    pts.push(`${round(px)} ${round(py)}`);
  }
  return smoothThrough(pts);
}

/**
 * The page itself: a quadrilateral whose edges breathe and whose corners are
 * not quite square. Rounded uniformly it would read as a UI card, which is
 * exactly the failure mode to avoid.
 */
export function wobblyRect(
  x: number,
  y: number,
  w: number,
  h: number,
  wobble: number,
  seed: number,
): string {
  const perSide = 4;
  const amp = wobble * 2.6;
  const corners: [number, number][] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];

  const pts: string[] = [];
  let k = 0;
  for (let c = 0; c < 4; c++) {
    const [ax, ay] = corners[c] as [number, number];
    const [bx, by] = corners[(c + 1) % 4] as [number, number];
    for (let i = 0; i < perSide; i++) {
      const t = i / perSide;
      const px = ax + (bx - ax) * t + noiseAt(seed, k) * amp;
      const py = ay + (by - ay) * t + noiseAt(seed + 977, k) * amp;
      pts.push(`${round(px)} ${round(py)}`);
      k++;
    }
  }
  return smoothThrough(pts, true);
}

/**
 * A drawn arrow — shaft plus two barbs, all slightly off. Used for the
 * reference marks that point from a gloss back into the text.
 */
export function arrowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  wobble: number,
  seed: number,
): string {
  const shaft = wobblyLine(x1, y1, x2, y2, wobble, seed, 6);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const barb = 11 + noiseAt(seed, 3) * 2;
  const spread = 0.42 + noiseAt(seed, 4) * 0.08;
  const b1x = x2 - Math.cos(ang - spread) * barb;
  const b1y = y2 - Math.sin(ang - spread) * barb;
  const b2x = x2 - Math.cos(ang + spread) * barb;
  const b2y = y2 - Math.sin(ang + spread) * barb;
  return `${shaft} M ${round(b1x)} ${round(b1y)} L ${round(x2)} ${round(y2)} L ${round(b2x)} ${round(b2y)}`;
}

/**
 * A brace-like connector, as a reader draws when grouping several lines.
 */
export function bracePath(
  x: number,
  yTop: number,
  yBottom: number,
  depth: number,
  seed: number,
): string {
  const mid = (yTop + yBottom) / 2;
  const j = (i: number) => noiseAt(seed, i) * 1.6;
  return [
    `M ${round(x + j(0))} ${round(yTop)}`,
    `Q ${round(x + depth + j(1))} ${round(yTop + 6)} ${round(x + depth * 0.55 + j(2))} ${round(mid - 5)}`,
    `Q ${round(x + depth * 1.5 + j(3))} ${round(mid)} ${round(x + depth * 0.55 + j(4))} ${round(mid + 5)}`,
    `Q ${round(x + depth + j(5))} ${round(yBottom - 6)} ${round(x + j(6))} ${round(yBottom)}`,
  ].join(' ');
}

/** Catmull-Rom through the points, emitted as cubic béziers. */
function smoothThrough(points: string[], close = false): string {
  const p = points.map((s) => s.split(' ').map(Number) as [number, number]);
  if (p.length < 2) return '';
  const at = (i: number): [number, number] => {
    const n = p.length;
    if (close) return p[((i % n) + n) % n] as [number, number];
    return p[Math.max(0, Math.min(n - 1, i))] as [number, number];
  };

  let d = `M ${p[0]![0]} ${p[0]![1]}`;
  const last = close ? p.length : p.length - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(p2[0])} ${round(p2[1])}`;
  }
  return close ? `${d} Z` : d;
}
