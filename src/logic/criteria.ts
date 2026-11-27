/**
 * Rule engines that mirror DSM-5-TR decision logic. Each returns a verdict and
 * the reasoning trail so the learner sees which rule fired — the point is to
 * teach the logic, not to label patients.
 */

export type Status = 'met' | 'not-met' | 'partial' | 'alert'

export interface Reason {
  ok: boolean
  text: string
}

export interface Verdict {
  status: Status
  label: string
  summary: string
  reasons: Reason[]
  next?: string[]
}

/* ------------------------------------------------------------------ */
/* Major depressive episode                                            */
/* ------------------------------------------------------------------ */

export const MDE_SYMPTOMS = [
  { id: 'mood', label: 'Depressed mood most of the day (irritable in children/adolescents)', core: true },
  { id: 'anhedonia', label: 'Markedly diminished interest or pleasure', core: true },
  { id: 'weight', label: 'Weight/appetite change (>5% body weight in a month, or appetite change)', core: false },
  { id: 'sleep', label: 'Insomnia or hypersomnia', core: false },
  { id: 'psychomotor', label: 'Psychomotor agitation or retardation (observable by others)', core: false },
  { id: 'fatigue', label: 'Fatigue or loss of energy', core: false },
  { id: 'guilt', label: 'Worthlessness or excessive/inappropriate guilt', core: false },
  { id: 'concentration', label: 'Diminished concentration or indecisiveness', core: false },
  { id: 'suicidality', label: 'Recurrent thoughts of death, suicidal ideation, plan or attempt', core: false },
] as const

export interface MdeInput {
  symptoms: string[]
  durationWeeks: number
  impairment: boolean
  substanceOrMedical: boolean
  priorManiaOrHypomania: boolean
  psychoticFeatures: boolean
}

export function evaluateMde(input: MdeInput): Verdict {
  const set = new Set(input.symptoms)
  const count = MDE_SYMPTOMS.filter((s) => set.has(s.id)).length
  const core = set.has('mood') || set.has('anhedonia')
  const reasons: Reason[] = [
    { ok: count >= 5, text: `${count}/9 symptoms present (need ≥5)` },
    { ok: core, text: core ? 'At least one core symptom (depressed mood or anhedonia)' : 'No core symptom — depressed mood or anhedonia is mandatory' },
    { ok: input.durationWeeks >= 2, text: `Duration ${input.durationWeeks} week(s) (need ≥2 weeks, nearly every day)` },
    { ok: input.impairment, text: input.impairment ? 'Clinically significant distress or impairment' : 'No significant distress/impairment' },
    { ok: !input.substanceOrMedical, text: input.substanceOrMedical ? 'Attributable to a substance or medical condition → substance/medication-induced or due to another medical condition' : 'Not attributable to a substance or medical condition' },
  ]
  const next: string[] = []
  if (set.has('suicidality')) next.push('Suicidality endorsed: assess ideation, intent, plan, preparatory behavior, prior attempts and access to lethal means today.')
  if (input.psychoticFeatures) next.push('Psychotic features: treat with antidepressant + antipsychotic or ECT; assess safety and capacity.')

  const meetsEpisode = reasons.every((r) => r.ok)
  if (!meetsEpisode) {
    const partial = count >= 3 && core
    return {
      status: input.substanceOrMedical ? 'alert' : partial ? 'partial' : 'not-met',
      label: input.substanceOrMedical ? 'Not a primary depressive episode' : 'Major depressive episode criteria not met',
      summary: input.substanceOrMedical
        ? 'Depressive syndrome better explained by a substance/medication or medical condition. Treat the cause and reassess.'
        : partial
          ? 'Sub-threshold. Consider other specified depressive disorder, adjustment disorder (if stressor-linked), persistent depressive disorder (if ≥2 years) or normal sadness/grief.'
          : 'Insufficient for a major depressive episode.',
      reasons,
      next,
    }
  }

  if (input.priorManiaOrHypomania) {
    return {
      status: 'alert',
      label: 'Major depressive episode — in bipolar disorder',
      summary: 'A prior manic or hypomanic episode excludes MDD. This is bipolar depression (BD-I if any mania; BD-II if hypomania only). Avoid antidepressant monotherapy.',
      reasons: [...reasons, { ok: false, text: 'History of mania/hypomania — MDD is excluded' }],
      next,
    }
  }

  const severity = input.psychoticFeatures ? 'severe, with psychotic features' : count >= 8 ? 'likely severe' : count >= 6 ? 'likely moderate' : 'likely mild'
  return {
    status: 'met',
    label: `Major depressive disorder — ${severity}`,
    summary: 'Criteria for a major depressive episode are met with no history of mania/hypomania. Severity is a clinical judgement of symptom count, intensity and impairment.',
    reasons: [...reasons, { ok: true, text: 'No history of mania or hypomania' }],
    next,
  }
}

