import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { safeStorage } from '../lib/storage'
import { review, type CardState, type Grade } from '../lib/srs'
import type { CaseRecord, ProgressSnapshot, QuestionRecord } from '../lib/mastery'

interface ProgressState extends ProgressSnapshot {
  lastVisited: string | null
  recordAnswer: (questionId: string, correct: boolean) => void
  recordCase: (caseId: string, firstTryCorrect: number, steps: number) => void
  gradeCard: (cardId: string, grade: Grade) => void
  markSectionRead: (key: string) => void
  setLastVisited: (path: string) => void
  importSnapshot: (data: unknown) => boolean
  reset: () => void
}

const empty: ProgressSnapshot = { questions: {}, cases: {}, cards: {}, sectionsRead: {} }

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...empty,
      lastVisited: null,
      recordAnswer: (id, correct) =>
        set((s) => {
          const prev: QuestionRecord | undefined = s.questions[id]
          return {
            questions: {
              ...s.questions,
              [id]: {
                correct,
                attempts: (prev?.attempts ?? 0) + 1,
                correctCount: (prev?.correctCount ?? 0) + (correct ? 1 : 0),
                last: Date.now(),
              },
            },
          }
        }),
      recordCase: (id, firstTryCorrect, steps) =>
        set((s) => {
          const prev: CaseRecord | undefined = s.cases[id]
          // Keep the best run so replaying never lowers mastery.
          const best = Math.max(prev?.firstTryCorrect ?? 0, firstTryCorrect)
          return { cases: { ...s.cases, [id]: { completed: true, firstTryCorrect: best, steps, last: Date.now() } } }
        }),
      gradeCard: (id, grade) =>
        set((s) => ({ cards: { ...s.cards, [id]: review(s.cards[id] as CardState | undefined, grade, Date.now()) } })),
      markSectionRead: (key) =>
        set((s) => (s.sectionsRead[key] ? s : { sectionsRead: { ...s.sectionsRead, [key]: Date.now() } })),
      setLastVisited: (path) => set({ lastVisited: path }),
      importSnapshot: (data) => {
        if (!data || typeof data !== 'object') return false
        const d = data as Partial<ProgressSnapshot>
        const isObj = (v: unknown) => v !== null && typeof v === 'object' && !Array.isArray(v)
        if (![d.questions, d.cases, d.cards, d.sectionsRead].every((v) => v === undefined || isObj(v))) return false
        set({
          questions: d.questions ?? {},
          cases: d.cases ?? {},
          cards: d.cards ?? {},
          sectionsRead: d.sectionsRead ?? {},
        })
        return true
      },
      reset: () => set({ ...empty, lastVisited: null }),
    }),
    {
      name: 'pm-progress',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

export function snapshot(): ProgressSnapshot {
  const { questions, cases, cards, sectionsRead } = useProgress.getState()
  return { questions, cases, cards, sectionsRead }
}
