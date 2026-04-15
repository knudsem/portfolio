import { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import About from './components/About'
import Services from './components/Services'
import Work from './components/Work'
import Contact from './components/Contact'
import translations from './i18n'

const SECTIONS = ['about', 'services', 'work', 'contact']

export default function App() {
  const [lang, setLangState] = useState('en')
  const [contentVisible, setContentVisible] = useState(true)
  const [activeSection, setActiveSection] = useState('about')
  const [glowStyle, setGlowStyle] = useState({})

  const containerRef = useRef(null)
  const mainRef = useRef(null)
  const pendingLang = useRef(null)

  const t = translations[lang]

  // Language toggle with fade
  const setLang = useCallback((newLang) => {
    if (newLang === lang) return
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

  // Mouse glow effect
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setGlowStyle({
      background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(100,255,218,0.07), transparent 70%)`,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setGlowStyle({ background: 'none' })
  }, [])

  // Scroll spy
  useEffect(() => {
    const mainEl = mainRef.current
    if (!mainEl) return

    const handleScroll = () => {
      const scrollTop = mainEl.scrollTop
      const offset = 120

      let current = SECTIONS[0]
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop - offset <= scrollTop) {
          current = id
        }
      }
      setActiveSection(current)
    }

    mainEl.addEventListener('scroll', handleScroll, { passive: true })
    return () => mainEl.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="page-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="glow-layer" style={glowStyle} />

      <Sidebar
        t={t}
        lang={lang}
        setLang={setLang}
        activeSection={activeSection}
        mainRef={mainRef}
      />

      <main
        className="main-content"
        ref={mainRef}
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      >
        <About t={t} />
        <Services t={t} />
        <Work t={t} />
        <Contact t={t} />
      </main>
    </div>
  )
}