/* ------------------------------------------------------------------ */
/* Manic / hypomanic episode                                           */
/* ------------------------------------------------------------------ */

export const B_SYMPTOMS = [
  { id: 'grandiosity', label: 'Inflated self-esteem or grandiosity' },
  { id: 'sleep', label: 'Decreased need for sleep (rested after ~3 h)' },
  { id: 'talkative', label: 'More talkative than usual or pressured speech' },
  { id: 'flight', label: 'Flight of ideas or racing thoughts' },
  { id: 'distractibility', label: 'Distractibility' },
  { id: 'activity', label: 'Increased goal-directed activity or psychomotor agitation' },
  { id: 'risk', label: 'Excessive involvement in risky activities (spending, sex, investments)' },
] as const

export interface EpisodeInput {
  mood: 'elevated' | 'irritable' | 'none'
  increasedEnergy: boolean
  bSymptoms: string[]
  durationDays: number
  markedImpairment: boolean
  hospitalized: boolean
  psychotic: boolean
  observableByOthers: boolean
  substanceOrMedical: boolean
  /** Antidepressant/ECT-emergent episode that persists at full syndromal level beyond the drug's physiological effect. */
  persistsBeyondDrugEffect: boolean
}

export function evaluateEpisode(input: EpisodeInput): Verdict {
  const reasons: Reason[] = []
  const aOk = input.mood !== 'none' && input.increasedEnergy
  reasons.push({
    ok: aOk,
    text:
      input.mood === 'none'
        ? 'Criterion A: no abnormally elevated, expansive or irritable mood'
        : input.increasedEnergy
          ? 'Criterion A: abnormal mood AND persistently increased activity/energy'
          : 'Criterion A: mood change without increased activity/energy (DSM-5 requires both)',
  })
  const needed = input.mood === 'irritable' ? 4 : 3
  const count = B_SYMPTOMS.filter((s) => input.bSymptoms.includes(s.id)).length
  reasons.push({ ok: count >= needed, text: `Criterion B: ${count} symptom(s); need ≥${needed}${input.mood === 'irritable' ? ' because mood is only irritable' : ''}` })

  if (!aOk || count < needed) {
    return {
      status: 'not-met',
      label: 'No manic or hypomanic episode',
      summary: 'Core criteria are not met. Consider other explanations (substances, ADHD, anxiety, personality traits, normal happiness).',
      reasons,
    }
  }

  if (input.substanceOrMedical && !input.persistsBeyondDrugEffect) {
    reasons.push({ ok: false, text: 'Attributable to a substance/medication or medical condition' })
    return {
      status: 'alert',
      label: 'Substance/medication-induced or medical bipolar-type syndrome',
      summary: 'Does not count toward bipolar I/II. Exception: an antidepressant- or ECT-emergent episode that persists at full syndromal level beyond the treatment’s physiological effect counts as a true episode.',
      reasons,
      next: ['Stop or reduce the precipitant; check stimulants, corticosteroids, levodopa, thyroid, CNS lesions (especially new-onset mania after age 50).'],
    }
  }
  if (input.substanceOrMedical && input.persistsBeyondDrugEffect) {
    reasons.push({ ok: true, text: 'Treatment-emergent but persists beyond physiological effect — counts as a true episode' })
  }

  const severe = input.markedImpairment || input.hospitalized || input.psychotic
  reasons.push({
    ok: true,
    text: severe
      ? `Severity: ${[input.markedImpairment && 'marked impairment', input.hospitalized && 'hospitalization', input.psychotic && 'psychotic features'].filter(Boolean).join(', ')} → manic-level`
      : 'Severity: no marked impairment, hospitalization or psychosis → hypomanic-level',
  })

  if (severe) {
    const durationOk = input.durationDays >= 7 || input.hospitalized
    reasons.push({ ok: durationOk, text: `Duration ${input.durationDays} day(s): mania needs ≥7 days, or any duration if hospitalized` })
    if (durationOk) {
      return {
        status: 'met',
        label: 'Manic episode → Bipolar I disorder',
        summary: 'One lifetime manic episode establishes bipolar I. A depressive episode is not required.',
        reasons,
        next: [
          'Stop antidepressants. First-line: lithium, valproate, or an SGA (quetiapine, aripiprazole, risperidone, asenapine, cariprazine, paliperidone); combine mood stabilizer + SGA if severe.',
          'Rule out substances and medical causes; check pregnancy status before valproate/lithium.',
        ],
      }
    }
    return {
      status: 'partial',
      label: 'Manic-level severity but too brief for mania',
      summary: input.psychotic
        ? 'Psychotic features exclude hypomania, yet mania requires ≥7 days unless hospitalized. In practice such patients usually need admission (which satisfies the duration rule); otherwise code other specified bipolar and related disorder and reassess.'
        : 'Marked impairment excludes hypomania, but duration is <7 days without hospitalization: other specified bipolar and related disorder. Reassess — many episodes continue past 7 days.',
      reasons,
    }
  }

  reasons.push({ ok: input.observableByOthers, text: input.observableByOthers ? 'Change is observable by others' : 'Change not observable by others (required for hypomania)' })
  if (input.durationDays >= 4 && input.observableByOthers) {
    return {
      status: 'met',
      label: 'Hypomanic episode',
      summary:
        'Hypomania + at least one major depressive episode (and never mania) = bipolar II. Hypomania can last longer than 7 days — severity, not duration, separates it from mania.',
      reasons: [...reasons, { ok: true, text: `Duration ${input.durationDays} day(s) ≥4 consecutive days` }],
      next: ['Ask about past depressive episodes (needed for bipolar II). Without one: other specified bipolar or cyclothymic disorder (if ≥2 years of sub-threshold cycling).'],
    }
  }
  return {
    status: 'partial',
    label: 'Sub-threshold hypomanic symptoms',
    summary:
      input.durationDays >= 2
        ? 'Hypomanic symptoms lasting 2–3 days (or without observable change): other specified bipolar and related disorder if accompanied by depressive episodes. Follow longitudinally.'
        : 'Too brief for hypomania (<4 days). Explore the pattern over time and with collateral history.',
    reasons: [...reasons, { ok: false, text: `Duration ${input.durationDays} day(s) — hypomania needs ≥4 consecutive days` }],
  }
}

