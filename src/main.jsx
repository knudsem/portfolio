import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { detectLanguage } from './language'
import { SHORTCUT } from './platform'

// Scroll reveal animations, set before the first paint so nothing flickers.
// Skipped for visitors who asked their system to reduce motion.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal-ready')
}

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
