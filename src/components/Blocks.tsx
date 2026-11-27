import type { Block } from '../content/types'
import { RichText } from './RichText'
import { Callout, TextLines } from './ui'

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-text/90">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p><RichText text={block.text} /></p>
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className={block.ordered ? 'list-decimal space-y-1.5 pl-5' : 'list-disc space-y-1.5 pl-5 marker:text-muted'}>
          {block.items.map((item, i) => (
            <li key={i}><RichText text={item} /></li>
          ))}
        </Tag>
      )
    }
    case 'table':
      return (
        <figure className="overflow-hidden rounded-xl border border-border">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-left text-sm">
              <thead className="bg-surface-2">
                <tr>
                  {block.columns.map((c) => (
                    <th key={c} scope="col" className="px-3 py-2.5 font-semibold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-border align-top">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="px-3 py-2.5 font-medium">
                          <RichText text={cell} />
                        </th>
                      ) : (
                        <td key={c} className="px-3 py-2.5 text-text/85">
                          <RichText text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="border-t border-border bg-surface-2/60 px-3 py-2 text-xs text-muted"><RichText text={block.caption} /></figcaption>}
        </figure>
      )
    case 'callout':
      return (
        <Callout tone={block.tone} title={block.title}>
          <TextLines text={block.text} />
        </Callout>
      )
    case 'keyNumbers':
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {block.items.map((k, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface-2/60 p-3">
              <div className="text-lg font-bold tracking-tight text-primary tabular-nums">{k.value}</div>
              <div className="mt-0.5 text-xs leading-snug text-muted"><RichText text={k.label} /></div>
            </div>
          ))}
        </div>
      )
    case 'steps':
      return (
        <ol className="space-y-3">
          {block.items.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{i + 1}</span>
              <div className="min-w-0 pt-0.5">
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted"><RichText text={s.text} /></p>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'defs':
      return (
        <dl className="grid gap-3 sm:grid-cols-2">
          {block.items.map((d, i) => (
            <div key={i} className="rounded-xl border border-border p-3">
              <dt className="font-semibold">{d.term}</dt>
              <dd className="mt-1 text-sm text-muted"><RichText text={d.text} /></dd>
            </div>
          ))}
        </dl>
      )
  }
}
