import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Brain, Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import { MODULES, ALL_FLASHCARDS, CONTENT_UPDATED } from '../content'
import { useTheme } from '../store/theme'
import { useProgress } from '../store/progress'
import { isDue } from '../lib/srs'
import { cn } from '../lib/cn'
import { MODULE_ICONS } from './icons'
import { ACCENT } from './accent'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/practice', label: 'Question bank' },
  { to: '/review', label: 'Flashcards' },
  { to: '/tools', label: 'Tools' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/about', label: 'About' },
]

function ThemeButton() {
  const { pref, cycle } = useTheme()
  const Icon = pref === 'dark' ? Moon : pref === 'light' ? Sun : Monitor
  return (
    <button type="button" onClick={cycle} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-text" aria-label={`Theme: ${pref}. Click to change.`} title={`Theme: ${pref}`}>
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  )
}

function useDueCount(): number {
  const cards = useProgress((s) => s.cards)
  return useMemo(() => {
    const now = Date.now()
    // New cards are not counted as "due" in the badge — only scheduled reviews.
    return ALL_FLASHCARDS.filter((c) => cards[c.id] && isDue(cards[c.id], now)).length
  }, [cards])
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const due = useDueCount()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-2 hover:text-text')

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-fg">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-fg">
              <Brain className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg">Psych Master</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
                <span className="inline-flex items-center gap-1.5">
                  {n.label}
                  {n.to === '/review' && due > 0 && <span className="rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-fg">{due}</span>}
                </span>
              </NavLink>
            ))}
            <ThemeButton />
          </nav>
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeButton />
            <button type="button" className="rounded-lg p-2 hover:bg-surface-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-border bg-bg lg:hidden">
            <nav className="mx-auto max-w-7xl space-y-6 px-4 py-4" aria-label="Mobile">
              <div className="grid grid-cols-2 gap-2">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('rounded-xl border px-3 py-3 text-sm font-medium', isActive ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface')}>
                    {n.label}
                    {n.to === '/review' && due > 0 && <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-fg">{due}</span>}
                  </NavLink>
                ))}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Modules</p>
                <div className="grid gap-1">
                  {MODULES.map((m) => {
                    const Icon = MODULE_ICONS[m.icon]
                    return (
                      <NavLink key={m.id} to={`/${m.slug}`} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm', isActive ? 'bg-primary-soft text-primary' : 'hover:bg-surface-2')}>
                        <Icon className={cn('h-4 w-4', ACCENT[m.accent].text)} aria-hidden />
                        {m.title}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>For learning and clinical-reasoning practice — check doses and decisions against current guidelines. In crisis (US): call or text 988.</p>
          <p>Content reviewed {CONTENT_UPDATED} · DSM-5-TR</p>
        </div>
      </footer>
    </div>
  )
}