/* ------------------------------------------------------------------ */
/* Psychotic disorders (duration-and-mood logic)                       */
/* ------------------------------------------------------------------ */

export const PSYCHOSIS_A = [
  { id: 'delusions', label: 'Delusions', core: true },
  { id: 'hallucinations', label: 'Hallucinations', core: true },
  { id: 'speech', label: 'Disorganized speech', core: true },
  { id: 'behavior', label: 'Grossly disorganized or catatonic behavior', core: false },
  { id: 'negative', label: 'Negative symptoms (diminished expression, avolition)', core: false },
] as const

export interface PsychosisInput {
  symptoms: string[]
  /** Days of active-phase (criterion A) symptoms. */
  activeDays: number
  /** Total days of disturbance including prodromal/residual signs. */
  totalDays: number
  mood: 'none' | 'only-during-mood' | 'minority' | 'majority'
  /** ≥2 weeks of delusions or hallucinations without a major mood episode (lifetime). */
  psychosisWithoutMood2w: boolean
  functionalDecline: boolean
  returnedToBaseline: boolean
  substanceOrMedical: boolean
}

export function evaluatePsychosis(input: PsychosisInput): Verdict {
  const set = new Set(input.symptoms)
  const count = PSYCHOSIS_A.filter((s) => set.has(s.id)).length
  const coreCount = PSYCHOSIS_A.filter((s) => s.core && set.has(s.id)).length
  const total = Math.max(input.totalDays, input.activeDays)
  const reasons: Reason[] = []
  const workup = [
    'First episode: CBC, CMP, glucose, TSH, urine toxicology, HIV, syphilis, pregnancy test; B12; lipids/A1c before antipsychotic.',
    'MRI ± EEG ± lumbar puncture with autoimmune encephalitis panel if atypical (rapid onset, seizures, catatonia, dyskinesia, autonomic instability, reduced consciousness, focal signs, severe EPS to low-dose antipsychotic).',
  ]

  if (count === 0) {
    return { status: 'not-met', label: 'No psychotic symptoms selected', summary: 'Select the criterion A symptoms present.', reasons }
  }

  if (input.substanceOrMedical) {
    return {
      status: 'alert',
      label: 'Substance/medication-induced or due to another medical condition',
      summary:
        'Psychosis attributable to a substance, withdrawal, medication or medical illness is not a primary psychotic disorder. Suspect primary illness if symptoms precede use or persist ~1 month after abstinence.',
      reasons: [{ ok: false, text: 'Attributable to a substance/medication or medical condition' }],
      next: workup,
    }
  }

  if (input.mood === 'only-during-mood') {
    return {
      status: 'met',
      label: 'Mood disorder with psychotic features',
      summary: 'Psychosis occurring exclusively during major depressive or manic episodes = MDD or bipolar disorder with psychotic features — not a primary psychotic disorder.',
      reasons: [{ ok: true, text: 'Psychotic symptoms confined to mood episodes' }],
      next: ['Depression with psychosis: antidepressant + antipsychotic, or ECT. Mania with psychosis = bipolar I by definition.'],
    }
  }

  if (input.mood === 'majority') {
    reasons.push({ ok: true, text: 'Major mood episodes present for the majority of the total illness' })
    reasons.push({ ok: input.psychosisWithoutMood2w, text: input.psychosisWithoutMood2w ? '≥2 weeks of delusions/hallucinations without a mood episode' : 'No 2-week period of psychosis without mood symptoms' })
    if (input.psychosisWithoutMood2w) {
      return {
        status: 'met',
        label: 'Schizoaffective disorder',
        summary: 'Concurrent mood episode + schizophrenia criterion A, ≥2 weeks of psychosis without mood episode, and mood symptoms for the majority of the illness. Specify bipolar or depressive type.',
        reasons,
        next: workup,
      }
    }
    return {
      status: 'met',
      label: 'Mood disorder with psychotic features (most likely)',
      summary: 'Without a ≥2-week period of psychosis in the absence of mood symptoms, schizoaffective disorder cannot be diagnosed.',
      reasons,
    }
  }

  if (coreCount === 0) {
    reasons.push({ ok: false, text: 'No delusions, hallucinations or disorganized speech — at least one is required for any of these diagnoses' })
    return { status: 'not-met', label: 'Primary psychotic disorder criteria not met', summary: 'Catatonia or negative symptoms alone: consider catatonia (any cause), depression, or medical causes.', reasons }
  }

  // Delusional disorder: delusions only, ≥1 month, criterion A otherwise not met, function preserved
  if (count === 1 && set.has('delusions') && input.activeDays >= 30 && !input.functionalDecline) {
    return {
      status: 'met',
      label: 'Delusional disorder',
      summary: 'One or more delusions ≥1 month, schizophrenia criterion A never met, and functioning not markedly impaired apart from the delusion’s impact.',
      reasons: [
        { ok: true, text: 'Delusions only' },
        { ok: true, text: `Duration ${input.activeDays} day(s) ≥1 month` },
        { ok: true, text: 'No marked functional decline' },
      ],
      next: workup,
    }
  }

  const schizA = count >= 2 && coreCount >= 1
  reasons.push({ ok: schizA, text: `${count} criterion A symptom(s), ${coreCount} core (schizophrenia/schizophreniform need ≥2, at least 1 core)` })

  if (total < 1) {
    return { status: 'not-met', label: 'Too brief to classify', summary: 'Symptoms lasting under a day: reassess; consider intoxication or delirium.', reasons }
  }

  if (total < 30) {
    reasons.push({ ok: true, text: `Duration ${total} day(s): ≥1 day and <1 month` })
    reasons.push({ ok: input.returnedToBaseline, text: input.returnedToBaseline ? 'Full return to premorbid functioning' : 'Not (yet) returned to baseline — provisional' })
    return {
      status: input.returnedToBaseline ? 'met' : 'partial',
      label: input.returnedToBaseline ? 'Brief psychotic disorder' : 'Brief psychotic disorder (provisional)',
      summary: 'Requires ≥1 of delusions, hallucinations or disorganized speech for ≥1 day but <1 month with full return to baseline. Specify with marked stressor(s) or with postpartum onset (within 4 weeks of delivery).',
      reasons,
      next: workup,
    }
  }

  if (!schizA) {
    return {
      status: 'partial',
      label: 'Other specified/unspecified schizophrenia spectrum disorder',
      summary: 'Psychosis ≥1 month without enough criterion A symptoms for schizophreniform/schizophrenia (e.g. persistent hallucinations only).',
      reasons,
      next: workup,
    }
  }

  if (total < 180) {
    reasons.push({ ok: true, text: `Duration ${total} day(s): ≥1 month and <6 months` })
    return {
      status: 'met',
      label: 'Schizophreniform disorder',
      summary: 'Same symptom criteria as schizophrenia, lasting 1–6 months. Functional decline is not required. Label “provisional” if the person has not yet recovered. About two-thirds progress to schizophrenia or schizoaffective disorder.',
      reasons,
      next: workup,
    }
  }

  const activeOk = input.activeDays >= 30
  reasons.push({ ok: activeOk, text: `Total ${total} day(s) ≥6 months; active phase ${input.activeDays} day(s) (need ≥1 month, less if successfully treated)` })
  reasons.push({ ok: input.functionalDecline, text: input.functionalDecline ? 'Marked decline in work, relationships or self-care' : 'No functional decline (required for schizophrenia)' })
  if (activeOk && input.functionalDecline) {
    return {
      status: 'met',
      label: 'Schizophrenia',
      summary: 'Continuous signs ≥6 months including ≥1 month of active-phase symptoms, with functional decline; mood episodes absent or present for only a minority of the illness.',
      reasons,
      next: ['Offer an antipsychotic chosen by side-effect profile plus coordinated specialty care (first episode); clozapine after 2 failed adequate trials or for persistent suicidality.', ...workup],
    }
  }
  return {
    status: 'partial',
    label: 'Schizophrenia criteria incompletely met',
    summary: 'Duration fits schizophrenia but the active-phase or functional-decline requirement is missing — recheck history and collateral.',
    reasons,
  }
}

