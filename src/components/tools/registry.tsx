import type { ComponentType } from 'react'
import type { ToolId } from '../../content/types'
import { SCALES } from '../../logic/scales'
import { ScaleCalculator } from './ScaleCalculator'
import { AdhdAnalyzer, EpisodeClassifier, MdeChecker, PsychosisClassifier, PtsdMapper } from './CriteriaTools'
import { AlcoholTimeline } from './AlcoholTimeline'
import { ToxidromeTool } from './ToxidromeTool'

export interface ToolMeta {
  id: ToolId
  title: string
  description: string
  kind: 'Scale' | 'Criteria engine' | 'Differential' | 'Timeline'
  Component: ComponentType
}

const scale = (id: keyof typeof SCALES): ComponentType => {
  const S = () => <ScaleCalculator scale={SCALES[id]} />
  S.displayName = `Scale(${id})`
  return S
}

export const TOOLS: Record<ToolId, ToolMeta> = {
  phq9: { id: 'phq9', title: 'PHQ-9 depression scale', description: 'Score severity, flag item 9, track response and remission.', kind: 'Scale', Component: scale('phq9') },
  gad7: { id: 'gad7', title: 'GAD-7 anxiety scale', description: 'Screen and grade generalized anxiety.', kind: 'Scale', Component: scale('gad7') },
  auditc: { id: 'auditc', title: 'AUDIT-C alcohol screen', description: 'Three-question screen for unhealthy alcohol use.', kind: 'Scale', Component: scale('auditc') },
  ciwa: { id: 'ciwa', title: 'CIWA-Ar alcohol withdrawal', description: 'Grade withdrawal severity for symptom-triggered treatment.', kind: 'Scale', Component: scale('ciwa') },
  cows: { id: 'cows', title: 'COWS opioid withdrawal', description: 'Grade opioid withdrawal and time buprenorphine initiation.', kind: 'Scale', Component: scale('cows') },
  bfcrs: { id: 'bfcrs', title: 'Bush–Francis catatonia screen', description: 'Fourteen-item screen; ≥2 items is positive.', kind: 'Scale', Component: scale('bfcrs') },
  fourat: { id: 'fourat', title: '4AT delirium screen', description: 'Two-minute delirium screen for any setting.', kind: 'Scale', Component: scale('fourat') },
  'mde-checker': { id: 'mde-checker', title: 'Major depressive episode checker', description: 'Apply DSM-5-TR criteria and see which rule fails.', kind: 'Criteria engine', Component: MdeChecker },
  'episode-classifier': { id: 'episode-classifier', title: 'Mania vs hypomania classifier', description: 'Mood + energy, DIGFAST count, duration, severity.', kind: 'Criteria engine', Component: EpisodeClassifier },
  'psychosis-classifier': { id: 'psychosis-classifier', title: 'Psychotic disorder classifier', description: 'Brief psychotic, schizophreniform, schizophrenia, schizoaffective, delusional.', kind: 'Criteria engine', Component: PsychosisClassifier },
  'ptsd-mapper': { id: 'ptsd-mapper', title: 'PTSD / acute stress mapper', description: 'Criterion A, clusters B–E, timing, specifiers.', kind: 'Criteria engine', Component: PtsdMapper },
  'adhd-analyzer': { id: 'adhd-analyzer', title: 'ADHD criteria analyzer', description: 'Age-adjusted thresholds plus onset, settings and impairment.', kind: 'Criteria engine', Component: AdhdAnalyzer },
  'alcohol-timeline': { id: 'alcohol-timeline', title: 'Alcohol withdrawal timeline', description: 'What to expect and watch for, hour by hour.', kind: 'Timeline', Component: AlcoholTimeline },
  toxidrome: { id: 'toxidrome', title: 'Hot, rigid or agitated patient', description: 'Serotonin syndrome vs NMS vs anticholinergic vs catatonia and more.', kind: 'Differential', Component: ToxidromeTool },
}
