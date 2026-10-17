// Screens in two widths: every srcset file exists; a mid-range phone gets the
// 800px hero, downloaded once (the preload is reused); a desktop gets the
// 1440px hero and the 800px half-width screens; an iPhone (3x) gets 1440.
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const SLUGS = ['accesseu', 'interdyn-dealer-portal', 'pro-ject-audio-australia', 'pro-ject-audio-systems', 'exclusive-construction', 'trimension-studio'];
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };

const DEVICES = {
  'phone 412 @1.75x': { viewport: { width: 412, height: 915 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true, want: '-800.webp' },
  'iPhone 390 @3x': { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, want: '.webp' },
  'desktop 1440 @1x': { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, want: '.webp' },
};
for (const [label, { want, ...opts }] of Object.entries(DEVICES)) {
  const ctx = await b.newContext(opts);
  for (const slug of SLUGS) {
    const p = await ctx.newPage();
    const heroLoads = [];
    p.on('request', (r) => { if (/\/media\/.+\.webp$/.test(r.url())) heroLoads.push(new URL(r.url()).pathname); });
    await p.goto(`${BASE}/projects/${slug}`); await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const hero = document.querySelector('.case-hero img');
      return { current: new URL(hero.currentSrc).pathname, src: hero.getAttribute('src'), srcset: hero.getAttribute('srcset'), preload: document.querySelector('link[rel=preload][as=image]')?.getAttribute('imagesrcset') };
    });
    const base = r.src.replace(/\.webp$/, '');
    const heroFiles = heroLoads.filter((u) => u === `${base}.webp` || u === `${base}-800.webp`);
    const okPick = want === '-800.webp' ? r.current === `${base}-800.webp` : r.current === `${base}.webp`;
    check(`${label} ${slug}: hero ${r.current.split('/').pop()}, downloaded once, preload matches`, okPick && heroFiles.length === 1 && r.preload === r.srcset, JSON.stringify({ current: r.current, loads: heroFiles }));
    await p.close();
  }
  await ctx.close();
}

// on a desktop, half-width gallery screens use the 800px file
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/projects/pro-ject-audio-australia`); await p.waitForTimeout(400);
  const r = await p.evaluate(async () => {
    const imgs = [...document.querySelectorAll('.case-shot:not(.is-wide):not(.case-phones) img')];
    for (const img of imgs) { img.loading = 'eager'; if (!img.complete) await new Promise((res) => { img.onload = img.onerror = res; }); }
    return imgs.map((img) => new URL(img.currentSrc).pathname.split('/').pop());
  });
  check('desktop: half-width screens use the 800px files', r.length === 4 && r.every((f) => f.endsWith('-800.webp')), r.join(', '));
  await p.close();
}

// every file named in a srcset exists
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const files = new Set();
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/projects/${slug}`); await p.waitForTimeout(300);
    for (const set of await p.evaluate(() => [...document.querySelectorAll('img[srcset]')].map((i) => i.getAttribute('srcset')))) for (const part of set.split(',')) files.add(part.trim().split(' ')[0]);
  }
  const missing = [];
  for (const f of files) { const res = await fetch(BASE + f); if (res.status !== 200 || !/webp/.test(res.headers.get('content-type'))) missing.push(f); }
  check(`all ${files.size} screen files in the srcsets exist`, files.size >= 60 && missing.length === 0, missing.join(', '));
  await p.close();
}
await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
