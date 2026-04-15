const icons = [
  // UI/UX Design
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
  </svg>,
  // Frontend Development
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>,
  // Motion & Animation
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
    <path d="M3 6c0 0 2-1 4 0s4 2 6 1" />
    <path d="M3 18c0 0 2-1 4 0s4 2 6 1" />
  </svg>,
  // Ecommerce
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>,
]

export default function Services({ t }) {
  return (
    <section id="services">
      <div className="section-label">{t.nav[1]}</div>

      <div className="services-list">
        {t.services.map((service, i) => (
          <div key={service.title} className="service-card">
            <div className="service-icon">
              {icons[i]}
            </div>
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
