// French typography on every page: no : ; ? ! % » after a plain space and no
// « before one (they need a no-break space, so a sign never starts a line).
// Code is left out: it keeps its own spacing. English pages are untouched.
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const PAGES = ['/', '/lab', '/blog', '/blog/motion-that-serves', '/blog/scroll-driven-animations', '/blog/ai-suggests-people-decide', '/projects/accesseu', '/projects/interdyn-dealer-portal', '/projects/pro-ject-audio-australia', '/projects/pro-ject-audio-systems', '/projects/exclusive-construction', '/projects/trimension-studio', '/does-not-exist'];
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };

const scan = (p) => p.evaluate(() => {
  const bad = []; let nbsp = 0;
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest('pre, code, script, style, .lab-stage, .eons-demos [aria-hidden="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
  while (walker.nextNode()) texts.push(walker.currentNode.textContent);
  // attributes people hear or see: labels, titles, alt texts, placeholders
  for (const el of document.querySelectorAll('[aria-label], [title], img[alt], [placeholder]')) {
    if (el.closest('.lab-stage')) continue;
    for (const a of ['aria-label', 'title', 'alt', 'placeholder']) if (el.getAttribute(a)) texts.push(el.getAttribute(a));
  }
  texts.push(document.title);
  for (const text of texts) {
    nbsp += (text.match(/ [:;?!%»]/g) || []).length;
    const m = text.match(/.{0,25} [:;?!%»]|« .{0,10}/);
    if (m) bad.push(m[0]);
  }
  return { bad: [...new Set(bad)].slice(0, 6), nbsp };
});

let total = 0;
for (const lang of ['fr', 'en']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((lang) => { try { localStorage.setItem('lang', lang); } catch {} }, lang);
  const p = await ctx.newPage();
  for (const path of PAGES) {
    await p.goto(BASE + path); await p.waitForTimeout(500);
    // the palette and the phone menu hold text too
    const r = await scan(p);
    if (lang === 'fr') { total += r.nbsp; check(`fr ${path}: French punctuation held by no-break spaces (${r.nbsp})`, r.bad.length === 0, r.bad.join(' | ')); }
    else check(`en ${path}: English left alone`, r.nbsp === 0, String(r.nbsp));
  }
  if (lang === 'fr') {
    await p.goto(BASE + '/'); await p.waitForTimeout(500);
    await p.keyboard.press('Control+k'); await p.waitForTimeout(300);
    const r = await scan(p);
    check('fr command palette', r.bad.length === 0, r.bad.join(' | '));
  }
  await ctx.close();
}
check('French pages do use no-break spaces', total > 50, String(total));
await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
