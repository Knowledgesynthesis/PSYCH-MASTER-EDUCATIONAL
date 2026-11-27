import type { Module } from '../content/types'
import { isLearned, type CardState } from './srs'

export interface QuestionRecord {
  /** Result of the most recent attempt. */
  correct: boolean
  attempts: number
  correctCount: number
  last: number
}

export interface CaseRecord {
  completed: boolean
  firstTryCorrect: number
  steps: number
  last: number
}

export interface ProgressSnapshot {
  questions: Record<string, QuestionRecord>
  cases: Record<string, CaseRecord>
  cards: Record<string, CardState>
  sectionsRead: Record<string, number>
}

export interface ModuleMastery {
  percent: number
  quiz: { answered: number; correct: number; total: number }
  cases: { completed: number; total: number }
  cards: { learned: number; total: number }
  sections: { read: number; total: number }
}

/**
 * Weighted mastery: demonstrated retrieval counts most.
 * 45% question bank (latest attempt correct), 30% cases (first-try accuracy),
 * 15% flashcards learned (box ≥3), 10% sections read.
 */
export function moduleMastery(mod: Module, p: ProgressSnapshot): ModuleMastery {
  const qTotal = mod.questions.length
  const answered = mod.questions.filter((q) => p.questions[q.id]).length
  const correct = mod.questions.filter((q) => p.questions[q.id]?.correct).length

  const cTotal = mod.cases.length
  const completed = mod.cases.filter((c) => p.cases[c.id]?.completed).length
  const caseScore =
    cTotal === 0
      ? 1
      : mod.cases.reduce((sum, c) => {
          const r = p.cases[c.id]
          return sum + (r?.completed ? r.firstTryCorrect / Math.max(1, r.steps) : 0)
        }, 0) / cTotal

  const kTotal = mod.flashcards.length
  const learned = mod.flashcards.filter((f) => isLearned(p.cards[f.id])).length

  const sTotal = mod.sections.length
  const read = mod.sections.filter((s) => p.sectionsRead[`${mod.id}:${s.id}`]).length

  const ratio = (n: number, d: number) => (d === 0 ? 1 : n / d)
  const percent = Math.round(
    100 * (0.45 * ratio(correct, qTotal) + 0.3 * caseScore + 0.15 * ratio(learned, kTotal) + 0.1 * ratio(read, sTotal)),
  )
  return {
    percent,
    quiz: { answered, correct, total: qTotal },
    cases: { completed, total: cTotal },
    cards: { learned, total: kTotal },
    sections: { read, total: sTotal },
  }
}

export function masteryLabel(percent: number): string {
  if (percent >= 85) return 'Mastered'
  if (percent >= 60) return 'Proficient'
  if (percent >= 25) return 'Developing'
  if (percent > 0) return 'Started'
  return 'Not started'
}
