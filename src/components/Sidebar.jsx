import MKLogo from './MKLogo'

const NAV_IDS = ['about', 'services', 'work', 'contact']

const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const IconLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

export default function Sidebar({ t, lang, setLang, activeSection, mainRef }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' })
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <MKLogo size={52} color="#fff" className="sidebar-logo" />
        <div className="sidebar-name">Mathias</div>
        <div className="sidebar-title">{t.title}</div>
        <div className="sidebar-tagline">{t.tagline}</div>

        <div className="lang-toggle">
          <button
            className={lang === 'en' ? 'lang-btn active' : 'lang-btn'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            className={lang === 'fr' ? 'lang-btn active' : 'lang-btn'}
            onClick={() => setLang('fr')}
          >
            FR
          </button>
        </div>

        <nav className="sidebar-nav">
          {t.nav.map((label, i) => (
            <button
              key={NAV_IDS[i]}
              className={`nav-item ${activeSection === NAV_IDS[i] ? 'active' : ''}`}
              onClick={() => scrollTo(NAV_IDS[i])}
            >
              <span className="nav-line" />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub">
          <IconGithub />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
          <IconLinkedin />
        </a>
        <button className="social-link" aria-label="Contact" onClick={() => scrollTo('contact')}>
          <IconMail />
        </button>
      </div>
    </aside>
  )
}