/* ------------------------------------------------------------------ */
/* PTSD / acute stress disorder                                        */
/* ------------------------------------------------------------------ */

export const PTSD_CLUSTERS = {
  B: {
    name: 'Intrusion',
    need: 1,
    items: [
      { id: 'memories', label: 'Recurrent, involuntary, intrusive distressing memories', asd: true },
      { id: 'dreams', label: 'Distressing dreams related to the event', asd: true },
      { id: 'flashbacks', label: 'Flashbacks (dissociative reliving)', asd: true },
      { id: 'cueDistress', label: 'Intense psychological distress at reminders', asd: true },
      { id: 'cuePhysio', label: 'Marked physiological reactions to reminders', asd: true },
    ],
  },
  C: {
    name: 'Avoidance',
    need: 1,
    items: [
      { id: 'avoidInternal', label: 'Avoids memories, thoughts or feelings about the event', asd: true },
      { id: 'avoidExternal', label: 'Avoids people, places, conversations, activities, objects', asd: true },
    ],
  },
  D: {
    name: 'Negative cognition & mood',
    need: 2,
    items: [
      { id: 'amnesia', label: 'Inability to recall an important aspect (dissociative amnesia)', asd: true },
      { id: 'beliefs', label: 'Persistent exaggerated negative beliefs about self, others, world', asd: false },
      { id: 'blame', label: 'Distorted blame of self or others', asd: false },
      { id: 'negState', label: 'Persistent negative emotional state (fear, horror, anger, guilt, shame)', asd: false },
      { id: 'interest', label: 'Markedly diminished interest in activities', asd: false },
      { id: 'detached', label: 'Feeling detached or estranged from others', asd: false },
      { id: 'noPositive', label: 'Persistent inability to experience positive emotions', asd: true },
    ],
  },
  E: {
    name: 'Arousal & reactivity',
    need: 2,
    items: [
      { id: 'irritable', label: 'Irritable behavior and angry outbursts', asd: true },
      { id: 'reckless', label: 'Reckless or self-destructive behavior', asd: false },
      { id: 'hypervigilance', label: 'Hypervigilance', asd: true },
      { id: 'startle', label: 'Exaggerated startle response', asd: true },
      { id: 'concentration', label: 'Problems with concentration', asd: true },
      { id: 'sleep', label: 'Sleep disturbance', asd: true },
    ],
  },
} as const

