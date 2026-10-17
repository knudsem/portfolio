// The seven demos rebuilt from the CodePen archive: what they do, from the
// mouse, the keyboard and a finger, calm for reduced motion, at phone width
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const stage = (p, id) => p.locator(`.lab-card[data-demo="${id}"] .lab-stage`);
const at = async (p, id) => { await stage(p, id).scrollIntoViewIfNeeded(); await p.waitForTimeout(300); return stage(p, id); };
const IDS = ['envelope', 'arch-magnifier', 'arch-cat', 'arch-water', 'arch-globe', 'arch-rings', 'arch-signal', 'arch-mask'];

{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('lang', 'en'); } catch {} });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !m.text().includes('willReadFrequently')) errors.push(m.text()); }); // that warning comes from this test reading the globe's pixels
  await p.goto(BASE + '/lab'); await p.waitForTimeout(800);
  await p.locator('.lab-filters .lab-chip', { hasText: 'From my archive' }).click(); await p.waitForTimeout(900);
  check('the archive filter shows the eight archive demos', (await p.locator('.lab-card').evaluateAll((els) => els.map((e) => e.dataset.demo).join())) === IDS.join());

  // Rings
  let s = await at(p, 'arch-rings');
  const button = s.getByRole('button', { name: 'Games' });
  check('rings: a "Games" button, rings out of reach while closed', (await button.count()) === 1 && (await s.locator('a').evaluateAll((as) => as.every((a) => getComputedStyle(a).visibility === 'hidden'))));
  await button.click(); await p.waitForTimeout(900);
  const open = await s.evaluate((el) => {
    const nav = el.querySelector('nav').getBoundingClientRect();
    const letters = [...el.querySelectorAll('a')].map((a) => {
      const r = parseFloat(a.style.getPropertyValue('--r'));
      return [...a.querySelectorAll('i')].every((i) => { const q = i.getBoundingClientRect(); const d = Math.hypot(q.left + q.width / 2 - nav.left, q.top + q.height / 2 - nav.top); return d > r - 38 && d < r; });
    });
    return { expanded: el.querySelector('button').getAttribute('aria-expanded'), visible: [...el.querySelectorAll('a')].map((a) => getComputedStyle(a).visibility).join(), letters: letters.join(), shift: el.querySelector('.lb-rings').scrollLeft + el.querySelector('.lb-rings').scrollTop };
  });
  check('rings: open, both rings reachable, every letter on its own ring, nothing shifted', open.expanded === 'true' && open.visible === 'visible,visible' && open.letters === 'true,true' && open.shift === 0, JSON.stringify(open));
  check('rings: the open button is called "Close"', (await s.getByRole('button', { name: 'Close' }).count()) === 1);
  await p.keyboard.press('Tab');
  check('rings: Tab goes from the button to the first ring', (await p.evaluate(() => document.activeElement.getAttribute('aria-label'))) === 'Eons');
  await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  check('rings: Escape closes them and the focus goes back to the button', (await s.locator('button').getAttribute('aria-expanded')) === 'false' && (await p.evaluate(() => document.activeElement.matches('.lb-rings button'))));

  // Magnifier
  s = await at(p, 'arch-magnifier');
  const svg = s.locator('.lb-loupe'); const box = await svg.boundingBox();
  await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.6); await p.mouse.move(box.x + box.width * 0.3 + 2, box.y + box.height * 0.6); await p.waitForTimeout(900);
  const lens = await svg.evaluate((el, [x, y]) => {
    const want = new DOMPoint(x, y).matrixTransform(el.getScreenCTM().inverse());
    const m = new DOMMatrix(getComputedStyle(el.querySelector('.lb-loupe-lens')).transform);
    return { follow: el.hasAttribute('data-follow'), dx: Math.abs(m.e - want.x), dy: Math.abs(m.f - want.y), zoom: new DOMMatrix(getComputedStyle(el.querySelector('.lb-loupe-zoom')).transform).a };
  }, [box.x + box.width * 0.3 + 2, box.y + box.height * 0.6]);
  check('magnifier: the lens glides to the pointer, the picture inside is 1.9 times bigger', lens.follow && lens.dx < 2 && lens.dy < 2 && Math.abs(lens.zoom - 1.9) < 0.001, JSON.stringify(lens));
  await p.mouse.move(0, 0); await p.waitForTimeout(200);
  check('magnifier: let go, it goes back to its round', !(await svg.evaluate((el) => el.hasAttribute('data-follow'))));

  // Cat
  s = await at(p, 'arch-cat');
  const cat = s.getByRole('button', { name: 'Pet the lucky cat' });
  const cbox = await cat.boundingBox();
  await p.mouse.move(cbox.x - 10, cbox.y + 20); await p.waitForTimeout(50);
  check('cat: its eyes turn to the pointer', Number(await cat.evaluate((el) => el.style.getPropertyValue('--lb-look-x'))) < -0.5);
  await cat.click(); await p.waitForTimeout(100);
  const lucky = await cat.evaluate((el) => ({ on: el.hasAttribute('data-lucky'), beat: getComputedStyle(el.querySelector('.lb-cat-arm')).animationDuration }));
  check('cat: a pet makes the paw beckon faster and lets out the luck', lucky.on && lucky.beat === '0.42s', JSON.stringify(lucky));
  await p.waitForTimeout(1700);
  await cat.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(80);
  check('cat: it can be petted from the keyboard too', await cat.evaluate((el) => el.hasAttribute('data-lucky')));

  // Water
  s = await at(p, 'arch-water'); await p.waitForTimeout(2300);
  check('water: the tube has filled up to 65%', (await s.locator('.lb-tube-level').textContent()) === '65%');
  const wbox = await s.locator('.lb-tube').boundingBox();
  await p.mouse.move(wbox.x + wbox.width / 2, wbox.y + 40); await p.mouse.move(wbox.x + wbox.width - 4, wbox.y + 40, { steps: 3 }); await p.waitForTimeout(160);
  const angle = (attr) => Number((attr || '').match(/rotate\((-?[\d.]+)/)?.[1] ?? 0);
  const tilt = angle(await s.locator('.lb-tube-glass').getAttribute('transform'));
  const slosh = angle((await s.locator('.lb-tube-water').getAttribute('transform')).split('rotate')[1] ? 'rotate' + (await s.locator('.lb-tube-water').getAttribute('transform')).split('rotate')[1] : '');
  check('water: the tube tilts towards the pointer, the water lags behind', tilt > 5 && slosh !== 0, `tilt ${tilt}, slosh ${slosh}`);
  await p.mouse.move(0, 0); await p.waitForTimeout(3000);
  const rest = await s.evaluate((el) => [el.querySelector('.lb-tube-glass').getAttribute('transform'), el.querySelector('.lb-tube-water').getAttribute('transform')]);
  check('water: let go, it stands up again and the water settles level', Math.abs(angle(rest[0])) < 0.2 && Math.abs(angle('rotate' + rest[1].split('rotate')[1])) < 0.2, rest.join(' | '));

  // Globe
  s = await at(p, 'arch-globe'); await p.waitForTimeout(1700);
  check('globe: the figures end on their values', (await s.locator('[data-to]').allTextContents()).join() === '160,35,12,98');
  const canvas = s.locator('canvas');
  const look = () => canvas.evaluate((el) => { const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data; let land = 0, sum = 0; for (let i = 0; i < d.length; i += 16) { if (d[i + 3] > 0) sum++; if (d[i + 1] - d[i] > 25) land++; } return { drawn: sum, land, hash: [...d.slice(d.length / 2, d.length / 2 + 4000)].reduce((a, v) => (a * 31 + v) % 1e9, 7) }; });
  const g1 = await look(); await p.waitForTimeout(600); const g2 = await look();
  check('globe: drawn, with land on it, and turning', g1.drawn > 1000 && g1.land > 100 && g1.hash !== g2.hash, `${g1.drawn} ${g1.land}`);
  const gb = await canvas.boundingBox();
  await p.mouse.move(gb.x + gb.width * 0.3, gb.y + gb.height / 2); await p.mouse.down(); await p.mouse.move(gb.x + gb.width * 0.8, gb.y + gb.height / 2, { steps: 5 }); await p.mouse.up();
  await p.waitForTimeout(100);
  const g3 = await look();
  check('globe: a drag spins it', g3.hash !== g2.hash);
  await p.waitForTimeout(1500); // the spin of the drag dies down first
  await p.locator('.lab-side .lab-pause').click(); await p.waitForTimeout(300);
  const turnA = await canvas.evaluate((el) => getComputedStyle(el).getPropertyValue('--lb-turn')); const p1 = await look(); await p.waitForTimeout(500); const p2 = await look();
  check('globe: "pause the animations" stops it too', turnA === (await canvas.evaluate((el) => getComputedStyle(el).getPropertyValue('--lb-turn'))) && p1.hash === p2.hash);
  await p.locator('.lab-side .lab-pause').click();

  // Logo loader
  s = await at(p, 'arch-signal');
  check('logo loader: a status called "Loading"', (await s.getByRole('status', { name: 'Loading' }).count()) === 1);
  const lit = await s.locator('.lb-mk-wedge').evaluateAll((ws) => ws.map((w) => Number(getComputedStyle(w).opacity)));
  await p.waitForTimeout(450);
  const lit2 = await s.locator('.lb-mk-wedge').evaluateAll((ws) => ws.map((w) => Number(getComputedStyle(w).opacity)));
  check('logo loader: four wedges, lighting up in turn', lit.length === 4 && lit.join() !== lit2.join() && Math.max(...lit, ...lit2) > 0.9 && Math.min(...lit, ...lit2) < 0.4, `${lit.map((v) => v.toFixed(2))} / ${lit2.map((v) => v.toFixed(2))}`);

  // Mask
  s = await at(p, 'arch-mask');
  await p.locator('.lab-card[data-demo="arch-mask"]').getByRole('button', { name: /Replay/ }).click(); await p.waitForTimeout(250);
  const early = await s.evaluate((el) => Number(getComputedStyle(el.querySelector('.lb-mask-face')).opacity));
  await p.waitForTimeout(3400);
  const done = await s.evaluate((el) => ({ face: Number(getComputedStyle(el.querySelector('.lb-mask-face')).opacity), bands: [...el.querySelectorAll('.lb-mask-band')].map((x) => parseFloat(getComputedStyle(x).strokeDashoffset)).join() }));
  check('mask: the poster builds itself and ends on the mask', early === 0 && done.face === 1 && done.bands === '0,0', `${early} ${JSON.stringify(done)}`);
  check('no errors or warnings', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Reduced motion: every demo shows its end state, nothing moves by itself
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('lang', 'en'); } catch {} });
  const p = await ctx.newPage();
  await p.goto(BASE + '/lab'); await p.waitForTimeout(800);
  await p.locator('.lab-filters .lab-chip', { hasText: 'From my archive' }).click(); await p.waitForTimeout(600);
  let s = await at(p, 'arch-water');
  check('calm: the tube is already full, no bubbles', (await s.locator('.lb-tube-level').textContent()) === '65%' && (await s.locator('.lb-tube-bubbles').evaluate((el) => getComputedStyle(el).display)) === 'none');
  s = await at(p, 'arch-globe');
  check('calm: the figures are there at once, the globe does not turn', (await s.locator('[data-to]').allTextContents()).join() === '160,35,12,98' && (await s.locator('canvas').evaluate((el) => getComputedStyle(el).animationName)) === 'none');
  s = await at(p, 'arch-mask');
  const end = await s.evaluate((el) => ({ face: getComputedStyle(el.querySelector('.lb-mask-face')).opacity, bands: [...el.querySelectorAll('.lb-mask-band')].map((x) => getComputedStyle(x).strokeDashoffset).join() }));
  check('calm: the poster is shown finished', end.face === '1' && /^0(px)?,0(px)?$/.test(end.bands), JSON.stringify(end));
  s = await at(p, 'arch-signal');
  check('calm: the monogram is shown lit', (await s.locator('.lb-mk-wedge').evaluateAll((ws) => ws.every((w) => getComputedStyle(w).opacity === '1'))));
  const moving = await p.evaluate((ids) => ids.flatMap((id) => [...document.querySelectorAll(`.lab-card[data-demo="${id}"] .lab-stage *`)].filter((el) => getComputedStyle(el).animationName !== 'none').map((el) => id + ' ' + (el.getAttribute('class') || el.tagName))), IDS.slice(1));
  check('calm: no animation runs in the archive demos', moving.length === 0, moving.slice(0, 5).join(', '));
  await ctx.close();
}

// Phone width: each demo fits its card
{
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(BASE + '/lab'); await p.waitForTimeout(800);
  const fits = await p.evaluate((ids) => ids.map((id) => {
    const st = document.querySelector(`.lab-card[data-demo="${id}"] .lab-stage`); const box = st.getBoundingClientRect();
    const over = [...st.querySelectorAll('*')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.left < box.left - 1 || r.right > box.right + 1) && !el.closest('svg') ; });
    return over.length ? `${id}: ${over.length}` : '';
  }).filter(Boolean), IDS);
  check('phone: every archive demo fits inside its card', fits.length === 0 && (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) === 0, fits.join(' | '));
  await ctx.close();
}

await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
