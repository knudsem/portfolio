// The lab's demos: the markup each one runs (also what the code panel
// shows), its category, the techniques it uses, and its name and note in
// both languages. Styles are in demos.css, behaviours in scripts.js, both
// marked per demo.

export const CATEGORIES = ['archive', 'buttons', 'icons', 'text', 'loaders', 'cards', 'navigation', 'inputs', 'feedback', 'scroll', 'backgrounds']

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
  <svg class="lb-send-tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>
  <span class="lb-send-label">Send</span>
  <span class="lb-send-done" aria-hidden="true">Sent</span>
</button>
<p class="lb-send-status" role="status"></p>`,
    title: { en: 'Send', fr: 'Envoyer' },
    note: { en: 'Click: the plane takes off, the label gives way to the confirmation and a tick draws itself, and screen readers hear it.', fr: "Au clic, l'avion décolle, le texte laisse place à la confirmation, une coche se dessine, et les lecteurs d'écran l'annoncent." },
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
    note: { en: 'A square becomes a circle, then a leaf, turning as it goes.', fr: 'Un carré devient cercle puis feuille, en tournant.' },
  },
  {
    id: 'loader-draw',
    cat: 'loaders',
    tech: ['CSS', 'SVG'],
    html: `<svg class="lb-draw" viewBox="0 10 150 60" role="img" aria-label="Loading">
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
  <span class="lb-reveal-picture" role="img" aria-label="A warm glow of yellow light"></span>
  <figcaption class="lb-reveal-caption">Golden hour, 2026</figcaption>
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
    note: { en: 'The envelope waits shut, then the flap opens and the letter comes out. Plain CSS.', fr: "L'enveloppe attend fermée, puis le rabat s'ouvre et la lettre sort. En CSS pur." },
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
    tech: ['CSS', 'SVG', 'linear()'],
    html: `<div class="lb-inf" role="status" aria-label="Loading">
  <svg viewBox="0 0 120 60" aria-hidden="true">
    <path class="lb-inf-track" d="M60 30C70 15 95 12 95 30S70 45 60 30 25 12 25 30s25 15 35 0"/>
    <path class="lb-inf-run" pathLength="100" d="M60 30C70 15 95 12 95 30S70 45 60 30 25 12 25 30s25 15 35 0"/>
  </svg>
</div>`,
    title: { en: 'Infinity', fr: 'Infini' },
    note: { en: 'A stroke rides an infinity sign like a roller coaster: slow over the tops, fast through the dips, thanks to a linear() easing.', fr: "Un trait parcourt un signe infini comme des montagnes russes : lent dans les montées, rapide dans les descentes, grâce à un easing linear()." },
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
  <button class="lb-gallery-panel" type="button" aria-pressed="true" style="--a:#ffd84a"><span>Lemon</span></button>
  <button class="lb-gallery-panel" type="button" aria-pressed="false" style="--a:#e0a020"><span>Honey</span></button>
  <button class="lb-gallery-panel" type="button" aria-pressed="false" style="--a:#b8860b"><span>Amber</span></button>
  <button class="lb-gallery-panel" type="button" aria-pressed="false" style="--a:#2a2a35"><span>Night</span></button>
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
      <span style="--c:#ffd84a">1</span>
      <span style="--c:#fff3bf">2</span>
      <span style="--c:#e0a020">3</span>
      <span style="--c:#f2f2f5">4</span>
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
    html: `<div class="lb-plx" role="region" tabindex="0" aria-label="A valley at dusk, scroll it">
  <div class="lb-plx-scene" aria-hidden="true">
    <span class="lb-plx-night"></span>
    <span class="lb-plx-stars"><i></i></span>
    <span class="lb-plx-moon"></span>
    <span class="lb-plx-sun"></span>
    <span class="lb-plx-clouds"></span>
    <span class="lb-plx-far"></span>
    <span class="lb-plx-mid"></span>
    <span class="lb-plx-fog"></span>
    <span class="lb-plx-near"></span>
    <span class="lb-plx-trees"></span>
    <span class="lb-plx-hint"></span>
  </div>
  <div class="lb-plx-length"></div>
</div>`,
    title: { en: 'Parallax', fr: 'Parallaxe' },
    note: { en: 'Scroll the box to rise out of a valley at dusk: six layers move at their depth, the sun sets, then the moon and the stars come out.', fr: "Faites défiler la boîte pour sortir d'une vallée au crépuscule : six plans bougent selon leur profondeur, le soleil se couche, la lune et les étoiles se lèvent." },
  },
  {
    id: 'scroll-carousel',
    cat: 'scroll',
    tech: ['CSS', 'scroll-driven', 'scroll-snap'],
    html: `<div class="lb-snap" role="region" tabindex="0" aria-label="Carousel, scroll it sideways">${['#ffd84a', '#fff3bf', '#e0a020', '#f2f2f5', '#ffd84a', '#fff3bf'].map((c, i) => `
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
  // Archive: my older animations, rebuilt
  {
    id: 'arch-magnifier',
    cat: 'archive',
    tech: ['CSS', 'JS', '@property'],
    html: `<div class="lb-loupe" role="img" aria-label="A magnifying glass passes over a bank card and enlarges its numbers">
  <div class="lb-loupe-scene">
    <div class="lb-loupe-card"><i></i><b>0000 0000 0000</b><u></u></div>
  </div>
  <div class="lb-loupe-lens">
    <div class="lb-loupe-scene">
      <div class="lb-loupe-card"><i></i><b>0000 0000 0000</b><u></u></div>
    </div>
  </div>
</div>`,
    title: { en: 'Magnifying glass', fr: 'Loupe' },
    note: { en: 'The glass truly magnifies: a scaled copy is seen through the lens. It glides on a smooth path, then follows the pointer.', fr: 'La loupe grossit pour de vrai : une copie agrandie se voit à travers la lentille. Elle suit un trajet fluide, puis le curseur.' },
  },
  {
    id: 'arch-cat',
    cat: 'archive',
    tech: ['SVG', 'CSS', 'JS'],
    html: `<button type="button" class="lb-luck" aria-label="Pet the lucky cat">
  <svg viewBox="0 0 641.3 1107.3" aria-hidden="true">
<defs>
<clipPath id="lb-lc-low">
<rect x="380" y="640" width="420" height="302"></rect></clipPath>
<clipPath id="lb-lc-mid">
<rect x="380" y="554" width="420" height="90"></rect></clipPath>
<clipPath id="lb-lc-lip">
<path d="M199,498.7C200.3,497.9 204.3,494.9 207,494C209.7,493.1 212.3,493.1 215,493C217.7,492.9 220.3,493.1 223,493.3C225.7,493.5 228.3,493.8 231,494.1C233.7,494.4 236.3,494.7 239,495C241.7,495.3 244.3,495.7 247,496.1C249.7,496.5 252.3,496.8 255,497.2C257.7,497.6 260.3,498 263,498.5C265.7,499 268.3,499.5 271,500C273.7,500.5 276.3,501.1 279,501.7C281.7,502.3 284.3,503.3 287,503.8C289.7,504.3 292.3,504.8 295,504.9C297.7,505 300.3,504.9 303,504.5C305.7,504.1 308.3,503.1 311,502.5C313.7,501.9 316.3,501.2 319,500.6C321.7,500 324.3,499.5 327,499C329.7,498.5 332.3,498.1 335,497.7C337.7,497.3 340.3,496.9 343,496.6C345.7,496.3 348.3,495.9 351,495.7C353.7,495.4 356.3,495.3 359,495.1C361.7,494.9 364.3,494.8 367,494.7C369.7,494.6 372.3,494.5 375,494.6C377.7,494.7 380.3,494.9 383,495.3C385.7,495.7 388.7,496.3 391,497C393.3,497.7 396,499.1 397,499.5L420,499.5L420,640L180,640L180,498.7Z" transform="translate(0 -1)"></path></clipPath></defs>
  <g class="lb-lc-shadow">
  <g class="lb-lc-1">
  <image width="478" height="170" transform="translate(70.1 864.7)" href="/media/lab/lucky-cat-ground.png"></image>
  </g>
  </g>
  <g class="lb-lc-tail">
  <path class="lb-lc-2" d="M452.48,521s-1.4,2.5-2.5,10.4c0,0.8-5.3,21.4,17.7,22.5a23.41,23.4,0,0,0,13.5-3.4c3.47-2.2,5.9-5,5.1-8.6-0.9-1.6-1.3-3.5-6.3-2.6a14.77,14.8,0,0,0,1.6-8,4.7,4.7,0,0,0-5.8-4.2c-1.2.33-1.8,1.2-5.1,4.4-0.4,0,0.2.57-0.4,0s1.24-17.2-4.6-16.4c-2.7,1.4-5.5,1.3-5,19.7,0,0-0.1.07-0.1,0C459.36,529,457.7,514.8,452.5,521Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-3" d="M340.29,696.8s14.2,23.9,24,21.8c.14,4.2,13.4,20.4,26.1,18,6.7,9.9,15.5,26.1,45.4,25.8,1.6,1.6,21.2,11.4,30.2-1.1,2.1,4.9,26.9,2.7,34.5-18,4.7-3.6,11.2-8.1,9.4-13.4,1.8-0.4,14-7.6,16.5-20.1,7.3-11,10.7-14.8,16.1-34.4-0.2-3.5,2.2-1.1-0.2-12.5s-3.5-12.5-1.8-21.4,7.4-8.7-5.4-23.9c0,0-1.9-14.8-4.2-19.4S519,582.8,514.9,582s-6.6-8.9-23.9-14.2S477.52,553,477.5,553s-8.4-9.1-7.3,1.5c0,1.6-7.8,13.7,19.3,23.6a31.13,31.1,0,0,1,9.2,5.1,21.2,21.2,0,0,1,6.5,9c.7,1.2,1.5-0.8,7.4,8.1-0.8-0.2,9.3,10,5.1,16.9-0.7,4.3-3.8,9.5,8,24.9-2.2,2.2-8.8,14-3.9,25.6-0.7,7.6-15.5,13.3-17.1,34.5-1.8,2.7-14.8,7.8-20.9,20.6-4.8,3-14.3,15.1-34.1,3.8-5.9-3.7-7.1-5.2-22.4-11.9-3.9-5.2-24.6-25.7-26.2-35.2-5.6-4.6-19.4-18-19.4-18Z" transform="translate(-63.9 148.7)"></path><path class="lb-lc-4" d="M361.57,718.5s21.07-1,38.1-29" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-4" d="M385.07,736.5s30.93,0,26.7-29.1" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-4" d="M435.84,762.3s15.05-7.2,5.3-25" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-4" d="M466.27,760.7c-0.9.72,6.8-13.9,2.4-28.7" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-4" d="M499.34,746s.21-19.4-15.7-23.2" transform="translate(-63.9 148.7)"></path><path class="lb-lc-4" d="M514.67,678.4s15.62,7,11.8,30" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-4" d="M504.59,702.1s13.09,6.5,11.6,23.8" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-4" d="M529.23,661.4s10,0,13.8,11.4" transform="translate(-63.9 148.7)"></path>
  <line class="lb-lc-4" x1="458.9" y1="771.2" x2="471.8" y2="765.6"></line>
  <path class="lb-lc-4" d="M505.13,592.2s1.37-6.8,9.5-5.5" transform="translate(-63.9 148.7)"></path></g><g>
  <g>
  <path class="lb-lc-5" d="M637.28,497.8a36.15,36.1,0,0,1-9.3,5.4c-6.1,2.3-14.7-2.5-21.4-2.5a50.77,50.8,0,0,0-26.7,7.4,11.9,11.9,0,0,1-3,1.4c-9.4,2.7-9.9,2.9-14.4,2.1a12.73,12.7,0,0,1-2.3-0.6c-7.1-2.8-24.4-7.9-33.5-7.9a11.52,11.5,0,0,1-7.7-2.9c-8.6-7.7-10.9-10.8-13.8-15.4-3.3-5.2-8.1-41.4-46.6-37.2l-9.1,56c1.11-1.3,12.5-3.4,14.1,2.5s12.22,21,23.8,35c10.9,13.2,32.4,11.7,42.7,12.6a11.55,11.6,0,0,0,3.6-0.3c9.56-2.2,21.4-3.7,34.2,5.5,13.3,9.7,47.9-6.9,70.4-2.2a10.75,10.8,0,0,0,2.9.27c.68,0,1.3-0.1,2-0.2" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M641.92,556.6C625,554,607,559,590,562c-12,2-23-3-34-8-9-3-18-2-27,0a62.52,62.5,0,0,1-30-4c-15-6-21-22-31-34-3-4-3-10-7-13-4-2-8-2-11.6.6" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M458.56,447.6C469,444,479,449,487,455c11,7,14,20,20,32,3.7,6.4,8.7,13.3,15,15.7a8.19,8.2,0,0,0,3.3.45C548.78,502,553.3,513,568,511c17.22-2,30.6-15.8,48.4-8.4" transform="translate(-63.9 148.7)"></path>
  </g>
  </g>
  
<g class="lb-lc-arm">
<g clip-path="url(#lb-lc-low)">
<path class="lb-lc-5" d="M617.32,556.9c7.79-2.4,22.8.34,23.8.28,26.1-1.7,33.7-27.4,38.2-38.1a11.25,11.2,0,0,0,0.9-4.5c-0.1-10.8-0.7-43.5,2-52.2A48,48,0,0,0,683,452.2c-1.9-12.9,0-33.6-0.8-48.7A11.35,11.3,0,0,1,688,393.3c1.56-0.9,2.6-2.6,4.7-4.6a24.06,24.1,0,0,0,6.3-9.7c8.17-24,1.6-45.8-1.5-49.7-7.8-10.8-42.1-8-50-7.3a10.77,10.8,0,0,1-2.7-0.1c-3-0.5-11.9.18-19.3,20.9l-0.1.44c-0.6,1.9-4.6,15.7,2.2,35.3a11.8,11.8,0,0,0,2,3.6c2.93,3.5,7,8.6,13,10.7a11.45,11.4,0,0,1,7.4,9.4,28.6,28.6,0,0,1-0.9,13.6c-3,8.8-10.1,26.3-13.7,28-1.2.55-1.4,1.2-1.2,1.7a10.84,10.8,0,0,1,0.3,6.9c-0.8,3.2-1.4,8.5-1.4,17.4,0,20-5.1,35.1-10.7,34.2" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-8" d="M676.13,458.2c-5.2-3.2-6.8-26.2-7-23-1.3,14.9-3.5,26.1-8.9,23.8s-6.9-20.1-6.9-20.1-6.1,4.4-10.2,16.3-8.4-2.8-8.4-2.8a10.84,10.8,0,0,0-0.3-6.9c-0.2-0.6,0-1.2,1.2-1.7,3.6-1.6,10.7-19.2,13.7-28a28.56,28.6,0,0,0,0.9-13.6,11.4,11.4,0,0,0-7.4-9.4c-6.1-2.1-10.1-7.2-13-10.7a11.8,11.8,0,0,1-2-3.6c-6.8-19.6-2.8-33.4-2.2-35.3l.15-0.4c7.47-20.7,16.3-21.4,19.3-20.9a10.77,10.8,0,0,0,2.7.11c7.86-0.8,42.2-3.6,50,7.3,3,3.8,9.7,25.7,1.5,49.7a24.06,24.1,0,0,1-6.3,9.7c-2.1,2-3.1,3.7-4.7,4.6a11.35,11.3,0,0,0-5.7,10.2c.72,15.1-1.2,35.8.76,48.7C683,452.2,681.6,461.6,676.1,458.2Z" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-6" d="M617.32,556.9C619,557,620,556,622,556c10-1,19,3,29-1,17-6,24-23,29-38,0-21-1-42,3-62-1-17-2-34-1-51a11.35,11.3,0,0,1,3-8c20-15,22-42,15-63-4-10-14-10-23-12-12-1-23,1-35,1-20,9-22,37-15,55a29.82,29.8,0,0,0,17,16c8,4,8,14,6,22-1,2-3,4-3,6-2,9-7,16-12,24-1,2,0,5,0,8-3,14-1,27-4,41-1,4-3,8-7.1,9.8" transform="translate(-63.9 148.7)"></path></g>
<path class="lb-lc-paw-ink" d="M588.94,558.07Q588.7,556 588.94,553.93Q589.17,551.86 589.87,549.93Q590.56,548 591.67,546.34Q592.77,544.69 594.21,543.41Q595.65,542.14 597.33,541.34Q599,540.55 600.8,540.27Q602.6,540 604.4,540.27Q606.2,540.55 607.87,541.34Q609.55,542.14 610.99,543.41Q612.43,544.69 613.53,546.34Q614.64,548 615.33,549.93Q616.03,551.86 616.26,553.93Q616.5,556 616.26,558.07Q616.03,560.14 615.33,562.07Q614.64,564 613.53,565.66Q612.43,567.31 610.99,568.59Q609.55,569.86 607.87,570.66Q606.2,571.45 604.4,571.73Q602.6,572 600.8,571.73Q599,571.45 597.33,570.66Q595.65,569.86 594.21,568.59Q592.77,567.31 591.67,565.66Q590.56,564 589.87,562.07Q589.17,560.14 588.94,558.07Z"></path>
<g class="lb-lc-forearm">
<g clip-path="url(#lb-lc-mid)">
<path class="lb-lc-5" d="M617.32,556.9c7.79-2.4,22.8.34,23.8.28,26.1-1.7,33.7-27.4,38.2-38.1a11.25,11.2,0,0,0,0.9-4.5c-0.1-10.8-0.7-43.5,2-52.2A48,48,0,0,0,683,452.2c-1.9-12.9,0-33.6-0.8-48.7A11.35,11.3,0,0,1,688,393.3c1.56-0.9,2.6-2.6,4.7-4.6a24.06,24.1,0,0,0,6.3-9.7c8.17-24,1.6-45.8-1.5-49.7-7.8-10.8-42.1-8-50-7.3a10.77,10.8,0,0,1-2.7-0.1c-3-0.5-11.9.18-19.3,20.9l-0.1.44c-0.6,1.9-4.6,15.7,2.2,35.3a11.8,11.8,0,0,0,2,3.6c2.93,3.5,7,8.6,13,10.7a11.45,11.4,0,0,1,7.4,9.4,28.6,28.6,0,0,1-0.9,13.6c-3,8.8-10.1,26.3-13.7,28-1.2.55-1.4,1.2-1.2,1.7a10.84,10.8,0,0,1,0.3,6.9c-0.8,3.2-1.4,8.5-1.4,17.4,0,20-5.1,35.1-10.7,34.2" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-8" d="M676.13,458.2c-5.2-3.2-6.8-26.2-7-23-1.3,14.9-3.5,26.1-8.9,23.8s-6.9-20.1-6.9-20.1-6.1,4.4-10.2,16.3-8.4-2.8-8.4-2.8a10.84,10.8,0,0,0-0.3-6.9c-0.2-0.6,0-1.2,1.2-1.7,3.6-1.6,10.7-19.2,13.7-28a28.56,28.6,0,0,0,0.9-13.6,11.4,11.4,0,0,0-7.4-9.4c-6.1-2.1-10.1-7.2-13-10.7a11.8,11.8,0,0,1-2-3.6c-6.8-19.6-2.8-33.4-2.2-35.3l.15-0.4c7.47-20.7,16.3-21.4,19.3-20.9a10.77,10.8,0,0,0,2.7.11c7.86-0.8,42.2-3.6,50,7.3,3,3.8,9.7,25.7,1.5,49.7a24.06,24.1,0,0,1-6.3,9.7c-2.1,2-3.1,3.7-4.7,4.6a11.35,11.3,0,0,0-5.7,10.2c.72,15.1-1.2,35.8.76,48.7C683,452.2,681.6,461.6,676.1,458.2Z" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-6" d="M617.32,556.9C619,557,620,556,622,556c10-1,19,3,29-1,17-6,24-23,29-38,0-21-1-42,3-62-1-17-2-34-1-51a11.35,11.3,0,0,1,3-8c20-15,22-42,15-63-4-10-14-10-23-12-12-1-23,1-35,1-20,9-22,37-15,55a29.82,29.8,0,0,0,17,16c8,4,8,14,6,22-1,2-3,4-3,6-2,9-7,16-12,24-1,2,0,5,0,8-3,14-1,27-4,41-1,4-3,8-7.1,9.8" transform="translate(-63.9 148.7)"></path></g></g>
<g class="lb-lc-paw">
<path class="lb-lc-paw-ink" d="M564.76,513.08Q564.52,510.15 564.62,507.85Q564.72,505.54 565.13,503.48Q565.54,501.41 566.25,499.55Q566.97,497.69 567.98,496.03Q568.99,494.36 570.29,492.89Q571.6,491.42 573.19,490.16Q574.78,488.89 576.65,487.85Q578.52,486.8 580.66,485.97Q582.79,485.15 585.2,484.55Q587.61,483.96 590.34,483.6Q593.06,483.24 596.53,483.12Q600,483 603.47,483.12Q606.94,483.24 609.66,483.6Q612.39,483.96 614.8,484.55Q617.21,485.15 619.34,485.97Q621.48,486.8 623.35,487.85Q625.22,488.89 626.81,490.16Q628.4,491.42 629.71,492.89Q631.01,494.36 632.02,496.03Q633.03,497.69 633.75,499.55Q634.46,501.41 634.87,503.48Q635.28,505.54 635.38,507.85Q635.48,510.15 635.24,513.08Q635,516 634.5,518.92Q634.01,521.85 633.35,524.15Q632.69,526.46 631.84,528.52Q630.99,530.59 629.95,532.45Q628.91,534.31 627.7,535.97Q626.49,537.64 625.11,539.11Q623.74,540.58 622.22,541.84Q620.69,543.11 619.02,544.15Q617.36,545.2 615.54,546.03Q613.73,546.85 611.77,547.45Q609.8,548.04 607.63,548.4Q605.46,548.76 602.73,548.88Q600,549 597.27,548.88Q594.54,548.76 592.37,548.4Q590.2,548.04 588.23,547.45Q586.27,546.85 584.46,546.03Q582.64,545.2 580.98,544.15Q579.31,543.11 577.78,541.84Q576.26,540.58 574.89,539.11Q573.51,537.64 572.3,535.97Q571.09,534.31 570.05,532.45Q569.01,530.59 568.16,528.52Q567.31,526.46 566.65,524.15Q565.99,521.85 565.5,518.92Q565,516 564.76,513.08Z"></path>
<path class="lb-lc-paw-ink" d="M562.73,488.07Q562.5,486 562.73,483.93Q562.96,481.86 563.63,479.93Q564.31,478 565.38,476.34Q566.45,474.69 567.85,473.41Q569.25,472.14 570.88,471.34Q572.51,470.55 574.25,470.27Q576,470 577.75,470.27Q579.49,470.55 581.12,471.34Q582.75,472.14 584.15,473.41Q585.55,474.69 586.62,476.34Q587.69,478 588.37,479.93Q589.04,481.86 589.27,483.93Q589.5,486 589.27,488.07Q589.04,490.14 588.37,492.07Q587.69,494 586.62,495.66Q585.55,497.31 584.15,498.59Q582.75,499.86 581.12,500.66Q579.49,501.45 577.75,501.73Q576,502 574.25,501.73Q572.51,501.45 570.88,500.66Q569.25,499.86 567.85,498.59Q566.45,497.31 565.38,495.66Q564.31,494 563.63,492.07Q562.96,490.14 562.73,488.07Z"></path>
<path class="lb-lc-paw-ink" d="M587.23,485.07Q587,483 587.23,480.93Q587.46,478.86 588.13,476.93Q588.81,475 589.88,473.34Q590.95,471.69 592.35,470.41Q593.75,469.14 595.38,468.34Q597.01,467.55 598.75,467.27Q600.5,467 602.25,467.27Q603.99,467.55 605.62,468.34Q607.25,469.14 608.65,470.41Q610.05,471.69 611.12,473.34Q612.19,475 612.87,476.93Q613.54,478.86 613.77,480.93Q614,483 613.77,485.07Q613.54,487.14 612.87,489.07Q612.19,491 611.12,492.66Q610.05,494.31 608.65,495.59Q607.25,496.86 605.62,497.66Q603.99,498.45 602.25,498.73Q600.5,499 598.75,498.73Q597.01,498.45 595.38,497.66Q593.75,496.86 592.35,495.59Q590.95,494.31 589.88,492.66Q588.81,491 588.13,489.07Q587.46,487.14 587.23,485.07Z"></path>
<path class="lb-lc-paw-ink" d="M611.72,488.07Q611.5,486 611.72,483.93Q611.94,481.86 612.59,479.93Q613.24,478 614.27,476.34Q615.31,474.69 616.65,473.41Q618,472.14 619.57,471.34Q621.14,470.55 622.82,470.27Q624.5,470 626.18,470.27Q627.86,470.55 629.43,471.34Q631,472.14 632.35,473.41Q633.69,474.69 634.73,476.34Q635.76,478 636.41,479.93Q637.06,481.86 637.28,483.93Q637.5,486 637.28,488.07Q637.06,490.14 636.41,492.07Q635.76,494 634.73,495.66Q633.69,497.31 632.35,498.59Q631,499.86 629.43,500.66Q627.86,501.45 626.18,501.73Q624.5,502 622.82,501.73Q621.14,501.45 619.57,500.66Q618,499.86 616.65,498.59Q615.31,497.31 614.27,495.66Q613.24,494 612.59,492.07Q611.94,490.14 611.72,488.07Z"></path>
<g class="lb-lc-paw-body">
<path class="lb-lc-paw-skin" d="M588.94,558.07Q588.7,556 588.94,553.93Q589.17,551.86 589.87,549.93Q590.56,548 591.67,546.34Q592.77,544.69 594.21,543.41Q595.65,542.14 597.33,541.34Q599,540.55 600.8,540.27Q602.6,540 604.4,540.27Q606.2,540.55 607.87,541.34Q609.55,542.14 610.99,543.41Q612.43,544.69 613.53,546.34Q614.64,548 615.33,549.93Q616.03,551.86 616.26,553.93Q616.5,556 616.26,558.07Q616.03,560.14 615.33,562.07Q614.64,564 613.53,565.66Q612.43,567.31 610.99,568.59Q609.55,569.86 607.87,570.66Q606.2,571.45 604.4,571.73Q602.6,572 600.8,571.73Q599,571.45 597.33,570.66Q595.65,569.86 594.21,568.59Q592.77,567.31 591.67,565.66Q590.56,564 589.87,562.07Q589.17,560.14 588.94,558.07Z"></path>
<path class="lb-lc-paw-skin lb-lc-paw-shade" d="M564.76,513.08Q564.52,510.15 564.62,507.85Q564.72,505.54 565.13,503.48Q565.54,501.41 566.25,499.55Q566.97,497.69 567.98,496.03Q568.99,494.36 570.29,492.89Q571.6,491.42 573.19,490.16Q574.78,488.89 576.65,487.85Q578.52,486.8 580.66,485.97Q582.79,485.15 585.2,484.55Q587.61,483.96 590.34,483.6Q593.06,483.24 596.53,483.12Q600,483 603.47,483.12Q606.94,483.24 609.66,483.6Q612.39,483.96 614.8,484.55Q617.21,485.15 619.34,485.97Q621.48,486.8 623.35,487.85Q625.22,488.89 626.81,490.16Q628.4,491.42 629.71,492.89Q631.01,494.36 632.02,496.03Q633.03,497.69 633.75,499.55Q634.46,501.41 634.87,503.48Q635.28,505.54 635.38,507.85Q635.48,510.15 635.24,513.08Q635,516 634.5,518.92Q634.01,521.85 633.35,524.15Q632.69,526.46 631.84,528.52Q630.99,530.59 629.95,532.45Q628.91,534.31 627.7,535.97Q626.49,537.64 625.11,539.11Q623.74,540.58 622.22,541.84Q620.69,543.11 619.02,544.15Q617.36,545.2 615.54,546.03Q613.73,546.85 611.77,547.45Q609.8,548.04 607.63,548.4Q605.46,548.76 602.73,548.88Q600,549 597.27,548.88Q594.54,548.76 592.37,548.4Q590.2,548.04 588.23,547.45Q586.27,546.85 584.46,546.03Q582.64,545.2 580.98,544.15Q579.31,543.11 577.78,541.84Q576.26,540.58 574.89,539.11Q573.51,537.64 572.3,535.97Q571.09,534.31 570.05,532.45Q569.01,530.59 568.16,528.52Q567.31,526.46 566.65,524.15Q565.99,521.85 565.5,518.92Q565,516 564.76,513.08Z"></path>
<path class="lb-lc-paw-lit" d="M564.76,513.08Q564.52,510.15 564.62,507.85Q564.72,505.54 565.13,503.48Q565.54,501.41 566.25,499.55Q566.97,497.69 567.98,496.03Q568.99,494.36 570.29,492.89Q571.6,491.42 573.19,490.16Q574.78,488.89 576.65,487.85Q578.52,486.8 580.66,485.97Q582.79,485.15 585.2,484.55Q587.61,483.96 590.34,483.6Q593.06,483.24 596.53,483.12Q600,483 603.47,483.12Q606.94,483.24 609.66,483.6Q612.39,483.96 614.8,484.55Q617.21,485.15 619.34,485.97Q621.48,486.8 623.35,487.85Q625.22,488.89 626.81,490.16Q628.4,491.42 629.71,492.89Q631.01,494.36 632.02,496.03Q633.03,497.69 633.48,499.55Q633.93,501.41 633.64,505.78Q633.34,510.15 631.4,516Q629.45,521.85 626.59,526.22Q623.74,530.59 621.16,532.45Q618.58,534.31 615.91,535.97Q613.24,537.64 610.68,539.11Q608.12,540.58 604.06,541.84Q600,543.11 594.83,543.11Q589.65,543.11 584.55,541.84Q579.44,540.58 577.28,539.11Q575.11,537.64 573.32,535.97Q571.53,534.31 570.27,532.45Q569.01,530.59 568.16,528.52Q567.31,526.46 566.65,524.15Q565.99,521.85 565.5,518.92Q565,516 564.76,513.08Z"></path>
<path class="lb-lc-paw-skin" d="M562.73,488.07Q562.5,486 562.73,483.93Q562.96,481.86 563.63,479.93Q564.31,478 565.38,476.34Q566.45,474.69 567.85,473.41Q569.25,472.14 570.88,471.34Q572.51,470.55 574.25,470.27Q576,470 577.75,470.27Q579.49,470.55 581.12,471.34Q582.75,472.14 584.15,473.41Q585.55,474.69 586.62,476.34Q587.69,478 588.37,479.93Q589.04,481.86 589.27,483.93Q589.5,486 589.27,488.07Q589.04,490.14 588.37,492.07Q587.69,494 586.62,495.66Q585.55,497.31 584.15,498.59Q582.75,499.86 581.12,500.66Q579.49,501.45 577.75,501.73Q576,502 574.25,501.73Q572.51,501.45 570.88,500.66Q569.25,499.86 567.85,498.59Q566.45,497.31 565.38,495.66Q564.31,494 563.63,492.07Q562.96,490.14 562.73,488.07Z"></path>
<path class="lb-lc-paw-skin" d="M587.23,485.07Q587,483 587.23,480.93Q587.46,478.86 588.13,476.93Q588.81,475 589.88,473.34Q590.95,471.69 592.35,470.41Q593.75,469.14 595.38,468.34Q597.01,467.55 598.75,467.27Q600.5,467 602.25,467.27Q603.99,467.55 605.62,468.34Q607.25,469.14 608.65,470.41Q610.05,471.69 611.12,473.34Q612.19,475 612.87,476.93Q613.54,478.86 613.77,480.93Q614,483 613.77,485.07Q613.54,487.14 612.87,489.07Q612.19,491 611.12,492.66Q610.05,494.31 608.65,495.59Q607.25,496.86 605.62,497.66Q603.99,498.45 602.25,498.73Q600.5,499 598.75,498.73Q597.01,498.45 595.38,497.66Q593.75,496.86 592.35,495.59Q590.95,494.31 589.88,492.66Q588.81,491 588.13,489.07Q587.46,487.14 587.23,485.07Z"></path>
<path class="lb-lc-paw-skin" d="M611.72,488.07Q611.5,486 611.72,483.93Q611.94,481.86 612.59,479.93Q613.24,478 614.27,476.34Q615.31,474.69 616.65,473.41Q618,472.14 619.57,471.34Q621.14,470.55 622.82,470.27Q624.5,470 626.18,470.27Q627.86,470.55 629.43,471.34Q631,472.14 632.35,473.41Q633.69,474.69 634.73,476.34Q635.76,478 636.41,479.93Q637.06,481.86 637.28,483.93Q637.5,486 637.28,488.07Q637.06,490.14 636.41,492.07Q635.76,494 634.73,495.66Q633.69,497.31 632.35,498.59Q631,499.86 629.43,500.66Q627.86,501.45 626.18,501.73Q624.5,502 622.82,501.73Q621.14,501.45 619.57,500.66Q618,499.86 616.65,498.59Q615.31,497.31 614.27,495.66Q613.24,494 612.59,492.07Q611.94,490.14 611.72,488.07Z"></path></g>
<g class="lb-lc-claw" transform="translate(577 470.56) scale(1 1) translate(-582 -469.8)">
<path class="lb-lc-7" d="M641,320.9s1.14-19.8,2.8-22.1,7.4,6.7,7,22.3C641.08,319.7,641,320.9,641,320.9Z" transform="translate(-63.9 148.7)"></path></g>
<g class="lb-lc-claw" transform="translate(601.5 467.56) scale(1 1) translate(-606.8 -469.8)">
<path class="lb-lc-7" d="M666,320.1c-0.3-2.1-1.5-14,4.7-22.6a.44.4,0,0,1,0.7,0c3,3.5,6,14,3.1,23.3a.42.4,0,0,1-0.4.3l-7.6-0.6A.44.4,0,0,1,666,320.1Z" transform="translate(-63.9 148.7)"></path></g>
<g class="lb-lc-claw" transform="translate(625.5 470.57) scale(1 1) translate(-630 -474.8)">
<path class="lb-lc-7" d="M688.37,323.6s.94-15.5,7.2-21.4c.46-0.4,1.8-1.7,2.2-1.3,1.8,1.9,3.5,7.3-3,25.2Z" transform="translate(-63.9 148.7)"></path></g>
<g class="lb-lc-dewclaw" transform="translate(565.57 501.84) scale(1 1) translate(-560.4 -498.8)">
<path class="lb-lc-7" d="M621.38,353.1s-12.1-12-14.4-18.3,9.2,6.9,21.3,1.8C624.64,344.1,621.4,353.1,621.4,353.1Z" transform="translate(-63.9 148.7)"></path></g></g></g>
  <g><path class="lb-lc-9" d="M300.57,420.9l-28.1,67.8,11.2,23.5,8.1,14.6,13.5,35.2s9.59,63.8,9.6,70.6S307.94,677,307.9,677L408.51,793.6l24.59-12.1s11.85-18.6,10.7-24,7.5-30.3,7.5-30.3L457.82,685s4.12-9.3-7.2-26.5c-1.8-8.7-3.6-8.7-5.6-35.7,3.2-24.3,16.9-15-4.8-61.5-1.8-13.1-4.3-14.9,3.6-31.4S461,506.2,458,451.8s-35.2-30.9-35.2-30.9Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-5" d="M456.51,469.8c5.82,26.9-9.1,58.3-14.9,69a18,18,0,0,0-2.1,8c-0.1,4.8-0.2,11.1,5.6,22.7,5.8,11.2,12.6,24.5,1.8,49.4a15.84,15.8,0,0,0-1.2,7.6c.66,8.1-2.7,12.7,11.2,43,2.5,5.1,5.6,26.6-8.7,48.5,0,6.1-3,10.7,1.1,32.7,0,0,3.5,23.1-8.5,31.3-59.2,40.3-140.4,8.5-140.4,8.5s-24.4-20.9-33.6-28.6c-28.9-24-18.1-44.4-15.6-51.2,5.4-10.9,9.1-7.3,9.8-12.5a19.86,19.9,0,0,0-3.3-13.7c-13.9-21,5.3-37,12.9-48.3,11.5-10.7,11.4-13.7,11.4-18.8a29.65,29.6,0,0,0-4.2-15c-5.6-9.8,1.9-16.9,5.3-19.7,5.7-5,7.3-8.2,8-11.1a16.09,16.1,0,0,0-3.5-13.6c-2.8-3.5-5.5-6.9-7.7-10.2a24.12,24.1,0,0,1-4-18.6,58.7,58.7,0,0,0,1.1-10.5s-3.9-10.9,0-17.3" transform="translate(-63.9 148.7)"></path><path class="lb-lc-10" d="M329.19,452.5S318,466.1,312.9,504.6c8.85-6.5,12.3-9.5,16.3-9.5,1,3.4-8.2,10.2-4.1,36.8l8.17-8.8s3.4,25.9-4.1,41.2-21.4,27.6-1,60.9c2.72,8.5,6.5,11.2-11.2,54.1-1.4,4.1-6.7,27.9,6.5,67.1,6.8,10.2,13.6,17.7,17,20.8,0-6.8-3.1-19.1,0-17.7s9.53,21.8,21.1,23.5c3.41-5.8,8.2-21.1,8.2-21.1s3.07-2,5.8,4.4,3.7,11.9,6.8,9.5,20.8-23.8,23.1-47.7-2.7-32,0-48.7,4.4-20.8.65-37.1-16.6-36.8-5.4-65.7c3.06-9.5,4.6-24.9,4.7-38.8,4.8,3.8,7.2,7.5,9.1,5.8-0.1-11.2.22-24.9-1.8-34.7-1.7-1.4,1.7-3.4,4.8-1s7.3,5.3,8.8,8.2a7.14,7.1,0,0,1,1,3.1c-2.4-14.6,0-45.6-5.4-52.1S329.19,452.5,329.2,452.5Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M358.9,522s-3.8,69.8,5,55.8,8.9-20.1,8.9-20.1-0.2,21.8,5.9,25.5" transform="translate(-63.9 148.7)"></path>
  <g>
  <path class="lb-lc-6" d="M456.51,469.8c5.82,26.9-9.1,58.3-14.9,69a18,18,0,0,0-2.1,8c-0.1,4.8-0.2,11.1,5.6,22.7,5.8,11.2,12.6,24.5,1.8,49.4a15.84,15.8,0,0,0-1.2,7.6c.66,8.1-2.7,12.7,11.2,43,2.5,5.1,5.6,26.6-8.7,48.5,0,6.1-3,10.7,1.1,32.7,0,0,3.5,23.1-8.5,31.3-59.2,40.3-140.4,8.5-140.4,8.5s-24.4-20.9-33.6-28.6c-28.9-24-18.1-44.4-15.6-51.2,5.4-10.9,9.1-7.3,9.8-12.5a19.86,19.9,0,0,0-3.3-13.7c-13.9-21,5.3-37,12.9-48.3,11.5-10.7,11.4-13.7,11.4-18.8a29.65,29.6,0,0,0-4.2-15c-5.6-9.8,1.9-16.9,5.3-19.7,5.7-5,7.3-8.2,8-11.1a16.09,16.1,0,0,0-3.5-13.6c-2.8-3.5-5.5-6.9-7.7-10.2a24.12,24.1,0,0,1-4-18.6,58.7,58.7,0,0,0,1.1-10.5s-3.9-10.9,0-17.3" transform="translate(-63.9 148.7)"></path>
  </g>
  </g>
  <g>
  <path class="lb-lc-5" d="M428.81,707.4s10.52-19.2,41.2-22.8c13.62-5.5,18.8-3.6,37.5-35.6,10.8-18.8,48.7-36.4,52.1,12.4,3.7,23.7-1.4,32.8,2.7,42,3.2,7.2,3.4,21.2,3.1,39.1a130.55,130.6,0,0,1-3.2,25.6c-1.1,4.8-1.3,10.5.31,19.8,2.7,15.3,7.9,39.6,4.9,48.5,4.4,0,28.9-0.3,60.9,72.2-1.9-1-20-20.8-20-20.8s18,28.4,6.5,56.9c-6.1-11.6-23.8-41.5-28.1-44.1,3.6,8.3,11.9,17.1,7.8,47.1-6.5-13.1-14.8-28.6-22.3-36.4,2.1,5.9,5.6,6.3,6.3,18.6-5.7.65-14.1-0.5-23.2-16.5-7.9-3-47,2.6-35.6-46.4,2-7.8,4.5-15.4,8.3-17.1a199.42,199.4,0,0,0,2.1-44.4c-1.8-22.8-4-43.9-1.2-53.3,0-6.7-9.9-31.6-3.4-47.2-4.2,1.6-14.3,22.1-28.7,21.3a11.55,11.6,0,0,0-7.8,2.5c-1.9,1.5-1.9,2.7-5.4,7.6-5.3,7.4-43,88.6-78.6,58.9" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-11" d="M610.41,871.2l17.16,34.4-16.5-14.7s9.64,33,3.9,51c-9.6-15.2-26.3-41.2-28.3-41.2s12,14.7,7.3,42.8c-13.7-20.4-15.7-24.3-21.6-29.7,4.3,7.9,5.6,7.8,6.2,16.2-4.7-0.3-11.7-0.3-22.8-17.6-10.5-0.5-39.6-4.3-38.7-30.9,1.3-13.7,16.5-18.8,25.6-2.1s13.47,0,13.5,0,7.5-24.8,15.5,0,11.9-5.3,11.9-5.3,0-15.7,9.1-3,13.5,1.9,9.5-5-6.3-10.2-6.3-10.2Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M428,708.4s8.89-16.2,34.2-21.7a52.83,52.8,0,0,0,12.3-4.2c9.07-4.4,16.4-5.6,32.2-32.6,10.8-18.8,48.6-36.4,52.1,12.4,3.7,23.7-1.4,32.8,2.7,42,3.6,8.2,5.5,27.5,3.5,48.2a57.11,57.1,0,0,1-2.4,12.1c-1.9,6.1-2.5,10.1-0.9,24.3,2,17.4,8.7,38.6,5.7,47.5,4.4,0,28.9-0.3,60.9,72.2-1.9-1-20.8-19.8-20.8-19.8s18.05,28.4,6.5,56.9c-6.1-11.6-23.8-41.5-28.1-44.1,3.6,8.3,12.4,18.2,8.3,48.1-6.5-13.1-15.3-29.6-22.8-37.5,2.1,5.9,5.6,6.3,6.3,18.6-5.7.65-14.1-0.5-23.2-16.5-7.9-3-47,2.6-35.6-46.4,2-7.8,4.5-15.4,8.3-17.1a198.72,198.7,0,0,0,2.1-44.4c-1.8-22.8-4-43.9-1.2-53.3,0-6.7-9.9-31.6-3.4-47.2-4.2,1.6-14.3,22.1-28.7,21.3a11.53,11.5,0,0,0-7.8,2.5c-1.9,1.5-1.9,2.7-5.4,7.6-5.3,7.4-43,88.6-78.7,58.9" transform="translate(-63.9 148.7)"></path><path class="lb-lc-6" d="M561.77,789c3.73,21.7,8.7,38.6,5.7,47.5" transform="translate(-63.9 148.7)"></path>
  </g><g>
  <g>
  <path class="lb-lc-5" d="M293.49,696.1S283,676.8,252.2,673.2c-13.6-5.4-18.8-3.6-37.5-35.6-10.8-18.7-48.6-36.4-52.1,12.4-3.7,23.7,1.4,32.8-2.7,42-3.2,7.2-3.4,21.2-3.1,39.1A130.45,130.4,0,0,0,160,756.9c1.07,4.8,1.3,10.5-0.3,19.8-2.7,15.3-7.9,39.6-4.9,48.5-4.4,0-28.8-0.3-60.8,72.2,1.9-1,20-20.7,20-20.7s-18,28.3-6.5,56.9c6.09-11.6,23.8-41.5,28.1-44.1-3.6,8.3-11.9,17.1-7.8,47.1,6.5-13.1,14.8-28.5,22.3-36.4-2.1,5.9-5.6,6.3-6.3,18.6,5.7.65,14.1-0.5,23.2-16.5,7.9-3,47,2.6,35.6-46.4-2-7.8-4.5-15.4-8.3-17.1A198.72,198.7,0,0,1,192,794.2c1.77-22.8,4-43.9,1.2-53.3,0-6.7,9.9-31.6,3.4-47.2,4.2,1.6,14.3,22.1,28.7,21.3a11.56,11.6,0,0,1,7.8,2.5c1.87,1.5,1.9,2.7,5.4,7.6,5.3,7.4,43,88.6,78.6,58.9" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-11" d="M111.88,859.8,94.7,894.3l16.46-14.7s-9.7,33-3.9,51c9.59-15.2,26.3-41.2,28.3-41.2s-12,14.7-7.4,42.8c13.69-20.4,15.7-24.3,21.6-29.7-4.3,7.9-5.6,7.8-6.2,16.2,4.7-0.3,11.7-0.3,22.8-17.6,10.5-0.5,39.6-4.4,38.7-30.9-1.3-13.7-16.5-18.7-25.6-2.1s-13.5,0-13.5,0-7.5-24.8-15.5,0-11.9-5.3-11.9-5.3,0-15.7-9.1-3-13.5,1.9-9.5-5,6.3-10.2,6.3-10.2Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M294.29,697.1s-8.9-16.2-34.2-21.7a53.3,53.3,0,0,1-12.3-4.2c-9.1-4.5-16.4-5.6-32.2-32.6-10.8-18.7-48.7-36.4-52.1,12.4-3.7,23.7,1.4,32.8-2.7,42-3.6,8.2-5.5,27.5-3.6,48.2a57.62,57.6,0,0,0,2.5,12.1c1.93,6.1,2.5,10.1.93,24.3-1.9,17.4-8.7,38.6-5.7,47.5-4.4,0-28.8-0.3-60.8,72.2,1.9-1,20.8-19.7,20.8-19.7s-18,28.3-6.5,56.9c6.08-11.6,23.8-41.5,28.1-44.1-3.6,8.3-12.4,18.2-8.3,48.1,6.5-13.1,15.3-29.6,22.8-37.4-2.1,5.9-5.6,6.3-6.4,18.6,5.7.65,14.1-0.5,23.2-16.5,7.9-3,47,2.6,35.6-46.4-2-7.8-4.5-15.4-8.3-17.1a199.42,199.4,0,0,1-2.1-44.4c1.78-22.8,4-43.9,1.2-53.3,0-6.7,9.9-31.6,3.4-47.2,4.2,1.6,14.3,22.1,28.7,21.3a11.52,11.5,0,0,1,7.8,2.5c1.88,1.5,1.9,2.7,5.4,7.6,5.3,7.4,43,88.6,78.6,58.9" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M160.53,777.6c-3.7,21.7-8.7,38.6-5.7,47.5" transform="translate(-63.9 148.7)"></path>
  </g></g><g>
  <g>
  <path class="lb-lc-9" d="M258.54,620.2c-2.5-5.3-3.1-10.2-1.3-10.8,3.4-1,16.3-21.5,15.8-40,4.3-16.8-3.1-48,10.5-47.4l34.81-99.3c-15.7-13.8-48,4.3-48,4.3s-28,17.8-34.6,46.2c-1,9.9-0.2,19.5,2.7,35.2-1.5,8.2.22,10.3-6.6,19.4-1.8,2.9-5.4,9.4-3.3,24.2-4.7,8.4-8.9,40.6-18.4,48.1-4.9,3.8-7,18.5-7.1,24.9" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M318.3,422.7c-15.7-13.8-48,4.3-48,4.3s-28,17.8-34.6,46.2c-1,9.9-0.2,19.5,2.7,35.2-1.5,8.2.22,10.3-6.6,19.4-1.8,2.9-5.4,9.4-3.3,24.2-4.7,8.4-8.9,40.6-18.4,48.1-4.9,3.8-7,18.5-7.1,24.9" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M258.54,620.2c-2.5-5.3-3.1-10.2-1.3-10.8,3.4-1,16.3-21.5,15.8-40,0,0,1-23.6,2-34.8,1.7-9.5,3.2-10.2,8.4-12.6" transform="translate(-63.9 148.7)"></path>
  </g>
  </g>
  <g>
  <g>
  <path class="lb-lc-12" d="M290.29,661.3s15.39,17.2,36.4,13.6a17.51,17.5,0,0,0,12.4,12c5.48,1.5,36.7,7.3,36.5,12.4-3,3.3-50.4,42.1-53.9,50s-0.7,56.1.75,65.5c.4,5.2-0.1,17.5-7,31.6S280.39,928,280.4,928,264.5,965.6,239,955.3s-51.5-20.2-61.5-31.2-14.2-22.8-4.4-35.5,15.5-25.9,25-44.3,24.7-42.1,26.1-45.3a75.53,75.5,0,0,1,17.5-25.5c11.76-11.2,42.4-29,45.4-34.6,4.3-8.1,14.7-35.8,12.1-44.3S290.29,661.3,290.3,661.3Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-13" d="M332.49,659.6s32.87,8.8,34,17.9c-0.5,2.8-3.6,13.8-10,12.3s-28-6.9-29.1-11.2S327,656.9,332.5,659.6Z" transform="translate(-63.9 148.7)"></path>
  <line class="lb-lc-6" x1="269.6" y1="809.7" x2="293.9" y2="838.9"></line>
  <line class="lb-lc-6" x1="290.5" y1="816.2" x2="295" y2="827.8"></line>
  <line class="lb-lc-6" x1="264.3" y1="817.2" x2="282.9" y2="836.2"></line>
  <path class="lb-lc-14" d="M364.55,693.4S352,690.8,342.3,710c-1.9,4.1-13.9,8.4-11.3,2.1,3.1-7.5,19.5-22.5,13.9-23.7s-11.9,5.5-16.8,16.8c-2.8,2.2-11.9,2.4-18.2,9.9s-8,10.9-12.1,12.7-6.8,16.5,11.8,15.3c1.34,1.7-4.3,58.6-22.6,107.3,1.9-13.9,3.8-25,3.8-25s-0.5-27.8-13.8-2.5c-5.2,17.1-6.6,14.6-11.6,50,0.1,8-9.5,53.4-69,43.8-4.9-4.2-9.4-7.5-11.7-24.3-0.4-0.6-4.2-12.5-9.7,1.6-3.3,8.1-21.4,16.5,26.1,46.4,23,9.8,39.4,20.5,58,13.4,8.5-6.1,14.2-7.7,33.4-52.5s29-68.4,29-68.4-0.1-3.9.77-36.1c-0.9-20.6-2.5-44.2.72-48.5S369.6,704.8,369.6,704.8s12.74-6.5,3.4-9.8S364.55,693.4,364.6,693.4Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M290.24,661.3s15.39,17.2,36.4,13.5a17.55,17.6,0,0,0,12.4,12c5.48,1.5,36.7,7.3,36.5,12.4-3,3.3-50.4,42-53.9,50s-0.7,56.1.75,65.5c.4,5.2-0.1,17.5-7,31.6S280.34,928,280.3,928s-15.9,37.7-41.4,27.4-51.5-20.2-61.5-31.2-14.2-22.8-4.4-35.5,15.5-25.9,25-44.3,24.7-42.1,26.1-45.3a75.33,75.3,0,0,1,17.5-25.5c11.76-11.2,42.4-29,45.4-34.6,4.3-8.1,14.7-35.8,12.1-44.3S290.24,661.3,290.2,661.3Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M310.64,698.6s3.25-20.1,2.4-24.1" transform="translate(-63.9 148.7)"></path><path class="lb-lc-6" d="M321.2,705s4.38-25.4,4.3-29.3" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M330.56,714.4c.16-1,12.5-16.3,14.9-25" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M301.05,735.2s-17.4,28.7-26.7,34" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M307.07,747S296,772.2,294.6,788" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M246.75,900s4.85,34,2.1,43.7" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-5" d="M213.4,596.1c2.43-2.4-2.8,3.5-3.3,3.9-9.5,7.4-8.5,24.8-2.7,32.3s26.81,28.4,26.5,32.5,19,7.3,23.1,31.1-4.4,18.9,8.3,30.6c-7,8.5-17.9,25.2-4.3,43.5s24.78,35.7,36.4,24.7S341.2,769,323,742.5s-29.4-31.6-29.4-31.6c-2.3-18-9.8-26.9-8.1-45.6-9.8-13-5-26.8-15.8-32.5-9.8-5.2-14.9-19.3-13.2-22.7" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-7" d="M321.48,737.4s12.14,4.5,17.1,9.1-1.3-3.6-9.7,6.5C325.53,745.2,321.5,737.4,321.5,737.4Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-7" d="M325.92,763.5s13.19,14.8,13.7,17.6-10,0.5-20.7-10.8Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-7" d="M312.45,778.6s13.19,14.8,13.7,17.6-10,0.5-20.7-10.8Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-7" d="M298.25,791.6s13.19,14.8,13.7,17.6-10,0.5-20.7-10.8Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M257,913.5s1.69,26.6,3.2,30.4" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M218.31,935s26,13.8,30.4,13.5" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-15" d="M201.6,827.9H209a0,0,0,0,1,0,0V851.5a0,0,0,0,1,0,0H201.6a4.24,4.2,0,0,1-4.2-4.2V832.15A4.24,4.2,0,0,1,201.6,827.9Z" transform="translate(341.8 148.5) rotate(27.2)"></path>
  <rect class="lb-lc-15" x="290" y="869.1" width="12.8" height="23.6" rx="3.3" transform="translate(370.8 110.6) rotate(27.2)"></rect>
  <rect class="lb-lc-16" x="202.8" y="795.2" width="97.4" height="127" rx="31.8" transform="translate(355.8 128.6) rotate(27.2)"></rect>
  <rect class="lb-lc-17" x="206.9" y="800.9" width="89.3" height="115.7" rx="29.1" transform="translate(355.8 128.6) rotate(27.2)"></rect>
  <path class="lb-lc-18" d="M249.59,812.8s6.4,10.6,32.8,12.3c.61.1,5.1-0.6,6.6,3.8.62,2.1,1,5.7.17,6.6-1.9,1.6-4.6,1.4-6.8.83-3.1-0.8-6.1-1.7-9.1-2.8a6.3,6.3,0,0,0-2-0.5,2,2,0,0,0-1.8.82c-1.6,2.5,5.3,4.9,6.8,5.6a39.86,39.9,0,0,0,7.8,3.3,16.5,16.5,0,0,1,3.5,1.2,10.1,10.1,0,0,1,4.6,6.1,8,8,0,0,1-0.6,4.4,16.9,16.9,0,0,1-1.4,2.9,3.2,3.2,0,0,1-1.1,1.2,2.4,2.4,0,0,1-2.2,0,7.7,7.7,0,0,1-1.8-1.4A106.64,106.6,0,0,0,274,848a19,19,0,0,0-4.6-2.6,9.3,9.3,0,0,0-5.3,0,11.1,11.1,0,0,1-6.8-0.9c-2.3-1.1-3.7-3.3-6-4.5-3.3-1.7-7.2-1.3-10.7-2.5a10.93,10.9,0,0,1-7-8.6,20,20,0,0,1,1-7.8,1.2,1.2,0,0,1,0.4-0.8c1-0.6,3.8,4,4.4,4.6,3.5,3.7,8.7,5.1,13.4,6.4a8.68,8.7,0,0,0,2.8.39,4.6,4.6,0,0,0,2.1-0.7,1.2,1.2,0,0,0,0.2-2c-1.6-2-4.5-2.2-6.9-3.1-4.2-1.5-6.4-4.8-5.7-9.2C246.11,812,248,810.9,249.6,812.8Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-19" d="M237.45,840.5a16.17,16.2,0,0,0,3.4,1.5l9.34,2.7c6.66,2,13.4,3.9,19.6,7.1s11.91,7.5,15.5,13.5c.79,1.3,1.5,2.8.65,4.3a3.56,3.6,0,0,1-2.8,1.7c-2.3.24-4.2-1.2-5.5-2.9-0.8-1.1-1.5-2.3-2.2-3.4a27.74,27.7,0,0,0-16.9-11.9,1.4,1.4,0,0,0-1.1.22c-0.8.63-0.3,1.7.32,2.3,4.2,4.9,10.2,7.7,15,11.9a3.67,3.7,0,0,1,1.3,2.5c.16,2.6-2.5,3.4-4.6,3.6a28.75,28.8,0,0,1-6.2-0.2c-5.2-0.7-10.6-3.3-12.5-8.2,1.4.58,2.6,1.5,4,2.2a5.22,5.2,0,0,0,4.7.32,2.2,2.2,0,0,0,0.9-0.9c.61-1.2-0.4-2.4-1.3-3.3-2.2-2.2-4.7-4.6-7.8-4.8a19.26,19.3,0,0,0-5.2.83,20.1,20.1,0,0,1-22.4-11.4c4,2.9,8.3,6,13.2,5.9a11.6,11.6,0,0,0,7.2-2.7.83.8,0,0,0-0.1-1.3,9.4,9.4,0,0,0-2.6-1,23.5,23.5,0,0,1-12.8-9,2.2,2.2,0,0,1,0-2.6c1.34-1.8,4.1.18,5.5,1C235.28,839.1,236.3,839.8,237.4,840.5Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-18" d="M259.39,897.9c.91-1.4,2.4-3.3,2.6-5,0.4-2.6-2.3-5-4.1-6.4a30,30,0,0,0-6.2-3.8,22.6,22.6,0,0,1-3.9-2.3c-0.5-0.4-2-1.3-2.1-2.1-0.3-2,5-1,6-0.7a30.24,30.2,0,0,1,7.6,4,21,21,0,0,0,7.5,3.7c1.63.3,3.6.18,4.5-1.2a3.33,3.3,0,0,0-1-4,9.7,9.7,0,0,0-4.1-1.7,139.7,139.7,0,0,1-20.9-6.7A72.46,72.5,0,0,1,225.9,859q-2.1-1.9-4.1-3.9c-0.3-0.3-0.9-1.1-1.6-1.7-0.4-0.4-0.9-0.7-1.2-0.5a1.11,1.1,0,0,0-0.6.75,7.2,7.2,0,0,0,0.4,5.6c1.51,2.9,4.9,3.8,7.7,5,3.1,1.3,6.4,2.8,8.5,5.5.47.6.86,1.5.29,2a1.53,1.5,0,0,1-1.5.1c-2.7-0.8-5-2.6-7.3-4.2s-4.9-3.1-7.8-3.1c-2.3,0-3.3,2.1-4.5,3.8-1.6,2.3-3.2,4.5-4.6,7-0.8,1.3-1.4,2.7-0.6,4.1a8.44,8.4,0,0,0,1.6,1.9,3.2,3.2,0,0,0,1.5,1,2.5,2.5,0,0,0,1.9-0.7c2.87-2.3,3.1-9.3,7.5-9.1,3.6.17,7.4,2.2,10.3,4.3a4.59,4.6,0,0,1,1.8,2,3.9,3.9,0,0,1-0.3,3,5.3,5.3,0,0,1-2.9,2.8,3.2,3.2,0,0,1-3.7-1.1c-1-1.5-0.5-3.5-1.4-5.1a3.52,3.5,0,0,0-5-1,6.8,6.8,0,0,0-2.2,2.8,14.2,14.2,0,0,0-1.3,4.9,4.2,4.2,0,0,0,0.7,3.1c.92,1.1,2.5,1.1,4,1.2,2.2.1,3.9.4,5.6,1.9a10.78,10.8,0,0,0,3.4,2.6c1.12.4,2.4.31,3.5.69,3.2,1.1,4.1,5.4,7.1,7a2.67,2.7,0,0,0,1.4.36c.55,0,1.1-0.3,1.6-0.3,1.1,0,1.8,1.1,2.4,2.1,1.6,2.6,4.7,1.6,6.9.25A20.36,20.4,0,0,0,259.4,897.9Zm-13.9-2.4a3.37,3.4,0,0,1-0.1-2.1c.29-1.1.95-2.1,1.3-3.2a2.51,2.5,0,0,0-0.3-2.5,2.1,2.1,0,0,0-1.9-0.5,5.8,5.8,0,0,0-3.6,2.8,2.6,2.6,0,0,1-2.3,1.5c-0.9-0.1-1.4-1-1.9-1.6a2.17,2.2,0,0,1-0.3-0.6,1.8,1.8,0,0,1,0-0.8A6.55,6.5,0,0,1,239.8,884a7.88,7.9,0,0,1,5.4-1,7.2,7.2,0,0,1,4.7,3.6,13.8,13.8,0,0,1,2.2,7.8,3.5,3.5,0,0,1-1,2.4A3.78,3.8,0,0,1,245.5,895.5Z" transform="translate(-63.9 148.7)"></path>
  <g class="lb-lc-20">
  <image width="171" height="146" transform="translate(103.1 932.7)" href="/media/lab/lucky-cat-bag.png"></image>
  </g>
  <path class="lb-lc-8" d="M265.23,727.5s-17.7,26-4.3,43.5,19.8,33.2,39.4,19.6S329,762.5,328,760.6c1.23-11.8-15.2-35.4-34.4-48.6-1.7-8.9-11.9-29.8-8.7-43.5a7.7,7.7,0,0,0-0.7-5.1c-3.3-6.7-11.8-20.6-11.6,3l1.74,8s-10.5-27.4-13.2-19.6,4.6,20.8,4.6,20.8-25.2-38.4-23-19.5-2,12.4,4.1,20.7,8,9.2,9.4,16.6a189.71,189.7,0,0,1,1.9,19.6S254,719,265.2,727.5Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-6" d="M256.17,612.4C257,622,264,630,273,634c5,8,6,17,9,26,0,1,2,2,2,3,2,17,6,32,10,48,13,7,22,19,30,32,1,2,2,5,3,7a19.5,19.5,0,0,1,0,15c-8,14-20,22-33,31-2,1-5,2-7,1-15-8-25-23-32-38-4-12,3-24,10-33-1-4-7-4-7-8,1-19-3-43-23-51-6-14-19-23-27.9-35.4" transform="translate(-63.9 148.7)"></path>
  </g>
  </g>
  <g>
  <path class="lb-lc-21" d="M493.35,109.2s-9.2,9-10.2,17.5c16-10.4,53.9-26.1,108.3-26,10.6-3,27.1-4.8,37-13.1-3.7,9.8-29,36.4-38,49.1s-25.9,29.5-45.4,37.8c3.63,1.4,11.7,3.8,19.8-0.5-11.1,10-32.8,27.9-32.5,39.8,2.5,1.3,4.9,4.1,15.8,4.8-3.4,3.1-9.6,12-21.5,17.9S445.84,231,445.8,231l-16.1-63.7S445.72,124.9,493.4,109.2Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-22" d="M521.23,148.7s13.68,5-3.4,18.1c.48,1.3-2.3,1.9,3.7.86s18.91-5.5-0.2,15.2c-6.5,4.7-12.2,8.7-9.8,15.4,1.4.65,10.5,4.3.37,9.5a131.37,131.4,0,0,1-18.7,7.8L497.79,182l-0.3-14.4Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-22" d="M528.48,139.2a50.17,50.2,0,0,1-24.9,16,24.4,24.4,0,0,0-9.3,4.8c-5.6,4.8-12.2,10-14,21.6a9.08,9.1,0,0,1-2.2,4.7c-4.6,5.1-5.4,7.2-11.6,10.4,3.2,2,17,4.4,28.9.43-5.1,7.2-9.3,17.1-7.7,18.4s6.07-0.1,13.2-2.9" transform="translate(-63.9 148.7)"></path>
  <path d="M528.48,139.2a44.64,44.6,0,0,1-7.8,7.8,48.4,48.4,0,0,1-14.5,8l-2.6.86a24.64,24.6,0,0,0-7.2,3.5c-1.4,1-2.8,2.3-4.1,3.5a35.8,35.8,0,0,0-7.1,8,27.4,27.4,0,0,0-3.7,9.9,19.2,19.2,0,0,1-0.6,2.8,10,10,0,0,1-1.4,2.7l-3.6,4.2a28.19,28.2,0,0,1-4,4,28.8,28.8,0,0,1-4.8,3L467,196a12.73,12.7,0,0,0,3.2,1.2,31.6,31.6,0,0,0,3.5.72,49.6,49.6,0,0,0,7.2.58,47.4,47.4,0,0,0,14.3-1.9l2.08-0.6-1.3,1.7a63.55,63.5,0,0,0-4.5,7.2,42.9,42.9,0,0,0-3.4,7.8,7.6,7.6,0,0,0-0.3,2,1.2,1.2,0,0,0,0.2.75,1.6,1.6,0,0,0,0.8.39,9.5,9.5,0,0,0,4.1-0.4c2.76-0.7,5.5-1.7,8.2-2.6a77.12,77.1,0,0,1-8,3.1,10,10,0,0,1-4.4.57,2.4,2.4,0,0,1-1.1-0.5,1.8,1.8,0,0,1-0.5-1.2,8.3,8.3,0,0,1,0.3-2.2,39.9,39.9,0,0,1,3.2-8.1,64.5,64.5,0,0,1,4.4-7.5l.82,1.1a45,45,0,0,1-7.3,1.8,47.8,47.8,0,0,1-7.5.53,51.9,51.9,0,0,1-7.5-0.5,34.2,34.2,0,0,1-3.7-0.7,13.8,13.8,0,0,1-3.7-1.4l-1.4-0.8L466,196a26.28,26.3,0,0,0,4.5-2.8,27.4,27.4,0,0,0,3.7-3.8l1.79-2.1c.58-0.7,1.3-1.4,1.8-2a8.24,8.2,0,0,0,1.1-2.1,17.4,17.4,0,0,0,0.6-2.5A29.09,29.1,0,0,1,483.6,170a37.21,37.2,0,0,1,7.5-8.3c.7-0.6,1.4-1.2,2.1-1.8a25.89,25.9,0,0,1,2.2-1.7,25,25,0,0,1,5-2.6,25.6,25.6,0,0,1,2.7-0.9l2.61-0.8a48.89,48.9,0,0,0,5.1-1.9A51.42,51.4,0,0,0,528.5,139.2Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-21" d="M253.85,135.9s9.45,7.1,11.4,14.7c-15.8-7.5-52.2-17.1-101.5-10.4-10-1.4-25.2-1.1-35.2-7.3,4.5,8.4,30.7,29.5,40.5,40s27.1,23.6,45.9,28.8c-3.1,1.7-10.1,4.9-18,2,11.3,7.8,33.2,21.3,34.4,32.2-2.1,1.5-4,4.3-13.8,6.3,3.5,2.4,10.2,9.7,21.7,13.6s72.69-14.9,72.7-14.9L318.72,181S299,144.4,253.8,135.9Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-22" d="M209.42,161.6s-10.6,7.7,7.4,14.8c-0.1,1.2,2.4,1.1-3,1.7s-17.7,0,3.9,13.1c6.75,2.4,12.7,4.5,12.3,10.8-1,0.9-8,6.4,2,8.3a118.88,118.9,0,0,0,18.1,2.1L238,184.6,234.7,172Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-22" d="M200.81,155.2a45.09,45.1,0,0,0,25.5,7.7,21.8,21.8,0,0,1,9.2,1.8c6.05,2.7,13,5.6,17.4,15.2a8.17,8.2,0,0,0,3.1,3.5c5.22,3.2,6.5,4.9,12.6,6.1-2.3,2.5-13.6,8-24.9,7.5,6.2,5,12.3,12.4,11.2,14s-5.3,1.4-12.2.77" transform="translate(-63.9 148.7)"></path>
  <path d="M200.81,155.2a46.08,46.1,0,0,0,18.4,6.6,44,44,0,0,0,4.9.39h2.45a24.15,24.1,0,0,1,2.5.09,22.2,22.2,0,0,1,5,1,23.8,23.8,0,0,1,2.4.93c.76.3,1.5.65,2.3,1a33.37,33.4,0,0,1,8.6,5.3,25.9,25.9,0,0,1,6.2,8.1,15.2,15.2,0,0,0,1.1,2,6.9,6.9,0,0,0,1.5,1.6c.53.4,1.4.86,2,1.3l2.07,1.4a24.18,24.2,0,0,0,4.1,2.4,24.5,24.5,0,0,0,4.6,1.3l1.72.3-1.2,1.2a12.66,12.7,0,0,1-2.9,2.1,31.1,31.1,0,0,1-3,1.6,45,45,0,0,1-6.3,2.3,43.6,43.6,0,0,1-6.6,1.4,41.2,41.2,0,0,1-6.8.27l.49-1.3A55.46,55.5,0,0,1,250,201.9a35.76,35.8,0,0,1,4.7,6.2,7.2,7.2,0,0,1,0.8,1.9,1.6,1.6,0,0,1-0.1,1.2,2.1,2.1,0,0,1-0.9.76,8.9,8.9,0,0,1-3.9.59,73.6,73.6,0,0,1-7.7-0.7c2.58.1,5.2.31,7.7.23a8.46,8.5,0,0,0,3.6-0.7,1.6,1.6,0,0,0,0.6-0.5,1.1,1.1,0,0,0,0-0.7,6.7,6.7,0,0,0-0.8-1.6,38,38,0,0,0-4.8-5.9,60.8,60.8,0,0,0-5.7-5.1l-1.7-1.4,2.2,0a41.8,41.8,0,0,0,12.8-1.9,46.6,46.6,0,0,0,6.1-2.3c1-0.5,1.9-0.9,2.8-1.5A11.08,11.1,0,0,0,268,188.9l.54,1.6a26.34,26.3,0,0,1-4.9-1.4,25.1,25.1,0,0,1-4.5-2.5l-4.2-2.8a9.06,9.1,0,0,1-1.9-2,16.7,16.7,0,0,1-1.2-2.3,24.9,24.9,0,0,0-5.6-7.6,31.4,31.4,0,0,0-8.1-5.2c-1.5-0.7-3-1.5-4.4-2a21.52,21.5,0,0,0-4.7-1.1,23.8,23.8,0,0,0-2.4-0.1l-2.5-0.1a43.92,43.9,0,0,1-5-0.6,45.3,45.3,0,0,1-9.6-2.8A39.63,39.6,0,0,1,200.8,155.2Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-5" d="M282.45,234.5s-3.1-35.3,14.7-40c3.88-3.9,17.9-11.9,10.5-27.4s-14-34.5-8.1-43c5.18,8.3,14.8,18.3,21.8,17.4-1.9-5.9-9.7-69.4,8.9-85.2,4.7,5.3,1.4,24.7,8,21.3,7.8-10.5,23-25.1,33.4-75.7,6.8-30.1,13.9-46.6,19-54.5.56,10.3,3.5,34.7,18.7,27.4C421.18-39,425-46.1,427.5-66.4s1.15-47.7,34.8-79.1c1.92,22,3.7,35.7-5.7,58.5-1.5,8.1,10.4-2.7,15.8-9.5,1,7.4,14.2,21.2-51.4,132.2a74.74,74.7,0,0,0-9.4,24.6,58.5,58.5,0,0,0,0.2,23c6.29-2.3,22.6-9.3,33.1-24-1.5,12.8,8,39-11.3,67,7.1-0.9,13.9-8.6,16.5-11.2s2.25,8.4-8.7,28.9c-4,11.2-10.8,23.5-3.7,35.4,7.9,2.8,27.3,10.8,22.4,37.9s-34.8,107.2-34.8,107.2l-141,4Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-23" d="M348.36,311.6s-6.4-18.3-53-6.7L261.3,286.3s3.66,20.3-16.4,29c-4.2-0.3-22-0.8-25.6-5.3-3-3.8-1.9,14.3.64,23.8a13.1,13.1,0,0,1-0.7,8.7c-2.4,5.3-7.4,11.8-24.7,7,1.9,4.7,5,19.1,14.6,31.4a10.81,10.8,0,0,1,1.3,11.6c-1.4,2.6-3.8,5.1-11.3,9.2a1.43,1.4,0,0,0-0.2,2.4c10.44,8.1,37.6,27.1,48.9,34.6,8,14.2,13.9,44.9,62.1,27.8a12.4,12.4,0,0,1,6-0.6c11.31,1.8,24.7,4.4,30.1,11.1a13.6,13.6,0,0,0,4.2,3.6c10.69,5.7,31.5,16.2,61.2-17.6a11,11,0,0,1,7.6-3.8c8.31-0.6,19.1-0.3,19.1-0.3s29.58,9.7,47.3-32.8a17.78,17.8,0,0,1,5.3-7,36.4,36.4,0,0,1,12.8-6.9c8.4-2.2,38.6-11.1,43.3-24-5.1-4.7-13-6.2-13.5-11.3s21.09-10.3,21.6-28.1c-4.4-1.2-21.8,1.6-26.2-12.1C530.84,332,537,324,536,309c-6.1.74-35.2,1-49.3-19.1S407,300.1,407,300.1s-36.4,12.2-42.2,9.7S348.36,311.6,348.4,311.6Z" transform="translate(-63.9 148.7)" data-cubic="M348.36,311.6 C348.36,311.6 341.96,293.3 295.36,304.9 C295.36,304.9 261.3,286.3 261.3,286.3 C261.3,286.3 264.96,306.6 244.9,315.3 C240.7,315 222.9,314.5 219.3,310 C216.3,306.2 217.4,324.3 219.94,333.8 C220.71,336.69 220.46,339.77 219.24,342.5 C216.84,347.8 211.84,354.3 194.54,349.5 C196.44,354.2 199.54,368.6 209.14,380.9 C211.81,384.18 212.32,388.71 210.44,392.5 C209.04,395.1 206.64,397.6 199.14,401.7 C198.69,401.92 198.38,402.35 198.34,402.84 C198.3,403.34 198.53,403.81 198.94,404.1 C209.38,412.2 236.54,431.2 247.84,438.7 C255.84,452.9 261.74,483.6 309.94,466.5 C311.86,465.81 313.92,465.6 315.94,465.9 C327.25,467.7 340.64,470.3 346.04,477 C347.18,478.48 348.61,479.7 350.24,480.6 C360.93,486.3 381.74,496.8 411.44,463 C413.36,460.77 416.1,459.4 419.04,459.2 C427.35,458.6 438.14,458.9 438.14,458.9 C438.14,458.9 467.72,468.6 485.44,426.1 C486.59,423.36 488.42,420.95 490.74,419.1 C494.5,415.96 498.85,413.62 503.54,412.2 C511.94,410 542.14,401.1 546.84,388.2 C541.74,383.5 533.84,382 533.34,376.9 C532.84,371.8 554.43,366.6 554.94,348.8 C550.54,347.6 533.14,350.4 528.74,336.7 C530.84,332 537,324 536,309 C529.9,309.74 500.8,310 486.7,289.9 C472.6,269.8 407,300.1 407,300.1 C407,300.1 370.6,312.3 364.8,309.8 C359,307.3 348.36,311.6 348.4,311.6 Z"></path>
  <path class="lb-lc-4" d="M354.42,355.4s-9.2-23.1,3.2-37.5" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-24" d="M349.69,173.2s-2.7,46.1,16,60.9c5.21,1.1,11.5,1.2,20.6-23.3,5.3-12.3,10.9-20.4,8.6-26.5S378,200.6,378,200.6s9.8-24.4,4-35.9-17.9,27.2-17.9,27.2S356.46,165.4,349.7,173.2Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-25" d="M337.85,313.8c6.23,5.7,20.7,14.8,38.5-0.3a5.36,5.4,0,0,0,1.4-6.3c-5-10.7-22.9-26.5-40.7-0.7A5.62,5.6,0,0,0,337.9,313.8Z" transform="translate(-63.9 148.7)"></path>
  
<g class="lb-lc-whiskers lb-lc-right">
<path class="lb-lc-6" d="M493.65,343.8l29.57-13.4,18.7-8.7a22.06,22.1,0,0,0,2.5-1.4l6.29-4a6,6,0,0,1,6.5,0l8.63,5.4a11,11,0,0,0,9.4,1.1c5.18-1.8,12.8-6.2,18.5-16.8" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-6" d="M492.58,369.1s36.51-4.6,66.8-11.6a13.65,13.7,0,0,1,6.1,0c4.55,1,9.3,2.6,11.3,21.8a2.17,2.2,0,0,0,2.9,1.8c7.9-2.9,26.3-6.5,28.7-3.8" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-6" d="M484.56,385.8s-5.7,9.2,8.8,14.7a35.18,35.2,0,0,0,14.9,2.1c6.64-0.5,13.2,0,12.5,12.3.31,6.1-3.9,14.1,11.1,7.4a18.5,18.5,0,0,1,18,1.4c3.94,2.7,8,7.3,11.3,15.2" transform="translate(-63.9 148.7)"></path></g>
  
<g class="lb-lc-whiskers lb-lc-left">
<path class="lb-lc-6" d="M239.8,331.3S225.64,303,209.6,311s-14.6,10.3-21.3.22c-4.9-7.3-7.3-17.1-8.2-21.9a4.41,4.4,0,0,0-5.7-3.4,20.7,20.7,0,0,0-4.8,2.5c-7.8,5.2-25.8,14-31.3,4.8" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-6" d="M229.84,359s-29.9,3.5-48,11.3a34.27,34.3,0,0,1-7.7,2.4c-3,0.5-6.1.25-8.7-11.2a53.54,53.5,0,0,1-1.2-11.7c0-7.9-3.2-18.9-29.1-4.8-10.9,5.7-19.2,12.2-24.4,18.1a2.35,2.4,0,0,1-4-1c-0.5-2.3-0.9-4.4-1.3-6.1a7.85,7.8,0,0,0-8.2-6.5,12,12,0,0,0-5.8,1.9,58.3,58.3,0,0,1-7.6,4.3c-7.1,3.2-16.8,8-19.1,6.4" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-6" d="M230.74,376s-26.5,25.8-39.7,24.9-22.2.92-32.2,16c-3.5,3.3-16.9,16.5-27,13.4" transform="translate(-63.9 148.7)"></path></g>
  
<g class="lb-lc-mouth" clip-path="url(#lb-lc-lip)">
<g class="lb-lc-jaw">
<path class="lb-lc-26" d="M274.83,344.5s-24,2.9-8,23.7a5.37,5.4,0,0,0,0.5.57c16,15.4,48.2,32,48.2,32S348.76,422.6,444.1,379c9.69-6.2,40.3-29.7-3.1-33-11.9-0.7-43.7,1.5-69.2,8.8a37.23,37.2,0,0,1-11.3,1.5,63.2,63.2,0,0,1-18.1-3.3C332.85,350.3,285.5,343,274.8,344.5Z" transform="translate(-63.9 148.7)"></path>
<path class="lb-lc-29" d="M349.15,406.1s-0.6-17.2,23.5-20.9c7.43-0.3,23.1-2.3,32.1,9.5C401.35,395.8,371.2,405.2,349.1,406.1Z" transform="translate(-63.9 148.7)"></path></g></g>
<path class="lb-lc-lips" d="M199,498.7C200.3,497.9 204.3,494.9 207,494C209.7,493.1 212.3,493.1 215,493C217.7,492.9 220.3,493.1 223,493.3C225.7,493.5 228.3,493.8 231,494.1C233.7,494.4 236.3,494.7 239,495C241.7,495.3 244.3,495.7 247,496.1C249.7,496.5 252.3,496.8 255,497.2C257.7,497.6 260.3,498 263,498.5C265.7,499 268.3,499.5 271,500C273.7,500.5 276.3,501.1 279,501.7C281.7,502.3 284.3,503.3 287,503.8C289.7,504.3 292.3,504.8 295,504.9C297.7,505 300.3,504.9 303,504.5C305.7,504.1 308.3,503.1 311,502.5C313.7,501.9 316.3,501.2 319,500.6C321.7,500 324.3,499.5 327,499C329.7,498.5 332.3,498.1 335,497.7C337.7,497.3 340.3,496.9 343,496.6C345.7,496.3 348.3,495.9 351,495.7C353.7,495.4 356.3,495.3 359,495.1C361.7,494.9 364.3,494.8 367,494.7C369.7,494.6 372.3,494.5 375,494.6C377.7,494.7 380.3,494.9 383,495.3C385.7,495.7 388.7,496.3 391,497C393.3,497.7 396,499.1 397,499.5"></path>
  
<g class="lb-lc-chin">
<path class="lb-lc-4" d="M315.07,415.1s15,18.1,79.8-1.5" transform="translate(-63.9 148.7)"></path>
<g class="lb-lc-tuft">
<path class="lb-lc-27" d="M340.16,422.7s-1.9,20.7,2.6,26.6a2.56,2.6,0,0,0,4.1-0.1c1.17-1.6,2-4.5,2.6-10.9.08-1.3-0.1-2.6,1.2-0.2a26.67,26.7,0,0,1,2.2,5.3c.38,1.2.67,2.2.89,3a10.71,10.7,0,0,0,3.5,5.5c2.79,2.3,7,3.8,9.9-4.6.54-2.5,3-8.3,8.1-0.6,1.5,2.4,8.6,8.4,9.5-6A229.43,229.4,0,0,0,383.1,417S360.43,423.5,340.2,422.7Z" transform="translate(-63.9 148.7)"></path></g></g>
  
  <path class="lb-lc-28" d="M327.5,350.8s-0.1,20,4.8,31.2a1.15,1.1,0,0,0,2.1,0l10.87-26.9Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-28" d="M292.23,345.6s.78,12.7,3.5,17.2a2.54,2.5,0,0,0,3.6.74c3.2-2.2,7-6.4,9.7-15.8C307.34,347.5,292.2,345.6,292.2,345.6Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-28" d="M390.19,351.6s4.8,17.8,18.1,27.3c.67-0.1,3.5-12.6-0.1-30.1C405.86,349.1,392.9,350.1,390.2,351.6Z" transform="translate(-63.9 148.7)"></path>
  <path class="lb-lc-28" d="M410.85,348.5s6,27.9,10.6,23.8,10.9-24,10.9-25.3C431.89,346.7,416.5,347.9,410.9,348.5Z" transform="translate(-63.9 148.7)"></path>
  
  <circle class="lb-lc-30" cx="242.3" cy="469.3" r="2.8"></circle>
  <circle class="lb-lc-30" cx="235.3" cy="484" r="1.4"></circle>
  <circle class="lb-lc-30" cx="222.7" cy="473.3" r="2.8"></circle>
  <circle cx="337.8" cy="468.9" r="1.7"></circle>
  <circle class="lb-lc-30" cx="336.3" cy="483.5" r="2.5"></circle>
  <circle class="lb-lc-30" cx="359.4" cy="473.3" r="2.8"></circle>
  <path class="lb-lc-31" d="M347.3,307.4s2.9,12.7,6.8,14.3c.65-4.2,6.6-13.9,8.1-14.4" transform="translate(-63.9 148.7)"></path>
  </g>
  <g class="lb-lc-eye">
  <path class="lb-lc-32" d="M298.37,210.2a39.52,39.5,0,0,0-18.5,7.2c-13.2,9.5-37,30.1-31.9,51.4,2.1,8.6,4.5,28,28.4,36.5a56.76,56.8,0,0,0,52.7-8.2,58.1,58.1,0,0,0,23.4-38.3,39.5,39.5,0,0,0-0.5-15.9C348.79,229.2,337.6,205.5,298.4,210.2Z" transform="translate(-63.9 148.7)">
  </path>
  </g>
  <g class="lb-lc-pupil">
  <path class="lb-lc-30" d="M281.69,266.7s-1.8-13.9,3.6-2.5c3.85-1.6,13.8-7.9,7.6.2,1.4,1.6,8.9,2.9-0.8,4.9.48,2.2,6,10-3.4,4.9-1.9-0.4-4,9.6-5.7-0.9C282.63,271.2,272.3,270.4,281.7,266.7Z" transform="translate(-63.9 148.7)">
  </path>
  </g>
  <g class="lb-lc-lid">
  <path class="lb-lc-34" d="M298.37,210.2a39.52,39.5,0,0,0-18.5,7.2c-13.2,9.5-37,30.1-31.9,51.4,2.1,8.6,4.5,28,28.4,36.5a56.76,56.8,0,0,0,52.7-8.2,58.1,58.1,0,0,0,23.4-38.3,39.5,39.5,0,0,0-0.5-15.9C348.79,229.2,337.6,205.5,298.4,210.2Z" transform="translate(-63.9 148.7)">
  </path>
  </g>
  <g class="lb-lc-eye">
  <path class="lb-lc-32" d="M434.11,207.7A39.52,39.5,0,0,0,415.6,215c-13.2,9.5-37,30.1-31.9,51.4,2.1,8.6,4.5,28,28.4,36.5a56.76,56.8,0,0,0,52.7-8.2,58.1,58.1,0,0,0,23.4-38.3,39.6,39.6,0,0,0-0.5-15.9C484.53,226.8,473.4,203.1,434.1,207.7Z" transform="translate(-63.9 148.7)">
  </path>
  </g>
  <g class="lb-lc-pupil">
  <path class="lb-lc-30" d="M450.29,260.7s8.59-12.7-4.6-4.8c-1.1-1.4-5-7.8-5.3-0.3-1,2.9-15.7,1.2-1.4,7.4.61,1.7-5.8,5.9,2.3,4.7.91,1.9,2.2,6.8,5.9.87C450.32,265.9,457.8,268.9,450.3,260.7Z" transform="translate(-63.9 148.7)">
  </path>
  </g>
  <g class="lb-lc-lid">
  <path class="lb-lc-34" d="M434.11,207.7A39.52,39.5,0,0,0,415.6,215c-13.2,9.5-37,30.1-31.9,51.4,2.1,8.6,4.5,28,28.4,36.5a56.76,56.8,0,0,0,52.7-8.2,58.1,58.1,0,0,0,23.4-38.3,39.6,39.6,0,0,0-0.5-15.9C484.53,226.8,473.4,203.1,434.1,207.7Z" transform="translate(-63.9 148.7)">
  </path>
  </g>
  </svg>
</button>`,
    title: { en: 'Lucky cat', fr: 'Chat porte-bonheur' },
    note: { en: "My own vector drawing. Its paw, built in 3D, beckons like a real lucky cat's, and now and then it swallows. A pet makes it beckon faster.", fr: 'Mon propre dessin. Sa patte en 3D fait signe comme un vrai chat porte-bonheur, et parfois il avale sa salive. Une caresse le fait saluer plus vite.' },
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
    note: { en: 'Two waves drift at their own pace, bubbles burst at the surface, and the tube tilts towards the pointer: the water stays level and sloshes.', fr: "Deux vagues dérivent, les bulles éclatent à la surface, et le tube penche vers le curseur : l'eau reste à niveau et clapote." },
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
    note: { en: 'A real globe: the coastlines are projected on a sphere. Drag it to spin it; the figures count up as they come into view.', fr: 'Un vrai globe : les côtes sont projetées sur une sphère. On le fait tourner à la main, et les chiffres comptent en apparaissant.' },
  },
  {
    id: 'arch-rings',
    cat: 'archive',
    tech: ['CSS', 'JS'],
    html: `<nav class="lb-rings" aria-label="Games">
  <button type="button" aria-expanded="false" aria-controls="lb-rings-list"><span>Games</span></button>
  <ul id="lb-rings-list">
    <li style="--i:0"><a href="#"><span>Eons</span></a></li>
    <li style="--i:1"><a href="#"><span>Towerz</span></a></li>
    <li style="--i:2"><a href="#"><span>All games</span></a></li>
  </ul>
</nav>`,
    title: { en: 'Corner rings', fr: 'Anneaux en coin' },
    note: { en: 'A games menu: rings swing out of the corner with a little bounce. A real disclosure button; Escape closes it.', fr: "Un menu de jeux : les anneaux sortent du coin en pivotant, avec un léger rebond. Un vrai bouton d'ouverture ; Échap referme." },
  },
  {
    id: 'arch-signal',
    cat: 'archive',
    tech: ['CSS', 'SVG'],
    html: `<div class="lb-signal" role="status" aria-label="Connecting">
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="12" cy="36" r="5"/>
    <path d="M12 22a14 14 0 0 1 14 14"/>
    <path d="M12 10a26 26 0 0 1 26 26"/>
  </svg>
</div>`,
    title: { en: 'Signal', fr: 'Signal' },
    note: { en: 'The dot, then each arc, lights up in turn, like a signal coming in.', fr: "Le point, puis chaque arc, s'allument tour à tour, comme un signal qui arrive." },
  },
  {
    id: 'arch-logo',
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
    note: { en: 'A loader with my monogram: the four solid wedges of MK light up in turn and fade in the same order.', fr: "Un chargement à mon monogramme : les quatre coins pleins de MK s'allument tour à tour et s'éteignent dans le même ordre." },
  },
  {
    id: 'arch-mask',
    cat: 'archive',
    tech: ['CSS', 'SVG'],
    html: `<div class="lb-wipe" role="img" aria-label="A page transition: waves of colour sweep across and reveal the next page">
  <div class="lb-wipe-page"><b>Home</b><span></span><span></span></div>
  <div class="lb-wipe-page lb-wipe-next"><b>About</b><span></span><span></span></div>
  <svg class="lb-wipe-wave" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0h180v100H20C0 80 34 62 16 46S8 12 20 0z"/></svg>
  <svg class="lb-wipe-wave" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0h180v100H20C0 80 34 62 16 46S8 12 20 0z"/></svg>
</div>`,
    title: { en: 'Wave transition', fr: 'Transition en vagues' },
    note: { en: 'Two waves of colour sweep across a page and reveal the next one, in one short timeline with a long rest between passes.', fr: 'Deux vagues de couleur balaient une page et révèlent la suivante, en une timeline courte avec une longue pause entre deux passages.' },
  },
]

// Shown category by category, in the order of CATEGORIES
export const DEMOS = CATEGORIES.flatMap((cat) => LIST.filter((demo) => demo.cat === cat))
if (DEMOS.length !== LIST.length) throw new Error('lab: a demo has an unknown category')
