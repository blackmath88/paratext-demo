/**
 * Narrative metadata for the piece.
 *
 * `start`/`end` are normalized positions on the master timeline (0..1). They
 * are the single source of truth: the master timeline places act sub-timelines
 * at these positions, and the navigator resolves scroll position back to an act
 * from the same numbers. Nothing else may hardcode a timeline offset.
 *
 * Ranges intentionally overlap. The tail of one act and the head of the next
 * coexist so the scene never settles into a static endpoint state.
 */

export type ActId =
  | 'bare'
  | 'page'
  | 'glosses'
  | 'print'
  | 'editorial'
  | 'terminal'
  | 'web'
  | 'overflow'
  | 'reframe';

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
    end: 0.18,
    implemented: true,
  },
  {
    id: 'page',
    number: '01',
    title: 'Page',
    shortTitle: 'Page',
    thesis: 'Presentation becomes bounded.',
    body: 'The existing measure contracts and its latent edge becomes perceptible. Paper, margin and codex geometry resolve around the same continuous body of text.',
    start: 0.18,
    end: 0.36,
    implemented: true,
  },
  {
    id: 'glosses',
    number: '02',
    title: 'Outside voice',
    shortTitle: 'Gloss',
    thesis: 'Reception speaks from outside.',
    body: 'Readerly voices first violate the page edge. Only after they accumulate does the material frame expand toward them, admitting their irregular presence without yet standardizing it.',
    start: 0.36,
    end: 0.7,
    implemented: true,
  },
  {
    id: 'print',
    number: '03',
    title: 'Apparatus / print',
    shortTitle: 'Print',
    thesis: 'Apparatus becomes standard.',
    body: 'What one reader improvised, the press makes systematic. The rough underline straightens into a typographic rule. The marginal citation descends into a footnote. Spacing regularizes, a title sets, a page number appears. The page becomes a thing with parts.',
    start: 0.7,
    end: 1,
    implemented: true,
  },
];

/** Acts 4–8 exist in the narrative but are not built yet (Milestone 2 and 3). */
export const plannedActs: Pick<Act, 'id' | 'number' | 'title' | 'shortTitle'>[] = [
  { id: 'editorial', number: '04', title: 'Editorial', shortTitle: 'Editorial' },
  { id: 'terminal', number: '05', title: 'Application', shortTitle: 'Application' },
  { id: 'web', number: '06', title: 'Fragmented frames', shortTitle: 'Fragments' },
  { id: 'overflow', number: '07', title: 'Conversation + artifact', shortTitle: 'Conversation' },
  { id: 'reframe', number: '08', title: 'Reframed context', shortTitle: 'Reframe' },
];

export function actAt(progress: number): Act {
  // Later acts win in the overlap, so the navigator advances at the moment the
  // arriving act starts asserting itself rather than when the previous ends.
  let current = acts[0] as Act;
  for (const act of acts) {
    if (progress >= act.start) current = act;
  }
  return current;
}

export function actById(id: string): Act | undefined {
  return acts.find((a) => a.id === id);
}
