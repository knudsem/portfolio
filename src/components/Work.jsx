const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
)

export default function Work({ t }) {
  return (
    <section id="work">
      <div className="section-label">{t.nav[2]}</div>

      <div className="projects-list">
        {t.projects.map((project) => {
          const Wrapper = project.link ? 'a' : 'div'
          const wrapperProps = project.link
            ? { href: project.link, target: '_blank', rel: 'noreferrer' }
            : {}

          return (
            <Wrapper
              key={project.title}
              className={`project-card${project.link ? ' project-card-link' : ''}`}
              {...wrapperProps}
            >
              <div className="project-year">{project.year}</div>
              <div className="project-content">
                <h3 className="project-title">
                  {project.title}
                  {project.link && <IconArrow />}
                </h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Wrapper>
          )
        })}
      </div>
    </section>
  )
}
