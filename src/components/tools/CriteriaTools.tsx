import { useMemo, useState, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import {
  B_SYMPTOMS,
  EXPOSURES,
  HYPERACTIVITY,
  INATTENTION,
  MDE_SYMPTOMS,
  PSYCHOSIS_A,
  PTSD_CLUSTERS,
  adhdThreshold,
  clusterCounts,
  evaluateAdhd,
  evaluateEpisode,
  evaluateMde,
  evaluatePsychosis,
  evaluatePtsd,
  type ClusterKey,
  type EpisodeInput,
  type PsychosisInput,
} from '../../logic/criteria'
import { cn } from '../../lib/cn'
import { Button, Toggle } from '../ui'
import { VerdictPanel } from './VerdictPanel'

/* ---------- shared controls ---------- */

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">
        {title}
        {hint && <span className="ml-2 font-normal text-muted">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  )
}

function Checklist({ items, selected, onToggle }: { items: readonly { id: string; label: string }[]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((s) => (
        <Toggle key={s.id} checked={selected.includes(s.id)} onChange={() => onToggle(s.id)} label={s.label} />
      ))}
    </div>
  )
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
            value === o.value ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface hover:bg-surface-2',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function NumberField({ label, value, onChange, min = 0, max = 9999, unit, step = 1 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; unit?: string; step?: number }) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <span className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-surface">
        <button type="button" aria-label={`Decrease ${label}`} className="h-9 w-9 text-lg hover:bg-surface-2" onClick={() => onChange(Math.max(min, value - step))}>
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          className="h-9 w-16 border-x border-border bg-transparent text-center tabular-nums outline-none"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = Number(e.target.value)
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, Math.round(n))))
          }}
        />
        <button type="button" aria-label={`Increase ${label}`} className="h-9 w-9 text-lg hover:bg-surface-2" onClick={() => onChange(Math.min(max, value + step))}>
          +
        </button>
      </span>
      {unit && <span className="text-muted">{unit}</span>}
    </label>
  )
}

function ToolLayout({ inputs, verdict, onReset }: { inputs: ReactNode; verdict: ReactNode; onReset: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">{inputs}</div>
      <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        {verdict}
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
        </Button>
      </aside>
    </div>
  )
}

const toggleIn = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

/* ---------- MDE checker ---------- */

export function MdeChecker() {
  const initial = { symptoms: [] as string[], durationWeeks: 2, impairment: true, substanceOrMedical: false, priorManiaOrHypomania: false, psychoticFeatures: false }
  const [s, setS] = useState(initial)
  const verdict = useMemo(() => evaluateMde(s), [s])
  return (
    <ToolLayout
      onReset={() => setS(initial)}
      verdict={<VerdictPanel verdict={verdict} />}
      inputs={
        <>
          <Group title="Symptoms" hint="present nearly every day (SIG E CAPS + mood)">
            <Checklist items={MDE_SYMPTOMS} selected={s.symptoms} onToggle={(id) => setS({ ...s, symptoms: toggleIn(s.symptoms, id) })} />
          </Group>
          <NumberField label="Duration" value={s.durationWeeks} onChange={(n) => setS({ ...s, durationWeeks: n })} max={520} unit="weeks" />
          <Group title="Context">
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle checked={s.impairment} onChange={(v) => setS({ ...s, impairment: v })} label="Clinically significant distress or impairment" />
              <Toggle checked={s.substanceOrMedical} onChange={(v) => setS({ ...s, substanceOrMedical: v })} label="Explained by substance/medication or medical condition" description="e.g. hypothyroidism, corticosteroids, alcohol" />
              <Toggle checked={s.priorManiaOrHypomania} onChange={(v) => setS({ ...s, priorManiaOrHypomania: v })} label="Ever had a manic or hypomanic episode" />
              <Toggle checked={s.psychoticFeatures} onChange={(v) => setS({ ...s, psychoticFeatures: v })} label="Psychotic features (delusions/hallucinations)" />
            </div>
          </Group>
        </>
      }
    />
  )
}

/* ---------- Mania vs hypomania ---------- */

const episodeInitial: EpisodeInput = {
  mood: 'elevated',
  increasedEnergy: true,
  bSymptoms: [],
  durationDays: 4,
  markedImpairment: false,
  hospitalized: false,
  psychotic: false,
  observableByOthers: true,
  substanceOrMedical: false,
  persistsBeyondDrugEffect: false,
}

