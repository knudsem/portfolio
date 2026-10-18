// The site in one browser engine (ENGINE: chromium, webkit for Safari, or
// firefox): every page from the sitemap on a desktop and a phone, then the
// interactions that matter. Run it with: npm run test:browsers -- webkit
import * as playwright from 'playwright'
import { BASE, AXE } from './lib.mjs'

const ENGINE = process.env.ENGINE || 'chromium'
const browser = await playwright[ENGINE].launch()
let fail = 0
const check = (label, ok, info = '') => {
  if (!ok) fail++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? `  [${info}]` : ''}`)
}

// Firefox has no "mobile" mode in Playwright: a small touch screen is the
// closest it gets
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, ...(ENGINE === 'firefox' ? {} : { isMobile: true }) }
const desktop = { viewport: { width: 1440, height: 900 } }
const open = async (options, lang = 'en') => {
  const context = await browser.newContext({ ...options, locale: lang === 'fr' ? 'fr-FR' : 'en-GB' })
  await context.addInitScript((l) => { try { localStorage.setItem('lang', l) } catch {} }, lang)
  await context.route('**/formsubmit.co/**', (route) => route.abort())
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  return { context, page, errors }
}

// Every page the site lists for search engines
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
check(`the sitemap lists the pages (${paths.length})`, paths.length >= 12)

// Scrolls down the page step by step; at each step, the text in view must
// be visible (no reveal effect may leave it hidden in this engine)
const hiddenText = (page) => page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto'
  const hidden = new Set()
  const opacity = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o }
  const inView = () => [...document.querySelectorAll('main h1, main h2, main h3, main p')].filter((el) => {
    const r = el.getBoundingClientRect()
    return r.height && r.bottom >= 60 && r.top <= innerHeight - 60 && !el.closest('[aria-hidden="true"], [hidden], .sr-only, dialog:not([open]), .lab-stage')
  })
  const faded = (el) => opacity(el) < 0.5 || getComputedStyle(el).visibility === 'hidden'
  for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.8)) {
    scrollTo(0, y)
    // a slow engine gets up to 5 seconds to show what is in view
    for (let wait = 0; wait < 5000 && (wait < 700 || inView().some(faded)); wait += 250) await new Promise((done) => setTimeout(done, 250))
    for (const el of document.querySelectorAll('main h1, main h2, main h3, main p')) {
      const r = el.getBoundingClientRect()
      if (!r.height || r.bottom < 60 || r.top > innerHeight - 60) continue
      if (el.closest('[aria-hidden="true"], [hidden], .sr-only, dialog:not([open]), .lab-stage')) continue
      if (opacity(el) < 0.5 || getComputedStyle(el).visibility === 'hidden') {
        // what the reveal effect knows about it, to tell why
        const reveal = el.closest('[data-reveal]')
        const state = reveal ? `reveal ${reveal.dataset.visible ? 'seen' : 'not seen'}, ${reveal.getAnimations().map((a) => `${a.animationName} ${a.playState}`).join(' ') || 'no animation'}` : 'no reveal'
        hidden.add(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}" (opacity ${opacity(el).toFixed(2)}, top ${Math.round(r.top)} of ${innerHeight}, ${state})`)
      }
    }
  }
  scrollTo(0, 0)
  return [...hidden]
})

const framesPerSecond = (page) => page.evaluate(() => new Promise((done) => {
  let frames = 0
  const start = performance.now()
  const count = () => (performance.now() - start < 1000 ? (frames++, requestAnimationFrame(count)) : done(frames))
  requestAnimationFrame(count)
}))

const axe = async (page) => {
  await page.addScriptTag({ content: AXE })
  return page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map((v) => `${v.id} (${v.nodes.length})`))
}

for (const [layout, options] of [['desktop', desktop], ['phone', phone]]) {
  for (const path of paths) {
    const { context, page, errors } = await open(options)
    const response = await page.goto(BASE + path)
    await page.waitForTimeout(600)
    const state = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent.trim().slice(0, 50) || null,
      wide: document.documentElement.scrollWidth - innerWidth,
    }))
    check(`${layout} ${path}: loads, with a heading and nothing sideways`, response.ok() && !!state.h1 && state.wide <= 0, JSON.stringify(state))
    if (path === '/' || path === '/lab') console.log(`info ${layout} ${path}: ${await framesPerSecond(page)} frames a second in ${ENGINE} here`)
    const hidden = await hiddenText(page)
    check(`${layout} ${path}: all its text shows up while scrolling`, hidden.length === 0, hidden.slice(0, 4).join(', '))
    if (layout === 'desktop') {
      const problems = await axe(page)
      check(`${layout} ${path}: no accessibility problem found by axe`, problems.length === 0, problems.join(', '))
    }
    check(`${layout} ${path}: no script error`, errors.length === 0, errors.slice(0, 3).join(' | '))
    await context.close()
  }
}

