import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Services from './components/Services'
import Proof from './components/Proof'
import Contact from './components/Contact'
import Footer from './components/Footer'
import translations from './i18n'
import { detectLanguage, saveLanguage, isLanguageChosen } from './language'

const SECTIONS = ['about', 'work', 'services', 'proof', 'contact']

export default function App() {
  const [lang, setLangState] = useState(detectLanguage)
  const [contentVisible, setContentVisible] = useState(true)
  const [activeSection, setActiveSection] = useState(null)
  const [langChosen, setLangChosen] = useState(isLanguageChosen)
  const [menuOpen, setMenuOpen] = useState(false)

  const glowRef = useRef(null)
  const pendingLang = useRef(null)

  const t = translations[lang]

  // Keep the page language (read by screen readers and search engines)
  // and the browser tab title in sync with the language shown.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.page_title
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

  // Scroll spy
  useEffect(() => {
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
          <Hero t={t} />
          <About t={t} />
          <Work t={t} />
          <Services t={t} />
          <Proof t={t} lang={lang} langChosen={langChosen} />
          <Contact t={t} />
        </main>
        <Footer t={t} />
      </div>
    </div>
  )
}
