// The Eons demos: layout at every size, motion phases, painting, fallback
// scrubbing (as in browsers without scroll-driven animations), reduced
// motion, pause control, accessibility.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE } from '../lib.mjs';
const URL_ = BASE + '/projects/trimension-studio';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };

const goTo = (p, sel, prog) => p.evaluate(([sel, prog]) => { const el = document.querySelector(sel); const r = el.getBoundingClientRect(); window.scrollTo(0, r.top + scrollY - (innerHeight - prog * (innerHeight + r.height))); }, [sel, prog]);
// scroll through the demos like a visitor, so the lazy images load on their own
const loadAll = (p) => p.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  const demos = document.querySelector('.eons-demos');
  const start = demos.getBoundingClientRect().top + scrollY - innerHeight;
  const end = start + demos.offsetHeight + innerHeight;
  for (let y = start; y < end; y += innerHeight / 2) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  const wait = (i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }));
  await Promise.race([Promise.all([...demos.querySelectorAll('img')].map(wait)), new Promise((r) => setTimeout(r, 8000))]);
  return [...demos.querySelectorAll('img')].filter((i) => !i.complete).length;
});
// counts pixels of a colour family inside an element, from a real screenshot
const countPixels = async (p, sel, kind) => {
  const box = await p.locator(sel).boundingBox();
  const vh = await p.evaluate(() => innerHeight);
  const clip = { x: box.x, y: Math.max(0, box.y), width: box.width, height: Math.min(box.height, vh - Math.max(0, box.y)) };
  if (clip.height < 10) return -1;
  const png = (await p.screenshot({ clip })).toString('base64');
  return p.evaluate(async ([b64, kind]) => {
    const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0;
    for (let k = 0; k < d.length; k += 4) {
      const [r, g, bl] = [d[k], d[k + 1], d[k + 2]];
      if (kind === 'rock' && r > 150 && g > 60 && g < 140 && bl < 110 && r > g + 50) n++;
      if (kind === 'skin' && r > 150 && g > 100 && bl > 80 && r > bl + 30 && r - g < 70) n++;
    }
    return n;
  }, [png, kind]);
};

