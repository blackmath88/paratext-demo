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
  /** Normalized local window for the bridge line, scored to its scene event. */
  bridgeAt?: { from: number; to: number };
  /**
   * Normalized local window for the thesis line, scored to the scene event the
   * sentence explains. Every act declares its own; `main.ts` keeps a generic
   * default only as a defensive fallback, and nothing currently relies on it.
   *
   * The mapping from a child timeline's own seconds is
   *   local = (event time / child natural duration) × settle
   * because `fitWithPlateau` compresses the whole child into `duration × settle`
   * and then holds the resolved state. Each act below records the events it was
   * scored against, so a change to the choreography can be re-scored from here.
   */
  thesisAt?: { from: number; to: number };
  /** Optional sequential lines within an act, timed as normalized local ranges. */
  beats?: { text: string; from: number; to: number }[];
  /**
   * Set false where the scene already states the act in its own text, or where
   * the act's beats carry it. Suppresses only the cinematic thesis cue; the
   * thesis stays in metadata for the static/reduced-motion carrier.
   */
  foreground?: false;
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
    // Child 2.4s, settle 0.70. Nothing moves: the act is a held still state, so
    // the premise carries it. It arrives at once and holds through the plateau.
    thesisAt: { from: 0.015, to: 0.86 },
    body: 'It is somewhere: separated from the world around it and framed. Measure, typography, alignment, spacing, position and viewport already constitute a presentation.',
    start: 0,
    end: 0.041392286,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'page',
    number: '01',
    title: 'Page',
    shortTitle: 'Page',
    thesis: 'The frame becomes a page.',
    // Child 2.2s, settle 0.70 (local = t × 0.318). Leaf begins to appear at
    // t 0.28 → 0.089 and is unmistakable by t ≈ 1.9 → 0.60. The line lands just
    // before the paper does, then clears once the page is obvious.
    thesisAt: { from: 0.045, to: 0.6 },
    body: 'The page gives text boundary, measure, position and separation from the world around it. Paper and margin resolve around the same continuous body of text.',
    start: 0.041392286,
    end: 0.082784572,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'glosses',
    number: '02',
    title: 'Outside voice',
    shortTitle: 'Gloss',
    thesis: 'Another voice finds a place in the margin.',
    // Child 4.1s, settle 0.70 (local = t × 0.171). Scored to the FIRST gloss
    // ("nota", t 0.24 → 0.041), not to the act. Clears after four annotations
    // are established (t 2.32 → 0.396) so the leaf's expansion to admit them
    // (0.464–0.669) plays without foreground competition.
    thesisAt: { from: 0.012, to: 0.4 },
    body: 'Readerly commentary enters from outside. The material frame expands to admit it, and the margin becomes usable semantic space without yet becoming standardized apparatus.',
    start: 0.082784572,
    end: 0.139228598,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'print',
    number: '03',
    title: 'Apparatus / print',
    shortTitle: 'Print',
    thesis: 'The margins become part of the system.',
    // Child 3.72s, settle 0.70 (local = t × 0.188). Deliberately late: the
    // improvised gloss state stays unnarrated while it regularizes. The line
    // enters as the promoted notes descend (t 1.6 → 0.30) and holds across
    // footnotes (0.405), title (0.461), caput (0.518), folio (0.565) and line
    // numbering (0.583–0.70).
    thesisAt: { from: 0.3, to: 0.68 },
    body: 'What readers improvised becomes repeatable apparatus: notes, references, titles, numbering and hierarchy. Commentary found the margin; print makes the margin systematic.',
    start: 0.139228598,
    end: 0.195672625,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'editorial',
    number: '04',
    title: 'Editorial composition',
    shortTitle: 'Editorial',
    thesis: 'The frame begins to direct attention.',
    // Child 2.55s, settle 0.70 (local = t × 0.275). The construction grid draws
    // from t 0 and is the act's opening event, so the line is early by design.
    // It leaves as the grid begins to recede (t 1.65 → 0.453), leaving the
    // resolved composition quiet.
    thesisAt: { from: 0.03, to: 0.46 },
    body: 'Composition becomes part of the argument. A construction grid makes measure, hierarchy and the relationship between argument and source explicit before it recedes.',
    start: 0.195672625,
    end: 0.24929445,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'magazine',
    number: '05',
    title: 'Editorial spread',
    shortTitle: 'Magazine',
    thesis: 'Composition becomes an instrument.',
    // Child 1.98s, settle 0.76 (local = t × 0.384). Not at act start: the
    // reflow from Editorial runs first. Scored to the heterogeneous material —
    // image t 0.52 → 0.200, caption 0.338, diagram 0.376 — and cleared before
    // the pull quote lands (0.491) so the resolved spread holds unnarrated.
    thesisAt: { from: 0.17, to: 0.62 },
    body: 'Text, image, diagram, caption and hierarchy can be orchestrated into one reading field. Sophisticated framing coordinates heterogeneous material before the frame becomes computational.',
    start: 0.24929445,
    end: 0.305738476,
    settle: 0.76,
    implemented: true,
  },
  {
    id: 'hypertext',
    number: '06',
    title: 'Hypertext',
    shortTitle: 'Hypertext',
    bridge: 'Then the frame changes nature.',
    // Child 16.07s, settle 0.88 (local = t × 0.0548). The bridge belongs to the
    // substrate transition: focus t 0.28 → 0.015, pointer 0.021, the magazine
    // footprint becoming screen 0.039–0.130, first click 0.050. It clears
    // before the navigation sequence becomes the subject.
    bridgeAt: { from: 0.004, to: 0.088 },
    thesis: 'The page no longer has to contain the text.',
    // Scored to the first departure from Home, not to the substrate: first
    // traversal clicks at t 2.45 → 0.134 and resolves at 0.178; the second
    // resolves at 0.249. Once topology is established the line goes, and the
    // remaining six forward navigations, four Backs and Home run silent.
    thesisAt: { from: 0.118, to: 0.27 },
    body: 'Text folds into a virtual space of many dimensions. Addressable places become navigable without physical proximity, and history makes the route reversible.',
    start: 0.305738476,
    end: 0.437441204,
    settle: 0.88,
    implemented: true,
  },
  {
    id: 'application',
    number: '07',
    title: 'Application',
    shortTitle: 'Application',
    thesis: 'The frame becomes a window onto state.',
    // Child 8.2s, settle 0.86 (local = t × 0.1049). State spine rises t 0.62 →
    // 0.065, Detail opens 0.100. The line is up while "state stays, view
    // appears" is first legible and clears during the second view (Table,
    // 0.201–0.252), before view-switching becomes repetitive.
    thesisAt: { from: 0.045, to: 0.23 },
    beats: [
      // Action view arrives 0.308, APPROVE fires 0.386, the spine and both
      // status labels finish changing at 0.474, Timeline 0.501, Monitor 0.596.
      // The line is up before the action and survives the state change.
      { text: 'We can monitor it. Change it. Act through it.', from: 0.295, to: 0.635 },
      // Metatext panel opens 0.682, code edit 0.766, generated region 0.810.
      // The line arrives just ahead of the panel.
      { text: 'And now the frame itself is written in language.', from: 0.672, to: 0.95 },
    ],
    body: 'Persistent state outlives any one view. We can monitor it, change it and act through it. The same case remains visible as detail, table, action, timeline and monitor; then metatext changes how the frame itself is composed.',
    start: 0.437441204,
    end: 0.559736595,
    settle: 0.86,
    implemented: true,
  },
  {
    id: 'fragments',
    number: '08',
    title: 'Fragmented frames',
    shortTitle: 'Fragments',
    // The act moves power → fragmentation, so the critique is not the opening
    // line. Child 2.64s, settle 0.70 (local = t × 0.265).
    thesis: 'Specific frames become extraordinarily powerful.',
    // Windows separate from the shared application footprint 0–0.504 and become
    // legible tools as their rules (0.305) and titles (0.331) land.
    thesisAt: { from: 0.2, to: 0.46 },
    beats: [
      // Operations finish distributing into their owning windows at 0.563 while
      // the relation paths stretch across the gaps between them (0.437–0.700).
      { text: 'And the work fragments between them.', from: 0.52, to: 0.93 },
    ],
    body: 'Research, sources, drafts, recordings, files and chat are productive precisely because each is specific: a competent local environment for its own material. Fragmentation happens between them — as each frame claims its contents, related operations are pulled apart and their relationships become stranded in the gaps.',
    start: 0.559736595,
    end: 0.634995296,
    settle: 0.7,
    implemented: true,
  },
  {
    id: 'conversation',
    number: '09',
    title: 'AI / Conversation',
    shortTitle: 'AI',
    thesis: 'Then the interface collapses back into language.',
    // Child 2.17s, settle 0.60 (local = t × 0.276). Not at act start: scored to
    // the convergence — window titles and rules dissolve 0.033–0.192, the six
    // frames merge into one 0–0.422, the calm surface appears 0.415–0.559 and
    // the input lands 0.600. Cleared just after, so the whole plateau
    // (0.60–1.00, 40% of the act) holds the resolved state in silence.
    thesisAt: { from: 0.1, to: 0.66 },
    body: 'Specialized software frames converge on one calm conversational surface. Intent, response and action meet in a radically simpler interface, and at first the reduction feels powerful and liberating.',
    start: 0.634995296,
    end: 0.710253998,
    settle: 0.6,
    implemented: true,
  },
  {
    id: 'tube',
    number: '10',
    title: 'The tube',
    shortTitle: 'The tube',
    thesis: 'Chronology becomes the dominant structure.',
    // The abstract statement stays in the static carrier; the cinematic act is
    // narrated by two concrete beats instead.
    foreground: false,
    beats: [
      // Child 3.55s, settle 0.64 (local = t × 0.180). Accumulation first: turns
      // begin travelling at 0.014, the viewport narrows 0.027–0.207 and the
      // scrollbar thumb shrinks 0.027–0.243. The reader senses the problem
      // before seeing the tube.
      { text: 'But language brings an old structure with it.', from: 0.02, to: 0.285 },
      // The reveal: the clip is removed and the tube appears at t 2.0–2.05 →
      // 0.361, the surface fades up to 0.478 and the continuations above and
      // below arrive 0.400–0.521. The line lands just ahead of it.
      { text: 'Everything still arrives in time.', from: 0.355, to: 0.74 },
    ],
    body: 'The exchanges accumulate until the viewport is only a small window onto a much longer stream. Pulled back, the apparently new interface reveals the structural logic of a scroll: chronology becomes the dominant structure, with sequential access and little global overview.',
    start: 0.710253998,
    end: 0.766698024,
    settle: 0.64,
    implemented: true,
  },
  {
    id: 'recovery',
    number: '11',
    title: 'Recovery',
    shortTitle: 'Recovery',
    thesis: 'So the apparatus comes back.',
    // Child 2.68s, settle 0.78 (local = t × 0.291). Scored to the segment
    // gaining a boundary and title rule (0–0.242) and then its title and folio
    // (0.122–0.276).
    thesisAt: { from: 0.01, to: 0.3 },
    beats: [
      // A deliberate silence over the tool apparatus (0.256–0.573) and the
      // identifiers (0.402–0.613): both are legible without being named. The
      // one idea the picture cannot state is supersession — strike 0.553–0.699,
      // relation 0.597–0.757, label 0.664–0.780.
      { text: 'Old states can remain visible without remaining current.', from: 0.55, to: 0.95 },
    ],
    body: 'A resolved stretch gains a boundary and title. Tool results become subordinate apparatus without disappearing, operations acquire stable addresses, and an obsolete claim remains visible through a named relation to the decision that supersedes it.',
    start: 0.766698024,
    end: 0.828786453,
    settle: 0.78,
    implemented: true,
  },
  {
    id: 'projections',
    number: '12',
    title: 'Projections',
    shortTitle: 'Projections',
    thesis: 'The same source can compose several frames.',
    // Child 3.16s, settle 0.82 (local = t × 0.259). Not when Structure first
    // appears (0.021–0.270) — the claim is only meaningful at the first
    // identity-preserving transformation, so the line enters just before the
    // same operations travel into Spec (0.272–0.532) and leaves as Read begins
    // (0.540). Read then proves the claim, and settles at 0.820, unnarrated.
    thesisAt: { from: 0.24, to: 0.56 },
    body: 'The operations leave chronology and travel through structural, specification and reading arrangements without changing identity. State belongs to the thing; form belongs to the projection. The first digitalization virtualized the page. The next may virtualize the frame.',
    start: 0.828786453,
    end: 0.91533396,
    settle: 0.82,
    implemented: true,
  },
  {
    id: 'cost',
    number: '13',
    title: 'The cost',
    shortTitle: 'Cost',
    thesis: 'If every view can change, what remains shared?',
    // Child 2.22s, settle 0.68 (local = t × 0.306). The tracked reference
    // establishes what the reader believes they are pointing at (0–0.138)
    // before anything is said. The line arrives with the violation: the
    // unrequested move into Spec begins 0.190, "VIEW CHANGED" 0.239, "SELECTED
    // FOR YOU" 0.276. The consequence list (0.496–0.680) then answers it.
    thesisAt: { from: 0.21, to: 0.66 },
    body: 'A view changes without the reader asking. The operation remains, but the place used to track and discuss it no longer points to the same thing. Dynamic framing weakens mental models, shared pointing and citation, while giving the selector of the frame consequential power.',
    start: 0.91533396,
    end: 0.966133584,
    settle: 0.68,
    implemented: true,
  },
  {
    id: 'open',
    number: '14',
    title: 'Which frame now?',
    shortTitle: 'Open',
    thesis: 'Which frame now?',
    // The scene asks the question itself (`openQuestion`, child 0.25–1.0 →
    // 0.088–0.350). A foreground cue would print it twice, so the act ends with
    // one question and no narrator.
    foreground: false,
    body: 'The operations remain visible and no final arrangement is declared authoritative. The question is now available as an action: read, thread, structure or specification.',
    start: 0.966133584,
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
