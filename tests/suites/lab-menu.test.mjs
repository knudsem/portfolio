// The lab's filter menu (on the left on a wide screen, a bar on a phone),
// search, and the interactions of the new demos.
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const URL_ = BASE + '/lab';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const stage = (p, id) => p.locator(`.lab-card[data-demo="${id}"] .lab-stage`);
const at = async (p, id) => { await stage(p, id).scrollIntoViewIfNeeded(); await p.waitForTimeout(250); return stage(p, id); };

// Wide screen, English
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-GB', permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript(() => { try { localStorage.setItem('lang', 'en'); } catch {} });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  await p.goto(URL_); await p.waitForTimeout(800);

  const menu = await p.evaluate(() => {
    const side = document.querySelector('.lab-side'); const main = document.querySelector('.lab-main');
    const chips = [...document.querySelectorAll('.lab-filters .lab-chip')];
    return { label: side.getAttribute('aria-label'), left: side.getBoundingClientRect().right <= main.getBoundingClientRect().left, chips: chips.map((c) => c.textContent), counts: chips.slice(1).reduce((n, c) => n + Number(c.querySelector('.lab-chip-count').textContent), 0), all: Number(chips[0].querySelector('.lab-chip-count').textContent), search: getComputedStyle(document.querySelector('.lab-side-wide')).display, narrow: getComputedStyle(document.querySelector('.lab-tools-narrow')).display };
  });
  check('wide screen: a labelled menu on the left of the grid, search and pause in it', menu.label === 'Filters' && menu.left && menu.search === 'block' && menu.narrow === 'none', JSON.stringify(menu));
  check('eleven categories, their counts add up to all 91', menu.chips.length === 12 && menu.all === 91 && menu.counts === 91, menu.chips.join(' | '));

  await p.evaluate(() => scrollTo(0, 4000)); await p.waitForTimeout(400);
  const stuck = await p.evaluate(() => Math.round(document.querySelector('.lab-side').getBoundingClientRect().top));
  check('the menu stays on screen while scrolling (just under the header)', stuck >= 72 && stuck <= 110, String(stuck));

  await p.locator('.lab-filters .lab-chip', { hasText: 'Navigation' }).click(); await p.waitForTimeout(1400);
  const nav = await p.evaluate(() => ({ cards: document.querySelectorAll('.lab-card').length, cats: [...document.querySelectorAll('.lab-card')].every((c) => c.dataset.demo.startsWith('nav-')), top: Math.round(document.querySelector('.lab-main').getBoundingClientRect().top), status: document.querySelector('.lab-main [role=status]').textContent }));
  check('a filter from far down: navigation only, results brought to the top, said to screen readers', nav.cards === 6 && nav.cats && nav.top >= 80 && nav.top <= 110 && nav.status === '6 animations shown', JSON.stringify(nav));
  await p.locator('.lab-filters .lab-chip', { hasText: 'All' }).click(); await p.waitForTimeout(500);

  const search = p.locator('#lab-search-side');
  await search.fill('loader'); await p.waitForTimeout(300);
  const found = await p.evaluate(() => [...document.querySelectorAll('.lab-card')].map((c) => c.dataset.demo));
  check('search "loader": the eleven loaders (the category name counts too)', found.filter((id) => id.startsWith('loader-')).length === 11 && found.length === 11, found.join(','));
  await search.fill('zzzz'); await p.waitForTimeout(300);
  const empty = await p.evaluate(() => ({ cards: document.querySelectorAll('.lab-card').length, text: document.querySelector('.lab-empty p')?.textContent }));
  check('search with no match: says so, with a way to clear it', empty.cards === 0 && empty.text === 'No animation matches “zzzz”.', JSON.stringify(empty));
  await p.locator('.lab-empty button').click(); await p.waitForTimeout(300);
  check('clearing the search brings every demo back', (await p.locator('.lab-card').count()) === 91 && (await search.inputValue()) === '');

  // the new demos, one by one
  let s = await at(p, 'icon-burger'); await s.locator('button').click();
  check('menu icon: aria-expanded toggles', (await s.locator('button').getAttribute('aria-expanded')) === 'true');
  s = await at(p, 'icon-play'); await s.locator('button').click();
  check('play: aria-pressed toggles', (await s.locator('button').getAttribute('aria-pressed')) === 'true');
  s = await at(p, 'icon-cart'); await s.locator('.lb-cart-add').click(); await s.locator('.lb-cart-add').click(); await p.waitForTimeout(800);
  check('cart: the count goes up, and is said', (await s.locator('.lb-cart-count').textContent()) === '2' && (await s.locator('[role=status]').textContent()) === '2 items in the cart');
  s = await at(p, 'btn-copy'); await s.locator('button').click(); await p.waitForTimeout(200);
  check('copy: copies the command, says "Copied"', (await p.evaluate(() => navigator.clipboard.readText())) === 'npm create vite@latest' && (await s.locator('[role=status]').textContent()) === 'Copied');
  s = await at(p, 'btn-loading'); await s.locator('button').click(); await p.waitForTimeout(200);
  const busy = await s.locator('button').getAttribute('aria-busy'); await p.waitForTimeout(1700);
  check('saving: busy, then done and announced', busy === 'true' && (await s.locator('button').getAttribute('data-state')) === 'done' && (await s.locator('[role=status]').textContent()) === 'Saved');
  s = await at(p, 'text-counter'); await p.waitForTimeout(1900);
  check('counter: ends on the real number', (await s.locator('.lb-count-num').textContent()) === '12,480');

  s = await at(p, 'nav-tabs'); await s.locator('#lb-tab-1').focus(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(150);
  const tabs = await s.evaluate((el) => ({ sel: el.querySelector('[aria-selected=true]').id, focus: document.activeElement.id, p2: !el.querySelector('#lb-panel-2').hidden, p1: el.querySelector('#lb-panel-1').hidden }));
  await p.keyboard.press('End'); await p.waitForTimeout(100);
  const end = await s.evaluate(() => document.activeElement.id);
  check('tabs: arrow keys and End move the selection and the panel', tabs.sel === 'lb-tab-2' && tabs.focus === 'lb-tab-2' && tabs.p2 && tabs.p1 && end === 'lb-tab-3', JSON.stringify({ ...tabs, end }));

  s = await at(p, 'nav-accordion'); await s.locator('summary', { hasText: 'Returns' }).click(); await p.waitForTimeout(300);
  check('accordion: one open at a time', await s.evaluate((el) => [...el.querySelectorAll('details')].map((d) => d.open).join()) === 'false,true,false');
  s = await at(p, 'nav-segmented'); await s.locator('input[value=month]').check({ force: true }); await p.waitForTimeout(500);
  check('segmented: the pill moves to the checked option', await s.evaluate((el) => getComputedStyle(el.querySelector('.lb-seg-pill')).translate) === '200%');
  s = await at(p, 'nav-menu'); await s.locator('.lb-menu-button').click(); await p.waitForTimeout(300);
  const opened = await s.locator('.lb-menu-list').evaluate((el) => getComputedStyle(el).visibility);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  check('dropdown: opens, Escape closes it with the focus back on its button', opened === 'visible' && (await s.locator('.lb-menu-button').getAttribute('aria-expanded')) === 'false' && await p.evaluate(() => document.activeElement.classList.contains('lb-menu-button')));
  s = await at(p, 'nav-slides'); await s.locator('[aria-label="Slide 3"]').click(); await p.waitForTimeout(100);
  check('slides: the chosen dot is current', (await s.locator('[aria-current=true]').getAttribute('aria-label')) === 'Slide 3');

  s = await at(p, 'input-password'); await s.locator('button').click();
  check('password: shown as text, pressed', (await s.locator('input').getAttribute('type')) === 'text' && (await s.locator('button').getAttribute('aria-pressed')) === 'true');
  s = await at(p, 'input-otp'); await s.locator('input').first().click(); await p.keyboard.type('12');
  const otpFocus = await p.evaluate(() => document.activeElement.getAttribute('aria-label'));
  await p.keyboard.type('34'); await p.waitForTimeout(200);
  check('one-time code: the focus moves on, complete is said', otpFocus === 'Digit 3' && (await s.locator('[role=status]').textContent()) === 'Code complete' && (await s.locator('.lb-otp').getAttribute('data-done')) === '');
  s = await at(p, 'input-range'); await s.locator('input').focus(); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
  check('range: the bubble follows the value', (await s.locator('output').textContent()) === '42');
  s = await at(p, 'input-rating'); await s.locator('input[value="4"]').check({ force: true }); await p.mouse.move(0, 0); await p.waitForTimeout(300);
  // lit: unlike the fifth star, which stays dark (whatever the colours are)
  const lit = await s.evaluate((el) => { const stars = [...el.querySelectorAll('svg')]; const off = getComputedStyle(stars.at(-1)).fill; return stars.map((g) => getComputedStyle(g).fill !== off).join(); });
  check('rating: four stars lit once chosen', lit === 'true,true,true,true,false', lit);
  s = await at(p, 'input-search'); await s.locator('input').focus(); await p.waitForTimeout(600);
  check('search field: opens on focus', (await s.locator('.lb-search').evaluate((el) => el.getBoundingClientRect().width)) > 200);

  s = await at(p, 'fb-shake'); await s.locator('button').click(); await p.waitForTimeout(100);
  const bad = { invalid: await s.locator('input').getAttribute('aria-invalid'), msg: await s.locator('.lb-shake-message').textContent(), focus: await p.evaluate(() => document.activeElement.id) };
  await s.locator('input').fill('jean@example.com'); await s.locator('button').click(); await p.waitForTimeout(100);
  check('error shake: says why and focuses the field; a valid email gets thanks', bad.invalid === 'true' && bad.msg === 'Please enter your email.' && bad.focus === 'lb-shake-email' && (await s.locator('.lb-shake-message').textContent()) === 'Thanks, you are in.', JSON.stringify(bad));
  s = await at(p, 'fb-steps'); await s.locator('[data-step="1"]').click(); await p.waitForTimeout(100);
  check('steps: next marks the first done, the second current', await s.evaluate((el) => [...el.querySelectorAll('li')].map((li) => (li.hasAttribute('data-done') ? 'done' : li.getAttribute('aria-current') ?? '-')).join()) === 'done,step,-');
  // focused from the keyboard: Tab from the steps' Next button, then past that card's Code button
  s = await at(p, 'fb-tooltip'); await p.locator('.lab-card[data-demo="fb-steps"] [data-step="1"]').focus(); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(400);
  const tipFocus = await p.evaluate(() => document.activeElement.getAttribute('aria-describedby'));
  const shown = await s.locator('[role=tooltip]').evaluate((el) => getComputedStyle(el).visibility);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  check('tooltip: shows on keyboard focus, Escape hides it', tipFocus === 'lb-tip-text' && shown === 'visible' && (await s.locator('[role=tooltip]').evaluate((el) => getComputedStyle(el).visibility)) === 'hidden', `${tipFocus} ${shown}`);
  s = await at(p, 'fb-confetti'); await s.locator('button').click(); await p.waitForTimeout(150);
  const pieces = await s.locator('i').count(); await p.waitForTimeout(1700);
  check('confetti: thirty pieces, all gone after', pieces === 30 && (await s.locator('i').count()) === 0, `${pieces}`);

  // the archive demos have their own test (test-archive)
  check('no errors or warnings', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// The menu column keeps its width in both languages: nothing in it is cut
// off on the right (a long label once widened it past its column)
for (const lang of ['en', 'fr']) {
  for (const width of [1024, 1280, 1440]) {
    const ctx = await b.newContext({ viewport: { width, height: 900 } });
    await ctx.addInitScript((l) => { try { localStorage.setItem('lang', l); } catch {} }, lang);
    const p = await ctx.newPage();
    await p.goto(URL_); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const side = document.querySelector('.lab-side'); const edge = side.getBoundingClientRect().right;
      const parts = [...side.querySelectorAll('input, .lab-chip, .lab-chip-count, .lab-pause')];
      return { w: Math.round(side.getBoundingClientRect().width), scroll: side.scrollWidth - side.clientWidth, cut: parts.filter((el) => el.getBoundingClientRect().right > edge + 0.5).map((el) => el.className || el.tagName), pauseLines: Math.round(side.querySelector('.lab-pause').getBoundingClientRect().height) };
    });
    check(`${lang} ${width}px: menu 220px wide, search, chips, counts and pause all inside it`, r.w === 220 && r.scroll <= 0 && r.cut.length === 0 && r.pauseLines <= 42, JSON.stringify(r));
    await ctx.close();
  }
}

