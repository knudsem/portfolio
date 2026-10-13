import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Services from './components/Services'
import Proof from './components/Proof'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CommandPalette from './components/CommandPalette'
import ProjectPage, { NotFound } from './components/ProjectPage'
import translations from './i18n'
import { detectLanguage, saveLanguage, isLanguageChosen } from './language'
import { CONTACT_EMAIL } from './email'
import { IS_APPLE, SHORTCUT } from './platform'
import { startPointerEffects } from './pointerEffects'
import { parseRoute, projectPath, postPath, SITE_URL, LAB_PATH, BLOG_PATH } from './projects'

// The lab and the blog carry their own content and styles: only downloaded
// on their pages
const LabPage = lazy(() => import('./lab/LabPage'))
const BlogPage = lazy(() => import('./blog/BlogPage'))

const SECTIONS = ['about', 'work', 'services', 'proof', 'contact']

// Which page this is. Every page is its own address, loaded by the browser
// (links between pages are ordinary links), so this never changes.
const ROUTE = parseRoute(window.location.pathname)
const HOME = ROUTE.name === 'home'

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key])

// Words each command can also be found by, in both languages and without
// accents (the search ignores them).
const KEYWORDS = {
  about: 'about me who profile bio a propos qui profil moi',
  work: 'work projects portfolio case studies projets realisations travaux',
  services: 'services offer what i do prestations offre',
  proof: 'proof performance accessibility speed preuve vitesse',
  top: 'top start home haut debut accueil',
  message: 'contact message email hire quote project write contacter ecrire devis mission',
  audit: 'accessibility a11y wcag axe test audit accessibilite',
  email: 'email mail address copy courriel adresse copier',
  link: 'link url share copy address lien partager copier adresse',
  lang: 'language langue english french anglais francais switch passer',
  lab: 'lab animations library demos buttons loaders laboratoire bibliotheque boutons chargements',
  blog: 'blog articles posts notes writing advice ai motion conseils ia ecrits',
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scrolls to a section and moves keyboard focus there: to the element given
// by the selector, or else to the section's heading. From a project page,
// opens the home page at that section.
function goTo(id, selector) {
  const section = document.getElementById(id)
  if (!section) {
    window.location.assign(`/#${id}`)
    return
  }
  section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const target = (selector && section.querySelector(selector)) || section.querySelector('h2')
  if (!target) return
  if (!target.matches('a[href], button, input, textarea, select, [tabindex]')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

export default function App() {
  const [lang, setLangState] = useState(detectLanguage)
  const [contentVisible, setContentVisible] = useState(true)
  const [activeSection, setActiveSection] = useState(null)
  const [langChosen, setLangChosen] = useState(isLanguageChosen)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [auditRequest, setAuditRequest] = useState(0)
  const [toast, setToast] = useState(null)

  const glowRef = useRef(null)
  const pendingLang = useRef(null)

  const t = translations[lang]

  // Keep the page language (read by screen readers and search engines)
  // and the browser tab title in sync with the language shown.
  useEffect(() => {
    document.documentElement.lang = lang
    if (ROUTE.name === 'project') {
      document.title = fill(t.case.title, { title: t.projects.find((p) => p.id === ROUTE.id).title })
    } else if (ROUTE.name === 'lab') {
      document.title = t.lab.title
    } else if (ROUTE.name === 'blog') {
      document.title = t.blog.title
    } else if (ROUTE.name === 'post') {
      // set by the post itself, which knows its title (BlogPage.jsx)
    } else if (ROUTE.name === 'notfound') {
      document.title = fill(t.case.title, { title: t.case.not_found_title })
    } else {
      document.title = t.page_title
    }
  }, [lang, t])

  // Language toggle with fade (instant when the visitor asked to reduce
  // motion). A visitor's own choice is remembered.
  const setLang = useCallback((newLang) => {
    saveLanguage(newLang)
    setLangChosen(true)
    if (newLang === lang) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLangState(newLang)
      return
    }
    pendingLang.current = newLang
    setContentVisible(false)
  }, [lang])

  useEffect(() => {
    if (!contentVisible && pendingLang.current) {
      const timer = setTimeout(() => {
        setLangState(pendingLang.current)
        pendingLang.current = null
        setContentVisible(true)
      }, 220)
      return () => clearTimeout(timer)
    }
  }, [contentVisible])

  // Ctrl K (Cmd K on a Mac) opens and closes the command menu from
  // anywhere. On a Mac, Ctrl K in a text field deletes to the end of the
  // line, so it is left alone there.
  useEffect(() => {
    const handleKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return
      const key = /^[a-z]$/i.test(e.key) ? e.key.toLowerCase() : e.code === 'KeyK' ? 'k' : ''
      if (key !== 'k') return
      if (IS_APPLE && !e.metaKey && e.target.closest?.('input, textarea, [contenteditable]')) return
      e.preventDefault()
      setMenuOpen(false)
      setPaletteOpen((open) => !open)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Short confirmation messages, read out by screen readers too.
  const showToast = useCallback((text) => setToast({ text, id: Date.now() }), [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const commands = useMemo(() => {
    const p = t.palette
    const copy = (text, done) => {
      const failed = () => showToast(fill(t.toast.failed, { text }))
      if (!navigator.clipboard?.writeText) return failed()
      return navigator.clipboard.writeText(text).then(() => showToast(done), failed)
    }
    const section = (id) => ({ id, group: 'go', icon: 'arrow', label: t.nav[id], hint: `#${id}`, run: () => goTo(id) })
    // The public address of this page, also when browsing a preview
    const PAGE_PATHS = { project: () => projectPath(ROUTE.id), lab: () => LAB_PATH, blog: () => BLOG_PATH, post: () => postPath(ROUTE.slug) }
    const pageUrl = `${SITE_URL}${PAGE_PATHS[ROUTE.name]?.() ?? '/'}`
    const otherLang = lang === 'fr' ? 'en' : 'fr'
    return [
      section('about'),
      section('work'),
      section('services'),
      section('proof'),
      ROUTE.name !== 'lab' && {
        id: 'lab',
        group: 'go',
        icon: 'arrow',
        label: t.nav.lab,
        hint: LAB_PATH,
        run: () => window.location.assign(LAB_PATH),
      },
      ROUTE.name !== 'blog' && {
        id: 'blog',
        group: 'go',
        icon: 'arrow',
        label: t.nav.blog,
        hint: BLOG_PATH,
        run: () => window.location.assign(BLOG_PATH),
      },
      {
        id: 'top',
        group: 'go',
        icon: 'top',
        label: p.top,
        hint: '#top',
        run: () => {
          window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
          document.getElementById('main')?.focus({ preventScroll: true })
        },
      },
      ...t.projects
        .filter((project) => project.id !== ROUTE.id)
        .map((project) => ({
          id: `project-${project.id}`,
          group: 'projects',
          icon: 'project',
          label: project.title,
          keywords: `${project.type} ${project.tags.join(' ')} projet project`,
          run: () => window.location.assign(projectPath(project.id)),
        })),
      { id: 'message', group: 'actions', icon: 'message', label: p.message, run: () => goTo('contact', '#cf-name') },
      // The audit checks the home page, where its results are shown
      HOME && {
        id: 'audit',
        group: 'actions',
        icon: 'audit',
        label: p.audit,
        run: () => {
          goTo('proof', '.proof-button')
          setAuditRequest((n) => n + 1)
        },
      },
      { id: 'email', group: 'actions', icon: 'copy', label: p.email, instant: true, run: () => copy(CONTACT_EMAIL, t.toast.email) },
      { id: 'link', group: 'actions', icon: 'link', label: p.link, instant: true, run: () => copy(pageUrl, t.toast.link) },
      { id: 'lang', group: 'actions', icon: 'lang', label: p.lang, lang: otherLang, run: () => setLang(otherLang) },
    ].filter(Boolean).map((cmd) => ({ keywords: KEYWORDS[cmd.id], ...cmd }))
  }, [t, lang, setLang, showToast])

  const closePalette = useCallback(() => setPaletteOpen(false), [])

  // While the phone menu is open the page behind it does not scroll.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [menuOpen])

  // Mouse glow effect. Moves through CSS variables, so the page is not
  // re-rendered on every mouse movement. Off for touch screens and for
  // visitors who asked their system to reduce motion.
  useEffect(() => {
    const glow = glowRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!glow || !finePointer || reduceMotion) return

    let frame = 0
    const handleMouseMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        glow.style.setProperty('--glow-x', `${e.clientX}px`)
        glow.style.setProperty('--glow-y', `${e.clientY}px`)
        glow.style.opacity = '1'
      })
    }
    const handleMouseLeave = () => {
      cancelAnimationFrame(frame)
      glow.style.opacity = '0'
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Border light on cards and magnetic buttons (see pointerEffects.js).
  useEffect(() => startPointerEffects(), [])

  // Blocks fade in as they scroll into view. main.jsx only turns this on
  // when the visitor has not asked to reduce motion. Runs again after a
  // language change to pick up anything not revealed yet.
  useEffect(() => {
    if (!document.documentElement.classList.contains('reveal-ready')) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 })
    document.querySelectorAll('[data-reveal]:not([data-visible])').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [lang])

  // Arriving from another page on a link to a section (/#work from a project
  // page): the section only exists once the app has drawn the page, after
  // the browser looked for it, so the page is taken there now, before it is
  // shown. Going back or reloading, the browser restores the position itself.
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const arrival = performance.getEntriesByType?.('navigation')?.[0]?.type
    if (!HOME || !id || arrival !== 'navigate') return
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [])

  // Scroll spy (home page only: other pages have no sections)
  useEffect(() => {
    if (!HOME) return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const offset = 120

      // If scrolled to the bottom, always activate the last section.
      // A short final section can never reach its own trigger point otherwise.
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1])
        return
      }

      // Nothing is highlighted while the hero is on screen.
      let current = null
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = id
        }
      }
      setActiveSection(current)
    }

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="page-container">
      <a href="#main" className="skip-link">{t.skip}</a>
      <div className="glow-layer" ref={glowRef} aria-hidden="true" />

      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        activeSection={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        shortcut={SHORTCUT}
        onOpenPalette={() => setPaletteOpen(true)}
        home={HOME}
        page={ROUTE.name}
      />

      {/* inert: while the phone menu is open, the page behind it cannot be
          reached with the keyboard or a screen reader */}
      <div
        className="content"
        inert={menuOpen ? '' : undefined}
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      >
        <main id="main" className="main-content" tabIndex={-1}>
          {ROUTE.name === 'home' && (
            <>
              <Hero t={t} />
              <About t={t} />
              <Work t={t} />
              <Services t={t} />
              <Proof t={t} lang={lang} langChosen={langChosen} auditRequest={auditRequest} />
              <Contact t={t} />
            </>
          )}
          {ROUTE.name === 'project' && <ProjectPage t={t} id={ROUTE.id} />}
          {ROUTE.name === 'lab' && (
            <Suspense fallback={<div className="page-wait" />}>
              <LabPage t={t} lang={lang} />
            </Suspense>
          )}
          {(ROUTE.name === 'blog' || ROUTE.name === 'post') && (
            <Suspense fallback={<div className="page-wait" />}>
              <BlogPage t={t} lang={lang} slug={ROUTE.slug} />
            </Suspense>
          )}
          {ROUTE.name === 'notfound' && <NotFound t={t} />}
        </main>
        <Footer t={t} />
      </div>

      <CommandPalette t={t} lang={lang} open={paletteOpen} onClose={closePalette} commands={commands} />

      <div className="toast-region" role="status">
        {toast && <p key={toast.id} className="toast">{toast.text}</p>}
      </div>
    </div>
  )
}
