// The lab: every demo renders and runs, filters, code panel, pause, rest off
// screen, reduced motion, accessibility, no sideways scrolling, both languages
import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, ROOT, AXE } from '../lib.mjs';
import { DEMOS } from '../../src/lab/demos.js';
const URL_ = BASE + '/lab';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const card = (p, id) => p.locator('.lab-card', { has: p.locator(`.lab-stage [class*="lb-"]`) }).filter({ has: p.locator(`[data-demo="${id}"]`) });

// desktop, French
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  await p.goto(URL_); await p.waitForTimeout(800);
  const head = await p.evaluate(() => ({ title: document.title, h1: document.querySelector('h1')?.textContent, cards: document.querySelectorAll('.lab-card').length, current: document.querySelector('.header-link[aria-current="page"]')?.textContent, canonical: document.querySelector('link[rel=canonical]')?.href }));
  const LAB_COUNT = +fs.readFileSync(`${ROOT}/src/lab/count.js`, 'utf8').match(/LAB_COUNT = (\d+)/)[1];
  check('LAB_COUNT (shown on the home page) equals the number of demos', LAB_COUNT === head.cards, `${LAB_COUNT} vs ${head.cards}`);
  check(`page: title, heading, ${DEMOS.length} live demos, Lab marked current in the header`, head.title === 'Lab | Mathias Knudsen' && head.h1 === 'Le lab' && head.cards === DEMOS.length && head.current === 'Lab' && head.canonical === 'https://mathias-knudsen.vercel.app/lab', JSON.stringify(head));

  // every stage holds its demo (an element with an lb- class that has a size)
  const empty = await p.evaluate(() => [...document.querySelectorAll('.lab-stage')].map((s, i) => { const el = s.querySelector('[class^="lb-"], [class*=" lb-"]'); const r = el?.getBoundingClientRect(); return !el || !r.width || !r.height ? i : null; }).filter((x) => x !== null));
  check('every demo is drawn on its stage', empty.length === 0, empty.join(','));

  // no card towers over the rest: a row is as tall as its tallest card, so
  // a long text would make the whole row giant
  const heights = await p.evaluate(() => [...document.querySelectorAll('.lab-card')].map((c) => [c.dataset.demo, Math.round(c.getBoundingClientRect().height)]));
  const median = heights.map(([, h]) => h).sort((x, y) => x - y)[heights.length >> 1];
  const towering = heights.filter(([, h]) => h > median * 1.25);
  check('no card is much taller than the others (each at most a quarter above the usual height)', towering.length === 0, `usual ${median}px; ${towering.map(([id, h]) => `${id} ${h}px`).join(', ')}`);

  // interactions
  const stage = (title) => p.locator('.lab-card').filter({ has: p.locator('.lab-card-title', { hasText: new RegExp(`^${title}$`) }) }).locator('.lab-stage');
  await p.locator('.lb-like').click(); await p.waitForTimeout(100);
  const like = await p.locator('.lb-like').getAttribute('aria-pressed');
  await p.locator('.lb-dn').scrollIntoViewIfNeeded(); await p.locator('.lb-dn').click(); await p.waitForTimeout(100);
  const dn = await p.locator('.lb-dn').getAttribute('aria-checked');
  await p.locator('.lb-flip').scrollIntoViewIfNeeded(); await p.locator('.lb-flip').click(); await p.waitForTimeout(100);
  const flip = await p.locator('.lb-flip').getAttribute('aria-pressed');
  await p.locator('.lb-check').scrollIntoViewIfNeeded(); await p.locator('.lb-check').click(); await p.waitForTimeout(100);
  const checked = await p.locator('.lb-check input').isChecked();
  check('toggles change their real state (like, switch, flip, checkbox)', like === 'true' && dn === 'true' && flip === 'true' && checked, `${like} ${dn} ${flip} ${checked}`);

  await p.locator('.lb-send').scrollIntoViewIfNeeded(); await p.locator('.lb-send').click(); await p.waitForTimeout(150);
  const sending = await p.locator('.lb-send').getAttribute('data-state');
  await p.waitForTimeout(900);
  const sent = await p.evaluate(() => ({ state: document.querySelector('.lb-send').dataset.state, status: document.querySelector('.lb-send-status').textContent }));
  check('send: sending, then sent, and screen readers are told', sending === 'sending' && sent.state === 'sent' && sent.status === 'Message sent', JSON.stringify({ sending, ...sent }));
  await p.waitForTimeout(600);
  const tick = await p.evaluate(() => { const t = getComputedStyle(document.querySelector('.lb-send-tick')); return { opacity: +t.opacity, offset: parseFloat(t.strokeDashoffset) }; });
  check('send: once sent, a tick is drawn where the plane was', tick.opacity === 1 && tick.offset === 0, JSON.stringify(tick));

  // the line drawing: its wave, stroke included, stays inside its frame
  const wave = await p.evaluate(() => {
    const svg = document.querySelector('.lb-draw'), path = svg.querySelector('path'), b = path.getBBox(), v = svg.viewBox.baseVal, w = parseFloat(getComputedStyle(path).strokeWidth) / 2;
    return { top: b.y - w - v.y, bottom: v.y + v.height - (b.y + b.height + w), left: b.x - w - v.x, right: v.x + v.width - (b.x + b.width + w) };
  });
  check('line drawing: the whole wave fits in its frame, nothing cut off', Object.values(wave).every((m) => m >= 0), JSON.stringify(wave));

  // the infinity sign: the dash rides it like a roller coaster, slow over the
  // tops and fast through the dips
  const ride = await p.evaluate(() => {
    const run = document.querySelector('.lb-inf-run'), a = run.getAnimations()[0], L = run.getTotalLength(), steps = [];
    const at = (t) => { a.pause(); a.currentTime = t; const off = -parseFloat(getComputedStyle(run).strokeDashoffset); return { off, y: run.getPointAtLength((((off + 11) % 100) / 100) * L).y }; };
    for (let t = 0; t < 2400; t += 50) { const p0 = at(t), p1 = at(t + 50); steps.push({ speed: (((p1.off - p0.off) % 100) + 100) % 100, y: p0.y }); }
    a.play();
    const high = steps.filter((s) => s.y < 22), low = steps.filter((s) => s.y > 38), mean = (l) => l.reduce((n, s) => n + s.speed, 0) / l.length;
    return { tops: +mean(high).toFixed(2), dips: +mean(low).toFixed(2) };
  });
  check('infinity: like a roller coaster, the dash is at least twice as fast through the dips as over the tops', ride.dips > ride.tops * 2, JSON.stringify(ride));

  // the parallax: scrolled to its end, dusk has turned to night, the pines
  // have dropped out of view, the moon is up and the cue to scroll is gone
  const plx = p.locator('.lb-plx'); await plx.scrollIntoViewIfNeeded();
  const scene = async (f) => {
    await plx.evaluate((el, f) => { el.scrollTop = f * (el.scrollHeight - el.clientHeight); }, f); await p.waitForTimeout(250);
    return plx.evaluate((el) => { const cs = (c) => getComputedStyle(el.querySelector(c)); return { night: +(+cs('.lb-plx-night').opacity).toFixed(2), hint: +(+cs('.lb-plx-hint').opacity).toFixed(2), trees: Math.round(parseFloat(cs('.lb-plx-trees').translate.split(' ')[1] || 0)), moon: Math.round(parseFloat(cs('.lb-plx-moon').translate.split(' ')[1] || 0)) }; });
  };
  const dusk = await scene(0), night = await scene(1); await scene(0);
  check('parallax: scrolled through, dusk turns to night, the pines drop away, the moon rises and the cue goes', dusk.night === 0 && dusk.hint > 0.5 && dusk.trees === 0 && dusk.moon > 100 && night.night === 1 && night.hint === 0 && night.trees > 100 && night.moon < 10, JSON.stringify({ dusk, night }));

  await p.locator('.lb-dl').scrollIntoViewIfNeeded(); await p.locator('.lb-dl').click(); await p.waitForTimeout(150);
  const loading = await p.evaluate(() => ({ state: document.querySelector('.lb-dl').dataset.state, text: document.querySelector('.lb-dl-text').textContent }));
  await p.waitForTimeout(2000);
  const done = await p.evaluate(() => ({ state: document.querySelector('.lb-dl').dataset.state, text: document.querySelector('.lb-dl-text').textContent }));
  check('download: loading, then done with its tick', loading.state === 'loading' && loading.text === 'Downloading' && done.state === 'done' && done.text === 'Done', JSON.stringify({ loading, done }));

  await p.locator('.lb-float input').scrollIntoViewIfNeeded(); await p.locator('.lb-float input').fill('hello@example.com'); await p.locator('.lb-float input').blur(); await p.waitForTimeout(400);
  const floated = await p.evaluate(() => getComputedStyle(document.querySelector('.lb-float span')).translate);
  check('floating label stays up once the field is filled', floated !== 'none' && floated.includes('-18px'), floated);

  // the fill grows from where the pointer comes in
  const fillBox = await p.locator('.lb-fill').boundingBox();
  await p.locator('.lb-fill').scrollIntoViewIfNeeded();
  const fb = await p.locator('.lb-fill').boundingBox();
  // in from the top, at a quarter of the width (the rounded corners are not part of the button)
  await p.mouse.move(fb.x + fb.width / 4, fb.y - 20); await p.mouse.move(fb.x + fb.width / 4, fb.y + 3, { steps: 6 }); await p.waitForTimeout(100);
  const fillXY = await p.evaluate(() => { const s = document.querySelector('.lb-fill').style; return [s.getPropertyValue('--x'), s.getPropertyValue('--y')]; });
  check('fill: starts where the pointer comes in', fillBox && Math.abs(parseFloat(fillXY[0]) - fb.width / 4) < 4 && parseFloat(fillXY[1]) < 8, fillXY.join(' '));

  // scramble settles into the real words, which screen readers get at once
  await p.locator('.lb-scramble').scrollIntoViewIfNeeded(); await p.waitForTimeout(1600);
  const scr = await p.evaluate(() => ({ sr: document.querySelector('.lb-scramble-sr').textContent, shown: document.querySelector('.lb-scramble [aria-hidden]').textContent }));
  check('scramble: settles into the words, hidden copy for screen readers', scr.sr === 'Decoding the future' && scr.shown === 'Decoding the future', JSON.stringify(scr));

  // reading progress: scroll the box, the bar follows
  await p.locator('.lb-read').scrollIntoViewIfNeeded();
  await p.evaluate(() => { const r = document.querySelector('.lb-read'); r.scrollTop = (r.scrollHeight - r.clientHeight) / 2; }); await p.waitForTimeout(300);
  const bar = await p.evaluate(() => getComputedStyle(document.querySelector('.lb-read-bar')).scale);
  check('reading progress follows the box scroll', /^0\.[3-7]/.test(bar.split(' ')[0]), bar);

  // replay mounts a fresh stage: the animation starts again
  const rise = p.locator('.lab-card').filter({ has: p.locator('.lb-rise') });
  await rise.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  const t1 = await p.evaluate(() => document.querySelector('.lb-rise-word span').getAnimations()[0]?.currentTime);
  await rise.getByRole('button', { name: /Rejouer/ }).click(); await p.waitForTimeout(80);
  const t2 = await p.evaluate(() => document.querySelector('.lb-rise-word span').getAnimations()[0]?.currentTime);
  check('replay restarts the animation', t1 === null || t1 === undefined || t1 > 700 ? (t2 ?? 0) < 400 : false, `${t1} -> ${t2}`);

  // filters
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.getByRole('button', { name: /^Boutons/ }).click(); await p.waitForTimeout(200);
  const f = await p.evaluate(() => ({ cards: document.querySelectorAll('.lab-card').length, status: document.querySelector('.lab .sr-only[role=status]').textContent, pressed: document.querySelector('.lab-chip[aria-pressed="true"]').textContent }));
  check('filter: buttons only, said to screen readers', f.cards === 15 && f.status === '15 animations affichées' && /^Boutons/.test(f.pressed), JSON.stringify(f));
  await p.getByRole('button', { name: /^Toutes/ }).click(); await p.waitForTimeout(200);

  // code panel: opens, holds HTML, the demo's own CSS and its JS, copies, closes with Escape back to the button
  const codeBtn = p.getByRole('button', { name: "Code : J'aime" });
  await codeBtn.scrollIntoViewIfNeeded(); await codeBtn.click(); await p.waitForTimeout(600);
  const dlg = await p.evaluate(() => { const d = document.querySelector('dialog.lab-dialog'); return { open: d?.open, title: d?.querySelector('h2').textContent, files: [...d.querySelectorAll('.case-code-file')].map((e) => e.textContent), css: d.querySelectorAll('.case-code pre')[1]?.textContent || '', js: d.querySelectorAll('.case-code pre')[2]?.textContent || '' }; });
  check('code panel: HTML, its own CSS and JS, from the real files', dlg.open && dlg.title === "Code\u00a0: J'aime" && dlg.files.join() === 'index.html,style.css,script.js' && dlg.css.startsWith('.lb-like {') && dlg.css.includes('@keyframes lb-like-spark') && !dlg.css.includes('lb-shine') && dlg.js.includes('export function likeButton') && !dlg.js.includes('demo:'), JSON.stringify({ ...dlg, css: dlg.css.slice(0, 30), js: dlg.js.slice(0, 40) }));
  await p.locator('dialog .case-code-copy').nth(1).click(); await p.waitForTimeout(200);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  check('code panel: copy gives the CSS exactly', clip === dlg.css, `${clip.length} vs ${dlg.css.length}`);
  await p.addScriptTag({ content: AXE });
  const axDlg = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`));
  check('axe finds nothing with the code panel open', axDlg.length === 0, axDlg.join(' || '));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const after = await p.evaluate(() => ({ open: !!document.querySelector('dialog.lab-dialog'), focus: document.activeElement?.getAttribute('aria-label') }));
  check('code panel: Escape closes it, focus back on its button', !after.open && after.focus === "Code\u00a0: J'aime", JSON.stringify(after));
  // a demo without script shows no JS block
  await p.getByRole('button', { name: 'Code : Reflet' }).click(); await p.waitForTimeout(500);
  const noJs = await p.evaluate(() => [...document.querySelectorAll('dialog .case-code-file')].map((e) => e.textContent).join());
  check('code panel: CSS-only demos show no JavaScript', noJs === 'index.html,style.css', noJs);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);

  check('page has no errors or warnings', errors.length === 0, errors.join(' | '));

  // pause all, and rest off screen
  await p.locator('.lb-shine').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await p.getByRole('button', { name: 'Tout mettre en pause' }).click(); await p.waitForTimeout(200);
  const paused = await p.evaluate(() => ({ pressed: document.querySelector('.lab-pause').getAttribute('aria-pressed'), shine: getComputedStyle(document.querySelector('.lb-shine'), '::after').animationPlayState }));
  await p.getByRole('button', { name: 'Tout mettre en pause' }).click(); await p.waitForTimeout(200);
  const resumed = await p.evaluate(() => getComputedStyle(document.querySelector('.lb-shine'), '::after').animationPlayState);
  const off = await p.evaluate(() => { const c = [...document.querySelectorAll('.lab-card')].at(-1); return { inview: c.hasAttribute('data-inview'), state: getComputedStyle(document.querySelector('.lb-morph')).animationPlayState }; });
  check('pause button pauses every demo and resumes them', paused.pressed === 'true' && paused.shine === 'paused' && resumed === 'running', JSON.stringify({ paused, resumed }));
  check('demos rest while off screen', !off.inview && off.state === 'paused', JSON.stringify(off));

  const ax = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`));
  check('axe finds nothing on the page', ax.length === 0, ax.join(' || '));
  await ctx.close();
}

