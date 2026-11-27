import { describe, expect, it } from 'vitest'
import {
  adhdThreshold,
  asdCount,
  clusterCounts,
  evaluateAdhd,
  evaluateEpisode,
  evaluateMde,
  evaluatePsychosis,
  evaluatePtsd,
  type EpisodeInput,
  type PsychosisInput,
} from './criteria'

describe('major depressive episode', () => {
  const base = { durationWeeks: 3, impairment: true, substanceOrMedical: false, priorManiaOrHypomania: false, psychoticFeatures: false }

  it('meets criteria with 5 symptoms including a core symptom', () => {
    const v = evaluateMde({ ...base, symptoms: ['mood', 'sleep', 'fatigue', 'concentration', 'guilt'] })
    expect(v.status).toBe('met')
    expect(v.label).toMatch(/Major depressive disorder/)
  })

  it('fails without a core symptom even with 7 others', () => {
    const v = evaluateMde({ ...base, symptoms: ['weight', 'sleep', 'psychomotor', 'fatigue', 'guilt', 'concentration', 'suicidality'] })
    expect(v.status).not.toBe('met')
    expect(v.reasons.find((r) => /core symptom/.test(r.text))?.ok).toBe(false)
  })

  it('fails at 4 symptoms', () => {
    expect(evaluateMde({ ...base, symptoms: ['mood', 'anhedonia', 'sleep', 'fatigue'] }).status).toBe('partial')
  })

  it('requires ≥2 weeks', () => {
    expect(evaluateMde({ ...base, durationWeeks: 1, symptoms: ['mood', 'anhedonia', 'sleep', 'fatigue', 'guilt'] }).status).not.toBe('met')
  })

  it('redirects to bipolar depression when there is prior mania/hypomania', () => {
    const v = evaluateMde({ ...base, priorManiaOrHypomania: true, symptoms: ['mood', 'anhedonia', 'sleep', 'fatigue', 'guilt'] })
    expect(v.status).toBe('alert')
    expect(v.label).toMatch(/bipolar/i)
  })

  it('flags substance or medical causes', () => {
    const v = evaluateMde({ ...base, substanceOrMedical: true, symptoms: ['mood', 'anhedonia', 'sleep', 'fatigue', 'guilt'] })
    expect(v.status).toBe('alert')
  })

  it('always prompts a safety assessment when suicidality is endorsed', () => {
    const v = evaluateMde({ ...base, symptoms: ['mood', 'suicidality'] })
    expect(v.next?.some((n) => /intent, plan/.test(n))).toBe(true)
  })

  it('labels psychotic features as severe', () => {
    const v = evaluateMde({ ...base, psychoticFeatures: true, symptoms: ['mood', 'anhedonia', 'sleep', 'fatigue', 'guilt'] })
    expect(v.label).toMatch(/psychotic/)
  })
})

describe('manic vs hypomanic episode', () => {
  const base: EpisodeInput = {
    mood: 'elevated',
    increasedEnergy: true,
    bSymptoms: ['sleep', 'talkative', 'flight'],
    durationDays: 5,
    markedImpairment: false,
    hospitalized: false,
    psychotic: false,
    observableByOthers: true,
    substanceOrMedical: false,
    persistsBeyondDrugEffect: false,
  }

  it('classifies 5 days, 3 symptoms, no impairment as hypomania', () => {
    expect(evaluateEpisode(base).label).toBe('Hypomanic episode')
  })

  it('requires increased energy/activity (DSM-5 criterion A)', () => {
    expect(evaluateEpisode({ ...base, increasedEnergy: false }).status).toBe('not-met')
  })

  it('requires 4 B symptoms when mood is only irritable', () => {
    expect(evaluateEpisode({ ...base, mood: 'irritable' }).status).toBe('not-met')
    expect(evaluateEpisode({ ...base, mood: 'irritable', bSymptoms: [...base.bSymptoms, 'risk'] }).label).toBe('Hypomanic episode')
  })

  it('classifies ≥7 days with marked impairment as mania (bipolar I)', () => {
    expect(evaluateEpisode({ ...base, durationDays: 8, markedImpairment: true }).label).toMatch(/Bipolar I/)
  })

  it('accepts any duration when hospitalized', () => {
    expect(evaluateEpisode({ ...base, durationDays: 2, hospitalized: true }).label).toMatch(/Manic episode/)
  })

  it('does not call a 5-day psychotic episode without hospitalization hypomania', () => {
    const v = evaluateEpisode({ ...base, psychotic: true })
    expect(v.label).not.toMatch(/Hypomanic/)
    expect(v.status).toBe('partial')
  })

  it('keeps a 10-day episode without impairment as hypomania (severity, not duration, decides)', () => {
    expect(evaluateEpisode({ ...base, durationDays: 10 }).label).toBe('Hypomanic episode')
  })

  it('treats 3-day episodes as sub-threshold', () => {
    expect(evaluateEpisode({ ...base, durationDays: 3 }).status).toBe('partial')
  })

  it('requires the change to be observable by others for hypomania', () => {
    expect(evaluateEpisode({ ...base, observableByOthers: false }).status).toBe('partial')
  })

  it('separates substance-induced syndromes, except treatment-emergent episodes that persist', () => {
    expect(evaluateEpisode({ ...base, substanceOrMedical: true }).status).toBe('alert')
    expect(evaluateEpisode({ ...base, substanceOrMedical: true, persistsBeyondDrugEffect: true }).label).toBe('Hypomanic episode')
  })
})

