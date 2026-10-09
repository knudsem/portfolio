import MKLogo from './MKLogo'

// Phone and tablet only: stays at the top of the screen while scrolling.
// "About" is the top of the page, so the logo takes visitors there.
const LINKS = [
  { id: 'services', navIndex: 1 },
  { id: 'work', navIndex: 2 },
]

export default function MobileBar({ t, activeSection }) {
  return (
    <header className="mobile-bar">
      <a href="#top" className="mobile-bar-logo" aria-label={t.back_to_top}>
        <MKLogo size={34} color="#fff" />
      </a>
      <nav className="mobile-nav" aria-label={t.nav_label}>
        {LINKS.map(({ id, navIndex }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`mobile-nav-link${activeSection === id ? ' active' : ''}`}
            aria-current={activeSection === id ? 'true' : undefined}
          >
            {t.nav[navIndex]}
          </a>
        ))}
        <a href="#contact" className="mobile-contact">{t.nav[3]}</a>
      </nav>
    </header>
  )
}
