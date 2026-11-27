import { useMemo, useState } from 'react'
import { ArrowRight, RotateCcw, Stethoscope, Trophy } from 'lucide-react'
import type { ClinicalCase } from '../../content/types'
import { useProgress } from '../../store/progress'
import { cn } from '../../lib/cn'
import { RichText } from '../RichText'
import { Badge, Button, Callout, Card } from '../ui'
import { QuestionCard } from './QuestionCard'

export function CaseStepper({ clinicalCase }: { clinicalCase: ClinicalCase }) {
  const recordCase = useProgress((s) => s.recordCase)
  const best = useProgress((s) => s.cases[clinicalCase.id])
  const [step, setStep] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>([])
  const [results, setResults] = useState<boolean[]>([])
  const [done, setDone] = useState(false)
  const [run, setRun] = useState(0)

  const total = clinicalCase.steps.length
  const current = clinicalCase.steps[step]
  const question = useMemo(
    () => (current ? { prompt: current.prompt, options: current.options, answer: current.answer, explanation: current.explanation } : null),
    [current],
  )

  const onAnswer = (correct: boolean) => {
    setAnswered((a) => {
      const n = a.slice()
      n[step] = true
      return n
    })
    setResults((r) => {
      const n = r.slice()
      n[step] = correct
      return n
    })
  }

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1)
      return
    }
    const score = results.filter(Boolean).length
    recordCase(clinicalCase.id, score, total)
    setDone(true)
  }

  const restart = () => {
    setStep(0)
    setAnswered([])
    setResults([])
    setDone(false)
    setRun((r) => r + 1)
  }

  const score = results.filter(Boolean).length

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-surface-2/50 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-4 w-4 text-primary" aria-hidden /> {clinicalCase.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{clinicalCase.setting}</p>
        </div>
        <div className="flex items-center gap-2">
          {best?.completed && <Badge>Best {best.firstTryCorrect}/{best.steps}</Badge>}
          <div className="flex gap-1" aria-label={`Step ${Math.min(step + 1, total)} of ${total}`}>
            {clinicalCase.steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 w-6 rounded-full',
                  i < step || done ? (results[i] ? 'bg-emerald-500' : 'bg-red-400') : i === step ? 'bg-primary' : 'bg-border',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {clinicalCase.steps.slice(0, done ? total : step).map((s, i) => (
          <div key={i} className="border-l-2 border-border pl-3 text-sm text-muted">
            <RichText text={s.reveal} />
            <p className="mt-1 text-xs">
              <span className={results[i] ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>{results[i] ? '✓' : '✕'}</span>{' '}
              {s.prompt} → <span className="font-medium text-text">{s.options[s.answer].text}</span>
            </p>
          </div>
        ))}

        {!done && current && (
          <div key={`${run}-${step}`} className="fade-in space-y-4">
            <div className="rounded-xl border border-primary/25 bg-primary-soft/50 p-3 text-[15px] leading-relaxed">
              <RichText text={current.reveal} />
            </div>
            {question && <QuestionCard question={question} onAnswer={onAnswer} seed={run * 97 + step + 1} />}
            {answered[step] && (
              <div className="flex justify-end">
                <Button onClick={next}>
                  {step < total - 1 ? 'Next step' : 'Finish case'} <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className="fade-in space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden /> {score}/{total} correct on first try
            </div>
            <Callout tone="success" title="Take-home">
              <RichText text={clinicalCase.takeaway} />
            </Callout>
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Replay case
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