export function EpisodeClassifier() {
  const [s, setS] = useState<EpisodeInput>(episodeInitial)
  const verdict = useMemo(() => evaluateEpisode(s), [s])
  return (
    <ToolLayout
      onReset={() => setS(episodeInitial)}
      verdict={<VerdictPanel verdict={verdict} />}
      inputs={
        <>
          <Group title="Criterion A — mood" hint="abnormal and persistent, most of the day">
            <Segmented
              label="Mood"
              value={s.mood}
              onChange={(mood) => setS({ ...s, mood })}
              options={[
                { value: 'elevated', label: 'Elevated / expansive' },
                { value: 'irritable', label: 'Irritable only' },
                { value: 'none', label: 'No abnormal mood' },
              ]}
            />
            <Toggle checked={s.increasedEnergy} onChange={(v) => setS({ ...s, increasedEnergy: v })} label="Persistently increased activity or energy" description="Required alongside mood since DSM-5" />
          </Group>
          <Group title="Criterion B — DIGFAST" hint={`need ≥${s.mood === 'irritable' ? 4 : 3}`}>
            <Checklist items={B_SYMPTOMS} selected={s.bSymptoms} onToggle={(id) => setS({ ...s, bSymptoms: toggleIn(s.bSymptoms, id) })} />
          </Group>
          <NumberField label="Duration" value={s.durationDays} onChange={(n) => setS({ ...s, durationDays: n })} max={365} unit="days" />
          <Group title="Severity & context">
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle checked={s.markedImpairment} onChange={(v) => setS({ ...s, markedImpairment: v })} label="Marked impairment in social/occupational function" />
              <Toggle checked={s.hospitalized} onChange={(v) => setS({ ...s, hospitalized: v })} label="Hospitalization needed (to prevent harm)" />
              <Toggle checked={s.psychotic} onChange={(v) => setS({ ...s, psychotic: v })} label="Psychotic features" />
              <Toggle checked={s.observableByOthers} onChange={(v) => setS({ ...s, observableByOthers: v })} label="Change observable by others" />
              <Toggle checked={s.substanceOrMedical} onChange={(v) => setS({ ...s, substanceOrMedical: v })} label="Emerged with a substance, medication or medical condition" description="stimulants, steroids, antidepressant, hyperthyroidism…" />
              {s.substanceOrMedical && (
                <Toggle checked={s.persistsBeyondDrugEffect} onChange={(v) => setS({ ...s, persistsBeyondDrugEffect: v })} label="Persists at full syndromal level beyond the drug's physiological effect" />
              )}
            </div>
          </Group>
        </>
      }
    />
  )
}

/* ---------- Psychosis classifier ---------- */

const psychosisInitial: PsychosisInput = {
  symptoms: [],
  activeDays: 14,
  totalDays: 14,
  mood: 'none',
  psychosisWithoutMood2w: false,
  functionalDecline: true,
  returnedToBaseline: false,
  substanceOrMedical: false,
}

export function PsychosisClassifier() {
  const [s, setS] = useState<PsychosisInput>(psychosisInitial)
  const verdict = useMemo(() => evaluatePsychosis(s), [s])
  const months = (d: number) => (d >= 60 ? `≈${(d / 30.4).toFixed(1)} months` : d >= 14 ? `≈${(d / 7).toFixed(1)} weeks` : '')
  return (
    <ToolLayout
      onReset={() => setS(psychosisInitial)}
      verdict={<VerdictPanel verdict={verdict} />}
      inputs={
        <>
          <Group title="Criterion A symptoms">
            <Checklist items={PSYCHOSIS_A} selected={s.symptoms} onToggle={(id) => setS({ ...s, symptoms: toggleIn(s.symptoms, id) })} />
          </Group>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <NumberField label="Active-phase symptoms" value={s.activeDays} onChange={(n) => setS({ ...s, activeDays: n, totalDays: Math.max(n, s.totalDays) })} max={3650} unit="days" />
              <p className="mt-1 text-xs text-muted">{months(s.activeDays)}</p>
            </div>
            <div>
              <NumberField label="Total illness incl. prodrome/residual" value={s.totalDays} onChange={(n) => setS({ ...s, totalDays: Math.max(n, s.activeDays) })} max={3650} unit="days" />
              <p className="mt-1 text-xs text-muted">{months(s.totalDays)}</p>
            </div>
          </div>
          <Group title="Relationship to mood episodes">
            <Segmented
              label="Mood relationship"
              value={s.mood}
              onChange={(mood) => setS({ ...s, mood })}
              options={[
                { value: 'none', label: 'No major mood episodes' },
                { value: 'minority', label: 'Mood episodes, minority of illness' },
                { value: 'majority', label: 'Mood episodes, majority of illness' },
                { value: 'only-during-mood', label: 'Psychosis ONLY during mood episodes' },
              ]}
            />
            {s.mood === 'majority' && (
              <Toggle checked={s.psychosisWithoutMood2w} onChange={(v) => setS({ ...s, psychosisWithoutMood2w: v })} label="≥2 weeks of delusions/hallucinations without a mood episode" />
            )}
          </Group>
          <Group title="Course & context">
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle checked={s.functionalDecline} onChange={(v) => setS({ ...s, functionalDecline: v })} label="Marked decline in work, relationships or self-care" />
              <Toggle checked={s.returnedToBaseline} onChange={(v) => setS({ ...s, returnedToBaseline: v })} label="Full return to premorbid functioning" />
              <Toggle checked={s.substanceOrMedical} onChange={(v) => setS({ ...s, substanceOrMedical: v })} label="Explained by substance/withdrawal, medication or medical illness" />
            </div>
          </Group>
        </>
      }
    />
  )
}

