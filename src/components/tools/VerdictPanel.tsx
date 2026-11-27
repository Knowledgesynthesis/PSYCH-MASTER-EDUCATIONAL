import { CheckCircle2, CircleAlert, CircleDashed, XCircle } from 'lucide-react'
import type { Verdict } from '../../logic/criteria'
import { cn } from '../../lib/cn'
import { RichText } from '../RichText'

const STYLE = {
  met: { box: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40', title: 'text-emerald-800 dark:text-emerald-200', Icon: CheckCircle2 },
  partial: { box: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30', title: 'text-amber-800 dark:text-amber-200', Icon: CircleDashed },
  'not-met': { box: 'border-border bg-surface-2/60', title: 'text-text', Icon: XCircle },
  alert: { box: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40', title: 'text-red-800 dark:text-red-200', Icon: CircleAlert },
} as const

export function VerdictPanel({ verdict }: { verdict: Verdict }) {
  const s = STYLE[verdict.status]
  return (
    <div className={cn('rounded-2xl border p-4', s.box)} aria-live="polite">
      <div className="flex items-start gap-2">
        <s.Icon className={cn('mt-0.5 h-5 w-5 shrink-0', s.title)} aria-hidden />
        <div className="min-w-0">
          <p className={cn('font-semibold', s.title)}>{verdict.label}</p>
          <p className="mt-1 text-sm leading-relaxed"><RichText text={verdict.summary} /></p>
        </div>
      </div>
      {verdict.reasons.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-black/5 pt-3 text-sm dark:border-white/10">
          {verdict.reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className={cn('font-bold', r.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')} aria-label={r.ok ? 'met' : 'not met'}>
                {r.ok ? '✓' : '✕'}
              </span>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      )}
      {verdict.next && verdict.next.length > 0 && (
        <div className="mt-3 border-t border-black/5 pt-3 text-sm dark:border-white/10">
          <p className="font-semibold">Next steps</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {verdict.next.map((n, i) => (
              <li key={i}><RichText text={n} /></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
