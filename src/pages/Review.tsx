import { useEffect, useMemo, useState } from 'react'
import { ALL_FLASHCARDS, MODULES } from '../content'
import { useProgress } from '../store/progress'
import { isDue, isLearned } from '../lib/srs'
import { Card, Chip } from '../components/ui'
import { FlashcardDeck } from '../components/practice/FlashcardDeck'

export default function Review() {
  const cards = useProgress((s) => s.cards)
  const [topic, setTopic] = useState<string | null>(null)
  useEffect(() => {
    document.title = 'Flashcards — Psych Master'
  }, [])

  const deck = useMemo(() => ALL_FLASHCARDS.filter((c) => !topic || c.moduleId === topic), [topic])
  const now = Date.now()
  const due = deck.filter((c) => cards[c.id] && isDue(cards[c.id], now)).length
  const unseen = deck.filter((c) => !cards[c.id]).length
  const learned = deck.filter((c) => isLearned(cards[c.id])).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Spaced repetition: recall the answer before flipping, then grade yourself honestly. Cards you know come back after longer intervals (1 → 3 → 7 → 16 → 35 days); misses return within minutes.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-2xl font-bold tabular-nums">{due}</p><p className="text-sm text-muted">due for review</p></Card>
        <Card className="p-4"><p className="text-2xl font-bold tabular-nums">{unseen}</p><p className="text-sm text-muted">not yet studied</p></Card>
        <Card className="p-4"><p className="text-2xl font-bold tabular-nums">{learned}</p><p className="text-sm text-muted">learned (≥1-week interval)</p></Card>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip active={!topic} onClick={() => setTopic(null)}>All topics</Chip>
        {MODULES.map((m) => (
          <Chip key={m.id} active={topic === m.id} onClick={() => setTopic(m.id)}>{m.shortTitle}</Chip>
        ))}
      </div>
      <div className="max-w-2xl">
        <FlashcardDeck key={topic ?? 'all'} cards={deck} />
      </div>
    </div>
  )
}
