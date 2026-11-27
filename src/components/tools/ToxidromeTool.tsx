import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { FINDINGS, rankSyndromes, type Finding } from '../../logic/toxidrome'
import { cn } from '../../lib/cn'
import { Button, Callout, Toggle } from '../ui'

const GROUPS: Finding['group'][] = ['Exposure', 'Time course', 'Neuromuscular', 'Autonomic & skin', 'Other']

export function ToxidromeTool() {
  const [selected, setSelected] = useState<string[]>([])
  const ranked = useMemo(() => rankSyndromes(selected), [selected])
  const top = ranked[0]
  const any = selected.length > 0
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <fieldset key={g} className="space-y-2">
            <legend className="text-sm font-semibold">{g}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {FINDINGS.filter((f) => f.group === g).map((f) => (
                <Toggle key={f.id} checked={selected.includes(f.id)} onChange={() => toggle(f.id)} label={f.label} />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start" aria-live="polite">
        {!any ? (
          <Callout tone="info" title="Select findings">
            Pick exposures, time course and examination findings. The ranking shows which findings support or argue against each syndrome.
          </Callout>
        ) : (
          <>
            <ol className="space-y-2">
              {ranked.map((r, i) => (
                <li key={r.syndrome.id} className={cn('rounded-xl border p-3 text-sm', i === 0 && r.score > 0 ? 'border-primary bg-primary-soft/60' : 'border-border bg-surface')}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{r.syndrome.name}</span>
                    <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-bold tabular-nums">{r.score > 0 ? `+${r.score}` : r.score}</span>
                  </div>
                  {i < 3 && (r.supporting.length > 0 || r.against.length > 0) && (
                    <div className="mt-1.5 space-y-0.5 text-xs">
                      {r.supporting.length > 0 && <p className="text-emerald-700 dark:text-emerald-300">For: {r.supporting.join('; ')}</p>}
                      {r.against.length > 0 && <p className="text-red-700 dark:text-red-300">Against: {r.against.join('; ')}</p>}
                    </div>
                  )}
                </li>
              ))}
            </ol>
            {top && top.score > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
                <p className="font-semibold">{top.syndrome.name}: discriminating features</p>
                <p className="mt-1 text-muted">{top.syndrome.key}</p>
                <p className="mt-3 font-semibold">Management</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {top.syndrome.management.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted">Weighted pattern-matching to train discrimination — real presentations overlap (e.g. NMS vs malignant catatonia) and can co-exist.</p>
          </>
        )}
        <Button variant="outline" size="sm" onClick={() => setSelected([])} disabled={!any}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
        </Button>
      </aside>
    </div>
  )
}
