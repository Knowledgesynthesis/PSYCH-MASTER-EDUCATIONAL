import { useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { ALL_QUESTIONS, MODULES } from '../content'
import { useProgress } from '../store/progress'
import { mulberry32, shuffle } from '../lib/random'
import { Button, Card, Chip, ProgressBar, SectionHeading } from '../components/ui'
import { QuizSession } from '../components/practice/QuizSession'

type Filter = 'all' | 'new' | 'missed'

export default function Practice() {
  const progress = useProgress((s) => s.questions)
  const [topics, setTopics] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [size, setSize] = useState<number>(20)
  const [mode, setMode] = useState<'learn' | 'exam'>('learn')
  const [session, setSession] = useState<{ seed: number; ids: string[] } | null>(null)

  useEffect(() => {
    document.title = 'Question bank — Psych Master'
  }, [])

  const pool = useMemo(
    () =>
      ALL_QUESTIONS.filter((q) => (topics.length === 0 || topics.includes(q.moduleId)) && (filter === 'all' || (filter === 'new' ? !progress[q.id] : progress[q.id] && !progress[q.id].correct))),
    [topics, filter, progress],
  )

  const start = () => {
    const seed = Math.floor(Math.random() * 1e9)
    const ids = shuffle(pool, mulberry32(seed))
      .slice(0, size === 0 ? pool.length : size)
      .map((q) => q.id)
    setSession({ seed, ids })
  }

  const sessionQuestions = useMemo(() => (session ? session.ids.map((id) => ALL_QUESTIONS.find((q) => q.id === id)!).filter(Boolean) : []), [session])

  if (session) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <SectionHeading title="Question bank" subtitle={`${mode === 'exam' ? 'Exam' : 'Learning'} mode · ${sessionQuestions.length} questions`} />
        <QuizSession questions={sessionQuestions} mode={mode} seed={session.seed} onExit={() => setSession(null)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Question bank</h1>
        <p className="mt-1 text-muted">{ALL_QUESTIONS.length} vignette-based questions with a rationale for every option. Mixing topics (interleaving) strengthens discrimination between look-alike disorders.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="space-y-6 p-5 sm:p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">Topics {topics.length === 0 && <span className="font-normal text-muted">(all)</span>}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={topics.length === 0} onClick={() => setTopics([])}>All</Chip>
              {MODULES.map((m) => (
                <Chip key={m.id} active={topics.includes(m.id)} onClick={() => setTopics((t) => (t.includes(m.id) ? t.filter((x) => x !== m.id) : [...t, m.id]))}>
                  {m.shortTitle}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-semibold">Questions</p>
              <div className="flex flex-wrap gap-2">
                {(['all', 'new', 'missed'] as Filter[]).map((f) => (
                  <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'All' : f === 'new' ? 'Unseen' : 'Missed'}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Length</p>
              <div className="flex flex-wrap gap-2">
                {[10, 20, 0].map((n) => (
                  <Chip key={n} active={size === n} onClick={() => setSize(n)}>
                    {n === 0 ? 'All' : n}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Mode</p>
              <div className="flex flex-wrap gap-2">
                <Chip active={mode === 'learn'} onClick={() => setMode('learn')}>Learning</Chip>
                <Chip active={mode === 'exam'} onClick={() => setMode('exam')}>Exam</Chip>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted">{mode === 'learn' ? 'Learning: feedback after each answer.' : 'Exam: no feedback until you submit — closer to test conditions.'}</p>
          <Button size="lg" onClick={start} disabled={pool.length === 0}>
            <Play className="h-4 w-4" aria-hidden /> Start {size === 0 || size > pool.length ? pool.length : size} questions
          </Button>
          {pool.length === 0 && <p className="text-sm text-muted">No questions match. {filter === 'missed' ? 'No misses yet — nice.' : filter === 'new' ? 'You have seen every question in these topics.' : ''}</p>}
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="mb-3 text-sm font-semibold">Accuracy by topic (latest attempt)</p>
          <ul className="space-y-3">
            {MODULES.map((m) => {
              const qs = m.questions
              const answered = qs.filter((q) => progress[q.id]).length
              const correct = qs.filter((q) => progress[q.id]?.correct).length
              return (
                <li key={m.id} className="text-sm">
                  <div className="mb-1 flex justify-between">
                    <span>{m.shortTitle}</span>
                    <span className="tabular-nums text-muted">{answered ? `${correct}/${answered}` : '—'} <span className="text-xs">of {qs.length}</span></span>
                  </div>
                  <ProgressBar value={answered ? (correct / qs.length) * 100 : 0} label={`${m.shortTitle} accuracy`} />
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}