/* ---------- PTSD mapper ---------- */

export function PtsdMapper() {
  const initial = { exposure: null as string | null, symptoms: [] as string[], dissociation: false, daysSinceTrauma: 60, impairment: true, substanceOrMedical: false, delayedOnset: false }
  const [s, setS] = useState(initial)
  const verdict = useMemo(() => evaluatePtsd(s), [s])
  const counts = clusterCounts(s.symptoms)
  return (
    <ToolLayout
      onReset={() => setS(initial)}
      verdict={<VerdictPanel verdict={verdict} />}
      inputs={
        <>
          <Group title="Criterion A — exposure">
            <div className="grid gap-2" role="radiogroup" aria-label="Type of exposure">
              {EXPOSURES.map((e) => (
                <Toggle key={e.id} radio checked={s.exposure === e.id} onChange={() => setS({ ...s, exposure: s.exposure === e.id ? null : e.id })} label={e.label} />
              ))}
            </div>
          </Group>
          {(Object.keys(PTSD_CLUSTERS) as ClusterKey[]).map((k) => {
            const c = PTSD_CLUSTERS[k]
            const ok = counts[k] >= c.need
            return (
              <Group key={k} title={`Cluster ${k}: ${c.name}`} hint={`${counts[k]}/${c.items.length} · need ≥${c.need} ${ok ? '✓' : ''}`}>
                <Checklist items={c.items} selected={s.symptoms} onToggle={(id) => setS({ ...s, symptoms: toggleIn(s.symptoms, id) })} />
              </Group>
            )
          })}
          <NumberField label="Time since trauma" value={s.daysSinceTrauma} onChange={(n) => setS({ ...s, daysSinceTrauma: n })} max={36500} unit="days" />
          <Group title="Specifiers & context">
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle checked={s.dissociation} onChange={(v) => setS({ ...s, dissociation: v })} label="Depersonalization or derealization" description="PTSD dissociative subtype; counts toward ASD" />
              <Toggle checked={s.delayedOnset} onChange={(v) => setS({ ...s, delayedOnset: v })} label="Full criteria first met ≥6 months after the event" />
              <Toggle checked={s.impairment} onChange={(v) => setS({ ...s, impairment: v })} label="Clinically significant distress or impairment" />
              <Toggle checked={s.substanceOrMedical} onChange={(v) => setS({ ...s, substanceOrMedical: v })} label="Explained by substance or medical condition (e.g. TBI)" />
            </div>
          </Group>
        </>
      }
    />
  )
}

/* ---------- ADHD analyzer ---------- */

export function AdhdAnalyzer() {
  const initial = { age: 9, inattention: [] as string[], hyperactivity: [] as string[], sixMonths: true, onsetBefore12: true, twoSettings: true, impairment: true, betterExplained: false }
  const [s, setS] = useState(initial)
  const verdict = useMemo(() => evaluateAdhd(s), [s])
  const t = adhdThreshold(s.age)
  return (
    <ToolLayout
      onReset={() => setS(initial)}
      verdict={<VerdictPanel verdict={verdict} />}
      inputs={
        <>
          <NumberField label="Age" value={s.age} onChange={(n) => setS({ ...s, age: n })} min={4} max={90} unit="years" />
          <Group title="Inattention" hint={`${s.inattention.length}/9 · need ≥${t}`}>
            <Checklist items={INATTENTION} selected={s.inattention} onToggle={(id) => setS({ ...s, inattention: toggleIn(s.inattention, id) })} />
          </Group>
          <Group title="Hyperactivity–impulsivity" hint={`${s.hyperactivity.length}/9 · need ≥${t}`}>
            <Checklist items={HYPERACTIVITY} selected={s.hyperactivity} onToggle={(id) => setS({ ...s, hyperactivity: toggleIn(s.hyperactivity, id) })} />
          </Group>
          <Group title="Context criteria">
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle checked={s.sixMonths} onChange={(v) => setS({ ...s, sixMonths: v })} label="Persisting ≥6 months" />
              <Toggle checked={s.onsetBefore12} onChange={(v) => setS({ ...s, onsetBefore12: v })} label="Several symptoms before age 12" />
              <Toggle checked={s.twoSettings} onChange={(v) => setS({ ...s, twoSettings: v })} label="Several symptoms in ≥2 settings" />
              <Toggle checked={s.impairment} onChange={(v) => setS({ ...s, impairment: v })} label="Clear functional interference" />
              <Toggle checked={s.betterExplained} onChange={(v) => setS({ ...s, betterExplained: v })} label="Better explained by another condition" description="sleep deprivation/apnea, anxiety, depression, substance, trauma" />
            </div>
          </Group>
        </>
      }
    />
  )
}
