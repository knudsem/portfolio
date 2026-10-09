export default function Footer({ t }) {
  return (
    <footer className="site-footer">
      <p>
        <span>© {new Date().getFullYear()} Mathias Knudsen</span>
        <span className="site-footer-note">{t.footer}</span>
      </p>
      <a href="#top" className="site-footer-top">
        {t.back_to_top}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="6 11 12 5 18 11" />
        </svg>
      </a>
    </footer>
  )
}
