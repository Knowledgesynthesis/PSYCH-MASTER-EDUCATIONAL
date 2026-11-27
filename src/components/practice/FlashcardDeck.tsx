import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, Shuffle } from 'lucide-react'
import type { Flashcard } from '../../content/types'
import { useProgress } from '../../store/progress'
import { INTERVAL_DAYS, MAX_BOX, isDue, type Grade } from '../../lib/srs'
import { mulberry32, shuffle } from '../../lib/random'
import { cn } from '../../lib/cn'
import { RichText } from '../RichText'
import { Button, Card, ProgressBar } from '../ui'

interface Props {
  cards: (Flashcard & { moduleTitle?: string })[]
  /** "due": spaced-repetition queue; "all": cram every card once. */
  mode?: 'due' | 'all'
}

function intervalLabel(box: number): string {
  const d = INTERVAL_DAYS[Math.min(MAX_BOX, box)]
  return d === 0 ? '<1 day' : d === 1 ? '1 day' : `${d} days`
}

export function FlashcardDeck({ cards, mode = 'due' }: Props) {
  const states = useProgress((s) => s.cards)
  const gradeCard = useProgress((s) => s.gradeCard)
  const [seed, setSeed] = useState(1)
  const [queueMode, setQueueMode] = useState(mode)

  // Build the queue once per session/seed so grading doesn't reshuffle mid-review.
  const [queue, setQueue] = useState<string[]>([])
  useEffect(() => {
    const now = Date.now()
    const pool = queueMode === 'due' ? cards.filter((c) => isDue(states[c.id], now)) : cards
    setQueue(shuffle(pool.map((c) => c.id), mulberry32(seed)))
    setFlipped(false)
    setDoneCount(0)
  }, [cards, seed, queueMode])

  const [flipped, setFlipped] = useState(false)
  const [doneCount, setDoneCount] = useState(0)
  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])
  const card = queue.length ? byId.get(queue[0]) : undefined
  const total = doneCount + queue.length

  const grade = (g: Grade) => {
    if (!card) return
    gradeCard(card.id, g)
    setFlipped(false)
    setQueue((q) => {
      const [head, ...rest] = q
      // "Again" re-queues the card a few positions later in this session.
      if (g === 'again') {
        const at = Math.min(rest.length, 3)
        return [...rest.slice(0, at), head, ...rest.slice(at)]
      }
      return rest
    })
    if (g !== 'again') setDoneCount((n) => n + 1)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!card || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target instanceof HTMLButtonElement && e.key === 'Enter') return
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (flipped && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        grade(e.key === '1' ? 'again' : e.key === '2' ? 'good' : 'easy')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const nextDue = useMemo(() => {
    const future = cards.map((c) => states[c.id]?.due).filter((d): d is number => typeof d === 'number' && d > Date.now())
    return future.length ? Math.min(...future) : null
  }, [cards, states])

  if (!card) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" aria-hidden />
        <p className="mt-3 font-semibold">{doneCount > 0 ? `Session complete — ${doneCount} card${doneCount === 1 ? '' : 's'} reviewed.` : 'Nothing due right now.'}</p>
        <p className="mt-1 text-sm text-muted">
          {nextDue ? `Next card due ${new Date(nextDue).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}.` : 'Spaced repetition schedules each card just before you would forget it.'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => { setQueueMode('all'); setSeed((s) => s + 1) }}>
            <Shuffle className="h-4 w-4" aria-hidden /> Cram all {cards.length} cards
          </Button>
        </div>
      </Card>
    )
  }

  const state = states[card.id]
  const box = state?.box ?? 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <span>
          {queueMode === 'due' ? 'Due' : 'Cram'} · {doneCount}/{total}
        </span>
        <button type="button" className="inline-flex items-center gap-1 hover:text-text" onClick={() => setSeed((s) => s + 1)}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Restart
        </button>
      </div>
      <ProgressBar value={total ? (doneCount / total) * 100 : 0} label="Session progress" />
      <div className="flip-card">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? 'Show question' : 'Reveal answer'}
          className={cn('flip-inner relative grid w-full text-left', flipped && 'is-flipped')}
        >
          <div className="flip-face col-start-1 row-start-1 flex min-h-56 flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm">
            {card.moduleTitle && <span className="text-xs font-medium uppercase tracking-wide text-muted">{card.moduleTitle}</span>}
            <div className="flex flex-1 items-center">
              <p className="w-full text-lg font-semibold leading-snug"><RichText text={card.front} /></p>
            </div>
            <span className="text-xs text-muted">Tap or press Space to reveal</span>
          </div>
          <div className="flip-face flip-back col-start-1 row-start-1 flex min-h-56 flex-col rounded-2xl border border-primary/40 bg-primary-soft p-6 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-primary">Answer</span>
            <div className="flex flex-1 items-center">
              <p className="w-full text-[15px] leading-relaxed"><RichText text={card.back} /></p>
            </div>
          </div>
        </button>
      </div>
      <div className={cn('grid grid-cols-3 gap-2 transition-opacity', flipped ? 'opacity-100' : 'pointer-events-none opacity-0')} aria-hidden={!flipped}>
        <Button variant="outline" onClick={() => grade('again')} tabIndex={flipped ? 0 : -1} className="h-auto flex-col py-2">
          <span>Again</span>
          <span className="text-[11px] font-normal text-muted">1 · &lt;10 min</span>
        </Button>
        <Button variant="secondary" onClick={() => grade('good')} tabIndex={flipped ? 0 : -1} className="h-auto flex-col py-2">
          <span>Good</span>
          <span className="text-[11px] font-normal text-muted">2 · {intervalLabel(box + 1)}</span>
        </Button>
        <Button onClick={() => grade('easy')} tabIndex={flipped ? 0 : -1} className="h-auto flex-col py-2">
          <span>Easy</span>
          <span className="text-[11px] font-normal opacity-80">3 · {intervalLabel(box + 2)}</span>
        </Button>
      </div>
    </div>
  )
}
