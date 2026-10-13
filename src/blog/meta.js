// The blog posts known to the whole site: address, date, tags, the page
// they lead to, and title and description in both languages. Small, so the
// home page can show the latest post without loading any article. The
// articles themselves are in posts.js, which adds their bodies.
import { LAB_COUNT } from '../lab/count.js'

export const POST_META = [
  {
    slug: "motion-that-serves",
    date: "2026-10-13",
    tags: ["Animation", "CSS", "Accessibility"],
    related: { href: "/lab", en: `Open the lab: ${LAB_COUNT} animations that follow these rules`, fr: `Ouvrir le lab : ${LAB_COUNT} animations qui suivent ces règles` },
    en: {
      title: "Motion that serves: eight rules for interface animation",
      description: "The eight rules I check every interface animation against: purpose, timing, easing, performance, reduced motion, pausing, resting off screen, and never hiding the content.",
    },
    fr: {
      title: "Un mouvement qui sert : huit règles pour animer une interface",
      description: "Les huit règles auxquelles je confronte chaque animation d'interface : utilité, durée, courbes, performance, mouvement réduit, pause, repos hors écran, et ne jamais cacher le contenu.",
    },
  },
  {
    slug: "scroll-driven-animations",
    date: "2026-10-13",
    tags: ["CSS", "Animation", "Performance"],
    related: { href: "/projects/trimension-studio", en: "See both animations live on the Trimension page", fr: "Voir les deux animations en direct sur la page Trimension" },
    en: {
      title: "Scroll-driven animations: rebuilding a 2023 effect with today's CSS",
      description: "How I rebuilt two scroll animations from 2023 with view timelines: no scroll listener, the browser plays the keyframes from the scroll position, and a few lines of fallback for the rest.",
    },
    fr: {
      title: "Animations pilotées par le défilement : refaire un effet de 2023 avec le CSS d'aujourd'hui",
      description: "Comment j'ai refait deux animations au défilement de 2023 avec des view timelines : aucun écouteur de défilement, le navigateur joue les keyframes à partir de la position, et quelques lignes de secours pour les autres.",
    },
  },
  {
    slug: "ai-suggests-people-decide",
    date: "2026-10-13",
    tags: ["AI", "Accessibility", "Product design"],
    related: { href: "/projects/accesseu", en: "Read the AccessEU case study", fr: "Lire l'étude de cas AccessEU" },
    en: {
      title: "AI suggests, people decide: designing an AI feature you can trust",
      description: "AccessEU uses AI in one place: describing product photos for screen reader users. Why the model never writes to the store itself, and the five rules behind that choice.",
    },
    fr: {
      title: "L'IA propose, l'humain décide : concevoir une fonction d'IA digne de confiance",
      description: "AccessEU utilise l'IA à un seul endroit : décrire les photos produit pour les personnes qui utilisent un lecteur d'écran. Pourquoi le modèle n'écrit jamais lui-même dans la boutique, et les cinq règles derrière ce choix.",
    },
  },
]
