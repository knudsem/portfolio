const translations = {
  en: {
    page_title: 'Mathias | Fullstack & Shopify Developer, UI/UX Designer',
    title: 'Fullstack & Shopify Developer, UI/UX Designer',
    tagline: 'I build interfaces that move. From pixel to production.',
    nav: ['About', 'Services', 'Work', 'Contact'],
    nav_label: 'Main navigation',
    back_to_top: 'Back to top',
    lang_label: 'Language',
    new_tab: '(opens in a new tab)',
    available: 'Open to freelance projects',

    about_1: "I'm a fullstack developer and UI/UX designer based in Toulouse, France, trilingual in French, English, and Danish. I hold a bachelor's in web design and completed the Le Wagon intensive bootcamp in 2019, where I added Ruby, Rails, and a deeper command of JavaScript to a design education that started in 2015. I work independently on projects I genuinely care about, ranging from complex B2B portals to bespoke ecommerce builds.",
    about_2: "I work at the intersection of design and code. I design in Figma and build in React, TypeScript, Django, and Shopify. My particular focus is <em>motion</em>. The way an interface moves says as much as how it looks, and I carry that obsession into everything, whether it's a Shopify campaign, a B2B ordering system, or a letter animation library I built from scratch because the idea wouldn't leave me alone.",

    skills: ['React', 'TypeScript', 'Figma', 'Django', 'Shopify', 'JavaScript', 'SCSS', 'HTML & CSS', 'SVG Animation', 'HTMX', 'PostgreSQL', 'Ruby on Rails'],

    services: [
      {
        title: 'UI / UX Design',
        desc: 'Interfaces designed in Figma, from wireframes to detailed, clickable prototypes. Every decision is intentional, from the grid to the microinteraction, and documented so the build phase runs smoothly.',
      },
      {
        title: 'Frontend Development',
        desc: 'Precise, responsive code in React, TypeScript, and SCSS. Builds that match the design exactly, load fast, and work on every device and screen size.',
      },
      {
        title: 'Ecommerce & Shopify',
        desc: 'Custom Shopify themes and B2B portals built to convert, from product pages and promotional campaigns to complex dealer ordering systems. Bespoke Liquid, checkout customisation, and app integration.',
      },
      {
        title: 'Fullstack Development',
        desc: 'Complete web applications built end to end with Django, PostgreSQL, and React. From database architecture and REST APIs to the interface, one person across the whole stack.',
      },
      {
        title: 'Motion & Animation',
        desc: 'Custom JavaScript and SVG animations that give your interface a personality. From smooth page transitions to complex animated sequences, built from scratch and tuned to feel natural.',
      },
      {
        title: 'Brand & Visual Identity',
        desc: 'Logos, brand systems, and visual identities crafted from scratch. A coherent look that carries across your product, your site, and your marketing.',
      },
    ],

    projects: [
      {
        year: '2026',
        title: 'AccessEU, Accessibility Compliance App',
        desc: 'A commercial Shopify app that audits storefronts against WCAG 2.1 AA and the European Accessibility Act. Built with React Router v7, TypeScript, Prisma, and a Playwright plus axe-core scanning engine running 100 rules across desktop and mobile viewports.',
        tags: ['React Router', 'TypeScript', 'Prisma', 'Playwright', 'PostgreSQL'],
        link: null,
      },
      {
        year: 'Since 2024',
        title: 'Dealer Portal, Interdyn',
        desc: 'A fullstack B2B ecommerce platform for an Australian audio equipment distributor. Custom product catalog, complex checkout flow, product option management, and a full admin order system built with Django, React, HTMX, and PostgreSQL.',
        tags: ['Django', 'React', 'HTMX', 'Tailwind', 'PostgreSQL'],
        link: null,
      },
      {
        year: 'Since 2024',
        title: 'Pro-Ject Audio Australia',
        desc: 'Custom Shopify theme for the official Australian distributor of Pro-Ject turntables and audio components. Product pages, landing pages, seasonal campaigns, and a full Black Friday promotional experience, coded by hand from a bespoke Figma design.',
        tags: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
        link: 'https://www.projectaudio.com.au/',
      },
      {
        year: '2024',
        title: 'Pro-Ject Audio, Global',
        desc: 'Frontend development for the official worldwide brand site of Pro-Ject Audio Systems, a European turntable and audio manufacturer distributed in over 80 countries. Custom theme work, editorial layouts, and multilingual support across the full product catalog.',
        tags: ['WordPress', 'CSS', 'JavaScript', 'WooCommerce'],
        link: 'https://www.project-audio.com/en/',
      },
      {
        year: '2023',
        title: 'Exclusive Construction',
        desc: 'Website design and development for a Melbourne luxury home builder. A site built around photography to communicate craftsmanship and trust, with lead capture, a project gallery, and service pages optimised for local search.',
        tags: ['WordPress', 'Elementor', 'CSS', 'JavaScript'],
        link: 'https://exclusiveconstruction.com.au/',
      },
      {
        year: '2023',
        title: 'Trimension Studio',
        desc: 'Brand website for an immersive VR gaming studio. A dark, cinematic experience on a single page, with smooth scroll animations and custom motion, built to reflect the visual intensity of their game titles Eons and Godsent.',
        tags: ['JavaScript', 'HTML', 'CSS', 'SVG'],
        link: null,
      },
    ],

    contact_p: "Have a project in mind? I am open to freelance work, whether it is a new product, a Shopify build, a design system, or something that needs to move. Based in Toulouse, I work with clients across France, Europe, and beyond.",
    contact_location: 'Toulouse, France',
    contact_availability: 'Open to new projects',
    contact_response: 'Usually replies within 24h',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending...',
      success_title: 'Message sent.',
      success_body: 'Thanks for reaching out. I will get back to you shortly.',
      error: 'Something went wrong. Please try again, or email me directly:',
      name_placeholder: 'Your name',
      email_placeholder: 'your@email.com',
      message_placeholder: 'Tell me about your project...',
      name_required: 'Please enter your name.',
      email_required: 'Please enter your email address.',
      email_invalid: "This email address doesn't look right. Example: name@company.com",
      message_required: 'Please write a short message.',
      suggest_before: 'Did you mean',
      suggest_after: '?',
      honeypot: 'Leave this field empty',
    },
  },

  fr: {
    page_title: 'Mathias | Développeur Fullstack & Shopify, Designer UI/UX',
    title: 'Développeur Fullstack & Shopify, Designer UI/UX',
    tagline: 'Je crée des interfaces qui bougent. Du pixel à la production.',
    nav: ['À propos', 'Services', 'Projets', 'Contact'],
    nav_label: 'Navigation principale',
    back_to_top: 'Retour en haut',
    lang_label: 'Langue',
    new_tab: "(s'ouvre dans un nouvel onglet)",
    available: 'Disponible pour des missions freelance',

    about_1: "Je suis développeur fullstack et designer UI/UX basé à Toulouse, trilingue en français, anglais et danois. Titulaire d'un bachelor en web design et diplômé du bootcamp intensif Le Wagon en 2019, j'ai ajouté Ruby, Rails et une maîtrise approfondie de JavaScript à une formation en design commencée en 2015. Je travaille en indépendant sur des projets qui m'intéressent vraiment, du portail B2B complexe à la boutique en ligne sur mesure.",
    about_2: "Je travaille à la croisée du design et du code. Je conçois dans Figma et je développe en React, TypeScript, Django et Shopify. Ma spécialité, c'est le <em>mouvement</em>. La façon dont une interface s'anime est aussi révélatrice que son apparence, et j'apporte cette obsession à chaque projet, qu'il s'agisse d'une campagne Shopify, d'une plateforme B2B, ou d'une bibliothèque d'animation que j'ai construite de zéro parce que l'idée ne me lâchait pas.",

    skills: ['React', 'TypeScript', 'Figma', 'Django', 'Shopify', 'JavaScript', 'SCSS', 'HTML & CSS', 'SVG Animation', 'HTMX', 'PostgreSQL', 'Ruby on Rails'],

    services: [
      {
        title: 'UI / UX Design',
        desc: "Des interfaces conçues dans Figma, du wireframe au prototype haute fidélité. Chaque décision est intentionnelle, de la grille aux moindres détails d'interaction, avec une documentation claire pour que le développement suive sans accroc.",
      },
      {
        title: 'Développement Frontend',
        desc: 'Du code précis et responsive en React, TypeScript et SCSS. Des réalisations qui correspondent exactement au design, qui chargent vite, et qui fonctionnent sur tous les appareils.',
      },
      {
        title: 'E-commerce & Shopify',
        desc: "Thèmes Shopify sur mesure et portails B2B conçus pour convertir, des pages produits et campagnes promotionnelles aux systèmes de commande complexes. Liquid sur mesure, personnalisation du checkout et intégration d'apps.",
      },
      {
        title: 'Développement Fullstack',
        desc: "Des applications web complètes construites de bout en bout avec Django, PostgreSQL et React. De l'architecture de la base de données aux API REST jusqu'à l'interface, une seule personne sur toute la stack.",
      },
      {
        title: 'Motion & Animation',
        desc: "Des animations JavaScript et SVG sur mesure qui donnent à votre interface une vraie personnalité. Des transitions fluides aux séquences animées complexes, tout est construit de zéro et calibré pour paraître naturel.",
      },
      {
        title: 'Identité visuelle',
        desc: "Logos, systèmes de marque et identités visuelles créés de zéro. Un univers cohérent qui se décline sur votre produit, votre site et votre communication.",
      },
    ],

    projects: [
      {
        year: '2026',
        title: 'AccessEU, App de conformité accessibilité',
        desc: "Une app Shopify commerciale qui audite les boutiques selon les normes WCAG 2.1 AA et l'European Accessibility Act. Développée avec React Router v7, TypeScript, Prisma, et un moteur de scan Playwright plus axe-core exécutant 100 règles sur les viewports desktop et mobile.",
        tags: ['React Router', 'TypeScript', 'Prisma', 'Playwright', 'PostgreSQL'],
        link: null,
      },
      {
        year: 'Depuis 2024',
        title: 'Dealer Portal, Interdyn',
        desc: "Une plateforme e-commerce B2B fullstack pour un distributeur australien d'équipements audio. Catalogue produit sur mesure, tunnel de commande complexe, gestion des options et système de commandes admin complet, développé avec Django, React, HTMX et PostgreSQL.",
        tags: ['Django', 'React', 'HTMX', 'Tailwind', 'PostgreSQL'],
        link: null,
      },
      {
        year: 'Depuis 2024',
        title: 'Pro-Ject Audio Australia',
        desc: "Thème Shopify sur mesure pour le distributeur officiel australien des platines et composants audio Pro-Ject. Pages produits, pages d'atterrissage, campagnes saisonnières et expérience Black Friday complète, codées à partir d'une maquette Figma sur mesure.",
        tags: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
        link: 'https://www.projectaudio.com.au/',
      },
      {
        year: '2024',
        title: 'Pro-Ject Audio, Global',
        desc: "Développement frontend pour le site mondial officiel de Pro-Ject Audio Systems, fabricant européen de platines et de matériel audio distribué dans plus de 80 pays. Travail sur mesure du thème, mises en page éditoriales et support multilingue sur l'ensemble du catalogue produits.",
        tags: ['WordPress', 'CSS', 'JavaScript', 'WooCommerce'],
        link: 'https://www.project-audio.com/en/',
      },
      {
        year: '2023',
        title: 'Exclusive Construction',
        desc: "Design et développement du site d'un constructeur de maisons de luxe à Melbourne. Un site centré sur la photographie, conçu pour mettre en valeur la qualité de leurs constructions et inspirer confiance, avec formulaires de contact, galerie de projets et pages de services optimisées pour la recherche locale.",
        tags: ['WordPress', 'Elementor', 'CSS', 'JavaScript'],
        link: 'https://exclusiveconstruction.com.au/',
      },
      {
        year: '2023',
        title: 'Trimension Studio',
        desc: "Site vitrine pour un studio de jeux VR immersifs. Une expérience cinématique en une seule page avec animations au scroll et motion sur mesure, conçue pour refléter l'intensité visuelle de leurs titres Eons et Godsent.",
        tags: ['JavaScript', 'HTML', 'CSS', 'SVG'],
        link: null,
      },
    ],

    contact_p: "Vous avez un projet ? Je suis disponible pour des missions freelance, qu'il s'agisse d'un nouveau produit, d'une boutique Shopify, d'un design system, ou de quelque chose qui doit bouger. Basé à Toulouse, je travaille avec des clients partout en France et en Europe.",
    contact_location: 'Toulouse, France',
    contact_availability: 'Disponible pour de nouveaux projets',
    contact_response: 'Répond généralement sous 24h',
    form: {
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      success_title: 'Message envoyé.',
      success_body: "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
      error: "Une erreur est survenue. Veuillez réessayer, ou m'écrire directement :",
      name_placeholder: 'Votre nom',
      email_placeholder: 'votre@email.com',
      message_placeholder: 'Décrivez votre projet...',
      name_required: 'Veuillez indiquer votre nom.',
      email_required: 'Veuillez indiquer votre adresse email.',
      email_invalid: 'Cette adresse email semble incorrecte. Exemple : nom@entreprise.fr',
      message_required: 'Veuillez écrire un court message.',
      suggest_before: 'Vous vouliez dire',
      suggest_after: ' ?',
      honeypot: 'Laissez ce champ vide',
    },
  },
}

export default translations
