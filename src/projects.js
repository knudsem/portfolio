// Addresses of the pages. Each project, the lab, the blog and each post has
// its own URL, so a page can be shared and opened directly. The build writes
// one HTML file per page with its own title and link preview
// (scripts/prerender.mjs).

export const SITE_URL = 'https://mathias-knudsen.vercel.app'

export const PROJECT_SLUGS = {
  accesseu: 'accesseu',
  interdyn: 'interdyn-dealer-portal',
  'project-au': 'pro-ject-audio-australia',
  'project-global': 'pro-ject-audio-systems',
  exclusive: 'exclusive-construction',
  trimension: 'trimension-studio',
}

export const projectPath = (id) => `/projects/${PROJECT_SLUGS[id]}`

// The pages that are not projects
export const LAB_PATH = '/lab'
export const BLOG_PATH = '/blog'
export const postPath = (slug) => `${BLOG_PATH}/${slug}`

// Which page this address is: the home page, a project, the lab, the blog
// or one of its posts (the blog checks the post exists), or nothing known.
export function parseRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/index.html') return { name: 'home' }
  if (path === LAB_PATH) return { name: 'lab' }
  if (path === BLOG_PATH) return { name: 'blog' }
  const post = path.match(/^\/blog\/([a-z0-9-]+)$/)
  if (post) return { name: 'post', slug: post[1] }
  const match = path.match(/^\/projects\/([a-z0-9-]+)$/)
  const id = match && Object.keys(PROJECT_SLUGS).find((key) => PROJECT_SLUGS[key] === match[1])
  return id ? { name: 'project', id } : { name: 'notfound' }
}

// Screens of the projects come in two widths: name.webp (1440px) and
// name-800.webp for small screens. The sizes say how wide each kind is shown
// (see .case-hero and .case-shots in App.css), so a phone downloads the small
// one; the prerendered preload uses the same values, so it is reused.
export const SCREEN_SIZES = { full: '(min-width: 1240px) 1160px, 100vw', half: '(min-width: 1000px) 570px, 100vw' }
export const screenSrcSet = (img) => (img.width === 1440 ? `${img.src.replace(/\.webp$/, '-800.webp')} 800w, ${img.src} 1440w` : undefined)
