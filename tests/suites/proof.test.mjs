import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const goProof = async (p) => { await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById('proof').scrollIntoView(); }); await p.waitForTimeout(1500); };

for (const [lang, locale, tz] of [['fr', 'fr-FR', 'Europe/Paris'], ['en', 'en-GB', 'Europe/London']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale, timezoneId: tz });
  const p = await ctx.newPage();
  const scripts = []; p.on('request', r => { if (r.resourceType() === 'script') scripts.push(r.url().split('/').pop()); });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(800);
  await goProof(p);
  check(`${lang}: the audit engine is NOT downloaded with the page`, !scripts.some(s => s.startsWith('axe')), scripts.join(', '));
  const perf = await p.evaluate(() => { const c = document.querySelectorAll('.proof-card')[1]; return { big: c.querySelector('.proof-big .sr-only')?.textContent, facts: [...c.querySelectorAll('.proof-facts li')].map(l => l.textContent) }; });
  const nav = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return n.loadEventEnd; });
  const seconds = parseFloat((perf.big || '').replace(',', '.'));
  check(`${lang}: load time shown is the real one from this visit`, perf.big && Math.abs(seconds - nav / 1000) < 0.006, `${perf.big} vs measured ${(nav / 1000).toFixed(3)} s`);
  check(`${lang}: page weight and requests shown`, perf.facts.length === 2 && /\d/.test(perf.facts[0]) && /\d/.test(perf.facts[1]), perf.facts.join(' | '));
  const label = await p.evaluate(() => document.querySelector('.proof-button').textContent);
  await p.click('.proof-button');
  await p.waitForTimeout(80);
  const running = await p.evaluate(() => ({ text: document.querySelector('.proof-console').textContent, disabled: document.querySelector('.proof-button').getAttribute('aria-disabled') === 'true', focused: document.activeElement === document.querySelector('.proof-button') }));
  await p.waitForFunction(() => document.querySelector('.console-result') || document.querySelector('.console-error'), null, { timeout: 30000 });
  const done = await p.evaluate(() => ({ number: document.querySelector('.console-number')?.textContent, line: document.querySelector('.console-result')?.textContent, meta: document.querySelectorAll('.proof-console .console-line')[0]?.textContent, live: document.querySelector('.proof-console').getAttribute('aria-live'), again: document.querySelector('.proof-button').textContent, issues: [...document.querySelectorAll('.console-issues li')].map(l => l.textContent) }));
  check(`${lang}: clicking "${label}" shows a running state, button marked busy and keeps focus`, running.disabled && running.focused && /Audit en cours|Auditing/.test(running.text), running.text);
  check(`${lang}: the engine is downloaded only now`, scripts.some(s => s.startsWith('axe')));
  check(`${lang}: live audit finds 0 accessibility problems`, done.number === '0' && done.issues.length === 0, `${done.line} ${done.issues.join(', ')}`);
  check(`${lang}: shows rules checked and time, announced to screen readers`, /\d+ (règles vérifiées|rules checked) (en|in) \d[,.]\d\d s/.test(done.meta || '') && done.live === 'polite', done.meta);
  check(`${lang}: wording and button after the audit`, lang === 'fr' ? (done.line === '0 problème détecté' && done.again === 'Relancer') : (done.line === '0 issues found' && done.again === 'Run again'), `${done.line} / ${done.again}`);
  await p.click('.proof-button'); await p.waitForTimeout(100);
  await p.waitForFunction(() => document.querySelector('.console-result') && document.querySelector('.proof-button').getAttribute('aria-disabled') !== 'true', null, { timeout: 30000 });
  check(`${lang}: the audit can be run again`, await p.evaluate(() => document.querySelector('.console-number').textContent) === '0');
  const you = await p.evaluate(() => [...document.querySelectorAll('.proof-checks li')].map(l => l.textContent));
  check(`${lang}: "adapted to you" says language was picked from the device`, lang === 'fr' ? you[1] === 'Français, choisi selon votre appareil' : you[1] === 'English, picked from your device settings', you[1]);
  await p.click(`.lang-btn[lang="${lang}"]`); await p.waitForTimeout(300);
  const you2 = await p.evaluate(() => document.querySelectorAll('.proof-checks li')[1].textContent);
  check(`${lang}: after clicking the language button it says "as you chose"`, lang === 'fr' ? you2 === "Français, comme vous l'avez choisi" : you2 === 'English, as you chose', you2);
  check(`${lang}: animations line says "on"`, /activées|Animations on/.test(you[0]), you[0]);
  check(`${lang}: no errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
// reduce motion: card says so, numbers shown at once
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', locale: 'fr-FR', timezoneId: 'Europe/Paris', isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(600);
  await goProof(p);
  const r = await p.evaluate(() => ({ motion: document.querySelector('.proof-checks li').textContent, shown: document.querySelector('.proof-big [aria-hidden="true"]')?.textContent, real: document.querySelector('.proof-big .sr-only')?.textContent }));
  check('reduce motion: card says animations are reduced, no counting animation', r.motion === 'Animations réduites, comme le demande votre appareil' && r.shown === r.real, JSON.stringify(r));
  await ctx.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
await b.close();
process.exit(fail ? 1 : 0);
