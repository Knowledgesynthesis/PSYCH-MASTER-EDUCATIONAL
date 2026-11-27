import { test, expect, type Page } from '@playwright/test'

const MODULES = ['foundations', 'mdd', 'bipolar', 'psychosis', 'anxiety', 'ptsd', 'adhd', 'sud', 'personality', 'emergencies']
const TOOLS = ['phq9', 'gad7', 'auditc', 'ciwa', 'cows', 'bfcrs', 'fourat', 'mde-checker', 'episode-classifier', 'psychosis-classifier', 'ptsd-mapper', 'adhd-analyzer', 'alcohol-timeline', 'toxidrome']
const PAGES = ['/', '/practice', '/review', '/tools', '/glossary', '/about', ...MODULES.map((m) => `/${m}`), ...TOOLS.map((t) => `/tools/${t}`)]

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
  return errors
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, 'page should not scroll horizontally').toBeLessThanOrEqual(1)
}

async function unnamedButtons(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('button, a[href]'))
      .filter((el) => {
        const he = el as HTMLElement
        if (he.offsetParent === null) return false
        const name = (he.getAttribute('aria-label') || he.textContent || he.getAttribute('title') || '').trim()
        return name.length === 0
      })
      .map((el) => el.outerHTML.slice(0, 120)),
  )
}

for (const path of PAGES) {
  test(`renders ${path} cleanly`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    await noHorizontalOverflow(page)
    expect(await unnamedButtons(page)).toEqual([])
    expect(errors).toEqual([])
  })
}

for (const m of MODULES) {
  test(`module ${m}: every tab renders without errors or overflow`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(`/${m}`)
    await expect(page.locator('h1').first()).toBeVisible()
    const tabs = page.getByRole('tab')
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(3)
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click()
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true')
      await noHorizontalOverflow(page)
    }
    expect(errors).toEqual([])
  })
}

test('unknown routes show the 404 page', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('legacy routes redirect', async ({ page }) => {
  await page.goto('/assessment')
  await expect(page).toHaveURL(/\/practice$/)
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/about#settings$/)
})

test('answering a module question gives feedback and persists across reload', async ({ page }) => {
  await page.goto('/mdd?tab=drill')
  const options = page.getByRole('group', { name: 'Answer options' }).getByRole('button')
  await options.first().click()
  await expect(page.getByText('Teaching point')).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: /Correct|Not quite/ })).toBeVisible()
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pm-progress') || '{}'))
  expect(Object.keys(stored.state.questions)).toHaveLength(1)
  await page.reload()
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('pm-progress') || '{}'))
  expect(Object.keys(after.state.questions)).toHaveLength(1)
})

test('a full question-bank exam session can be completed', async ({ page }) => {
  await page.goto('/practice')
  await page.getByRole('button', { name: 'Exam' }).click()
  await page.getByRole('button', { name: '10', exact: true }).click()
  await page.getByRole('button', { name: /^Start 10 questions/ }).click()
  for (let i = 0; i < 10; i++) {
    await page.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click()
    await page.getByRole('button', { name: i < 9 ? 'Next' : 'Submit exam' }).last().click()
  }
  await expect(page.getByText(/\/10/).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Restart all' })).toBeVisible()
})

test('a clinical case can be stepped through to the take-home', async ({ page }) => {
  await page.goto('/emergencies?tab=cases')
  const firstCase = page.locator('div.rounded-2xl').filter({ hasText: 'Everyone would be better off' }).first()
  for (let step = 0; step < 3; step++) {
    await firstCase.getByRole('group', { name: 'Answer options' }).getByRole('button').first().click()
    // Feedback must stay visible after answering (regression: it used to reset on re-render).
    await expect(firstCase.getByText('Teaching point')).toBeVisible()
    await expect(firstCase.getByRole('status').filter({ hasText: /Correct|Not quite/ })).toBeVisible()
    await firstCase.getByRole('button', { name: step < 2 ? 'Next step' : 'Finish case' }).click()
  }
  await expect(firstCase.getByText('Take-home')).toBeVisible()
})

test('flashcards flip and schedule', async ({ page }) => {
  await page.goto('/review')
  await page.getByRole('button', { name: 'Reveal answer' }).click()
  await page.getByRole('button', { name: /^Good/ }).click()
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pm-progress') || '{}'))
  const card = Object.values(stored.state.cards)[0] as { box: number }
  expect(card.box).toBe(1)
})

test('PHQ-9 scores and flags item 9', async ({ page }) => {
  await page.goto('/tools/phq9')
  const groups = page.getByRole('radiogroup')
  await expect(groups).toHaveCount(9)
  for (let i = 0; i < 9; i++) await groups.nth(i).getByRole('radio').nth(2).click()
  await expect(page.getByText(/^18\/27$/)).toBeVisible()
  await expect(page.getByText('Moderately severe')).toBeVisible()
  await expect(page.getByText(/Item 9 is positive/)).toBeVisible()
})

test('mania classifier responds to severity', async ({ page }) => {
  await page.goto('/tools/episode-classifier')
  for (const label of ['Decreased need for sleep (rested after ~3 h)', 'More talkative than usual or pressured speech', 'Flight of ideas or racing thoughts']) {
    await page.getByRole('checkbox', { name: label }).click()
  }
  await expect(page.getByText('Hypomanic episode', { exact: true })).toBeVisible()
  await page.getByRole('checkbox', { name: 'Hospitalization needed (to prevent harm)' }).click()
  await expect(page.getByText('Manic episode → Bipolar I disorder')).toBeVisible()
})

test('toxidrome tool ranks serotonin syndrome for clonus after a serotonergic change', async ({ page }) => {
  await page.goto('/tools/toxidrome')
  for (const label of ['Serotonergic drug started, increased or combined', 'Onset within hours (<24 h)', 'Clonus — inducible, ocular or spontaneous']) {
    await page.getByRole('checkbox', { name: label }).click()
  }
  await expect(page.getByText('Serotonin syndrome: discriminating features')).toBeVisible()
})

test('theme toggle switches to dark mode and persists', async ({ page }) => {
  await page.goto('/about')
  await page.getByRole('button', { name: /Dark/ }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('glossary search filters terms', async ({ page }) => {
  await page.goto('/glossary')
  await page.getByRole('searchbox').fill('tangential')
  await expect(page.getByRole('heading', { name: 'Tangentiality' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Akathisia' })).toHaveCount(0)
})
