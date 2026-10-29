// The blog's posts, in both languages: their metadata (meta.js) and their
// bodies. Plain data (no JSX), so the build can read each post for its own
// page (scripts/prerender.mjs). A body is a list of blocks: ['p', text],
// ['h2', text], ['ul', [items]], ['code', lang, source, caption?]. Text may
// hold `code`, **bold** and [links](/path).
import { POST_META } from './meta.js'
import { LAB_COUNT } from '../lab/count.js'

const BODIES = [
  {
    slug: 'a-real-globe-on-a-canvas',
    en: {
      body: [
        ['p', "An old animation of mine faked a globe: a flat map sliding behind a round mask. It looked fine for a second, then you saw the continents slide flat and vanish at the edges without ever curving. For [the lab](/lab) I wanted a real one, drawn with JavaScript on a canvas."],
        ['h2', 'Putting the points on a sphere'],
        ['p', "The coastlines are a list of points, each with a longitude and a latitude. At each frame, every point turns with the globe and lands on the screen. A third number tells whether it faces us or sits behind."],
        ['code', 'js', `const project = ([lon, lat], turn) => {
  const l = (lon + turn) * rad, p = lat * rad, t = tilt * rad
  const x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l)
  return { x, y: y * Math.cos(t) - z * Math.sin(t), z: y * Math.sin(t) + z * Math.cos(t) }
}`, 'x goes right, y goes up, z comes towards us: above 0, the point is on our side.'],
        ['h2', 'Cutting the coasts at the edge'],
        ['p', "The hard part is a coast that goes round the back. Where it crosses over, I find the exact spot on the edge of the circle, then follow the edge until the coast comes back to the front."],
        ['code', 'js', `// where a piece of coast goes from the front (a) to the back (b)
const edge = (a, b) => {
  const k = a.z / (a.z - b.z)
  const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k
  return Math.atan2(-y, x)
}`, 'The point where z is 0, as an angle on the edge of the globe.'],
        ['h2', 'CSS keeps the time'],
        ['p', "The turn itself is a CSS animation, and the canvas reads it at each frame. So the globe pauses with the rest of the lab, and stays still for people who ask for less motion."],
        ['code', 'css', `.lb-globe { animation: lb-turn 32s linear infinite; }

@keyframes lb-turn {
  to { --lb-turn: 360; }
}`, 'A full turn in 32 seconds.'],
        ['code', 'js', `const clock = canvas.getAnimations().find((a) => a.animationName === 'lb-turn')
const turn = (clock?.effect.getComputedTiming().progress ?? 0) * 360`, 'The canvas reads how far the CSS animation has gone.'],
        ['p', "Drag the globe, and it spins on top of that, slowing down when you let go."],
      ],
    },
    fr: {
      body: [
        ['p', "Une de mes anciennes animations simulait un globe : une carte plate qui glissait derrière un masque rond. Ça passait une seconde, puis on voyait les continents glisser à plat et disparaître sur les bords sans jamais se courber. Pour [le lab](/lab), je voulais un vrai globe, dessiné en JavaScript sur un canvas."],
        ['h2', 'Poser les points sur une sphère'],
        ['p', "Les côtes sont une liste de points, chacun avec une longitude et une latitude. À chaque image, chaque point tourne avec le globe et se place à l'écran. Un troisième nombre dit s'il est face à nous ou derrière."],
        ['code', 'js', `const project = ([lon, lat], turn) => {
  const l = (lon + turn) * rad, p = lat * rad, t = tilt * rad
  const x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l)
  return { x, y: y * Math.cos(t) - z * Math.sin(t), z: y * Math.sin(t) + z * Math.cos(t) }
}`, 'x va à droite, y vers le haut, z vers nous : au-dessus de 0, le point est de notre côté.'],
        ['h2', 'Couper les côtes au bord'],
        ['p', "Le plus dur, c'est une côte qui passe derrière. Là où elle bascule, je cherche le point exact sur le bord du cercle, puis je suis le bord jusqu'à ce que la côte revienne devant."],
        ['code', 'js', `// là où un bout de côte passe de devant (a) à derrière (b)
const edge = (a, b) => {
  const k = a.z / (a.z - b.z)
  const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k
  return Math.atan2(-y, x)
}`, 'Le point où z vaut 0, sous forme d\'angle sur le bord du globe.'],
        ['h2', 'Le CSS donne le temps'],
        ['p', "La rotation elle-même est une animation CSS, et le canvas la lit à chaque image. Le globe se met donc en pause avec le reste du lab, et reste immobile pour les personnes qui demandent moins de mouvement."],
        ['code', 'css', `.lb-globe { animation: lb-turn 32s linear infinite; }

@keyframes lb-turn {
  to { --lb-turn: 360; }
}`, 'Un tour complet en 32 secondes.'],
        ['code', 'js', `const clock = canvas.getAnimations().find((a) => a.animationName === 'lb-turn')
const turn = (clock?.effect.getComputedTiming().progress ?? 0) * 360`, "Le canvas lit où en est l'animation CSS."],
        ['p', "Attrapez le globe, et il tourne en plus, puis ralentit quand vous le lâchez."],
      ],
    },
  },
  {
    slug: 'two-springs-make-water-slosh',
    en: {
      body: [
        ['p', "In [the lab](/lab), a test tube tilts towards your mouse, and the water inside follows a little late, sloshes, then settles."],
        ['h2', 'The water stays flat'],
        ['p', "Tilt a real glass and the water does not tilt with it. So the glass turns, but the water only moves up and down. A clip path, shaped like the inside of the glass, turns with the glass and cuts the water to fit."],
        ['code', 'html', `<clipPath id="inside"><path d="M33 16v157a17 17 0 0 0 34 0V16z"/></clipPath>
<g clip-path="url(#inside)">
  <g class="water"><!-- waves and bubbles --></g>
</g>
<g class="glass"><!-- outline, marks, shine --></g>`, 'The glass turns, and the water is cut to its shape.'],
        ['h2', 'A firm spring for the glass'],
        ['p', "The glass follows the mouse on a firm spring: it moves fast and stops without bouncing. A spring is two lines per frame: a pull towards the target, and a brake that grows with the speed."],
        ['code', 'js', `speed += ((aim - tilt) * 120 - speed * 18) * dt
tilt += speed * dt`, 'Firm and well braked: the glass never wobbles.'],
        ['h2', 'A soft spring for the water'],
        ['p', "The water follows the glass on a softer spring that barely brakes. When the glass moves fast, the water falls behind, then goes too far. That gap is the slosh."],
        ['code', 'js', `lagSpeed += ((tilt - lag) * 60 - lagSpeed * 3.4) * dt
lag += lagSpeed * dt
const slosh = (lag - tilt) * 1.5`, "The gap between the two springs tilts the water's surface."],
        ['p', "The brake matters: with less of it, the water kept rocking for seconds. At 3.4, it sloshes two or three times and stops, like water in a thin tube."],
      ],
    },
    fr: {
      body: [
        ['p', "Dans [le lab](/lab), un tube à essai penche vers la souris, et l'eau à l'intérieur suit avec un peu de retard, clapote, puis se pose."],
        ['h2', "L'eau reste à plat"],
        ['p', "Penchez un vrai verre : l'eau ne penche pas avec lui. Ici, le verre tourne, mais l'eau ne fait que monter et descendre. Un clip path, en forme d'intérieur du verre, tourne avec le verre et découpe l'eau à sa forme."],
        ['code', 'html', `<clipPath id="inside"><path d="M33 16v157a17 17 0 0 0 34 0V16z"/></clipPath>
<g clip-path="url(#inside)">
  <g class="water"><!-- vagues et bulles --></g>
</g>
<g class="glass"><!-- contour, graduations, reflet --></g>`, "Le verre tourne, et l'eau est découpée à sa forme."],
        ['h2', 'Un ressort ferme pour le verre'],
        ['p', "Le verre suit la souris sur un ressort ferme : il bouge vite et s'arrête sans rebondir. Un ressort, c'est deux lignes par image : une traction vers la cible, et un frein qui grandit avec la vitesse."],
        ['code', 'js', `speed += ((aim - tilt) * 120 - speed * 18) * dt
tilt += speed * dt`, 'Ferme et bien freiné : le verre ne tremble jamais.'],
        ['h2', "Un ressort souple pour l'eau"],
        ['p', "L'eau suit le verre sur un ressort plus souple, qui freine à peine. Quand le verre bouge vite, l'eau prend du retard, puis va trop loin. Cet écart, c'est le clapotis."],
        ['code', 'js', `lagSpeed += ((tilt - lag) * 60 - lagSpeed * 3.4) * dt
lag += lagSpeed * dt
const slosh = (lag - tilt) * 1.5`, "L'écart entre les deux ressorts penche la surface de l'eau."],
        ['p', "Le frein compte : avec moins de frein, l'eau bougeait encore pendant des secondes. À 3,4, elle clapote deux ou trois fois puis s'arrête, comme de l'eau dans un tube étroit."],
      ],
    },
  },
  {
    slug: 'live-animations-one-page',
    en: {
      body: [
        ['p', `[The lab](/lab) shows ${LAB_COUNT} live animations on one page: buttons, loaders, a globe, a test tube. That can easily make a phone hot and slow. Three simple things keep it fast.`],
        ['h2', '1. Skip what is far away'],
        ['p', "One CSS property tells the browser not to draw a card while it is far from the screen. A second one keeps its height in reserve, so the page does not jump as you scroll."],
        ['code', 'css', `.lab-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 470px;
}`, 'Far from the screen, a card costs almost nothing.'],
        ['h2', '2. Pause what you cannot see'],
        ['p', "Each card notes when it is on screen. One CSS rule then pauses every animation in the other cards. The pause button at the top of the lab uses the same rule."],
        ['code', 'js', `const observer = new IntersectionObserver(([entry]) =>
  card.toggleAttribute('data-inview', entry.isIntersecting))
observer.observe(card)`, 'The card says when it is on screen.'],
        ['code', 'css', `.lab-card:not([data-inview]) .lab-stage *,
.lab-grid[data-paused] .lab-stage * {
  animation-play-state: paused !important;
}`, 'Off screen, or after a press on pause, everything waits where it is.'],
        ['h2', '3. JavaScript stops too'],
        ['p', "Demos drawn with JavaScript, like the globe, only ask for new frames while they are on screen, and only draw again when something changed. The test tube stops as soon as its water is still."],
        ['p', "Nothing fancy: two CSS properties, one observer and one rule. What made the difference was checking the speed before and after each change, on a phone."],
      ],
    },
    fr: {
      body: [
        ['p', `[Le lab](/lab) montre ${LAB_COUNT} animations en direct sur une seule page : des boutons, des chargements, un globe, un tube à essai. De quoi faire vite chauffer et ralentir un téléphone. Trois choses simples le gardent rapide.`],
        ['h2', '1. Ignorer ce qui est loin'],
        ['p', "Une propriété CSS dit au navigateur de ne pas dessiner une carte tant qu'elle est loin de l'écran. Une seconde garde sa hauteur en réserve, pour que la page ne saute pas pendant le défilement."],
        ['code', 'css', `.lab-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 470px;
}`, "Loin de l'écran, une carte ne coûte presque rien."],
        ['h2', "2. Mettre en pause ce qu'on ne voit pas"],
        ['p', "Chaque carte note quand elle est à l'écran. Une seule règle CSS met ensuite en pause toutes les animations des autres cartes. Le bouton pause en haut du lab utilise la même règle."],
        ['code', 'js', `const observer = new IntersectionObserver(([entry]) =>
  card.toggleAttribute('data-inview', entry.isIntersecting))
observer.observe(card)`, "La carte signale quand elle est à l'écran."],
        ['code', 'css', `.lab-card:not([data-inview]) .lab-stage *,
.lab-grid[data-paused] .lab-stage * {
  animation-play-state: paused !important;
}`, "Hors de l'écran, ou après un clic sur pause, tout attend là où il en est."],
        ['h2', "3. Le JavaScript s'arrête aussi"],
        ['p', "Les démos dessinées en JavaScript, comme le globe, ne demandent de nouvelles images que lorsqu'elles sont à l'écran, et ne redessinent que si quelque chose a changé. Le tube à essai s'arrête dès que son eau est immobile."],
        ['p', "Rien de compliqué : deux propriétés CSS, un observateur et une règle. Ce qui a fait la différence, c'est de mesurer la vitesse avant et après chaque changement, sur un téléphone."],
      ],
    },
  },
  {
    slug: 'motion-that-serves',
    en: {
      body: [
        ['p', "An animation should help people, not slow them down. The examples here come from [the lab](/lab)."],
        ['h2', 'It has a reason to be there'],
        ['p', "Did my click work? Where did this panel come from? Is something loading? If an animation answers none of these, I take it out, or keep it very quiet."],
        ['h2', 'It is short'],
        ['p', "Most interface animations last between 150 and 400 milliseconds. Closing can be faster than opening: nobody should wait for a menu to go away."],
        ['code', 'css', `/* closing: quick */
.panel { transition: translate 0.2s ease-in; }

/* opening: a quick start, a soft landing */
.panel.is-open { transition: translate 0.3s ease-out; }`, 'The browser uses the transition of the state you go to: 0.3 s to open, 0.2 s to close.'],
        ['h2', 'It moves cheap things'],
        ['p', "Moving, growing and fading stay smooth even on a small phone. Changing a width or a margin makes the browser redo the whole page layout at each frame, and that is when it stutters."],
        ['code', 'css', `/* smooth */
.bar { scale: var(--done) 1; transform-origin: left; }

/* stutters */
.bar { width: calc(var(--done) * 100%); }`, 'The download bar in the lab grows with scale, never with width.'],
        ['h2', 'It respects less motion'],
        ['p', "Some people feel dizzy when things move on a screen, and their phone or computer can say so. Every demo in the lab has a calm version: the same information, without the movement."],
        ['code', 'css', `@media (prefers-reduced-motion: reduce) {
  /* no slide: the message just appears */
  .toast { animation: none; }
}`, 'The calm version keeps the meaning and drops the movement.'],
        ['h2', 'It can be stopped'],
        ['p', "Anything that loops for more than five seconds next to text needs a way to pause it. The lab has one pause button for all its demos."],
      ],
    },
    fr: {
      body: [
        ['p', "Une animation doit aider, pas ralentir. Les exemples viennent du [lab](/lab)."],
        ['h2', 'Elle a une raison d\'être là'],
        ['p', "Mon clic a-t-il marché ? D'où vient ce panneau ? Quelque chose est-il en train de charger ? Si une animation ne répond à aucune de ces questions, je l'enlève, ou je la rends très discrète."],
        ['h2', 'Elle est courte'],
        ['p', "La plupart des animations d'interface durent entre 150 et 400 millisecondes. Fermer peut aller plus vite qu'ouvrir : personne ne doit attendre qu'un menu disparaisse."],
        ['code', 'css', `/* fermeture : rapide */
.panel { transition: translate 0.2s ease-in; }

/* ouverture : départ vif, arrivée en douceur */
.panel.is-open { transition: translate 0.3s ease-out; }`, "Le navigateur prend la transition de l'état d'arrivée : 0,3 s pour ouvrir, 0,2 s pour fermer."],
        ['h2', 'Elle déplace des choses légères'],
        ['p', "Déplacer, agrandir et faire apparaître restent fluides, même sur un petit téléphone. Changer une largeur ou une marge oblige le navigateur à recalculer toute la page à chaque image, et c'est là que ça saccade."],
        ['code', 'css', `/* fluide */
.bar { scale: var(--done) 1; transform-origin: left; }

/* saccadé */
.bar { width: calc(var(--done) * 100%); }`, 'La barre de téléchargement du lab grandit avec scale, jamais avec width.'],
        ['h2', 'Elle respecte « moins de mouvement »'],
        ['p', "Certaines personnes ont des vertiges quand ça bouge à l'écran, et leur téléphone ou leur ordinateur peut le signaler. Chaque démo du lab a une version calme : la même information, sans le mouvement."],
        ['code', 'css', `@media (prefers-reduced-motion: reduce) {
  /* pas de glissement : le message apparaît, simplement */
  .toast { animation: none; }
}`, 'La version calme garde le sens et enlève le mouvement.'],
        ['h2', 'On peut l\'arrêter'],
        ['p', "Tout ce qui tourne en boucle plus de cinq secondes à côté d'un texte doit pouvoir être mis en pause. Le lab a un seul bouton pause pour toutes ses démos."],
      ],
    },
  },
  {
    slug: 'scroll-driven-animations',
    en: {
      body: [
        ['p', "In 2023 I built a page where a hand follows the scroll and presses a button. This year I rebuilt it: no more JavaScript listening to the scroll, the browser does the work."],
        ['h2', 'The old way'],
        ['p', "The old code listened to every scroll, measured the page and moved the hand each time. The hand jumped instead of gliding, and the browser worked hard while you scrolled."],
        ['h2', 'The new way: the scroll drives the animation'],
        ['p', "A view timeline follows an element as it crosses the screen: 0% when it comes in at the bottom, 100% when it leaves at the top. Link keyframes to it, and the browser plays them from the scroll position."],
        ['code', 'css', `.scene {
  view-timeline: --scene block;
}

.hand {
  animation: reach linear both;
  animation-timeline: --scene;
}

@keyframes reach {
  0%, 20% { translate: 60% -22%; opacity: 0; }
  53%, 100% { translate: 13.9% 14.5%; }
}`, 'Here the percentages are places on the screen, not moments in time.'],
        ['p', "Scroll back up, and it plays backwards, without a line of code."],
        ['h2', 'For browsers that cannot yet'],
        ['p', "Where the browser does not know view timelines, the same animation is paused, and a few lines of JavaScript move it to the right spot as you scroll."],
        ['code', 'css', `@supports not (animation-timeline: view()) {
  .hand {
    animation-play-state: paused;
    animation-delay: calc(var(--progress, 0) * -1s);
  }
}`, 'A negative delay puts a paused animation at any point: -0.5 s is halfway.'],
        ['code', 'js', `const { top, height } = scene.getBoundingClientRect()
const progress = (innerHeight - top) / (innerHeight + height)
scene.style.setProperty('--progress', Math.min(1, Math.max(0, progress)))`, 'The same 0 to 1 as the view timeline, worked out by hand.'],
      ],
    },
    fr: {
      body: [
        ['p', "En 2023, j'ai fait une page où une main suit le défilement et appuie sur un bouton. Cette année, je l'ai refaite : plus de JavaScript qui écoute le défilement, c'est le navigateur qui fait le travail."],
        ['h2', "L'ancienne méthode"],
        ['p', "L'ancien code écoutait chaque défilement, mesurait la page et déplaçait la main à chaque fois. La main sautait au lieu de glisser, et le navigateur peinait pendant le défilement."],
        ['h2', 'La nouvelle : le défilement pilote l\'animation'],
        ['p', "Une view timeline suit un élément pendant qu'il traverse l'écran : 0 % quand il entre par le bas, 100 % quand il sort par le haut. On y relie des keyframes, et le navigateur les joue d'après la position du défilement."],
        ['code', 'css', `.scene {
  view-timeline: --scene block;
}

.hand {
  animation: reach linear both;
  animation-timeline: --scene;
}

@keyframes reach {
  0%, 20% { translate: 60% -22%; opacity: 0; }
  53%, 100% { translate: 13.9% 14.5%; }
}`, "Ici, les pourcentages sont des positions à l'écran, pas des instants."],
        ['p', "Remontez, et tout se rejoue à l'envers, sans une ligne de code."],
        ['h2', 'Pour les navigateurs qui ne savent pas encore'],
        ['p', "Là où le navigateur ne connaît pas les view timelines, la même animation est mise en pause, et quelques lignes de JavaScript la placent au bon endroit pendant le défilement."],
        ['code', 'css', `@supports not (animation-timeline: view()) {
  .hand {
    animation-play-state: paused;
    animation-delay: calc(var(--progress, 0) * -1s);
  }
}`, "Un délai négatif place une animation en pause où l'on veut : -0,5 s, c'est la moitié."],
        ['code', 'js', `const { top, height } = scene.getBoundingClientRect()
const progress = (innerHeight - top) / (innerHeight + height)
scene.style.setProperty('--progress', Math.min(1, Math.max(0, progress)))`, 'Le même 0 à 1 que la view timeline, calculé à la main.'],
      ],
    },
  },
  {
    slug: 'ai-suggests-people-decide',
    en: {
      body: [
        ['p', "AccessEU, my Shopify app for accessibility, uses AI for one job: describing product photos for people who use a screen reader. It would be easy to let the AI write them straight into the store. I chose not to."],
        ['h2', 'The AI suggests, a person saves'],
        ['p', "Suggestions only fill in the text fields. The shop owner reads them, fixes what is wrong, and saves them like any text they wrote. Nothing reaches the store without a person's decision, because a wrong description is worse than none."],
        ['h2', 'One clear instruction'],
        ['p', "Every photo gets the same short instruction, so the descriptions stay alike across thousands of products: say what matters, describe only what you see, guess nothing."],
        ['code', 'text', `Say what the photo shows that matters to a shopper: the product,
its colour, material or pattern, and the view or detail shown.
Describe only what you can see. Do not guess brands, materials or
sizes that are not visible, and do not add marketing language,
prices or opinions.`, 'Part of the instruction sent with every photo.'],
        ['h2', 'A small, clean exchange'],
        ['p', "Only Shopify's own images are sent, made smaller first: plenty to describe a product, and cheaper. What comes back is tidied up before it reaches the field: one line, no \"Image of\", within Shopify's length limit."],
        ['p', "The AI does the long work. The person stays in charge of their shop."],
      ],
    },
    fr: {
      body: [
        ['p', "AccessEU, mon app Shopify pour l'accessibilité, utilise l'IA pour une seule tâche : décrire les photos produit pour les personnes qui utilisent un lecteur d'écran. Il serait facile de laisser l'IA les écrire directement dans la boutique. J'ai choisi de ne pas le faire."],
        ['h2', "L'IA propose, une personne enregistre"],
        ['p', "Les suggestions remplissent seulement les champs de texte. Le marchand les lit, corrige ce qui ne va pas, et les enregistre comme un texte qu'il aurait écrit. Rien n'arrive dans la boutique sans la décision d'une personne, car une mauvaise description est pire que pas de description."],
        ['h2', 'Une consigne claire'],
        ['p', "Chaque photo reçoit la même consigne courte, pour que les descriptions se ressemblent sur des milliers de produits : dire ce qui compte, décrire seulement ce qu'on voit, ne rien deviner."],
        ['code', 'text', `Say what the photo shows that matters to a shopper: the product,
its colour, material or pattern, and the view or detail shown.
Describe only what you can see. Do not guess brands, materials or
sizes that are not visible, and do not add marketing language,
prices or opinions.`, "Un extrait de la consigne envoyée avec chaque photo (en anglais, comme dans l'app)."],
        ['h2', 'Un échange petit et propre'],
        ['p', "Seules les images de Shopify sont envoyées, réduites d'abord : largement assez pour décrire un produit, et moins cher. Ce qui revient est nettoyé avant d'arriver dans le champ : une seule ligne, pas de « Image of », dans la limite de longueur de Shopify."],
        ['p', "L'IA fait le travail long. La personne reste maître de sa boutique."],
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
