import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { TONE } from './accent'
import { RichText } from './RichText'
import type { Tone } from '../content/types'
import { AlertTriangle, Info, CheckCircle2, Lightbulb, OctagonAlert } from 'lucide-react'

export function Card({ children, className, as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return <As className={cn('rounded-2xl border border-border bg-surface shadow-sm', className)}>{children}</As>
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const variants: Record<Variant, string> = {
    primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
    secondary: 'bg-surface-2 text-text hover:bg-border',
    ghost: 'text-text hover:bg-surface-2',
    outline: 'border border-border bg-surface text-text hover:bg-surface-2',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-5 text-base gap-2',
  }
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted', className)}>
      {children}
    </span>
  )
}

const TONE_ICON = { danger: OctagonAlert, warning: AlertTriangle, info: Info, success: CheckCircle2, pearl: Lightbulb }

export function Callout({ tone, title, children }: { tone: Tone; title?: string; children: ReactNode }) {
  const Icon = TONE_ICON[tone]
  return (
    <div className={cn('rounded-xl border p-4 text-sm leading-relaxed', TONE[tone].box)} role={tone === 'danger' ? 'alert' : undefined}>
      <div className="flex gap-3">
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', TONE[tone].title)} aria-hidden />
        <div className="min-w-0 flex-1">
          {title && <p className={cn('mb-1 font-semibold', TONE[tone].title)}>{title}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

export function TextLines({ text }: { text: string | string[] }) {
  const lines = Array.isArray(text) ? text : [text]
  if (lines.length === 1) return <p><RichText text={lines[0]} /></p>
  return (
    <ul className="list-disc space-y-1 pl-5">
      {lines.map((l, i) => (
        <li key={i}><RichText text={l} /></li>
      ))}
    </ul>
  )
}

export function ProgressBar({ value, className, barClass = 'bg-primary', label }: { value: number; className?: string; barClass?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-2', className)} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cn('h-full rounded-full transition-[width] duration-500', barClass)} style={{ width: `${v}%` }} />
    </div>
  )
}

export function ProgressRing({ value, size = 56, stroke = 6, className, label }: { value: number; size?: number; stroke?: number; className?: string; label?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(v)}% mastery`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-surface-2" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute text-xs font-semibold tabular-nums">{Math.round(v)}%</span>
    </div>
  )
}

export function Chip({ active, onClick, children, className }: { active: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface text-muted hover:text-text',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Toggle({ checked, onChange, label, description, radio = false }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; radio?: boolean }) {
  return (
    <button
      type="button"
      role={radio ? 'radio' : 'checkbox'}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
        checked ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:bg-surface-2',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-bold',
          radio ? 'rounded-full' : 'rounded-md',
          checked ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface',
        )}
        aria-hidden
      >
        {checked ? '✓' : ''}
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
    </button>
  )
}

export function SectionHeading({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  )
}
