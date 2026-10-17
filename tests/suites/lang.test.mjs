import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const visitors = [
  ['French person in Toulouse', 'fr-FR', 'Europe/Paris', 'fr'],
  ['English speaker living in France (Airbus expat)', 'en-GB', 'Europe/Paris', 'fr'],
  ['Visitor in Réunion (French overseas)', 'en-US', 'Indian/Reunion', 'fr'],
  ['Visitor in Monaco', 'en-US', 'Europe/Monaco', 'fr'],
  ['Recruiter in London', 'en-GB', 'Europe/London', 'en'],
  ['Client in Sydney', 'en-AU', 'Australia/Sydney', 'en'],
  ['Client in Melbourne', 'en-AU', 'Australia/Melbourne', 'en'],
  ['Danish visitor in Copenhagen', 'da-DK', 'Europe/Copenhagen', 'en'],
  ['German visitor in Berlin', 'de-DE', 'Europe/Berlin', 'en'],
  ['American visitor in New York', 'en-US', 'America/New_York', 'en'],
  ['French speaker in Brussels', 'fr-BE', 'Europe/Brussels', 'fr'],
  ['French speaker in Montreal', 'fr-CA', 'America/Toronto', 'fr'],
  ['French person on holiday in New York', 'fr-FR', 'America/New_York', 'fr'],
];
for (const [who, locale, timezoneId, want] of visitors) {
  const ctx = await b.newContext({ locale, timezoneId, viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ shown: document.querySelector('.lang-btn.active').textContent, htmlLang: document.documentElement.lang, title: document.title, heading: document.querySelector('#about h2').textContent, pressed: [...document.querySelectorAll('.lang-btn')].map(x => x.getAttribute('aria-pressed')).join('/') }));
  const ok = r.shown.toLowerCase() === want && r.htmlLang === want && r.heading === (want === 'fr' ? 'À propos' : 'About') && r.title.startsWith(want === 'fr' ? 'Mathias Knudsen | Développeur' : 'Mathias Knudsen | Fullstack') && r.pressed === (want === 'fr' ? 'true/false' : 'false/true');
  check(`${who} (${locale}, ${timezoneId}) -> ${want.toUpperCase()}`, ok, `${r.shown}, lang=${r.htmlLang}, pressed=${r.pressed}`);
  await ctx.close();
}
// A visitor's own choice is remembered across visits and wins over location
{
  const ctx = await b.newContext({ locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(300);
  await p.click('.lang-btn[lang="en"]'); await p.waitForTimeout(700);
  const now = await p.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, h: document.querySelector('#about h2').textContent }));
  check('clicking EN switches language, page language and tab title', now.lang === 'en' && now.h === 'About' && now.title.includes('Fullstack & Shopify Developer'), JSON.stringify(now));
  await p.reload(); await p.waitForTimeout(400);
  check('the EN choice is remembered after reload', await p.evaluate(() => document.documentElement.lang) === 'en');
  await p.click('.lang-btn[lang="fr"]'); await p.waitForTimeout(700);
  await p.reload(); await p.waitForTimeout(400);
  check('switching back to FR is remembered too', await p.evaluate(() => document.documentElement.lang) === 'fr');
  await ctx.close();
}
// Storage blocked (strict privacy settings): page must still work
{
  const ctx = await b.newContext({ locale: 'en-US', timezoneId: 'America/New_York' });
  await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(300);
  await p.click('.lang-btn[lang="fr"]'); await p.waitForTimeout(700);
  check('with storage blocked the page still loads and switches language', errs.length === 0 && await p.evaluate(() => document.documentElement.lang) === 'fr', errs.join('; '));
  await ctx.close();
}
// Reduce motion: language switch is instant (no blank flash), pulse animation stops
{
  const ctx = await b.newContext({ locale: 'fr-FR', timezoneId: 'Europe/Paris', reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(300);
  await p.click('.lang-btn[lang="en"]');
  const r = await p.evaluate(() => new Promise(res => requestAnimationFrame(() => res({ lang: document.documentElement.lang, opacity: getComputedStyle(document.querySelector('main')).opacity }))));
  check('reduce motion: language switches instantly without fading out', r.lang === 'en' && r.opacity === '1', JSON.stringify(r));
  const anim = await p.evaluate(() => { const s = getComputedStyle(document.querySelector('.pulse-dot')); return { dur: s.animationDuration, count: s.animationIterationCount }; });
  check('reduce motion: pulsing dot stops', anim.count === '1' && parseFloat(anim.dur) < 0.001, JSON.stringify(anim));
  check('reduce motion: no smooth scrolling', await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior) === 'auto');
  await ctx.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
await b.close();
process.exit(fail ? 1 : 0);