const sizes = [['desktop', 1440, 900, false], ['laptop', 1280, 720, false], ['1024', 1024, 768, false], ['tablet', 820, 1180, true], ['tablet landscape', 1180, 820, true], ['720', 720, 900, true], ['640', 640, 900, true], ['phone', 390, 844, true], ['small phone', 360, 740, true], ['320', 320, 640, true]];
for (const [name, w, h, mobile] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, locale: 'en-GB', timezoneId: 'Europe/London' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(URL_); await p.waitForTimeout(400);
  await loadAll(p);

  // the shattered world, floating: while the scene crosses the screen, the
  // fragments stay around the text and off the title, and the two big rocks
  // keep their cut side beyond the frame
  const lays = [];
  for (const prog of [0.3, 0.5, 0.7]) {
    await goTo(p, '.shatter', prog); await p.waitForTimeout(350);
    lays.push(await p.evaluate((prog) => {
      const overlaps = (r, b) => r.right > b.left + 2 && r.left < b.right - 2 && r.bottom > b.top + 2 && r.top < b.bottom - 2;
      const copy = document.querySelector('.shatter-copy').getBoundingClientRect();
      const scene = document.querySelector('.shatter').getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(document.querySelector('.eons-title'));
      const title = [...range.getClientRects()];
      const frags = [...document.querySelectorAll('.frag')].filter((f) => getComputedStyle(f).display !== 'none');
      const rocks = frags.map((f) => f.querySelector('img').getBoundingClientRect());
      const cut = [...document.querySelectorAll('.frag[data-side]')].map((f) => {
        const panel = f.closest('.eons-panel').getBoundingClientRect();
        const img = f.querySelector('img');
        const cs = getComputedStyle(f);
        const r = f.getBoundingClientRect();
        // worst case of the sway, pivoting on the cut side
        const deg = Math.abs(parseFloat(cs.getPropertyValue('--rot'))) + parseFloat(cs.getPropertyValue('--sway'));
        const reach = (img.offsetHeight / 2) * Math.sin((deg * Math.PI) / 180);
        const tx = new DOMMatrix(getComputedStyle(img).transform).m41;
        const margin = f.dataset.side === 'left' ? panel.left - (r.left + tx + reach) : r.right + tx - reach - panel.right;
        return { side: f.dataset.side, margin: Math.round(margin * 10) / 10, wander: cs.getPropertyValue('--wander').trim() };
      });
      return {
        prog, rocks: rocks.length,
        hit: rocks.filter((r) => overlaps(r, copy)).length,
        titleHit: rocks.filter((r) => title.some((t) => overlaps(r, t))).length,
        centersInside: rocks.filter((r) => { const cx = (r.left + r.right) / 2; const cy = (r.top + r.bottom) / 2; return cx > scene.left && cx < scene.right && cy > scene.top && cy < scene.bottom; }).length,
        copyOpacity: getComputedStyle(document.querySelector('.shatter-copy')).opacity,
        cut,
        drift: [...document.querySelectorAll('.frag-move')].map((m) => getComputedStyle(m).translate),
        over: document.documentElement.scrollWidth > innerWidth,
      };
    }, prog));
  }
  const lay = lays[1];
  check(`${name}: fragments float around the text, never on it or on the title`, lays.every((l) => l.hit === 0 && l.titleHit === 0 && l.centersInside === l.rocks && l.rocks >= 9 && l.copyOpacity === '1'), JSON.stringify(lays.map(({ prog, rocks, hit, titleHit, centersInside }) => ({ prog, rocks, hit, titleHit, centersInside }))));
  check(`${name}: the big rocks keep their cut side beyond the frame`, lays.every((l) => l.cut.length === 2 && l.cut.every((c) => c.margin > 0 && c.wander === '0')), lays.map((l) => l.cut.map((c) => `${c.side} ${c.margin}px`).join(' ')).join(' | '));
  check(`${name}: no sideways scrolling`, !lay.over);
  await goTo(p, '.shatter', 0.5); await p.waitForTimeout(300);
  const rockPx = await countPixels(p, '.shatter', 'rock');
  check(`${name}: fragments are painted`, rockPx > 400, `${rockPx} px`);

  // no burst: the fragments are there from the start; the scroll only adds
  // depth (near ones rise faster than the page, far ones lag behind)
  await goTo(p, '.shatter', 0.1); await p.waitForTimeout(300);
  const early = await p.evaluate(() => [...document.querySelectorAll('.frag-move')].map((m) => ({ op: getComputedStyle(m).opacity, x: getComputedStyle(m).translate.split(' ')[0] })));
  const dy = (t) => parseFloat(t.split(' ')[1] || '0');
  const near = dy(lays[2].drift[0]) - dy(lays[0].drift[0]);
  const far = dy(lays[2].drift[9]) - dy(lays[0].drift[9]);
  check(`${name}: no burst, the scroll only adds depth`, early.every((e) => e.op === '1' && (e.x === '0px' || e.x === 'none')) && near < 0 && far > 0 && Math.abs(near) > Math.abs(far) * 2, `near ${near.toFixed(1)}px, far ${far.toFixed(1)}px`);

  // the hands: apart, then pressed
  await goTo(p, '.agent', 0.33); await p.waitForTimeout(350);
  const mid = await p.evaluate(() => getComputedStyle(document.querySelector('.agent-right')).translate);
  await goTo(p, '.agent', 0.62); await p.waitForTimeout(350);
  const end = await p.evaluate(() => { const r = getComputedStyle(document.querySelector('.agent-right')); return { tr: r.translate, rot: r.rotate, glow: getComputedStyle(document.querySelector('.agent-glow')).opacity }; });
  const skin = await countPixels(p, '.agent-stage', 'skin');
  check(`${name}: the hand travels, then presses the dial (fingertip 14.3/34.9 onto 28.2/49.4)`, mid !== end.tr && end.tr === '13.9% 14.5%' && (end.rot === '0deg' || end.rot === 'none') && parseFloat(end.glow) > 0.4, `${mid} -> ${end.tr}, glow ${end.glow}`);
  check(`${name}: both arms are painted`, skin > 1500, `${skin} px`);
  check(`${name}: no errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Browsers without scroll-driven animations: the same keyframes, scrubbed by --progress
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { const orig = CSS.supports.bind(CSS); CSS.supports = (...a) => (String(a.join(' ')).includes('animation-timeline') ? false : orig(...a)); });
  const p = await ctx.newPage();
  await p.route('**/assets/*.css', async (route) => {
    const res = await route.fetch(); let css = await res.text();
    css = css.replaceAll('animation-timeline: view()', 'animation-timeline: not-supported-here()');
    await route.fulfill({ response: res, body: css });
  });
  await p.goto(URL_); await p.waitForTimeout(400);
  await loadAll(p);
  const nativeCss = await p.evaluate(() => getComputedStyle(document.querySelector('.agent-right')).animationTimeline);
  await goTo(p, '.agent', 0.1); await p.waitForTimeout(300);
  const a = await p.evaluate(() => ({ prog: getComputedStyle(document.querySelector('.agent')).getPropertyValue('--progress'), op: getComputedStyle(document.querySelector('.agent-right')).opacity }));
  await goTo(p, '.agent', 0.62); await p.waitForTimeout(300);
  const c = await p.evaluate(() => ({ prog: getComputedStyle(document.querySelector('.agent')).getPropertyValue('--progress'), tr: getComputedStyle(document.querySelector('.agent-right')).translate, state: getComputedStyle(document.querySelector('.agent-right')).animationPlayState }));
  const drift = async (prog) => { await goTo(p, '.shatter', prog); await p.waitForTimeout(300); return p.evaluate(() => ({ prog: getComputedStyle(document.querySelector('.shatter')).getPropertyValue('--progress'), tr: getComputedStyle(document.querySelector('.frag-move')).translate })); };
  const s = { early: await drift(0.25), late: await drift(0.75) };
  s.ok = Math.abs(parseFloat(s.early.prog) - 0.25) < 0.03 && Math.abs(parseFloat(s.late.prog) - 0.75) < 0.03 && parseFloat(s.early.tr.split(' ')[1]) > 0 && parseFloat(s.late.tr.split(' ')[1]) < 0;
  check('fallback: no scroll timeline in use', nativeCss === 'auto', nativeCss);
  check('fallback: --progress follows the scroll and scrubs the same keyframes', Math.abs(parseFloat(a.prog) - 0.1) < 0.03 && a.op === '0' && Math.abs(parseFloat(c.prog) - 0.62) < 0.03 && c.tr === '13.9% 14.5%' && c.state === 'paused' && s.ok, JSON.stringify({ a, c, s }));
  await ctx.close();
}

// Reduced motion: the finished picture
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(URL_); await p.waitForTimeout(400);
  await loadAll(p);
  await goTo(p, '.agent', 0.1); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({
    anims: [...document.querySelectorAll('.eons-demos *')].filter((el) => getComputedStyle(el).animationName !== 'none').length,
    hand: getComputedStyle(document.querySelector('.agent-right')).translate,
    rocks: [...document.querySelectorAll('.frag-move')].every((m) => getComputedStyle(m).opacity === '1' && getComputedStyle(m).translate === 'none'),
    copy: getComputedStyle(document.querySelector('.shatter-copy')).opacity,
    pause: !!document.querySelector('.eons-pause'),
  }));
  check('reduced motion: nothing moves, the picture is complete, no pause button', r.anims === 0 && r.hand === '13.9% 14.5%' && r.rocks && r.copy === '1' && !r.pause, JSON.stringify(r));
  await ctx.close();
}

// Pause, off-screen rest, accessibility
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL_); await p.waitForTimeout(400);
  await loadAll(p);
  await goTo(p, '.shatter', 0.5); await p.waitForTimeout(400);
  const before = await p.evaluate(() => ({ state: [...new Set(getComputedStyle(document.querySelector('.frag img')).animationPlayState.split(', '))].join(), name: document.querySelector('.eons-pause').textContent }));
  await p.click('.eons-pause'); await p.waitForTimeout(200);
  const after = await p.evaluate(() => ({ state: [...new Set(getComputedStyle(document.querySelector('.frag img')).animationPlayState.split(', '))].join(), name: document.querySelector('.eons-pause').textContent, paused: document.querySelector('.shatter').hasAttribute('data-paused') }));
  const fl = await p.evaluate(() => document.querySelector('.frag img').getAnimations().map((a) => `${a.animationName} ${Math.round(a.effect.getTiming().duration)}`));
  check('the float: three slow motions with unrelated periods', fl.length === 3 && new Set(fl.map((f) => f.split(' ')[1])).size === 3 && ['frag-rise', 'frag-wander', 'frag-sway'].every((n) => fl.some((f) => f.startsWith(n))), fl.join(', '));
  check('pause button stops the floating and says so', before.state === 'running' && after.state === 'paused' && after.paused && before.name !== after.name, `${before.name} -> ${after.name}`);
  await p.click('.eons-pause'); await p.waitForTimeout(100);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  const off = await p.evaluate(() => ({ inview: document.querySelector('.shatter').hasAttribute('data-inview'), state: [...new Set(getComputedStyle(document.querySelector('.frag img')).animationPlayState.split(', '))].join() }));
  check('the floating rests when the scene is off screen', !off.inview && off.state === 'paused', JSON.stringify(off));
  await p.addScriptTag({ content: AXE });
  const ax = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`));
  check('axe finds nothing with the demos', ax.length === 0, ax.join(' || '));
  const a11y = await p.evaluate(() => [...document.querySelectorAll('.eons-panel')].map((e) => `${e.getAttribute('role')}: ${e.getAttribute('aria-label')?.slice(0, 40)}`));
  check('each demo is one described picture for screen readers', a11y.length === 2 && a11y.every((s) => s.startsWith('img: Live demo')), a11y.join(' | '));
  await ctx.close();
}
// The Eons typefaces wait for the page to load; the code shown is the code that runs
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-GB' });
  const p = await ctx.newPage();
  await p.goto(URL_, { waitUntil: 'load' }); await p.waitForTimeout(2500);
  const f = await p.evaluate(async () => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fonts = performance.getEntriesByType('resource').filter((e) => /josefin|open-sans/.test(e.name)).map((e) => Math.round(e.startTime));
    await document.fonts.ready;
    return {
      load: Math.round(nav.loadEventStart), fonts,
      title: getComputedStyle(document.querySelector('.eons-title')).fontFamily,
      copy: getComputedStyle(document.querySelector('.shatter-copy')).fontFamily,
      ready: document.fonts.check('600 20px "Eons Display"') && document.fonts.check('300 16px "Eons Text"'),
    };
  });
  check('the Eons typefaces are fetched only after the page has loaded, then used', f.fonts.length === 2 && f.fonts.every((t) => t >= f.load) && /Eons Display/.test(f.title) && /Eons Text/.test(f.copy) && f.ready, JSON.stringify(f));
  const code = await p.evaluate(() => [...document.querySelectorAll('.case-code pre')].map((e) => e.textContent));
  const [frag, hands, js] = code;
  const css = await (await fetch(BASE + '/' + (await p.evaluate(() => [...document.styleSheets].map((s) => s.href).find((h) => h && h.includes('/assets/')))).split('/').slice(3).join('/'))).text();
  check('the excerpts hold the technique, read from the real files', code.length === 3 && frag.includes('view-timeline: --shatter block') && frag.includes('animation-timeline: --shatter') && frag.includes('@keyframes frag-drift') && frag.includes('@keyframes frag-rise') && frag.includes('@keyframes frag-sway') && frag.includes('/* … */') && hands.includes('@keyframes agent-reach') && js.includes('startScrollScenes') && !code.some((c) => c.includes('excerpt')) && css.includes('--shatter block'), code.map((c) => c.split('\n').length + ' lines').join(', '));
  await ctx.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