// Home: language, command menu, contact form
{
  const { context, page, errors } = await open(desktop, 'fr')
  await page.goto(BASE + '/')
  await page.waitForTimeout(600)
  await page.click('.lang-btn[lang="en"]')
  await page.waitForTimeout(400)
  check('home: the language switch turns the page to English', (await page.evaluate(() => document.documentElement.lang)) === 'en')
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(300)
  const menu = await page.evaluate(() => ({ open: document.querySelector('dialog.cmdk')?.open, options: document.querySelectorAll('dialog.cmdk [role=option]').length }))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  check('home: Ctrl K opens the command menu, Escape closes it', menu.open === true && menu.options > 10 && !(await page.evaluate(() => document.querySelector('dialog.cmdk')?.open)), JSON.stringify(menu))
  await page.click('.form-submit')
  await page.waitForTimeout(300)
  const form = await page.evaluate(() => [...document.querySelectorAll('#contact [aria-invalid="true"]')].map((el) => el.id).join())
  check('home: an empty contact form shows its three errors', form === 'cf-name,cf-email,cf-message', form)
  await page.fill('#cf-email', 'jane@gmial.com')
  await page.click('#cf-message')
  await page.waitForTimeout(300)
  check('home: a mistyped email gets a suggestion', /gmail\.com/.test((await page.locator('.field-hint').first().textContent()) || ''))
  check('home: no script error', errors.length === 0, errors.slice(0, 3).join(' | '))
  await context.close()
}

// Phone: the menu
{
  const { context, page, errors } = await open(phone)
  await page.goto(BASE + '/')
  await page.waitForTimeout(600)
  await page.tap('.menu-btn')
  await page.waitForTimeout(500)
  const opened = await page.evaluate(() => ({ expanded: document.querySelector('.menu-btn').getAttribute('aria-expanded'), panel: !!document.querySelector('#mobile-menu') }))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  check('phone: the menu opens, Escape closes it', opened.expanded === 'true' && opened.panel && !(await page.evaluate(() => document.querySelector('#mobile-menu'))), JSON.stringify(opened))
  check('phone: no script error', errors.length === 0, errors.slice(0, 3).join(' | '))
  await context.close()
}

