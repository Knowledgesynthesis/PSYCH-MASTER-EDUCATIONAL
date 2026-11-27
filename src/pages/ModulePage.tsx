import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BookOpen, CheckCircle2, ClipboardCheck, FlaskConical, Layers, ListChecks, Stethoscope, Wrench } from 'lucide-react'
import type { Module, Section } from '../content/types'
import { MODULES } from '../content'
import { REFERENCE_MAP } from '../content/references'
import { useProgress } from '../store/progress'
import { moduleMastery, masteryLabel } from '../lib/mastery'
import { cn } from '../lib/cn'
import { Blocks } from '../components/Blocks'
import { RichText } from '../components/RichText'
import { Badge, Card, Chip, ProgressRing, SectionHeading } from '../components/ui'
import { ACCENT } from '../components/accent'
import { MODULE_ICONS } from '../components/icons'
import { TOOLS } from '../components/tools/registry'
import { CaseStepper } from '../components/practice/CaseStepper'
import { FlashcardDeck } from '../components/practice/FlashcardDeck'
import { QuizSession } from '../components/practice/QuizSession'
import { SortGame } from '../components/practice/SortGame'

type Tab = 'learn' | 'tools' | 'cases' | 'drill'

function SectionBlock({ module, section }: { module: Module; section: Section }) {
  const markRead = useProgress((s) => s.markSectionRead)
  const read = useProgress((s) => Boolean(s.sectionsRead[`${module.id}:${section.id}`]))
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (read || !sentinel.current || typeof IntersectionObserver === 'undefined') return
    const el = sentinel.current
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          markRead(`${module.id}:${section.id}`)
          obs.disconnect()
        }
      },
      { threshold: 1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [read, markRead, module.id, section.id])

  return (
    <Card as="section" className="p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 id={section.id} className="scroll-mt-36 text-xl font-semibold tracking-tight">{section.title}</h2>
        {read && <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-label="Read" />}
      </div>
      <Blocks blocks={section.blocks} />
      {section.refs && section.refs.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-1.5 text-xs text-muted">
          <span>Sources:</span>
          {section.refs.map((id) => {
            const ref = REFERENCE_MAP[id]
            if (!ref) return null
            return (
              <a key={id} href={`#ref-${id}`} className="rounded border border-border px-1.5 py-0.5 hover:border-primary hover:text-primary" title={ref.citation}>
                {ref.citation.split(/[.(]/)[0].slice(0, 42)} {ref.year}
              </a>
            )
          })}
        </p>
      )}
      <div ref={sentinel} className="h-px" />
    </Card>
  )
}

