import { OPERATIONS } from '../data/operations';

export type FrameId = 'essay' | 'thread' | 'structure' | 'spec';
export type OperationPlacement = { x: number; y: number; scale: number; opacity: number };
export type OperationLayout = Record<string, OperationPlacement>;

export const FRAME_LABELS: Record<FrameId, string> = {
  essay: 'Read',
  thread: 'Thread',
  structure: 'Structure',
  spec: 'Spec',
};

const point = (x: number, y: number, scale = 0.88, opacity = 1): OperationPlacement => ({ x, y, scale, opacity });

export function overviewLayout(): OperationLayout {
  const clusterOrigins: Record<string, { x: number; y: number }> = {
    frame: { x: 180, y: 190 },
    paratext: { x: 180, y: 390 },
    composition: { x: 500, y: 190 },
    application: { x: 500, y: 390 },
    context: { x: 790, y: 190 },
    artifact: { x: 790, y: 390 },
  };
  const counts = new Map<string, number>();
  return Object.fromEntries(OPERATIONS.map((operation) => {
    const cluster = operation.cluster ?? 'context';
    const slot = counts.get(cluster) ?? 0;
    counts.set(cluster, slot + 1);
    const origin = clusterOrigins[cluster] ?? { x: 790, y: 190 };
    return [operation.id, point(origin.x, origin.y + slot * 46, 0.82)];
  }));
}

export function frameLayout(frame: FrameId): OperationLayout {
  if (frame === 'thread') {
    return Object.fromEntries(OPERATIONS.map((operation, i) => [operation.id, point(250, 150 + i * 39, 0.86)]));
  }

  if (frame === 'structure') {
    const columns: Record<string, number> = { question: 190, open: 190, claim: 470, source: 750, tool: 750, decision: 1010, superseded: 1010, artifact: 750 };
    const counts = new Map<number, number>();
    return Object.fromEntries(OPERATIONS.map((operation) => {
      const x = columns[operation.kind] ?? 750;
      const slot = counts.get(x) ?? 0;
      counts.set(x, slot + 1);
      return [operation.id, point(x, 190 + slot * 82, 0.78)];
    }));
  }

  if (frame === 'spec') {
    let main = 0;
    let context = 0;
    return Object.fromEntries(OPERATIONS.map((operation) => {
      const included = operation.projection?.includes('spec') ?? false;
      if (included) return [operation.id, point(260, 190 + main++ * 86, 0.94)];
      const placement = point(850 + (context % 2) * 220, 200 + Math.floor(context / 2) * 62, 0.66, 0.34);
      context += 1;
      return [operation.id, placement];
    }));
  }

  const order = ['q-frame', 'src-dembeck', 'claim-presentation', 'claim-outside', 'decision-admit', 'src-genette', 'decision-grid', 'claim-schema', 'decision-reason', 'q-source', 'claim-context', 'artifact-essay'];
  let aside = 0;
  return Object.fromEntries(OPERATIONS.map((operation) => {
    const index = order.indexOf(operation.id);
    if (index >= 0) return [operation.id, point(270, 160 + index * 48, 0.9)];
    const placement = point(950, 220 + aside++ * 64, 0.72, 0.42);
    return [operation.id, placement];
  }));
}
