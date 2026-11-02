import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE, PRIVATE, skipPrivate } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
for (const [lang, locale, tz, w, h, mobile] of [['fr', 'fr-FR', 'Europe/Paris', 1440, 900, false], ['en', 'en-GB', 'Europe/London', 1440, 900, false], ['fr', 'fr-FR', 'Europe/Paris', 390, 844, true]]) {
  const label = `${lang} ${mobile ? 'phone' : 'desktop'}`;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, locale, timezoneId: tz, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/preloaded using link preload/.test(m.text())) errors.push(m.text()); });
  const failedImgs = []; p.on('requestfailed', (r) => failedImgs.push(r.url()));
  await p.goto(BASE + '/projects/trimension-studio'); await p.waitForTimeout(600);
  const before = await p.evaluate(() => [...document.querySelectorAll('.case-code pre')].map((e) => ({ spans: e.querySelectorAll('span').length, text: e.textContent })));
  // load every lazy image
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h / 2) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(80); }
  await p.evaluate(() => Promise.race([Promise.all([...document.images].filter((i) => i.getClientRects().length).map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))), new Promise((r) => setTimeout(r, 8000))]));
  const info = await p.evaluate(() => ({
    h2: [...document.querySelectorAll('main h2')].map((e) => e.textContent),
    imgs: [...document.querySelectorAll('[aria-labelledby="case-gallery"] .case-shots img')].map((i) => ({ ok: i.naturalWidth > 0, alt: i.alt, lazy: i.loading, w: i.getAttribute('width'), h: i.getAttribute('height') })),
    brand: {
      logo: [...document.querySelectorAll('[aria-labelledby="case-brand"] img')].map((i) => ({ ok: i.naturalWidth > 0, alt: i.alt, lazy: i.loading })),
      videos: [...document.querySelectorAll('[aria-labelledby="case-brand"] video')].map((v) => ({ label: v.getAttribute('aria-label'), poster: v.getAttribute('poster'), preload: v.getAttribute('preload'), muted: v.muted, inline: v.playsInline })),
      captions: [...document.querySelectorAll('[aria-labelledby="case-brand"] figcaption')].map((f) => f.textContent),
      buttons: document.querySelectorAll('[aria-labelledby="case-brand"] .case-play').length,
    },
    hero: [...document.querySelectorAll('.case-hero img')].map((i) => ({ ok: i.naturalWidth > 0, alt: i.alt, priority: i.getAttribute('fetchpriority') })),
    codes: [...document.querySelectorAll('.case-code')].map((f) => ({ file: f.querySelector('.case-code-file').textContent, spans: f.querySelectorAll('pre span').length, text: f.querySelector('pre').textContent })),
    highlights: document.querySelectorAll('.case-highlights:not(.case-changes) li').length,
    story: document.querySelectorAll('.case-story p').length,
    text: document.body.innerText,
    over: document.documentElement.scrollWidth > innerWidth,
    preOver: [...document.querySelectorAll('pre')].some((e) => e.scrollWidth > e.clientWidth + 1),
  }));
  const expectH2 = lang === 'fr' ? ['Le projet', "Ce que j'ai fait", 'En bref', 'En images', 'Logos et vidéos', 'Les détails qui comptent', 'Les animations, revisitées', 'Dans le code', 'Un projet similaire ?'] : ['The project', 'What I did', 'Details', 'Screens', 'Logos and videos', 'Details that matter', 'The animations, revisited', 'In the code', 'Have a similar project?'];
  check(`${label}: sections in order`, JSON.stringify(info.h2).replace(/\u00a0/g, ' ') === JSON.stringify(expectH2), info.h2.join(' | '));
  check(`${label}: the studio logo loads, described; 3 light videos with a still, a label and a button; captions name the tools`, info.brand.logo.length === 1 && info.brand.logo[0].ok && info.brand.logo[0].alt.length > 20 && info.brand.logo[0].lazy === 'lazy' && info.brand.videos.length === 3 && info.brand.videos.every((v) => v.label.length > 20 && /\.webp$/.test(v.poster) && v.preload === 'none' && v.muted && v.inline) && info.brand.buttons === 3 && info.brand.captions.length === 4 && /Illustrator[\s\S]*After Effects[\s\S]*Blender[\s\S]*Blender/.test(info.brand.captions.join(' ')), JSON.stringify(info.brand));
  check(`${label}: 7 screens load (one leading the page, at high priority), each described, the others lazy and sized`, info.hero.length === 1 && info.hero[0].ok && info.hero[0].alt.length > 8 && info.hero[0].priority === 'high' && info.imgs.length === 6 && info.imgs.every((i) => i.ok && i.alt.length > 8 && i.lazy === 'lazy' && i.w && i.h) && failedImgs.length === 0, `${info.imgs.filter((i) => i.ok).length} ok ${failedImgs.join(',')}`);
  check(`${label}: story, 4 highlights, 3 coloured code excerpts`, info.story === 2 && info.highlights === 4 && info.codes.length === 3 && info.codes.every((c) => c.spans > 20), JSON.stringify(info.codes.map((c) => [c.file, c.spans])));
  check(`${label}: code is plain text off screen, coloured near it, the same text`, before.length === 3 && before.every((c) => c.spans === 0) && info.codes.every((c, i) => c.text === before[i].text), before.map((c) => c.spans).join(','));
  if (PRIVATE) check(`${label}: nothing about the location or the team`, !PRIVATE.test(info.text), (info.text.match(new RegExp('.{0,30}(' + PRIVATE.source + ').{0,30}', 'i')) || [''])[0]);
  else skipPrivate(`${label}: nothing about the location or the team`);
  check(`${label}: no sideways scrolling, code wraps`, !info.over && !info.preOver);
  if (!mobile) {
    await p.locator('.case-code-copy').first().click(); await p.waitForTimeout(200);
    const clip = await p.evaluate(() => navigator.clipboard.readText());
    const btn = await p.locator('.case-code-copy').first().textContent();
    check(`${label}: copy button copies the excerpt exactly`, clip === info.codes[0].text && /Copié|Copied/.test(btn), `${clip.length} chars, button "${btn}"`);
  }
  await p.addScriptTag({ content: AXE });
  const ax = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`));
  check(`${label}: axe finds nothing`, ax.length === 0, ax.join(' || '));
  check(`${label}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
