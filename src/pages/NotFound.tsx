import { Link } from 'react-router'
import { MODULES } from '../content'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted">That page doesn’t exist. Try a module:</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {MODULES.map((m) => (
          <Link key={m.id} to={`/${m.slug}`} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary">{m.shortTitle}</Link>
        ))}
      </div>
      <Link to="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">← Back home</Link>
    </div>
  )
}
