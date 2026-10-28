// The blog's posts, in both languages: their metadata (meta.js) and their
// bodies. Plain data (no JSX), so the build can read each post for its own
// page (scripts/prerender.mjs). A body is a list of blocks: ['p', text],
// ['h2', text], ['ul', [items]], ['code', lang, source, caption?]. Text may
// hold `code`, **bold** and [links](/path).
import { POST_META } from './meta.js'

const BODIES = [
  {
    slug: 'a-real-globe-on-a-canvas',
    en: {
      body: [
        ['p', "With the flat map, the continents never curved at the edges. You could tell right away."],
        ['p', "The hard part was cutting each coast cleanly where it goes behind the globe."],
        ['p', "You can spin it with your mouse or your finger."],
      ],
    },
    fr: {
      body: [
        ['p', "Avec la carte plate, les continents ne se courbaient jamais sur les bords. Ça se voyait tout de suite."],
        ['p', "Le plus dur a été de bien couper chaque côte quand elle passe derrière le globe."],
        ['p', "On peut le faire tourner à la souris ou au doigt."],
      ],
    },
  },
  {
    slug: 'two-springs-make-water-slosh',
    en: {
      body: [
        ['p', "It takes two springs: one for the glass, and a slower one for the water."],
        ['p', "The water stays level, sloshes a little, then settles. That small delay is what makes it feel real."],
      ],
    },
    fr: {
      body: [
        ['p', "Il suffit de deux ressorts : un pour le verre, et un plus lent pour l'eau."],
        ['p', "L'eau reste à plat, clapote un peu, puis se pose. C'est ce petit retard qui rend l'effet réaliste."],
      ],
    },
  },
  {
    slug: 'live-animations-one-page',
    en: {
      body: [
        ['p', "Each animation pauses when it leaves the screen and starts again when it comes back."],
        ['p', "So the page still loads fast, even on a phone."],
      ],
    },
    fr: {
      body: [
        ['p', "Chaque animation se met en pause quand elle sort de l'écran, et repart quand elle revient."],
        ['p', "Résultat : la page charge toujours vite, même sur un téléphone."],
      ],
    },
  },
  {
    slug: 'motion-that-serves',
    en: {
      body: [
        ['p', "An animation should help: show where something comes from, confirm a click, or guide the eye. If it does none of that, I take it out."],
        ['p', "I keep it short, let people pause anything that loops, and respect the setting that asks for less motion."],
      ],
    },
    fr: {
      body: [
        ['p', "Une animation doit aider : montrer d'où vient un élément, confirmer un clic ou guider le regard. Si elle ne fait rien de tout ça, je l'enlève."],
        ['p', "Je la garde courte, on peut mettre en pause tout ce qui tourne en boucle, et je respecte le réglage qui demande moins de mouvement."],
      ],
    },
  },
  {
    slug: 'scroll-driven-animations',
    en: {
      body: [
        ['p', "In 2023, these effects needed JavaScript to follow the page."],
        ['p', "Today, CSS can do it alone: you tell an animation to follow the scroll, and the browser does the rest."],
      ],
    },
    fr: {
      body: [
        ['p', "En 2023, ces effets avaient besoin de JavaScript pour suivre la page."],
        ['p', "Aujourd'hui, le CSS sait le faire seul : on dit à une animation de suivre le défilement, et le navigateur fait le reste."],
      ],
    },
  },
  {
    slug: 'ai-suggests-people-decide',
    en: {
      body: [
        ['p', "The AI only suggests. A person reads each description, fixes it if needed, then decides to publish it."],
        ['p', "A wrong description is worse than none at all."],
      ],
    },
    fr: {
      body: [
        ['p', "L'IA ne fait que proposer. Une personne relit chaque description, la corrige si besoin, puis décide de la publier."],
        ['p', "Une mauvaise description est pire que pas de description du tout."],
      ],
    },
  },
]

export const POSTS = POST_META.map((meta) => {
  const { en, fr } = BODIES.find((post) => post.slug === meta.slug)
  return { ...meta, en: { ...meta.en, body: en.body }, fr: { ...meta.fr, body: fr.body } }
})

export const postBySlug = (slug) => POSTS.find((post) => post.slug === slug)

// Words in a post, for its reading time (about 220 words a minute)
export function readingMinutes(body) {
  const words = body.flatMap(([type, a, b]) => (type === 'ul' ? a : type === 'code' ? [b] : [a])).join(' ').split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}
