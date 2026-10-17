// The blog posts known to the whole site: address, date, tags, the page
// they lead to, and title and description in both languages. Small, so the
// home page can show the latest post without loading any article. The
// articles themselves are in posts.js, which adds their bodies.
import { LAB_COUNT } from '../lab/count.js'

export const POST_META = [
  {
    slug: "a-real-globe-on-a-canvas",
    date: "2026-10-17",
    tags: ["Canvas", "JavaScript", "Animation"],
    related: { href: "/lab", en: "Spin the globe in the lab, under From my archive", fr: "Faire tourner le globe dans le lab, rubrique Mes archives" },
    en: {
      title: "A real globe on a canvas: cutting the coastlines at the edge",
      description: "How the globe in the lab draws real coastlines on a turning sphere: an orthographic projection, coastlines cut where they pass behind, and the two bugs that once filled the whole globe with land.",
    },
    fr: {
      title: "Un vrai globe sur un canvas : couper les côtes au bord de la sphère",
      description: "Comment le globe du lab dessine de vraies côtes sur une sphère qui tourne : une projection orthographique, des côtes coupées là où elles passent derrière, et les deux bugs qui remplissaient tout le globe de terre.",
    },
  },
  {
    slug: "two-springs-make-water-slosh",
    date: "2026-10-17",
    tags: ["Animation", "JavaScript", "SVG"],
    related: { href: "/lab", en: "Tilt the test tube in the lab, under From my archive", fr: "Pencher le tube à essai dans le lab, rubrique Mes archives" },
    en: {
      title: "Two springs make water slosh",
      description: "The test tube in the lab leans towards the pointer and its water sloshes before it settles. Two springs, a dozen lines of JavaScript, and why the water must not turn with the glass.",
    },
    fr: {
      title: "Deux ressorts pour faire clapoter de l'eau",
      description: "Le tube à essai du lab penche vers le curseur et son eau clapote avant de se poser. Deux ressorts, une douzaine de lignes de JavaScript, et pourquoi l'eau ne doit pas tourner avec le verre.",
    },
  },
  {
    slug: "live-animations-one-page",
    date: "2026-10-17",
    tags: ["Performance", "CSS", "Animation"],
    related: { href: "/lab", en: `Open the lab: ${LAB_COUNT} live animations`, fr: `Ouvrir le lab : ${LAB_COUNT} animations en direct` },
    en: {
      title: `${LAB_COUNT} live animations on one page, and still fast`,
      description: `The lab runs ${LAB_COUNT} live demos on a single page and scores 97 on Lighthouse's mobile test. What keeps it there: not drawing what is off screen, pausing what cannot be seen, and three traps I fell into.`,
    },
    fr: {
      title: `${LAB_COUNT} animations en direct sur une page, et toujours rapide`,
      description: `Le lab fait tourner ${LAB_COUNT} démos en direct sur une seule page et obtient 97 au test mobile de Lighthouse. Ce qui l'y maintient : ne pas dessiner ce qui est hors de l'écran, mettre en pause ce qu'on ne voit pas, et trois pièges dans lesquels je suis tombé.`,
    },
  },
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