export type ClusterKey = keyof typeof PTSD_CLUSTERS

export const EXPOSURES = [
  { id: 'direct', label: 'Directly experienced (actual/threatened death, serious injury, sexual violence)', qualifies: true },
  { id: 'witnessed', label: 'Witnessed it happen to others, in person', qualifies: true },
  { id: 'learned', label: 'Learned it happened to a close family member/friend (violent or accidental if death)', qualifies: true },
  { id: 'professional', label: 'Repeated/extreme exposure to aversive details (e.g. first responders, child-abuse investigators)', qualifies: true },
  { id: 'media', label: 'Exposure only through TV, movies or pictures (not work-related)', qualifies: false },
  { id: 'stressor', label: 'Non-traumatic stressor (divorce, job loss, illness diagnosis without threat to life)', qualifies: false },
] as const

export interface PtsdInput {
  exposure: string | null
  symptoms: string[]
  /** Derealization/depersonalization (ASD dissociative item; PTSD dissociative subtype). */
  dissociation: boolean
  daysSinceTrauma: number
  impairment: boolean
  substanceOrMedical: boolean
  delayedOnset: boolean
}

export function clusterCounts(symptoms: string[]): Record<ClusterKey, number> {
  const set = new Set(symptoms)
  return (Object.keys(PTSD_CLUSTERS) as ClusterKey[]).reduce(
    (acc, key) => {
      acc[key] = PTSD_CLUSTERS[key].items.filter((i) => set.has(i.id)).length
      return acc
    },
    { B: 0, C: 0, D: 0, E: 0 } as Record<ClusterKey, number>,
  )
}

