import { describe, expect, it } from 'vitest'
import { FINDINGS, SYNDROMES, hunterCriteria, rankSyndromes } from './toxidrome'
import { ALCOHOL_PHASES, phaseState, timelineAdvice } from './timeline'

const top = (findings: string[]) => rankSyndromes(findings)[0].syndrome.id

describe('toxidrome differentiator', () => {
  it('ranks classic serotonin syndrome first', () => {
    expect(top(['serotonergic', 'hours', 'clonus', 'hyperreflexia', 'diaphoresis', 'diarrhea', 'mydriasis'])).toBe('ss')
  })

  it('ranks classic NMS first', () => {
    expect(top(['antidopamine', 'days', 'leadpipe', 'bradyreflexia', 'fever', 'ck', 'diaphoresis'])).toBe('nms')
  })

  it('ranks anticholinergic toxicity first with dry skin and retention', () => {
    expect(top(['anticholinergic', 'hours', 'dryskin', 'mydriasis', 'retention', 'fever'])).toBe('ac')
  })

  it('ranks malignant hyperthermia first in theatre', () => {
    expect(top(['anesthetic', 'hours', 'etco2', 'leadpipe', 'fever'])).toBe('mh')
  })

  it('ranks malignant catatonia first with catatonic signs and fever', () => {
    expect(top(['catatonic', 'fever', 'days', 'leadpipe'])).toBe('mc')
  })

  it('ranks sympathomimetic toxicity with stimulant use and wet skin', () => {
    expect(top(['stimulant', 'hours', 'mydriasis', 'diaphoresis'])).toBe('sym')
  })

  it('ranks withdrawal after stopping sedatives with tremor and hallucinations', () => {
    expect(top(['stoppedSedative', 'days', 'tremor', 'hallucinations', 'diaphoresis'])).toBe('wd')
  })

  it('clonus argues against NMS', () => {
    const nms = rankSyndromes(['clonus']).find((r) => r.syndrome.id === 'nms')!
    expect(nms.against.length).toBe(1)
    expect(nms.score).toBeLessThan(0)
  })

  it('every finding weight references a real syndrome', () => {
    const ids = new Set(SYNDROMES.map((s) => s.id))
    for (const f of FINDINGS) for (const k of Object.keys(f.weights)) expect(ids.has(k as never)).toBe(true)
  })
})

describe('Hunter serotonin toxicity criteria', () => {
  const none = { serotonergic: true, spontaneousClonus: false, inducibleClonus: false, ocularClonus: false, agitation: false, diaphoresis: false, tremor: false, hyperreflexia: false, hypertonia: false, tempOver38: false }
  it('requires a serotonergic agent', () => expect(hunterCriteria({ ...none, serotonergic: false, spontaneousClonus: true }).met).toBe(false))
  it('spontaneous clonus alone', () => expect(hunterCriteria({ ...none, spontaneousClonus: true }).met).toBe(true))
  it('inducible clonus needs agitation or diaphoresis', () => {
    expect(hunterCriteria({ ...none, inducibleClonus: true }).met).toBe(false)
    expect(hunterCriteria({ ...none, inducibleClonus: true, diaphoresis: true }).met).toBe(true)
  })
  it('tremor + hyperreflexia', () => expect(hunterCriteria({ ...none, tremor: true, hyperreflexia: true }).met).toBe(true))
  it('hypertonia + fever + ocular clonus', () => expect(hunterCriteria({ ...none, hypertonia: true, tempOver38: true, ocularClonus: true }).met).toBe(true))
  it('hypertonia + fever without clonus is not enough', () => expect(hunterCriteria({ ...none, hypertonia: true, tempOver38: true }).met).toBe(false))
})

describe('alcohol withdrawal timeline', () => {
  const dts = ALCOHOL_PHASES.find((p) => p.id === 'dts')!
  const seizures = ALCOHOL_PHASES.find((p) => p.id === 'seizures')!
  it('DTs are upcoming at 24 h and peak around 72 h', () => {
    expect(phaseState(dts, 24)).toBe('upcoming')
    expect(phaseState(dts, 72)).toBe('peak')
  })
  it('seizure window closes after 48 h', () => {
    expect(phaseState(seizures, 24)).toBe('peak')
    expect(phaseState(seizures, 60)).toBe('past')
  })
  it('gives time-appropriate advice', () => {
    expect(timelineAdvice(2)).toMatch(/thiamine/)
    expect(timelineAdvice(72)).toMatch(/Delirium tremens/)
    expect(timelineAdvice(150)).toMatch(/another cause/)
  })
})
