// The three case studies without screens (Pro-Ject Audio Australia, Pro-Ject
// Audio Systems, Exclusive Construction): their sections in both languages,
// accessibility, phone width, the odd last detail spanning its row, and the
// globe showing the live site's two languages.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { BASE, AXE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const norm = (s) => s.replace(/ /g, ' ');

const PAGES = [
  { slug: 'pro-ject-audio-australia', did: 6, highlights: 4, link: 'https://www.projectaudio.com.au/', media: 'project-au', screens: 6, phones: 2 },
  { slug: 'pro-ject-audio-systems', did: 4, highlights: 4, link: 'https://www.project-audio.com/en/', media: 'project-global', screens: 6, phones: 2 },
  { slug: 'exclusive-construction', did: 6, highlights: 4, link: 'https://exclusiveconstruction.com.au/', media: 'exclusive', screens: 7, phones: 2 },
];
const H2 = {
  en: (hl) => ['The project', 'What I did', 'Details', 'Screens', ...(hl ? ['Details that matter'] : []), 'Have a similar project?'],
  fr: (hl) => ['Le projet', "Ce que j'ai fait", 'En bref', 'En images', ...(hl ? ['Les détails qui comptent'] : []), 'Un projet similaire ?'],
};

for (const lang of ['en', 'fr']) {
  for (const width of [1440, 375]) {
    const ctx = await b.newContext({ viewport: { width, height: 900 } });
    await ctx.addInitScript((lang) => { try { localStorage.setItem('lang', lang); } catch {} }, lang);
    const p = await ctx.newPage();
    const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
    for (const page of PAGES) {
      await p.goto(`${BASE}/projects/${page.slug}`); await p.waitForTimeout(500);
      const info = await p.evaluate(() => ({
        h2: [...document.querySelectorAll('main h2')].map((h) => h.textContent).filter((t) => !/^(Next project|Projet suivant)$/.test(t)),
        story: [...document.querySelectorAll('.case-story p')].map((x) => x.textContent.length),
        did: document.querySelectorAll('.case-did li, .case-list li').length,
        highlights: [...document.querySelectorAll('.case-highlights li')].map((li) => ({ title: li.querySelector('h3, h4')?.textContent, w: li.getBoundingClientRect().width })),
        hlWidth: document.querySelector('.case-highlights')?.getBoundingClientRect().width,
        link: document.querySelector('.case-visit')?.getAttribute('href'),
        over: document.documentElement.scrollWidth - innerWidth,
      }));
      const label = `${lang} ${width} ${page.slug}`;
      check(`${label}: sections in order`, JSON.stringify(info.h2.map(norm)) === JSON.stringify(H2[lang](page.highlights)), info.h2.join(' | '));
      check(`${label}: two story paragraphs, ${page.did} things done, ${page.highlights} details, live site link`, info.story.length === 2 && info.story.every((n) => n > 120) && info.did === page.did && info.highlights.length === page.highlights && info.highlights.every((h) => h.title) && info.link === page.link, JSON.stringify({ story: info.story, did: info.did, hl: info.highlights.length, link: info.link }));
      if (page.highlights % 2 === 1 && width === 1440) {
        const last = info.highlights.at(-1).w, first = info.highlights[0].w;
        check(`${label}: the odd last detail spans the row`, Math.abs(last - info.hlWidth) < 2 && first < info.hlWidth / 2 + 2, `${first} / ${last} / ${info.hlWidth}`);
      }
      check(`${label}: no sideways scroll`, info.over === 0, String(info.over));
      if (width === 1440) {
        await p.addScriptTag({ content: AXE });
        const v = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((x) => `${x.id}: ${x.nodes.length}`));
        check(`${label}: axe finds nothing`, v.length === 0, v.join(', '));
      }
      const g = await p.evaluate(async () => {
        for (const img of document.querySelectorAll('.case-hero img, .case-shots img')) { img.loading = 'eager'; if (!img.complete) await new Promise((r) => { img.onload = img.onerror = r; }); }
        const imgs = [...document.querySelectorAll('.case-hero img, .case-shots img')];
        return { hero: document.querySelector('.case-hero img')?.getAttribute('src'), screens: imgs.filter((i) => !i.closest('.case-phone')).length, phones: document.querySelectorAll('.case-phone img').length, loaded: imgs.every((i) => i.naturalWidth > 0), alts: imgs.every((i) => i.alt.length > 15), captions: document.querySelectorAll('.case-hero figcaption, .case-shots figcaption').length, cover: !!document.querySelector('.case-cover') };
      });
      check(`${label}: opens on the live site (${g.hero}), ${page.screens} screens and ${page.phones} phones, all loaded, described and captioned`, g.hero === `/media/${page.media}/${page.media === 'project-global' ? 'debut-evo-2' : 'home'}.webp` && g.screens === page.screens && g.phones === page.phones && g.loaded && g.alts && g.captions === page.screens + 1 && !g.cover, JSON.stringify(g));
    }
    check(`${lang} ${width}: no console errors`, errors.length === 0, errors.join(' | '));
    await ctx.close();
  }
}
// the home page card of Pro-Ject Audio Systems: the globe with the live site's two languages
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + '/'); await p.waitForTimeout(500);
  const chips = await p.evaluate(() => [...document.querySelectorAll('.project-card .cv-lang-text')].map((t) => t.textContent));
  check("home card: the globe shows the live site's languages", chips.join() === 'EN,DE', chips.join());
  await p.close();
}
await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