export function asdCount(symptoms: string[], dissociation: boolean): number {
  const set = new Set(symptoms)
  const ids = (Object.keys(PTSD_CLUSTERS) as ClusterKey[]).flatMap((k) => PTSD_CLUSTERS[k].items.filter((i) => i.asd).map((i) => i.id))
  // ASD merges psychological distress and physiological reactions to cues into one item.
  let count = ids.filter((id) => set.has(id) && id !== 'cuePhysio' && id !== 'cueDistress').length
  if (set.has('cueDistress') || set.has('cuePhysio')) count += 1
  if (dissociation) count += 1
  return count
}

export function evaluatePtsd(input: PtsdInput): Verdict {
  const exposure = EXPOSURES.find((e) => e.id === input.exposure)
  const counts = clusterCounts(input.symptoms)
  const reasons: Reason[] = []

  reasons.push({
    ok: Boolean(exposure?.qualifies),
    text: !exposure ? 'Criterion A: exposure not specified' : exposure.qualifies ? 'Criterion A: qualifying traumatic exposure' : 'Criterion A: NOT a qualifying exposure',
  })

  if (!exposure) {
    return {
      status: 'not-met',
      label: 'Start with criterion A',
      summary: 'Select how the person was exposed. PTSD and acute stress disorder require a qualifying traumatic exposure.',
      reasons,
    }
  }

  if (!exposure.qualifies) {
    const anySymptoms = input.symptoms.length > 0
    return {
      status: anySymptoms ? 'partial' : 'not-met',
      label: 'PTSD/ASD excluded (criterion A not met)',
      summary: anySymptoms
        ? 'Symptoms after a non-qualifying stressor: consider adjustment disorder (onset within 3 months of the stressor), MDD, GAD, or other specified trauma- and stressor-related disorder.'
        : 'Specify the exposure and symptoms.',
      reasons,
    }
  }

  ;(Object.keys(PTSD_CLUSTERS) as ClusterKey[]).forEach((k) => {
    const c = PTSD_CLUSTERS[k]
    reasons.push({ ok: counts[k] >= c.need, text: `Cluster ${k} (${c.name}): ${counts[k]} of ${c.items.length} (need ≥${c.need})` })
  })
  reasons.push({ ok: input.impairment, text: input.impairment ? 'Clinically significant distress/impairment' : 'No significant distress/impairment' })
  reasons.push({ ok: !input.substanceOrMedical, text: input.substanceOrMedical ? 'Attributable to substance/medical condition' : 'Not attributable to substance/medical condition' })

  const symptomCriteria = (Object.keys(PTSD_CLUSTERS) as ClusterKey[]).every((k) => counts[k] >= PTSD_CLUSTERS[k].need)
  const days = input.daysSinceTrauma

  if (days < 3) {
    return {
      status: 'partial',
      label: 'Too early for ASD or PTSD',
      summary: 'Distress in the first 72 h is expected. Provide psychological first aid, practical support and safety; do NOT use single-session debriefing (can increase PTSD risk). Reassess.',
      reasons: [...reasons, { ok: false, text: `${days} day(s) since trauma — ASD requires symptoms from day 3` }],
    }
  }

  if (days <= 30) {
    const n = asdCount(input.symptoms, input.dissociation)
    reasons.push({ ok: n >= 9, text: `Acute stress disorder: ${n} of 14 symptoms (need ≥9), 3 days–1 month after trauma` })
    const ok = n >= 9 && input.impairment && !input.substanceOrMedical
    return {
      status: ok ? 'met' : 'partial',
      label: ok ? 'Acute stress disorder' : 'Acute stress reaction, sub-threshold for ASD',
      summary: ok
        ? 'ASD is diagnosed 3 days to 1 month after trauma. Trauma-focused CBT in this window reduces progression to PTSD. ASD is an imperfect predictor: about half of people who develop PTSD never had ASD first.'
        : 'Monitor; offer trauma-focused CBT if symptoms persist or are impairing. PTSD cannot be diagnosed until symptoms last >1 month.',
      reasons,
    }
  }

  reasons.push({ ok: true, text: `Duration >1 month (${days} days since trauma)` })
  const meets = symptomCriteria && input.impairment && !input.substanceOrMedical
  if (!meets) {
    return {
      status: 'partial',
      label: 'PTSD criteria not fully met',
      summary: 'Consider other specified trauma- and stressor-related disorder (sub-threshold PTSD), adjustment disorder, MDD, or prolonged grief disorder (≥12 months after a death).',
      reasons,
    }
  }
  const specifiers = [input.dissociation && 'with dissociative symptoms', input.delayedOnset && 'with delayed expression'].filter(Boolean)
  return {
    status: 'met',
    label: `PTSD${specifiers.length ? ` — ${specifiers.join(', ')}` : ''}`,
    summary: 'First-line: trauma-focused psychotherapy (CPT, PE, cognitive therapy for PTSD; EMDR also supported). Medication option: sertraline, paroxetine, fluoxetine or venlafaxine. Avoid benzodiazepines.',
    reasons,
    next: ['Screen for depression, substance use and suicidality; ask about ongoing threats (e.g. intimate partner violence).'],
  }
}