// Logos and videos: nothing loads with the page; in view the videos play
// (the WebM files only), the logo once; the pause button holds through
// scrolling; off screen they pause; with reduced motion nothing starts
for (const reduce of [false, true]) {
  const label = reduce ? 'videos, reduced motion' : 'videos';
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  const loads = []; p.on('request', (r) => { const file = new URL(r.url()).pathname; if (/\.(webm|mp4)$/.test(file)) loads.push(file.split('/').pop()); });
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/preloaded using link preload/.test(m.text())) errors.push(m.text()); });
  await p.goto(BASE + '/projects/trimension-studio'); await p.waitForTimeout(800);
  check(`${label}: no video loads with the page`, loads.length === 0, loads.join(','));
  const state = () => p.evaluate(() => [...document.querySelectorAll('[aria-labelledby="case-brand"] video')].map((v) => ({ paused: v.paused, ended: v.ended, t: Math.round(v.currentTime * 10) / 10, src: v.currentSrc.split('/').pop(), button: v.parentElement.querySelector('.case-play').textContent })));
  const toSection = () => p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('[aria-labelledby="case-brand"] .case-shots').scrollIntoView({ block: 'center' }); });
  const toTop = () => p.evaluate(() => window.scrollTo(0, 0));
  await toSection(); await p.waitForTimeout(1500);
  let s = await state();
  if (reduce) {
    check(`${label}: in view, nothing loads or plays, each button offers to play`, loads.length === 0 && s.every((v) => v.paused && v.t === 0 && v.button === "Lancer l'animation"), JSON.stringify(s));
    await p.locator('[aria-labelledby="case-brand"] .case-play').nth(2).click(); await p.waitForTimeout(1200);
    s = await state();
    check(`${label}: the button plays a video`, !s[2].paused && s[2].t > 0.3 && s[2].button === "Mettre l'animation en pause" && s[0].paused && s[1].paused, JSON.stringify(s));
  } else {
    check(`${label}: in view, the three play, from the WebM files only`, s.every((v) => !v.paused && v.t > 0.3 && v.src.endsWith('.webm') && v.button === "Mettre l'animation en pause") && loads.length >= 3 && loads.every((f) => f.endsWith('.webm')), `${JSON.stringify(s)} ${loads.join(',')}`);
    await p.locator('[aria-labelledby="case-brand"] .case-play').nth(1).click(); await p.waitForTimeout(300);
    const held = (await state())[1];
    // the logo runs to its end and stays there
    await p.evaluate(() => { const v = document.querySelector('[aria-labelledby="case-brand"] video'); v.currentTime = v.duration - 0.3; });
    await p.waitForTimeout(1200);
    s = await state();
    check(`${label}: the pause button pauses; the logo plays once and offers to play again`, held.paused && held.button === "Lancer l'animation" && s[0].ended && s[0].paused && s[0].button === "Rejouer l'animation", JSON.stringify(s));
    await toTop(); await p.waitForTimeout(600);
    s = await state();
    check(`${label}: off screen, they all pause`, s.every((v) => v.paused), JSON.stringify(s));
    const t2 = s[2].t;
    await toSection(); await p.waitForTimeout(1200);
    s = await state();
    check(`${label}: back in view, the loop goes on; the paused video and the finished logo stay as they were`, !s[2].paused && s[2].t > t2 && s[1].paused && s[1].t === held.t && s[0].ended, JSON.stringify(s));
    await p.locator('[aria-labelledby="case-brand"] .case-play').nth(0).click(); await p.waitForTimeout(800);
    s = await state();
    check(`${label}: the logo plays again from the start`, !s[0].paused && s[0].t > 0.3 && s[0].t < 2, JSON.stringify(s));
  }
  check(`${label}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
// the files stay light: a visitor gets either the WebM or the MP4 set
{
  const sizes = {};
  for (const name of ['eons-logo', 'eons-video', 'godsent-video']) for (const ext of ['webm', 'mp4', 'webp']) {
    const res = await fetch(`${BASE}/media/trimension/${name}.${ext}`);
    sizes[`${name}.${ext}`] = res.ok ? (await res.arrayBuffer()).byteLength : 0;
  }
  const total = (ext) => Object.entries(sizes).filter(([f]) => f.endsWith(ext)).reduce((n, [, v]) => n + v, 0);
  check('videos: every file exists and is light (each under 700 KB, the WebM set under 800 KB, the MP4 set under 1 MB)', Object.values(sizes).every((n) => n > 1000 && n < 700e3) && total('.webm') < 800e3 && total('.mp4') < 1e6, JSON.stringify(sizes));
}
// the other project pages keep their simple layout
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/projects/pro-ject-audio-australia'); await p.waitForTimeout(400);
  const n = await p.evaluate(() => ({ shots: document.querySelectorAll('.case-shots').length, code: document.querySelectorAll('.case-code').length, story: document.querySelectorAll('.case-story').length, paragraphs: document.querySelectorAll('.case-story p').length }));
  check('other projects: their story is filled, their screens shown, no code section', n.shots === 1 && n.code === 0 && n.story === 1 && n.paragraphs === 2, JSON.stringify(n));
  await ctx.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
