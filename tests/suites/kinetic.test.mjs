import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
// offsets of every letter from its rest place, read from the inline transform
const offsets = (p) => p.evaluate(() => [...document.querySelectorAll('.kw-letter')].map(el => {
  const m = /translate3d\(([-\d.]+)px, ([-\d.]+)px/.exec(el.style.transform || '');
  return m ? Math.hypot(+m[1], +m[2]) : 0;
}));
const centers = (p) => p.evaluate(() => [...document.querySelectorAll('.kw-letter')].map(el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));

// Desktop, French
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(BASE); await p.mouse.move(2, 899);
  await p.waitForTimeout(100);
  const early = await p.evaluate(() => getComputedStyle(document.querySelectorAll('.kw-letter')[20]).opacity);
  await p.waitForTimeout(2400);
  const settled = await p.evaluate(() => ({ entered: document.querySelector('.kinetic').classList.contains('is-entered'), allVisible: [...document.querySelectorAll('.kw-letter')].every(el => getComputedStyle(el).opacity === '1'), hint: !!document.querySelector('.hero-hint:not(.is-hidden)'), sr: document.querySelector('.hero-title .sr-only').textContent }));
  check('load: letters rise in, then the headline becomes interactive with a hint', parseFloat(early) < 1 && settled.entered && settled.allVisible && settled.hint, `opacity early=${early} ${JSON.stringify(settled)}`);
  check('screen readers get the plain sentence', settled.sr === 'Je crée des interfaces qui bougent.', settled.sr);
  const textTop = await p.evaluate(() => document.querySelector('.hero-text').getBoundingClientRect().top);
  // approach from the top right corner (outside the hero), so the path does not brush other letters
  await p.mouse.move(1430, 30); await p.waitForTimeout(1500);
  const c = await centers(p);
  const target = c[10];
  await p.mouse.move(target.x - 30, target.y + 10, { steps: 6 }); await p.waitForTimeout(350);
  const off = await offsets(p);
  const near = off[10], far = Math.max(...off.slice(0, 3)); // "Je " is far from the pointer
  const c2 = await centers(p);
  check('mouse near letters pushes them away, far letters stay put', near > 5 && far < 0.5, `near=${near.toFixed(1)}px far=${far.toFixed(2)}px`);
  check('pushed away from the pointer, not towards it', c2[10].x > c[10].x, `x ${c[10].x.toFixed(1)} -> ${c2[10].x.toFixed(1)} (pointer at ${(target.x - 30).toFixed(1)})`);
  check('hint fades once the visitor has played', await p.evaluate(() => !!document.querySelector('.hero-hint.is-hidden')));
  check('the text below never moves', await p.evaluate(() => document.querySelector('.hero-text').getBoundingClientRect().top) === textTop);
  await p.mouse.move(700, 880, { steps: 4 }); await p.mouse.move(1430, 899); await p.waitForTimeout(100);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.mouse.move(5, 895); // leave hero zone? hero ends before bottom on 900 tall screen
  await p.waitForTimeout(1600);
  const rest = await offsets(p);
  check('pointer gone: every letter springs back to its place', Math.max(...rest) < 0.3, `max offset ${Math.max(...rest).toFixed(2)}px`);
  // click: shockwave
  const c3 = await centers(p);
  await p.mouse.click(c3[5].x, c3[5].y + 30); await p.waitForTimeout(120);
  const shock = await offsets(p);
  check('click on the headline: shockwave throws nearby letters', shock.filter(v => v > 4).length >= 4, `${shock.filter(v => v > 4).length} letters moved > 4px`);
  await p.mouse.move(1435, 899); await p.waitForTimeout(2200);
  check('then they bounce back and settle', Math.max(...await offsets(p)) < 0.3);
  // clicking a button must not throw letters
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
  await p.click('.hero-actions .btn-secondary', { noWaitAfter: true }); await p.waitForTimeout(100);
  check('clicking a hero button does not trigger the shockwave', Math.max(...await offsets(p)) < 6);
  await p.waitForTimeout(3000); // let the smooth scroll to #contact finish
  // accent word jump
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); }); await p.waitForTimeout(600);
  await p.mouse.move(1430, 30); await p.waitForTimeout(1500);
  check('back at the top before testing the jump', await p.evaluate(() => scrollY) === 0);
  const acc = await (await p.$('.kw-accent')).boundingBox();
  await p.mouse.move(acc.x + 5, acc.y + acc.height / 2, { steps: 3 }); await p.waitForTimeout(150);
  check('pointer arriving on "bougent": its letters jump', await p.evaluate(() => document.querySelector('.kw-accent').classList.contains('is-jumping')));
  await p.waitForTimeout(1400);
  check('the jump ends cleanly', await p.evaluate(() => !document.querySelector('.kw-accent').classList.contains('is-jumping') && [...document.querySelectorAll('.kw-inner')].every(el => getComputedStyle(el).transform === 'none')));
  // language switch keeps everything working
  await p.mouse.move(1435, 899);
  await p.click('.lang-btn[lang="en"]'); await p.waitForTimeout(2800);
  const en = await p.evaluate(() => ({ entered: document.querySelector('.kinetic').classList.contains('is-entered'), sr: document.querySelector('.hero-title .sr-only').textContent }));
  const ce = await centers(p);
  await p.mouse.move(ce[3].x - 25, ce[3].y, { steps: 5 }); await p.waitForTimeout(300);
  check('in English the headline is rebuilt and reacts too', en.entered && en.sr === 'I build interfaces that move.' && (await offsets(p))[3] > 5, JSON.stringify(en));
  check('no JavaScript errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
}
// Words never split across lines, at every width, both languages
{
  let splits = 0;
  for (const w of [320, 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920]) for (const lang of ['fr', 'en']) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, locale: lang === 'fr' ? 'fr-FR' : 'en-GB', timezoneId: lang === 'fr' ? 'Europe/Paris' : 'Europe/London' });
    await p.goto(BASE); await p.waitForTimeout(2300);
    splits += await p.evaluate(() => [...document.querySelectorAll('.kw-word')].filter(word => new Set([...word.querySelectorAll('.kw-letter')].map(l => Math.round(l.getBoundingClientRect().bottom / 4))).size > 1).length);
    await p.close();
  }
  check('no word is ever cut across two lines (10 widths x 2 languages)', splits === 0, `${splits} split words`);
}
// Phone: a tap sends the shockwave
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(2500);
  check('phone: hint says "Touchez le titre"', await p.evaluate(() => getComputedStyle(document.querySelector('.hint-touch')).display !== 'none' && getComputedStyle(document.querySelector('.hint-hover')).display === 'none'));
  const c = await centers(p);
  await p.touchscreen.tap(c[8].x, c[8].y); await p.waitForTimeout(100);
  check('phone: tapping the headline makes the letters burst', (await offsets(p)).filter(v => v > 3).length >= 3);
  await p.waitForTimeout(2200);
  check('phone: then everything settles, page not scrolled', Math.max(...await offsets(p)) < 0.3 && await p.evaluate(() => scrollY) === 0);
  await ctx.close();
}
// Reduce motion: nothing moves at all
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(800);
  const c = await centers(p);
  await p.mouse.move(c[10].x - 20, c[10].y, { steps: 5 }); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ anim: [...document.querySelectorAll('.kw-letter')].every(el => getComputedStyle(el).animationName === 'none'), visible: [...document.querySelectorAll('.kw-letter')].every(el => getComputedStyle(el).opacity === '1'), hint: !!document.querySelector('.hero-hint'), underline: getComputedStyle(document.querySelector('.kw-underline path')).strokeDashoffset }));
  check('reduce motion: headline shown at once, no physics, no hint, underline drawn', r.anim && r.visible && !r.hint && Math.max(...await offsets(p)) === 0 && ['0', '0px'].includes(r.underline), JSON.stringify(r));
  await ctx.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
await b.close();
process.exit(fail ? 1 : 0);
