import { useState, useEffect, useRef } from 'react'
import MKLogo from './MKLogo'

const NAV_IDS = ['about', 'work', 'services', 'proof']
// Pages of their own, after the sections of the home page
const NAV_PAGES = [{ id: 'lab', href: '/lab' }, { id: 'blog', href: '/blog' }]

const LANGUAGES = [
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'en', short: 'EN', name: 'English' },
]

function LangToggle({ t, lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label={t.lang_label}>
      {LANGUAGES.map(({ code, short, name }) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={lang === code ? 'lang-btn active' : 'lang-btn'}
          aria-label={`${short} ${name}`}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {short}
        </button>
      ))}
    </div>
  )
}

export default function Header({ t, lang, setLang, activeSection, menuOpen, setMenuOpen, shortcut, onOpenPalette, home, page: route }) {
  // A post belongs to the blog
  const page = route === 'post' ? 'blog' : route
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Open menu: focus goes to the first link, Escape closes it and gives
  // focus back to the menu button.
  useEffect(() => {
    if (!menuOpen) return
    firstLinkRef.current?.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen, setMenuOpen])

  // The menu only exists on small screens: close it if the window grows.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1080px)')
    const handleChange = () => { if (wide.matches) setMenuOpen(false) }
    wide.addEventListener('change', handleChange)
    return () => wide.removeEventListener('change', handleChange)
  }, [setMenuOpen])

  const closeMenu = () => setMenuOpen(false)
  // Section links lead back to the home page from a project page
  const base = home ? '' : '/'

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
      <div className="header-inner">
        <a href={home ? '#top' : '/'} className="brand" onClick={closeMenu}>
          <MKLogo size={38} color="#fff" />
          <span className="brand-name">Mathias Knudsen</span>
        </a>

        <nav className="header-nav" aria-label={t.nav_label}>
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`${base}#${id}`}
              className={`header-link${activeSection === id ? ' active' : ''}`}
              aria-current={activeSection === id ? 'true' : undefined}
            >
              {t.nav[id]}
            </a>
          ))}
          {NAV_PAGES.map(({ id, href }) => (
            <a
              key={id}
              href={href}
              className={`header-link${page === id ? ' active' : ''}`}
              aria-current={page === id ? 'page' : undefined}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {/* Only shown on wide screens, where a keyboard is likely */}
          <button
            type="button"
            className="cmdk-trigger"
            aria-haspopup="dialog"
            aria-keyshortcuts={shortcut[0] === 'Ctrl' ? 'Control+K' : 'Meta+K'}
            title={`${t.palette.open} (${shortcut.join(' ')})`}
            onClick={onOpenPalette}
          >
            <span className="sr-only">{t.palette.open}, </span>
            <kbd>{shortcut[0]}</kbd> <kbd>{shortcut[1]}</kbd>
          </button>
          <LangToggle t={t} lang={lang} setLang={setLang} />
          <a href={`${base}#contact`} className="btn btn-primary btn-small header-cta" data-magnetic onClick={closeMenu}>
            {t.hero.cta_contact}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? t.menu_close : t.menu_open}</span>
            <span className="menu-icon" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
      </div>

      {/* Reading progress, drawn by the browser from the scroll position */}
      <span className="scroll-progress" aria-hidden="true" />

      {menuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label={t.nav_label}>
          <ul>
            {[
              ...NAV_IDS.map((id) => ({ id, href: `${base}#${id}`, current: activeSection === id, kind: 'true' })),
              ...NAV_PAGES.map(({ id, href }) => ({ id, href, current: page === id, kind: 'page' })),
              { id: 'contact', href: `${base}#contact`, current: activeSection === 'contact', kind: 'true' },
            ].map(({ id, href, current, kind }, i) => (
              <li key={id} style={{ '--i': i }}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  className={`mobile-menu-link${current ? ' active' : ''}`}
                  aria-current={current ? kind : undefined}
                  onClick={closeMenu}
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
