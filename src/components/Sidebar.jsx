import MKLogo from './MKLogo'

const NAV_IDS = ['about', 'work', 'services', 'contact']

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
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
          <span className="sidebar-name">Mathias Knudsen</span>
          <span className="sidebar-title">{t.title}</span>
        </h1>

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
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-item${activeSection === id ? ' active' : ''}`}
              aria-current={activeSection === id ? 'true' : undefined}
            >
              <span className="nav-line" />
              <span className="nav-label">{t.nav[id]}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <a href="#contact" className="btn btn-secondary btn-small">
          <IconMail />
          {t.hero.cta_contact}
        </a>
      </div>
    </aside>
  )
}
