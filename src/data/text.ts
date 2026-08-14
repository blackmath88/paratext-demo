/**
 * All copy that appears inside the scene.
 *
 * The Latin is a pseudo-classical passage on inquiry, patience and judgment —
 * it is the text the whole piece carries from manuscript to interface, so it
 * must read as a real continuous argument rather than lorem filler.
 */

export const BODY_LINES = [
  'Quoniam natura rerum lex est',
  'occulta et mens humana parva,',
  'ideo multa latent abscondita',
  'sub specie veri. Sic in errore',
  'voluptas, et in dubio quies.',
  'Sed qui quaerit, inveniet; et',
  'qui attendit, intellegit. Non',
  'enim sapientia clamat, sed',
  'subtiliter docet; nec se offert',
  'vulgaribus, sed paratis dat',
  'seipsam. Ita fit ut labor sit via,',
  'temporis longi patientia dux,',
  'experientia testis, memoria',
  'custos, et ratio iudex.',
] as const;

/** Continuous form, used for the accessible description and for print reflow. */
export const BODY_PROSE =
  'Quoniam natura rerum lex est occulta et mens humana parva, ideo multa latent ' +
  'abscondita sub specie veri. Sic in errore voluptas, et in dubio quies. Sed qui ' +
  'quaerit, inveniet; et qui attendit, intellegit. Non enim sapientia clamat, sed ' +
  'subtiliter docet; nec se offert vulgaribus, sed paratis dat seipsam. Ita fit ut ' +
  'labor sit via, temporis longi patientia dux, experientia testis, memoria custos, ' +
  'et ratio iudex.';

export type Gloss = {
  id: string;
  text: string[];
  /** Scene coordinates, in the 1440×900 viewBox. */
  x: number;
  y: number;
  /** Parallax plane: 0 is the page, higher floats further from it. */
  plane: 1 | 2;
  /** Normalized position within Act 2 (0..1) at which this note is written. */
  at: number;
  anchor: 'start' | 'end' | 'middle';
  accent: 'teal' | 'purple' | 'amber' | 'rose' | 'ink';
  /** Rotation in degrees — hands are not square to the page. */
  tilt: number;
};

/** Marginalia, taken from the storyboard. Left margin, right margin, headnote. */
export const GLOSSES: Gloss[] = [
  {
    id: 'nota',
    text: ['nota: de natura', '= Aristoteles?'],
    x: 505,
    y: 130,
    plane: 1,
    at: 0.06,
    anchor: 'start',
    accent: 'teal',
    tilt: -1.2,
  },
  {
    id: 'vide',
    text: ['vide', 'lib. II', 'cap. 3'],
    x: 1010,
    y: 168,
    plane: 2,
    at: 0.2,
    anchor: 'start',
    accent: 'amber',
    tilt: 2.4,
  },
  {
    id: 'cf',
    text: ['cf.', 'Boeth.'],
    x: 392,
    y: 258,
    plane: 2,
    at: 0.34,
    anchor: 'start',
    accent: 'rose',
    tilt: -3,
  },
  {
    id: 'contra',
    text: ['con-', 'tra?'],
    x: 396,
    y: 356,
    plane: 2,
    at: 0.48,
    anchor: 'start',
    accent: 'rose',
    tilt: 1.6,
  },
  {
    id: 'huc',
    text: ['huc', 'pertinet', 'exemplum', 'de', 'navicula'],
    x: 1012,
    y: 372,
    plane: 1,
    at: 0.58,
    anchor: 'start',
    accent: 'amber',
    tilt: -1.8,
  },
  {
    id: 'idest',
    text: ['id est:', 'per', 'experimentum'],
    x: 352,
    y: 566,
    plane: 1,
    at: 0.72,
    anchor: 'start',
    accent: 'purple',
    tilt: 2,
  },
  {
    id: 'bene',
    text: ['bene', 'dictum!'],
    x: 1014,
    y: 566,
    plane: 2,
    at: 0.86,
    anchor: 'start',
    accent: 'rose',
    tilt: -2.6,
  },
];

/**
 * Interlinear insertions — squeezed into the gaps between body lines, which is
 * the whole point: the apparatus has to fit where the text left room.
 */
export const INTERLINEAR = [
  { id: 'il-1', text: 'scilicet', lineIndex: 3, dx: 96, at: 0.4, accent: 'teal' as const },
  { id: 'il-2', text: 'i. e. ratio', lineIndex: 7, dx: 40, at: 0.64, accent: 'purple' as const },
];

/**
 * Underlines drawn by a reader in Act 2 which straighten into typographic
 * rules in Act 3. `lineIndex` ties each to a body line so they stay attached
 * when the page reflows.
 */
export const UNDERLINES = [
  { id: 'ul-1', lineIndex: 8, from: 0.0, to: 0.62, at: 0.28, accent: 'ink' as const },
  { id: 'ul-2', lineIndex: 12, from: 0.42, to: 0.98, at: 0.54, accent: 'ink' as const },
];

/** Print apparatus (Act 3), from the storyboard. */
export const PRINT = {
  title: 'DE NATURA RERUM',
  caput: 'Caput I.',
  caputRubric: 'De ratione quaerendi',
  folio: '23',
  lineNumbers: [
    { n: '5', lineIndex: 5 },
    { n: '10', lineIndex: 10 },
  ],
  footnotes: [
    { marker: '1', text: 'cf. Boethius, ', italic: 'De Consol.', tail: ' II, 3.' },
    { marker: '2', text: 'Aristoteles, ', italic: 'Metaph.', tail: ' I, 1.' },
  ],
} as const;