describe('psychotic disorders', () => {
  const base: PsychosisInput = {
    symptoms: ['delusions', 'hallucinations'],
    activeDays: 10,
    totalDays: 10,
    mood: 'none',
    psychosisWithoutMood2w: false,
    functionalDecline: true,
    returnedToBaseline: true,
    substanceOrMedical: false,
  }

  it('brief psychotic disorder: 1 day to <1 month with return to baseline', () => {
    expect(evaluatePsychosis(base).label).toBe('Brief psychotic disorder')
    expect(evaluatePsychosis({ ...base, returnedToBaseline: false }).label).toMatch(/provisional/)
  })

  it('schizophreniform: 1 to <6 months', () => {
    expect(evaluatePsychosis({ ...base, activeDays: 60, totalDays: 90 }).label).toBe('Schizophreniform disorder')
  })

  it('schizophrenia: ≥6 months total including prodrome, ≥1 month active, with decline', () => {
    expect(evaluatePsychosis({ ...base, activeDays: 90, totalDays: 210 }).label).toBe('Schizophrenia')
  })

  it('counts prodromal time toward the 6-month threshold', () => {
    expect(evaluatePsychosis({ ...base, activeDays: 45, totalDays: 200 }).label).toBe('Schizophrenia')
  })

  it('requires functional decline for schizophrenia', () => {
    expect(evaluatePsychosis({ ...base, activeDays: 90, totalDays: 210, functionalDecline: false }).status).toBe('partial')
  })

  it('psychosis only during mood episodes → mood disorder with psychotic features', () => {
    expect(evaluatePsychosis({ ...base, mood: 'only-during-mood', activeDays: 200, totalDays: 200 }).label).toMatch(/Mood disorder/)
  })

  it('schizoaffective requires ≥2 weeks psychosis without mood and mood for the majority', () => {
    expect(evaluatePsychosis({ ...base, mood: 'majority', psychosisWithoutMood2w: true, activeDays: 200, totalDays: 300 }).label).toBe('Schizoaffective disorder')
    expect(evaluatePsychosis({ ...base, mood: 'majority', psychosisWithoutMood2w: false, activeDays: 200, totalDays: 300 }).label).not.toBe('Schizoaffective disorder')
  })

  it('delusional disorder: delusions only ≥1 month, function preserved', () => {
    expect(evaluatePsychosis({ ...base, symptoms: ['delusions'], activeDays: 400, totalDays: 400, functionalDecline: false }).label).toBe('Delusional disorder')
  })

  it('substance/medical cause takes precedence', () => {
    expect(evaluatePsychosis({ ...base, substanceOrMedical: true }).status).toBe('alert')
  })

  it('needs a core symptom', () => {
    expect(evaluatePsychosis({ ...base, symptoms: ['negative', 'behavior'] }).status).toBe('not-met')
  })

  it('does not call ≥1 month of a single symptom (hallucinations only) schizophrenia', () => {
    expect(evaluatePsychosis({ ...base, symptoms: ['hallucinations'], activeDays: 300, totalDays: 300 }).label).toMatch(/Other specified/)
  })
})

