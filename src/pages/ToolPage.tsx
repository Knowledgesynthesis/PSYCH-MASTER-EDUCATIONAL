import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { MODULES } from '../content'
import type { ToolId } from '../content/types'
import { TOOLS } from '../components/tools/registry'
import { Badge, Card } from '../components/ui'
import NotFound from './NotFound'

export default function ToolPage() {
  const { toolId } = useParams()
  const tool = toolId ? TOOLS[toolId as ToolId] : undefined
  useEffect(() => {
    if (tool) document.title = `${tool.title} — Psych Master`
  }, [tool])
  if (!tool) return <NotFound />
  const mods = MODULES.filter((m) => m.tools.includes(tool.id))
  return (
    <div className="space-y-5">
      <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All tools
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tool.title}</h1>
          <p className="mt-1 text-muted">{tool.description}</p>
        </div>
        <Badge>{tool.kind}</Badge>
      </div>
      <Card className="p-4 sm:p-6">
        <tool.Component />
      </Card>
      {mods.length > 0 && (
        <p className="text-sm text-muted">
          Learn the context:{' '}
          {mods.map((m, i) => (
            <span key={m.id}>
              {i > 0 && ', '}
              <Link to={`/${m.slug}`} className="font-medium text-primary hover:underline">{m.title}</Link>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
