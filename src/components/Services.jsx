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
  // Ecommerce & Shopify
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>,
  // Fullstack Development
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
  </svg>,
  // Motion & Animation
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
    <path d="M3 6c0 0 2-1 4 0s4 2 6 1" />
    <path d="M3 18c0 0 2-1 4 0s4 2 6 1" />
  </svg>,
  // Brand & Visual Identity
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64FFDA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
    <path d="M9 8c-2 3-4 3.5-7 4l8 8c1-3 1.5-5 4-7" />
    <path d="M14.5 17.5 4.5 15" />
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
