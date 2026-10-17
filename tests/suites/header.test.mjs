import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const opts = { locale: 'fr-FR', timezoneId: 'Europe/Paris' };
const headingTop = (p, id) => p.evaluate((id) => Math.round(document.querySelector(`#${id} h2`).getBoundingClientRect().top), id);
const headerBottom = (p) => p.evaluate(() => Math.round(document.querySelector('.site-header').getBoundingClientRect().bottom));

// Desktop
{
  const ctx = await b.newContext({ ...opts, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(BASE); await p.waitForTimeout(500);
  check('desktop: no section highlighted while on the hero', await p.evaluate(() => !document.querySelector('.header-link.active')));
  await p.keyboard.press('PageDown'); await p.waitForTimeout(900);
  check('desktop: Page Down scrolls the page', await p.evaluate(() => scrollY) > 300);
  check('desktop: header stays at the top', await p.evaluate(() => document.querySelector('.site-header').getBoundingClientRect().top) === 0);
  for (const [i, id] of [[1, 'about'], [2, 'work'], [3, 'services'], [4, 'proof']]) {
    await p.click(`.header-nav a:nth-child(${i})`); await p.waitForTimeout(1400);
    const top = await headingTop(p, id), hb = await headerBottom(p);
    const active = await p.evaluate(() => document.querySelector('.header-link.active')?.getAttribute('href'));
    check(`desktop: "${id}" link lands just under the header and is highlighted`, top >= hb && top <= hb + 40 && active === '#' + id, `heading top=${top}, header bottom=${hb}, active=${active}`);
  }
  await p.click('.header-cta'); await p.waitForTimeout(1400);
  check('desktop: "Me contacter" button goes to the contact section', await p.evaluate(() => location.hash) === '#contact');
  await p.click('.brand'); await p.waitForTimeout(1400);
  check('desktop: logo goes back to the top', await p.evaluate(() => scrollY) === 0);
  // skip link, on a freshly loaded page
  await p.goto(BASE); await p.waitForTimeout(400);
  await p.keyboard.press('Tab'); await p.waitForTimeout(250);
  const skip = await p.evaluate(() => { const a = document.activeElement; return { cls: a.className, top: Math.round(a.getBoundingClientRect().top) }; });
  check('keyboard: first Tab shows the "skip to content" link', skip.cls === 'skip-link' && skip.top >= 0, JSON.stringify(skip));
  await p.keyboard.press('Enter'); await p.waitForTimeout(600);
  check('keyboard: it moves focus to the main content', await p.evaluate(() => document.activeElement.id) === 'main');
  check('desktop: menu button hidden on wide screens', await p.evaluate(() => getComputedStyle(document.querySelector('.menu-btn')).display) === 'none');
  check('desktop: no errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Phone and tablet menu
for (const [w, h] of [[390, 844], [768, 1024]]) {
  const ctx = await b.newContext({ ...opts, viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(500);
  await p.tap('.menu-btn'); await p.waitForTimeout(500);
  const open = await p.evaluate(() => ({
    expanded: document.querySelector('.menu-btn').getAttribute('aria-expanded'),
    panel: !!document.querySelector('#mobile-menu'),
    focus: document.activeElement.getAttribute('href'),
    inert: document.querySelector('.content').hasAttribute('inert'),
    locked: document.documentElement.style.overflow,
    covers: (() => { const r = document.querySelector('#mobile-menu').getBoundingClientRect(); return r.bottom >= innerHeight - 1 && r.width >= innerWidth - 1; })(),
    label: document.querySelector('.menu-btn .sr-only').textContent,
  }));
  check(`${w}px: menu opens full screen, focus on the first link`, open.expanded === 'true' && open.panel && open.covers && open.focus === '#about', JSON.stringify(open));
  check(`${w}px: page behind is paused (not focusable, not scrollable) and button says "Fermer le menu"`, open.inert && open.locked === 'hidden' && open.label === 'Fermer le menu');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const closed = await p.evaluate(() => ({ panel: !!document.querySelector('#mobile-menu'), focus: document.activeElement.className, inert: document.querySelector('.content').hasAttribute('inert'), locked: document.documentElement.style.overflow }));
  check(`${w}px: Escape closes it and gives focus back to the menu button`, !closed.panel && closed.focus === 'menu-btn' && !closed.inert && closed.locked === '', JSON.stringify(closed));
  for (const id of ['work', 'proof', 'contact']) {
    await p.tap('.menu-btn'); await p.waitForTimeout(450);
    await p.tap(`#mobile-menu a[href="#${id}"]`); await p.waitForTimeout(1400);
    const top = await headingTop(p, id), hb = await headerBottom(p);
    const atBottom = await p.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2);
    check(`${w}px: menu link "${id}" closes the menu and lands under the header`, await p.evaluate(() => !document.querySelector('#mobile-menu')) && top >= hb && (top <= hb + 40 || atBottom), `top=${top} header=${hb}`);
  }
  await ctx.close();
}
// Menu closes by itself if the window becomes wide
{
  const ctx = await b.newContext({ ...opts, viewport: { width: 800, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(400);
  await p.click('.menu-btn'); await p.waitForTimeout(300);
  await p.setViewportSize({ width: 1300, height: 900 }); await p.waitForTimeout(400);
  check('menu closes when the window grows to desktop width', await p.evaluate(() => !document.querySelector('#mobile-menu') && !document.querySelector('.content').hasAttribute('inert') && document.documentElement.style.overflow === ''));
  await ctx.close();
}
// Every header item stays on one line, inside the header, without overlaps,
// at the narrow desktop widths where the six links are tightest
{
  const bad = [];
  for (const locale of ['fr-FR', 'en-GB']) {
    for (const w of [1080, 1120, 1180, 1239, 1240, 1280, 1440]) {
      const p = await b.newPage({ viewport: { width: w, height: 300 }, locale });
      await p.goto(BASE + '/blog'); await p.waitForTimeout(300);
      const r = await p.evaluate(() => {
        const items = [...document.querySelectorAll('.header-inner .brand-name, .header-link, .header-cta, .lang-btn')];
        const inner = document.querySelector('.header-inner').getBoundingClientRect();
        const boxes = [...document.querySelectorAll('.header-inner > *')].map((el) => el.getBoundingClientRect());
        return {
          tall: items.filter((el) => el.getBoundingClientRect().height > 44).map((el) => el.textContent),
          out: items.filter((el) => el.getBoundingClientRect().right > inner.right + 1).map((el) => el.textContent),
          overlap: boxes.some((a, i) => boxes.some((c, j) => j > i && a.right > c.left + 1 && c.right > a.left + 1)),
        };
      });
      if (r.tall.length || r.out.length || r.overlap) bad.push(`${locale} ${w} ${JSON.stringify(r)}`);
      await p.close();
    }
  }
  check('header: one line, inside, no overlaps, 1080 to 1440 px, both languages', bad.length === 0, bad.join(' | '));
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
await b.close();
process.exit(fail ? 1 : 0);
