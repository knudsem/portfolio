import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
async function scrollAll(p) {
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += 300) { await p.evaluate(y => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, y); }, y); await p.waitForTimeout(80); }
  await p.waitForTimeout(1200);
}
const hidden = (p) => p.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(el => getComputedStyle(el).opacity !== '1').length);

// Normal motion
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(100);
  const early = await p.evaluate(() => getComputedStyle(document.querySelector('.kw-letter')).opacity);
  await p.waitForTimeout(2600);
  const late = await p.evaluate(() => ({ letters: [...document.querySelectorAll('.kw-letter')].every(l => getComputedStyle(l).opacity === '1'), underline: getComputedStyle(document.querySelector('.kw-underline path')).strokeDashoffset, entered: document.querySelector('.kinetic').classList.contains('is-entered') }));
  check('hero word letters animate in, then are fully visible', parseFloat(early) < 1 && late.letters && late.entered, `opacity at 0.1s=${early}, done=${JSON.stringify(late)}`);
  check('underline is drawn after the letters', ['0', '0px'].includes(late.underline), late.underline);
  const total = await p.evaluate(() => document.querySelectorAll('[data-reveal]').length);
  const before = await hidden(p);
  check('blocks below the screen start hidden, waiting to fade in', before > 0 && before <= total, `${before}/${total} hidden at load`);
  await scrollAll(p);
  check('after scrolling, every block is visible (none stuck)', await hidden(p) === 0, `${await hidden(p)} still hidden`);
  // hover wave
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.hover('.kw-accent'); await p.waitForTimeout(80);
  const waving = await p.evaluate(() => document.querySelector('.kw-accent').classList.contains('is-jumping'));
  await p.waitForTimeout(1200);
  const after = await p.evaluate(() => ({ waving: document.querySelector('.kw-accent').classList.contains('is-jumping'), letters: [...document.querySelectorAll('.kw-letter')].every(l => getComputedStyle(l).opacity === '1') }));
  check('hovering the word plays the jump once, letters stay visible', waving && !after.waving && after.letters, JSON.stringify(after));
  // language switch: no block disappears
  await p.click('.lang-btn[lang="en"]'); await p.waitForTimeout(1200);
  check('after switching language, still no hidden block', await hidden(p) === 0);
  const word = await p.evaluate(() => document.querySelector('.hero-title .sr-only').textContent);
  await p.waitForTimeout(1500);
  check('the English word "move" animates in too and ends visible', word === 'I build interfaces that move.' && await p.evaluate(() => [...document.querySelectorAll('.kw-letter')].every(l => getComputedStyle(l).opacity === '1')));
  await ctx.close();
}
// Reduced motion: nothing hidden, nothing moving
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(150);
  const r = await p.evaluate(() => ({ revealReady: document.documentElement.classList.contains('reveal-ready'), letters: [...document.querySelectorAll('.kw-letter')].map(l => getComputedStyle(l).animationName).join(','), opacity: getComputedStyle(document.querySelector('.kw-letter')).opacity, underline: getComputedStyle(document.querySelector('.kw-underline path')).strokeDashoffset }));
  check('reduce motion: no scroll reveal at all', !r.revealReady && await hidden(p) === 0, JSON.stringify(r));
  check('reduce motion: hero word shown immediately, no letter animation, underline already drawn', r.opacity === '1' && /^(none,?)+$/.test(r.letters) && ['0', '0px'].includes(r.underline), JSON.stringify(r));
  await ctx.close();
}
// Printing the page shows everything
{
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(300);
  await p.emulateMedia({ media: 'print' });
  check('print: every block visible even if never scrolled to', await hidden(p) === 0);
  await ctx.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
await b.close();
process.exit(fail ? 1 : 0);
