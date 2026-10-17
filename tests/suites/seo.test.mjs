// Sharing and search: every address in the sitemap opens, has its own title,
// description, canonical address and preview image (which exists, 1200 x
// 630), valid structured data; the RSS feed lists every post; the footer
// links to it.
import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const SITE = 'https://mathias-knudsen.vercel.app';
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };
const local = (url) => url.replace(SITE, BASE);
const attr = (html, re) => html.match(re)?.[1];
const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

const sitemap = await (await fetch(BASE + '/sitemap.xml')).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check('sitemap lists 12 addresses', urls.length === 12, String(urls.length));
const robots = await (await fetch(BASE + '/robots.txt')).text();
check('robots.txt points to the sitemap', robots.includes(`Sitemap: ${SITE}/sitemap.xml`));

const titles = new Set(); const images = new Set();
for (const url of urls) {
  const res = await fetch(local(url));
  const html = await res.text();
  const path = url.replace(SITE, '') || '/';
  const title = attr(html, /<title>([^<]+)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]+)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  const ogUrl = attr(html, /<meta property="og:url" content="([^"]+)"/);
  const image = attr(html, /<meta property="og:image" content="([^"]+)"/);
  const alt = attr(html, /<meta property="og:image:alt" content="([^"]+)"/);
  const type = attr(html, /<meta property="og:type" content="([^"]+)"/);
  titles.add(title); images.add(image);
  const img = await fetch(local(image));
  const size = img.ok ? pngSize(Buffer.from(await img.arrayBuffer())) : [0, 0];
  let ld = [];
  try { ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])); } catch (e) { ld = ['invalid ' + e.message]; }
  const ldTypes = ld.map((d) => d['@type'] ?? d['@graph']?.map((g) => g['@type']).join('+'));
  const expectType = path === '/' || path === '/lab' || path === '/blog' ? 'website' : 'article';
  const isPost = path.startsWith('/blog/');
  const ok = res.status === 200 && title && desc && desc.length >= 50 && canonical === url && ogUrl === url && img.ok && size[0] === 1200 && size[1] === 630 && alt && type === expectType
    && ldTypes[0] === 'WebSite+Person' && (!isPost || (ldTypes[1] === 'BlogPosting' && ld[1].image === image && ld[1].datePublished && html.includes('article:published_time'))) && (path !== '/blog' || ldTypes[1] === 'Blog');
  check(`${path}: title, description, canonical, preview ${image.replace(SITE, '')} ${size.join('x')}, ${type}, ${ldTypes.join(' ')}`, ok, ok ? '' : JSON.stringify({ status: res.status, title, canonical, ogUrl, type, alt, ldTypes, size }));
}
check('every page has its own title', titles.size === urls.length, `${titles.size}/${urls.length}`);
check('every page has its own preview image', images.size === urls.length, `${images.size}/${urls.length}`);

// the feed
const rssRes = await fetch(BASE + '/blog/rss.xml');
const rss = await rssRes.text();
const items = [...rss.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<pubDate>([^<]+)<\/pubDate>[\s\S]*?<\/item>/g)];
const posts = urls.filter((u) => u.includes('/blog/'));
check('RSS feed: served as XML, one item per post, each with a date', rssRes.status === 200 && /xml/.test(rssRes.headers.get('content-type')) && items.length === posts.length && items.every(([, link, date]) => posts.includes(link) && !isNaN(Date.parse(date))), `${items.length} items`);
const home = await (await fetch(BASE + '/')).text();
check('every page announces the feed', home.includes('<link rel="alternate" type="application/rss+xml"'));

// the footer, in a browser
const b = await chromium.launch();
for (const lang of ['en', 'fr']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript((lang) => { try { localStorage.setItem('lang', lang); } catch {} }, lang);
  const p = await ctx.newPage();
  await p.goto(BASE + '/blog');
  const f = await p.evaluate(() => { const nav = document.querySelector('.site-footer-nav'); return { label: nav?.getAttribute('aria-label'), links: [...nav.querySelectorAll('a')].map((a) => [a.textContent, a.getAttribute('href'), a.getAttribute('aria-label')]), heights: [...nav.querySelectorAll('a')].map((a) => a.getBoundingClientRect().height) }; });
  const want = lang === 'en' ? ['Footer', 'Work', 'RSS feed of the blog'] : ['Pied de page', 'Projets', 'Flux RSS du blog'];
  check(`${lang} footer: labelled links to work, lab, blog, RSS, contact; 24px tall at least`, f.label === want[0] && f.links.map((l) => l[1]).join() === '/#work,/lab,/blog,/blog/rss.xml,/#contact' && f.links[0][0] === want[1] && f.links[3][2] === want[2] && f.heights.every((h) => h >= 24), JSON.stringify(f));
  await ctx.close();
}
await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
