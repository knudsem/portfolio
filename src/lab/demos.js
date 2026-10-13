// The lab's demos: the markup each one runs (also what the code panel
// shows), its category, the techniques it uses, and its name and note in
// both languages. Styles are in demos.css, behaviours in scripts.js, both
// marked per demo.

export const CATEGORIES = ['buttons', 'scroll', 'loaders', 'text', 'cards', 'inputs', 'feedback']

const letters = (text) => [...text].map((ch, i) => `<span style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')
// n empty elements numbered by --i, one per line, inside a parent indented by `indent`
const each = (n, tag, indent) => `\n${Array.from({ length: n }, (_, i) => `${indent}  <${tag} style="--i:${i}"></${tag}>`).join('\n')}\n${indent}`

export const DEMOS = [
  // Buttons
  {
    id: 'btn-shine',
    cat: 'buttons',
    tech: ['CSS'],
    html: '<button class="lb-shine" type="button">Get started</button>',
    title: { en: 'Shine', fr: 'Reflet' },
    note: { en: 'A streak of light crosses the button now and then; it lifts when pointed at.', fr: 'Un reflet traverse le bouton de temps en temps ; il se soulève au survol.' },
  },
  {
    id: 'btn-border',
    cat: 'buttons',
    tech: ['CSS', '@property'],
    html: '<button class="lb-border" type="button"><span>Explore the lab</span></button>',
    title: { en: 'Turning border', fr: 'Bordure tournante' },
    note: { en: 'A conic gradient turns around the edge, with its own glow. The angle is a typed custom property, so it can animate.', fr: "Un dégradé conique tourne sur le contour, avec son halo. L'angle est une propriété personnalisée typée, donc animable." },
  },
  {
    id: 'btn-fill',
    cat: 'buttons',
    tech: ['CSS', 'JS'],
    html: '<button class="lb-fill" type="button">Hover me</button>',
    title: { en: 'Fill from the pointer', fr: 'Remplissage depuis le curseur' },
    note: { en: 'The colour grows from the exact point where the pointer comes in, and leaves where it goes out.', fr: "La couleur naît du point exact où le curseur entre, et repart par où il sort." },
  },
  {
    id: 'btn-magnetic',
    cat: 'buttons',
    tech: ['CSS', 'JS'],
    html: '<div class="lb-magnet-zone">\n  <button class="lb-magnet" type="button"><span>Let\'s talk</span></button>\n</div>',
    title: { en: 'Magnetic', fr: 'Magnétique' },
    note: { en: 'The button leans towards the pointer, its label a little further, and springs back.', fr: "Le bouton se penche vers le curseur, son texte un peu plus, puis revient comme un ressort." },
  },
  {
    id: 'btn-send',
    cat: 'buttons',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<button class="lb-send" type="button">
  <svg class="lb-send-plane" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.6 21 3l-6.4 18-3.1-7.4z"/></svg>
  <span class="lb-send-label">Send</span>
  <span class="lb-send-done" aria-hidden="true">Sent</span>
</button>
<p class="lb-send-status" role="status"></p>`,
    title: { en: 'Send', fr: 'Envoyer' },
    note: { en: 'Click: the plane takes off, the label gives way to the confirmation, and screen readers hear it.', fr: "Au clic, l'avion décolle, le texte laisse place à la confirmation, annoncée aux lecteurs d'écran." },
  },
  {
    id: 'btn-like',
    cat: 'buttons',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<button class="lb-like" type="button" aria-pressed="false" aria-label="Like">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.3-9.2C1.6 8 3.6 4.9 6.8 4.9c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.2 0 5.2 3.1 4.1 6.2-1.7 4.6-9.3 9.2-9.3 9.2z"/></svg>
  <span class="lb-like-burst" aria-hidden="true">${each(8, 'i', '  ')}</span>
</button>`,
    title: { en: 'Like', fr: "J'aime" },
    note: { en: 'A real toggle (aria-pressed): the heart pops, a ring and eight sparks burst out.', fr: 'Un vrai bouton à bascule (aria-pressed) : le cœur bondit, un anneau et huit étincelles jaillissent.' },
  },
  {
    id: 'btn-download',
    cat: 'buttons',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<button class="lb-dl" type="button">
  <span class="lb-dl-bar" aria-hidden="true"></span>
  <span class="lb-dl-label">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>
    <span class="lb-dl-text" aria-live="polite">Download</span>
  </span>
</button>`,
    title: { en: 'Download progress', fr: 'Progression de téléchargement' },
    note: { en: 'The button itself becomes the progress bar, then a tick draws itself.', fr: 'Le bouton devient lui-même la barre de progression, puis une coche se dessine.' },
  },
  {
    id: 'btn-roll',
    cat: 'buttons',
    tech: ['CSS'],
    html: `<button class="lb-roll" type="button" aria-label="View the project">
  <span class="lb-roll-text" aria-hidden="true">${letters('View the project')}</span>
</button>`,
    title: { en: 'Rolling letters', fr: 'Lettres qui roulent' },
    note: { en: 'On hover each letter rolls up to reveal its copy, one after another.', fr: 'Au survol, chaque lettre roule pour laisser place à sa copie, l\'une après l\'autre.' },
  },

  // Scroll cues
  {
    id: 'scroll-mouse',
    cat: 'scroll',
    tech: ['CSS'],
    html: '<div class="lb-mouse" role="img" aria-label="Scroll down"></div>',
    title: { en: 'Mouse wheel', fr: 'Molette' },
    note: { en: 'The classic: a wheel rolls down and fades, on a loop.', fr: 'Le classique : une molette descend et s\'efface, en boucle.' },
  },
  {
    id: 'scroll-chevrons',
    cat: 'scroll',
    tech: ['CSS'],
    html: `<div class="lb-chevrons" role="img" aria-label="Scroll down">${each(3, 'span', '')}</div>`,
    title: { en: 'Cascading chevrons', fr: 'Chevrons en cascade' },
    note: { en: 'Three chevrons light up in turn, pointing the way.', fr: "Trois chevrons s'allument tour à tour pour montrer le chemin." },
  },
  {
    id: 'scroll-line',
    cat: 'scroll',
    tech: ['CSS'],
    html: '<div class="lb-line" role="img" aria-label="Scroll down">Scroll<span></span></div>',
    title: { en: 'Falling light', fr: 'Goutte de lumière' },
    note: { en: 'A drop of light runs down a thin line. Quiet enough for a luxury site.', fr: 'Une goutte de lumière glisse le long d\'un fil. Assez discret pour un site haut de gamme.' },
  },
  {
    id: 'scroll-circle',
    cat: 'scroll',
    tech: ['CSS', 'SVG'],
    html: `<div class="lb-circle" role="img" aria-label="Scroll down">
  <svg class="lb-circle-text" viewBox="0 0 120 120" aria-hidden="true">
    <path id="lb-circle-path" fill="none" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/>
    <text><textPath href="#lb-circle-path" textLength="286">SCROLL DOWN · SCROLL DOWN · SCROLL DOWN ·</textPath></text>
  </svg>
  <svg class="lb-circle-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6"/></svg>
</div>`,
    title: { en: 'Turning words', fr: 'Texte circulaire' },
    note: { en: 'Text set on a circle (SVG textPath) turns slowly around a bobbing arrow.', fr: 'Un texte posé sur un cercle (textPath SVG) tourne lentement autour d\'une flèche qui oscille.' },
  },
  {
    id: 'scroll-progress',
    cat: 'scroll',
    tech: ['CSS', 'scroll-driven'],
    html: `<div class="lb-read" role="region" tabindex="0" aria-label="Sample article, scroll it">
  <div class="lb-read-bar"></div>
  <p>Scroll this box: the bar above follows your reading.</p>
  <p>The browser draws it from the scroll position itself, with a scroll-driven animation. No scroll listener, no main thread work.</p>
  <p>Browsers that cannot do it yet get the same bar from a few lines of script.</p>
  <p>That is progressive enhancement: the best version where possible, a good one everywhere.</p>
</div>`,
    title: { en: 'Reading progress', fr: 'Progression de lecture' },
    note: { en: 'Scroll inside the box: the bar is a scroll-driven animation, played by the browser.', fr: 'Faites défiler la boîte : la barre est une animation pilotée par le défilement, jouée par le navigateur.' },
  },

  // Loaders
  {
    id: 'loader-dots',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-dots" role="status" aria-label="Loading">${each(3, 'span', '')}</div>`,
    title: { en: 'Bouncing dots', fr: 'Points rebondissants' },
    note: { en: 'Each dot squashes as it lands, which is what makes a bounce feel real.', fr: "Chaque point s'écrase en touchant le sol : c'est ce qui rend le rebond crédible." },
  },
  {
    id: 'loader-orbit',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-orbit" role="status" aria-label="Loading">${each(3, 'span', '')}</div>`,
    title: { en: 'Orbits', fr: 'Orbites' },
    note: { en: 'Three dots on three orbits, each at its own speed.', fr: 'Trois points sur trois orbites, chacun à sa vitesse.' },
  },
  {
    id: 'loader-bars',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-bars" role="status" aria-label="Loading">${each(5, 'span', '')}</div>`,
    title: { en: 'Equaliser', fr: 'Égaliseur' },
    note: { en: 'Five bars, five unrelated rhythms: it never looks like a loop.', fr: 'Cinq barres, cinq rythmes sans rapport : on ne voit jamais la boucle.' },
  },
  {
    id: 'loader-morph',
    cat: 'loaders',
    tech: ['CSS'],
    html: '<div class="lb-morph" role="status" aria-label="Loading"></div>',
    title: { en: 'Morph', fr: 'Métamorphose' },
    note: { en: 'A square becomes a circle, then a leaf, turning and changing colour.', fr: 'Un carré devient cercle puis feuille, en tournant et en changeant de couleur.' },
  },
  {
    id: 'loader-draw',
    cat: 'loaders',
    tech: ['CSS', 'SVG'],
    html: `<svg class="lb-draw" viewBox="0 0 150 60" role="img" aria-label="Loading">
  <path pathLength="1" d="M6 40c14-30 26-30 34 0s20 30 34 0 26-30 34 0 18 18 36-6"/>
</svg>`,
    title: { en: 'Line drawing', fr: 'Trait qui se dessine' },
    note: { en: 'A path drawn and wiped end to end. pathLength="1" turns every length into a simple fraction.', fr: 'Un tracé dessiné puis effacé de bout en bout. pathLength="1" ramène chaque longueur à une simple fraction.' },
  },

  // Text
  {
    id: 'text-rise',
    cat: 'text',
    tech: ['CSS'],
    replay: true,
    html: `<p class="lb-rise">
  <span class="lb-rise-sr">Make it move</span>
  <span aria-hidden="true"><span class="lb-rise-word">${letters('Make')}</span> <span class="lb-rise-word">${letters('it')}</span> <span class="lb-rise-word">${letters('move')}</span></span>
</p>`,
    title: { en: 'Rising letters', fr: 'Lettres qui montent' },
    note: { en: 'Letters rise out of a mask one by one. The sentence stays whole for screen readers.', fr: 'Les lettres sortent d\'un masque une à une. La phrase reste entière pour les lecteurs d\'écran.' },
  },
  {
    id: 'text-scramble',
    cat: 'text',
    tech: ['CSS', 'JS'],
    replay: true,
    html: '<p class="lb-scramble" data-text="Decoding the future"></p>',
    title: { en: 'Decoding', fr: 'Décodage' },
    note: { en: 'Random glyphs settle, letter by letter, into the real words.', fr: 'Des signes au hasard se fixent, lettre après lettre, en vrais mots.' },
  },
  {
    id: 'text-gradient',
    cat: 'text',
    tech: ['CSS'],
    html: '<p class="lb-gradient-text">Interfaces that move</p>',
    title: { en: 'Flowing gradient', fr: 'Dégradé qui coule' },
    note: { en: 'The gradient flows through the letters (background-clip: text).', fr: 'Le dégradé coule dans les lettres (background-clip: text).' },
  },
  {
    id: 'text-type',
    cat: 'text',
    tech: ['CSS'],
    html: '<p class="lb-type">Hello, I build things.</p>',
    title: { en: 'Typewriter', fr: 'Machine à écrire' },
    note: { en: 'Typed, held, erased, in pure CSS: the width grows one character at a time.', fr: 'Tapé, tenu, effacé, en pur CSS : la largeur grandit d\'un caractère à la fois.' },
  },
  {
    id: 'text-marker',
    cat: 'text',
    tech: ['CSS'],
    replay: true,
    html: '<p class="lb-marker">Design that <mark style="--i:0">ships</mark>, code that <mark style="--i:1">moves</mark>.</p>',
    title: { en: 'Highlighter', fr: 'Surligneur' },
    note: { en: 'A marker stroke sweeps under each key word, in turn.', fr: 'Un coup de surligneur passe sous chaque mot clé, tour à tour.' },
  },

  // Cards
  {
    id: 'card-tilt',
    cat: 'cards',
    tech: ['CSS', 'JS'],
    html: '<div class="lb-tilt">\n  <div class="lb-tilt-card">Move over me</div>\n</div>',
    title: { en: '3D tilt', fr: 'Inclinaison 3D' },
    note: { en: 'The card turns towards the pointer, with a glare that follows.', fr: 'La carte se tourne vers le curseur, avec un reflet qui suit.' },
  },
  {
    id: 'card-spotlight',
    cat: 'cards',
    tech: ['CSS', 'JS'],
    html: '<div class="lb-spot">\n  <strong>Spotlight</strong>\n  The border lights up where the pointer is.\n</div>',
    title: { en: 'Spotlight border', fr: 'Bordure projecteur' },
    note: { en: 'Only the border catches the light: a radial gradient, masked to the edge.', fr: 'Seule la bordure prend la lumière : un dégradé radial masqué sur le contour.' },
  },
  {
    id: 'card-flip',
    cat: 'cards',
    tech: ['CSS', 'JS'],
    html: `<button class="lb-flip" type="button" aria-pressed="false">
  <span class="lb-flip-inner">
    <span class="lb-flip-front">Front</span>
    <span class="lb-flip-back">And the back</span>
  </span>
</button>`,
    title: { en: 'Flip card', fr: 'Carte qui se retourne' },
    note: { en: 'Click, tap or press Enter to turn it over; on hover it leans, as a hint.', fr: "Un clic, un toucher ou la touche Entrée la retournent ; au survol, elle pivote un peu, comme un indice." },
  },
  {
    id: 'card-reveal',
    cat: 'cards',
    tech: ['CSS'],
    html: `<figure class="lb-reveal" tabindex="0">
  <span class="lb-reveal-hint" aria-hidden="true">Hover me</span>
  <span class="lb-reveal-picture" role="img" aria-label="An aurora of pink, teal and violet light"></span>
  <figcaption class="lb-reveal-caption">Aurora, 2026</figcaption>
</figure>`,
    title: { en: 'Curtain reveal', fr: 'Rideau' },
    note: { en: 'The picture opens like a curtain (clip-path), the caption slides in after it.', fr: "L'image s'ouvre comme un rideau (clip-path), la légende glisse juste après." },
  },

  // Inputs and toggles
  {
    id: 'toggle-daynight',
    cat: 'inputs',
    tech: ['CSS', 'JS'],
    html: `<button class="lb-dn" type="button" role="switch" aria-checked="false" aria-label="Dark mode">
  <span class="lb-dn-stars" aria-hidden="true">${each(3, 'i', '  ')}</span>
  <span class="lb-dn-knob" aria-hidden="true"></span>
</button>`,
    title: { en: 'Day and night', fr: 'Jour et nuit' },
    note: { en: 'A real switch: the sun slides over and becomes the moon, the stars come out.', fr: 'Un vrai interrupteur : le soleil glisse et devient lune, les étoiles apparaissent.' },
  },
  {
    id: 'input-float',
    cat: 'inputs',
    tech: ['CSS'],
    html: '<label class="lb-float">\n  <input type="email" placeholder=" " autocomplete="email" />\n  <span>Email address</span>\n</label>',
    title: { en: 'Floating label', fr: 'Étiquette flottante' },
    note: { en: 'The label floats up when the field is focused or filled; the underline grows from the middle.', fr: "L'étiquette remonte quand le champ est actif ou rempli ; le soulignement part du centre." },
  },
  {
    id: 'checkbox-draw',
    cat: 'inputs',
    tech: ['CSS', 'SVG'],
    html: `<label class="lb-check">
  <input type="checkbox" />
  <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="1" y="1" width="26" height="26" rx="7"/><path pathLength="1" d="M8 14.5l4 4 8-9"/></svg>
  Remember me
</label>`,
    title: { en: 'Drawn checkbox', fr: 'Case dessinée' },
    note: { en: 'A real checkbox underneath: the box pops, the tick draws itself.', fr: 'Une vraie case à cocher dessous : la case bondit, la coche se dessine.' },
  },

  // Feedback
  {
    id: 'toast',
    cat: 'feedback',
    tech: ['CSS', 'SVG'],
    replay: true,
    html: `<div class="lb-toast" role="status">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
  <strong>Saved</strong>
  <span>Your changes are live.</span>
</div>`,
    title: { en: 'Toast', fr: 'Notification' },
    note: { en: 'In, a few seconds to read (the bar shows how long), out.', fr: 'Elle arrive, laisse le temps de lire (la barre le montre), et repart.' },
  },
  {
    id: 'success',
    cat: 'feedback',
    tech: ['CSS', 'SVG'],
    replay: true,
    html: `<div class="lb-success" role="img" aria-label="Done">
  <svg viewBox="0 0 96 96" aria-hidden="true">
    <circle pathLength="1" cx="48" cy="48" r="40"/>
    <path pathLength="1" d="M31 49l12 12 23-25"/>
  </svg>${each(7, 'i', '').replace(/\n$/, '')}
</div>`,
    title: { en: 'Success', fr: 'Réussite' },
    note: { en: 'The circle draws, the tick follows, sparks pop: for the end of a form.', fr: 'Le cercle se trace, la coche suit, des étincelles éclatent : pour la fin d\'un formulaire.' },
  },
  {
    id: 'envelope',
    cat: 'feedback',
    tech: ['CSS'],
    replay: true,
    html: `<div class="lb-envelope" role="img" aria-label="An envelope opens and a letter comes out">
  <div class="lb-envelope-back"></div>
  <div class="lb-envelope-letter">You've got mail</div>
  <div class="lb-envelope-front"></div>
  <div class="lb-envelope-flap"></div>
</div>`,
    title: { en: 'Envelope', fr: 'Enveloppe' },
    note: { en: 'From my archive (2021, then in anime.js), rebuilt in plain CSS: the flap opens, the letter rises.', fr: "Tirée de mes archives (2021, alors en anime.js), refaite en CSS pur : le rabat s'ouvre, la lettre sort." },
  },
]
