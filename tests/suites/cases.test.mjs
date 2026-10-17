import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const axeScan = async (p) => { await p.addScriptTag({ content: AXE }); return p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)); };
// Records, on every page, whether the browser ran a page transition and which elements were named
const RECORD = () => {
  try { sessionStorage.getItem('x') } catch { return }
  // read just after the site's own pagereveal handler (registered later) has named elements
  window.addEventListener('pagereveal', (e) => setTimeout(() => {
    const named = [...document.querySelectorAll('[data-vt-named]')].map((el) => `${el.style.viewTransitionName}:${el.closest('[data-project]')?.dataset.project || (el.closest('[data-vt-page]') ? 'page' : el.closest('.case-next-link') ? 'next' : '?')}`);
    sessionStorage.setItem('reveal', JSON.stringify({ vt: !!e.viewTransition, persisted: performance.getEntriesByType('navigation')[0]?.type, named }));
  }, 0));
  window.addEventListener('pageshow', (e) => sessionStorage.setItem('persisted', String(e.persisted)));
};
const reveal = (p) => p.evaluate(() => JSON.parse(sessionStorage.getItem('reveal') || 'null'));

for (const [lang, locale, tz] of [['fr', 'fr-FR', 'Europe/Paris'], ['en', 'en-GB', 'Europe/London']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale, timezoneId: tz, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript(RECORD);
  const p = await ctx.newPage();
  // Chrome warns about font preloads on second loads in a tab (fonts reused from memory): known, also before this change
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/preloaded using link preload/.test(m.text())) errors.push(m.text()); });
  await p.goto(BASE + '/'); await p.waitForTimeout(800);

  const cards = await p.evaluate(() => [...document.querySelectorAll('.project-card')].map((c) => ({ href: c.querySelector('.project-link').getAttribute('href'), target: c.querySelector('.project-link').target, name: c.querySelector('.project-link').textContent, view: c.querySelector('.project-visit').textContent })));
  check(`${lang}: all 6 cards open their project page in the same tab`, cards.length === 6 && cards.every((c) => /^\/projects\/[a-z0-9-]+$/.test(c.href) && !c.target), cards.map((c) => c.href).join(' '));
  check(`${lang}: card link name is the title, card says "${cards[0].view}"`, cards[0].name === 'AccessEU' && cards[0].view === (lang === 'fr' ? 'Voir le projet' : 'View project'));

  // Click a card
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelectorAll('.project-card')[2].scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(600);
  const homeY = await p.evaluate(() => scrollY);
  const box = await p.locator('.project-card').nth(2).boundingBox();
  await p.mouse.click(box.x + 200, box.y + 120);
  await p.waitForURL('**/projects/pro-ject-audio-australia'); await p.waitForTimeout(900);
  let r = await reveal(p);
  const page1 = await p.evaluate(() => ({ title: document.title, h1: document.querySelector('h1').textContent, hero: document.querySelector('.case-hero img')?.naturalWidth > 0, preload: !!document.querySelector('link[rel=preload][as=image][href="/media/project-au/home.webp"]'), button: !!document.querySelector('.case-play'), visit: document.querySelector('.case-visit')?.href, y: scrollY, named: [...document.querySelectorAll('[data-vt-named]')].map((el) => el.style.viewTransitionName) }));
  check(`${lang}: card click opens the project page`, page1.title === 'Pro-Ject Audio Australia | Mathias Knudsen' && page1.h1 === 'Pro-Ject Audio Australia' && page1.y === 0, `${page1.title} y=${page1.y}`);
  check(`${lang}: the page transition ran with cover and title named on the new page`, r?.vt === true && r.named.includes('case-cover:page') && r.named.includes('case-title:page'), JSON.stringify(r));
  check(`${lang}: the page opens on the store itself, its screen preloaded with the HTML`, page1.hero && page1.preload && !page1.button, JSON.stringify({ hero: page1.hero, preload: page1.preload, button: page1.button }));
  check(`${lang}: "visit the live site" link is on the page`, page1.visit === 'https://www.projectaudio.com.au/');
  const ax1 = await axeScan(p);
  check(`${lang}: axe finds nothing on the project page`, ax1.length === 0, ax1.join(' || '));

  // Header links lead back to the home page
  const hdr = await p.evaluate(() => ({ brand: document.querySelector('.brand').getAttribute('href'), nav: [...document.querySelectorAll('.header-link')].map((a) => a.getAttribute('href')), cta: document.querySelector('.header-cta').getAttribute('href'), back: document.querySelector('.case-back').getAttribute('href') }));
  check(`${lang}: header and back links point to the home page (and the lab and blog)`, hdr.brand === '/' && hdr.nav.join() === '/#about,/#work,/#services,/#proof,/lab,/blog' && hdr.cta === '/#contact' && hdr.back === '/#work', JSON.stringify(hdr));

  // Command menu on a project page
  await p.keyboard.press('Control+k'); await p.waitForTimeout(250);
  const menu = await p.evaluate(() => ({ groups: [...document.querySelectorAll('.cmdk-group-label')].map((g) => g.textContent), opts: [...document.querySelectorAll('.cmdk [role=option]')].map((o) => o.textContent.replace(/#\w+$/, '')) }));
  check(`${lang}: menu lists the 5 other projects, no audit here`, menu.groups.length === 3 && menu.opts.filter((o) => ['AccessEU', 'Interdyn Dealer Portal', 'Pro-Ject Audio Systems', 'Exclusive Construction', 'Trimension Studio'].includes(o)).length === 5 && !menu.opts.includes('Pro-Ject Audio Australia') && !menu.opts.some((o) => /audit/i.test(o)), menu.groups.join(', '));
  await p.keyboard.type(lang === 'fr' ? 'lien' : 'link'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  check(`${lang}: copy link copies this project's public address`, (await p.evaluate(() => navigator.clipboard.readText())) === 'https://mathias-knudsen.vercel.app/projects/pro-ject-audio-australia');

  // Next project
  await p.evaluate(() => document.querySelector('.case-next').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await p.click('.case-next-link');
  await p.waitForURL('**/projects/pro-ject-audio-systems'); await p.waitForTimeout(900);
  r = await reveal(p);
  check(`${lang}: next project opens with the page transition`, r?.vt === true && (await p.evaluate(() => document.querySelector('h1').textContent)) === 'Pro-Ject Audio Systems', JSON.stringify(r));

  // Browser back twice: to the previous project, then to the home page at the card
  await p.goBack(); await p.waitForURL('**/projects/pro-ject-audio-australia'); await p.waitForTimeout(900);
  r = await reveal(p);
  check(`${lang}: back to the previous project`, (await p.evaluate(() => document.querySelector('h1').textContent)) === 'Pro-Ject Audio Australia', JSON.stringify(r));
  await p.goBack(); await p.waitForURL(BASE + '/'); await p.waitForTimeout(1000);
  r = await reveal(p);
  const home = await p.evaluate(() => { const c = document.querySelectorAll('.project-card')[2].getBoundingClientRect(); return { y: scrollY, cardOnScreen: c.top < innerHeight && c.bottom > 0, named: document.querySelectorAll('[data-vt-named]').length, persisted: sessionStorage.getItem('persisted') }; });
  // the morph back into the card needs the page restored from the back/forward cache, off in this test browser
  check(`${lang}: back on the home page, at the card, page transition ran, names cleared`, home.cardOnScreen && Math.abs(home.y - homeY) < 40 && home.named === 0 && r?.vt === true, JSON.stringify({ ...home, homeY, r }));

  // "All projects" after coming from the home page: goes back, to the card
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelectorAll('.project-card')[0].scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(400);
  const ac = await p.locator('.project-card').nth(0).boundingBox();
  const fromY = await p.evaluate(() => scrollY);
  await p.mouse.click(ac.x + 200, ac.y + 120); await p.waitForURL('**/projects/accesseu'); await p.waitForTimeout(700);
  await p.click('.case-back'); await p.waitForURL(BASE + '/'); await p.waitForTimeout(900);
  const backAll = await p.evaluate(() => ({ y: scrollY, len: history.length, url: location.href }));
  check(`${lang}: "all projects" after a card goes back to where the visitor was`, Math.abs(backAll.y - fromY) < 40 && backAll.url === BASE + '/', JSON.stringify({ ...backAll, fromY }));

  // "All projects" when the project page was opened directly: home page at the work section
  {
    const p2 = await ctx.newPage();
    await p2.goto(BASE + '/projects/accesseu'); await p2.waitForTimeout(600);
    await p2.click('.case-back'); await p2.waitForURL('**/#work'); await p2.waitForTimeout(900);
    const work = await p2.evaluate(() => Math.round(document.getElementById('work').getBoundingClientRect().top));
    check(`${lang}: "all projects" from a project opened directly shows the work section`, work > 60 && work < 140, `top=${work}`);
    // header links from a project page land on their section
    await p2.goto(BASE + '/projects/accesseu'); await p2.waitForTimeout(500);
    await p2.click('.header-cta'); await p2.waitForURL('**/#contact'); await p2.waitForTimeout(900);
    const contact = await p2.evaluate(() => ({ top: Math.round(document.getElementById('contact').getBoundingClientRect().top), atBottom: Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight) < 2 }));
    // the last section cannot reach the top: the page is then scrolled to the bottom
    check(`${lang}: header "contact" from a project page lands on the contact section`, contact.top > 60 && (contact.top < 140 || contact.atBottom), JSON.stringify(contact));
    await p2.close();
  }

  // Language switch on a project page
  await p.goto(BASE + '/projects/interdyn-dealer-portal'); await p.waitForTimeout(600);
  await p.click(`.lang-btn[lang=${lang === 'fr' ? 'en' : 'fr'}]`); await p.waitForTimeout(700);
  const sw = await p.evaluate(() => ({ lang: document.documentElement.lang, did: document.querySelector('#case-did').textContent, title: document.title }));
  check(`${lang}: language switch translates the project page`, sw.lang === (lang === 'fr' ? 'en' : 'fr') && sw.did === (lang === 'fr' ? 'What I did' : "Ce que j'ai fait") && sw.title === 'Interdyn Dealer Portal | Mathias Knudsen', JSON.stringify(sw));
  await p.click(`.lang-btn[lang=${lang}]`); await p.waitForTimeout(500);

  check(`${lang}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// 404
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  const res = await p.goto(BASE + '/projects/nope'); await p.waitForTimeout(500);
  const nf = await p.evaluate(() => ({ h1: document.querySelector('h1').textContent, title: document.title, robots: document.querySelector('meta[name=robots]')?.content, link: document.querySelector('.case-missing a').getAttribute('href') }));
  check('404: unknown address answers 404 with a helpful page', res.status() === 404 && nf.h1 === 'Page introuvable' && nf.title === 'Page introuvable | Mathias Knudsen' && nf.robots === 'noindex' && nf.link === '/', JSON.stringify(nf));
  const ax = await axeScan(p);
  check('404: axe finds nothing', ax.length === 0, ax.join(' || '));
  await ctx.close();
}
// A card whose project leads with a screen: the card's drawing morphs into the framed screen
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-GB' });
  await ctx.addInitScript(RECORD);
  const p = await ctx.newPage();
  await p.goto(BASE + '/'); await p.waitForTimeout(700);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelectorAll('.project-card')[1].scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(500);
  const box = await p.locator('.project-card').nth(1).boundingBox();
  await p.mouse.click(box.x + 200, box.y + 60);
  await p.waitForURL('**/projects/interdyn-dealer-portal'); await p.waitForTimeout(900);
  const r = await reveal(p);
  const hero = await p.evaluate(() => ({ named: document.querySelector('.case-hero-window')?.style.viewTransitionName ?? '', img: document.querySelector('.case-hero img')?.naturalWidth > 0, preload: !!document.querySelector('link[rel=preload][as=image][href="/media/interdyn/catalogue.webp"]') }));
  check('screen-led page: the transition names the framed screen as the cover, the screen is preloaded', r?.vt === true && r.named.includes('case-cover:page') && r.named.includes('case-title:page') && hero.img && hero.preload, JSON.stringify({ r, hero }));
  await ctx.close();
}
// Phone and reduced motion
for (const [label, opts] of [['phone', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }], ['reduced motion', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }]]) {
  const ctx = await b.newContext({ locale: 'en-GB', timezoneId: 'Europe/London', ...opts });
  await ctx.addInitScript(RECORD);
  const p = await ctx.newPage();
  for (const slug of ['accesseu', 'interdyn-dealer-portal', 'pro-ject-audio-australia', 'pro-ject-audio-systems', 'exclusive-construction', 'trimension-studio']) {
    await p.goto(`${BASE}/projects/${slug}`); await p.waitForTimeout(400);
    const s = await p.evaluate(() => ({ over: document.documentElement.scrollWidth > innerWidth, button: !!document.querySelector('.case-play'), anim: [...document.querySelectorAll('.case-cover *')].some((el) => getComputedStyle(el).animationName !== 'none'), did: document.querySelectorAll('.case-did li').length, hero: document.querySelector('.case-hero img')?.naturalWidth > 0 }));
    const ax = await axeScan(p);
    // projects with screens lead with their best one (no animation there); the others with the drawing
    const withScreens = true; // every project now leads with screens of the real product
    const okMotion = withScreens ? s.hero && !s.button : label === 'reduced motion' ? !s.button && !s.anim : s.button && s.anim;
    check(`${label}: ${slug} fits, ${withScreens ? 'leads with its screen' : label === 'reduced motion' ? 'still, no pause button' : 'animated with a pause button'}, axe clean`, !s.over && okMotion && s.did >= 3 && ax.length === 0, `${JSON.stringify(s)} ${ax.join(' || ')}`);
  }
  if (label === 'reduced motion') {
    await p.goto(BASE + '/'); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelectorAll('.project-card')[0].scrollIntoView()); await p.waitForTimeout(200);
    await p.locator('.project-card').first().click({ position: { x: 200, y: 120 } }); await p.waitForURL('**/projects/accesseu'); await p.waitForTimeout(500);
    const r = await reveal(p);
    check('reduced motion: no page transition', r && r.vt === false, JSON.stringify(r));
  }
  await ctx.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
