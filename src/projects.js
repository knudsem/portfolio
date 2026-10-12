// Addresses of the project pages. Each project has its own URL, so a page
// can be shared and opened directly. The build writes one HTML file per
// project with its own title and link preview (scripts/prerender.mjs).

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

// Which page this address is: the home page, a project, or nothing known.
export function parseRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/index.html') return { name: 'home' }
  const match = path.match(/^\/projects\/([a-z0-9-]+)$/)
  const id = match && Object.keys(PROJECT_SLUGS).find((key) => PROJECT_SLUGS[key] === match[1])
  return id ? { name: 'project', id } : { name: 'notfound' }
}
