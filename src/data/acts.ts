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
    number: '01',
    title: 'Bare text',
    shortTitle: 'Bare',
    thesis: 'Text begins as a stream.',
    body: 'A page. Just the words. No frame, no guide, no context. Continuous script with barely a mark to tell a reader where anything begins or ends.',
    start: 0,
    end: 0.34,
    implemented: true,
  },
  {
    id: 'glosses',
    number: '02',
    title: 'Glosses',
    shortTitle: 'Glosses',
    thesis: 'Readers speak back.',
    body: 'Voices arrive in the margins. Underlines, reference marks, interlinear corrections, a hand pointing at a line worth keeping. The text has not changed. It has acquired readers, and their apparatus accumulates around it.',
    start: 0.3,
    end: 0.66,
    implemented: true,
  },
  {
    id: 'print',
    number: '03',
    title: 'Print',
    shortTitle: 'Print',
    thesis: 'Apparatus becomes standard.',
    body: 'What one reader improvised, the press makes systematic. The rough underline straightens into a typographic rule. The marginal citation descends into a footnote. Spacing regularizes, a title sets, a page number appears. The page becomes a thing with parts.',
    start: 0.62,
    end: 1,
    implemented: true,
  },
];

/** Acts 4–8 exist in the narrative but are not built yet (Milestone 2 and 3). */
export const plannedActs: Pick<Act, 'id' | 'number' | 'title' | 'shortTitle'>[] = [
  { id: 'editorial', number: '04', title: 'Editorial', shortTitle: 'Editorial' },
  { id: 'terminal', number: '05', title: 'Terminal', shortTitle: 'Terminal' },
  { id: 'web', number: '06', title: 'GUI / Web', shortTitle: 'Web' },
  { id: 'overflow', number: '07', title: 'Overflow', shortTitle: 'Overflow' },
  { id: 'reframe', number: '08', title: 'Adaptive reframing', shortTitle: 'Reframe' },
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
