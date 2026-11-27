import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { Option } from '../../content/types'
import { cn } from '../../lib/cn'
import { mulberry32, shuffle } from '../../lib/random'
import { RichText } from '../RichText'
import { Callout } from '../ui'

export interface QuestionLike {
  stem?: string
  prompt?: string
  options: Option[]
  answer: number
  explanation: string
}

interface Props {
  question: QuestionLike
  /** Called once, on the first answer. */
  onAnswer?: (correct: boolean, chosenOriginalIndex: number) => void
  /** Shuffle option order with this seed (keeps answer mapping). */
  seed?: number
  /** Exam mode hides feedback until `reveal` is true. */
  reveal?: boolean
  exam?: boolean
  keyboard?: boolean
  /** Restore a previously chosen answer (original index). */
  initialChoice?: number | null
}

const LETTERS = 'ABCDEFG'

export function QuestionCard({ question, onAnswer, seed, exam = false, reveal = true, keyboard = false, initialChoice = null }: Props) {
  const order = useMemo(() => {
    const idx = question.options.map((_, i) => i)
    return seed === undefined ? idx : shuffle(idx, mulberry32(seed))
  }, [question, seed])
  // Parents remount this component (via `key`) for each new question, so local state never needs resetting.
  const [choice, setChoice] = useState<number | null>(initialChoice)

  const locked = choice !== null
  const showFeedback = locked && (!exam || reveal)

  const choose = (original: number) => {
    if (locked && !exam) return
    if (exam && reveal) return
    const first = choice === null
    setChoice(original)
    if (first || exam) onAnswer?.(original === question.answer, original)
  }

  useEffect(() => {
    if (!keyboard) return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= order.length) {
        e.preventDefault()
        choose(order[n - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const correct = choice === question.answer

  return (
    <div className="space-y-4">
      {(question.stem ?? question.prompt) && (
        <p className="text-[15px] font-medium leading-relaxed"><RichText text={(question.stem ?? question.prompt)!} /></p>
      )}
      <div className="space-y-2" role="group" aria-label="Answer options">
        {order.map((original, pos) => {
          const opt = question.options[original]
          const isChosen = choice === original
          const isAnswer = original === question.answer
          return (
            <div key={original}>
              <button
                type="button"
                onClick={() => choose(original)}
                aria-pressed={isChosen}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                  !showFeedback && isChosen && 'border-primary bg-primary-soft',
                  !showFeedback && !isChosen && 'border-border bg-surface hover:border-primary/50 hover:bg-surface-2',
                  showFeedback && isAnswer && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
                  showFeedback && isChosen && !isAnswer && 'border-red-500 bg-red-50 dark:bg-red-950/40',
                  showFeedback && !isChosen && !isAnswer && 'border-border bg-surface opacity-80',
                  showFeedback && 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold',
                    showFeedback && isAnswer ? 'border-emerald-600 bg-emerald-600 text-white' : showFeedback && isChosen ? 'border-red-600 bg-red-600 text-white' : 'border-border',
                  )}
                  aria-hidden
                >
                  {showFeedback && isAnswer ? '✓' : showFeedback && isChosen ? '✕' : LETTERS[pos]}
                </span>
                <span className="min-w-0 flex-1 pt-0.5"><RichText text={opt.text} /></span>
              </button>
              {showFeedback && (isChosen || isAnswer) && (
                <p className={cn('fade-in mt-1 ml-9 text-sm', isAnswer ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>
                  <RichText text={opt.why} />
                </p>
              )}
            </div>
          )
        })}
      </div>
      {showFeedback && (
        <div className="fade-in space-y-3">
          <div className={cn('flex items-center gap-2 text-sm font-semibold', correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>
            {correct ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <XCircle className="h-5 w-5" aria-hidden />}
            <span role="status">{correct ? 'Correct' : 'Not quite'}</span>
          </div>
          <Callout tone="pearl" title="Teaching point">
            <RichText text={question.explanation} />
          </Callout>
          <details className="rounded-xl border border-border bg-surface-2/50 p-3 text-sm">
            <summary className="cursor-pointer font-medium">Why each other option is wrong</summary>
            <ul className="mt-2 space-y-2">
              {order
                .filter((o) => o !== question.answer && o !== choice)
                .map((o) => (
                  <li key={o}>
                    <span className="font-medium">{question.options[o].text}</span>
                    <span className="text-muted"> — <RichText text={question.options[o].why} /></span>
                  </li>
                ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  )
}
