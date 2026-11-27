import type { Accent } from '../content/types'

/** Static class maps — Tailwind can only see literal class names. */
export const ACCENT: Record<Accent, { text: string; soft: string; bar: string; border: string; ring: string }> = {
  indigo: { text: 'text-indigo-600 dark:text-indigo-300', soft: 'bg-indigo-50 dark:bg-indigo-950/50', bar: 'bg-indigo-500', border: 'border-indigo-200 dark:border-indigo-900', ring: 'ring-indigo-500' },
  sky: { text: 'text-sky-600 dark:text-sky-300', soft: 'bg-sky-50 dark:bg-sky-950/50', bar: 'bg-sky-500', border: 'border-sky-200 dark:border-sky-900', ring: 'ring-sky-500' },
  amber: { text: 'text-amber-600 dark:text-amber-300', soft: 'bg-amber-50 dark:bg-amber-950/40', bar: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-900', ring: 'ring-amber-500' },
  violet: { text: 'text-violet-600 dark:text-violet-300', soft: 'bg-violet-50 dark:bg-violet-950/50', bar: 'bg-violet-500', border: 'border-violet-200 dark:border-violet-900', ring: 'ring-violet-500' },
  emerald: { text: 'text-emerald-600 dark:text-emerald-300', soft: 'bg-emerald-50 dark:bg-emerald-950/40', bar: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-900', ring: 'ring-emerald-500' },
  rose: { text: 'text-rose-600 dark:text-rose-300', soft: 'bg-rose-50 dark:bg-rose-950/40', bar: 'bg-rose-500', border: 'border-rose-200 dark:border-rose-900', ring: 'ring-rose-500' },
  orange: { text: 'text-orange-600 dark:text-orange-300', soft: 'bg-orange-50 dark:bg-orange-950/40', bar: 'bg-orange-500', border: 'border-orange-200 dark:border-orange-900', ring: 'ring-orange-500' },
  teal: { text: 'text-teal-600 dark:text-teal-300', soft: 'bg-teal-50 dark:bg-teal-950/40', bar: 'bg-teal-500', border: 'border-teal-200 dark:border-teal-900', ring: 'ring-teal-500' },
  fuchsia: { text: 'text-fuchsia-600 dark:text-fuchsia-300', soft: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', bar: 'bg-fuchsia-500', border: 'border-fuchsia-200 dark:border-fuchsia-900', ring: 'ring-fuchsia-500' },
  red: { text: 'text-red-600 dark:text-red-300', soft: 'bg-red-50 dark:bg-red-950/40', bar: 'bg-red-500', border: 'border-red-200 dark:border-red-900', ring: 'ring-red-500' },
}

export const TONE: Record<'danger' | 'warning' | 'info' | 'success' | 'pearl', { box: string; title: string }> = {
  danger: { box: 'border-red-200 bg-red-50 text-red-950 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100', title: 'text-red-700 dark:text-red-300' },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100', title: 'text-amber-700 dark:text-amber-300' },
  info: { box: 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-100', title: 'text-sky-700 dark:text-sky-300' },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100', title: 'text-emerald-700 dark:text-emerald-300' },
  pearl: { box: 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-100', title: 'text-violet-700 dark:text-violet-300' },
}