export default function ModulePage({ module }: { module: Module }) {
  const [params, setParams] = useSearchParams()
  const tab = (['learn', 'tools', 'cases', 'drill'].includes(params.get('tab') ?? '') ? params.get('tab') : 'learn') as Tab
  const [drill, setDrill] = useState<'questions' | 'cards'>('questions')
  const progress = useProgress()
  const setLastVisited = useProgress((s) => s.setLastVisited)
  const mastery = moduleMastery(module, progress)
  const accent = ACCENT[module.accent]
  const Icon = MODULE_ICONS[module.icon]
  const hasTools = module.tools.length > 0 || (module.sorts?.length ?? 0) > 0
  const cards = useMemo(() => module.flashcards, [module])

  useEffect(() => {
    setLastVisited(`/${module.slug}`)
    document.title = `${module.title} — Psych Master`
  }, [module, setLastVisited])

  const idx = MODULES.findIndex((m) => m.id === module.id)
  const prev = MODULES[idx - 1]
  const next = MODULES[idx + 1]

  const tabs: { id: Tab; label: string; icon: typeof BookOpen; count?: number; show: boolean }[] = [
    { id: 'learn', label: 'Learn', icon: BookOpen, count: module.sections.length, show: true },
    { id: 'tools', label: 'Interactive', icon: Wrench, count: module.tools.length + (module.sorts?.length ?? 0), show: hasTools },
    { id: 'cases', label: 'Cases', icon: Stethoscope, count: module.cases.length, show: module.cases.length > 0 },
    { id: 'drill', label: 'Drill', icon: ClipboardCheck, count: module.questions.length + module.flashcards.length, show: true },
  ]

  const setTab = (t: Tab) => {
    const p = new URLSearchParams(params)
    if (t === 'learn') p.delete('tab')
    else p.set('tab', t)
    setParams(p, { replace: false })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn('overflow-hidden rounded-3xl border p-5 sm:p-7', accent.border, accent.soft)}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <Icon className={cn('h-5 w-5', accent.text)} aria-hidden />
              Module {idx + 1} of {MODULES.length}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{module.title}</h1>
            <p className="mt-2 max-w-2xl text-[15px] text-text/80">{module.tagline}</p>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <ProgressRing value={mastery.percent} size={72} stroke={7} />
            <div className="text-sm sm:text-right">
              <p className="font-semibold">{masteryLabel(mastery.percent)}</p>
              <p className="text-xs text-muted">
                {mastery.quiz.correct}/{mastery.quiz.total} Q · {mastery.cases.completed}/{mastery.cases.total} cases · {mastery.cards.learned}/{mastery.cards.total} cards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-bg/90 px-4 backdrop-blur-md">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto py-2" role="tablist" aria-label="Module sections">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  tab === t.id ? 'bg-primary text-primary-fg' : 'text-muted hover:bg-surface-2 hover:text-text',
                )}
              >
                <t.icon className="h-4 w-4" aria-hidden />
                {t.label}
                {t.count !== undefined && <span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', tab === t.id ? 'bg-white/20' : 'bg-surface-2')}>{t.count}</span>}
              </button>
            ))}
        </div>
      </div>

      {tab === 'learn' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0 space-y-6">
            <Card className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ListChecks className="h-5 w-5 text-primary" aria-hidden /> Bottom line
              </h2>
              <ul className="mt-3 space-y-2.5">
                {module.bottomLine.map((b, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">{i + 1}</span>
                    <span><RichText text={b} /></span>
                  </li>
                ))}
              </ul>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-medium text-muted hover:text-text">Learning objectives</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                  {module.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </details>
            </Card>

            {module.sections.map((s) => (
              <SectionBlock key={s.id} module={module} section={s} />
            ))}

            <Card className="p-5 sm:p-6">
              <SectionHeading title="Pitfalls" subtitle="The errors that cost patients — and exam points." />
              <div className="space-y-3">
                {module.pitfalls.map((p, i) => (
                  <div key={i} className="grid gap-2 rounded-xl border border-border p-3 text-sm sm:grid-cols-2">
                    <p><span className="font-semibold text-red-600 dark:text-red-400">Trap: </span>{p.trap}</p>
                    <p><span className="font-semibold text-emerald-600 dark:text-emerald-400">Instead: </span>{p.fix}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <SectionHeading title="References" subtitle="Guidelines, trials and regulatory actions behind this module." />
              <ol className="space-y-2 text-sm">
                {module.references.map((id) => {
                  const ref = REFERENCE_MAP[id]
                  if (!ref) return null
                  return (
                    <li key={id} id={`ref-${id}`} className="scroll-mt-28 rounded-lg p-2 target:bg-primary-soft">
                      <Badge className="mr-2 capitalize">{ref.type}</Badge>
                      {ref.url ? (
                        <a href={ref.url} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">{ref.citation}</a>
                      ) : (
                        ref.citation
                      )}
                    </li>
                  )
                })}
              </ol>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setTab(hasTools ? 'tools' : 'cases')} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg hover:bg-primary-hover">
                Continue: apply it →
              </button>
              <span className="text-xs text-muted">{mastery.sections.read}/{mastery.sections.total} sections read</span>
            </div>
          </div>

          <aside className="hidden lg:block">
            <nav className="sticky top-32 space-y-1 text-sm" aria-label="On this page">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
              {module.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-text">
                  {progress.sectionsRead[`${module.id}:${s.id}`] ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden /> : <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-muted/50" aria-hidden />}
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {tab === 'tools' && (
        <div className="space-y-6">
          {module.tools.map((id) => {
            const tool = TOOLS[id]
            return (
              <Card key={id} as="section" className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{tool.title}</h2>
                    <p className="text-sm text-muted">{tool.description}</p>
                  </div>
                  <Badge>{tool.kind}</Badge>
                </div>
                <tool.Component />
              </Card>
            )
          })}
          {module.sorts?.map((s) => (
            <SortGame key={s.id} exercise={s} />
          ))}
        </div>
      )}

      {tab === 'cases' && (
        <div className="space-y-6">
          <p className="text-sm text-muted">Commit to an answer at each step before the case reveals more — that retrieval is what builds clinical judgment.</p>
          {module.cases.map((c) => (
            <CaseStepper key={c.id} clinicalCase={c} />
          ))}
        </div>
      )}

      {tab === 'drill' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Chip active={drill === 'questions'} onClick={() => setDrill('questions')}>
              <span className="inline-flex items-center gap-1.5"><FlaskConical className="h-4 w-4" aria-hidden /> Questions ({module.questions.length})</span>
            </Chip>
            <Chip active={drill === 'cards'} onClick={() => setDrill('cards')}>
              <span className="inline-flex items-center gap-1.5"><Layers className="h-4 w-4" aria-hidden /> Flashcards ({module.flashcards.length})</span>
            </Chip>
          </div>
          <div className="max-w-3xl">
            {drill === 'questions' ? <QuizSession questions={module.questions} title={module.shortTitle} seed={idx + 1} /> : <FlashcardDeck cards={cards} />}
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between" aria-label="Module navigation">
        {prev ? (
          <Link to={`/${prev.slug}`} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm hover:border-primary">
            <span className="block text-xs text-muted">← Previous</span>
            <span className="font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/${next.slug}`} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm hover:border-primary sm:text-right">
            <span className="block text-xs text-muted">Next →</span>
            <span className="font-medium">{next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  )
}
