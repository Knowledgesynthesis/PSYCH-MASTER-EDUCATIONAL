# Psych Master

An interactive, evidence-based psychiatry curriculum for medical students, residents and clinicians. Every module goes from diagnostic criteria to management, and every claim is tied to a guideline, trial or regulatory action (content reviewed November 2026).

**Live:** https://psych-master-educational.vercel.app

## What's inside

| | |
|---|---|
| **10 modules** | Clinical reasoning & MSE · Depression · Bipolar · Psychosis · Anxiety & OCD · PTSD · ADHD · Substance use & withdrawal · Personality · Emergencies & safety |
| **14 interactive tools** | Criteria engines that show which DSM-5-TR rule passes or fails (MDE, mania/hypomania, psychotic disorders, PTSD/ASD, ADHD); validated scales (PHQ-9, GAD-7, AUDIT-C, CIWA-Ar, COWS, Bush–Francis, 4AT); alcohol-withdrawal timeline; serotonin syndrome vs NMS vs anticholinergic differentiator |
| **21 branching cases** | Commit at each step; every option explains why it is right or wrong |
| **81-question bank** | Learning or exam mode, topic filters, retry-missed, per-topic accuracy |
| **167 flashcards** | Leitner spaced repetition with due-card scheduling |
| **Sorting drills** | MSE domains, symptom domains, personality clusters |
| **Mastery tracking** | Per-module mastery weighted toward retrieval (questions > cases > cards > reading); export/import progress |
| **89-term glossary** | With the contrasts most often confused |
| **107 references** | Guidelines (APA, CANMAT/ISBD, NICE, VA/DoD, ASAM, AAP), meta-analyses, pivotal trials, FDA/CDC actions through 2026 |

Progress is stored only in the browser (no accounts, no analytics). Light, dark and system themes; works on phones.

## Development

Requires Node ≥ 20.19.

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build (dist/)
npm test           # unit + content-integrity tests (Vitest)
npm run e2e        # browser tests on desktop + mobile (Playwright)
```

## How the code is organized

```
src/
  content/            all curriculum content as typed data
    modules/*.ts      one file per module: sections, cases, questions, flashcards, pitfalls
    references.ts     single source of truth for citations
    glossary.ts
  logic/              pure, unit-tested clinical engines (criteria, scales, toxidrome, timeline)
  components/         renderers: blocks, question card, case stepper, flashcards, tools
  pages/              routes
  store/              persisted progress (Zustand) and theme
e2e/                  Playwright smoke and interaction tests
```

Content is data, so updating the curriculum rarely touches UI code. The test suite enforces content integrity: valid answer keys, a rationale for every option, unique ids, every citation resolvable and listed, no orphan references, balanced formatting, person-first language, and no boilerplate disclaimers scattered through the text.

### Adding or updating content

1. Edit the module file in `src/content/modules/`.
2. Add any new source to `src/content/references.ts` and cite it in the section `refs` and module `references`.
3. Run `npm test` — the integrity tests will flag anything malformed.

## Deployment

Deployed on Vercel from `main`. `vercel.json` rewrites client-side routes (e.g. `/bipolar`) to `index.html` so deep links and refreshes work, and sets long-lived caching for hashed assets.

## Use

For learning and clinical-reasoning practice. Check doses and decisions against current guidelines and local protocols. In a crisis in the US, call or text 988.
