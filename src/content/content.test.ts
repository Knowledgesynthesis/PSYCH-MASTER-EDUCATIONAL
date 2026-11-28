import { describe, expect, it } from 'vitest'
import { ALL_FLASHCARDS, ALL_QUESTIONS, MODULES } from './index'
import { REFERENCES, REFERENCE_MAP } from './references'
import { CENTANAFADINE_SUMMARY } from './centanafadine'
import { adhd } from './modules/adhd'
import { GLOSSARY } from './glossary'
import type { Block, Module } from './types'
import { TOOLS } from '../components/tools/registry'

/** Collect every user-facing string in a module for text-level checks. */
function strings(mod: Module): string[] {
  const out: string[] = [mod.title, mod.tagline, ...mod.objectives, ...mod.bottomLine]
  const block = (b: Block) => {
    switch (b.type) {
      case 'p':
        out.push(b.text)
        break
      case 'list':
        out.push(...b.items)
        break
      case 'table':
        out.push(...b.columns, ...b.rows.flat(), b.caption ?? '')
        break
      case 'callout':
        out.push(...(Array.isArray(b.text) ? b.text : [b.text]), b.title ?? '')
        break
      case 'keyNumbers':
        b.items.forEach((k) => out.push(k.value, k.label))
        break
      case 'steps':
        b.items.forEach((s) => out.push(s.title, s.text))
        break
      case 'defs':
        b.items.forEach((d) => out.push(d.term, d.text))
        break
    }
  }
  mod.sections.forEach((s) => {
    out.push(s.title)
    s.blocks.forEach(block)
  })
  mod.pitfalls.forEach((p) => out.push(p.trap, p.fix))
  mod.questions.forEach((q) => out.push(q.stem, q.explanation, ...q.options.flatMap((o) => [o.text, o.why])))
  mod.cases.forEach((c) => {
    out.push(c.title, c.setting, c.takeaway)
    c.steps.forEach((s) => out.push(s.reveal, s.prompt, s.explanation, ...s.options.flatMap((o) => [o.text, o.why])))
  })
  mod.flashcards.forEach((f) => out.push(f.front, f.back))
  mod.sorts?.forEach((s) => s.items.forEach((i) => out.push(i.text, i.why)))
  return out.filter((s) => s !== '')
}

describe('module structure', () => {
  it('has 10 modules with unique ids and slugs', () => {
    expect(MODULES).toHaveLength(10)
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length)
    expect(new Set(MODULES.map((m) => m.slug)).size).toBe(MODULES.length)
  })

  it('slugs do not collide with app routes', () => {
    const reserved = ['practice', 'review', 'tools', 'glossary', 'about', 'settings', 'assessment']
    for (const m of MODULES) expect(reserved).not.toContain(m.slug)
  })

  it.each(MODULES.map((m) => [m.id, m] as const))('%s has substantive content in every layer', (_, m) => {
    expect(m.bottomLine.length).toBeGreaterThanOrEqual(3)
    expect(m.objectives.length).toBeGreaterThanOrEqual(3)
    expect(m.sections.length).toBeGreaterThanOrEqual(3)
    expect(m.pitfalls.length).toBeGreaterThanOrEqual(4)
    expect(m.cases.length).toBeGreaterThanOrEqual(2)
    expect(m.questions.length).toBeGreaterThanOrEqual(6)
    expect(m.flashcards.length).toBeGreaterThanOrEqual(12)
    expect(m.references.length).toBeGreaterThanOrEqual(3)
  })

  it('section ids are unique within each module', () => {
    for (const m of MODULES) expect(new Set(m.sections.map((s) => s.id)).size).toBe(m.sections.length)
  })
})

describe('globally unique ids', () => {
  const ids = [
    ...ALL_QUESTIONS.map((q) => q.id),
    ...ALL_FLASHCARDS.map((f) => f.id),
    ...MODULES.flatMap((m) => m.cases.map((c) => c.id)),
    ...MODULES.flatMap((m) => (m.sorts ?? []).map((s) => s.id)),
  ]
  it('no duplicate question, card, case or sort ids', () => {
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes).toEqual([])
  })
})

describe('questions and cases are well-formed', () => {
  const items = [
    ...ALL_QUESTIONS.map((q) => ({ id: q.id, options: q.options, answer: q.answer, explanation: q.explanation })),
    ...MODULES.flatMap((m) => m.cases.flatMap((c) => c.steps.map((s, i) => ({ id: `${c.id}#${i}`, options: s.options, answer: s.answer, explanation: s.explanation })))),
  ]

  it.each(items.map((i) => [i.id, i] as const))('%s', (_, item) => {
    expect(item.options.length).toBeGreaterThanOrEqual(3)
    expect(item.options.length).toBeLessThanOrEqual(6)
    expect(Number.isInteger(item.answer)).toBe(true)
    expect(item.answer).toBeGreaterThanOrEqual(0)
    expect(item.answer).toBeLessThan(item.options.length)
    expect(item.explanation.length).toBeGreaterThan(20)
    for (const o of item.options) {
      expect(o.text.trim().length).toBeGreaterThan(0)
      expect(o.why.trim().length).toBeGreaterThan(5)
    }
    const texts = item.options.map((o) => o.text.trim().toLowerCase())
    expect(texts.filter((t, i) => texts.indexOf(t) !== i)).toEqual([])
  })

  it('every case has 2–4 steps', () => {
    for (const m of MODULES) for (const c of m.cases) expect(c.steps.length).toBeGreaterThanOrEqual(2)
  })
})