/* ------------------------------------------------------------------ */
/* ADHD                                                                */
/* ------------------------------------------------------------------ */

export const INATTENTION = [
  { id: 'careless', label: 'Fails to give close attention to details / careless mistakes' },
  { id: 'sustain', label: 'Difficulty sustaining attention in tasks or play' },
  { id: 'listen', label: 'Does not seem to listen when spoken to directly' },
  { id: 'follow', label: 'Does not follow through on instructions; fails to finish tasks' },
  { id: 'organize', label: 'Difficulty organizing tasks and activities' },
  { id: 'avoid', label: 'Avoids or dislikes tasks requiring sustained mental effort' },
  { id: 'loses', label: 'Loses things necessary for tasks' },
  { id: 'distracted', label: 'Easily distracted by extraneous stimuli (or unrelated thoughts in adults)' },
  { id: 'forgetful', label: 'Forgetful in daily activities' },
] as const

export const HYPERACTIVITY = [
  { id: 'fidgets', label: 'Fidgets, taps hands or feet, squirms' },
  { id: 'seat', label: 'Leaves seat when remaining seated is expected' },
  { id: 'runs', label: 'Runs or climbs inappropriately (adults: feels restless)' },
  { id: 'quiet', label: 'Unable to play or do leisure activities quietly' },
  { id: 'motor', label: '“On the go”, acts as if “driven by a motor”' },
  { id: 'talks', label: 'Talks excessively' },
  { id: 'blurts', label: 'Blurts out answers before questions are completed' },
  { id: 'waiting', label: 'Difficulty waiting their turn' },
  { id: 'interrupts', label: 'Interrupts or intrudes on others' },
] as const

