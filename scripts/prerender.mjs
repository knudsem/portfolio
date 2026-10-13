// Runs after `vite build`. Gives every project its own HTML file, so a
// project address opens directly and shows its own title and link preview
// (LinkedIn, WhatsApp, Slack, search results). The page itself is drawn by
// the same app script as the home page.
// Also writes the pages of the lab, the blog and its posts, 404.html (any
// unknown address), sitemap.xml and the blog's RSS feed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import translations from '../src/i18n.js'
import { PROJECT_SLUGS, SITE_URL, projectPath, LAB_PATH, BLOG_PATH, postPath } from '../src/projects.js'
import { POSTS } from '../src/blog/posts.js'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const en = translations.en

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const AUTHOR = { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Mathias Knudsen', url: `${SITE_URL}/` }

// The link preview image of a page, if one was made for it (public/og)
const ogImage = (name) => {
  const file = `og/${name}.png`
  return fs.existsSync(path.join(DIST, file)) ? `${SITE_URL}/${file}` : null
}

// Structured data for search engines. < is escaped, so no text can close
// the script tag.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c')}</script>`

// Replaces one tag of the template, and fails loudly if it is not there,
// so a change to index.html cannot silently break the previews.
function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in index.html`)
  return html.replace(pattern, replacement)
}

// head: extra tags for this page only, added at the end of <head>
function page({ title, description, url, image, imageAlt, type = 'article', noindex = false, head = [] }) {
  let html = template
  // These pages are light: the first paint waits for the app script, so the
  // page shows complete from its first frame and the morph from the clicked
  // card finds the cover and the title (main.jsx renders them at once).
  html = replaceTag(html, /<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script type="module" crossorigin src="$1" blocking="render"></script>')
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`)
  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escape(title)}" />`)
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escape(description)}" />`)
  html = replaceTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
  if (image) {
    html = replaceTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
    html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${escape(imageAlt)}" />`)
  }
  if (head.length) {
    html = replaceTag(html, /<\/head>/, `${head.map((tag) => `    ${tag}\n`).join('')}  </head>`)
  }
  if (noindex) {
    html = replaceTag(html, /\s*<link rel="canonical" href="[^"]*" \/>/, '\n    <meta name="robots" content="noindex" />')
    html = replaceTag(html, /\s*<meta property="og:url" content="[^"]*" \/>/, '')
  } else {
    html = replaceTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    html = replaceTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
  }
  return html
}

const write = (file, html) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

const urls = [`${SITE_URL}/`]
for (const project of en.projects) {
  const slug = PROJECT_SLUGS[project.id]
  if (!slug) throw new Error(`prerender: no address for project ${project.id}`)
  const url = `${SITE_URL}${projectPath(project.id)}`
  // The screen that leads a project page starts downloading with the HTML
  const hero = project.gallery?.find((img) => !img.phone)?.src
  write(path.join(DIST, 'projects', slug, 'index.html'), page({
    title: en.case.title.replace('{title}', project.title),
    description: project.summary,
    url,
    image: ogImage(slug),
    imageAlt: `${project.title}, ${project.type.toLowerCase()}. A project by Mathias Knudsen.`,
    head: hero ? [`<link rel="preload" as="image" href="${hero}" fetchpriority="high" />`] : [],
  }))
  urls.push(url)
}

// The lab
write(path.join(DIST, LAB_PATH.slice(1), 'index.html'), page({
  title: en.lab.title,
  description: en.lab.meta,
  url: `${SITE_URL}${LAB_PATH}`,
  type: 'website',
  image: ogImage('lab'),
  imageAlt: 'The lab: interface animations by Mathias Knudsen, each one live with its code.',
}))
urls.push(`${SITE_URL}${LAB_PATH}`)

// The blog and each post, newest first
const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))
const blogUrl = `${SITE_URL}${BLOG_PATH}`
write(path.join(DIST, BLOG_PATH.slice(1), 'index.html'), page({
  title: en.blog.title,
  description: en.blog.meta,
  url: blogUrl,
  type: 'website',
  image: ogImage('blog'),
  imageAlt: 'The blog of Mathias Knudsen: notes on motion, accessibility and building with AI.',
  head: [jsonLd({
    '@type': 'Blog',
    name: en.blog.title,
    description: en.blog.meta,
    url: blogUrl,
    inLanguage: 'en',
    author: AUTHOR,
    blogPost: posts.map((post) => ({ '@type': 'BlogPosting', headline: post.en.title, url: `${SITE_URL}${postPath(post.slug)}`, datePublished: post.date })),
  })],
}))
urls.push(blogUrl)
for (const post of posts) {
  const url = `${SITE_URL}${postPath(post.slug)}`
  const image = ogImage(`blog-${post.slug}`)
  write(path.join(DIST, postPath(post.slug).slice(1), 'index.html'), page({
    title: en.case.title.replace('{title}', post.en.title),
    description: post.en.description,
    url,
    image,
    imageAlt: `${post.en.title}. A post by Mathias Knudsen.`,
    head: [
      `<meta property="article:published_time" content="${post.date}" />`,
      jsonLd({
        '@type': 'BlogPosting',
        headline: post.en.title,
        description: post.en.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: 'en',
        keywords: post.tags.join(', '),
        url,
        mainEntityOfPage: url,
        ...(image && { image }),
        author: AUTHOR,
      }),
    ],
  }))
  urls.push(url)
}

// The feed, for readers that follow the blog (newest first)
const xml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const rssDate = (date) => new Date(`${date}T09:00:00Z`).toUTCString()
write(path.join(DIST, BLOG_PATH.slice(1), 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(en.blog.title)}</title>
    <link>${blogUrl}</link>
    <description>${xml(en.blog.meta)}</description>
    <language>en</language>
    <atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${rssDate(posts[0].updated ?? posts[0].date)}</lastBuildDate>
${posts.map((post) => {
  const url = `${SITE_URL}${postPath(post.slug)}`
  return `    <item>
      <title>${xml(post.en.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rssDate(post.date)}</pubDate>
      <description>${xml(post.en.description)}</description>
${post.tags.map((tag) => `      <category>${xml(tag)}</category>`).join('\n')}
    </item>`
}).join('\n')}
  </channel>
</rss>
`)

write(path.join(DIST, '404.html'), page({
  title: en.case.title.replace('{title}', en.case.not_found_title),
  description: en.case.not_found_text,
  noindex: true,
  type: 'website',
}))

write(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`)

console.log(`prerender: ${en.projects.length} project pages, the lab, the blog and ${POSTS.length} posts, 404.html, sitemap.xml (${urls.length} addresses), blog/rss.xml`)
