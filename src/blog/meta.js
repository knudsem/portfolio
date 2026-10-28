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
      description: "My old globe was a flat map sliding behind a circle. The new one draws real coastlines on a sphere.",
    },
    fr: {
      title: "Un vrai globe sur un canvas",
      description: "Mon ancien globe était une carte plate qui glissait derrière un rond. Le nouveau dessine de vraies côtes sur une sphère.",
    },
  },
  {
    slug: "two-springs-make-water-slosh",
    date: "2026-09-28",
    tags: ["Animation", "JavaScript", "SVG"],
    related: { href: "/lab", en: "Tilt the test tube in the lab, under Archive", fr: "Pencher le tube à essai dans le lab, rubrique Archives" },
    en: {
      title: "Two springs make water slosh",
      description: "The test tube in the lab tilts towards your mouse, and the water follows a little late, like real water.",
    },
    fr: {
      title: "Deux ressorts pour faire clapoter de l'eau",
      description: "Le tube à essai du lab penche vers la souris, et l'eau suit avec un peu de retard, comme de la vraie eau.",
    },
  },
  {
    slug: "live-animations-one-page",
    date: "2026-09-09",
    tags: ["Performance", "CSS", "Animation"],
    related: { href: "/lab", en: `Open the lab: ${LAB_COUNT} live animations`, fr: `Ouvrir le lab : ${LAB_COUNT} animations en direct` },
    en: {
      title: `${LAB_COUNT} live animations on one page, and still fast`,
      description: `The lab runs ${LAB_COUNT} animations at once and stays fast. The trick: nothing moves off screen.`,
    },
    fr: {
      title: `${LAB_COUNT} animations en direct sur une page, et toujours rapide`,
      description: `Le lab fait tourner ${LAB_COUNT} animations à la fois et reste rapide. L'astuce : rien ne bouge hors de l'écran.`,
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
      description: "I rebuilt two scroll effects from 2023 in plain CSS. Less code, and smoother.",
    },
    fr: {
      title: "Des animations au défilement sans JavaScript",
      description: "J'ai refait deux effets au défilement de 2023 en CSS pur. Moins de code, et plus fluide.",
    },
  },
  {
    slug: "ai-suggests-people-decide",
    date: "2026-07-15",
    tags: ["AI", "Accessibility", "Product design"],
    related: { href: "/projects/accesseu", en: "Read the AccessEU case study", fr: "Lire l'étude de cas AccessEU" },
    en: {
      title: "AI suggests, people decide",
      description: "In AccessEU, AI writes photo descriptions for people who use a screen reader, but a person always checks them first.",
    },
    fr: {
      title: "L'IA propose, l'humain décide",
      description: "Dans AccessEU, l'IA écrit les descriptions des photos pour les personnes qui utilisent un lecteur d'écran, mais une personne les vérifie toujours avant.",
    },
  },
]
