/**
 * Narrative metadata for the piece.
 *
 * `start`/`end` are normalized positions on the master timeline (0..1). They
 * are the single source of truth: the master timeline places act sub-timelines
 * at these positions, and the navigator resolves scroll position back to an act
 * from the same numbers. Nothing else may hardcode a timeline offset.
 *
 * Adjacent ranges share exact seams. The arriving act owns the transition, so
 * motion remains continuous without two timelines writing the same geometry.
 */

export type ActId =
  | 'bare'
  | 'page'
  | 'glosses'
  | 'print'
  | 'editorial'
  | 'application'
  | 'fragments'
  | 'conversation'
  | 'tube'
  | 'recovery'
  | 'projections'
  | 'cost'
  | 'open';

export type Act = {
  id: ActId;
  /** Two-digit label shown in the margin navigator. */
  number: string;
  title: string;
  shortTitle: string;
  /** Foreground editorial fragment. Kept sparse on purpose. */
  thesis: string;
  /** Longer copy — the accessible/reduced-motion carrier of the argument. */
  body: string;
  start: number;
  end: number;
  /**
   * Normalized position within the act where choreography has resolved.
   * Scroll, navigation and reduced motion all land on this stable state.
   */
  settle: number;
  /** False until the act is implemented; keeps the navigator honest. */
  implemented: boolean;
};

export const acts: Act[] = [
  {
    id: 'bare',
    number: '00',
    title: 'Presentation',
    shortTitle: 'Presentation',
    thesis: 'Text is never simply there.',
    body: 'Words appear to occupy a neutral field. Yet line width, typography, alignment, spacing, position and viewport already constitute a presentation.',
    start: 0,
    end: 0.043333,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'page',
    number: '01',
    title: 'Page',
    shortTitle: 'Page',
    thesis: 'Presentation becomes bounded.',
    body: 'The existing measure contracts and its latent edge becomes perceptible. Paper, margin and codex geometry resolve around the same continuous body of text.',
    start: 0.043333,
    end: 0.086667,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'glosses',
    number: '02',
    title: 'Outside voice',
    shortTitle: 'Gloss',
    thesis: 'Reception speaks from outside.',
    body: 'Readerly voices first violate the page edge. Only after they accumulate does the material frame expand toward them, admitting their irregular presence without yet standardizing it.',
    start: 0.086667,
    end: 0.161515,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'print',
    number: '03',
    title: 'Apparatus / print',
    shortTitle: 'Print',
    thesis: 'Apparatus becomes standard.',
    body: 'What one reader improvised, the press makes systematic. The rough underline straightens into a typographic rule. The marginal citation descends into a footnote. Spacing regularizes, a title sets, a page number appears. The page becomes a thing with parts.',
    start: 0.161515,
    end: 0.236364,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'editorial',
    number: '04',
    title: 'Editorial composition',
    shortTitle: 'Editorial',
    thesis: 'The frame directs attention.',
    body: 'A construction grid makes the reading environment explicit. Argument, source, hierarchy, spacing and measure settle into deliberate relationships before the grid recedes.',
    start: 0.236364,
    end: 0.307273,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'application',
    number: '05',
    title: 'Application',
    shortTitle: 'Application',
    thesis: 'Structure becomes explicit software.',
    body: 'Claims become records with type, status, source and section. The application is coherent and useful, yet it has no relation for the reason behind an order, a rejection or a decision.',
    start: 0.307273,
    end: 0.393939,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'fragments',
    number: '06',
    title: 'Fragmented frames',
    shortTitle: 'Fragments',
    thesis: 'Nothing frames the work between tools.',
    body: 'Research, sources, drafts, recordings, files and chat remain competent local environments. As each frame claims its contents, related operations are pulled apart and their relationships become stranded in the gaps.',
    start: 0.393939,
    end: 0.52,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'conversation',
    number: 'II·01',
    title: 'AI / Conversation',
    shortTitle: 'AI',
    thesis: 'Much of the interface collapses into language.',
    body: 'Specialized software frames converge on one calm conversational surface. Intent, response and action meet in a radically simpler interface, and at first the reduction feels powerful and liberating.',
    start: 0.52,
    end: 0.6,
    settle: 0.6,
    implemented: true,
  },
  {
    id: 'tube',
    number: 'II·02',
    title: 'The tube',
    shortTitle: 'The tube',
    thesis: 'Chronology becomes the dominant structure.',
    body: 'The exchanges accumulate until the viewport is only a small window onto a much longer stream. Pulled back, the apparently new interface reveals the structural logic of a scroll: sequential access with little global overview.',
    start: 0.6,
    end: 0.68,
    settle: 0.64,
    implemented: true,
  },
];

export const plannedActs: Pick<Act, 'id' | 'number' | 'title' | 'shortTitle'>[] = [
  {
    id: 'recovery',
    number: 'II·03',
    title: 'Recovery',
    shortTitle: 'Recovery',
  },
  {
    id: 'projections',
    number: 'II·04',
    title: 'Projections',
    shortTitle: 'Projections',
  },
  {
    id: 'cost',
    number: 'II·05',
    title: 'The cost',
    shortTitle: 'Cost',
  },
  {
    id: 'open',
    number: 'II·06',
    title: 'Which frame now?',
    shortTitle: 'Open',
  },
];

export const settlePoints: number[] = [
  ...acts.map((act) => act.start + (act.end - act.start) * act.settle),
  // While future acts occupy reserved but unimplemented ranges, the true end
  // remains a forward snap target instead of pulling late scroll back to Tube.
  1,
];

export function actAt(progress: number): Act {
  // The arriving act owns each shared seam.
  let current = acts[0] as Act;
  for (const act of acts) {
    if (progress >= act.start) current = act;
  }
  return current;
}

export function actById(id: string): Act | undefined {
  return acts.find((a) => a.id === id);
}
