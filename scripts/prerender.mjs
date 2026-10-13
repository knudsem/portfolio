// Runs after `vite build`. Gives every project its own HTML file, so a
// project address opens directly and shows its own title and link preview
// (LinkedIn, WhatsApp, Slack, search results). The page itself is drawn by
// the same app script as the home page.
// Also writes the pages of the lab, the blog and its posts, 404.html (any
// unknown address) and sitemap.xml.
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

// Replaces one tag of the template, and fails loudly if it is not there,
// so a change to index.html cannot silently break the previews.
function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in index.html`)
  return html.replace(pattern, replacement)
}

function page({ title, description, url, image, imageAlt, noindex = false, preload }) {
  let html = template
  // These pages are light: the first paint waits for the app script, so the
  // page shows complete from its first frame and the morph from the clicked
  // card finds the cover and the title (main.jsx renders them at once).
  html = replaceTag(html, /<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script type="module" crossorigin src="$1" blocking="render"></script>')
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`)
  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escape(title)}" />`)
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escape(description)}" />`)
  html = replaceTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${noindex ? 'website' : 'article'}" />`)
  if (image) {
    html = replaceTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
    html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${escape(imageAlt)}" />`)
  }
  // The screen that leads a project page starts downloading with the HTML
  if (preload) {
    html = replaceTag(html, /<\/head>/, `    <link rel="preload" as="image" href="${preload}" fetchpriority="high" />\n  </head>`)
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
  const ogFile = `og/${slug}.png`
  const hasImage = fs.existsSync(path.join(DIST, ogFile))
  write(path.join(DIST, 'projects', slug, 'index.html'), page({
    title: en.case.title.replace('{title}', project.title),
    description: project.summary,
    url,
    image: hasImage ? `${SITE_URL}/${ogFile}` : null,
    imageAlt: `${project.title}, ${project.type.toLowerCase()}. A project by Mathias Knudsen.`,
    preload: project.gallery?.find((img) => !img.phone)?.src,
  }))
  urls.push(url)
}

// The lab
write(path.join(DIST, LAB_PATH.slice(1), 'index.html'), page({
  title: en.lab.title,
  description: en.lab.meta,
  url: `${SITE_URL}${LAB_PATH}`,
}))
urls.push(`${SITE_URL}${LAB_PATH}`)

// The blog and each post
write(path.join(DIST, BLOG_PATH.slice(1), 'index.html'), page({
  title: en.blog.title,
  description: en.blog.meta,
  url: `${SITE_URL}${BLOG_PATH}`,
}))
urls.push(`${SITE_URL}${BLOG_PATH}`)
for (const post of POSTS) {
  const url = `${SITE_URL}${postPath(post.slug)}`
  write(path.join(DIST, postPath(post.slug).slice(1), 'index.html'), page({
    title: en.case.title.replace('{title}', post.en.title),
    description: post.en.description,
    url,
  }))
  urls.push(url)
}

write(path.join(DIST, '404.html'), page({
  title: en.case.title.replace('{title}', en.case.not_found_title),
  description: en.case.not_found_text,
  noindex: true,
}))

write(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`)

console.log(`prerender: ${en.projects.length} project pages, the lab, the blog and ${POSTS.length} posts, 404.html, sitemap.xml (${urls.length} addresses)`)
