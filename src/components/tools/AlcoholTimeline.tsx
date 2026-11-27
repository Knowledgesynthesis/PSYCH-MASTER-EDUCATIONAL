import { useState } from 'react'
import { ALCOHOL_PHASES, TIMELINE_MAX_HOURS, phaseState, timelineAdvice } from '../../logic/timeline'
import { cn } from '../../lib/cn'
import { Callout } from '../ui'

const SEV = {
  mild: 'bg-amber-400',
  serious: 'bg-orange-500',
  critical: 'bg-red-600',
}

const STATE_LABEL = { upcoming: 'Upcoming', active: 'Window open', peak: 'Peak risk', past: 'Window passed' }

export function AlcoholTimeline() {
  const [hours, setHours] = useState(24)
  const pct = (h: number) => `${(h / TIMELINE_MAX_HOURS) * 100}%`
  const ticks = [0, 24, 48, 72, 96, 120, 144, 168]

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="flex items-baseline justify-between text-sm font-medium">
          <span>Hours since last drink</span>
          <span className="text-2xl font-bold tabular-nums">
            {hours} h <span className="text-sm font-medium text-muted">(day {Math.floor(hours / 24) + 1})</span>
          </span>
        </span>
        <input type="range" min={0} max={TIMELINE_MAX_HOURS} step={2} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full accent-indigo-600" aria-valuetext={`${hours} hours`} />
      </label>

      <div className="relative space-y-2 rounded-2xl border border-border bg-surface p-4">
        <div className="pointer-events-none absolute inset-y-3 z-10 w-0.5 bg-primary" style={{ left: `calc(1rem + (100% - 2rem) * ${hours / TIMELINE_MAX_HOURS})` }} aria-hidden />
        {ALCOHOL_PHASES.map((p) => {
          const st = phaseState(p, hours)
          return (
            <div key={p.id} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold">{p.name}</span>
                <span className={cn('rounded-full px-2 py-0.5 font-medium', st === 'peak' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200' : st === 'active' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200' : 'bg-surface-2 text-muted')}>
                  {STATE_LABEL[st]}
                </span>
              </div>
              <div className="relative h-3 rounded-full bg-surface-2">
                <div className={cn('absolute h-3 rounded-full', SEV[p.severity], st === 'upcoming' || st === 'past' ? 'opacity-35' : 'opacity-100')} style={{ left: pct(p.start), width: pct(p.end - p.start) }} />
              </div>
            </div>
          )
        })}
        <div className="relative mt-1 h-4 text-[10px] text-muted">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2 tabular-nums" style={{ left: pct(t) }}>
              {t}h
            </span>
          ))}
        </div>
      </div>

      <Callout tone={hours >= 48 && hours <= 120 ? 'danger' : 'info'} title={`At ${hours} hours`}>
        {timelineAdvice(hours)}
      </Callout>

      <div className="grid gap-3 sm:grid-cols-2">
        {ALCOHOL_PHASES.map((p) => (
          <div key={p.id} className={cn('rounded-xl border p-3 text-sm', phaseState(p, hours) === 'peak' || phaseState(p, hours) === 'active' ? 'border-primary/50 bg-primary-soft/40' : 'border-border')}>
            <p className="font-semibold">
              {p.name} <span className="font-normal text-muted">· {p.start}–{p.end} h</span>
            </p>
            <p className="mt-1 text-muted">{p.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
