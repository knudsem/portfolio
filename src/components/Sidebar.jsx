import MKLogo from './MKLogo'

const NAV_IDS = ['about', 'services', 'work', 'contact']

const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const IconLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LANGUAGES = [
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'en', short: 'EN', name: 'English' },
]

export default function Sidebar({ t, lang, setLang, activeSection }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <MKLogo size={52} color="#fff" className="sidebar-logo" />
        <h1 className="sidebar-heading">
          <span className="sidebar-name">Mathias</span>
          <span className="sidebar-title">{t.title}</span>
        </h1>
        <p className="sidebar-tagline">{t.tagline}</p>

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

        <nav className="sidebar-nav" aria-label={t.nav_label}>
          {t.nav.map((label, i) => (
            <a
              key={NAV_IDS[i]}
              href={`#${NAV_IDS[i]}`}
              className={`nav-item ${activeSection === NAV_IDS[i] ? 'active' : ''}`}
              aria-current={activeSection === NAV_IDS[i] ? 'true' : undefined}
            >
              <span className="nav-line" />
              <span className="nav-label">{label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link" aria-label={`GitHub ${t.new_tab}`}>
          <IconGithub />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" aria-label={`LinkedIn ${t.new_tab}`}>
          <IconLinkedin />
        </a>
        <a href="#contact" className="social-link" aria-label={t.nav[3]}>
          <IconMail />
        </a>
      </div>
    </aside>
  )
}
