import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
for (const rm of ['no-preference', 'reduce']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const p = await ctx.newPage();
  await p.goto(BASE + '/'); await p.waitForTimeout(600);
  const before = await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  await p.click('.header-link[href="#work"]');
  await p.waitForTimeout(120);
  const mid = await p.evaluate(() => scrollY);
  await p.waitForTimeout(1500);
  const end = await p.evaluate(() => ({ y: scrollY, top: Math.round(document.getElementById('work').getBoundingClientRect().top), sb: getComputedStyle(document.documentElement).scrollBehavior }));
  if (rm === 'no-preference') check('in-page links still scroll smoothly once the visitor clicks', before === 'auto' && end.sb === 'smooth' && mid > 0 && mid < end.y && end.top > 60 && end.top < 140, JSON.stringify({ before, mid, ...end }));
  else check('reduced motion: in-page links jump', end.sb === 'auto' && mid === end.y && end.top > 60 && end.top < 140, JSON.stringify({ mid, ...end }));
  await ctx.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
