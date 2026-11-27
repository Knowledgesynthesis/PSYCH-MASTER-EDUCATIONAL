import { useEffect } from 'react'
import { Link } from 'react-router'
import { MODULES } from '../content'
import { TOOLS, type ToolMeta } from '../components/tools/registry'
import { Badge, Card } from '../components/ui'

const KINDS: ToolMeta['kind'][] = ['Criteria engine', 'Scale', 'Differential', 'Timeline']

export default function Tools() {
  useEffect(() => {
    document.title = 'Clinical tools — Psych Master'
  }, [])
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clinical tools</h1>
        <p className="mt-1 max-w-2xl text-muted">Criteria engines expose DSM-5-TR decision logic step by step; scales use the published items and cut-offs.</p>
      </div>
      {KINDS.map((kind) => (
        <section key={kind}>
          <h2 className="mb-3 text-lg font-semibold">{kind === 'Scale' ? 'Validated scales' : kind === 'Criteria engine' ? 'Criteria engines' : kind === 'Differential' ? 'Differential builders' : 'Timelines'}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(TOOLS)
              .filter((t) => t.kind === kind)
              .map((t) => {
                const mods = MODULES.filter((m) => m.tools.includes(t.id))
                return (
                  <Link key={t.id} to={`/tools/${t.id}`} className="group">
                    <Card className="h-full p-4 transition-colors group-hover:border-primary/50">
                      <p className="font-semibold">{t.title}</p>
                      <p className="mt-1 text-sm text-muted">{t.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {mods.map((m) => (
                          <Badge key={m.id}>{m.shortTitle}</Badge>
                        ))}
                      </div>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
