import { useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { ArrowRight, BookOpenCheck, Brain, Calculator, ClipboardCheck, Layers, Repeat, Sparkles, Stethoscope } from 'lucide-react'
import { ALL_FLASHCARDS, ALL_QUESTIONS, MODULES, MODULE_BY_SLUG } from '../content'
import { useProgress } from '../store/progress'
import { moduleMastery, masteryLabel } from '../lib/mastery'
import { isDue, isLearned } from '../lib/srs'
import { cn } from '../lib/cn'
import { Card, ProgressBar, ProgressRing } from '../components/ui'
import { ACCENT } from '../components/accent'
import { MODULE_ICONS } from '../components/icons'
import { TOOLS } from '../components/tools/registry'

const UPDATES: { date: string; text: string; slug: string }[] = [
  { date: 'Nov 2026', text: 'Psilocybin (COMP360) NDA submitted for treatment-resistant depression — not approved; Schedule I.', slug: 'mdd' },
  { date: 'Aug 2026', text: 'MDMA-assisted therapy for PTSD resubmitted to FDA after the 2024 rejection — decision pending.', slug: 'ptsd' },
  { date: 'Jul 2026', text: 'Centanafadine (Simtriyo) approved for ADHD (≥6 years and adults) — a new reuptake-inhibitor class.', slug: 'adhd' },
  { date: 'Apr 2026', text: 'CDC alert: medetomidine in the fentanyl supply causes severe, treatment-resistant withdrawal.', slug: 'sud' },
  { date: 'Feb 2026', text: 'Milsaperidone (Bysanti) approved for bipolar I manic/mixed episodes and schizophrenia.', slug: 'bipolar' },
  { date: 'Jan 2026', text: 'APA roadmap for a future “living” DSM; DSM-5-TR remains current.', slug: 'foundations' },
  { date: 'Nov 2025', text: 'Lumateperone approved as adjunctive treatment for MDD.', slug: 'mdd' },
  { date: 'Sep 2025', text: 'FDA declines brexpiprazole + sertraline for PTSD.', slug: 'ptsd' },
  { date: 'Jun 2025', text: 'Clozapine REMS eliminated — ANC monitoring per label continues. FDA warns about extended-release stimulants under age 6.', slug: 'psychosis' },
  { date: 'Jan 2025', text: 'Esketamine nasal spray approved as monotherapy for treatment-resistant depression.', slug: 'mdd' },
]

export default function Home() {
  const progress = useProgress()
  useEffect(() => {
    document.title = 'Psych Master — Evidence-Based Psychiatry'
  }, [])

  const stats = useMemo(() => {
    const masteries = MODULES.map((m) => moduleMastery(m, progress))
    const overall = Math.round(masteries.reduce((s, m) => s + m.percent, 0) / MODULES.length)
    const answered = ALL_QUESTIONS.filter((q) => progress.questions[q.id]).length
    const correct = ALL_QUESTIONS.filter((q) => progress.questions[q.id]?.correct).length
    const now = Date.now()
    const due = ALL_FLASHCARDS.filter((c) => progress.cards[c.id] && isDue(progress.cards[c.id], now)).length
    const newCards = ALL_FLASHCARDS.filter((c) => !progress.cards[c.id]).length
    const learned = ALL_FLASHCARDS.filter((c) => isLearned(progress.cards[c.id])).length
    const casesDone = MODULES.reduce((s, m) => s + m.cases.filter((c) => progress.cases[c.id]?.completed).length, 0)
    const casesTotal = MODULES.reduce((s, m) => s + m.cases.length, 0)
    const weakest = MODULES.map((m, i) => ({ m, p: masteries[i] }))
      .filter((x) => x.p.quiz.answered > 0)
      .sort((a, b) => a.p.quiz.correct / a.p.quiz.answered - b.p.quiz.correct / b.p.quiz.answered)[0]
    return { masteries, overall, answered, correct, due, newCards, learned, casesDone, casesTotal, weakest }
  }, [progress])

  const started = stats.answered > 0 || Object.keys(progress.sectionsRead).length > 0 || Object.keys(progress.cards).length > 0
  const last = progress.lastVisited ? MODULE_BY_SLUG[progress.lastVisited.slice(1)] : undefined

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> DSM-5-TR · guidelines current to late 2026
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Master clinical psychiatry by doing it.</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-text/80">
              Ten modules that take you from criteria to management: decision engines that show which rule fired, validated scales, branching cases,
              {` ${ALL_QUESTIONS.length}`} questions with rationales for every option, and {ALL_FLASHCARDS.length} spaced-repetition flashcards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {last && started ? (
                <Link to={last.slug ? `/${last.slug}` : '/'} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg hover:bg-primary-hover">
                  Continue: {last.shortTitle} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <Link to="/foundations" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg hover:bg-primary-hover">
                  Start with Foundations <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              <Link to="/review" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-medium hover:bg-surface-2">
                <Layers className="h-4 w-4" aria-hidden />
                {stats.due > 0 ? `Review ${stats.due} due card${stats.due === 1 ? '' : 's'}` : 'Flashcards'}
              </Link>
              <Link to="/practice" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-medium hover:bg-surface-2">
                <ClipboardCheck className="h-4 w-4" aria-hidden /> Question bank
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-surface-2/60 p-5">
            <ProgressRing value={stats.overall} size={104} stroke={9} label={`Overall mastery ${stats.overall}%`} />
            <dl className="space-y-1.5 text-sm">
              <div><dt className="inline text-muted">Mastery: </dt><dd className="inline font-semibold">{masteryLabel(stats.overall)}</dd></div>
              <div><dt className="inline text-muted">Questions: </dt><dd className="inline font-semibold tabular-nums">{stats.correct}/{ALL_QUESTIONS.length}</dd></div>
              <div><dt className="inline text-muted">Cases: </dt><dd className="inline font-semibold tabular-nums">{stats.casesDone}/{stats.casesTotal}</dd></div>
              <div><dt className="inline text-muted">Cards learned: </dt><dd className="inline font-semibold tabular-nums">{stats.learned}/{ALL_FLASHCARDS.length}</dd></div>
            </dl>
          </div>
        </div>
        {stats.weakest && (
          <p className="relative mt-6 text-sm text-muted">
            Weakest area so far: <Link to={`/${stats.weakest.m.slug}?tab=drill`} className="font-medium text-primary hover:underline">{stats.weakest.m.title}</Link> ({stats.weakest.p.quiz.correct}/{stats.weakest.p.quiz.answered} correct) — drill it next.
          </p>
        )}
      </section>

      {/* Method */}
      <section aria-labelledby="method">
        <h2 id="method" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">How each module builds mastery</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpenCheck, title: 'Learn', text: 'Bottom line first, then criteria, differentials, workup and management with sources.' },
            { icon: Calculator, title: 'Apply', text: 'Decision engines and scales show exactly which criterion passes or fails.' },
            { icon: Stethoscope, title: 'Reason', text: 'Branching cases: commit at every step, then see why each option is right or wrong.' },
            { icon: Repeat, title: 'Retain', text: 'Retrieval practice and spaced repetition — the two best-evidenced study methods.' },
          ].map((s) => (
            <Card key={s.title} className="p-4">
              <s.icon className="h-6 w-6 text-primary" aria-hidden />
              <p className="mt-2 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning path */}
      <section aria-labelledby="path">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 id="path" className="text-xl font-semibold tracking-tight sm:text-2xl">Learning path</h2>
          <span className="text-sm text-muted">{MODULES.length} modules</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m, i) => {
            const mm = stats.masteries[i]
            const Icon = MODULE_ICONS[m.icon]
            const a = ACCENT[m.accent]
            return (
              <Link key={m.id} to={`/${m.slug}`} className="group">
                <Card className="flex h-full flex-col p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', a.soft)}>
                      <Icon className={cn('h-6 w-6', a.text)} aria-hidden />
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug">{m.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted">{m.tagline}</p>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">{masteryLabel(mm.percent)}</span>
                      <span className="font-semibold tabular-nums">{mm.percent}%</span>
                    </div>
                    <ProgressBar value={mm.percent} barClass={a.bar} label={`${m.title} mastery`} />
                    <p className="text-[11px] text-muted">
                      {m.sections.length} sections · {m.tools.length} tools · {m.cases.length} cases · {m.questions.length} Qs · {m.flashcards.length} cards
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Tools + updates */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Calculator className="h-5 w-5 text-primary" aria-hidden /> Clinical tools
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.values(TOOLS).map((t) => (
              <li key={t.id}>
                <Link to={`/tools/${t.id}`} className="block rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2">
                  <span className="font-medium">{t.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Brain className="h-5 w-5 text-primary" aria-hidden /> What changed recently
          </h2>
          <ol className="mt-3 space-y-2.5">
            {UPDATES.map((u) => (
              <li key={u.text} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 text-xs font-semibold tabular-nums text-muted">{u.date}</span>
                <Link to={`/${u.slug}`} className="hover:text-primary">{u.text}</Link>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  )
}
