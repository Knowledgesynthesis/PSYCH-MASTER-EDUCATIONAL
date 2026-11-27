import { describe, expect, it } from 'vitest'
import { INTERVAL_DAYS, MAX_BOX, isDue, isLearned, review } from './srs'
import { moduleMastery, masteryLabel, type ProgressSnapshot } from './mastery'
import { mulberry32, shuffle } from './random'
import { MODULES } from '../content'

const DAY = 86_400_000

describe('spaced repetition', () => {
  const now = 1_700_000_000_000
  it('new cards are due', () => expect(isDue(undefined, now)).toBe(true))
  it('"good" advances one box and schedules by interval', () => {
    const s = review(undefined, 'good', now)
    expect(s.box).toBe(1)
    expect(s.due).toBe(now + INTERVAL_DAYS[1] * DAY)
  })
  it('"easy" advances two boxes', () => expect(review(undefined, 'easy', now).box).toBe(2))
  it('"again" resets to box 0, counts a lapse and re-queues within minutes', () => {
    const s = review({ box: 4, due: now, reviews: 5, lapses: 0 }, 'again', now)
    expect(s.box).toBe(0)
    expect(s.lapses).toBe(1)
    expect(s.due - now).toBeLessThan(DAY)
  })
  it('caps at the max box', () => expect(review({ box: MAX_BOX, due: now, reviews: 1, lapses: 0 }, 'easy', now).box).toBe(MAX_BOX))
  it('learned = box ≥3', () => {
    expect(isLearned({ box: 2, due: 0, reviews: 1, lapses: 0 })).toBe(false)
    expect(isLearned({ box: 3, due: 0, reviews: 1, lapses: 0 })).toBe(true)
  })
})

describe('mastery', () => {
  const empty: ProgressSnapshot = { questions: {}, cases: {}, cards: {}, sectionsRead: {} }
  const mod = MODULES[1]

  it('is 0 with no progress', () => expect(moduleMastery(mod, empty).percent).toBe(0))

  it('is 100 with everything complete and correct', () => {
    const full: ProgressSnapshot = {
      questions: Object.fromEntries(mod.questions.map((q) => [q.id, { correct: true, attempts: 1, correctCount: 1, last: 0 }])),
      cases: Object.fromEntries(mod.cases.map((c) => [c.id, { completed: true, firstTryCorrect: c.steps.length, steps: c.steps.length, last: 0 }])),
      cards: Object.fromEntries(mod.flashcards.map((f) => [f.id, { box: 5, due: 0, reviews: 5, lapses: 0 }])),
      sectionsRead: Object.fromEntries(mod.sections.map((s) => [`${mod.id}:${s.id}`, 1])),
    }
    expect(moduleMastery(mod, full).percent).toBe(100)
  })

  it('weights retrieval (questions) more than reading', () => {
    const readOnly: ProgressSnapshot = { ...empty, sectionsRead: Object.fromEntries(mod.sections.map((s) => [`${mod.id}:${s.id}`, 1])) }
    const quizOnly: ProgressSnapshot = { ...empty, questions: Object.fromEntries(mod.questions.map((q) => [q.id, { correct: true, attempts: 1, correctCount: 1, last: 0 }])) }
    expect(moduleMastery(mod, quizOnly).percent).toBeGreaterThan(moduleMastery(mod, readOnly).percent)
  })

  it('labels', () => {
    expect(masteryLabel(0)).toBe('Not started')
    expect(masteryLabel(90)).toBe('Mastered')
  })
})

describe('seeded shuffle', () => {
  it('is deterministic and a permutation', () => {
    const a = shuffle([1, 2, 3, 4, 5, 6], mulberry32(42))
    const b = shuffle([1, 2, 3, 4, 5, 6], mulberry32(42))
    expect(a).toEqual(b)
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5, 6])
  })
})
