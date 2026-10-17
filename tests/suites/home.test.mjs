// The home sections for clients: brands strip, lab and blog teaser, services
// linked to proof, how I work. Links lead to real pages, cards are clickable,
// the mini demos rest until pointed at, both languages, phone width.
import { chromium } from 'playwright';
import { BASE, ROOT } from '../lib.mjs';
import { POST_META } from '../../src/blog/meta.js';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
// the lab count the site states, read from its source
const LAB = Number((await import('node:fs')).readFileSync(`${ROOT}/src/lab/count.js`, 'utf8').match(/LAB_COUNT = (\d+)/)[1]);
const status = async (path) => (await fetch(BASE + path)).status;

const open = async (lang, width = 1440, extra = {}) => {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, ...extra });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  await p.addInitScript((lang) => { try { localStorage.setItem('lang', lang); } catch {} }, lang);
  await p.goto(BASE + '/'); await p.waitForTimeout(600);
  return { ctx, p, errors };
};

// English, desktop
{
  const { ctx, p, errors } = await open('en');
  const order = await p.evaluate(() => [...document.querySelectorAll('main > section, main > div > section, #main > section')].map((s) => s.id || s.className).filter(Boolean));
  const ids = ['clients', 'about', 'work', 'lab-blog', 'services', 'process', 'contact'];
  const pos = ids.map((id) => order.findIndex((x) => x === id || x.split(' ').includes(id)));
  check('sections in order: clients, about, work, lab and blog, services, process, contact', pos.every((x, i) => x >= 0 && (i === 0 || x > pos[i - 1])), order.join(' > '));

  // the brands strip
  const clients = await p.evaluate(() => ({ label: document.querySelector('#clients-label')?.textContent, links: [...document.querySelectorAll('.clients-link')].map((a) => [a.textContent, a.getAttribute('href')]) }));
  check('brands strip: a labelled list of four brands', clients.label === 'Brands I have built for' && clients.links.length === 4, JSON.stringify(clients));
  for (const [name, href] of clients.links) {
    const page = await ctx.newPage(); await page.goto(BASE + href); await page.waitForTimeout(300);
    const h1 = await page.locator('h1').textContent();
    check(`brand ${name} opens its case study`, h1.toLowerCase().includes(name.toLowerCase().split(' ')[0].toLowerCase()), `${href} > ${h1}`);
    await page.close();
  }

  // the teaser
  const teaser = await p.evaluate(() => {
    const lab = document.querySelector('.teaser-lab'); const blog = document.querySelector('.teaser-blog');
    return { h2: document.querySelector('#teaser-title')?.textContent, labKicker: lab.querySelector('.teaser-kicker').textContent, labHref: lab.querySelector('.teaser-link').getAttribute('href'), labH3: lab.querySelector('h3')?.textContent, pill: lab.querySelector('.tz-pill').textContent, demosHidden: lab.querySelector('.teaser-demos').getAttribute('aria-hidden'), postHref: blog.querySelector('.teaser-link').getAttribute('href'), postTitle: blog.querySelector('.teaser-link').textContent, allHref: blog.querySelector('.teaser-all').getAttribute('href'), kicker: blog.querySelector('.teaser-kicker').textContent };
  });
  check('teaser: heading, lab card, latest post card', teaser.h2 === 'The lab and the blog' && teaser.labH3 === 'The lab' && teaser.labHref === '/lab' && teaser.allHref === '/blog' && teaser.demosHidden === 'true' && teaser.pill === 'Get started', JSON.stringify(teaser));

  const lab = await ctx.newPage(); await lab.goto(BASE + '/lab'); await lab.waitForTimeout(500);
  const demos = await lab.locator('.lab-card').count(); await lab.close();
  check('the lab count on the home page matches the lab', teaser.labKicker === `${demos} animations`, `${teaser.labKicker} vs ${demos}`);
  check('the blog count on the home page matches the blog', teaser.kicker.replace(/\s+/g, ' ').trim().endsWith(`· ${POST_META.length} posts`), teaser.kicker);
  const post = await ctx.newPage(); await post.goto(BASE + teaser.postHref); await post.waitForTimeout(400);
  const postH1 = (await post.locator('h1').textContent()).replace(/ /g, ' '); await post.close();
  check('latest post link opens that post', postH1 === teaser.postTitle.replace(/ /g, ' '), `${teaser.postHref} > ${postH1}`);

  // the mini demos rest until the card is pointed at
  await p.locator('.teaser-lab').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  const play = () => p.evaluate(() => getComputedStyle(document.querySelector('.tz-dots i')).animationPlayState);
  const before = await play();
  await p.locator('.teaser-lab h3').hover(); await p.waitForTimeout(200);
  const during = await play();
  await p.mouse.move(5, 5); await p.waitForTimeout(200);
  check('mini demos still until hovered, then play', before === 'paused' && during === 'running' && (await play()) === 'paused', `${before} ${during}`);

  // the whole card is the link (a real mouse click on its text), the All
  // posts link stays its own
  const clickOn = async (sel) => { const el = p.locator(sel); await el.scrollIntoViewIfNeeded(); const r = await el.boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); };
  await clickOn('.teaser-lab .teaser-text'); await p.waitForURL('**/lab');
  check('a click anywhere on the lab card opens the lab', p.url().endsWith('/lab'), p.url());
  await p.goBack(); await p.waitForTimeout(500);
  await clickOn('.teaser-blog .teaser-text'); await p.waitForURL('**/blog/**');
  check('a click on the post card opens the post', p.url().endsWith(teaser.postHref), p.url());
  await p.goBack(); await p.waitForTimeout(500);
  await clickOn('.teaser-all'); await p.waitForURL('**/blog');
  check('All posts opens the blog', p.url().endsWith('/blog'), p.url());
  await p.goBack(); await p.waitForTimeout(500);

  // keyboard: each card has one stop for its title, plus All posts
  const tabStops = await p.evaluate(() => [...document.querySelectorAll('#lab-blog a, #lab-blog button')].filter((el) => el.tabIndex >= 0).map((el) => el.textContent.trim()));
  check('teaser tab stops: lab, post, all posts', tabStops.length === 3, tabStops.join(' | '));

  // services proof links
  const proofs = await p.evaluate(() => [...document.querySelectorAll('.service-card')].map((card) => ({ title: card.querySelector('h3')?.textContent, proof: card.querySelector('.service-proof')?.getAttribute('href') ?? null, text: card.querySelector('.service-proof')?.textContent ?? null })));
  check('five of six services link to their proof (brand has none)', proofs.filter((s) => s.proof).length === 5 && proofs.length === 6, JSON.stringify(proofs.map((s) => s.proof)));
  for (const s of proofs.filter((s) => s.proof)) {
    const code = await status(s.proof);
    check(`service ${s.title}: ${s.text} leads to a page`, code === 200, `${s.proof} ${code}`);
  }

  // process
  const steps = await p.evaluate(() => ({ tag: document.querySelector('.process')?.tagName, titles: [...document.querySelectorAll('.process-title')].map((h) => [h.tagName, h.textContent]), nums: [...document.querySelectorAll('.process-num')].map((n) => [n.textContent, n.getAttribute('aria-hidden')]) }));
  check('process: an ordered list of four steps with h3 titles, numbers hidden from screen readers', steps.tag === 'OL' && steps.titles.length === 4 && steps.titles.every(([tag]) => tag === 'H3') && steps.nums.every(([, h]) => h === 'true') && steps.nums.map(([n]) => n).join() === '01,02,03,04', JSON.stringify(steps));
  const cols = await p.evaluate(() => getComputedStyle(document.querySelector('.process')).gridTemplateColumns.split(' ').length);
  check('process: four columns on a wide screen', cols === 4, String(cols));

  check('no console errors (English)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// French
{
  const { ctx, p, errors } = await open('fr');
  const fr = await p.evaluate(() => ({ label: document.querySelector('#clients-label')?.textContent, teaser: document.querySelector('#teaser-title')?.textContent, pill: document.querySelector('.tz-pill')?.textContent, process: document.querySelector('#process-title')?.textContent, steps: [...document.querySelectorAll('.process-title')].map((h) => h.textContent), proof: document.querySelector('.service-proof')?.textContent, kicker: document.querySelector('.teaser-lab .teaser-kicker')?.textContent }));
  check('French: labels, steps and proof links translated', fr.label === "Des marques pour lesquelles j'ai travaillé" && fr.teaser === 'Le lab et le blog' && fr.pill === 'Commencer' && fr.process === 'Comment je travaille' && fr.steps.join() === 'Comprendre,Concevoir,Développer,Lancer et suivre' && fr.proof.startsWith('À voir dans') && fr.kicker === `${LAB} animations`, JSON.stringify(fr));
  check('no console errors (French)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Phone and tablet: no sideways scroll, process columns
for (const [w, n] of [[320, 1], [375, 1], [768, 2], [1024, 2]]) {
  const { ctx, p } = await open('fr', w);
  const r = await p.evaluate(() => ({ over: document.documentElement.scrollWidth - innerWidth, cols: getComputedStyle(document.querySelector('.process')).gridTemplateColumns.split(' ').length, wide: [...document.querySelectorAll('.clients, #lab-blog, #process, #services')].flatMap((s) => [...s.querySelectorAll('*')]).filter((el) => el.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed').map((el) => el.className).slice(0, 5) }));
  check(`${w}px: no sideways scroll, ${n} process column(s)`, r.over === 0 && r.cols === n && r.wide.length === 0, JSON.stringify(r));
  await ctx.close();
}

// Reduced motion: the mini demos never move
{
  const { ctx, p } = await open('en', 1440, { reducedMotion: 'reduce' });
  await p.locator('.teaser-lab h3').hover(); await p.waitForTimeout(200);
  const names = await p.evaluate(() => [...document.querySelectorAll('.tz-dots i, .tz-chevrons i')].map((el) => getComputedStyle(el).animationName).concat(getComputedStyle(document.querySelector('.tz-pill'), '::after').animationName));
  check('reduced motion: mini demos have no animation', names.every((n) => n === 'none'), names.join());
  await ctx.close();
}

await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
