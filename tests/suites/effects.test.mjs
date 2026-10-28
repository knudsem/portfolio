import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
// screenshots for a look by eye, only when SHOTS_DIR names a folder
const OUT = process.env.SHOTS_DIR;
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };

for (const [lang, locale, tz] of [['en', 'en-GB', 'Europe/London'], ['fr', 'fr-FR', 'Europe/Paris']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale, timezoneId: tz });
  const p = await ctx.newPage();
  const logs = []; p.on('console', (m) => logs.push({ type: m.type(), text: m.text() }));
  await p.goto(BASE + '/'); await p.waitForTimeout(2600);
  const notes = logs.filter((l) => l.type === 'log' && /MK/.test(l.text));
  check(`${lang}: one console note, in the page language`, notes.length === 1 && (lang === 'fr' ? /Bienvenue dans les coulisses/.test(notes[0].text) : /Welcome backstage/.test(notes[0].text)) && !/Ctrl K|⌘|command menu|menu de commandes/.test(notes[0].text), notes[0]?.text.slice(0, 60));
  check(`${lang}: no errors or warnings`, !logs.some((l) => l.type === 'error' || l.type === 'warning'), logs.filter((l) => l.type === 'error' || l.type === 'warning').map((l) => l.text).join(' | '));
  if (lang === 'fr') { await ctx.close(); continue; }

  check('mouse: effects switched on', await p.evaluate(() => document.documentElement.classList.contains('fx-pointer')));

  // Magnetic primary button
  const btn = await p.locator('.hero-actions .btn-primary').boundingBox();
  await p.mouse.move(btn.x + btn.width - 4, btn.y + btn.height - 4, { steps: 4 });
  await p.waitForTimeout(450);
  const pull = await p.evaluate(() => document.querySelector('.hero-actions .btn-primary').style.translate);
  const [tx, ty] = pull.split(' ').map(parseFloat);
  check('magnetic: button leans towards the pointer, within 8 px', tx > 0 && ty > 0 && tx <= 8 && ty <= 8, pull);
  if (OUT) await p.screenshot({ path: `${OUT}/magnet.png`, clip: { x: btn.x - 40, y: btn.y - 40, width: 520, height: btn.height + 80 } });
  // Stays stable (no feedback drift) when the pointer stays put
  await p.mouse.move(btn.x + btn.width - 4, btn.y + btn.height - 3); await p.waitForTimeout(200);
  await p.mouse.move(btn.x + btn.width - 4, btn.y + btn.height - 4); await p.waitForTimeout(200);
  const pull2 = await p.evaluate(() => document.querySelector('.hero-actions .btn-primary').style.translate);
  check('magnetic: same pointer, same pull (no drift)', pull2 === pull, `${pull} vs ${pull2}`);
  await p.mouse.move(btn.x + btn.width / 2, btn.y + 160, { steps: 4 }); await p.waitForTimeout(450);
  check('magnetic: released when the pointer goes away', (await p.evaluate(() => document.querySelector('.hero-actions .btn-primary').style.translate)) === '');

  // Dot grid follows the cursor
  const glow = await p.evaluate(() => { const g = document.querySelector('.glow-layer'); return { op: getComputedStyle(g).opacity, x: g.style.getPropertyValue('--glow-x'), mask: getComputedStyle(g, '::after').maskImage || getComputedStyle(g, '::after').webkitMaskImage }; });
  check('dot grid: shown around the cursor', glow.op === '1' && glow.x && /radial-gradient/.test(glow.mask), `${glow.op} ${glow.x}`);
  if (OUT) await p.screenshot({ path: `${OUT}/dots.png`, clip: { x: btn.x - 200, y: btn.y - 60, width: 600, height: 380 } });

  // Border light on a service card
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById('services').scrollIntoView(); });
  await p.waitForTimeout(1200);
  const card = await p.locator('.service-card').nth(1).boundingBox();
  await p.mouse.move(card.x + 60, card.y + 20, { steps: 5 }); await p.waitForTimeout(500);
  const light = await p.evaluate(() => { const c = document.querySelectorAll('.service-card')[1]; return { mx: c.style.getPropertyValue('--mx'), my: c.style.getPropertyValue('--my'), op: getComputedStyle(c, '::before').opacity, bg: getComputedStyle(c).backgroundImage }; });
  check('cards: border light follows the pointer', light.mx === '60.0px' && light.my === '20.0px' && light.op === '1' && /radial/.test(light.bg), JSON.stringify(light));
  if (OUT) await p.screenshot({ path: `${OUT}/card-light.png`, clip: { x: card.x - 30, y: card.y - 30, width: card.width * 2 + 80, height: card.height + 60 } });
  // Project card with cover
  await p.evaluate(() => document.getElementById('work').scrollIntoView()); await p.waitForTimeout(1000);
  const pc = await p.locator('.project-card').nth(2).boundingBox();
  await p.mouse.move(pc.x + pc.width - 40, pc.y + 300, { steps: 5 }); await p.waitForTimeout(900);
  if (OUT) await p.screenshot({ path: `${OUT}/project-light.png`, clip: { x: pc.x - 30, y: Math.max(0, pc.y - 30), width: pc.width + 60, height: Math.min(860, pc.height + 60) } });

  // Reading progress
  const prog = async () => p.evaluate(() => { const m = getComputedStyle(document.querySelector('.scroll-progress')).transform; return m === 'none' ? 0 : parseFloat(m.split('(')[1]); });
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const p0 = await prog();
  await p.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2)); await p.waitForTimeout(300);
  const p50 = await prog();
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(300);
  const p100 = await prog();
  check('reading progress: 0 at the top, half way, full at the bottom', p0 < 0.01 && Math.abs(p50 - 0.5) < 0.02 && p100 > 0.99, `${p0} ${p50} ${p100}`);
  await ctx.close();
}

for (const [label, opts] of [['reduced motion', { reducedMotion: 'reduce' }], ['touch screen', { hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } }]]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const p = await ctx.newPage();
  await p.goto(BASE + '/'); await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({ fx: document.documentElement.classList.contains('fx-pointer'), bar: getComputedStyle(document.querySelector('.scroll-progress')).display }));
  check(`${label}: pointer effects off`, !r.fx, JSON.stringify(r));
  if (label === 'reduced motion') check('reduced motion: no progress animation', r.bar === 'none');
  await ctx.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
