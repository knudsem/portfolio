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
        ['p', "An old animation of mine faked a globe: a photo of a world map sliding behind a round mask, with an inner shadow to make it look curved. It passes for a second, then you notice the continents slide flat across the middle and vanish at the edges without ever bending. For [the lab](/lab) I wanted the real thing, drawn on a 2D canvas, small enough to read in its code panel."],
        ['h2', 'The data: 986 points of coastline'],
        ['p', "The coastlines come from Natural Earth, which is in the public domain. Even its simplest version has more than 5,000 points, and a globe 130 pixels wide does not need that many. Simplified with the Douglas-Peucker algorithm, without the smallest islands, and rounded to half a degree, the land fits in 986 points: about 4 KB of text, written like an SVG path, one shape per `M` followed by relative steps."],
        ['h2', 'Projecting: a sphere seen from far away'],
        ['p', "An orthographic projection is the view of a sphere from very far away. Turn the globe by a longitude, tilt it towards the viewer, and each point keeps its x and y on the screen, while z says whether it faces us."],
        ['code', 'js', `const project = ([lon, lat], turn) => {
  const l = (lon + turn) * rad, p = lat * rad, t = tilt * rad
  const x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l)
  return { x, y: y * Math.cos(t) - z * Math.sin(t), z: y * Math.sin(t) + z * Math.cos(t) }
}`, 'x to the right, y up, z towards the viewer: z above 0 means this side of the globe.'],
        ['h2', 'Cutting at the edge'],
        ['p', "The hard part is a coastline that goes round the back. Where a segment crosses from the front to the back, it meets the edge of the globe; that point lies on the straight line between its two ends, where z is 0. From there, the shape has to follow the edge of the globe until the coast comes back into view."],
        ['p', "My first version followed the edge to the next place where the same coastline came back, in the order of its points. On most frames it looked right; at some angles the whole globe turned green. A coast that dips into view near the edge and leaves again further along broke it. The right place to rejoin is the next point where any piece comes back, **along the edge**, going round in the direction that keeps the land on the same side. That is the classic rule of polygon clipping."],
        ['code', 'js', `// from where the coast went behind, follow the edge to the nearest place
// where a piece comes back (way is 1 for a clockwise shape, -1 otherwise)
const next = pieces.reduce((best, other) =>
  turnTo(piece.to, other.from) < turnTo(piece.to, best.from) ? other : best)
ctx.arc(c, c, r, piece.to, piece.to + turnTo(piece.to, next.from) * way, !clockwise)`],
        ['h2', 'Two bugs the eye would never have found'],
        ['ul', [
          "**Cuba crossed itself.** Rounded to whole degrees, its thin outline became a figure of eight, which reverses its direction in one place, and the edge was then followed the wrong way round. At half a degree, none of the 49 shapes crosses itself, which a small script checks.",
          "**A coast that only grazes the edge.** When a single point peeks out by a fraction of a pixel, its way in and its way out land on the same spot, and rounding can swap them. Such a piece shows nothing, so it is left out.",
        ]],
        ['p', "Neither bug showed up while I watched the globe turn. Both showed up when a script turned it to 1,260 positions (every 2 degrees, at 7 tilts) and measured the share of land on the visible side. The Earth never shows much more than two thirds of land, so a frame above that is a bug, whatever it looks like."],
        ['h2', 'A CSS animation as the clock'],
        ['p', "The globe turns with a CSS animation, and the canvas reads how far it has run at each frame. It sounds backwards, but it means the globe pauses with the lab's pause button, stays still for people who ask for reduced motion, and costs nothing off screen, like every other demo."],
        ['code', 'css', `.lb-globe { animation: lb-turn 32s linear infinite; }

@keyframes lb-turn { to { --lb-turn: 360; } }

@media (prefers-reduced-motion: reduce) {
  .lb-globe { animation: none; }
}`],
        ['code', 'js', `const clock = canvas.getAnimations().find((a) => a.animationName === 'lb-turn')
const turn = (clock?.effect.getComputedTiming().progress ?? 0) * 360`, 'Read at each frame, and drawn again only when it changed. A paused animation gives a paused globe; no animation, no turn.'],
        ['p', "Drag the globe and it spins on top of that, slowing down when you let go."],
      ],
    },
    fr: {
      body: [
        ['p', "Une de mes anciennes animations simulait un globe : la photo d'une carte du monde qui glissait derrière un masque rond, avec une ombre intérieure pour donner l'illusion du volume. Ça fait illusion une seconde, puis on remarque que les continents traversent le milieu à plat et disparaissent sur les bords sans jamais se courber. Pour [le lab](/lab), je voulais un vrai globe, dessiné sur un canvas 2D, assez court pour se lire dans son panneau de code."],
        ['h2', 'Les données : 986 points de côtes'],
        ['p', "Les côtes viennent de Natural Earth, qui est dans le domaine public. Même sa version la plus simple compte plus de 5 000 points, et un globe de 130 pixels de large n'en a pas besoin d'autant. Simplifiées avec l'algorithme de Douglas-Peucker, sans les plus petites îles, et arrondies au demi-degré, les terres tiennent en 986 points : environ 4 Ko de texte, écrits comme un tracé SVG, une forme par `M` suivie de pas relatifs."],
        ['h2', 'Projeter : une sphère vue de très loin'],
        ['p', "Une projection orthographique, c'est une sphère vue de très loin. On tourne le globe d'une longitude, on l'incline vers le spectateur, et chaque point garde ses x et y à l'écran, tandis que z dit s'il est face à nous."],
        ['code', 'js', `const project = ([lon, lat], turn) => {
  const l = (lon + turn) * rad, p = lat * rad, t = tilt * rad
  const x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l)
  return { x, y: y * Math.cos(t) - z * Math.sin(t), z: y * Math.sin(t) + z * Math.cos(t) }
}`, "x vers la droite, y vers le haut, z vers le spectateur : z au-dessus de 0 veut dire de ce côté-ci du globe."],
        ['h2', 'Couper au bord'],
        ['p', "Le plus difficile, c'est une côte qui passe derrière. Là où un segment passe de l'avant à l'arrière, il croise le bord du globe ; ce point se trouve sur la droite entre ses deux extrémités, là où z vaut 0. À partir de là, la forme doit suivre le bord du globe jusqu'à ce que la côte revienne en vue."],
        ['p', "Ma première version suivait le bord jusqu'au prochain endroit où la même côte revenait, dans l'ordre de ses points. Sur la plupart des images, c'était juste ; sous certains angles, tout le globe devenait vert. Une côte qui apparaît près du bord puis repart un peu plus loin suffisait à tout casser. Le bon endroit où reprendre, c'est le prochain point où un morceau revient, **le long du bord**, en tournant dans le sens qui garde la terre du même côté. C'est la règle classique du découpage de polygones."],
        ['code', 'js', `// depuis l'endroit où la côte est passée derrière, suivre le bord jusqu'au
// plus proche endroit où un morceau revient (way vaut 1 pour une forme
// dans le sens horaire, -1 sinon)
const next = pieces.reduce((best, other) =>
  turnTo(piece.to, other.from) < turnTo(piece.to, best.from) ? other : best)
ctx.arc(c, c, r, piece.to, piece.to + turnTo(piece.to, next.from) * way, !clockwise)`],
        ['h2', "Deux bugs que l'œil n'aurait jamais trouvés"],
        ['ul', [
          "**Cuba se croisait elle-même.** Arrondi au degré, son contour très fin devenait un huit, ce qui inverse son sens à un endroit : le bord était alors suivi dans le mauvais sens. Au demi-degré, aucune des 49 formes ne se croise, et un petit script le vérifie.",
          "**Une côte qui frôle le bord.** Quand un seul point dépasse d'une fraction de pixel, son entrée et sa sortie tombent au même endroit, et un arrondi peut les inverser. Un tel morceau ne montre rien : il est laissé de côté.",
        ]],
        ['p', "Aucun des deux bugs ne se voyait en regardant le globe tourner. Les deux sont apparus quand un script l'a fait tourner dans 1 260 positions (tous les 2 degrés, sous 7 inclinaisons) en mesurant la part de terre sur la face visible. La Terre ne montre jamais beaucoup plus de deux tiers de terres : une image au-dessus, c'est un bug, quoi qu'elle ait l'air."],
        ['h2', "Une animation CSS comme horloge"],
        ['p', "Le globe tourne grâce à une animation CSS, et le canvas lit à chaque image où elle en est. Ça semble à l'envers, mais le globe se met ainsi en pause avec le bouton du lab, reste immobile pour ceux qui demandent moins de mouvement, et ne coûte rien hors de l'écran, comme toutes les autres démos."],
        ['code', 'css', `.lb-globe { animation: lb-turn 32s linear infinite; }

@keyframes lb-turn { to { --lb-turn: 360; } }

@media (prefers-reduced-motion: reduce) {
  .lb-globe { animation: none; }
}`],
        ['code', 'js', `const clock = canvas.getAnimations().find((a) => a.animationName === 'lb-turn')
const turn = (clock?.effect.getComputedTiming().progress ?? 0) * 360`, "Lue à chaque image, et redessinée seulement quand elle a changé. Animation en pause, globe en pause ; pas d'animation, pas de rotation."],
        ['p', "Attrapez le globe : il tourne en plus, et ralentit quand on le lâche."],
      ],
    },
  },
  {
    slug: 'two-springs-make-water-slosh',
    en: {
      body: [
        ['p', "In [the lab](/lab), a test tube leans towards your pointer, and the water inside lags behind the glass, overshoots, and settles. It takes two springs and a dozen lines of JavaScript."],
        ['h2', 'The water stays level'],
        ['p', "Tilt a real glass and its water does not tilt with it. In SVG, that means the glass and the water live in different coordinates: the glass turns, the water does not, and the water is cut to the inside of the glass by a clip path that turns with the glass."],
        ['code', 'html', `<clipPath id="inside"><path d="M33 16v157a17 17 0 0 0 34 0V16z"/></clipPath>
<g clip-path="url(#inside)">
  <g class="water"><!-- waves and bubbles --></g>
</g>
<g class="glass"><!-- outline, marks, shine --></g>`, "The script turns the glass and the clip path's shape together; the water only moves up and down."],
        ['h2', 'Spring one: the glass'],
        ['p', "The glass follows the pointer on a stiff, well damped spring: it leans quickly and stops without wobbling. A spring is two lines a frame: a pull towards the target, minus a brake that grows with the speed."],
        ['code', 'js', `speed += ((aim - tilt) * 120 - speed * 18) * dt
tilt += speed * dt`, 'A stiffness of 120 and a damping of 18: close to critical, so no bounce.'],
        ['h2', 'Spring two: the water'],
        ['p', "The water follows the glass on a softer spring, with very little damping. When the glass turns quickly, the water's idea of the angle falls behind, then overshoots. The gap between the two is the slosh, applied as a rotation of the water's surface."],
        ['code', 'js', `lagSpeed += ((tilt - lag) * 60 - lagSpeed * 3.4) * dt
lag += lagSpeed * dt
const slosh = (lag - tilt) * 1.5`],
        ['p', "The numbers matter. With a damping of 2.6, the water was still rocking two and a half seconds after the pointer left, and a test caught it before I did: it waits for the surface to settle, and it failed. At 3.4, the water sloshes two or three times and stops, which is what water does in a narrow tube."],
        ['h2', 'Small things that make it hold up'],
        ['ul', [
          "**Time, not frames.** Each step uses the real time since the last frame, capped at a thirtieth of a second, so a slow phone or a tab coming back to the front cannot make the springs explode.",
          "**No loop at rest.** When the glass and the water are both still, the script stops asking for frames; the next pointer move wakes it up.",
          "**The waves are CSS.** Two long wave strips drift sideways at their own pace, and the bubbles rise and burst with CSS animations. They pause with the rest of the lab, and for people who ask for reduced motion they stop, along with the tilt.",
        ]],
        ['p', "The same two springs work for anything that should feel like it has weight: a hanging sign, a card on a string, the liquid in a progress bar."],
      ],
    },
    fr: {
      body: [
        ['p', "Dans [le lab](/lab), un tube à essai penche vers le curseur, et l'eau à l'intérieur prend du retard sur le verre, dépasse, puis se pose. Il suffit de deux ressorts et d'une douzaine de lignes de JavaScript."],
        ['h2', "L'eau reste à niveau"],
        ['p', "Penchez un vrai verre : l'eau ne penche pas avec lui. En SVG, ça veut dire que le verre et l'eau vivent dans des repères différents : le verre tourne, l'eau non, et l'eau est découpée à l'intérieur du verre par un clip path qui tourne avec le verre."],
        ['code', 'html', `<clipPath id="inside"><path d="M33 16v157a17 17 0 0 0 34 0V16z"/></clipPath>
<g clip-path="url(#inside)">
  <g class="water"><!-- vagues et bulles --></g>
</g>
<g class="glass"><!-- contour, graduations, reflet --></g>`, "Le script fait tourner ensemble le verre et la forme du clip path ; l'eau, elle, ne fait que monter et descendre."],
        ['h2', 'Premier ressort : le verre'],
        ['p', "Le verre suit le curseur sur un ressort raide et bien amorti : il penche vite et s'arrête sans osciller. Un ressort, c'est deux lignes par image : une traction vers la cible, moins un frein qui grandit avec la vitesse."],
        ['code', 'js', `speed += ((aim - tilt) * 120 - speed * 18) * dt
tilt += speed * dt`, "Une raideur de 120 et un amortissement de 18 : proche du critique, donc pas de rebond."],
        ['h2', "Second ressort : l'eau"],
        ['p', "L'eau suit le verre sur un ressort plus souple, très peu amorti. Quand le verre tourne vite, l'angle que « croit » l'eau prend du retard, puis dépasse. L'écart entre les deux, c'est le clapotis, appliqué comme une rotation de la surface de l'eau."],
        ['code', 'js', `lagSpeed += ((tilt - lag) * 60 - lagSpeed * 3.4) * dt
lag += lagSpeed * dt
const slosh = (lag - tilt) * 1.5`],
        ['p', "Les chiffres comptent. Avec un amortissement de 2,6, l'eau bougeait encore deux secondes et demie après le départ du curseur, et un test l'a vu avant moi : il attend que la surface se pose, et il a échoué. À 3,4, l'eau clapote deux ou trois fois puis s'arrête, comme de l'eau dans un tube étroit."],
        ['h2', 'Les petits détails qui la rendent solide'],
        ['ul', [
          "**Le temps, pas les images.** Chaque pas utilise le temps réel écoulé depuis l'image précédente, plafonné à un trentième de seconde : un téléphone lent ou un onglet qui revient au premier plan ne peut pas faire exploser les ressorts.",
          "**Pas de boucle au repos.** Quand le verre et l'eau sont immobiles, le script arrête de demander des images ; le prochain mouvement du curseur le réveille.",
          "**Les vagues sont en CSS.** Deux longues bandes de vagues dérivent chacune à son rythme, et les bulles montent et éclatent avec des animations CSS. Elles se mettent en pause avec le reste du lab et, pour ceux qui demandent moins de mouvement, elles s'arrêtent, tout comme l'inclinaison.",
        ]],
        ['p', "Les deux mêmes ressorts marchent pour tout ce qui doit sembler avoir un poids : une enseigne suspendue, une carte au bout d'un fil, le liquide d'une barre de progression."],
      ],
    },
  },
  {
    slug: 'live-animations-one-page',
    en: {
      body: [
        ['p', "[The lab](/lab) is a single page with " + LAB_COUNT + " animations, all live: buttons that ripple, loaders that turn, a globe, a test tube full of bubbles. Each one is real HTML and CSS, sometimes with a little JavaScript, not a video. A page like that can easily make a phone hot and slow. Lighthouse's mobile test usually gives it 97 for performance, with less than a tenth of a second of blocking time. Three things keep it there."],
        ['h2', "1. Don't draw what nobody sees"],
        ['p', "With `content-visibility: auto`, the browser skips the layout and the painting of a card while it is far off screen. Before it, the page scored between 90 and 95; after, 97. The catch is the scroll bar: a skipped card has no size, so the page would jump as cards come into view. `contain-intrinsic-size` gives each card a size to keep in reserve, and the `auto` keyword remembers its real size once it has been seen."],
        ['code', 'css', `.lab-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 470px;
}`],
        ['h2', '2. Pause what cannot be seen'],
        ['p', "Skipping the painting does not stop the animations. Each card watches itself with an IntersectionObserver and marks itself when it is near the screen; everything else is paused by one rule. The pause button at the top of the page uses the same rule for the whole grid."],
        ['code', 'css', `.lab-card:not([data-inview]) .lab-stage *,
.lab-grid[data-paused] .lab-stage * {
  animation-play-state: paused !important;
}`],
        ['p', "JavaScript does the same where it animates on its own: the globe only asks for frames while it is on screen, and only draws again when something has changed; the test tube stops asking as soon as its water is still."],
        ['h2', '3. One clock for everyone'],
        ['p', "When a demo needs JavaScript to draw, its timing still comes from CSS. The globe's turn is a CSS animation of a typed property that the canvas reads, so the pause rule, the off screen rule and reduced motion all apply to it without a single extra line. I wrote more about it in [a real globe on a canvas](/blog/a-real-globe-on-a-canvas)."],
        ['h2', 'Three traps I fell into'],
        ['ul', [
          "**Filtering jumped to the top of the page.** Clicking a category swaps the cards, and the browser's scroll anchoring picked an anchor of its own, often the top of the page. `overflow-anchor: none` on the grid turns it off, and the page scrolls to the results itself.",
          "**A focused demo scrolled its own card.** With `overflow: hidden`, a button that receives the focus inside a card can still scroll the card to show itself: one demo moved 58 pixels sideways. `overflow: clip` cuts the same way, but nothing can scroll it.",
          "**A French label widened the menu.** The French pause button, Mettre les animations en pause, was too long for its 220 pixel column; the grid track grew to fit it and cut off everything else. `minmax(0, 1fr)` keeps the column at its width, and the label became Tout mettre en pause. Only a test run in both languages caught it.",
        ]],
        ['p', "None of this is exotic: two CSS properties, one observer, one rule for pausing. What made the difference was measuring before and after each change, on a phone profile, not on my desk."],
      ],
    },
    fr: {
      body: [
        ['p', "[Le lab](/lab) est une seule page avec " + LAB_COUNT + " animations, toutes en direct : des boutons qui ondulent, des chargements qui tournent, un globe, un tube à essai plein de bulles. Chacune est du vrai HTML et du CSS, parfois avec un peu de JavaScript, pas une vidéo. Une page pareille peut vite faire chauffer et ralentir un téléphone. Le test mobile de Lighthouse lui donne en général 97 en performance, avec moins d'un dixième de seconde de blocage. Trois choses l'y maintiennent."],
        ['h2', '1. Ne pas dessiner ce que personne ne voit'],
        ['p', "Avec `content-visibility: auto`, le navigateur saute la mise en page et le dessin d'une carte tant qu'elle est loin de l'écran. Avant, la page obtenait entre 90 et 95 ; après, 97. Le piège, c'est la barre de défilement : une carte sautée n'a pas de taille, et la page sauterait à mesure que les cartes apparaissent. `contain-intrinsic-size` donne à chaque carte une taille à garder en réserve, et le mot-clé `auto` retient sa vraie taille une fois qu'elle a été vue."],
        ['code', 'css', `.lab-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 470px;
}`],
        ['h2', "2. Mettre en pause ce qu'on ne voit pas"],
        ['p', "Sauter le dessin n'arrête pas les animations. Chaque carte se surveille avec un IntersectionObserver et se marque quand elle est près de l'écran ; tout le reste est mis en pause par une seule règle. Le bouton pause en haut de la page utilise la même règle pour toute la grille."],
        ['code', 'css', `.lab-card:not([data-inview]) .lab-stage *,
.lab-grid[data-paused] .lab-stage * {
  animation-play-state: paused !important;
}`],
        ['p', "Le JavaScript fait de même là où il anime lui-même : le globe ne demande des images que lorsqu'il est à l'écran, et ne redessine que si quelque chose a changé ; le tube à essai arrête d'en demander dès que son eau est immobile."],
        ['h2', '3. Une seule horloge pour tous'],
        ['p', "Quand une démo a besoin de JavaScript pour dessiner, son rythme vient quand même du CSS. La rotation du globe est une animation CSS d'une propriété typée que le canvas lit : la règle de pause, la règle hors écran et le mouvement réduit s'y appliquent sans une ligne de plus. J'en parle davantage dans [un vrai globe sur un canvas](/blog/a-real-globe-on-a-canvas)."],
        ['h2', 'Trois pièges dans lesquels je suis tombé'],
        ['ul', [
          "**Filtrer renvoyait en haut de la page.** Cliquer sur une catégorie remplace les cartes, et l'ancrage du défilement du navigateur choisissait une ancre à lui, souvent le haut de la page. `overflow-anchor: none` sur la grille le désactive, et la page fait défiler elle-même jusqu'aux résultats.",
          "**Une démo qui prenait le focus faisait défiler sa carte.** Avec `overflow: hidden`, un bouton qui reçoit le focus dans une carte peut encore faire défiler la carte pour se montrer : une démo s'est décalée de 58 pixels. `overflow: clip` coupe de la même façon, mais rien ne peut le faire défiler.",
          "**Un libellé français élargissait le menu.** « Mettre les animations en pause » était trop long pour sa colonne de 220 pixels ; la piste de la grille s'élargissait pour le contenir et coupait tout le reste. `minmax(0, 1fr)` garde la colonne à sa largeur, et le libellé est devenu « Tout mettre en pause ». Seul un test lancé dans les deux langues l'a vu.",
        ]],
        ['p', "Rien de tout ça n'est exotique : deux propriétés CSS, un observateur, une règle de pause. Ce qui a fait la différence, c'est de mesurer avant et après chaque changement, avec un profil de téléphone, pas sur mon bureau."],
      ],
    },
  },
  {
    slug: 'motion-that-serves',
    en: {
      body: [
        ['p', 'Animation is the part of an interface people feel before they notice it. Done well, it explains: where something came from, what just changed, what is still on its way. Done badly, it slows everyone down, and makes some people feel sick. These are the eight rules I check every animation against, with examples from [the lab](/lab).'],
        ['h2', '1. Every animation answers a question'],
        ['p', 'Did my click work? Where did this panel come from? Is something loading? An animation that answers none of these is decoration, and decoration has to be cheap and quiet. In the lab, the send button answers two questions in a row: the plane flying off says "it left", the green **Sent** says "it arrived".'],
        ['h2', '2. Fast in, faster out'],
        ['p', 'Most interface motion lives between 150 and 400 milliseconds. What arrives can take a little longer than what leaves: a menu that closes should never make anyone wait. Past half a second, keep motion for rare moments that are meant to be watched, like a success screen at the end of a form.'],
        ['h2', '3. Ease like the real world'],
        ['p', 'Nothing in the physical world starts or stops at full speed. Ease out (a quick start and a soft landing) for what arrives, ease in for what leaves, and a touch of overshoot for what is meant to feel playful, like the magnetic button springing back into place. Linear timing is for loops: spinners, progress bars, things that turn.'],
        ['h2', '4. Animate what the compositor can move'],
        ['p', '`transform` and `opacity`, and the newer `translate`, `rotate` and `scale`, can be moved by the graphics card without the browser laying out the page again. Animating `width`, `top` or `margin` makes it recalculate the layout on every frame, and on a mid-range phone that is where stutter comes from. In the lab, the download bar grows with `scale`, never with `width`.'],
        ['h2', '5. Respect "reduce motion"'],
        ['p', 'Some people get dizzy or nauseous from motion on a screen, and their device says so through `prefers-reduced-motion`. Every demo in the lab has a calm version: no movement, the same information. The finished state instead of the journey, a fade instead of a slide. It costs a few lines of CSS.'],
        ['code', 'css', `@media (prefers-reduced-motion: reduce) {
  /* No slide: the toast simply appears */
  .toast { animation: none; }

  /* The dots breathe instead of bouncing */
  .dots span { animation: breathe 1.4s ease-in-out infinite alternate; }
}

@keyframes breathe {
  from { opacity: 0.35; }
  to { opacity: 1; }
}`, 'A calm version keeps the meaning and drops the movement.'],
        ['h2', '6. Let people stop it'],
        ['p', 'The accessibility guidelines (WCAG 2.2.2) are clear: anything that moves on its own for more than five seconds, next to other content, needs a way to pause it. A loop running forever beside a paragraph distracts everyone and stops some people from reading at all. The lab has one pause button for every demo, and the floating stones of the [Eons rebuild](/projects/trimension-studio) have their own.'],
        ['h2', '7. Rest what nobody sees'],
        ['p', 'An animation off screen still costs battery and processor time. An Intersection Observer can mark what is visible, and CSS can pause everything else.'],
        ['code', 'js', `const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.toggleAttribute('data-inview', entry.isIntersecting)
  }
})
document.querySelectorAll('.demo').forEach((el) => observer.observe(el))`],
        ['code', 'css', `.demo:not([data-inview]) * {
  animation-play-state: paused;
}`, 'Off screen, every animation inside the demo waits where it is.'],
        ['h2', '8. Never hide the content behind the show'],
        ['p', 'Text that fades in from nothing is invisible for its first frames, and browsers measure it that way. On this site, starting the text of a project page at 35% opacity instead of 0 moved the measured Largest Contentful Paint from about 1.1 seconds to 0.2 seconds, for an effect that looks the same. Animate the arrival, never the availability.'],
        ['p', 'None of these rules makes motion less expressive. They make it trustworthy: it says something, it never gets in the way, and everyone can use the page, whatever their device or their body asks for.'],
      ],
    },
    fr: {
      body: [
        ['p', "L'animation est la partie d'une interface qu'on ressent avant de la remarquer. Bien faite, elle explique : d'où vient un élément, ce qui vient de changer, ce qui est encore en route. Mal faite, elle ralentit tout le monde, et donne la nausée à certains. Voici les huit règles auxquelles je confronte chaque animation, avec des exemples tirés du [lab](/lab)."],
        ['h2', '1. Chaque animation répond à une question'],
        ['p', "Mon clic a-t-il marché ? D'où sort ce panneau ? Quelque chose est-il en train de charger ? Une animation qui ne répond à aucune de ces questions est de la décoration, et la décoration doit rester légère et discrète. Dans le lab, le bouton d'envoi répond à deux questions d'affilée : l'avion qui s'envole dit « c'est parti », le **Sent** vert dit « c'est arrivé »."],
        ['h2', '2. Rapide à l\'entrée, plus rapide à la sortie'],
        ['p', "La plupart des mouvements d'interface durent entre 150 et 400 millisecondes. Ce qui arrive peut prendre un peu plus de temps que ce qui part : un menu qui se ferme ne doit jamais faire attendre. Au-delà d'une demi-seconde, gardez le mouvement pour des moments rares, faits pour être regardés, comme l'écran de réussite à la fin d'un formulaire."],
        ['h2', '3. Des courbes comme dans le monde réel'],
        ['p', "Dans le monde physique, rien ne démarre ni ne s'arrête à pleine vitesse. Une courbe qui ralentit à l'arrivée (ease out) pour ce qui entre, qui accélère au départ (ease in) pour ce qui sort, et un léger dépassement pour ce qui doit sembler joueur, comme le bouton magnétique qui revient en place. Le mouvement linéaire est fait pour les boucles : chargements, barres de progression, ce qui tourne."],
        ['h2', '4. Animer ce que le compositeur sait déplacer'],
        ['p', "`transform` et `opacity`, ainsi que les plus récents `translate`, `rotate` et `scale`, peuvent être déplacés par la carte graphique sans que le navigateur recalcule la mise en page. Animer `width`, `top` ou `margin` l'oblige à tout recalculer à chaque image, et sur un téléphone de milieu de gamme, c'est de là que viennent les saccades. Dans le lab, la barre de téléchargement grandit avec `scale`, jamais avec `width`."],
        ['h2', '5. Respecter « réduire les animations »'],
        ['p', "Certaines personnes ont des vertiges ou la nausée face au mouvement à l'écran, et leur appareil le signale avec `prefers-reduced-motion`. Chaque démo du lab a une version calme : pas de mouvement, la même information. L'état final plutôt que le trajet, un fondu plutôt qu'un glissement. Quelques lignes de CSS suffisent."],
        ['code', 'css', `@media (prefers-reduced-motion: reduce) {
  /* Pas de glissement : la notification apparaît, simplement */
  .toast { animation: none; }

  /* Les points respirent au lieu de rebondir */
  .dots span { animation: breathe 1.4s ease-in-out infinite alternate; }
}

@keyframes breathe {
  from { opacity: 0.35; }
  to { opacity: 1; }
}`, 'Une version calme garde le sens et laisse tomber le mouvement.'],
        ['h2', '6. Laisser l\'arrêter'],
        ['p', "Les règles d'accessibilité (WCAG 2.2.2) sont claires : tout ce qui bouge seul plus de cinq secondes, à côté d'autre contenu, doit pouvoir être mis en pause. Une boucle qui tourne sans fin à côté d'un paragraphe distrait tout le monde, et empêche certains de lire. Le lab a un bouton de pause pour toutes ses démos, et les roches flottantes de la [refonte d'Eons](/projects/trimension-studio) ont le leur."],
        ['h2', '7. Mettre au repos ce que personne ne voit'],
        ['p', "Une animation hors de l'écran coûte quand même de la batterie et du processeur. Un Intersection Observer peut marquer ce qui est visible, et le CSS mettre tout le reste en pause."],
        ['code', 'js', `const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.toggleAttribute('data-inview', entry.isIntersecting)
  }
})
document.querySelectorAll('.demo').forEach((el) => observer.observe(el))`],
        ['code', 'css', `.demo:not([data-inview]) * {
  animation-play-state: paused;
}`, "Hors de l'écran, chaque animation de la démo attend là où elle est."],
        ['h2', '8. Ne jamais cacher le contenu derrière le spectacle'],
        ['p', "Un texte qui apparaît en fondu depuis l'invisible est invisible pendant ses premières images, et les navigateurs le mesurent ainsi. Sur ce site, faire partir le texte des pages projet de 35 % d'opacité au lieu de 0 a fait passer le Largest Contentful Paint mesuré d'environ 1,1 seconde à 0,2 seconde, pour un effet qui a l'air identique. Animez l'arrivée, jamais la disponibilité."],
        ['p', "Aucune de ces règles ne rend le mouvement moins expressif. Elles le rendent fiable : il dit quelque chose, il ne gêne jamais, et tout le monde peut utiliser la page, quoi que demandent son appareil ou son corps."],
      ],
    },
  },
  {
    slug: 'scroll-driven-animations',
    en: {
      body: [
        ['p', 'In 2023 I built the Eons page for Trimension, a virtual reality game studio: a hand that follows the scroll and presses a gadget, and fragments of a shattered world floating around the text. In 2026 I reviewed that code and rebuilt both effects. The new version has no scroll listener at all.'],
        ['h2', 'What the old code did'],
        ['p', 'It listened to every scroll event, measured progress on the whole page (`scrollY / scrollHeight`), and wrote a new transform each time, with a 0.4 second transition to hide the jumps. Measured, the result was not what anyone intended: the hand stayed still, jumped a quarter of its height at once, then barely moved. And every scroll event read the layout and wrote a style, which is exactly the work a browser would rather not do while you scroll.'],
        ['h2', 'The new idea: let the browser drive'],
        ['p', 'A view timeline follows an element as it crosses the screen: 0% when it enters at the bottom, 100% when it leaves at the top. Bind keyframes to it, and the browser plays them from the scroll position itself, off the main thread.'],
        ['code', 'css', `.scene {
  view-timeline: --scene block;
}

.hand {
  animation: reach linear both;
  animation-timeline: --scene;
}

@keyframes reach {
  0%, 20% { translate: 60% -22%; rotate: 12deg; opacity: 0; }
  47% { translate: 15.5% 9%; rotate: 2.5deg; }
  53%, 100% { translate: 13.9% 14.5%; rotate: 0deg; }
}`, 'The percentages are places on the screen, not moments in time.'],
        ['p', 'Read the keyframes as positions. Between 0 and 20% the scene is still coming up from the bottom of the screen, so the hand waits out of sight. It reaches the gadget as the scene crosses the middle, and presses it at 53%. Scroll back up and it plays backwards, for free.'],
        ['h2', 'For browsers that cannot yet'],
        ['p', 'Chrome, Edge and Safari play scroll-driven animations natively. For the others, the same keyframes can be scrubbed by hand: a paused animation of one second, moved with a negative delay. A delay of -0.5s places it exactly halfway.'],
        ['code', 'css', `@supports not (animation-timeline: view()) {
  .hand {
    animation-play-state: paused;
    animation-delay: calc(var(--progress, 0) * -1s);
  }
}`],
        ['p', 'A few lines of JavaScript set `--progress`, at most once per frame, and only while the scene is on screen.'],
        ['code', 'js', `const update = () => {
  const { top, height } = scene.getBoundingClientRect()
  const progress = (innerHeight - top) / (innerHeight + height)
  scene.style.setProperty('--progress', Math.min(1, Math.max(0, progress)))
}`, 'The same 0 to 1 as the view timeline: entering at the bottom, leaving at the top.'],
        ['h2', 'Two traps I fell into'],
        ['ul', [
          '**The shorthand resets the timeline.** `animation: reach 1s linear both` sets `animation-timeline` back to auto. Declare the timeline after the shorthand, or inside an `@supports` block that comes later.',
          '**An arm that never appeared.** In Chrome, an image that starts at opacity 0 inside a scroll-driven animation could stay unpainted once it became visible. Giving it its own layer from the start (`will-change: transform, opacity`) fixed it.',
        ]],
        ['h2', 'The result'],
        ['p', 'Checked at ten screen sizes, from 320 pixels to a wide desktop: the hand follows its own scene from start to finish, the fragments float without ever covering the text, the animations run on the compositor, and visitors who ask for less motion get the finished picture. The old version did not survive the same test on any of them.'],
      ],
    },
    fr: {
      body: [
        ['p', "En 2023, j'ai réalisé la page Eons pour Trimension, un studio de jeux en réalité virtuelle : une main qui suit le défilement et appuie sur un gadget, et les fragments d'un monde brisé qui flottent autour du texte. En 2026, j'ai relu ce code et refait les deux effets. La nouvelle version n'a plus aucun écouteur de défilement."],
        ['h2', "Ce que faisait l'ancien code"],
        ['p', "Il écoutait chaque événement de défilement, mesurait la progression sur toute la page (`scrollY / scrollHeight`) et écrivait une nouvelle transformation à chaque fois, avec une transition de 0,4 seconde pour masquer les sauts. Mesuré, le résultat n'était pas celui voulu : la main restait immobile, sautait d'un quart de sa hauteur d'un coup, puis ne bougeait presque plus. Et chaque événement lisait la mise en page et écrivait un style : exactement le travail qu'un navigateur préfère éviter pendant qu'on fait défiler."],
        ['h2', "La nouvelle idée : laisser le navigateur conduire"],
        ['p', "Une view timeline suit un élément pendant qu'il traverse l'écran : 0 % quand il entre par le bas, 100 % quand il sort par le haut. On y attache des keyframes, et le navigateur les joue lui-même à partir de la position de défilement, hors du fil principal."],
        ['code', 'css', `.scene {
  view-timeline: --scene block;
}

.hand {
  animation: reach linear both;
  animation-timeline: --scene;
}

@keyframes reach {
  0%, 20% { translate: 60% -22%; rotate: 12deg; opacity: 0; }
  47% { translate: 15.5% 9%; rotate: 2.5deg; }
  53%, 100% { translate: 13.9% 14.5%; rotate: 0deg; }
}`, "Les pourcentages sont des positions à l'écran, pas des instants."],
        ['p', "Lisez les keyframes comme des positions. Entre 0 et 20 %, la scène monte encore depuis le bas de l'écran : la main attend, hors de vue. Elle atteint le gadget quand la scène passe au milieu, et appuie à 53 %. Remontez, et tout se rejoue à l'envers, sans rien coder."],
        ['h2', 'Pour les navigateurs qui ne savent pas encore'],
        ['p', "Chrome, Edge et Safari jouent nativement les animations pilotées par le défilement. Pour les autres, on peut faire défiler les mêmes keyframes à la main : une animation d'une seconde, en pause, déplacée par un délai négatif. Un délai de -0,5 s la place exactement à mi-chemin."],
        ['code', 'css', `@supports not (animation-timeline: view()) {
  .hand {
    animation-play-state: paused;
    animation-delay: calc(var(--progress, 0) * -1s);
  }
}`],
        ['p', "Quelques lignes de JavaScript fixent `--progress`, au plus une fois par image, et seulement quand la scène est à l'écran."],
        ['code', 'js', `const update = () => {
  const { top, height } = scene.getBoundingClientRect()
  const progress = (innerHeight - top) / (innerHeight + height)
  scene.style.setProperty('--progress', Math.min(1, Math.max(0, progress)))
}`, 'Le même 0 à 1 que la view timeline : entrée par le bas, sortie par le haut.'],
        ['h2', 'Deux pièges dans lesquels je suis tombé'],
        ['ul', [
          "**Le raccourci remet la timeline à zéro.** `animation: reach 1s linear both` remet `animation-timeline` sur auto. Déclarez la timeline après le raccourci, ou dans un bloc `@supports` placé plus loin.",
          "**Un bras qui n'apparaissait jamais.** Dans Chrome, une image qui démarre à 0 d'opacité dans une animation au défilement pouvait rester non dessinée une fois visible. Lui donner son propre calque dès le départ (`will-change: transform, opacity`) a réglé le problème.",
        ]],
        ['h2', 'Le résultat'],
        ['p', "Vérifié sur dix tailles d'écran, de 320 pixels à un grand écran d'ordinateur : la main suit sa propre scène du début à la fin, les fragments flottent sans jamais recouvrir le texte, les animations tournent sur le compositeur, et les visiteurs qui demandent moins de mouvement voient l'image finale. L'ancienne version ne passait ce test sur aucune d'elles."],
      ],
    },
  },
  {
    slug: 'ai-suggests-people-decide',
    en: {
      body: [
        ['p', 'AccessEU, my Shopify app for the European Accessibility Act, uses AI in exactly one place: describing product photos for people who use a screen reader. It would be easy to let a model write those descriptions straight into the store. I chose not to, and the reasons apply to most AI features.'],
        ['h2', 'Why photos need words'],
        ['p', 'A screen reader reads a photo\'s alternative text aloud. Without it, a blind shopper hears nothing where the product should be. A catalogue can hold thousands of photos, and nobody writes thousands of descriptions by hand. It is a real job for AI, and a risky one: a wrong description is worse than none, because it tells a shopper something false about what they are buying.'],
        ['h2', '1. The AI fills the field, a person saves it'],
        ['p', 'Suggestions only fill the text fields on the app\'s Image descriptions page. The merchant reads them, edits what needs editing, and saves them like any description they would have written. Nothing reaches the store without a human decision.'],
        ['h2', '2. One instruction for the whole catalogue'],
        ['p', 'Every photo gets the same instructions, so descriptions read consistently across thousands of products. They are short and specific: say what matters to a shopper, describe only what is visible, guess nothing.'],
        ['code', 'text', `Say what the photo shows that matters to a shopper: the product,
its colour, material or pattern, and the view or detail shown.
Describe only what you can see. Do not guess brands, materials or
sizes that are not visible, and do not add marketing language,
prices or opinions.`, 'An extract of the instructions the model receives with every photo.'],
        ['h2', '3. Never let the model fetch the world'],
        ['p', 'Only images from Shopify\'s own image servers are sent, resized to 800 pixels wide: plenty to describe a product, and a smaller, cheaper request. The app never asks the model to open an address it did not choose.'],
        ['h2', '4. Clean what comes back'],
        ['p', 'Answers are tidied before they reach the field: one line, no "Alt text:" label, no wrapping quotes, no "Image of", within Shopify\'s limit of 512 characters. A quote that opens a slogan printed on a T-shirt stays.'],
        ['h2', '5. Make cost a product decision'],
        ['p', 'Each plan has a monthly allowance of descriptions. The model is a setting: the most capable one by default, and a cheaper one that costs about forty times less, with a plain recommendation: compare both on twenty of your own photos before choosing.'],
        ['h2', 'Where AI helps without touching anything'],
        ['p', 'For problems in a theme\'s code, the app changes nothing itself. It writes a brief, with the failing element and its CSS selector, that the merchant can send to a developer or paste into an AI assistant. The AI helps; the person stays in charge of their store.'],
        ['p', 'Trust in an AI feature is designed, not hoped for: a human decision before anything is published, one clear instruction, a narrow input, a cleaned output, and a cost someone chose on purpose.'],
      ],
    },
    fr: {
      body: [
        ['p', "AccessEU, mon app Shopify pour l'European Accessibility Act, utilise l'IA à un seul endroit : décrire les photos produit pour les personnes qui utilisent un lecteur d'écran. Il serait facile de laisser un modèle écrire ces descriptions directement dans la boutique. J'ai choisi de ne pas le faire, et les raisons valent pour la plupart des fonctions d'IA."],
        ['h2', 'Pourquoi les photos ont besoin de mots'],
        ['p', "Un lecteur d'écran lit à voix haute le texte alternatif d'une photo. Sans lui, un client aveugle n'entend rien là où devrait être le produit. Un catalogue peut compter des milliers de photos, et personne n'écrit des milliers de descriptions à la main. C'est un vrai travail pour l'IA, et un travail risqué : une mauvaise description est pire que rien, parce qu'elle dit au client quelque chose de faux sur ce qu'il achète."],
        ['h2', "1. L'IA remplit le champ, une personne l'enregistre"],
        ['p', "Les suggestions remplissent seulement les champs de texte de la page Descriptions d'images de l'app. Le marchand les lit, corrige ce qui doit l'être, et les enregistre comme une description qu'il aurait écrite. Rien n'arrive dans la boutique sans une décision humaine."],
        ['h2', '2. Une seule consigne pour tout le catalogue'],
        ['p', "Chaque photo reçoit les mêmes consignes, pour que les descriptions restent cohérentes sur des milliers de produits. Elles sont courtes et précises : dire ce qui compte pour un client, ne décrire que ce qui est visible, ne rien deviner."],
        ['code', 'text', `Say what the photo shows that matters to a shopper: the product,
its colour, material or pattern, and the view or detail shown.
Describe only what you can see. Do not guess brands, materials or
sizes that are not visible, and do not add marketing language,
prices or opinions.`, "Un extrait des consignes que le modèle reçoit avec chaque photo (en anglais, comme dans l'app)."],
        ['h2', '3. Ne jamais laisser le modèle aller chercher le monde'],
        ['p', "Seules les images des serveurs d'images de Shopify sont envoyées, réduites à 800 pixels de large : largement assez pour décrire un produit, et une requête plus petite, moins chère. L'app ne demande jamais au modèle d'ouvrir une adresse qu'elle n'a pas choisie."],
        ['h2', '4. Nettoyer ce qui revient'],
        ['p', "Les réponses sont nettoyées avant d'arriver dans le champ : une seule ligne, pas d'étiquette « Alt text: », pas de guillemets autour, pas de « Image of », dans la limite de 512 caractères de Shopify. Un guillemet qui ouvre un slogan imprimé sur un t-shirt reste."],
        ['h2', '5. Faire du coût une décision produit'],
        ['p', "Chaque formule a un quota mensuel de descriptions. Le modèle est un réglage : le plus capable par défaut, et un modèle environ quarante fois moins cher, avec une recommandation simple : comparer les deux sur vingt de vos propres photos avant de choisir."],
        ['h2', "Là où l'IA aide sans rien toucher"],
        ['p', "Pour les problèmes dans le code d'un thème, l'app ne modifie rien elle-même. Elle rédige un brief, avec l'élément fautif et son sélecteur CSS, que le marchand peut envoyer à un développeur ou coller dans un assistant IA. L'IA aide ; la personne reste maître de sa boutique."],
        ['p', "La confiance dans une fonction d'IA se conçoit, elle ne s'espère pas : une décision humaine avant toute publication, une consigne claire, une entrée étroite, une sortie nettoyée, et un coût choisi en connaissance de cause."],
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