describe('PTSD / acute stress disorder', () => {
  const full = ['memories', 'avoidExternal', 'beliefs', 'detached', 'hypervigilance', 'startle']
  const base = { exposure: 'direct', symptoms: full, dissociation: false, daysSinceTrauma: 60, impairment: true, substanceOrMedical: false, delayedOnset: false }

  it('meets PTSD with 1/1/2/2 after a month', () => {
    expect(evaluatePtsd(base).label).toBe('PTSD')
  })

  it('asks for criterion A before anything else', () => {
    const v = evaluatePtsd({ ...base, exposure: null })
    expect(v.status).toBe('not-met')
    expect(v.label).toMatch(/criterion A/)
  })

  it('rejects non-qualifying exposures', () => {
    expect(evaluatePtsd({ ...base, exposure: 'media' }).label).toMatch(/criterion A not met/)
    expect(evaluatePtsd({ ...base, exposure: 'stressor' }).summary).toMatch(/adjustment disorder/)
  })

  it('accepts repeated professional exposure', () => {
    expect(evaluatePtsd({ ...base, exposure: 'professional' }).label).toBe('PTSD')
  })

  it('cannot diagnose PTSD within the first month', () => {
    expect(evaluatePtsd({ ...base, daysSinceTrauma: 20 }).label).not.toBe('PTSD')
  })

  it('diagnoses ASD with ≥9 of 14 symptoms between day 3 and day 30', () => {
    const asd = ['memories', 'dreams', 'flashbacks', 'cueDistress', 'avoidInternal', 'avoidExternal', 'sleep', 'hypervigilance', 'startle']
    expect(asdCount(asd, false)).toBe(9)
    expect(evaluatePtsd({ ...base, symptoms: asd, daysSinceTrauma: 10 }).label).toBe('Acute stress disorder')
  })

  it('counts distress and physiological reactions to cues as one ASD item', () => {
    expect(asdCount(['cueDistress', 'cuePhysio'], false)).toBe(1)
    expect(asdCount(['cueDistress'], true)).toBe(2)
  })

  it('does not count PTSD-only items (e.g. distorted blame) toward ASD', () => {
    expect(asdCount(['blame', 'beliefs', 'reckless'], false)).toBe(0)
  })

  it('advises against debriefing in the first 72 hours', () => {
    expect(evaluatePtsd({ ...base, daysSinceTrauma: 1 }).summary).toMatch(/debriefing/)
  })

  it('adds specifiers', () => {
    expect(evaluatePtsd({ ...base, dissociation: true, delayedOnset: true }).label).toBe('PTSD — with dissociative symptoms, with delayed expression')
  })

  it('reports cluster counts', () => {
    expect(clusterCounts(full)).toEqual({ B: 1, C: 1, D: 2, E: 2 })
  })

  it('fails when a cluster minimum is missed', () => {
    expect(evaluatePtsd({ ...base, symptoms: ['memories', 'avoidExternal', 'beliefs', 'hypervigilance', 'startle'] }).status).toBe('partial')
  })
})

describe('ADHD', () => {
  const six = ['careless', 'sustain', 'listen', 'follow', 'organize', 'avoid']
  const base = { age: 9, inattention: six, hyperactivity: [], sixMonths: true, onsetBefore12: true, twoSettings: true, impairment: true, betterExplained: false }

  it('uses 6 symptoms under 17 and 5 from 17', () => {
    expect(adhdThreshold(16)).toBe(6)
    expect(adhdThreshold(17)).toBe(5)
  })

  it('predominantly inattentive presentation', () => {
    expect(evaluateAdhd(base).label).toBe('ADHD — predominantly inattentive presentation')
  })

  it('5 symptoms are enough at 19 but not at 12', () => {
    expect(evaluateAdhd({ ...base, age: 19, inattention: six.slice(0, 5) }).status).toBe('met')
    expect(evaluateAdhd({ ...base, age: 12, inattention: six.slice(0, 5) }).status).toBe('partial')
  })

  it('combined presentation', () => {
    expect(evaluateAdhd({ ...base, hyperactivity: ['fidgets', 'seat', 'runs', 'quiet', 'motor', 'talks'] }).label).toMatch(/combined/)
  })

  it('symptom counts without onset/settings/impairment are not a diagnosis', () => {
    expect(evaluateAdhd({ ...base, twoSettings: false }).status).toBe('partial')
    expect(evaluateAdhd({ ...base, onsetBefore12: false }).status).toBe('partial')
    expect(evaluateAdhd({ ...base, betterExplained: true }).status).toBe('partial')
  })

  it('recommends behavioral parent training first under 6', () => {
    expect(evaluateAdhd({ ...base, age: 5 }).next?.[0]).toMatch(/parent training/)
  })
})
