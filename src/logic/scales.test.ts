import { describe, expect, it } from 'vitest'
import { SCALES, scaleMax, scoreScale, PHQ9, CIWA, COWS, AUDITC, BFCRS, FOURAT, GAD7, type Scale } from './scales'

const answerAll = (scale: Scale, pick: (choices: number) => number) =>
  Object.fromEntries(scale.items.map((i) => [i.id, pick(i.choices.length)]))

describe('scale definitions match the published instruments', () => {
  it.each([
    [PHQ9, 9, 27],
    [GAD7, 7, 21],
    [AUDITC, 3, 12],
    [CIWA, 10, 67],
    [COWS, 11, 48],
    [BFCRS, 14, 14],
    [FOURAT, 4, 12],
  ])('%s has the right item count and maximum', (scale, items, max) => {
    expect(scale.items).toHaveLength(items)
    expect(scaleMax(scale)).toBe(max)
  })

  it.each(Object.values(SCALES))('$short bands are contiguous from 0 to max with no gaps or overlaps', (scale) => {
    const bands = [...scale.bands].sort((a, b) => a.min - b.min)
    expect(bands[0].min).toBe(0)
    expect(bands[bands.length - 1].max).toBe(scaleMax(scale))
    for (let i = 1; i < bands.length; i++) expect(bands[i].min).toBe(bands[i - 1].max + 1)
  })

  it.each(Object.values(SCALES))('$short every score maps to exactly one band', (scale) => {
    for (let s = 0; s <= scaleMax(scale); s++) {
      expect(scale.bands.filter((b) => s >= b.min && s <= b.max)).toHaveLength(1)
    }
  })

  it('choice points are non-decreasing within each item', () => {
    for (const scale of Object.values(SCALES)) {
      for (const item of scale.items) {
        const pts = item.choices.map((c) => c.points)
        expect(pts).toEqual([...pts].sort((a, b) => a - b))
      }
    }
  })
})

describe('scoring', () => {
  it('scores maxima and minima', () => {
    expect(scoreScale(PHQ9, answerAll(PHQ9, (n) => n - 1)).total).toBe(27)
    expect(scoreScale(PHQ9, answerAll(PHQ9, () => 0)).total).toBe(0)
    expect(scoreScale(COWS, answerAll(COWS, (n) => n - 1)).total).toBe(48)
  })

  it('uses PHQ-9 cut-offs 5/10/15/20', () => {
    const at = (score: number) => {
      // distribute score across items (max 3 each)
      const a: Record<string, number> = {}
      let left = score
      for (const item of PHQ9.items) {
        const v = Math.min(3, left)
        a[item.id] = v
        left -= v
      }
      return scoreScale(PHQ9, a).band?.label
    }
    expect(at(4)).toBe('Minimal')
    expect(at(5)).toBe('Mild')
    expect(at(10)).toBe('Moderate')
    expect(at(15)).toBe('Moderately severe')
    expect(at(20)).toBe('Severe')
  })

  it('flags PHQ-9 item 9 regardless of total', () => {
    const r = scoreScale(PHQ9, { q9: 1 })
    expect(r.total).toBe(1)
    expect(r.flags.some((f) => /suicide risk assessment/.test(f))).toBe(true)
  })

  it('does not fire the core-symptom flag before items 1–2 are answered', () => {
    expect(scoreScale(PHQ9, {}).flags).toHaveLength(0)
    expect(scoreScale(PHQ9, { q1: 0, q2: 1 }).flags.some((f) => /core item/.test(f))).toBe(true)
  })

  it('applies ASAM CIWA-Ar thresholds (<10, 10–18, ≥19)', () => {
    const score = (n: number) => {
      const a: Record<string, number> = {}
      let left = n
      for (const item of CIWA.items) {
        const max = item.choices.length - 1
        const v = Math.min(max, left)
        a[item.id] = v
        left -= v
      }
      return scoreScale(CIWA, a).band?.label
    }
    expect(score(9)).toBe('Mild withdrawal')
    expect(score(10)).toBe('Moderate withdrawal')
    expect(score(18)).toBe('Moderate withdrawal')
    expect(score(19)).toBe('Severe withdrawal')
  })

  it('flags disorientation on CIWA-Ar as possible delirium', () => {
    expect(scoreScale(CIWA, { orientation: 3 }).flags.some((f) => /delirium/.test(f))).toBe(true)
  })

  it('maps COWS choice indexes to non-linear points', () => {
    // gooseflesh: 0, 3, 5
    expect(scoreScale(COWS, { gooseflesh: 1 }).total).toBe(3)
    expect(scoreScale(COWS, { gooseflesh: 2 }).total).toBe(5)
  })

  it('reports completeness', () => {
    expect(scoreScale(GAD7, { q1: 2 }).complete).toBe(false)
    expect(scoreScale(GAD7, answerAll(GAD7, () => 1)).complete).toBe(true)
  })

  it('AUDIT-C 3 is positive for women only; 4 positive for all', () => {
    expect(scoreScale(AUDITC, { q1: 3, q2: 0, q3: 0 }).band?.label).toMatch(/women/)
    expect(scoreScale(AUDITC, { q1: 4, q2: 0, q3: 0 }).band?.label).toBe('Positive')
  })

  it('Bush–Francis counts positive items (≥2 = positive screen)', () => {
    expect(scoreScale(BFCRS, { mutism: 1 }).band?.label).toBe('Screen negative')
    expect(scoreScale(BFCRS, { mutism: 1, staring: 1 }).band?.label).toBe('Screen positive')
  })

  it('4AT: acute change alone reaches the delirium threshold', () => {
    expect(scoreScale(FOURAT, { acute: 1 }).total).toBe(4)
    expect(scoreScale(FOURAT, { acute: 1 }).band?.label).toMatch(/delirium/)
  })

  it('ignores invalid choice indexes', () => {
    expect(scoreScale(GAD7, { q1: 99 }).answered).toBe(0)
  })
})
