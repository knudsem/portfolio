// The lab's demos: the markup each one runs (also what the code panel
// shows), its category, the techniques it uses, and its name and note in
// both languages. Styles are in demos.css, behaviours in scripts.js, both
// marked per demo.

export const CATEGORIES = ['buttons', 'icons', 'text', 'loaders', 'cards', 'navigation', 'inputs', 'feedback', 'scroll', 'backgrounds', 'archive']

const letters = (text) => [...text].map((ch, i) => `<span style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')
// n empty elements numbered by --i, one per line, inside a parent indented by `indent`
const each = (n, tag, indent) => `\n${Array.from({ length: n }, (_, i) => `${indent}  <${tag} style="--i:${i}"></${tag}>`).join('\n')}\n${indent}`

const LIST = [
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
    cat: 'archive',
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
  // Buttons, more
  {
    id: 'btn-ripple',
    cat: 'buttons',
    tech: ['CSS', 'JS'],
    html: '<button class="lb-ripple" type="button">Click anywhere on me</button>',
    title: { en: 'Ripple', fr: 'Onde' },
    note: { en: 'A wave grows from the exact point of the click (from the middle with the keyboard) and fades.', fr: "Une onde naît du point exact du clic (du centre au clavier) et s'efface." },
  },
  {
    id: 'btn-arrow',
    cat: 'buttons',
    tech: ['CSS', 'SVG'],
    html: `<button class="lb-arrow" type="button">
  Read the case study
  <span class="lb-arrow-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </span>
</button>`,
    title: { en: 'Arrow through', fr: 'Flèche qui traverse' },
    note: { en: 'On hover or focus, the arrow leaves on the right and a new one comes in from the left.', fr: 'Au survol ou au focus, la flèche sort par la droite et une autre entre par la gauche.' },
  },
  {
    id: 'btn-underline',
    cat: 'buttons',
    tech: ['CSS'],
    html: '<p class="lb-uline-text">Read the <a class="lb-uline" href="/blog">notes on the blog</a> for the details.</p>',
    title: { en: 'Link underline', fr: 'Soulignement de lien' },
    note: { en: 'A quiet line at rest (a link must look like one), a bright one that draws in from the left and leaves on the right.', fr: "Un trait discret au repos (un lien doit se voir), un trait vif qui se dessine depuis la gauche et repart par la droite." },
  },
  {
    id: 'btn-press',
    cat: 'buttons',
    tech: ['CSS'],
    html: '<button class="lb-press" type="button"><span>Press me</span></button>',
    title: { en: 'Pressable', fr: 'À enfoncer' },
    note: { en: 'A key with depth: it rises a little when pointed at, and sinks when pressed.', fr: "Une touche avec de l'épaisseur : elle monte un peu au survol, et s'enfonce quand on appuie." },
  },
  {
    id: 'btn-copy',
    cat: 'buttons',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<div class="lb-copy">
  <code>npm create vite@latest</code>
  <button type="button" aria-label="Copy the command">
    <svg class="lb-copy-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>
    <svg class="lb-copy-done" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7"/></svg>
  </button>
  <p class="lb-copy-status" role="status"></p>
</div>`,
    title: { en: 'Copy', fr: 'Copier' },
    note: { en: 'Copies for real; the icon turns into a tick, and screen readers hear "Copied".', fr: "Copie pour de vrai ; l'icône devient une coche, et les lecteurs d'écran entendent « Copié »." },
  },
  {
    id: 'btn-loading',
    cat: 'buttons',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<button class="lb-load" type="button">
  <span class="lb-load-label">Save changes</span>
  <span class="lb-load-spin" aria-hidden="true"></span>
  <svg class="lb-load-done" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7"/></svg>
</button>
<p class="lb-load-status" role="status"></p>`,
    title: { en: 'Saving', fr: 'Enregistrement' },
    note: { en: 'Click: the label gives way to a spinner, then to a tick. The button says it is busy, and the result is announced.', fr: "Au clic, le texte laisse place à un indicateur, puis à une coche. Le bouton signale qu'il travaille, et le résultat est annoncé." },
  },
  {
    id: 'btn-expand',
    cat: 'buttons',
    tech: ['CSS', 'SVG'],
    html: `<button class="lb-expand" type="button">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
  <span>Add to cart</span>
</button>`,
    title: { en: 'Expanding', fr: 'Qui se déploie' },
    note: { en: 'A round icon button that opens into its full label on hover or focus. The name is always there for screen readers.', fr: "Un bouton rond qui s'ouvre sur son libellé complet au survol ou au focus. Le nom reste toujours lisible par les lecteurs d'écran." },
  },
  // Icons
  {
    id: 'icon-burger',
    cat: 'icons',
    tech: ['CSS', 'JS'],
    html: `<button class="lb-burger" type="button" aria-expanded="false" aria-label="Menu">
  <span></span>
  <span></span>
  <span></span>
</button>`,
    title: { en: 'Menu to close', fr: 'Menu vers fermer' },
    note: { en: 'Three lines fold into a cross. The state lives in aria-expanded, and the CSS reads it.', fr: "Trois traits se replient en croix. L'état vit dans aria-expanded, et le CSS le lit." },
  },
  {
    id: 'icon-play',
    cat: 'icons',
    tech: ['CSS', 'JS', 'clip-path'],
    html: `<button class="lb-play" type="button" aria-pressed="false" aria-label="Play">
  <span class="lb-play-a"></span>
  <span class="lb-play-b"></span>
</button>`,
    title: { en: 'Play and pause', fr: 'Lecture et pause' },
    note: { en: 'Two halves of a triangle reshape into two bars: clip-path polygons with the same number of points can morph.', fr: "Deux moitiés de triangle deviennent deux barres : des polygones clip-path avec autant de points peuvent se transformer." },
  },
  {
    id: 'icon-bell',
    cat: 'icons',
    tech: ['CSS', 'SVG'],
    html: `<button class="lb-bell" type="button" aria-label="Notifications, 3 new">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path class="lb-bell-body" d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/>
    <path class="lb-bell-clapper" d="M10 20.5a2 2 0 0 0 4 0"/>
  </svg>
  <span class="lb-bell-badge" aria-hidden="true">3</span>
</button>`,
    title: { en: 'Bell', fr: 'Cloche' },
    note: { en: 'Rings now and then, the clapper a beat behind. The count is in the name, not only in the badge.', fr: 'Elle sonne de temps en temps, le battant en léger retard. Le nombre est dans le nom, pas seulement dans la pastille.' },
  },
  {
    id: 'icon-trash',
    cat: 'icons',
    tech: ['CSS', 'SVG'],
    html: `<button class="lb-trash" type="button" aria-label="Delete">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g class="lb-trash-lid"><path d="M4 7h16"/><path d="M9 7V5h6v2"/></g>
    <path d="M6.5 7l1 13h9l1-13"/>
    <path d="M10 11v5M14 11v5"/>
  </svg>
</button>`,
    title: { en: 'Delete', fr: 'Supprimer' },
    note: { en: 'The lid lifts and tilts when pointed at: a small warning before the click.', fr: "Le couvercle se soulève et penche au survol : un petit avertissement avant le clic." },
  },
  {
    id: 'icon-cart',
    cat: 'icons',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<div class="lb-cart">
  <button class="lb-cart-add" type="button">Add to cart</button>
  <span class="lb-cart-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>
    <span class="lb-cart-count">0</span>
  </span>
  <span class="lb-cart-item" aria-hidden="true"></span>
  <p class="lb-cart-status" role="status"></p>
</div>`,
    title: { en: 'Add to cart', fr: 'Ajout au panier' },
    note: { en: 'An item hops into the cart, the count bumps, and screen readers hear how many items it holds.', fr: "Un article saute dans le panier, le compteur bondit, et les lecteurs d'écran entendent combien il en contient." },
  },
  // Text, more
  {
    id: 'text-words',
    cat: 'text',
    tech: ['CSS'],
    replay: true,
    html: `<p class="lb-words">
  <span class="lb-words-sr">Design that moves people</span>
  <span aria-hidden="true"><span class="lb-word"><span style="--i:0">Design</span></span> <span class="lb-word"><span style="--i:1">that</span></span> <span class="lb-word"><span style="--i:2">moves</span></span> <span class="lb-word"><span style="--i:3">people</span></span></span>
</p>`,
    title: { en: 'Word by word', fr: 'Mot à mot' },
    note: { en: 'Each word rises out of its own mask, one after the other, with a slight tilt that settles.', fr: "Chaque mot sort de son propre masque, l'un après l'autre, avec une légère inclinaison qui se redresse." },
  },
  {
    id: 'text-glitch',
    cat: 'text',
    tech: ['CSS', 'clip-path'],
    html: `<p class="lb-glitch">
  <span>Signal lost</span>
  <span aria-hidden="true">Signal lost</span>
  <span aria-hidden="true">Signal lost</span>
</p>`,
    title: { en: 'Glitch', fr: 'Glitch' },
    note: { en: 'Two shifted copies flicker through slices for a fraction of a second, then rest. Short and rare, so it never flashes.', fr: "Deux copies décalées clignotent par tranches une fraction de seconde, puis se reposent. Court et rare, pour ne jamais flasher." },
  },
  {
    id: 'text-counter',
    cat: 'text',
    tech: ['CSS', 'JS'],
    replay: true,
    html: `<p class="lb-count">
  <span class="lb-count-num" data-to="12480" aria-hidden="true">0</span>
  <span class="lb-count-sr">12,480</span>
  <span class="lb-count-label">orders shipped</span>
</p>`,
    title: { en: 'Counter', fr: 'Compteur' },
    note: { en: 'Counts up when it comes into view, fast then slower. Screen readers get the final number straight away.', fr: "Compte jusqu'à sa valeur quand il apparaît, vite puis plus lentement. Les lecteurs d'écran ont le nombre final tout de suite." },
  },
  {
    id: 'text-rotate',
    cat: 'text',
    tech: ['CSS'],
    html: `<p class="lb-rotate">
  <span class="lb-rotate-sr">I build websites, stores and apps.</span>
  <span aria-hidden="true">I build <span class="lb-rotate-words"><span>websites</span><span>stores</span><span>apps</span><span>websites</span></span></span>
</p>`,
    title: { en: 'Rotating words', fr: 'Mots qui tournent' },
    note: { en: 'The last word rolls through a list and loops seamlessly (the first word is repeated at the end).', fr: 'Le dernier mot défile dans une liste et boucle sans à-coup (le premier mot est répété à la fin).' },
  },
  {
    id: 'text-outline',
    cat: 'text',
    tech: ['CSS'],
    html: '<p class="lb-outline">Fill me up</p>',
    title: { en: 'Outline fill', fr: 'Contour qui se remplit' },
    note: { en: 'An outlined title fills with colour from left to right, then empties again: a background clipped to the text.', fr: "Un titre en contour se remplit de couleur de gauche à droite, puis se vide : un fond découpé à la forme du texte." },
  },
  {
    id: 'text-price',
    cat: 'text',
    tech: ['CSS'],
    replay: true,
    html: `<p class="lb-price">
  <span class="lb-price-old"><span class="lb-price-sr">Was</span> $1,249</span>
  <span class="lb-price-new"><span class="lb-price-sr">Now</span> $999</span>
  <span class="lb-price-tag">Save 20%</span>
</p>`,
    title: { en: 'Price drop', fr: 'Prix barré' },
    note: { en: 'For a sale: the old price is struck through and steps back, the new one pops in, then the saving.', fr: "Pour une promotion : l'ancien prix se barre et recule, le nouveau surgit, puis l'économie." },
  },
  // Loaders, more
  {
    id: 'loader-ring',
    cat: 'loaders',
    tech: ['CSS', 'mask'],
    html: '<div class="lb-ring" role="status" aria-label="Loading"></div>',
    title: { en: 'Gradient ring', fr: 'Anneau dégradé' },
    note: { en: 'A conic gradient fading into its own tail, cut into a ring by a radial mask, turning.', fr: 'Un dégradé conique qui se fond dans sa propre traîne, découpé en anneau par un masque radial, qui tourne.' },
  },
  {
    id: 'loader-pulse',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-pulse" role="status" aria-label="Searching">${each(3, 'span', '')}<i></i>
</div>`,
    title: { en: 'Radar', fr: 'Radar' },
    note: { en: 'Three rings leave the centre one after the other and fade as they grow: for searching, scanning, pairing.', fr: "Trois anneaux quittent le centre l'un après l'autre et s'effacent en grandissant : pour une recherche, un scan, un appairage." },
  },
  {
    id: 'loader-skeleton',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-skel" role="status" aria-label="Loading a profile">
  <span class="lb-skel-avatar"></span>
  <span class="lb-skel-line"></span>
  <span class="lb-skel-line"></span>
  <span class="lb-skel-line"></span>
</div>`,
    title: { en: 'Skeleton', fr: 'Squelette' },
    note: { en: 'The shape of the content before the content: one light sweeps across every block at once.', fr: "La forme du contenu avant le contenu : une seule lumière balaie tous les blocs à la fois." },
  },
  {
    id: 'loader-progress',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-progress" role="progressbar" aria-label="Uploading">
  <span></span>
  <span></span>
</div>`,
    title: { en: 'Indeterminate bar', fr: 'Barre indéterminée' },
    note: { en: 'Two segments chase each other, one long, one short: progress without a known end (no aria-valuenow).', fr: "Deux segments se poursuivent, un long, un court : une progression sans fin connue (pas d'aria-valuenow)." },
  },
  {
    id: 'loader-bounce',
    cat: 'loaders',
    tech: ['CSS'],
    html: `<div class="lb-bounce" role="status" aria-label="Loading">
  <span class="lb-bounce-ball"></span>
  <span class="lb-bounce-shadow"></span>
</div>`,
    title: { en: 'Bouncing ball', fr: 'Balle qui rebondit' },
    note: { en: 'Squash and stretch: the ball flattens on the ground and stretches in the air; its shadow follows.', fr: "Écrasement et étirement : la balle s'aplatit au sol et s'allonge en l'air ; son ombre suit." },
  },
  {
    id: 'loader-infinity',
    cat: 'loaders',
    tech: ['CSS', 'SVG'],
    html: `<div class="lb-inf" role="status" aria-label="Loading">
  <svg viewBox="0 0 120 60" aria-hidden="true">
    <path class="lb-inf-track" d="M60 30C70 15 95 12 95 30S70 45 60 30 25 12 25 30s25 15 35 0"/>
    <path class="lb-inf-run" pathLength="100" d="M60 30C70 15 95 12 95 30S70 45 60 30 25 12 25 30s25 15 35 0"/>
  </svg>
</div>`,
    title: { en: 'Infinity', fr: 'Infini' },
    note: { en: 'A stroke runs around an infinity sign, forever: a dash moved along the path by its offset.', fr: "Un trait parcourt un signe infini, sans fin : un tiret déplacé le long du tracé par son décalage." },
  },
  // Cards, more
  {
    id: 'card-fan',
    cat: 'cards',
    tech: ['CSS', '@property'],
    html: `<div class="lb-fan" role="img" aria-label="Three cards fanning out and closing again">
  <span style="--i:-1"></span>
  <span style="--i:0"></span>
  <span style="--i:1"></span>
</div>`,
    title: { en: 'Fan', fr: 'Éventail' },
    note: { en: 'Three cards open like a hand of cards and close again. One typed property drives the angle and the spread of all three.', fr: "Trois cartes s'ouvrent comme une main de jeu, puis se referment. Une seule propriété typée règle l'angle et l'écart des trois." },
  },
  {
    id: 'card-product',
    cat: 'cards',
    tech: ['CSS'],
    html: `<div class="lb-product">
  <div class="lb-product-media" aria-hidden="true">
    <span class="lb-product-front"></span>
    <span class="lb-product-side"></span>
  </div>
  <p class="lb-product-name">Turntable, walnut</p>
  <p class="lb-product-price">$1,099</p>
  <button class="lb-product-add" type="button">Add to cart</button>
</div>`,
    title: { en: 'Product card', fr: 'Carte produit' },
    note: { en: 'Pointed at, the photo turns to a second view and the button slides up. On a touch screen, the button is simply there.', fr: "Au survol, la photo passe à une deuxième vue et le bouton remonte. Sur un écran tactile, le bouton est simplement là." },
  },
  {
    id: 'card-pricing',
    cat: 'cards',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-pricing">
  <fieldset class="lb-pricing-switch">
    <legend class="lb-pricing-sr">Billing</legend>
    <label><input type="radio" name="lb-billing" value="month" checked><span>Monthly</span></label>
    <label><input type="radio" name="lb-billing" value="year"><span>Yearly</span></label>
  </fieldset>
  <p class="lb-pricing-price"><span class="lb-pricing-amount" data-month="29" data-year="23">$29</span> per month</p>
  <p class="lb-pricing-note">Billed monthly</p>
</div>`,
    title: { en: 'Pricing switch', fr: 'Choix de facturation' },
    note: { en: 'Two real radio buttons. Switching rolls the old price out and the new one in.', fr: "Deux vrais boutons radio. En changeant, l'ancien prix sort en roulant et le nouveau entre." },
  },
  {
    id: 'card-gallery',
    cat: 'cards',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-gallery">
  <button class="lb-gallery-panel" type="button" aria-pressed="true" style="--a:#ff9a62;--b:#c4467a"><span>Dawn</span></button>
  <button class="lb-gallery-panel" type="button" aria-pressed="false" style="--a:#4ae0d2;--b:#1f5fa8"><span>Sea</span></button>
  <button class="lb-gallery-panel" type="button" aria-pressed="false" style="--a:#5fcf6b;--b:#1f7a4d"><span>Forest</span></button>
  <button class="lb-gallery-panel" type="button" aria-pressed="false" style="--a:#8f6bff;--b:#1d1650"><span>Night</span></button>
</div>`,
    title: { en: 'Expanding gallery', fr: 'Galerie extensible' },
    note: { en: 'The panel pointed at (or chosen) widens, the others make room; its label slides in.', fr: "Le panneau survolé (ou choisi) s'élargit, les autres lui font de la place ; son nom apparaît." },
  },
  {
    id: 'card-stack',
    cat: 'cards',
    tech: ['CSS'],
    html: `<ul class="lb-notes" tabindex="0" aria-label="Notifications">
  <li style="--i:0"><strong>Order shipped</strong><span>Arrives on Thursday</span></li>
  <li style="--i:1"><strong>New review</strong><span>Five stars: great sound</span></li>
  <li style="--i:2"><strong>Payment received</strong><span>$1,099, thank you</span></li>
</ul>`,
    title: { en: 'Notification stack', fr: 'Pile de notifications' },
    note: { en: 'Stacked, the newest in front; pointed at or focused, the stack spreads into a list.', fr: "Empilées, la plus récente devant ; au survol ou au focus, la pile s'étale en liste." },
  },
  // Navigation
  {
    id: 'nav-tabs',
    cat: 'navigation',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-tabs">
  <div class="lb-tabs-list" role="tablist" aria-label="Product details">
    <button id="lb-tab-1" role="tab" aria-selected="true" aria-controls="lb-panel-1" type="button">Overview</button>
    <button id="lb-tab-2" role="tab" aria-selected="false" aria-controls="lb-panel-2" type="button" tabindex="-1">Specs</button>
    <button id="lb-tab-3" role="tab" aria-selected="false" aria-controls="lb-panel-3" type="button" tabindex="-1">Reviews</button>
    <span class="lb-tabs-ink" aria-hidden="true"></span>
  </div>
  <div id="lb-panel-1" role="tabpanel" aria-labelledby="lb-tab-1" tabindex="0">Everything you need to start.</div>
  <div id="lb-panel-2" role="tabpanel" aria-labelledby="lb-tab-2" tabindex="0" hidden>33 and 45 rpm, belt drive.</div>
  <div id="lb-panel-3" role="tabpanel" aria-labelledby="lb-tab-3" tabindex="0" hidden>4.8 out of 5, from 212 reviews.</div>
</div>`,
    title: { en: 'Tabs', fr: 'Onglets' },
    note: { en: 'Real tabs: arrow keys move between them, Home and End jump. The line slides to the chosen one.', fr: "De vrais onglets : les flèches passent de l'un à l'autre, Début et Fin vont aux extrémités. Le trait glisse sous l'onglet choisi." },
  },
  {
    id: 'nav-accordion',
    cat: 'navigation',
    tech: ['CSS', 'details'],
    html: `<div class="lb-acc">
  <details name="lb-acc" open>
    <summary>Shipping</summary>
    <p>Free over $100, in one to three days.</p>
  </details>
  <details name="lb-acc">
    <summary>Returns</summary>
    <p>Thirty days, no questions asked.</p>
  </details>
  <details name="lb-acc">
    <summary>Warranty</summary>
    <p>Two years, parts and labour.</p>
  </details>
</div>`,
    title: { en: 'Accordion', fr: 'Accordéon' },
    note: { en: 'No script: native details, one open at a time (the name attribute), and a height that animates to auto.', fr: "Sans script : des details natifs, un seul ouvert à la fois (l'attribut name), et une hauteur qui s'anime jusqu'à auto." },
  },
  {
    id: 'nav-underline',
    cat: 'navigation',
    tech: ['CSS', 'JS'],
    html: `<nav class="lb-navline" aria-label="Sample menu">
  <a href="#" aria-current="page">Home</a>
  <a href="#">Work</a>
  <a href="#">About</a>
  <a href="#">Contact</a>
  <span class="lb-navline-ink" aria-hidden="true"></span>
</nav>`,
    title: { en: 'Sliding underline', fr: 'Soulignement qui glisse' },
    note: { en: 'The line follows the pointer or the focus from link to link, and goes back to the current page when it leaves.', fr: "Le trait suit le curseur ou le focus de lien en lien, et revient sur la page courante quand il s'en va." },
  },
  {
    id: 'nav-segmented',
    cat: 'navigation',
    tech: ['CSS', ':has()'],
    html: `<fieldset class="lb-seg">
  <legend class="lb-seg-sr">View</legend>
  <label><input type="radio" name="lb-seg" value="day" checked><span>Day</span></label>
  <label><input type="radio" name="lb-seg" value="week"><span>Week</span></label>
  <label><input type="radio" name="lb-seg" value="month"><span>Month</span></label>
  <span class="lb-seg-pill" aria-hidden="true"></span>
</fieldset>`,
    title: { en: 'Segmented control', fr: 'Contrôle segmenté' },
    note: { en: 'Radio buttons underneath, so the keyboard works for free; :has() moves the pill to the checked one. No script.', fr: "Des boutons radio dessous, donc le clavier marche d'office ; :has() déplace la pastille vers l'option cochée. Sans script." },
  },
  {
    id: 'nav-slides',
    cat: 'navigation',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-slides">
  <div class="lb-slides-window">
    <div class="lb-slides-track">
      <span style="--c:#a970ff">1</span>
      <span style="--c:#4ae0d2">2</span>
      <span style="--c:#5b8cff">3</span>
      <span style="--c:#ff9a62">4</span>
    </div>
  </div>
  <div class="lb-slides-dots" role="group" aria-label="Slides">
    <button type="button" aria-label="Slide 1" aria-current="true"></button>
    <button type="button" aria-label="Slide 2"></button>
    <button type="button" aria-label="Slide 3"></button>
    <button type="button" aria-label="Slide 4"></button>
  </div>
</div>`,
    title: { en: 'Slides and dots', fr: 'Diapositives et points' },
    note: { en: 'The current dot stretches into a pill; the slides follow. Nothing moves on its own.', fr: "Le point courant s'étire en pastille ; les diapositives suivent. Rien ne bouge tout seul." },
  },
  {
    id: 'nav-menu',
    cat: 'navigation',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-menu">
  <button class="lb-menu-button" type="button" aria-expanded="false" aria-controls="lb-menu-list">
    Products
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </button>
  <ul id="lb-menu-list" class="lb-menu-list">
    <li style="--i:0"><a href="#">Turntables</a></li>
    <li style="--i:1"><a href="#">Speakers</a></li>
    <li style="--i:2"><a href="#">Cartridges</a></li>
    <li style="--i:3"><a href="#">Accessories</a></li>
  </ul>
</div>`,
    title: { en: 'Dropdown', fr: 'Menu déroulant' },
    note: { en: 'The items arrive one after the other. Escape or a click outside closes it, and the focus goes back to the button.', fr: "Les éléments arrivent l'un après l'autre. Échap ou un clic à côté le ferme, et le focus revient au bouton." },
  },
  // Inputs, more
  {
    id: 'input-search',
    cat: 'inputs',
    tech: ['CSS', ':has()'],
    html: `<label class="lb-search">
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  <span class="lb-search-sr">Search the shop</span>
  <input type="search" placeholder="Search the shop">
</label>`,
    title: { en: 'Expanding search', fr: 'Recherche qui s\'ouvre' },
    note: { en: 'A round button that opens into a field when clicked or tabbed to, and stays open while it holds text. No script.', fr: "Un bouton rond qui s'ouvre en champ au clic ou à la tabulation, et reste ouvert tant qu'il contient du texte. Sans script." },
  },
  {
    id: 'input-password',
    cat: 'inputs',
    tech: ['CSS', 'JS', 'SVG'],
    html: `<div class="lb-pass">
  <label for="lb-pass-input">Password</label>
  <div class="lb-pass-field">
    <input id="lb-pass-input" type="password" value="vinyl-forever" autocomplete="off">
    <button type="button" aria-pressed="false" aria-label="Show password">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
        <circle cx="12" cy="12" r="3"/>
        <path class="lb-pass-slash" pathLength="1" d="M4 4l16 16"/>
      </svg>
    </button>
  </div>
</div>`,
    title: { en: 'Show password', fr: 'Afficher le mot de passe' },
    note: { en: 'The eye blinks and its slash draws or withdraws. A real toggle: aria-pressed says whether the password shows.', fr: "L'œil cligne et sa barre se trace ou se retire. Un vrai bouton à bascule : aria-pressed dit si le mot de passe est visible." },
  },
  {
    id: 'input-otp',
    cat: 'inputs',
    tech: ['CSS', 'JS'],
    html: `<fieldset class="lb-otp">
  <legend>Enter the code we sent</legend>
  <div class="lb-otp-boxes">
    <input inputmode="numeric" maxlength="1" autocomplete="one-time-code" aria-label="Digit 1">
    <input inputmode="numeric" maxlength="1" aria-label="Digit 2">
    <input inputmode="numeric" maxlength="1" aria-label="Digit 3">
    <input inputmode="numeric" maxlength="1" aria-label="Digit 4">
  </div>
  <p class="lb-otp-status" role="status"></p>
</fieldset>`,
    title: { en: 'One-time code', fr: 'Code à usage unique' },
    note: { en: 'Type and the focus moves on, Backspace goes back, a paste fills every box. Complete, the boxes light up in a wave.', fr: "On tape et le focus avance, Retour arrière recule, un collage remplit toutes les cases. Complet, les cases s'allument en vague." },
  },
  {
    id: 'input-range',
    cat: 'inputs',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-range">
  <label for="lb-range-input">Volume</label>
  <div class="lb-range-track" style="--v:40">
    <input id="lb-range-input" type="range" min="0" max="100" value="40">
    <output for="lb-range-input">40</output>
  </div>
</div>`,
    title: { en: 'Range with a bubble', fr: 'Curseur avec bulle' },
    note: { en: 'A native range input, restyled: the track fills up to the thumb and a bubble shows the value, bigger while you drag.', fr: "Un curseur natif, restylé : la piste se remplit jusqu'au curseur et une bulle montre la valeur, plus grande pendant le glissement." },
  },
  {
    id: 'input-rating',
    cat: 'inputs',
    tech: ['CSS', ':has()'],
    html: `<fieldset class="lb-rate">
  <legend>Rate this product</legend>
  <div class="lb-rate-stars">${[1, 2, 3, 4, 5].map((n) => `
    <label><input type="radio" name="lb-rate" value="${n}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.2 6.1-.8z"/></svg><span>${n} star${n > 1 ? 's' : ''}</span></label>`).join('')}
  </div>
</fieldset>`,
    title: { en: 'Star rating', fr: 'Notation en étoiles' },
    note: { en: 'Five radio buttons. Pointing lights the stars up to the one under the pointer; choosing one makes it pop. No script.', fr: "Cinq boutons radio. Le survol allume les étoiles jusqu'à celle pointée ; en choisir une la fait bondir. Sans script." },
  },
  // Feedback, more
  {
    id: 'fb-confetti',
    cat: 'feedback',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-confetti">
  <button type="button">Celebrate</button>
</div>`,
    title: { en: 'Confetti', fr: 'Confettis' },
    note: { en: 'Thirty pieces burst from the button, each with its own angle, speed, spin and colour, then fall and vanish.', fr: "Trente morceaux jaillissent du bouton, chacun avec son angle, sa vitesse, sa rotation et sa couleur, puis retombent et disparaissent." },
  },
  {
    id: 'fb-shake',
    cat: 'feedback',
    tech: ['CSS', 'JS'],
    html: `<form class="lb-shake" novalidate>
  <label for="lb-shake-email">Email</label>
  <div class="lb-shake-row">
    <input id="lb-shake-email" type="email" placeholder="you@example.com" aria-describedby="lb-shake-message">
    <button type="submit">Join</button>
  </div>
  <p id="lb-shake-message" class="lb-shake-message" aria-live="polite"></p>
</form>`,
    title: { en: 'Error shake', fr: 'Erreur qui secoue' },
    note: { en: 'Submit it empty: the field shakes, turns red and says why, the focus goes back to it. A valid email gets a thank you.', fr: "Envoyez-le vide : le champ tremble, passe au rouge et dit pourquoi, le focus y revient. Un email valide reçoit un merci." },
  },
  {
    id: 'fb-steps',
    cat: 'feedback',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-steps">
  <ol class="lb-steps-list" style="--step:0">
    <li aria-current="step"><span>Cart</span></li>
    <li><span>Shipping</span></li>
    <li><span>Payment</span></li>
  </ol>
  <div class="lb-steps-actions">
    <button type="button" data-step="-1" disabled>Back</button>
    <button type="button" data-step="1">Next</button>
  </div>
</div>`,
    title: { en: 'Steps', fr: 'Étapes' },
    note: { en: 'The line fills towards the next step, done steps get a tick, and aria-current says where you are.', fr: "Le trait se remplit vers l'étape suivante, les étapes faites reçoivent une coche, et aria-current dit où l'on en est." },
  },
  {
    id: 'fb-tooltip',
    cat: 'feedback',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-tip">
  <button type="button" aria-describedby="lb-tip-text">Shipping</button>
  <span id="lb-tip-text" role="tooltip">Free over $100, in 1 to 3 days</span>
</div>`,
    title: { en: 'Tooltip', fr: 'Infobulle' },
    note: { en: 'Springs in on hover or focus, stays while the pointer is on it, and Escape dismisses it, as WCAG 1.4.13 asks.', fr: "Elle surgit au survol ou au focus, reste tant que le curseur est dessus, et Échap la ferme, comme le demande le critère WCAG 1.4.13." },
  },
  // Scroll, more
  {
    id: 'scroll-reveal',
    cat: 'scroll',
    tech: ['CSS', 'scroll-driven'],
    html: `<div class="lb-reveal" role="region" tabindex="0" aria-label="Sample list, scroll it">
  <p>Scroll this box</p>${['Design', 'Prototype', 'Build', 'Test', 'Launch', 'Measure'].map((step, i) => `
  <div class="lb-reveal-item" style="--i:${i}">${step}</div>`).join('')}
</div>`,
    title: { en: 'Reveal on scroll', fr: 'Apparition au défilement' },
    note: { en: 'Each row fades and slides in as it enters the box: a view timeline, no observer, no script.', fr: "Chaque ligne apparaît en glissant quand elle entre dans la boîte : une view timeline, ni observateur, ni script." },
  },
  {
    id: 'scroll-parallax',
    cat: 'scroll',
    tech: ['CSS', 'scroll-driven'],
    html: `<div class="lb-plx" role="region" tabindex="0" aria-label="A landscape, scroll it">
  <div class="lb-plx-scene" aria-hidden="true">
    <span class="lb-plx-sun"></span>
    <span class="lb-plx-far"></span>
    <span class="lb-plx-near"></span>
  </div>
  <div class="lb-plx-length"></div>
</div>`,
    title: { en: 'Parallax', fr: 'Parallaxe' },
    note: { en: 'Scroll the box: the far hills move slowly, the near ones fast, the sun sets. All driven by the box\'s own scroll.', fr: "Faites défiler la boîte : les collines lointaines bougent lentement, les proches vite, le soleil se couche. Tout est piloté par le défilement de la boîte." },
  },
  {
    id: 'scroll-carousel',
    cat: 'scroll',
    tech: ['CSS', 'scroll-driven', 'scroll-snap'],
    html: `<div class="lb-snap" role="region" tabindex="0" aria-label="Carousel, scroll it sideways">${['#a970ff', '#4ae0d2', '#5b8cff', '#ff9a62', '#ff5f7e', '#a970ff'].map((c, i) => `
  <span style="--c:${c}">${i + 1}</span>`).join('')}
</div>`,
    title: { en: 'Snap carousel', fr: 'Carrousel aimanté' },
    note: { en: 'Swipe or scroll sideways: each card snaps to the centre, and grows as it gets there (a view timeline on the inline axis).', fr: "Balayez ou faites défiler de côté : chaque carte s'aimante au centre, et grandit en y arrivant (une view timeline sur l'axe horizontal)." },
  },
  // Backgrounds
  {
    id: 'bg-aurora',
    cat: 'backgrounds',
    tech: ['CSS'],
    html: `<div class="lb-aurora" role="img" aria-label="Soft colours drifting like an aurora">
  <span></span>
  <span></span>
  <span></span>
</div>`,
    title: { en: 'Aurora', fr: 'Aurore' },
    note: { en: 'Three soft lights drift and blend. Radial gradients fading to transparent, not blur filters, so it stays light to draw.', fr: "Trois lumières douces dérivent et se mêlent. Des dégradés radiaux qui s'estompent, pas des filtres de flou, pour rester léger à dessiner." },
  },
  {
    id: 'bg-grid',
    cat: 'backgrounds',
    tech: ['CSS', '@property', 'mask'],
    html: '<div class="lb-gridglow" role="img" aria-label="A grid lit by a moving glow"></div>',
    title: { en: 'Grid glow', fr: 'Grille lumineuse' },
    note: { en: 'A second, bright grid sits on the first, seen only through a round mask that wanders across.', fr: "Une seconde grille, vive, recouvre la première, visible seulement à travers un masque rond qui se promène." },
  },
  {
    id: 'bg-mesh',
    cat: 'backgrounds',
    tech: ['CSS', '@property'],
    html: '<div class="lb-mesh" role="img" aria-label="A gradient slowly shifting its colours"></div>',
    title: { en: 'Living gradient', fr: 'Dégradé vivant' },
    note: { en: 'Four radial gradients whose centres are typed properties, each on its own slow loop: the colours never repeat the same way.', fr: "Quatre dégradés radiaux dont les centres sont des propriétés typées, chacun sur sa propre boucle lente : les couleurs ne se répètent jamais pareil." },
  },
  {
    id: 'bg-waves',
    cat: 'backgrounds',
    tech: ['CSS'],
    html: `<div class="lb-waves" role="img" aria-label="Waves rolling by">
  <span></span>
  <span></span>
  <span></span>
</div>`,
    title: { en: 'Waves', fr: 'Vagues' },
    note: { en: 'Three rows of waves, each a repeating radial gradient, rolling at three speeds for depth.', fr: "Trois rangées de vagues, chacune un dégradé radial répété, qui roulent à trois vitesses pour la profondeur." },
  },
  // From my archive (CodePen), rebuilt
  {
    id: 'arch-magnifier',
    cat: 'archive',
    tech: ['SVG', 'CSS', '@property'],
    html: `<svg class="lb-loupe" viewBox="-6 24 462 356" role="img" aria-label="A magnifying glass travels over a bank card, enlarging the chip, the numbers and the signature in turn. It follows the pointer.">
  <defs>
    <g id="lb-loupe-art">
      <rect x="-6" y="24" width="462" height="356" fill="#dff1f5"/>
      <circle cx="224.5" cy="224.5" r="224.5" fill="#fcf7ef"/>
      <g transform="translate(-43.64 -129.25)" stroke-linecap="round" stroke-linejoin="round">
        <path d="M153.87 451.85l-40.1-169.92a13 13 0 0 1 10.09-15.74L405 215a12.74 12.74 0 0 1 14.74 9.19l49.33 154.57a13 13 0 0 1-9.46 16l-290.36 66.5a12.74 12.74 0 0 1-15.38-9.42z" fill="#f4d24b" stroke="#804a58" stroke-width="6"/>
        <path d="M439.13 385.37l-72.92 16.94a5.24 5.24 0 0 1-6-3.6L356.64 385a4.84 4.84 0 0 1 3.6-6L433 361.45a5.23 5.23 0 0 1 6 3.59l3.74 14.53a4.45 4.45 0 0 1-3.61 5.8z" fill="#804a58"/>
        <path d="M310.47 255.35l94.81-18.5" stroke="#804a58" stroke-width="6.6" fill="none"/>
        <path d="M153.82 340.86L142.2 298.39a3.56 3.56 0 0 1 2.8-4.39l55-12.11a3.6 3.6 0 0 1 4.27 2.6l10.41 41.76a3.63 3.63 0 0 1-2.61 4.4l-53.92 12.82a3.6 3.6 0 0 1-4.33-2.61z" fill="#804a58"/>
        <path d="M206 295.16l-60.49 13.55M209.12 307.94l-60.22 13.55M213.75 320.08l-60.23 13.56" stroke="#f4d24b" stroke-width="4" fill="none"/>
        <path d="M169.19 314.85c2.39 9.48 9.1 16.52 13.08 19.92a3 3 0 0 0 4.68-1.19c1.81-5 4.32-14.29 1.92-23.76-2.52-9.9-9.77-17.23-13.61-20.49a2.44 2.44 0 0 0-3.85.95c-1.81 4.98-4.74 14.72-2.22 24.57z" fill="#804a58" stroke="#f4d24b" stroke-width="4"/>
        <g fill="#804a58" font-family="ui-monospace, Menlo, monospace" font-size="21" font-weight="700" letter-spacing="1">
          <text transform="translate(255 345) rotate(-12.6)">0000</text>
          <text transform="translate(316 331) rotate(-12.6)">0000</text>
          <text transform="translate(378 317) rotate(-12.6)">0000</text>
        </g>
      </g>
    </g>
    <clipPath id="lb-loupe-glass"><circle r="44"/></clipPath>
  </defs>
  <use href="#lb-loupe-art"/>
  <g class="lb-loupe-lens">
    <circle class="lb-loupe-shade" cx="7" cy="10" r="48"/>
    <g clip-path="url(#lb-loupe-glass)">
      <use class="lb-loupe-zoom" href="#lb-loupe-art"/>
    </g>
    <path class="lb-loupe-shine" d="M-29 -14a32 32 0 0 1 21-18"/>
    <circle class="lb-loupe-ring" r="46"/>
    <path class="lb-loupe-neck" d="M34 34l12 12"/>
    <path class="lb-loupe-handle" d="M50 50l34 34"/>
  </g>
</svg>`,
    title: { en: 'Magnifying glass', fr: 'Loupe' },
    note: { en: 'From my CodePen, with its own drawing. The glass used to slide by changing margins and showed nothing bigger. Now it truly magnifies (the same picture, twice as big, seen through the lens), stops on the chip, the numbers and the signature, and glides after the pointer, then back to its round, without a jump.', fr: "Tirée de mon CodePen, avec son propre dessin. La loupe glissait en changeant des marges et ne grossissait rien. Elle grossit maintenant pour de vrai (la même image, deux fois plus grande, vue à travers la lentille), s'arrête sur la puce, les chiffres et la signature, et glisse vers le curseur puis reprend sa ronde, sans à-coup." },
  },
  {
    id: 'arch-cat',
    cat: 'archive',
    tech: ['SVG', 'CSS', 'JS'],
    html: `<button type="button" class="lb-cat" aria-label="Pet the lucky cat">
  <svg viewBox="0 0 200 210" aria-hidden="true">
    <circle class="lb-cat-disc" cx="100" cy="106" r="98"/>
    <g class="lb-cat-tail">
      <path class="lb-cat-line" d="M138 188c30 2 42-16 36-38-4-15 4-27 16-30"/>
      <path class="lb-cat-fur" d="M138 188c30 2 42-16 36-38-4-15 4-27 16-30"/>
    </g>
    <g class="lb-cat-body">
      <path class="lb-cat-ginger" d="M56 192c-12-44 4-86 44-90 40 4 56 46 44 90z"/>
      <path class="lb-cat-cream" d="M74 190c-7-30 4-60 26-64 22 4 33 34 26 64z"/>
      <ellipse class="lb-cat-cream" cx="77" cy="192" rx="16" ry="8"/>
      <ellipse class="lb-cat-cream" cx="123" cy="192" rx="16" ry="8"/>
      <path class="lb-cat-thin" d="M71 189v6M79 189v6M117 189v6M125 189v6"/>
      <g class="lb-cat-coin">
        <ellipse class="lb-cat-gold" cx="118" cy="156" rx="15" ry="20" transform="rotate(-12 118 156)"/>
        <path class="lb-cat-mark" d="M110 148l14-3M111 156l14-3M112 164l14-3"/>
        <ellipse class="lb-cat-ginger" cx="105" cy="168" rx="11" ry="9"/>
      </g>
    </g>
    <path class="lb-cat-collar" d="M66 104c22 12 46 12 68 0"/>
    <g class="lb-cat-bell">
      <circle class="lb-cat-gold" cx="100" cy="117" r="7"/>
      <path class="lb-cat-thin" d="M100 119v4M95 116h10"/>
    </g>
    <g class="lb-cat-head">
      <g class="lb-cat-ear">
        <path class="lb-cat-ginger" d="M62 48 56 10l34 22z"/>
        <path class="lb-cat-pink" d="M65 40l-3-20 18 12z"/>
      </g>
      <g class="lb-cat-ear lb-cat-ear-right">
        <path class="lb-cat-ginger" d="M138 48l6-38-34 22z"/>
        <path class="lb-cat-pink" d="M135 40l3-20-18 12z"/>
      </g>
      <ellipse class="lb-cat-ginger" cx="100" cy="62" rx="48" ry="40"/>
      <path class="lb-cat-stripe" d="M100 24v11M89 27l3 9M111 27l-3 9"/>
      <ellipse class="lb-cat-muzzle" cx="100" cy="80" rx="29" ry="18"/>
      <g class="lb-cat-eye">
        <ellipse class="lb-cat-white" cx="80" cy="58" rx="12" ry="13"/>
        <g class="lb-cat-look"><circle cx="80" cy="59" r="5.5"/><circle class="lb-cat-glint" cx="82" cy="56.5" r="1.8"/></g>
      </g>
      <g class="lb-cat-eye">
        <ellipse class="lb-cat-white" cx="120" cy="58" rx="12" ry="13"/>
        <g class="lb-cat-look"><circle cx="120" cy="59" r="5.5"/><circle class="lb-cat-glint" cx="122" cy="56.5" r="1.8"/></g>
      </g>
      <path class="lb-cat-nose" d="M94.5 73h11L100 79.5z"/>
      <path class="lb-cat-thin" d="M100 80c0 6-8 8-12 4M100 80c0 6 8 8 12 4"/>
      <path class="lb-cat-dots" d="M82 82h.1M86 86h.1M80 88h.1M118 82h.1M114 86h.1M120 88h.1"/>
      <g class="lb-cat-whiskers">
        <path class="lb-cat-thin" d="M72 76c-5-3-9 2-14-1s-9 2-14-1M72 82c-5-2-9 3-14 0s-9 3-14 0M73 88c-5-1-8 4-13 2s-8 3-13 1"/>
        <path class="lb-cat-thin" d="M128 76c5-3 9 2 14-1s9 2 14-1M128 82c5-2 9 3 14 0s9 3 14 0M127 88c5-1 8 4 13 2s8 3 13 1"/>
      </g>
    </g>
    <g class="lb-cat-arm">
      <path class="lb-cat-line" d="M76 130c-8-14-16-30-28-46"/>
      <path class="lb-cat-fur" d="M76 130c-8-14-16-30-28-46"/>
      <g class="lb-cat-paw">
        <circle class="lb-cat-cream" cx="44" cy="76" r="12"/>
        <path class="lb-cat-thin" d="M39 66v5M45 65v5M51 67v5"/>
        <ellipse class="lb-cat-pink" cx="44" cy="80" rx="4.5" ry="3.5"/>
      </g>
    </g>
    <g class="lb-cat-luck">
      <path d="M150 128l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>
      <path d="M166 104l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
      <path d="M140 102l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/>
      <path d="M28 46l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
      <path d="M22 96l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/>
    </g>
  </svg>
</button>`,
    title: { en: 'Lucky cat', fr: 'Chat porte-bonheur' },
    note: { en: 'From my CodePen, redrawn as a character of my own, in the same cartoon spirit: the paw beckons (the paw itself lags behind the arm), the bell and the tail follow, the cat blinks and watches the pointer. Pet it for a burst of luck.', fr: "Tiré de mon CodePen, redessiné en personnage à moi, dans le même esprit cartoon : la patte fait signe (la main traîne un peu derrière le bras), le grelot et la queue suivent, le chat cligne des yeux et suit le curseur du regard. Caressez-le pour un éclat de chance." },
  },
  {
    id: 'arch-water',
    cat: 'archive',
    tech: ['SVG', 'CSS', 'JS'],
    replay: true,
    html: `<div class="lb-tube" role="img" aria-label="A test tube filling up to 65% with sparkling water. It tilts towards the pointer, and the water sloshes.">
  <svg viewBox="0 0 100 200" aria-hidden="true">
    <defs>
      <clipPath id="lb-tube-in"><path d="M33 16v157a17 17 0 0 0 34 0V16z"/></clipPath>
      <linearGradient id="lb-tube-deep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6ccac6"/>
        <stop offset="1" stop-color="#2f8d98"/>
      </linearGradient>
    </defs>
    <ellipse class="lb-tube-shadow" cx="50" cy="197" rx="20" ry="2.5"/>
    <g clip-path="url(#lb-tube-in)">
      <rect class="lb-tube-air" x="0" y="0" width="100" height="200"/>
      <g class="lb-tube-water" transform="translate(0 78)">
        <path class="lb-tube-back" d="M0 0q10-2.4 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0V200H0z"/>
        <g class="lb-tube-front">
          <path d="M0 0q10-2.8 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0V200H0z"/>
          <path class="lb-tube-line" d="M0 0q10-2.8 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0"/>
        </g>
        <g class="lb-tube-bubbles">
          <g style="--x:-1.5px; --s:1.9s"><circle cx="41" cy="0" r="2.6" style="--t:3.1s; --w:-0.4s"/></g>
          <g style="--x:2px; --s:2.3s"><circle cx="47" cy="0" r="1.6" style="--t:2.6s; --w:-1.9s"/></g>
          <g style="--x:-2px; --s:1.7s"><circle cx="53" cy="0" r="3.2" style="--t:3.6s; --w:-2.6s"/></g>
          <g style="--x:1.5px; --s:2.1s"><circle cx="59" cy="0" r="2" style="--t:2.9s; --w:-1.1s"/></g>
          <g style="--x:-1px; --s:1.6s"><circle cx="44" cy="0" r="1.3" style="--t:2.4s; --w:-0.9s"/></g>
          <g style="--x:2.5px; --s:2.5s"><circle cx="56" cy="0" r="1.8" style="--t:3.3s; --w:-3s"/></g>
          <g style="--x:-2px; --s:1.8s"><circle cx="50" cy="0" r="2.3" style="--t:2.8s; --w:-2.2s"/></g>
          <g style="--x:1px; --s:2.2s"><circle cx="62" cy="0" r="1.2" style="--t:2.2s; --w:-0.2s"/></g>
        </g>
      </g>
    </g>
    <g class="lb-tube-glass">
      <path class="lb-tube-wall" d="M31 12v161a19 19 0 0 0 38 0V12"/>
      <rect class="lb-tube-lip" x="26" y="7" width="48" height="7" rx="3.5"/>
      <path class="lb-tube-marks" d="M59 147h8M62 125.5h5M59 104h8M62 82.5h5M59 61h8"/>
      <rect class="lb-tube-shine" x="36" y="24" width="3" height="136" rx="1.5"/>
    </g>
  </svg>
  <p class="lb-tube-level" aria-hidden="true">65%</p>
</div>`,
    title: { en: 'Sparkling water', fr: 'Eau pétillante' },
    note: { en: 'From my CodePen, where the surface was a morphing SVG path. Now two waves drift at their own pace, the bubbles sway and burst at the surface, and the tube tilts towards the pointer: the water stays level, lags behind the glass, and sloshes before it settles (two springs).', fr: "Tirée de mon CodePen, où la surface était un tracé SVG qui se déformait. Deux vagues dérivent maintenant chacune à son rythme, les bulles ondulent et éclatent à la surface, et le tube penche vers le curseur : l'eau reste à niveau, prend du retard sur le verre et clapote avant de se poser (deux ressorts)." },
  },
  {
    id: 'arch-globe',
    cat: 'archive',
    tech: ['Canvas', 'JS', '@property'],
    html: `<div class="lb-globe-band">
  <p class="lb-globe-stat"><strong><span data-to="160">160</span></strong> countries</p>
  <p class="lb-globe-stat"><strong><span data-to="35">35</span></strong> cities</p>
  <canvas class="lb-globe" role="img" aria-label="The Earth, turning slowly. Drag it to spin it."></canvas>
  <p class="lb-globe-stat"><strong><span data-to="12">12</span><small>k</small></strong> members</p>
  <p class="lb-globe-stat"><strong><span data-to="98">98</span><small>TB</small></strong> shared</p>
</div>`,
    title: { en: 'Globe and figures', fr: 'Globe et chiffres' },
    note: { en: 'From my CodePen, which slid a photo of a map behind a round mask. Now a real globe: the coastlines (Natural Earth) are projected onto a sphere and cut at its edge. Drag it to spin it; the figures count up as they come into view.', fr: "Tiré de mon CodePen, qui faisait glisser la photo d'une carte derrière un masque rond. C'est maintenant un vrai globe : les côtes (Natural Earth) sont projetées sur une sphère et coupées à son bord. On peut le faire tourner à la main ; les chiffres comptent quand ils apparaissent." },
  },
  {
    id: 'arch-rings',
    cat: 'archive',
    tech: ['CSS', 'JS'],
    html: `<div class="lb-rings">
  <div class="lb-rings-page" aria-hidden="true"><b></b><i></i><i></i><i></i></div>
  <nav aria-label="Games">
    <button type="button" aria-expanded="false" aria-controls="lb-rings-list"><span>Games</span><span>Close</span></button>
    <ul id="lb-rings-list">
      <li><a href="#" aria-label="Eons" style="--r:76px; --step:10deg"><span aria-hidden="true"><i style="--k:-1.5">E</i><i style="--k:-0.5">o</i><i style="--k:0.5">n</i><i style="--k:1.5">s</i></span></a></li>
      <li><a href="#" aria-label="Towerz" style="--r:114px; --step:6deg"><span aria-hidden="true"><i style="--k:-2.5">T</i><i style="--k:-1.5">o</i><i style="--k:-0.5">w</i><i style="--k:0.5">e</i><i style="--k:1.5">r</i><i style="--k:2.5">z</i></span></a></li>
    </ul>
  </nav>
</div>`,
    title: { en: 'Corner rings', fr: 'Anneaux en coin' },
    note: { en: 'From my CodePen (a games menu for a studio). The rings still ripple out of the corner with a bounce, now from the button outwards, and close the other way; each name follows the curve of its ring, letter by letter. A real disclosure button: closed rings are out of reach, Escape closes.', fr: "Tiré de mon CodePen (un menu de jeux pour un studio). Les anneaux sortent toujours du coin avec un rebond, maintenant depuis le bouton vers l'extérieur, et se referment dans l'autre sens ; chaque nom suit la courbe de son anneau, lettre par lettre. Un vrai bouton d'ouverture : fermés, les anneaux sont hors d'atteinte, Échap referme." },
  },
  {
    id: 'arch-signal',
    cat: 'archive',
    tech: ['SVG', 'CSS'],
    html: `<div class="lb-mk" role="status" aria-label="Loading">
  <svg viewBox="-2 -2 203 109" aria-hidden="true">
    <path class="lb-mk-line" d="M108.5-.5h3v105h-6c.17-31.34 0-62.67-.5-94C88.36 32.64 71.53 54.64 54.5 76.5A21 21 0 0 1 50 72.5C34.72 51.55 19.05 30.88 3 10.5c-.5 31.33-.67 62.66-.5 94h-3V.5C18.19 23.7 36.35 47.36 54 71.5 72 47.34 90.17 23.34 108.5-.5z"/>
    <path class="lb-mk-line" d="M190.5-.5h5c.13.74-.04 1.4-.5 2-16.71 16.21-32.88 32.88-48.5 50 17.08 17.74 34.41 35.08 52 52v1h-5c-17.16-17.99-34.83-35.49-53-52.5 16.87-17.37 33.54-34.87 50-52.5z"/>
    <path class="lb-mk-wedge" d="M49.5 104.5h-15c-1.99-3.96-4.49-7.62-7.5-11-.5 3.65-.67 7.32-.5 11h-12c-.33-15.68 0-31.35 1-47 11.59 15.52 22.92 31.19 34 47z"/>
    <path class="lb-mk-wedge" d="M93.5 104.5h-12c.17-3.68 0-7.35-.5-11-2.51 3.7-5.01 7.36-7.5 11h-15c10.95-15.62 22.29-30.95 34-46 1 15.32 1.33 30.65 1 46z"/>
    <path class="lb-mk-wedge" d="M128.5-.5h11c-.17 5.01 0 10.01.5 15 5.04-4.87 9.87-9.87 14.5-15h17c-13.58 15.08-27.75 29.75-42.5 44-.5-14.66-.67-29.33-.5-44z"/>
    <path class="lb-mk-wedge" d="M170.5 104.5h-16c-4.63-5.13-9.46-10.13-14.5-15-.5 4.99-.67 9.99-.5 15h-11c-.33-14.02 0-28.02 1-42 13.66 13.99 27.33 27.99 41 42z"/>
  </svg>
</div>`,
    title: { en: 'Logo loader', fr: 'Chargement au logo' },
    note: { en: 'From my CodePen, where a client’s logo lit up its accents one by one while a page loaded. Same idea with my own monogram: the four solid wedges of MK light up in turn and fade in the same order, like a signal.', fr: "Tiré de mon CodePen, où le logo d'un client allumait ses accents un à un pendant un chargement. Même idée avec mon propre monogramme : les quatre coins pleins de MK s'allument tour à tour et s'éteignent dans le même ordre, comme un signal." },
  },
  {
    id: 'arch-mask',
    cat: 'archive',
    tech: ['SVG', 'CSS'],
    replay: true,
    html: `<svg class="lb-mask" viewBox="0 0 300 200" role="img" aria-label="A poster builds itself: an orange page unrolls, green is brushed on, two bands are drawn, circles pop out, and a green mask arrives and blinks.">
  <defs>
    <clipPath id="lb-mask-page"><rect width="300" height="200" rx="16"/></clipPath>
    <mask id="lb-mask-brush"><path class="lb-mask-brush" d="M-60 60C60 40 160 120 360 100" pathLength="1"/></mask>
  </defs>
  <g clip-path="url(#lb-mask-page)">
    <rect class="lb-mask-paper" width="300" height="200"/>
    <path class="lb-mask-green" mask="url(#lb-mask-brush)" d="M0 0h118c16 52 50 74 96 72 38-2 70 6 86 16v70c-30-12-60-18-86-8-28 12-54 20-94 8C80 146 40 124 0 104z"/>
    <path class="lb-mask-band lb-mask-dark" d="M-30 100 0 115c40 20 80 42 120 54s66 4 94-8c26-10 56-4 86 8l30 12" pathLength="1"/>
    <path class="lb-mask-band lb-mask-olive" d="M-30 120 0 135c40 20 80 42 120 54s66 4 94-8c26-10 56-4 86 8l30 12" pathLength="1"/>
    <g class="lb-mask-dot" style="--d:1.6s"><circle cx="150" cy="2" r="26" fill="#008746"/><circle cx="150" cy="-2" r="11" fill="#007561"/></g>
    <g class="lb-mask-dot" style="--d:1.75s"><circle cx="302" cy="70" r="32" fill="#bba800"/><circle cx="292" cy="72" r="10" fill="#008746"/></g>
    <g class="lb-mask-dot" style="--d:1.9s"><circle cx="10" cy="196" r="34" fill="#bba800"/><circle cx="6" cy="200" r="13" fill="#008746"/></g>
    <g class="lb-mask-dot" style="--d:2.05s"><circle cx="292" cy="200" r="20" fill="#008746"/><circle cx="294" cy="200" r="8" fill="#007561"/></g>
    <g transform="translate(136 86) scale(1.15) translate(-120 -70)"><g class="lb-mask-face">
      <path class="lb-mask-tie" d="M60 66c-14 2-22 12-34 10"/>
      <path class="lb-mask-tie lb-mask-tie-2" d="M60 70c-12 8-18 20-30 22"/>
      <path class="lb-mask-tie lb-mask-tie-r" d="M180 66c14 2 22 12 34 10"/>
      <path class="lb-mask-tie lb-mask-tie-r lb-mask-tie-2" d="M180 70c12 8 18 20 30 22"/>
      <path class="lb-mask-cloth" d="M120 60c-8-4-20-10-32-10-14 0-24 6-28 14l-8 6c6 10 18 20 36 20 16 0 24-6 32-10 8 4 16 10 32 10 18 0 30-10 36-20l-8-6c-4-8-14-14-28-14-12 0-24 6-32 10z"/>
      <g class="lb-mask-eyes">
        <ellipse cx="92" cy="72" rx="12" ry="8.5" fill="#fff"/>
        <ellipse cx="148" cy="72" rx="12" ry="8.5" fill="#fff"/>
        <circle cx="94" cy="73" r="4" fill="#14250d"/>
        <circle cx="150" cy="73" r="4" fill="#14250d"/>
      </g>
      <path class="lb-mask-shine" d="M70 62c6-6 14-8 22-7"/>
    </g></g>
  </g>
</svg>`,
    title: { en: 'The Mask', fr: 'The Mask' },
    note: { en: 'From my CodePen "The Mask", a poster that builds itself. Same colours and the same moves, in one timeline: the page unrolls, the green is brushed on through a mask, the bands draw themselves, the circles pop. It now ends on a mask of its own, which blinks.', fr: "Tirée de mon CodePen « The Mask », une affiche qui se construit toute seule. Mêmes couleurs, mêmes gestes, en une seule timeline : la page se déroule, le vert est passé au pinceau à travers un masque, les bandes se tracent, les cercles éclosent. Elle finit maintenant sur un masque bien à elle, qui cligne des yeux." },
  },
]

// Shown category by category, in the order of CATEGORIES
export const DEMOS = CATEGORIES.flatMap((cat) => LIST.filter((demo) => demo.cat === cat))
if (DEMOS.length !== LIST.length) throw new Error('lab: a demo has an unknown category')