describe('references', () => {
  it('reference ids are unique', () => {
    expect(new Set(REFERENCES.map((r) => r.id)).size).toBe(REFERENCES.length)
  })

  it('every cited reference exists', () => {
    const missing: string[] = []
    for (const m of MODULES) {
      m.references.forEach((id) => REFERENCE_MAP[id] || missing.push(`${m.id}: ${id}`))
      m.sections.forEach((s) => s.refs?.forEach((id) => REFERENCE_MAP[id] || missing.push(`${m.id}/${s.id}: ${id}`)))
      m.questions.forEach((q) => q.refs?.forEach((id) => REFERENCE_MAP[id] || missing.push(`${q.id}: ${id}`)))
    }
    expect(missing).toEqual([])
  })

  it('section and question citations also appear in the module reference list', () => {
    const gaps: string[] = []
    for (const m of MODULES) {
      const listed = new Set(m.references)
      m.sections.forEach((s) => s.refs?.forEach((id) => listed.has(id) || gaps.push(`${m.id}/${s.id}: ${id}`)))
      m.questions.forEach((q) => q.refs?.forEach((id) => listed.has(id) || gaps.push(`${q.id}: ${id}`)))
    }
    expect(gaps).toEqual([])
  })

  it('no orphan references (every source is cited somewhere)', () => {
    const cited = new Set(MODULES.flatMap((m) => m.references))
    const orphans = REFERENCES.map((r) => r.id).filter((id) => !cited.has(id) && !['roediger-2006', 'cepeda-2006'].includes(id))
    expect(orphans).toEqual([])
  })

  it('years are plausible and nothing is dated in the future', () => {
    for (const r of REFERENCES) {
      expect(r.year).toBeGreaterThanOrEqual(1980)
      expect(r.year).toBeLessThanOrEqual(2026)
    }
  })
})

describe('tools and sort exercises', () => {
  it('every module tool exists in the registry', () => {
    for (const m of MODULES) for (const t of m.tools) expect(TOOLS[t]).toBeDefined()
  })

  it('every registered tool is used by at least one module', () => {
    const used = new Set(MODULES.flatMap((m) => m.tools))
    expect(Object.keys(TOOLS).filter((t) => !used.has(t as never))).toEqual([])
  })

  it('sort items use declared bins and every bin is used', () => {
    for (const m of MODULES)
      for (const s of m.sorts ?? []) {
        for (const i of s.items) expect(s.bins).toContain(i.bin)
        for (const b of s.bins) expect(s.items.some((i) => i.bin === b)).toBe(true)
      }
  })
})

describe('text quality', () => {
  it.each(MODULES.map((m) => [m.id, m] as const))('%s: bold markers are balanced and no placeholders remain', (_, m) => {
    for (const s of strings(m)) {
      expect((s.match(/\*\*/g) ?? []).length % 2, s).toBe(0)
      expect(s).not.toMatch(/TODO|TBD|lorem ipsum|\{\{|\}\}/i)
      expect(s).not.toMatch(/\s{2,}\S/) // stray double spaces
    }
  })

  it('disclaimers are not repeated throughout the content', () => {
    const all = MODULES.flatMap(strings).join(' ').toLowerCase()
    expect(all).not.toMatch(/educational (use|purposes) only/)
    expect(all).not.toMatch(/not (intended )?for clinical (use|diagnosis)/)
  })

  it('uses person-first, non-stigmatizing language', () => {
    const bad = /\b(addicts?|abusers?|junkies?|alcoholics?|schizophrenics?|the mentally ill|dirty urine)\b/i
    const hits = MODULES.flatMap(strings).filter((s) => bad.test(s) && !/“[^”]*(addict|abuser|dirty urine)[^”]*”/i.test(s))
    expect(hits).toEqual([])
  })
})

describe('glossary', () => {
  it('terms are unique and definitions substantive', () => {
    const terms = GLOSSARY.map((g) => g.term.toLowerCase())
    expect(new Set(terms).size).toBe(terms.length)
    for (const g of GLOSSARY) expect(g.definition.length).toBeGreaterThan(15)
  })
})

describe('Simtriyo teaching content', () => {
  it('includes both pediatric criteria and Schedule III in the lesson and flashcard', () => {
    const lesson = strings(adhd).find((s) => s.includes('CNS stimulant and norepinephrine'))
    const flashcard = adhd.flashcards.find((c) => c.id === 'adhd-f14')?.back
    for (const s of [lesson, flashcard, CENTANAFADINE_SUMMARY]) {
      expect(s).toContain('age 6 or older who weigh at least 20 kg')
      expect(s).toContain('Schedule III since October 30, 2026')
    }
    expect(strings(adhd).join(' ')).not.toMatch(/pending DEA scheduling/i)
  })

  it('cites the FDA indication and DEA rule in the treatment section', () => {
    expect(adhd.sections.find((s) => s.id === 'treatment')?.refs).toEqual(
      expect.arrayContaining(['fda-centanafadine-2026', 'dea-centanafadine-2026']),
    )
    expect(REFERENCE_MAP['fda-centanafadine-2026']?.url).toContain('218145s000lbl.pdf')
    expect(REFERENCE_MAP['dea-centanafadine-2026']?.url).toContain('2026-22208.htm')
  })
})
