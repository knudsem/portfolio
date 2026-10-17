// The home page, scanned by axe in twelve states: desktop and phone, French
// and English, and the contact form clean, with errors, and after a failed send
import { chromium } from 'playwright';
import { BASE, AXE } from '../lib.mjs';
const axeSrc = AXE;
const b = await chromium.launch();
let total = 0;
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
for (const [label, w, h, mobile] of [['desktop', 1440, 900, false], ['phone', 390, 844, true]]) {
  for (const [lang, locale, tz] of [['FR', 'fr-FR', 'Europe/Paris'], ['EN', 'en-US', 'America/New_York']]) {
    for (const state of ['normal', 'form errors + suggestion', 'form send failed']) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, locale, timezoneId: tz, isMobile: mobile, hasTouch: mobile });
      const p = await ctx.newPage();
      await p.route('**/formsubmit.co/**', r => r.abort());
      await p.goto(BASE); await p.waitForTimeout(300);
      if (state !== 'normal') {
        if (state === 'form errors + suggestion') {
          await p.fill('#cf-email', 'x@gmial.com'); await p.click('#cf-message'); await p.click('.form-submit');
        } else {
          await p.fill('#cf-name', 'A'); await p.fill('#cf-email', 'a@b.com'); await p.fill('#cf-message', 'Hi'); await p.click('.form-submit');
        }
        await p.waitForTimeout(400);
      }
      await p.addScriptTag({ content: axeSrc });
      const found = new Map();
      // scan with each section scrolled into view, plus top and bottom of the page
      const positions = ['top', 'about', 'work', 'services', 'proof', 'contact', 'bottom'];
      for (const pos of positions) {
        await p.evaluate((pos) => {
          document.documentElement.style.scrollBehavior = 'auto';
          if (pos === 'top') window.scrollTo(0, 0);
          else if (pos === 'bottom') window.scrollTo(0, document.documentElement.scrollHeight);
          else document.getElementById(pos).scrollIntoView();
        }, pos);
        await p.waitForTimeout(1100);
        const v = await p.evaluate(async (tags) => (await axe.run(document, { runOnly: { type: 'tag', values: tags } })).violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.target.join(' ') + ' :: ' + (n.any[0]?.message || n.all[0]?.message || n.none[0]?.message || '').slice(0, 140)) })), tags);
        for (const x of v) for (const n of x.nodes) found.set(x.id + '|' + n, x);
      }
      total += found.size;
      console.log(`${found.size ? 'FAIL' : 'ok  '} axe, ${label} ${lang} (${state}): ${found.size ? found.size + ' problem(s)' : 'no problems'}`);
      for (const [k, x] of found) console.log(`   - [${x.impact}] ${x.id}: ${k.split('|')[1]}`);
      await ctx.close();
    }
  }
}
console.log(total ? `\n${total} FAILED` : '\nall passed');
await b.close();
process.exit(total ? 1 : 0);
