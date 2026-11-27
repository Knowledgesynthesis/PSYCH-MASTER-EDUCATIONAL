import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import type { Question } from '../../content/types'
import { useProgress } from '../../store/progress'
import { cn } from '../../lib/cn'
import { RichText } from '../RichText'
import { Badge, Button, Card, ProgressBar } from '../ui'
import { QuestionCard } from './QuestionCard'

type Q = Question & { moduleTitle?: string }

interface Props {
  questions: Q[]
  mode?: 'learn' | 'exam'
  seed?: number
  onExit?: () => void
  title?: string
}

export function QuizSession({ questions, mode = 'learn', seed = 1, onExit, title }: Props) {
  const recordAnswer = useProgress((s) => s.recordAnswer)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState(false)
  const [round, setRound] = useState(0)
  const [pool, setPool] = useState<Q[]>(questions)

  useEffect(() => {
    setPool(questions)
    setIndex(0)
    setAnswers({})
    setFinished(false)
  }, [questions])

  const q = pool[index]
  const answeredCount = Object.keys(answers).length
  const correctCount = pool.filter((x) => answers[x.id] === x.answer).length

  const onAnswer = (correct: boolean, chosen: number) => {
    setAnswers((a) => ({ ...a, [q.id]: chosen }))
    if (mode === 'learn') recordAnswer(q.id, correct)
  }

  const finish = () => {
    if (mode === 'exam') pool.forEach((x) => answers[x.id] !== undefined && recordAnswer(x.id, answers[x.id] === x.answer))
    setFinished(true)
  }

  const next = () => (index < pool.length - 1 ? setIndex(index + 1) : finish())

  useEffect(() => {
    if (finished) return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && q && answers[q.id] !== undefined) {
        if (e.target instanceof HTMLButtonElement && e.key === 'Enter') return
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        setIndex(index - 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const missed = useMemo(() => pool.filter((x) => answers[x.id] !== undefined && answers[x.id] !== x.answer), [pool, answers])

  if (pool.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-muted">
        No questions match these filters.
        {onExit && (
          <div className="mt-3">
            <Button variant="outline" onClick={onExit}>Change filters</Button>
          </div>
        )}
      </Card>
    )
  }

  if (finished) {
    const pct = Math.round((correctCount / pool.length) * 100)
    return (
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-500" aria-hidden />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {correctCount}/{pool.length} <span className="text-base font-medium text-muted">({pct}%)</span>
            </p>
            <p className="text-sm text-muted">{pct >= 85 ? 'Excellent — space your next review a few days out.' : pct >= 60 ? 'Solid. Review the misses below, then retry them.' : 'Re-read the Learn sections for the missed topics, then retry.'}</p>
          </div>
        </div>
        {missed.length > 0 && (
          <div className="space-y-3">
            <p className="font-semibold">Review your misses</p>
            <ul className="space-y-3">
              {missed.map((x) => (
                <li key={x.id} className="rounded-xl border border-border p-3 text-sm">
                  {x.moduleTitle && <Badge className="mb-1">{x.moduleTitle}</Badge>}
                  <p className="font-medium"><RichText text={x.stem} /></p>
                  <p className="mt-1 text-red-700 dark:text-red-300">You chose: {x.options[answers[x.id]].text}</p>
                  <p className="text-emerald-700 dark:text-emerald-300">Answer: {x.options[x.answer].text}</p>
                  <p className="mt-1 text-muted"><RichText text={x.explanation} /></p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {missed.length > 0 && (
            <Button
              onClick={() => {
                setPool(missed)
                setAnswers({})
                setIndex(0)
                setFinished(false)
                setRound((r) => r + 1)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Retry {missed.length} missed
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setPool(questions)
              setAnswers({})
              setIndex(0)
              setFinished(false)
              setRound((r) => r + 1)
            }}
          >
            Restart all
          </Button>
          {onExit && <Button variant="ghost" onClick={onExit}>New session</Button>}
        </div>
      </Card>
    )
  }

  const chosen = answers[q.id]
  return (
    <Card className="overflow-hidden">
      <div className="space-y-2 border-b border-border bg-surface-2/50 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium">
            {title ? `${title} · ` : ''}Question {index + 1} of {pool.length}
          </span>
          <span className="flex items-center gap-2">
            {q.moduleTitle && <Badge>{q.moduleTitle}</Badge>}
            {mode === 'exam' ? <Badge>Exam mode</Badge> : <span className="text-muted tabular-nums">{correctCount}/{answeredCount} correct</span>}
          </span>
        </div>
        <ProgressBar value={(answeredCount / pool.length) * 100} label="Quiz progress" />
      </div>
      <div className="p-4 sm:p-5">
        <QuestionCard
          key={`${round}-${q.id}`}
          question={q}
          seed={seed * 1000 + round * 100 + index}
          onAnswer={onAnswer}
          exam={mode === 'exam'}
          reveal={mode !== 'exam'}
          initialChoice={chosen ?? null}
          keyboard
        />
        <div className="mt-5 flex items-center justify-between gap-2">
          <Button variant="ghost" onClick={() => setIndex(index - 1)} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </Button>
          <div className={cn('flex gap-2')}>
            {mode === 'exam' && answeredCount === pool.length && index < pool.length - 1 && (
              <Button variant="outline" onClick={finish}>Submit exam</Button>
            )}
            <Button onClick={next} disabled={chosen === undefined}>
              {index < pool.length - 1 ? 'Next' : mode === 'exam' ? 'Submit exam' : 'Finish'} <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
        <p className="mt-3 hidden text-xs text-muted sm:block">Keys: 1–5 choose · Enter/→ next · ← back</p>
      </div>
    </Card>
  )
}
