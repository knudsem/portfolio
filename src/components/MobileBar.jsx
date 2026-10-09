import MKLogo from './MKLogo'

// Phone and tablet only: stays at the top of the screen while scrolling.
// "About" is the top of the page, so the logo takes visitors there.
const LINKS = ['work', 'services']

export default function MobileBar({ t, activeSection }) {
  return (
    <header className="mobile-bar">
      <a href="#top" className="mobile-bar-logo" aria-label={t.back_to_top}>
        <MKLogo size={34} color="#fff" />
      </a>
      <nav className="mobile-nav" aria-label={t.nav_label}>
        {LINKS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={`mobile-nav-link${activeSection === id ? ' active' : ''}`}
            aria-current={activeSection === id ? 'true' : undefined}
          >
            {t.nav[id]}
          </a>
        ))}
        <a href="#contact" className="mobile-contact">{t.nav.contact}</a>
      </nav>
    </header>
  )
}
