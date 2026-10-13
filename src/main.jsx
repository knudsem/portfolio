import { StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { detectLanguage } from './language'
import { SHORTCUT } from './platform'
import { handlePageReveal, resetNames } from './viewTransitions'
import { parseRoute } from './projects'

// Scroll reveal animations, set before the first paint so nothing flickers.
// Skipped for visitors who asked their system to reduce motion.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal-ready')
}

// Smooth scrolling (App.css) is for clicks on links to a section. It stays
// off until the visitor clicks, types or scrolls, so the browser's own jumps
// (going back to a page, opening a link to a section) are instant instead of
// a long glide from the top of the page.
const html = document.documentElement
const INTERACTIONS = ['pointerdown', 'keydown', 'wheel', 'touchstart']
const allowSmoothScroll = () => {
  html.style.scrollBehavior = ''
  for (const type of INTERACTIONS) window.removeEventListener(type, allowSmoothScroll, true)
}
html.style.scrollBehavior = 'auto'
for (const type of INTERACTIONS) window.addEventListener(type, allowSmoothScroll, { capture: true, passive: true })

// A note for the developers who open the console.
const CONSOLE_NOTE = {
  en: [
    'Welcome backstage.',
    'This site is handmade with React and Vite: no UI kit, no template, no animation library. The physics in the headline, the project illustrations and the command menu ({keys}) are all custom code.',
    "Like what you see? Let's work together: https://mathias-knudsen.vercel.app/#contact",
  ],
  fr: [
    'Bienvenue dans les coulisses.',
    "Ce site est fait main avec React et Vite : sans kit d'interface, sans template, sans librairie d'animation. La physique du titre, les illustrations des projets et le menu de commandes ({keys}) sont du code sur mesure.",
    'Ça vous plaît ? Travaillons ensemble : https://mathias-knudsen.vercel.app/#contact',
  ],
}
const [hello, ...note] = CONSOLE_NOTE[detectLanguage()]
console.log(
  `%c MK %c ${hello}\n\n${note.join('\n\n').replace('{keys}', SHORTCUT.join(' '))}`,
  'background:#c5f04a;color:#0b0b10;font-weight:700;border-radius:4px;padding:2px 4px',
  'font-weight:600',
)

// Project pages are rendered at once, while their HTML holds the first paint
// for this script (blocking="render", added by scripts/prerender.mjs): they
// show complete from their first frame, so the morph from the clicked card
// finds the cover and the title. The home page, much bigger, renders as
// usual on a first visit so its first paint is not held back. Coming back to
// it (back button, reload), it is rendered at once too: the browser puts the
// visitor back where they were only if the page is already tall enough.
const root = createRoot(document.getElementById('root'))
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
const arrival = performance.getEntriesByType?.('navigation')?.[0]?.type
if (parseRoute(window.location.pathname).name === 'home' && arrival === 'navigate') root.render(app)
else flushSync(() => root.render(app))
resetNames()
window.addEventListener('pagereveal', handlePageReveal)
