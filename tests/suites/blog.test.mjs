// The blog: list, posts in both languages, widths, accessibility, unknown
// address, prerendered pages, sitemap
import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE, PRIVATE, skipPrivate } from '../lib.mjs';
import { POST_META } from '../../src/blog/meta.js';
const SLUGS = POST_META.map((post) => post.slug);
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const axeRun = async (p) => { await p.addScriptTag({ content: AXE }); return p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)); };

for (const [lang, locale] of [['fr', 'fr-FR'], ['en', 'en-GB']]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  await p.goto(`${BASE}/blog`); await p.waitForTimeout(700);
  const idx = await p.evaluate(() => ({ title: document.title, h1: document.querySelector('h1')?.textContent, cards: [...document.querySelectorAll('.blog-card-link')].map((a) => a.getAttribute('href')), current: document.querySelector('.header-link[aria-current="page"]')?.textContent, text: document.body.innerText }));
  check(`${lang}: blog list, ${SLUGS.length} posts linked, Blog current`, idx.title === 'Blog | Mathias Knudsen' && idx.h1 === 'Blog' && idx.cards.join() === SLUGS.map((s) => `/blog/${s}`).join() && idx.current === 'Blog', JSON.stringify({ ...idx, text: undefined }));
  const axIdx = await axeRun(p);
  check(`${lang}: blog list, axe finds nothing`, axIdx.length === 0, axIdx.join(' || '));
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`); await p.waitForTimeout(700);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 450) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(40); }
    const post = await p.evaluate(() => ({
      title: document.title, h1: document.querySelector('h1')?.textContent,
      codes: document.querySelectorAll('.post-body .case-code').length,
      spans: document.querySelectorAll('.post-body pre span').length,
      related: document.querySelector('.post-related')?.getAttribute('href'),
      others: document.querySelectorAll('.post-more .blog-card').length,
      current: document.querySelector('.header-link[aria-current="page"]')?.textContent,
      time: document.querySelector('time')?.getAttribute('datetime'),
      text: document.body.innerText,
      // plain spaces before French signs, outside code (code is never touched)
      nbsp: [...document.querySelectorAll('.post-body > p, .post-body > h2, .post-body li, .post-body figcaption')].map((e) => e.textContent).join(' ').match(/ [:;?!%»]/g)?.length ?? 0,
      textOnly: [...document.querySelectorAll('.post-body .case-code-lang')].every((e) => e.textContent === 'Text'),
    }));
    check(`${lang} ${slug}: title, code coloured, related link, ${SLUGS.length - 1} other posts, Blog current`, post.title.replace(/\u00a0/g, ' ') === `${post.h1.replace(/\u00a0/g, ' ')} | Mathias Knudsen` && post.codes >= 1 && (post.textOnly || post.spans > 5) && !!post.related && post.others === SLUGS.length - 1 && post.current === 'Blog' && post.time === POST_META.find((meta) => meta.slug === slug).date, JSON.stringify({ ...post, text: undefined }));
    if (lang === 'fr') check(`fr ${slug}: no line can start with : ; ? ! % or »`, post.nbsp === 0, `${post.nbsp} plain spaces before signs`);
    check(`${lang} ${slug}: no long dashes`, !/[\u2013\u2014]/.test(post.text));
    if (PRIVATE) check(`${lang} ${slug}: nothing about the location or the team`, !PRIVATE.test(post.text));
    else skipPrivate(`${lang} ${slug}: nothing about the location or the team`);
    const ax = await axeRun(p);
    check(`${lang} ${slug}: axe finds nothing`, ax.length === 0, ax.join(' || '));
  }
  check(`${lang}: no errors or warnings`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// widths
for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800, locale: 'fr-FR' });
  const over = [];
  for (const path of ['/blog', ...SLUGS.map((s) => `/blog/${s}`)]) {
    await p.goto(`${BASE}${path}`); await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ page: document.documentElement.scrollWidth > innerWidth, code: [...document.querySelectorAll('.post-body :not(pre) > code')].filter((c) => c.getBoundingClientRect().right > document.querySelector('.post-body').getBoundingClientRect().right + 1).map((c) => c.textContent) }));
    if (r.page || r.code.length) over.push(`${path} ${r.code.join(',')}`);
  }
  check(`${w}px: no sideways scrolling, inline code stays inside the column`, over.length === 0, over.join(' | '));
  await p.close();
}

// unknown post, prerendered pages, sitemap, palette
{
  const res = await fetch(`${BASE}/blog/nope`);
  check('unknown post: 404', res.status === 404);
  const p = await b.newPage({ locale: 'en-GB' });
  await p.goto(`${BASE}/blog/nope`); await p.waitForTimeout(500);
  const nf = await p.evaluate(() => document.querySelector('h1')?.textContent);
  check('unknown post: the page says it does not exist', nf === 'Page not found', nf);
  for (const slug of SLUGS) {
    const html = await (await fetch(`${BASE}/blog/${slug}`)).text();
    const ok = html.includes(`<link rel="canonical" href="https://mathias-knudsen.vercel.app/blog/${slug}" />`) && /<title>[^<]+ \| Mathias Knudsen<\/title>/.test(html) && html.includes('<meta property="og:type" content="article" />');
    check(`prerendered ${slug}: own title, address, article type`, ok);
  }
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  check(`sitemap lists the blog and its ${SLUGS.length} posts`, ['/blog', ...SLUGS.map((s) => `/blog/${s}`)].every((path) => sitemap.includes(`<loc>https://mathias-knudsen.vercel.app${path}</loc>`)));
  await p.goto(`${BASE}/`); await p.waitForTimeout(500);
  await p.keyboard.press('Control+k'); await p.waitForTimeout(300);
  const cmds = await p.evaluate(() => [...document.querySelectorAll('[role=option]')].map((o) => o.textContent));
  check('palette: Lab and Blog are there', cmds.some((c) => c.startsWith('Lab')) && cmds.some((c) => c.startsWith('Blog')), cmds.slice(0, 7).join(' | '));
  await p.close();
}
console.log(fail ? `${fail} FAILED` : 'all passed');
await b.close();
