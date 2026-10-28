// The blog posts known to the whole site: address, date, tags, the page
// they lead to, and title and description in both languages. Small, so the
// home page can show the latest post without loading any article. The
// articles themselves are in posts.js, which adds their bodies.
import { LAB_COUNT } from '../lab/count.js'

export const POST_META = [
  {
    slug: "a-real-globe-on-a-canvas",
    date: "2026-10-15",
    tags: ["Canvas", "JavaScript", "Animation"],
    related: { href: "/lab", en: "Spin the globe in the lab, under Archive", fr: "Faire tourner le globe dans le lab, rubrique Archives" },
    en: {
      title: "A real globe on a canvas",
      description: "How the globe in the lab draws real coastlines on a turning sphere, with a canvas and a little maths.",
    },
    fr: {
      title: "Un vrai globe sur un canvas",
      description: "Comment le globe du lab dessine de vraies côtes sur une sphère qui tourne, avec un canvas et un peu de maths.",
    },
  },
  {
    slug: "two-springs-make-water-slosh",
    date: "2026-09-28",
    tags: ["Animation", "JavaScript", "SVG"],
    related: { href: "/lab", en: "Tilt the test tube in the lab, under Archive", fr: "Pencher le tube à essai dans le lab, rubrique Archives" },
    en: {
      title: "Two springs make water slosh",
      description: "Two springs and a few lines of JavaScript make the water in the lab's test tube feel real.",
    },
    fr: {
      title: "Deux ressorts pour faire clapoter de l'eau",
      description: "Deux ressorts et quelques lignes de JavaScript pour que l'eau du tube à essai du lab paraisse vraie.",
    },
  },
  {
    slug: "live-animations-one-page",
    date: "2026-09-09",
    tags: ["Performance", "CSS", "Animation"],
    related: { href: "/lab", en: `Open the lab: ${LAB_COUNT} live animations`, fr: `Ouvrir le lab : ${LAB_COUNT} animations en direct` },
    en: {
      title: `${LAB_COUNT} live animations on one page, and still fast`,
      description: `How the lab stays fast with ${LAB_COUNT} animations on one page: skip, pause and stop what nobody sees.`,
    },
    fr: {
      title: `${LAB_COUNT} animations en direct sur une page, et toujours rapide`,
      description: `Comment le lab reste rapide avec ${LAB_COUNT} animations sur une page : ignorer, mettre en pause et arrêter ce qu'on ne voit pas.`,
    },
  },
  {
    slug: "motion-that-serves",
    date: "2026-08-20",
    tags: ["Animation", "CSS", "Accessibility"],
    related: { href: "/lab", en: `Open the lab: ${LAB_COUNT} animations that follow these rules`, fr: `Ouvrir le lab : ${LAB_COUNT} animations qui suivent ces règles` },
    en: {
      title: "When to animate, and when not to",
      description: "The few simple rules I follow before adding an animation to a page.",
    },
    fr: {
      title: "Quand animer, et quand ne pas le faire",
      description: "Les quelques règles simples que je suis avant d'ajouter une animation à une page.",
    },
  },
  {
    slug: "scroll-driven-animations",
    date: "2026-08-03",
    tags: ["CSS", "Animation", "Performance"],
    related: { href: "/projects/trimension-studio", en: "See both animations live on the Trimension page", fr: "Voir les deux animations en direct sur la page Trimension" },
    en: {
      title: "Scroll animations without JavaScript",
      description: "How I rebuilt a scroll effect from 2023 so the browser plays it by itself, with a fallback for the rest.",
    },
    fr: {
      title: "Des animations au défilement sans JavaScript",
      description: "Comment j'ai refait un effet au défilement de 2023 pour que le navigateur le joue tout seul, avec une solution de secours.",
    },
  },
  {
    slug: "ai-suggests-people-decide",
    date: "2026-07-15",
    tags: ["AI", "Accessibility", "Product design"],
    related: { href: "/projects/accesseu", en: "Read the AccessEU case study", fr: "Lire l'étude de cas AccessEU" },
    en: {
      title: "AI suggests, people decide",
      description: "Why the AI in my Shopify app only suggests, and a person always decides.",
    },
    fr: {
      title: "L'IA propose, l'humain décide",
      description: "Pourquoi l'IA de mon app Shopify ne fait que proposer, et une personne décide toujours.",
    },
  },
]
