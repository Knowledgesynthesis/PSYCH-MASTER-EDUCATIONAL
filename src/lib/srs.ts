/**
 * Leitner-style spaced repetition. Boxes 0–5; each successful recall moves a
 * card up a box and pushes its next review further out (expanding intervals
 * exploit the spacing effect — Cepeda et al. Psychol Bull 2006).
 */

export const INTERVAL_DAYS = [0, 1, 3, 7, 16, 35] as const
export const MAX_BOX = INTERVAL_DAYS.length - 1
const DAY = 86_400_000

export interface CardState {
  box: number
  due: number
  reviews: number
  lapses: number
}

export type Grade = 'again' | 'good' | 'easy'

export function newCard(now: number): CardState {
  return { box: 0, due: now, reviews: 0, lapses: 0 }
}

export function review(state: CardState | undefined, grade: Grade, now: number): CardState {
  const s = state ?? newCard(now)
  if (grade === 'again') {
    return { box: 0, due: now + 10 * 60_000, reviews: s.reviews + 1, lapses: s.lapses + 1 }
  }
  const box = Math.min(MAX_BOX, s.box + (grade === 'easy' ? 2 : 1))
  return { box, due: now + INTERVAL_DAYS[box] * DAY, reviews: s.reviews + 1, lapses: s.lapses }
}

export function isDue(state: CardState | undefined, now: number): boolean {
  return !state || state.due <= now
}

/** A card counts as "learned" once it has survived to box 3 (≥1 week interval). */
export function isLearned(state: CardState | undefined): boolean {
  return Boolean(state && state.box >= 3)
}
