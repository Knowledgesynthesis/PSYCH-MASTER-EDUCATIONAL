/**
 * Validated rating scales. Items, anchors and cut-offs follow the source
 * instruments (all public domain or free for clinical/educational use).
 */

export interface ScaleChoice {
  points: number
  label: string
}

export interface ScaleItem {
  id: string
  text: string
  choices: ScaleChoice[]
  hint?: string
}

export interface ScaleBand {
  min: number
  max: number
  label: string
  tone: 'success' | 'info' | 'warning' | 'danger'
  action: string
}

export interface ScaleFlag {
  /** Returns a message when the flag applies. */
  test: (answers: Record<string, number>, total: number) => string | null
}

export interface Scale {
  id: string
  name: string
  short: string
  purpose: string
  timeframe?: string
  items: ScaleItem[]
  bands: ScaleBand[]
  flags?: ScaleFlag[]
  /** Optional variant-specific interpretation (e.g. AUDIT-C by sex). */
  interpretNote?: string
  source: string
  /** Checklist scales count positive items instead of summing points. */
  mode?: 'sum' | 'count'
}

const frequency4 = (labels = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']): ScaleChoice[] =>
  labels.map((label, points) => ({ points, label }))

export const PHQ9: Scale = {
  id: 'phq9',
  name: 'Patient Health Questionnaire-9',
  short: 'PHQ-9',
  purpose: 'Screen for and track severity of depression. A screen, not a diagnosis — confirm with a clinical interview.',
  timeframe: 'Over the last 2 weeks, how often have you been bothered by…',
  items: [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead, or of hurting yourself in some way',
  ].map((text, i) => ({ id: `q${i + 1}`, text, choices: frequency4() })),
  bands: [
    { min: 0, max: 4, label: 'Minimal', tone: 'success', action: 'Usually no treatment; rescreen if concern persists.' },
    { min: 5, max: 9, label: 'Mild', tone: 'info', action: 'Watchful waiting, psychoeducation, behavioral activation; repeat PHQ-9 at follow-up.' },
    { min: 10, max: 14, label: 'Moderate', tone: 'warning', action: 'Confirm MDD by interview; offer psychotherapy and/or antidepressant.' },
    { min: 15, max: 19, label: 'Moderately severe', tone: 'warning', action: 'Active treatment: antidepressant and/or psychotherapy; close follow-up.' },
    { min: 20, max: 27, label: 'Severe', tone: 'danger', action: 'Prompt treatment (antidepressant ± psychotherapy); consider specialist referral; assess safety and psychosis.' },
  ],
  flags: [
    {
      test: (a) =>
        (a.q9 ?? 0) > 0
          ? 'Item 9 is positive: complete a direct suicide risk assessment today (ideation, intent, plan, preparatory behavior, prior attempts, access to means). Item 9 alone over-identifies risk but must never be ignored.'
          : null,
    },
    {
      test: (a) =>
        a.q1 !== undefined && a.q2 !== undefined && a.q1 < 2 && a.q2 < 2
          ? 'Neither core item (1 or 2) is endorsed "more than half the days" — DSM-5-TR MDD requires depressed mood or anhedonia.'
          : null,
    },
  ],
  interpretNote: 'Cut-off ≥10: sensitivity ~88%, specificity ~85% for major depression (Levis 2019 IPD meta-analysis). Response = ≥50% reduction; remission = score <5.',
  source: 'Kroenke K, Spitzer RL, Williams JB. J Gen Intern Med 2001; Levis B et al. BMJ 2019 (individual participant data meta-analysis).',
}

export const GAD7: Scale = {
  id: 'gad7',
  name: 'Generalized Anxiety Disorder-7',
  short: 'GAD-7',
  purpose: 'Screen for and track generalized anxiety; also reasonably sensitive for panic, social anxiety and PTSD.',
  timeframe: 'Over the last 2 weeks, how often have you been bothered by…',
  items: [
    'Feeling nervous, anxious, or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it is hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid, as if something awful might happen',
  ].map((text, i) => ({ id: `q${i + 1}`, text, choices: frequency4() })),
  bands: [
    { min: 0, max: 4, label: 'Minimal', tone: 'success', action: 'No action beyond reassurance unless function is impaired.' },
    { min: 5, max: 9, label: 'Mild', tone: 'info', action: 'Psychoeducation, guided self-help, monitor.' },
    { min: 10, max: 14, label: 'Moderate', tone: 'warning', action: 'Clinical interview to confirm diagnosis; offer CBT and/or SSRI/SNRI.' },
    { min: 15, max: 21, label: 'Severe', tone: 'danger', action: 'Active treatment (CBT and/or SSRI/SNRI); screen for depression, substance use and suicidality.' },
  ],
  interpretNote: 'Cut-off ≥10: sensitivity ~89%, specificity ~82% for GAD (original validation).',
  source: 'Spitzer RL, Kroenke K, Williams JB, Löwe B. Arch Intern Med 2006.',
}

export const AUDITC: Scale = {
  id: 'auditc',
  name: 'AUDIT-C (Alcohol Use Disorders Identification Test — Consumption)',
  short: 'AUDIT-C',
  purpose: 'Three-item screen for unhealthy alcohol use. 1 standard US drink = 14 g alcohol (12 oz beer, 5 oz wine, 1.5 oz spirits).',
  items: [
    {
      id: 'q1',
      text: 'How often do you have a drink containing alcohol?',
      choices: ['Never', 'Monthly or less', '2–4 times a month', '2–3 times a week', '4 or more times a week'].map((label, points) => ({ points, label })),
    },
    {
      id: 'q2',
      text: 'How many standard drinks do you have on a typical day when you are drinking?',
      choices: ['1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more'].map((label, points) => ({ points, label })),
    },
    {
      id: 'q3',
      text: 'How often do you have 6 or more drinks on one occasion?',
      choices: ['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'].map((label, points) => ({ points, label })),
    },
  ],
  bands: [
    { min: 0, max: 2, label: 'Negative (both sexes)', tone: 'success', action: 'Reinforce low-risk drinking.' },
    { min: 3, max: 3, label: 'Positive for women; negative for men', tone: 'warning', action: 'Women: brief intervention and assess for AUD. Men: below cut-off.' },
    { min: 4, max: 7, label: 'Positive', tone: 'warning', action: 'Brief intervention; assess DSM-5-TR AUD criteria and withdrawal risk.' },
    { min: 8, max: 12, label: 'Positive — high risk', tone: 'danger', action: 'Scores ≥8 correlate with likely AUD and higher withdrawal risk; full assessment and offer pharmacotherapy.' },
  ],
  interpretNote: 'Positive: ≥4 in men, ≥3 in women. Higher scores track higher risk of alcohol-related harm.',
  source: 'Bush K et al. Arch Intern Med 1998; Bradley KA et al. Alcohol Clin Exp Res 2007.',
}

const ciwa07 = (anchors: Record<number, string>): ScaleChoice[] =>
  Array.from({ length: 8 }, (_, points) => ({ points, label: anchors[points] ?? `${points}` }))

const perceptual = (sense: string): Record<number, string> => ({
  0: 'Not present',
  1: `Very mild ${sense}`,
  2: `Mild ${sense}`,
  3: `Moderate ${sense}`,
  4: 'Moderately severe hallucinations',
  5: 'Severe hallucinations',
  6: 'Extremely severe hallucinations',
  7: 'Continuous hallucinations',
})

export const CIWA: Scale = {
  id: 'ciwa',
  name: 'Clinical Institute Withdrawal Assessment for Alcohol, revised',
  short: 'CIWA-Ar',
  purpose:
    'Quantify alcohol withdrawal severity to guide symptom-triggered treatment. Requires a patient who can communicate; not valid for diagnosis (anxiety, sepsis or thyrotoxicosis also raise scores).',
  items: [
    { id: 'nausea', text: 'Nausea and vomiting', choices: ciwa07({ 0: 'No nausea, no vomiting', 1: 'Mild nausea, no vomiting', 4: 'Intermittent nausea with dry heaves', 7: 'Constant nausea, frequent dry heaves and vomiting' }) },
    { id: 'tremor', text: 'Tremor (arms extended, fingers spread)', choices: ciwa07({ 0: 'No tremor', 1: 'Not visible, but can be felt fingertip to fingertip', 4: 'Moderate, with arms extended', 7: 'Severe, even with arms not extended' }) },
    { id: 'sweats', text: 'Paroxysmal sweats', choices: ciwa07({ 0: 'No sweat visible', 1: 'Barely perceptible sweating, palms moist', 4: 'Beads of sweat obvious on forehead', 7: 'Drenching sweats' }) },
    { id: 'anxiety', text: 'Anxiety', choices: ciwa07({ 0: 'No anxiety, at ease', 1: 'Mildly anxious', 4: 'Moderately anxious or guarded', 7: 'Equivalent to acute panic states' }) },
    { id: 'agitation', text: 'Agitation', choices: ciwa07({ 0: 'Normal activity', 1: 'Somewhat more than normal activity', 4: 'Moderately fidgety and restless', 7: 'Paces or constantly thrashes about' }) },
    { id: 'tactile', text: 'Tactile disturbances (itching, pins and needles, burning, numbness, bugs crawling)', choices: ciwa07(perceptual('disturbance')) },
    { id: 'auditory', text: 'Auditory disturbances (harshness or loudness of sounds, hearing things)', choices: ciwa07(perceptual('harshness or ability to frighten')) },
    { id: 'visual', text: 'Visual disturbances (light too bright, different colour, seeing things)', choices: ciwa07(perceptual('sensitivity')) },
    { id: 'headache', text: 'Headache, fullness in head', choices: ciwa07({ 0: 'Not present', 1: 'Very mild', 2: 'Mild', 3: 'Moderate', 4: 'Moderately severe', 5: 'Severe', 6: 'Very severe', 7: 'Extremely severe' }) },
    {
      id: 'orientation',
      text: 'Orientation and clouding of sensorium',
      choices: [
        { points: 0, label: 'Oriented and can do serial additions' },
        { points: 1, label: 'Cannot do serial additions or uncertain about date' },
        { points: 2, label: 'Disoriented for date by ≤2 calendar days' },
        { points: 3, label: 'Disoriented for date by >2 calendar days' },
        { points: 4, label: 'Disoriented for place and/or person' },
      ],
    },
  ],
  bands: [
    { min: 0, max: 9, label: 'Mild withdrawal', tone: 'success', action: 'Supportive care; medication may not be needed if low risk of complicated withdrawal (no prior seizures/DTs). Reassess.' },
    { min: 10, max: 18, label: 'Moderate withdrawal', tone: 'warning', action: 'Pharmacotherapy indicated: benzodiazepine first-line (carbamazepine or gabapentin are alternatives for low-risk patients). Thiamine.' },
    { min: 19, max: 67, label: 'Severe withdrawal', tone: 'danger', action: 'Inpatient management with frequent reassessment; benzodiazepine or phenobarbital; escalate to ICU if refractory, delirium or seizures.' },
  ],
  flags: [
    {
      test: (a) =>
        (a.orientation ?? 0) >= 2
          ? 'Disorientation suggests delirium (possible DTs, Wernicke encephalopathy, head injury, infection, hepatic encephalopathy). CIWA-Ar is not reliable once the patient is delirious — manage as complicated withdrawal and search for other causes.'
          : null,
    },
    {
      test: (a) =>
        Math.max(a.tactile ?? 0, a.auditory ?? 0, a.visual ?? 0) >= 4
          ? 'Hallucinations present. With clear sensorium this may be alcohol hallucinosis (12–48 h); with confusion consider delirium tremens.'
          : null,
    },
  ],
  interpretNote: 'Severity bands follow the ASAM 2020 Alcohol Withdrawal Management guideline (<10 mild, 10–18 moderate, ≥19 severe). Risk of complicated withdrawal (prior DTs/seizures, PAWSS ≥4) matters as much as the current score.',
  source: 'Sullivan JT et al. Br J Addict 1989; ASAM Clinical Practice Guideline on Alcohol Withdrawal Management, 2020.',
}

const cowsChoices = (pairs: [number, string][]): ScaleChoice[] => pairs.map(([points, label]) => ({ points, label }))

export const COWS: Scale = {
  id: 'cows',
  name: 'Clinical Opiate Withdrawal Scale',
  short: 'COWS',
  purpose: 'Quantify opioid withdrawal; used to time buprenorphine initiation and titrate symptomatic treatment.',
  items: [
    { id: 'pulse', text: 'Resting pulse rate (after sitting 1 minute)', choices: cowsChoices([[0, '≤80'], [1, '81–100'], [2, '101–120'], [4, '>120']]) },
    { id: 'sweating', text: 'Sweating (past ½ hour, not due to room temperature or activity)', choices: cowsChoices([[0, 'No report of chills or flushing'], [1, 'Subjective chills or flushing'], [2, 'Flushed or observable moistness on face'], [3, 'Beads of sweat on brow or face'], [4, 'Sweat streaming off face']]) },
    { id: 'restlessness', text: 'Restlessness (observed during assessment)', choices: cowsChoices([[0, 'Able to sit still'], [1, 'Reports difficulty sitting still, but is able to'], [3, 'Frequent shifting or extraneous movements'], [5, 'Unable to sit still for more than a few seconds']]) },
    { id: 'pupils', text: 'Pupil size', choices: cowsChoices([[0, 'Pinned or normal for room light'], [1, 'Possibly larger than normal'], [2, 'Moderately dilated'], [5, 'So dilated only the rim of the iris is visible']]) },
    { id: 'aches', text: 'Bone or joint aches (new, attributable to withdrawal)', choices: cowsChoices([[0, 'Not present'], [1, 'Mild diffuse discomfort'], [2, 'Reports severe diffuse aching'], [4, 'Rubbing joints/muscles, unable to sit still']]) },
    { id: 'nose', text: 'Runny nose or tearing (not due to cold or allergy)', choices: cowsChoices([[0, 'Not present'], [1, 'Nasal stuffiness or unusually moist eyes'], [2, 'Nose running or tearing'], [4, 'Nose constantly running or tears streaming']]) },
    { id: 'gi', text: 'GI upset (past ½ hour)', choices: cowsChoices([[0, 'No GI symptoms'], [1, 'Stomach cramps'], [2, 'Nausea or loose stool'], [3, 'Vomiting or diarrhea'], [5, 'Multiple episodes of diarrhea or vomiting']]) },
    { id: 'tremor', text: 'Tremor (outstretched hands)', choices: cowsChoices([[0, 'No tremor'], [1, 'Can be felt, not observed'], [2, 'Slight tremor observable'], [4, 'Gross tremor or muscle twitching']]) },
    { id: 'yawning', text: 'Yawning (during assessment)', choices: cowsChoices([[0, 'No yawning'], [1, 'Once or twice'], [2, 'Three or more times'], [4, 'Several times per minute']]) },
    { id: 'anxiety', text: 'Anxiety or irritability', choices: cowsChoices([[0, 'None'], [1, 'Reports increasing irritability or anxiousness'], [2, 'Obviously irritable or anxious'], [4, 'So irritable/anxious that participation is difficult']]) },
    { id: 'gooseflesh', text: 'Gooseflesh skin', choices: cowsChoices([[0, 'Skin is smooth'], [3, 'Piloerection can be felt or hairs standing up on arms'], [5, 'Prominent piloerection']]) },
  ],
  bands: [
    { min: 0, max: 4, label: 'No active withdrawal', tone: 'success', action: 'Too early for standard buprenorphine initiation (risk of precipitated withdrawal), unless using a low-dose overlapping start.' },
    { min: 5, max: 12, label: 'Mild', tone: 'info', action: 'Many protocols start buprenorphine at COWS ≥8–12; earlier for short-acting opioids, later for fentanyl or methadone.' },
    { min: 13, max: 24, label: 'Moderate', tone: 'warning', action: 'Appropriate window for standard buprenorphine initiation. Symptomatic adjuncts as needed.' },
    { min: 25, max: 36, label: 'Moderately severe', tone: 'danger', action: 'Treat promptly (buprenorphine or methadone). Check fluids/electrolytes if vomiting or diarrhea.' },
    { min: 37, max: 48, label: 'Severe', tone: 'danger', action: 'Treat promptly; consider dehydration, co-occurring alcohol/benzodiazepine withdrawal, or adulterants (e.g. medetomidine) if refractory.' },
  ],
  interpretNote: 'Opioid withdrawal does not cause delirium or seizures — if present, look for another cause (alcohol/benzodiazepine withdrawal, hypoxic injury, infection).',
  source: 'Wesson DR, Ling W. J Psychoactive Drugs 2003.',
}

const present = (label = 'Present'): ScaleChoice[] => [
  { points: 0, label: 'Absent' },
  { points: 1, label },
]

export const BFCRS: Scale = {
  id: 'bfcrs',
  name: 'Bush–Francis Catatonia Screening Instrument (items 1–14)',
  short: 'BFCSI',
  purpose: 'Screen for catatonia. Two or more positive items = positive screen; then rate severity with the full 23-item BFCRS and consider a lorazepam challenge.',
  mode: 'count',
  items: [
    ['excitement', 'Excitement — extreme hyperactivity, constant motor unrest that is non-purposeful'],
    ['immobility', 'Immobility / stupor — extreme hypoactivity, minimal response to stimuli'],
    ['mutism', 'Mutism — verbally unresponsive or minimally responsive'],
    ['staring', 'Staring — fixed gaze, little visual scanning, decreased blinking'],
    ['posturing', 'Posturing / catalepsy — maintains postures, including mundane ones, for long periods'],
    ['grimacing', 'Grimacing — maintenance of odd facial expressions'],
    ['echo', 'Echopraxia / echolalia — mimics examiner movements or speech'],
    ['stereotypy', 'Stereotypy — repetitive, non-goal-directed motor activity'],
    ['mannerisms', 'Mannerisms — odd, purposeful movements (e.g. hopping, walking on tiptoe)'],
    ['verbigeration', 'Verbigeration — repetition of phrases or sentences'],
    ['rigidity', 'Rigidity — maintains rigid position despite efforts to be moved'],
    ['negativism', 'Negativism — apparently motiveless resistance to instructions or movement'],
    ['waxy', 'Waxy flexibility — initial resistance, then allows repositioning (like bending a candle)'],
    ['withdrawal', 'Withdrawal — refuses to eat, drink or make eye contact'],
  ].map(([id, text]) => ({ id, text, choices: present() })),
  bands: [
    { min: 0, max: 1, label: 'Screen negative', tone: 'success', action: 'Catatonia unlikely; re-examine if presentation changes (signs fluctuate).' },
    { min: 2, max: 14, label: 'Screen positive', tone: 'danger', action: 'Treat as catatonia: check vitals/CK for malignant catatonia/NMS, hold antipsychotics, medical workup, lorazepam challenge; ECT if no response.' },
  ],
  interpretNote: 'DSM-5-TR catatonia requires ≥3 of 12 specified features; the BFCSI is a sensitive screen with a lower threshold.',
  source: 'Bush G, Fink M, Petrides G, Dowling F, Francis A. Acta Psychiatr Scand 1996.',
}

export const FOURAT: Scale = {
  id: 'fourat',
  name: '4AT rapid delirium assessment',
  short: '4AT',
  purpose: 'Rapid (<2 min) delirium screen usable in drowsy or agitated patients; no training required.',
  items: [
    {
      id: 'alertness',
      text: 'Alertness (drowsy, hard to rouse, or agitated/hyperactive during assessment?)',
      choices: [
        { points: 0, label: 'Normal (fully alert, not agitated)' },
        { points: 0, label: 'Mild sleepiness <10 s after waking, then normal' },
        { points: 4, label: 'Clearly abnormal' },
      ],
    },
    {
      id: 'amt4',
      text: 'AMT4 — age, date of birth, place (hospital/building), current year',
      choices: [
        { points: 0, label: 'No mistakes' },
        { points: 1, label: '1 mistake' },
        { points: 2, label: '≥2 mistakes or untestable' },
      ],
    },
    {
      id: 'attention',
      text: 'Attention — months of the year backwards, starting at December',
      choices: [
        { points: 0, label: 'Achieves ≥7 months correctly' },
        { points: 1, label: 'Starts but scores <7 months, or refuses' },
        { points: 2, label: 'Untestable (cannot start: unwell, drowsy, inattentive)' },
      ],
    },
    {
      id: 'acute',
      text: 'Acute change or fluctuating course (alertness, cognition, other mental function) over the last 2 weeks and still evident in last 24 h',
      choices: [
        { points: 0, label: 'No' },
        { points: 4, label: 'Yes' },
      ],
    },
  ],
  bands: [
    { min: 0, max: 0, label: 'Delirium or severe cognitive impairment unlikely', tone: 'success', action: 'Delirium still possible if acute-change information is incomplete.' },
    { min: 1, max: 3, label: 'Possible cognitive impairment', tone: 'warning', action: 'More detailed cognitive testing and collateral history.' },
    { min: 4, max: 12, label: 'Possible delirium ± cognitive impairment', tone: 'danger', action: 'Clinical assessment for delirium; search for and treat causes (infection, drugs, metabolic, withdrawal, retention, pain, hypoxia).' },
  ],
  interpretNote: 'Pooled sensitivity ~88% and specificity ~88% for delirium (Tieges 2021 meta-analysis).',
  source: 'Bellelli G et al. Age Ageing 2014; Tieges Z et al. Age Ageing 2021.',
}

export const SCALES: Record<string, Scale> = {
  phq9: PHQ9,
  gad7: GAD7,
  auditc: AUDITC,
  ciwa: CIWA,
  cows: COWS,
  bfcrs: BFCRS,
  fourat: FOURAT,
}

export interface ScaleResult {
  total: number
  max: number
  complete: boolean
  answered: number
  band: ScaleBand | null
  flags: string[]
}

export function scaleMax(scale: Scale): number {
  if (scale.mode === 'count') return scale.items.length
  return scale.items.reduce((sum, item) => sum + Math.max(...item.choices.map((c) => c.points)), 0)
}

/** answers maps itemId → index of chosen choice (not points). */
export function scoreScale(scale: Scale, answers: Record<string, number | undefined>): ScaleResult {
  const points: Record<string, number> = {}
  let answered = 0
  for (const item of scale.items) {
    const idx = answers[item.id]
    if (idx === undefined || idx === null) continue
    const choice = item.choices[idx]
    if (!choice) continue
    answered++
    points[item.id] = choice.points
  }
  const total =
    scale.mode === 'count'
      ? Object.values(points).filter((p) => p > 0).length
      : Object.values(points).reduce((a, b) => a + b, 0)
  const band = scale.bands.find((b) => total >= b.min && total <= b.max) ?? null
  const flags = (scale.flags ?? []).map((f) => f.test(points, total)).filter((m): m is string => Boolean(m))
  return {
    total,
    max: scaleMax(scale),
    complete: answered === scale.items.length,
    answered,
    band,
    flags,
  }
}
