import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Monitor, Moon, RotateCcw, Sun, Upload } from 'lucide-react'
import { REFERENCES } from '../content/references'
import type { ReferenceType } from '../content/types'
import { CONTENT_UPDATED } from '../content'
import { snapshot, useProgress } from '../store/progress'
import { useTheme, type ThemePref } from '../store/theme'
import { cn } from '../lib/cn'
import { Badge, Button, Callout, Card, Chip, SectionHeading } from '../components/ui'

const TYPE_LABEL: Record<ReferenceType, string> = {
  criteria: 'Classification',
  guideline: 'Guidelines',
  'meta-analysis': 'Meta-analyses',
  trial: 'Randomized trials',
  cohort: 'Cohort & registry studies',
  regulatory: 'Regulatory actions',
  review: 'Reviews',
  instrument: 'Instruments',
}

export default function About() {
  const { pref, setPref } = useTheme()
  const reset = useProgress((s) => s.reset)
  const importSnapshot = useProgress((s) => s.importSnapshot)
  const [type, setType] = useState<ReferenceType | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'About & settings — Psych Master'
  }, [])

  const refs = useMemo(() => REFERENCES.filter((r) => !type || r.type === type).sort((a, b) => b.year - a.year), [type])

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify({ app: 'psych-master', version: 1, exported: new Date().toISOString(), progress: snapshot() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `psych-master-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text())
      const ok = importSnapshot(data?.progress ?? data)
      setMessage(ok ? 'Progress imported.' : 'That file does not look like a Psych Master export.')
    } catch {
      setMessage('Could not read that file.')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About Psych Master</h1>
        <p className="mt-2 text-muted">
          An interactive psychiatry curriculum for students, residents and clinicians. Content reviewed {CONTENT_UPDATED}.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <SectionHeading title="How to use it" />
        <ol className="list-decimal space-y-2 pl-5 text-[15px]">
          <li><strong>Learn</strong> the bottom line and sections of a module (sections are marked read as you finish them).</li>
          <li><strong>Apply</strong> the criteria engines and scales to your own invented presentations — change one input and watch which rule flips.</li>
          <li><strong>Reason</strong> through the branching cases; commit before revealing.</li>
          <li><strong>Drill</strong> the questions, then return daily for due flashcards. Mix topics in the question bank to train discrimination.</li>
        </ol>
        <p className="mt-4 text-sm text-muted">
          Why: practice testing and distributed (spaced) practice are the most robust learning strategies in cognitive science — retrieval beats rereading for long-term retention, and spacing reviews multiplies the effect.
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading title="Editorial standard" />
        <ul className="list-disc space-y-1.5 pl-5 text-[15px]">
          <li>Diagnostic logic follows DSM-5-TR (paraphrased) with ICD-11 where it differs.</li>
          <li>Management follows current major guidelines (APA, CANMAT/ISBD, NICE, VA/DoD, ASAM, AAP) and pivotal trials; FDA actions through November 2026 are included.</li>
          <li>Doses appear only where they are safety-critical (e.g. citalopram caps, lithium levels, thiamine for Wernicke).</li>
          <li>All cases are fictional. Progress is stored only in this browser — nothing is sent anywhere.</li>
        </ul>
        <div className="mt-4">
          <Callout tone="info">A learning tool, not a substitute for clinical judgment or local protocols. If you or someone you know is in crisis in the US, call or text 988.</Callout>
        </div>
      </Card>

      <Card className="p-5 sm:p-6" as="section">
        <div id="settings" className="scroll-mt-24" />
        <SectionHeading title="Settings" />
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold">Theme</p>
            <div className="flex flex-wrap gap-2">
              {([
                ['system', 'System', Monitor],
                ['light', 'Light', Sun],
                ['dark', 'Dark', Moon],
              ] as [ThemePref, string, typeof Sun][]).map(([v, label, Icon]) => (
                <Chip key={v} active={pref === v} onClick={() => setPref(v)}>
                  <span className="inline-flex items-center gap-1.5"><Icon className="h-4 w-4" aria-hidden /> {label}</span>
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Progress</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportProgress}><Download className="h-4 w-4" aria-hidden /> Export</Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden /> Import</Button>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm('Reset all progress (questions, cases, flashcards, sections read)? This cannot be undone.')) {
                    reset()
                    setMessage('Progress reset.')
                  }
                }}
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Reset
              </Button>
            </div>
            {message && <p className="mt-2 text-sm text-muted" role="status">{message}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeading title="Sources" subtitle={`${REFERENCES.length} references, newest first.`} />
        <div className="mb-4 flex flex-wrap gap-2">
          <Chip active={!type} onClick={() => setType(null)}>All</Chip>
          {(Object.keys(TYPE_LABEL) as ReferenceType[]).map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>{TYPE_LABEL[t]}</Chip>
          ))}
        </div>
        <ul className="space-y-2 text-sm">
          {refs.map((r) => (
            <li key={r.id} className={cn('flex gap-3 rounded-lg p-2', 'hover:bg-surface-2')}>
              <span className="w-10 shrink-0 font-semibold tabular-nums text-muted">{r.year}</span>
              <span className="min-w-0">
                {r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">{r.citation}</a> : r.citation}{' '}
                <Badge className="ml-1">{TYPE_LABEL[r.type]}</Badge>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
