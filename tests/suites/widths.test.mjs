// The home page at fifteen widths, from 320px to 2560px: nothing may scroll
// sideways
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let bad = 0;
for (const w of [320, 360, 390, 430, 600, 768, 900, 901, 1024, 1180, 1280, 1366, 1440, 1920, 2560]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(BASE); await p.waitForTimeout(500);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w) bad++;
  console.log(`${sw > w ? 'FAIL' : 'ok  '} ${w}px: ${sw > w ? 'the page is ' + sw + 'px wide' : 'no sideways scroll'}`);
  await p.close();
}
await b.close();
console.log(bad ? `\n${bad} FAILED` : '\nall passed');
process.exit(bad ? 1 : 0);
