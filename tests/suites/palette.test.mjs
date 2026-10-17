import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const state = (p) => p.evaluate(() => {
  const d = document.querySelector('dialog.cmdk');
  const input = d.querySelector('.cmdk-input');
  const act = input.getAttribute('aria-activedescendant');
  return {
    open: d.open,
    focus: document.activeElement === input ? 'input' : (document.activeElement?.id || document.activeElement?.className || document.activeElement?.tagName),
    options: [...d.querySelectorAll('[role=option]')].map((o) => o.textContent.replace(/#\w+$/, '').trim()),
    active: act ? document.getElementById(act)?.textContent.replace(/#\w+$/, '').trim() : null,
    selected: [...d.querySelectorAll('[role=option][aria-selected=true]')].length,
    expanded: input.getAttribute('aria-expanded'),
    status: d.querySelector('[role=status]').textContent,
  };
});

for (const [lang, locale, tz] of [['en', 'en-GB', 'Europe/London'], ['fr', 'fr-FR', 'Europe/Paris']]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, locale, timezoneId: tz, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  await p.goto(BASE + '/'); await p.waitForTimeout(600);

  // Header trigger
  const trig = await p.evaluate(() => { const t = document.querySelector('.cmdk-trigger'); const r = t.getBoundingClientRect(); return { name: t.textContent, w: r.width, visible: getComputedStyle(t).display !== 'none' }; });
  check(`${lang}: header trigger visible at 1280 px`, trig.visible && trig.w > 0, trig.name);

  // Shortcut opens, focus in the field, all commands listed
  await p.keyboard.press('Control+k');
  await p.waitForTimeout(250);
  let s = await state(p);
  check(`${lang}: Ctrl K opens the menu with focus in the search field`, s.open && s.focus === 'input', s.focus);
  check(`${lang}: 18 commands listed (the lab, the blog and 6 projects included), first one highlighted`, s.options.length === 18 && s.active === s.options[0] && s.selected === 1, s.options.join(' | '));
  check(`${lang}: language command is in the other language`, s.options.includes(lang === 'en' ? 'Passer en français' : 'Switch to English'));

  // Arrow keys, wrap around
  await p.keyboard.press('ArrowDown'); s = await state(p);
  check(`${lang}: ArrowDown moves the highlight`, s.active === s.options[1], s.active);
  await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowUp'); s = await state(p);
  check(`${lang}: ArrowUp from the first wraps to the last`, s.active === s.options[17], s.active);

  // Search ignores accents and case
  await p.keyboard.type(lang === 'fr' ? 'ACCESSIBILITE' : 'Accessib');
  await p.waitForTimeout(100); s = await state(p);
  check(`${lang}: search finds the audit, accents ignored`, s.options.some((o) => /audit/i.test(o)) && s.active === s.options[0], `${s.options.join(' | ')} / status "${s.status}"`);
  await p.keyboard.press('Control+a'); await p.keyboard.type('zzzz'); await p.waitForTimeout(100); s = await state(p);
  const empty = await p.evaluate(() => document.querySelector('.cmdk-empty')?.textContent);
  check(`${lang}: no match shows a message, listbox collapsed`, s.options.length === 0 && s.expanded === 'false' && /zzzz/.test(empty) && s.status === empty, `${empty} / ${s.status}`);

  // Escape closes and gives focus back
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); s = await state(p);
  check(`${lang}: Escape closes`, !s.open);
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200); s = await state(p);
  check(`${lang}: reopening starts with an empty search`, s.open && s.options.length === 18 && (await p.inputValue('.cmdk-input')) === '');

  // axe with the menu open
  await p.addScriptTag({ content: AXE });
  const ax = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }); return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`); });
  check(`${lang}: axe finds nothing with the menu open`, ax.length === 0, ax.join(' || '));

  // Enter on "Work": closes, scrolls, focus on the heading
  await p.keyboard.type(lang === 'fr' ? 'projets' : 'work');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(1400);
  const work = await p.evaluate(() => ({ open: document.querySelector('dialog.cmdk').open, focus: document.activeElement.closest('section')?.id, tag: document.activeElement.tagName, top: Math.round(document.getElementById('work').getBoundingClientRect().top) }));
  check(`${lang}: Enter on Work scrolls there and focuses its heading`, !work.open && work.focus === 'work' && work.tag === 'H2' && work.top > 60 && work.top < 140, JSON.stringify(work));

  // Copy email via click, toast announced
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  await p.keyboard.type(lang === 'fr' ? 'email' : 'email');
  const opt = await p.evaluate(() => [...document.querySelectorAll('.cmdk [role=option]')].map((o) => o.textContent));
  await p.locator('.cmdk [role=option]', { hasText: lang === 'fr' ? 'Copier mon adresse email' : 'Copy my email address' }).click();
  await p.waitForTimeout(300);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  const toast = await p.evaluate(() => ({ text: document.querySelector('.toast-region .toast')?.textContent, role: document.querySelector('.toast-region').getAttribute('role') }));
  check(`${lang}: copy email puts it in the clipboard and confirms`, clip === 'mathiasknudsen31@gmail.com' && toast.role === 'status' && (lang === 'fr' ? toast.text === 'Adresse email copiée.' : toast.text === 'Email address copied.'), `${clip} / ${toast.text} / options ${opt.length}`);
  await p.waitForTimeout(3400);
  check(`${lang}: the confirmation goes away`, await p.evaluate(() => !document.querySelector('.toast-region .toast')));

  // Copy link
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  await p.keyboard.type(lang === 'fr' ? 'lien' : 'link'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  check(`${lang}: copy link copies the public address`, (await p.evaluate(() => navigator.clipboard.readText())) === 'https://mathias-knudsen.vercel.app/');

  // Message: focus the name field
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  await p.keyboard.type(lang === 'fr' ? 'message' : 'message'); await p.keyboard.press('Enter'); await p.waitForTimeout(1400);
  check(`${lang}: "write me a message" focuses the name field`, (await p.evaluate(() => document.activeElement.id)) === 'cf-name');

  // Ctrl K inside the form field still opens (not a Mac)
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  check(`${lang}: Ctrl K works from inside a text field`, (await state(p)).open);
  // Backdrop click closes
  await p.mouse.click(20, 780); await p.waitForTimeout(200);
  s = await state(p);
  check(`${lang}: clicking the backdrop closes, focus back in the field`, !s.open && s.focus === 'cf-name', s.focus);

  // Audit from the menu
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  await p.keyboard.type('audit'); await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  const mid = await p.evaluate(() => ({ cls: document.activeElement.className, aria: document.activeElement.getAttribute('aria-disabled') }));
  await p.waitForFunction(() => document.querySelector('.console-result'), null, { timeout: 30000 });
  const after = await p.evaluate(() => ({ n: document.querySelector('.console-number').textContent, focus: document.activeElement.className, issues: [...document.querySelectorAll('.console-issues li')].map((l) => l.textContent) }));
  check(`${lang}: audit command runs the audit, focus stays on its button`, /proof-button/.test(mid.cls) && mid.aria === 'true' && after.n === '0' && /proof-button/.test(after.focus), JSON.stringify({ mid, after }));

  // Meta K also works
  await p.keyboard.press('Meta+k'); await p.waitForTimeout(200);
  check(`${lang}: Meta K opens too`, (await state(p)).open);
  // Ctrl K again closes
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  check(`${lang}: Ctrl K again closes`, !(await state(p)).open);

  // Click on trigger
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.click('.cmdk-trigger'); await p.waitForTimeout(250);
  s = await state(p);
  check(`${lang}: header button opens it`, s.open && s.focus === 'input');
  // Tab stays inside
  await p.keyboard.press('Tab'); const t1 = await p.evaluate(() => document.activeElement.className);
  await p.keyboard.press('Tab'); const t2 = await p.evaluate(() => document.activeElement.className || document.activeElement.tagName);
  await p.keyboard.press('Shift+Tab'); const t3 = await p.evaluate(() => document.activeElement.className);
  check(`${lang}: Tab goes field, close button, and never to the list or the page`, t1 === 'cmdk-close' && !/cmdk-list/.test(t2) && t3 === 'cmdk-close', `${t1} / ${t2} / ${t3}`);
  await p.focus('.cmdk-close'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  s = await state(p);
  check(`${lang}: close button closes, focus back on the header button`, !s.open && s.focus === 'cmdk-trigger', s.focus);

  // Language switch
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  await p.keyboard.type(lang === 'fr' ? 'english' : 'francais'); await p.keyboard.press('Enter'); await p.waitForTimeout(700);
  check(`${lang}: language command switches the page`, (await p.evaluate(() => document.documentElement.lang)) === (lang === 'fr' ? 'en' : 'fr'));

  check(`${lang}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Narrow window: trigger hidden, shortcut still works
{
  const ctx = await b.newContext({ viewport: { width: 1000, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/'); await p.waitForTimeout(500);
  const vis = await p.evaluate(() => getComputedStyle(document.querySelector('.cmdk-trigger')).display);
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200);
  const open = await p.evaluate(() => document.querySelector('dialog.cmdk').open);
  check('1000 px: trigger hidden, shortcut still opens the menu', vis === 'none' && open, vis);
  await ctx.close();
}
// Reduced motion: no open animation needed, works
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.goto(BASE + '/'); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.cmdk-trigger').click()); await p.waitForTimeout(200);
  const r = await p.evaluate(() => { const d = document.querySelector('dialog.cmdk'); const b = d.getBoundingClientRect(); return { open: d.open, l: b.left, r: innerWidth - b.right, h: b.height, vh: innerHeight, closeIcon: getComputedStyle(d.querySelector('.cmdk-close-icon')).display }; });
  check('phone: menu fits the screen with 16 px margins, close shows a cross', r.open && Math.round(r.l) === 16 && Math.round(r.r) === 16 && r.h < r.vh && r.closeIcon === 'block', JSON.stringify(r));
  await ctx.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
