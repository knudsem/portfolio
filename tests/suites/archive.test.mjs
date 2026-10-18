// The demos from the CodePen archive (the cat, the water, the globe and the
// logo loader reworked, the others in their first version): what they do,
// from the mouse, the keyboard and a finger, calm for reduced motion, at
// phone width
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const stage = (p, id) => p.locator(`.lab-card[data-demo="${id}"] .lab-stage`);
const at = async (p, id) => { await stage(p, id).scrollIntoViewIfNeeded(); await p.waitForTimeout(300); return stage(p, id); };
const IDS = ['envelope', 'arch-magnifier', 'arch-cat', 'arch-water', 'arch-globe', 'arch-rings', 'arch-signal', 'arch-logo', 'arch-mask'];

{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('lang', 'en'); } catch {} });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !m.text().includes('willReadFrequently')) errors.push(m.text()); }); // that warning comes from this test reading the globe's pixels
  await p.goto(BASE + '/lab'); await p.waitForTimeout(800);
  await p.locator('.lab-filters .lab-chip', { hasText: 'From my archive' }).click(); await p.waitForTimeout(900);
  check('the archive filter shows the nine archive demos', (await p.locator('.lab-card').evaluateAll((els) => els.map((e) => e.dataset.demo).join())) === IDS.join());

  // Rings
  let s = await at(p, 'arch-rings');
  const button = s.getByRole('button', { name: 'Games' });
  check('rings: a "Games" button, rings out of reach while closed', (await button.count()) === 1 && (await s.locator('a').evaluateAll((as) => as.every((a) => getComputedStyle(a).visibility === 'hidden'))));
  // only a quarter of the round button shows, in the corner: a click lands on its word
  await button.locator('span').click(); await p.waitForTimeout(900);
  const open = await s.evaluate((el) => ({ expanded: el.querySelector('button').getAttribute('aria-expanded'), visible: [...el.querySelectorAll('a')].map((a) => getComputedStyle(a).visibility).join(), shift: el.querySelector('.lb-rings').scrollLeft + el.querySelector('.lb-rings').scrollTop }));
  check('rings: open, the three rings reachable, nothing shifted', open.expanded === 'true' && open.visible === 'visible,visible,visible' && open.shift === 0, JSON.stringify(open));
  check('rings: the open button is called "Close"', (await s.getByRole('button', { name: 'Close' }).count()) === 1);
  await p.keyboard.press('Tab');
  check('rings: Tab goes from the button to the first ring', (await p.evaluate(() => document.activeElement.textContent.trim())) === 'Eons');
  await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  check('rings: Escape closes them and the focus goes back to the button', (await s.locator('button').getAttribute('aria-expanded')) === 'false' && (await p.evaluate(() => document.activeElement.matches('.lb-rings button'))));

  // Magnifier: the lens leaves its path and follows the pointer, then goes back
  s = await at(p, 'arch-magnifier');
  const loupe = s.locator('.lb-loupe'); const box = await loupe.boundingBox();
  await p.mouse.move(box.x + 90, box.y + 60); await p.mouse.move(box.x + 92, box.y + 61); await p.waitForTimeout(200);
  const lens = await loupe.evaluate((el) => ({ follow: el.hasAttribute('data-follow'), x: parseFloat(el.style.getPropertyValue('--lb-lx')), y: parseFloat(el.style.getPropertyValue('--lb-ly')), path: getComputedStyle(el).animationName }));
  check('magnifier: the lens follows the pointer, its own path stops', lens.follow && Math.abs(lens.x - 92) < 1.5 && Math.abs(lens.y - 61) < 1.5 && lens.path === 'none', JSON.stringify(lens));
  await p.mouse.move(0, 0); await p.waitForTimeout(200);
  check('magnifier: let go, it goes back to its path', await loupe.evaluate((el) => !el.hasAttribute('data-follow') && getComputedStyle(el).animationName === 'lb-loupe'));

  // Cat: the drawing from the pen, its paw built in 3D
  s = await at(p, 'arch-cat');
  const cat = s.getByRole('button', { name: 'Pet the lucky cat' });
  const parts = await cat.evaluate((el) => ['arm', 'pupil', 'eye', 'lid', 'tail'].map((n) => el.querySelector('.lb-lc-' + n)?.getAnimations().length > 0));
  check('cat: the swing of the paw, the eyes, the lids and the tail all move', parts.every(Boolean), parts.join());
  // the swing held at its top, then at its bottom, as the script draws it
  const swing = await cat.evaluate(async (el) => {
    const clock = el.querySelector('.lb-lc-arm').getAnimations().find((a) => a.animationName === 'lb-luck-swing');
    const frames = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    const read = () => {
      const palm = el.querySelectorAll('.lb-lc-paw-ink')[1].getBBox();
      return {
        forearm: +new DOMMatrix(getComputedStyle(el.querySelector('.lb-lc-forearm')).transform).d.toFixed(3),
        top: +palm.y.toFixed(1),
        height: +palm.height.toFixed(1),
        claw: +(el.querySelector('.lb-lc-claw').getAttribute('transform').match(/scale\(([\d.]+)/)?.[1] ?? 0),
      };
    };
    clock.pause(); clock.currentTime = 0; await frames(); const up = read();
    clock.currentTime = 1000; await frames(); const down = read();
    clock.currentTime = 0; clock.play();
    return { up, down };
  });
  const { up, down } = swing;
  check('cat: like a lucky cat, the forearm tips towards us and back, the paw coming down and up again', up.forearm === 1 && down.forearm < 0.7 && down.top - up.top > 40, JSON.stringify(swing));
  check('cat: the paw is drawn in 3D: tipped, it keeps its depth instead of going flat, and its claws, pointing at us, draw in', down.height > up.height * 0.75 && up.claw === 1 && down.claw < 0.85 && down.claw > 0.6, JSON.stringify(swing));
  const shadows = await cat.evaluate((el) => [...el.querySelectorAll('image')].map((i) => i.getAttribute('href')));
  const loaded = await Promise.all(shadows.map(async (h) => (await p.request.get(BASE + h)).status()));
  check('cat: its two shadows load', shadows.length === 2 && loaded.every((st) => st === 200), shadows.join() + ' ' + loaded.join());
  const cbox = await cat.boundingBox();
  await p.mouse.move(cbox.x - 10, cbox.y + 20); await p.waitForTimeout(50);
  check('cat: its eyes turn to the pointer', Number(await cat.evaluate((el) => el.style.getPropertyValue('--lb-look-x'))) < -0.5 && await cat.evaluate((el) => el.hasAttribute('data-look')));
  const rate = () => cat.evaluate((el) => ({ on: el.hasAttribute('data-lucky'), rates: el.querySelector('.lb-lc-arm').getAnimations().map((a) => a.playbackRate) }));
  await cat.click(); await p.waitForTimeout(100);
  const lucky = await rate();
  check('cat: a pet makes the whole paw beckon faster, from where it was', lucky.on && lucky.rates.length === 1 && lucky.rates.every((r) => r > 2), JSON.stringify(lucky));
  await p.waitForTimeout(1700);
  const calmAgain = await rate();
  check('cat: then it goes back to its own pace', !calmAgain.on && calmAgain.rates.every((r) => r === 1), JSON.stringify(calmAgain));
  await cat.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(80);
  check('cat: it can be petted from the keyboard too', await cat.evaluate((el) => el.hasAttribute('data-lucky')));

  // Water
  s = await at(p, 'arch-water'); await p.waitForTimeout(2300);
  check('water: the tube has filled up to 65%', (await s.locator('.lb-tube-level').textContent()) === '65%');
  const angle = (attr) => Number((attr || '').match(/rotate\((-?[\d.]+)/)?.[1] ?? 0);
  const glassTilt = async () => angle(await s.locator('.lb-tube-glass').getAttribute('transform'));
  const waterTilt = async () => angle('rotate' + ((await s.locator('.lb-tube-water').getAttribute('transform')).split('rotate')[1] || ''));
  const tubeBox = await s.locator('.lb-tube svg').boundingBox(); const stageBox = await s.boundingBox();
  const pivotX = tubeBox.x + tubeBox.width / 2, rowY = tubeBox.y + 40;
  // just right of the glass, it leans right: towards the pointer (it once leaned away)
  await p.mouse.move(pivotX - 30, rowY); await p.mouse.move(pivotX + 30, rowY, { steps: 3 }); await p.waitForTimeout(500);
  const near = await glassTilt();
  // out near the stage's edge, beyond the tube's own box, it still answers, and leans further
  await p.mouse.move(stageBox.x + stageBox.width - 6, rowY, { steps: 3 }); await p.waitForTimeout(160);
  const far = await glassTilt(); const slosh = await waterTilt();
  check('water: the tube leans towards the pointer wherever it is on the stage, the water lags behind', near > 0.5 && far > near + 4 && slosh !== 0, `near ${near}, far ${far}, slosh ${slosh}`);
  await p.mouse.move(stageBox.x + 6, rowY, { steps: 6 }); await p.waitForTimeout(500);
  const left = await glassTilt();
  check('water: on the left, it leans left', left < -5, String(left));
  // from all the way over, the water takes a little under four seconds to be still
  await p.mouse.move(0, 0); await p.waitForTimeout(4000);
  const rest = [await glassTilt(), await waterTilt()];
  check('water: let go, it stands up again and the water settles level', Math.abs(rest[0]) < 0.2 && Math.abs(rest[1]) < 0.2, rest.join(' | '));

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

  // Signal
  s = await at(p, 'arch-signal');
  check('signal: a status called "Connecting"', (await s.getByRole('status', { name: 'Connecting' }).count()) === 1);
  const arcs = [];
  for (let i = 0; i < 6; i++) { arcs.push(await s.locator('path').evaluateAll((ps) => ps.map((a) => Number(getComputedStyle(a).opacity).toFixed(2)).join())); await p.waitForTimeout(350); }
  check('signal: the arcs light up in turn', new Set(arcs).size > 2, arcs.join(' / '));

  // Logo loader
  s = await at(p, 'arch-logo');
  check('logo loader: a status called "Loading"', (await s.getByRole('status', { name: 'Loading' }).count()) === 1);
  // over one turn (2.4 s), each wedge lights up and fades, not all at once
  const turns = [];
  for (let i = 0; i < 13; i++) { turns.push(await s.locator('.lb-mk-wedge').evaluateAll((ws) => ws.map((w) => Number(getComputedStyle(w).opacity)))); await p.waitForTimeout(200); }
  const each = [0, 1, 2, 3].map((k) => [Math.min(...turns.map((t) => t[k])), Math.max(...turns.map((t) => t[k]))]);
  check('logo loader: four wedges of MK, lighting up in turn', turns[0].length === 4 && each.every(([lo, hi]) => lo < 0.3 && hi > 0.9) && turns.some((t) => Math.max(...t) - Math.min(...t) > 0.5), each.map(([lo, hi]) => `${lo.toFixed(2)} to ${hi.toFixed(2)}`).join(', '));

  // Wave transition
  s = await at(p, 'arch-mask');
  const waves = [];
  for (let i = 0; i < 9; i++) { waves.push(await s.locator('.lb-wipe-wave').first().evaluate((el) => getComputedStyle(el).translate)); await p.waitForTimeout(400); }
  check('wave transition: the waves sweep across the page', new Set(waves).size > 2, [...new Set(waves)].join(' / '));
  check('wave transition: no mask on it any more', (await s.locator('.lb-mask-face').count()) === 0);
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
  check('calm: the page stays put, the waves out of sight', (await s.locator('.lb-wipe-wave').evaluateAll((ws) => ws.every((w) => getComputedStyle(w).translate === '250px'))));
  s = await at(p, 'arch-signal');
  check('calm: the signal is shown lit', (await s.locator('path').evaluateAll((ps) => ps.every((a) => getComputedStyle(a).opacity === '1'))));
  s = await at(p, 'arch-logo');
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
    // what a box inside the stage cuts off (overflow hidden or clip) does not count
    const cut = (el) => { for (let a = el.parentElement; a && a !== st; a = a.parentElement) { const q = a.getBoundingClientRect(); if (getComputedStyle(a).overflow !== 'visible' && q.left >= box.left - 1 && q.right <= box.right + 1) return true; } return false; };
    const over = [...st.querySelectorAll('*')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.left < box.left - 1 || r.right > box.right + 1) && !el.closest('svg') && !cut(el); });
    return over.length ? `${id}: ${over.length}` : '';
  }).filter(Boolean), IDS);
  check('phone: every archive demo fits inside its card', fits.length === 0 && (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) === 0, fits.join(' | '));
  await ctx.close();
}

await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
