/** Durable work units shared by the late acts. Views may arrange but not copy them. */
export type OperationKind =
  | 'question'
  | 'claim'
  | 'source'
  | 'tool'
  | 'decision'
  | 'superseded'
  | 'artifact'
  | 'open';

export type Operation = {
  id: string;
  kind: OperationKind;
  label: string;
  cluster?: string;
  supersedes?: string;
  projection?: Array<'essay' | 'thread' | 'structure' | 'spec'>;
};

export const OPERATIONS: Operation[] = [
  { id: 'q-frame', kind: 'question', label: 'What constitutes the text as a unity?', cluster: 'frame', projection: ['essay', 'thread', 'structure'] },
  { id: 'src-dembeck', kind: 'source', label: 'Dembeck: framing constitutes reception', cluster: 'frame', projection: ['essay', 'structure'] },
  { id: 'claim-presentation', kind: 'claim', label: 'Text is never apart from presentation', cluster: 'frame', projection: ['essay', 'structure'] },
  { id: 'claim-outside', kind: 'claim', label: 'Reception first speaks from outside', cluster: 'paratext', projection: ['essay', 'structure'] },
  { id: 'decision-admit', kind: 'decision', label: 'Expand the frame to admit reception', cluster: 'paratext', projection: ['essay', 'thread', 'spec'] },
  { id: 'src-genette', kind: 'source', label: 'Genette: epitext and peritext', cluster: 'paratext', projection: ['essay', 'structure'] },
  { id: 'artifact-print', kind: 'artifact', label: 'Printed apparatus', cluster: 'composition', projection: ['essay', 'thread'] },
  { id: 'decision-grid', kind: 'decision', label: 'Composition directs attention', cluster: 'composition', projection: ['essay', 'spec'] },
  { id: 'claim-schema', kind: 'claim', label: 'Software makes structure explicit', cluster: 'application', projection: ['essay', 'structure'] },
  { id: 'tool-records', kind: 'tool', label: 'Claims organized as records', cluster: 'application', projection: ['thread', 'spec'] },
  { id: 'superseded-history', kind: 'superseded', label: 'Treat status as sufficient history', cluster: 'application', projection: ['thread', 'structure'] },
  { id: 'decision-reason', kind: 'decision', label: 'Preserve why a decision was made', cluster: 'application', supersedes: 'superseded-history', projection: ['essay', 'thread', 'structure', 'spec'] },
  { id: 'open-reason', kind: 'open', label: 'Where does reason/context belong?', cluster: 'application', projection: ['thread', 'structure'] },
  { id: 'artifact-essay', kind: 'artifact', label: 'Current essay', cluster: 'artifact', projection: ['essay', 'thread'] },
  { id: 'q-source', kind: 'question', label: 'What should count as the source?', cluster: 'context', projection: ['essay', 'thread', 'structure'] },
  { id: 'claim-context', kind: 'claim', label: 'Operations and context are the source', cluster: 'context', projection: ['essay', 'structure', 'spec'] },
];
