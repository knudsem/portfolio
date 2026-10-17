// The AccessEU case study: sections, screens, honest wording, accessibility, both languages, phone and desktop
import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE, PRIVATE, skipPrivate } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
for (const [lang, locale, w, h, mobile] of [['fr', 'fr-FR', 1440, 900, false], ['en', 'en-GB', 1440, 900, false], ['fr', 'fr-FR', 390, 844, true], ['en', 'en-GB', 360, 740, true]]) {
  const label = `${lang} ${w}`;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, locale });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  const failed = []; p.on('requestfailed', (r) => failed.push(r.url()));
  await p.goto(BASE + '/projects/accesseu'); await p.waitForTimeout(500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h / 2) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(70); }
  await p.evaluate(() => Promise.race([Promise.all([...document.images].filter((i) => i.getClientRects().length).map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))), new Promise((r) => setTimeout(r, 8000))]));
  const info = await p.evaluate(() => ({
    h2: [...document.querySelectorAll('main h2')].map((e) => e.textContent),
    imgs: [...document.querySelectorAll('.case-shots img')].map((i) => ({ ok: i.naturalWidth > 0, alt: i.alt, lazy: i.loading, w: i.getAttribute('width'), h: i.getAttribute('height') })),
    wide: [...document.querySelectorAll('.case-shot.is-wide:not(.case-phones)')].length,
    hero: document.querySelector('.case-hero img')?.naturalWidth > 0,
    story: document.querySelectorAll('.case-story p').length,
    did: document.querySelectorAll('.case-did li').length,
    highlights: document.querySelectorAll('.case-highlights li').length,
    text: document.body.innerText,
    over: document.documentElement.scrollWidth > innerWidth,
  }));
  const expectH2 = lang === 'fr' ? ['Le projet', "Ce que j'ai fait", 'En bref', 'En images', 'Les détails qui comptent', 'Un projet similaire ?'] : ['The project', 'What I did', 'Details', 'Screens', 'Details that matter', 'Have a similar project?'];
  check(`${label}: sections in order`, JSON.stringify(info.h2).replace(/\u00a0/g, ' ') === JSON.stringify(expectH2), info.h2.join(' | '));
  check(`${label}: the report leads the page; 5 more screens load, described, lazy, sized; the brief shown wide`, info.hero && info.imgs.length === 5 && info.imgs.every((i) => i.ok && i.alt.length > 10 && i.lazy === 'lazy' && i.w && i.h) && info.wide === 1 && failed.length === 0, `${info.imgs.filter((i) => i.ok).length} ok, wide ${info.wide} ${failed.join(',')}`);
  check(`${label}: story 2, did 6, details 4`, info.story === 2 && info.did === 6 && info.highlights === 4, `${info.story} ${info.did} ${info.highlights}`);
  check(`${label}: honest wording (no 100 rules, launch in preparation, demo data said)`, !/100 (rules|règles)/.test(info.text) && /(being prepared|en préparation)/.test(info.text) && /(demo store|boutique de démonstration)/.test(info.text) && /251/.test(info.text));
  if (PRIVATE) check(`${label}: nothing about the location or the team`, !PRIVATE.test(info.text));
  else skipPrivate(`${label}: nothing about the location or the team`);
  check(`${label}: no sideways scrolling`, !info.over);
  await p.addScriptTag({ content: AXE });
  const ax = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`));
  check(`${label}: axe finds nothing`, ax.length === 0, ax.join(' || '));
  check(`${label}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
// the home card no longer claims 100 rules
{
  const p = await b.newPage({ locale: 'fr-FR' });
  await p.goto(BASE + '/'); await p.waitForTimeout(500);
  const card = await p.evaluate(() => document.querySelector('[data-project="accesseu"] .project-desc').textContent);
  check('home card: the new description', /Sans surcouche/.test(card) && !/100 règles/.test(card), card.slice(0, 60));
  await p.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
