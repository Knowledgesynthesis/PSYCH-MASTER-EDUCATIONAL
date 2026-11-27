/** Alcohol withdrawal syndromes by hours since last drink (ASAM 2020; Schuckit NEJM 2014). */

export interface Phase {
  id: string
  name: string
  start: number
  end: number
  peak?: number
  severity: 'mild' | 'serious' | 'critical'
  detail: string
}

export const ALCOHOL_PHASES: Phase[] = [
  {
    id: 'minor',
    name: 'Minor withdrawal',
    start: 6,
    end: 36,
    peak: 24,
    severity: 'mild',
    detail: 'Tremor, anxiety, insomnia, sweating, nausea, tachycardia, hypertension. Can begin while blood alcohol is still elevated.',
  },
  {
    id: 'hallucinosis',
    name: 'Alcohol hallucinosis',
    start: 12,
    end: 48,
    severity: 'serious',
    detail: 'Usually visual (also tactile/auditory) hallucinations with a CLEAR sensorium and often near-normal vitals. Not delirium tremens.',
  },
  {
    id: 'seizures',
    name: 'Withdrawal seizures',
    start: 6,
    end: 48,
    peak: 24,
    severity: 'serious',
    detail: 'Generalized tonic-clonic, usually single or a brief cluster. Up to a third of untreated patients with seizures progress to DTs. Focal seizure or status → look for another cause.',
  },
  {
    id: 'dts',
    name: 'Delirium tremens',
    start: 48,
    end: 120,
    peak: 72,
    severity: 'critical',
    detail: 'Fluctuating delirium, hallucinations, marked autonomic hyperactivity, fever. Typically lasts 1–5 days. Mortality now ~1–4% with treatment (historically up to ~20%).',
  },
]

export const TIMELINE_MAX_HOURS = 168

export type PhaseState = 'upcoming' | 'active' | 'peak' | 'past'

export function phaseState(phase: Phase, hours: number): PhaseState {
  if (hours < phase.start) return 'upcoming'
  if (hours > phase.end) return 'past'
  if (phase.peak !== undefined && Math.abs(hours - phase.peak) <= 12) return 'peak'
  return 'active'
}

export function timelineAdvice(hours: number): string {
  if (hours < 6) return 'Withdrawal usually starts 6–24 h after the last drink. Assess risk now (prior seizures/DTs, daily heavy use, PAWSS) and give thiamine; symptoms may not have started yet.'
  if (hours <= 48) return 'Peak window for minor withdrawal, hallucinosis and seizures. Score CIWA-Ar frequently and treat early — early adequate benzodiazepine treatment prevents progression.'
  if (hours <= 120) return 'Delirium tremens window (typically day 2–4). Any confusion or fluctuating attention = DTs until proven otherwise: inpatient/ICU care, escalate benzodiazepines or add phenobarbital, look for infection, head injury, Wernicke, hepatic encephalopathy.'
  return 'Beyond ~5 days new alcohol withdrawal is unlikely. New delirium now suggests another cause — or withdrawal from a long-acting benzodiazepine, which can emerge 2–7+ days after stopping.'
}
