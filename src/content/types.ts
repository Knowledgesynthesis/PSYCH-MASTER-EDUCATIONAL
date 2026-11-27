/**
 * Content model. Every module is plain data rendered by generic components,
 * so content can be audited, tested and updated without touching UI code.
 *
 * Inline text supports **bold** only (see components/RichText.tsx).
 */

export type Tone = 'danger' | 'warning' | 'info' | 'success' | 'pearl'

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; columns: string[]; rows: string[][]; caption?: string }
  | { type: 'callout'; tone: Tone; title?: string; text: string | string[] }
  | { type: 'keyNumbers'; items: { value: string; label: string }[] }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'defs'; items: { term: string; text: string }[] }

export interface Section {
  id: string
  title: string
  blocks: Block[]
  /** Reference ids (see references.ts) supporting this section. */
  refs?: string[]
}

export interface Option {
  text: string
  /** Why this option is right or wrong — shown after answering. */
  why: string
}

export interface Question {
  id: string
  stem: string
  options: Option[]
  /** Index into options. */
  answer: number
  /** Teaching point shown after answering. */
  explanation: string
  difficulty?: 1 | 2 | 3
  refs?: string[]
}

export interface CaseStep {
  /** New information revealed at this step. */
  reveal: string
  prompt: string
  options: Option[]
  answer: number
  explanation: string
}

export interface ClinicalCase {
  id: string
  title: string
  setting: string
  steps: CaseStep[]
  takeaway: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface SortItem {
  text: string
  bin: string
  why: string
}

export interface SortExercise {
  id: string
  title: string
  instructions: string
  bins: string[]
  items: SortItem[]
}

export type ToolId =
  | 'phq9'
  | 'gad7'
  | 'auditc'
  | 'ciwa'
  | 'cows'
  | 'bfcrs'
  | 'fourat'
  | 'mde-checker'
  | 'episode-classifier'
  | 'psychosis-classifier'
  | 'ptsd-mapper'
  | 'adhd-analyzer'
  | 'alcohol-timeline'
  | 'toxidrome'

export type ModuleIcon =
  | 'compass'
  | 'cloud-rain'
  | 'zap'
  | 'eye'
  | 'wind'
  | 'shield'
  | 'target'
  | 'flask'
  | 'users'
  | 'siren'

export interface Pitfall {
  trap: string
  fix: string
}

export interface Module {
  id: string
  /** URL path segment, e.g. "mdd" → /mdd */
  slug: string
  title: string
  shortTitle: string
  icon: ModuleIcon
  /** Tailwind color family used for accents, e.g. "sky" */
  accent: Accent
  tagline: string
  objectives: string[]
  /** The 3–6 facts you must walk away with. */
  bottomLine: string[]
  sections: Section[]
  pitfalls: Pitfall[]
  tools: ToolId[]
  sorts?: SortExercise[]
  cases: ClinicalCase[]
  questions: Question[]
  flashcards: Flashcard[]
  references: string[]
}

export type Accent =
  | 'indigo'
  | 'sky'
  | 'amber'
  | 'violet'
  | 'emerald'
  | 'rose'
  | 'orange'
  | 'teal'
  | 'fuchsia'
  | 'red'

export type ReferenceType =
  | 'criteria'
  | 'guideline'
  | 'meta-analysis'
  | 'trial'
  | 'cohort'
  | 'regulatory'
  | 'review'
  | 'instrument'

export interface Reference {
  id: string
  citation: string
  year: number
  type: ReferenceType
  url?: string
}

export interface GlossaryTerm {
  term: string
  definition: string
  category: string
  /** Optional contrast with a commonly confused term. */
  contrast?: string
}