// widths: no sideways scrolling, demos inside their stage
for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1920, 1080]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800, locale: 'en-GB' });
  await p.goto(URL_); await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const over = document.documentElement.scrollWidth > innerWidth;
    const spill = [...document.querySelectorAll('.lab-stage')].map((s, i) => { const sr = s.getBoundingClientRect(); const el = s.firstElementChild; const r = el.getBoundingClientRect(); return r.left < sr.left - 1 || r.right > sr.right + 1 ? `${i}:${Math.round(r.width)}>${Math.round(sr.width)}` : null; }).filter(Boolean);
    return { over, spill, h1: document.querySelector('h1').textContent };
  });
  check(`${w}px: no sideways scrolling, every demo fits its stage (English)`, !r.over && r.spill.length === 0 && r.h1 === 'The lab', JSON.stringify(r));
  await p.close();
}

// reduced motion: the note, no pause button, calm versions
{
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce', locale: 'fr-FR' });
  await p.goto(URL_); await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    note: !!document.querySelector('.lab-calm'),
    pause: !!document.querySelector('.lab-pause'),
    shine: getComputedStyle(document.querySelector('.lb-shine'), '::after').animationName,
    morph: getComputedStyle(document.querySelector('.lb-morph')).animationName,
    type: getComputedStyle(document.querySelector('.lb-type')).animationName,
  }));
  check('reduced motion: told, no pause button needed, calm versions', r.note && !r.pause && r.shine === 'none' && r.morph === 'none' && r.type === 'none', JSON.stringify(r));
  await p.close();
}

// the lab is in the home page's header and the phone menu, and its page is prerendered
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'fr-FR' });
  await p.goto(BASE + '/'); await p.waitForTimeout(500);
  await p.locator('.menu-btn').click(); await p.waitForTimeout(300);
  const items = await p.evaluate(() => [...document.querySelectorAll('.mobile-menu-link')].map((a) => `${a.textContent}=${a.getAttribute('href')}`));
  check('phone menu: Lab and Blog before Contact', items.join(' | ') === 'À propos=#about | Projets=#work | Services=#services | La preuve=#proof | Lab=/lab | Blog=/blog | Contact=#contact', items.join(' | '));
  const html = await (await fetch(BASE + '/lab')).text();
  check('prerendered page: own title, description and address', html.includes('<title>Lab | Mathias Knudsen</title>') && html.includes('A library of interface animations') && html.includes('<link rel="canonical" href="https://mathias-knudsen.vercel.app/lab" />'));
  const sitemap = await (await fetch(BASE + '/sitemap.xml')).text();
  check('sitemap lists the lab', sitemap.includes('<loc>https://mathias-knudsen.vercel.app/lab</loc>'));
  await p.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