// Phone: the bar of categories stays under the header, search above the grid
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'fr-FR' });
  await ctx.addInitScript(() => { try { localStorage.setItem('lang', 'fr'); } catch {} });
  const p = await ctx.newPage();
  await p.goto(URL_); await p.waitForTimeout(800);
  await p.evaluate(() => scrollTo(0, 3000)); await p.waitForTimeout(400);
  const bar = await p.evaluate(() => { const s = document.querySelector('.lab-side').getBoundingClientRect(); return { top: Math.round(s.top), h: Math.round(s.height), w: Math.round(s.width), over: document.documentElement.scrollWidth - innerWidth, narrow: getComputedStyle(document.querySelector('.lab-tools-narrow')).display, wide: getComputedStyle(document.querySelector('.lab-side-wide')).display }; });
  check('phone: one row of categories stuck under the header, full width, no sideways scroll', bar.top >= 70 && bar.top <= 74 && bar.h < 70 && bar.w >= 389 && bar.over === 0 && bar.narrow === 'flex' && bar.wide === 'none', JSON.stringify(bar));
  await p.locator('.lab-filters .lab-chip', { hasText: 'Fonds' }).tap(); await p.waitForTimeout(1300);
  const r = await p.evaluate(() => ({ cards: document.querySelectorAll('.lab-card').length, top: Math.round(document.querySelector('.lab-main').getBoundingClientRect().top), barBottom: Math.round(document.querySelector('.lab-side').getBoundingClientRect().bottom) }));
  check('phone: a category from far down, results start just under the bar', r.cards === 4 && r.top >= r.barBottom && r.top <= r.barBottom + 30, JSON.stringify(r));
  await ctx.close();
}

await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
