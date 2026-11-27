import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { GLOSSARY } from '../content/glossary'
import { Card, Chip } from '../components/ui'

export default function Glossary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string | null>(null)
  useEffect(() => {
    document.title = 'Glossary — Psych Master'
  }, [])
  const categories = useMemo(() => Array.from(new Set(GLOSSARY.map((g) => g.category))), [])
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return GLOSSARY.filter((g) => (!cat || g.category === cat) && (!needle || `${g.term} ${g.definition} ${g.contrast ?? ''}`.toLowerCase().includes(needle))).sort((a, b) => a.term.localeCompare(b.term))
  }, [q, cat])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Glossary</h1>
        <p className="mt-1 text-muted">{GLOSSARY.length} terms used in mental status exams, diagnosis and treatment — with the contrasts that are easiest to confuse.</p>
      </div>
      <label className="relative block max-w-xl">
        <span className="sr-only">Search terms</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms or definitions…"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Chip active={!cat} onClick={() => setCat(null)}>All</Chip>
        {categories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <p className="text-sm text-muted" aria-live="polite">{results.length} term{results.length === 1 ? '' : 's'}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((g) => (
          <Card key={g.term} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{g.term}</h2>
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted">{g.category}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-text/85">{g.definition}</p>
            {g.contrast && <p className="mt-2 rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs text-muted"><span className="font-semibold">Don’t confuse: </span>{g.contrast}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}
