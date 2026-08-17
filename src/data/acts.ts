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
  | 'magazine'
  | 'hypertext'
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
  /** Optional threshold line shown briefly before the act thesis. */
  bridge?: string;
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
    thesis: 'Text is never just there.',
    body: 'It is somewhere: separated from the world around it and framed. Measure, typography, alignment, spacing, position and viewport already constitute a presentation.',
    start: 0,
    end: 0.044,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'page',
    number: '01',
    title: 'Page',
    shortTitle: 'Page',
    thesis: 'The frame becomes a page.',
    body: 'The page gives text boundary, measure, position and separation from the world around it. Paper and margin resolve around the same continuous body of text.',
    start: 0.044,
    end: 0.088,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'glosses',
    number: '02',
    title: 'Outside voice',
    shortTitle: 'Gloss',
    thesis: 'Another voice finds a place in the margin.',
    body: 'Readerly commentary enters from outside. The material frame expands to admit it, and the margin becomes usable semantic space without yet becoming standardized apparatus.',
    start: 0.088,
    end: 0.148,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'print',
    number: '03',
    title: 'Apparatus / print',
    shortTitle: 'Print',
    thesis: 'The margins become part of the system.',
    body: 'What readers improvised becomes repeatable apparatus: notes, references, titles, numbering and hierarchy. Commentary found the margin; print makes the margin systematic.',
    start: 0.148,
    end: 0.208,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'editorial',
    number: '04',
    title: 'Editorial composition',
    shortTitle: 'Editorial',
    thesis: 'The frame begins to direct attention.',
    body: 'Composition becomes part of the argument. A construction grid makes measure, hierarchy and the relationship between argument and source explicit before it recedes.',
    start: 0.208,
    end: 0.265,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'magazine',
    number: '05',
    title: 'Editorial spread',
    shortTitle: 'Magazine',
    thesis: 'Composition becomes an instrument.',
    body: 'Text, image, diagram, caption and hierarchy can be orchestrated into one reading field. Sophisticated framing coordinates heterogeneous material before the frame becomes computational.',
    start: 0.265,
    end: 0.325,
    settle: 0.76,
    implemented: true,
  },
  {
    id: 'hypertext',
    number: '06',
    title: 'Hypertext',
    shortTitle: 'Hypertext',
    bridge: 'Then the frame changes nature.',
    thesis: 'The page no longer has to contain the text.',
    body: 'Text folds into a virtual space of many dimensions. Addressable places become navigable without physical proximity, and history makes the route reversible.',
    start: 0.325,
    end: 0.465,
    settle: 0.88,
    implemented: true,
  },
  {
    id: 'application',
    number: '07',
    title: 'Application',
    shortTitle: 'Application',
    thesis: 'Structure becomes explicit software.',
    body: 'Claims become records with type, status, source and section. The application is coherent and useful, yet it has no relation for the reason behind an order, a rejection or a decision.',
    start: 0.465,
    end: 0.532,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'fragments',
    number: '08',
    title: 'Fragmented frames',
    shortTitle: 'Fragments',
    thesis: 'Nothing frames the work between tools.',
    body: 'Research, sources, drafts, recordings, files and chat remain competent local environments. As each frame claims its contents, related operations are pulled apart and their relationships become stranded in the gaps.',
    start: 0.532,
    end: 0.612,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'conversation',
    number: '09',
    title: 'AI / Conversation',
    shortTitle: 'AI',
    thesis: 'Much of the interface collapses into language.',
    body: 'Specialized software frames converge on one calm conversational surface. Intent, response and action meet in a radically simpler interface, and at first the reduction feels powerful and liberating.',
    start: 0.612,
    end: 0.692,
    settle: 0.6,
    implemented: true,
  },
  {
    id: 'tube',
    number: '10',
    title: 'The tube',
    shortTitle: 'The tube',
    thesis: 'Chronology becomes the dominant structure.',
    body: 'The exchanges accumulate until the viewport is only a small window onto a much longer stream. Pulled back, the apparently new interface reveals the structural logic of a scroll: sequential access with little global overview.',
    start: 0.692,
    end: 0.752,
    settle: 0.64,
    implemented: true,
  },
  {
    id: 'recovery',
    number: '11',
    title: 'Recovery',
    shortTitle: 'Recovery',
    thesis: 'The stream rediscovers apparatus.',
    body: 'A resolved stretch gains a boundary and title. Tool results become subordinate apparatus, operations acquire stable addresses, and an obsolete claim remains visible through a named relation to the decision that supersedes it.',
    start: 0.752,
    end: 0.818,
    settle: 0.78,
    implemented: true,
  },
  {
    id: 'projections',
    number: '12',
    title: 'Projections',
    shortTitle: 'Projections',
    thesis: 'The same source can compose several frames.',
    body: 'The operations leave chronology and travel through structural, specification and reading arrangements without changing identity. The first digitalization virtualized the page. The next may virtualize the frame.',
    start: 0.818,
    end: 0.91,
    settle: 0.82,
    implemented: true,
  },
  {
    id: 'cost',
    number: '13',
    title: 'The cost',
    shortTitle: 'Cost',
    thesis: 'When the frame moves, shared certainty moves with it.',
    body: 'A view changes without the reader asking. The operation remains, but the place used to track and discuss it no longer points to the same thing. Dynamic framing weakens mental models, shared pointing and citation, while giving the selector of the frame consequential power.',
    start: 0.91,
    end: 0.964,
    settle: 0.68,
    implemented: true,
  },
  {
    id: 'open',
    number: '14',
    title: 'Which frame now?',
    shortTitle: 'Open',
    thesis: 'Which frame now?',
    body: 'The operations remain visible and no final arrangement is declared authoritative. The question is now available as an action: read, thread, structure or specification.',
    start: 0.964,
    end: 1,
    settle: 0.35,
    implemented: true,
  },
];

export const plannedActs: Pick<Act, 'id' | 'number' | 'title' | 'shortTitle'>[] = [];

export const settlePoints: number[] = [
  ...acts.map((act) => act.start + (act.end - act.start) * act.settle),
  // Preserve the true end as an exit target after the final authored plateau.
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
