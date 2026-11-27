import type { Flashcard, Module, Question } from './types'
import { foundations } from './modules/foundations'
import { mdd } from './modules/mdd'
import { bipolar } from './modules/bipolar'
import { psychosis } from './modules/psychosis'
import { anxiety } from './modules/anxiety'
import { ptsd } from './modules/ptsd'
import { adhd } from './modules/adhd'
import { sud } from './modules/sud'
import { personality } from './modules/personality'
import { emergencies } from './modules/emergencies'

/** Recommended learning order. */
export const MODULES: Module[] = [foundations, mdd, bipolar, psychosis, anxiety, ptsd, adhd, sud, personality, emergencies]

export const MODULE_BY_SLUG: Record<string, Module> = Object.fromEntries(MODULES.map((m) => [m.slug, m]))

export interface TaggedQuestion extends Question {
  moduleId: string
  moduleTitle: string
}

export interface TaggedFlashcard extends Flashcard {
  moduleId: string
  moduleTitle: string
}

export const ALL_QUESTIONS: TaggedQuestion[] = MODULES.flatMap((m) => m.questions.map((q) => ({ ...q, moduleId: m.id, moduleTitle: m.shortTitle })))

export const ALL_FLASHCARDS: TaggedFlashcard[] = MODULES.flatMap((m) => m.flashcards.map((f) => ({ ...f, moduleId: m.id, moduleTitle: m.shortTitle })))

export const CONTENT_UPDATED = 'November 2026'
