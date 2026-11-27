import { useMemo, useState } from 'react'
import { ArrowRight, RotateCcw, Shapes } from 'lucide-react'
import type { SortExercise } from '../../content/types'
import { mulberry32, shuffle } from '../../lib/random'
import { cn } from '../../lib/cn'
import { RichText } from '../RichText'
import { Button, Card, ProgressBar } from '../ui'

export function SortGame({ exercise }: { exercise: SortExercise }) {
  const [seed, setSeed] = useState(7)
  const items = useMemo(() => shuffle(exercise.items, mulberry32(seed)), [exercise, seed])
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState<string[]>([])

  const item = items[index]
  const done = index >= items.length

  const pick = (bin: string) => {
    if (choice) return
    setChoice(bin)
    if (bin === item.bin) setScore((s) => s + 1)
    else setMisses((m) => [...m, item.text])
  }
  const next = () => {
    setChoice(null)
    setIndex((i) => i + 1)
  }
  const restart = () => {
    setSeed((s) => s + 1)
    setIndex(0)
    setChoice(null)
    setScore(0)
    setMisses([])
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3 flex items-start gap-2">
        <Shapes className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
        <div>
          <h3 className="font-semibold">{exercise.title}</h3>
          <p className="text-sm text-muted">{exercise.instructions}</p>
        </div>
      </div>
      <ProgressBar value={(Math.min(index, items.length) / items.length) * 100} className="mb-4" label="Sorting progress" />
      {!done ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface-2/60 p-4 text-center text-[15px] font-medium">
            <RichText text={item.text} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {exercise.bins.map((bin) => (
              <button
                key={bin}
                type="button"
                onClick={() => pick(bin)}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                  !choice && 'border-border bg-surface hover:border-primary hover:bg-primary-soft',
                  choice && bin === item.bin && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
                  choice && bin === choice && bin !== item.bin && 'border-red-500 bg-red-50 dark:bg-red-950/40',
                  choice && bin !== item.bin && bin !== choice && 'border-border opacity-60',
                )}
              >
                {bin}
              </button>
            ))}
          </div>
          {choice && (
            <div className="fade-in space-y-3">
              <p className={cn('text-sm', choice === item.bin ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>
                <strong>{choice === item.bin ? 'Correct.' : `It's ${item.bin}.`}</strong> <RichText text={item.why} />
              </p>
              <div className="flex justify-end">
                <Button onClick={next}>
                  {index < items.length - 1 ? 'Next' : 'See score'} <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-lg font-semibold">
            {score}/{items.length} sorted correctly
          </p>
          {misses.length > 0 && (
            <div className="text-sm">
              <p className="font-medium">Revisit:</p>
              <ul className="mt-1 list-disc pl-5 text-muted">
                {misses.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <Button variant="outline" onClick={restart}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Shuffle and retry
          </Button>
        </div>
      )}
    </Card>
  )
}
