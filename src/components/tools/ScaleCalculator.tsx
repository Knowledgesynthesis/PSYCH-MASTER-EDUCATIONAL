import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { scoreScale, type Scale } from '../../logic/scales'
import { cn } from '../../lib/cn'
import { Button, Callout, ProgressBar } from '../ui'

const BAND_TONE = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
  info: 'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
  warning: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100',
  danger: 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100',
}

export function ScaleCalculator({ scale }: { scale: Scale }) {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})
  const result = useMemo(() => scoreScale(scale, answers), [scale, answers])
  const set = (id: string, idx: number) => setAnswers((a) => ({ ...a, [id]: a[id] === idx ? undefined : idx }))

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <p className="text-sm text-muted">{scale.purpose}</p>
        {scale.timeframe && <p className="text-sm font-medium">{scale.timeframe}</p>}
        <ol className="space-y-3">
          {scale.items.map((item, n) => {
            const chosen = answers[item.id]
            const compact = item.choices.length > 5
            return (
              <li key={item.id} className="rounded-xl border border-border bg-surface p-3">
                <p className="text-sm font-medium">
                  <span className="mr-1.5 text-muted tabular-nums">{n + 1}.</span>
                  {item.text}
                </p>
                {compact ? (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={item.text}>
                      {item.choices.map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          role="radio"
                          aria-checked={chosen === i}
                          title={c.label}
                          onClick={() => set(item.id, i)}
                          className={cn(
                            'h-9 w-9 rounded-lg border text-sm font-semibold tabular-nums transition-colors',
                            chosen === i ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface hover:bg-surface-2',
                          )}
                        >
                          {c.points}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 min-h-5 text-xs text-muted">
                      {chosen !== undefined ? item.choices[chosen].label : item.choices.filter((c) => !/^\d+$/.test(c.label)).map((c) => `${c.points} = ${c.label}`).join(' · ')}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2" role="radiogroup" aria-label={item.text}>
                    {item.choices.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        role="radio"
                        aria-checked={chosen === i}
                        onClick={() => set(item.id, i)}
                        className={cn(
                          'flex items-start gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors',
                          chosen === i ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:bg-surface-2',
                        )}
                      >
                        {scale.mode !== 'count' && (
                          <span className={cn('mt-px rounded px-1.5 text-xs font-bold tabular-nums', chosen === i ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted')}>{c.points}</span>
                        )}
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-muted">{scale.short} {scale.mode === 'count' ? 'positive items' : 'score'}</span>
            <span className="text-3xl font-bold tabular-nums">
              {result.total}
              <span className="text-base font-medium text-muted">/{result.max}</span>
            </span>
          </div>
          <ProgressBar value={(result.answered / scale.items.length) * 100} label="Items completed" />
          <p className="text-xs text-muted">
            {result.answered}/{scale.items.length} items answered{!result.complete && result.answered > 0 ? ' — score is provisional' : ''}
          </p>
          {result.band && result.answered > 0 && (
            <div className={cn('rounded-xl border p-3 text-sm', BAND_TONE[result.band.tone])} aria-live="polite">
              <p className="font-semibold">{result.band.label}</p>
              <p className="mt-1">{result.band.action}</p>
            </div>
          )}
          {result.flags.map((f) => (
            <Callout key={f} tone="danger">{f}</Callout>
          ))}
          {scale.interpretNote && <p className="text-xs leading-relaxed text-muted">{scale.interpretNote}</p>}
          <p className="text-[11px] leading-relaxed text-muted">Source: {scale.source}</p>
          <Button variant="outline" size="sm" onClick={() => setAnswers({})} disabled={result.answered === 0}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
          </Button>
        </div>
      </aside>
    </div>
  )
}