// The lab: filters, search, and the demos that do the most
{
  const { context, page, errors } = await open(desktop)
  await page.goto(BASE + '/lab')
  await page.waitForTimeout(800)
  await page.locator('.lab-filters .lab-chip', { hasText: 'Buttons' }).click()
  await page.waitForTimeout(500)
  check('lab: the Buttons filter shows the 15 buttons', (await page.locator('.lab-card').count()) === 15)
  await page.locator('.lab-filters .lab-chip').first().click()
  await page.fill('#lab-search-side', 'loader')
  await page.waitForTimeout(400)
  check('lab: searching "loader" finds the 11 loaders and the logo loader', (await page.locator('.lab-card').count()) === 12)
  await page.fill('#lab-search-side', '')
  await page.locator('.lab-filters .lab-chip', { hasText: 'From my archive' }).click()
  await page.waitForTimeout(800)
  const stage = (id) => page.locator(`.lab-card[data-demo="${id}"] .lab-stage`)

  await stage('arch-rings').scrollIntoViewIfNeeded()
  // only a quarter of the round button shows, in the corner: a click lands on its word
  await stage('arch-rings').getByRole('button', { name: 'Games' }).locator('span').click()
  await page.waitForTimeout(800)
  const rings = await stage('arch-rings').evaluate((el) => [...el.querySelectorAll('a')].map((a) => getComputedStyle(a).visibility).join())
  await page.keyboard.press('Escape')
  check('lab: the corner rings open', rings === 'visible,visible,visible', rings)

  await stage('arch-cat').scrollIntoViewIfNeeded()
  await stage('arch-cat').getByRole('button', { name: 'Pet the lucky cat' }).click()
  check('lab: the cat can be petted', await stage('arch-cat').locator('.lb-luck').evaluate((el) => el.hasAttribute('data-lucky')))

  await stage('arch-water').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2400)
  check('lab: the test tube fills up to 65%', (await stage('arch-water').locator('.lb-tube-level').textContent()) === '65%')

  // The page scrolls smoothly (and a filter scrolls back to the grid): the
  // test jumps at once, waits for the page to stand still, and makes sure
  // the card did land on screen before looking at it
  const still = async () => {
    let last = null
    for (let i = 0; i < 40; i++) {
      const y = await page.evaluate(() => scrollY)
      if (y === last) return
      last = y
      await page.waitForTimeout(150)
    }
  }
  const where = (locator) => locator.evaluate((el) => {
    const card = el.closest('.lab-card')
    const r = card.getBoundingClientRect()
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), screen: innerHeight, onScreen: r.top < innerHeight && r.bottom > 0, inview: card.hasAttribute('data-inview') }
  })
  const bring = async (locator) => {
    await still()
    for (let i = 0; i < 5; i++) {
      await locator.evaluate((el) => {
        document.documentElement.style.scrollBehavior = 'auto'
        el.scrollIntoView({ block: 'center' })
      })
      await still()
      if ((await where(locator)).onScreen) break
    }
    // the lab gets a moment to see the card and start it
    for (let wait = 0; wait < 2000 && !(await where(locator)).inview; wait += 200) await page.waitForTimeout(200)
    return where(locator)
  }

  const globe = await bring(stage('arch-globe'))
  await page.waitForTimeout(800)
  const look = () => stage('arch-globe').locator('canvas').evaluate((el) => {
    const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data
    let land = 0, sum = 0
    for (let i = 0; i < d.length; i += 16) { if (d[i + 1] - d[i] > 25) land++; sum = (sum * 31 + d[i + 1]) % 1e9 }
    return { land, sum }
  })
  const first = await look()
  let second = first
  for (let wait = 0; wait < 6000 && second.sum === first.sum; wait += 300) {
    await page.waitForTimeout(300)
    second = await look()
  }
  const clock = await stage('arch-globe').locator('canvas').evaluate((el) => {
    const turn = el.getAnimations().find((a) => a.animationName === 'lb-turn')
    return `animation ${turn ? `${turn.playState} at ${Math.round(turn.currentTime)} ms` : 'none'}, play state ${getComputedStyle(el).animationPlayState}`
  })
  check('lab: the globe draws land and turns', first.land > 100 && first.sum !== second.sum, `${first.land} land samples; ${clock}; card ${JSON.stringify(globe)}`)

  // A CSS animation rests while its card is far off screen, and picks up
  // again when the card comes back
  await page.locator('.lab-filters .lab-chip').first().click()
  await page.waitForTimeout(600)
  const dots = page.locator('.lab-card[data-demo="loader-dots"] .lab-stage span').first()
  const ran = async () => {
    const time = () => dots.evaluate((el) => el.getAnimations()[0]?.currentTime ?? null)
    const from = await time()
    await page.waitForTimeout(700)
    return Math.round((await time()) - from)
  }
  const shown = await bring(dots)
  const shownRan = await ran()
  check('lab: an animation runs while its card is on screen', shown.onScreen && shown.inview && shownRan > 300, `${JSON.stringify(shown)}, ran ${shownRan} ms in 700`)
  // a visitor scrolls on a little at each frame, not in one jump (a card
  // that is no longer drawn keeps the style it had, in Firefox)
  await still()
  await page.evaluate(async () => {
    const frame = () => new Promise((done) => requestAnimationFrame(() => done()))
    for (let i = 0; i < 30; i++) {
      scrollBy(0, 60)
      await frame()
      await frame()
    }
    scrollTo(0, document.documentElement.scrollHeight)
  })
  await still()
  await page.waitForTimeout(600)
  const away = await where(dots)
  const awayRan = await ran()
  check('lab: it rests while its card is far off screen', !away.onScreen && !away.inview && awayRan === 0, `${JSON.stringify(away)}, ran ${awayRan} ms in 700`)
  const back = await bring(dots)
  const backRan = await ran()
  check('lab: it picks up again when its card comes back', back.onScreen && back.inview && backRan > 300, `${JSON.stringify(back)}, ran ${backRan} ms in 700`)
  check('lab: no script error', errors.length === 0, errors.slice(0, 3).join(' | '))
  await context.close()
}

// Reduced motion: the lab shows its demos finished
{
  const { context, page, errors } = await open({ ...desktop, reducedMotion: 'reduce' })
  await page.goto(BASE + '/lab')
  await page.waitForTimeout(800)
  await page.locator('.lab-filters .lab-chip', { hasText: 'From my archive' }).click()
  await page.waitForTimeout(600)
  const signal = page.locator('.lab-card[data-demo="arch-signal"] .lb-signal')
  await signal.scrollIntoViewIfNeeded()
  check('reduced motion: the signal is shown lit', await signal.locator('path').evaluateAll((ps) => ps.every((a) => getComputedStyle(a).opacity === '1')))
  check('reduced motion: no script error', errors.length === 0, errors.slice(0, 3).join(' | '))
  await context.close()
}

await browser.close()
console.log(fail ? `\n${fail} FAILED` : '\nall passed')
process.exit(fail ? 1 : 0)
