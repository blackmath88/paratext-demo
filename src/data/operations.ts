/** Durable work units shared by the late acts. Views may arrange but not copy them. */
export type OperationKind =
  | 'question'
  | 'claim'
  | 'source'
  | 'tool'
  | 'decision'
  | 'superseded'
  | 'artifact'
  | 'open'
  | 'concession'
  | 'spec'
  | 'voice memo · raw'
  | 'note'
  | 'wrong turn'
  | 'detour'
  | 'reframe';

export type Operation = {
  id: string;
  kind: OperationKind;
  label: string;
  cluster?: string;
  supersedes?: string;
  projection?: Array<'essay' | 'thread' | 'structure' | 'spec'>;
  role?: 'user' | 'assistant' | 'tool';
  section?: string;
  artifact?: 'animation' | 'essay';
};

export const OPERATIONS: Operation[] = [
  { id: 'q-frame', kind: 'question', role: 'user', label: 'Can you clarify what constitutes the text as a unity?', cluster: 'frame', projection: ['essay', 'thread', 'structure'] },
  { id: 'src-dembeck', kind: 'source', role: 'assistant', label: 'The frame constitutes a unity for reception.', cluster: 'frame', projection: ['essay', 'structure'] },
  { id: 'claim-presentation', kind: 'claim', role: 'assistant', label: 'Text is never apart from presentation.', cluster: 'frame', projection: ['essay', 'structure'] },
  { id: 'claim-outside', kind: 'claim', role: 'user', label: 'Make the outside annotation visibly pressure the page.', cluster: 'paratext', projection: ['essay', 'structure'] },
  { id: 'decision-admit', kind: 'decision', role: 'assistant', label: 'I will expand the frame to admit reception.', cluster: 'paratext', projection: ['essay', 'thread', 'spec'] },
  { id: 'src-genette', kind: 'source', role: 'tool', label: 'Source found: epitext / peritext distinction.', cluster: 'paratext', projection: ['essay', 'structure'] },
  { id: 'artifact-print', kind: 'artifact', role: 'assistant', label: 'Generated the printed apparatus transition.', cluster: 'composition', projection: ['essay', 'thread'] },
  { id: 'decision-grid', kind: 'decision', role: 'user', label: 'Strengthen composition without making a poster.', cluster: 'composition', projection: ['essay', 'spec'] },
  { id: 'claim-schema', kind: 'claim', role: 'assistant', label: 'Software now makes the structure explicit.', cluster: 'application', projection: ['essay', 'structure'] },
  { id: 'tool-records', kind: 'tool', role: 'tool', label: 'Inspected claim records and source metadata.', cluster: 'application', projection: ['thread', 'spec'] },
  { id: 'superseded-history', kind: 'superseded', role: 'assistant', label: 'Status can stand in for the history.', cluster: 'application', projection: ['thread', 'structure'] },
  { id: 'decision-reason', kind: 'decision', role: 'user', label: 'No—preserve why the decision was made.', cluster: 'application', supersedes: 'superseded-history', projection: ['essay', 'thread', 'structure', 'spec'] },
  { id: 'open-reason', kind: 'open', role: 'assistant', label: 'Where should reason and context live?', cluster: 'application', projection: ['thread', 'structure'] },
  { id: 'artifact-essay', kind: 'artifact', role: 'assistant', label: 'Updated the current essay artifact.', cluster: 'artifact', projection: ['essay', 'thread'] },
  { id: 'q-source', kind: 'question', role: 'user', label: 'What should count as the source now?', cluster: 'context', projection: ['essay', 'thread', 'structure'] },
  { id: 'claim-context', kind: 'claim', role: 'assistant', label: 'The operations and their context are the source.', cluster: 'context', projection: ['essay', 'structure', 'spec'] },
];
