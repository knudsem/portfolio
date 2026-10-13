import fs from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `vite preview` answers like Vercel does (see vercel.json): a project
// address gets its own page, an unknown address the 404 page.
const vercelLikePreview = {
  name: 'vercel-like-preview',
  configurePreviewServer(server) {
    const dist = new URL('./dist/', import.meta.url)
    server.middlewares.use((req, res, next) => {
      const { pathname } = new URL(req.url, 'http://localhost')
      // A page written by scripts/prerender.mjs: /lab, /blog/a-post, /projects/a-project
      const page = pathname.match(/^\/((?:projects\/|blog\/)?[a-z0-9-]+)\/?$/)
      if (page && fs.existsSync(new URL(`${page[1]}/index.html`, dist))) {
        req.url = `/${page[1]}/index.html`
        return next()
      }
      const known = pathname === '/' || pathname === '/index.html' || fs.existsSync(new URL(`.${decodeURIComponent(pathname)}`, dist))
      if (known) return next()
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')
      return res.end(fs.readFileSync(new URL('404.html', dist)))
    })
  },
}

export default defineConfig({
  plugins: [react(), vercelLikePreview],
  build: {
    // axe-core (the live accessibility audit) is a large chunk on purpose:
    // it is only downloaded when a visitor clicks "Audit this page".
    chunkSizeWarningLimit: 800,
  },
})
