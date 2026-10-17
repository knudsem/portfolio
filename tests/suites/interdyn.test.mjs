// The Interdyn case study: sections, screens, blurred details, honest wording, both languages, widths
import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE, PRIVATE, skipPrivate } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
for (const [lang, locale, w, h, mobile] of [['fr', 'fr-FR', 1440, 900, false], ['en', 'en-GB', 1280, 800, false], ['fr', 'fr-FR', 390, 844, true], ['en', 'en-GB', 320, 640, true]]) {
  const label = `${lang} ${w}`;
  const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, locale });
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  await p.goto(BASE + '/projects/interdyn-dealer-portal'); await p.waitForTimeout(600);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h / 2) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(60); }
  await p.evaluate(() => Promise.race([Promise.all([...document.images].filter((i) => i.getClientRects().length).map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))), new Promise((r) => setTimeout(r, 6000))]));
  const info = await p.evaluate(() => ({
    h2: [...document.querySelectorAll('main h2')].map((e) => e.textContent),
    hero: document.querySelector('.case-hero img')?.naturalWidth > 0,
    shots: [...document.querySelectorAll('.case-shots img')].map((i) => i.naturalWidth > 0 && i.alt.length > 20),
    halves: document.querySelectorAll('.case-shot:not(.is-wide)').length,
    story: document.querySelectorAll('.case-story p').length, did: document.querySelectorAll('.case-did li').length, details: document.querySelectorAll('.case-highlights li').length,
    text: document.body.innerText,
    alts: [...document.images].map((i) => i.alt).join(' '),
    over: document.documentElement.scrollWidth > innerWidth,
  }));
  const expectH2 = lang === 'fr' ? ['Le projet', "Ce que j'ai fait", 'En bref', 'En images', 'Les détails qui comptent', 'Un projet similaire ?'] : ['The project', 'What I did', 'Details', 'Screens', 'Details that matter', 'Have a similar project?'];
  check(`${label}: sections in order`, JSON.stringify(info.h2).replace(/\u00a0/g, ' ') === JSON.stringify(expectH2), info.h2.join(' | '));
  check(`${label}: the catalogue leads, cart and checkout side by side`, info.hero && info.shots.length === 2 && info.shots.every(Boolean) && info.halves === 2, JSON.stringify({ hero: info.hero, shots: info.shots, halves: info.halves }));
  check(`${label}: story 2, did 6, details 4`, info.story === 2 && info.did === 6 && info.details === 4);
  check(`${label}: says what is blurred`, /(blurred|floutés)/.test(info.text));
  if (PRIVATE) check(`${label}: no dealer, address or account code in text or descriptions`, !PRIVATE.test(info.text) && !PRIVATE.test(info.alts));
  else skipPrivate(`${label}: no dealer, address or account code in text or descriptions`);
  check(`${label}: no sideways scrolling`, !info.over);
  await p.addScriptTag({ content: AXE });
  const ax = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`));
  check(`${label}: axe finds nothing`, ax.length === 0, ax.join(' || '));
  check(`${label}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await p.close();
}
// the published images carry no readable dealer details: the blurred regions differ from the originals
{
  const p = await b.newPage();
  await p.goto(BASE + '/projects/interdyn-dealer-portal');
  const diff = await p.evaluate(async () => {
    const load = async (src) => { const i = new Image(); i.src = src; await i.decode(); const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x; };
    const cat = await load('/media/interdyn/catalogue.webp');
    // the dealer name in the banner sits at about x 160 to 290, y 15 to 30 at this size: it must be smooth (no sharp text edges)
    const d = cat.getImageData(160, 14, 130, 16).data;
    let edges = 0;
    for (let k = 4; k < d.length; k += 4) if (Math.abs(d[k] - d[k - 4]) > 40) edges++;
    return edges;
  }).catch((e) => String(e));
  check('the dealer name in the published catalogue screen is blurred (no sharp edges)', typeof diff === 'number' && diff < 5, String(diff));
  await p.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