export interface AdhdInput {
  age: number
  inattention: string[]
  hyperactivity: string[]
  sixMonths: boolean
  onsetBefore12: boolean
  twoSettings: boolean
  impairment: boolean
  betterExplained: boolean
}

export function adhdThreshold(age: number): number {
  return age >= 17 ? 5 : 6
}

export function evaluateAdhd(input: AdhdInput): Verdict {
  const t = adhdThreshold(input.age)
  const ia = INATTENTION.filter((s) => input.inattention.includes(s.id)).length
  const hi = HYPERACTIVITY.filter((s) => input.hyperactivity.includes(s.id)).length
  const iaMet = ia >= t
  const hiMet = hi >= t
  const reasons: Reason[] = [
    { ok: iaMet, text: `Inattention: ${ia}/9 (need ≥${t} at age ${input.age})` },
    { ok: hiMet, text: `Hyperactivity-impulsivity: ${hi}/9 (need ≥${t} at age ${input.age})` },
    { ok: input.sixMonths, text: 'Symptoms persist ≥6 months, inconsistent with developmental level' },
    { ok: input.onsetBefore12, text: 'Several symptoms present before age 12' },
    { ok: input.twoSettings, text: 'Several symptoms in ≥2 settings (home, school/work, social)' },
    { ok: input.impairment, text: 'Clear interference with social, academic or occupational functioning' },
    { ok: !input.betterExplained, text: input.betterExplained ? 'Better explained by another condition (anxiety, depression, sleep, substance, trauma…)' : 'Not better explained by another condition' },
  ]
  if (!iaMet && !hiMet) {
    return {
      status: ia + hi > 0 ? 'partial' : 'not-met',
      label: 'Symptom threshold not met',
      summary: 'Fewer symptoms than required in both domains. Consider other specified ADHD if impairing, or alternative explanations.',
      reasons,
    }
  }
  const presentation = iaMet && hiMet ? 'combined presentation' : iaMet ? 'predominantly inattentive presentation' : 'predominantly hyperactive-impulsive presentation'
  const contextOk = input.sixMonths && input.onsetBefore12 && input.twoSettings && input.impairment && !input.betterExplained
  if (!contextOk) {
    return {
      status: 'partial',
      label: `Symptom count fits ${presentation}, but criteria are incomplete`,
      summary:
        'Symptom counts alone never make the diagnosis. Missing duration, childhood onset, pervasiveness or impairment — or a better explanation — means ADHD is not established. Seek collateral (school reports, family) and screen for mimics.',
      reasons,
    }
  }
  return {
    status: 'met',
    label: `ADHD — ${presentation}`,
    summary: 'Presentation can shift over time; record current presentation and severity (mild/moderate/severe).',
    reasons,
    next: [
      input.age < 6
        ? 'Age 4–5: parent training in behavior management first; methylphenidate if insufficient. Prefer immediate-release: FDA 2025 labeling warns extended-release stimulants under age 6 cause higher drug exposure, more adverse effects and weight loss.'
        : input.age < 18
          ? 'School-age: FDA-approved medication (stimulant first) plus behavioral parent training and school supports (IEP/504).'
          : 'Adults: stimulants are first-line (amphetamines and methylphenidate); non-stimulants (atomoxetine, viloxazine) if contraindicated, misuse risk, or intolerance.',
      'Before stimulants: BP/HR, height/weight, cardiac history and family history of sudden death; ECG only if indicated.',
    ],
  }
}
