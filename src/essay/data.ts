import type { Operation } from '../data/operations';

export type EssayStation = {
  level: number;
  name: string;
  description: string;
  demonstratedBy: string;
};

/**
 * A station belongs here only when the essay can demonstrate it on its own
 * content. Narrative milestones from the animation are deliberately absent.
 */
export const ESSAY_STATIONS: EssayStation[] = [
  { level: 0, name: 'Bare', description: 'no added apparatus', demonstratedBy: 'The complete essay is present as an unbroken text block.' },
  { level: 1, name: 'Paragraphs', description: 'segmentation: paragraph breaks distinguish units of thought', demonstratedBy: 'The same authored nodes gain paragraph boundaries.' },
  { level: 2, name: 'Spacing', description: 'measure: line length, leading and margin make structure perceptible', demonstratedBy: 'Measure, leading, and whitespace expose the existing paragraphs.' },
  { level: 3, name: 'Gloss', description: 'annotation: commentary becomes addressable without interrupting the line', demonstratedBy: 'Five note anchors project into real marginal glosses.' },
  { level: 4, name: 'Print', description: 'regularisation: reproducible hierarchy makes the apparatus citable', demonstratedBy: 'The essay sections supply headings, numbers, rules, contents, and running identity.' },
  { level: 5, name: 'Editorial Web', description: 'composition and inspectable evidence: sources open where they are cited', demonstratedBy: 'Existing claims, figures, instruments, and pull quotes acquire responsive editorial hierarchy.' },
  { level: 6, name: 'Hypertext', description: 'not yet designed', demonstratedBy: 'Stable identities and cross-link relations remain in the data.' },
  { level: 7, name: 'Layering', description: 'not yet designed', demonstratedBy: 'The station is retained as a placeholder without a shipped mechanism.' },
  { level: 8, name: 'Vista', description: 'not yet designed', demonstratedBy: 'Projection metadata remains populated without exposing a projection interface.' },
];

/** Semantic work units shared with the animation's Operation model. */
export const ESSAY_OPERATIONS: Operation[] = [
  { id: 'cs1', kind: 'concession', label: 'Most UI really is dissolving', section: '1', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c1', kind: 'claim', label: 'Intent vs state', section: '2', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c2', kind: 'claim', label: 'Language encodes space badly', section: '2', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c3', kind: 'claim', label: 'Less fixed UI, not less UI', section: '2', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c4', kind: 'claim', label: 'The terminal-colour fetish', section: '4', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c5', kind: 'claim', label: 'Colour is acquired convention', section: '4', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c6', kind: 'claim', label: 'Apparatus collapsed', section: '5', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c7', kind: 'claim', label: 'Frames constitute a world', section: '6', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c8', kind: 'claim', label: 'Delta makes that shift', section: '6', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c9', kind: 'claim', label: 'Unity depends on reception', section: '6', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c10', kind: 'claim', label: 'Reasoning is epitext', section: '7', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c11', kind: 'claim', label: 'Five hundred messages', section: '7', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'c12', kind: 'superseded', label: 'Grow a tracker from chat', section: '7', artifact: 'essay', supersedes: 'c13', projection: ['essay', 'structure'] },
  { id: 'c13', kind: 'claim', label: 'Framing, not a board', section: '7', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 'sp1', kind: 'spec', label: 'No addressability', section: '8', artifact: 'essay', projection: ['essay', 'spec'] },
  { id: 'sp2', kind: 'spec', label: 'No supersession', section: '8', artifact: 'essay', projection: ['essay', 'spec'] },
  { id: 'sp3', kind: 'spec', label: 'Apparatus crowds out argument', section: '8', artifact: 'essay', projection: ['essay', 'spec'] },
  { id: 'sp4', kind: 'spec', label: 'Nothing ever closes', section: '8', artifact: 'essay', projection: ['essay', 'spec'] },
  { id: 'sp5', kind: 'spec', label: 'The diff forgets its reasons', section: '8', artifact: 'essay', projection: ['essay', 'spec'] },
  { id: 'c14', kind: 'claim', label: 'Code and interface are both downstream', section: '9', artifact: 'essay', projection: ['essay', 'structure'] },
  { id: 't1', kind: 'voice memo · raw', label: 'Listening, first reaction', artifact: 'essay', projection: ['thread'] },
  { id: 't2', kind: 'voice memo · raw', label: 'The objection, unedited', artifact: 'essay', projection: ['thread'] },
  { id: 't3', kind: 'voice memo · raw', label: 'The term arrives, half-formed', artifact: 'essay', projection: ['thread'] },
  { id: 't4', kind: 'note', label: 'Working out the progression', artifact: 'essay', projection: ['thread'] },
  { id: 't5', kind: 'wrong turn', label: 'The version I abandoned', artifact: 'essay', projection: ['thread'] },
  { id: 't6', kind: 'detour', label: 'Where Textrahmen actually comes from', artifact: 'essay', projection: ['thread'] },
  { id: 't7', kind: 'reframe', label: 'What the piece became', artifact: 'essay', projection: ['thread'] },
];

/** Projects canonical operation metadata onto the v12-authored content nodes. */
export function applyEssayOperationMetadata(root: HTMLElement): void {
  for (const operation of ESSAY_OPERATIONS) {
    const node = root.querySelector<HTMLElement>(`[data-id="${operation.id}"]`);
    if (!node) throw new Error(`Missing essay operation node: ${operation.id}`);
    node.dataset.type = operation.kind;
    node.dataset.label = operation.label;
    node.dataset.frames = operation.projection?.join(' ') ?? '';
    if (operation.section) node.dataset.inSec = operation.section;
    if (operation.supersedes) node.dataset.superseded = operation.supersedes;
  }
}
