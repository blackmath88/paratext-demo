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
    end: 0.07,
    implemented: true,
  },
  {
    id: 'page',
    number: '01',
    title: 'Page',
    shortTitle: 'Page',
    thesis: 'Presentation becomes bounded.',
    body: 'The existing measure contracts and its latent edge becomes perceptible. Paper, margin and codex geometry resolve around the same continuous body of text.',
    start: 0.07,
    end: 0.14,
    implemented: true,
  },
  {
    id: 'glosses',
    number: '02',
    title: 'Outside voice',
    shortTitle: 'Gloss',
    thesis: 'Reception speaks from outside.',
    body: 'Readerly voices first violate the page edge. Only after they accumulate does the material frame expand toward them, admitting their irregular presence without yet standardizing it.',
    start: 0.14,
    end: 0.26,
    implemented: true,
  },
  {
    id: 'print',
    number: '03',
    title: 'Apparatus / print',
    shortTitle: 'Print',
    thesis: 'Apparatus becomes standard.',
    body: 'What one reader improvised, the press makes systematic. The rough underline straightens into a typographic rule. The marginal citation descends into a footnote. Spacing regularizes, a title sets, a page number appears. The page becomes a thing with parts.',
    start: 0.26,
    end: 0.38,
    implemented: true,
  },
  {
    id: 'editorial',
    number: '04',
    title: 'Editorial composition',
    shortTitle: 'Editorial',
    thesis: 'The frame directs attention.',
    body: 'A construction grid makes the reading environment explicit. Argument, source, hierarchy, spacing and measure settle into deliberate relationships before the grid recedes.',
    start: 0.38,
    end: 0.49,
    implemented: true,
  },
  {
    id: 'application',
    number: '05',
    title: 'Application',
    shortTitle: 'Application',
    thesis: 'Structure becomes explicit software.',
    body: 'Claims become records with type, status, source and section. The application is coherent and useful, yet it has no relation for the reason behind an order, a rejection or a decision.',
    start: 0.49,
    end: 0.62,
    implemented: true,
  },
  {
    id: 'fragments',
    number: '06',
    title: 'Fragmented frames',
    shortTitle: 'Fragments',
    thesis: 'Nothing frames the work between tools.',
    body: 'Research, sources, drafts, recordings, files and chat remain competent local environments. As each frame claims its contents, related operations are pulled apart and their relationships become stranded in the gaps.',
    start: 0.62,
    end: 0.8,
    implemented: true,
  },
  {
    id: 'conversation',
    number: '07',
    title: 'Conversation + artifact',
    shortTitle: 'Conversation',
    thesis: 'Chronology is still not structure.',
    body: 'Conversation restores reasoning beside the current artifact. But an abandoned plan and the decision that superseded it retain equal chronological weight, while the artifact still cannot carry its reasons away from this view.',
    start: 0.8,
    end: 1,
    implemented: true,
  },
];

/** Act 8 exists in the narrative but is not built yet. */
export const plannedActs: Pick<Act, 'id' | 'number' | 'title' | 'shortTitle'>[] = [
  { id: 'reframe', number: '08', title: 'Reframed context', shortTitle: 'Reframe' },
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
