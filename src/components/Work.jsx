import ProjectCover from './ProjectCovers'
import { projectPath } from '../projects'
import { nameFrom, isPlainClick } from '../viewTransitions'

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function Work({ t }) {
  return (
    <section id="work">
      <div className="section-head" data-reveal>
        <h2 className="section-title">{t.work_title}</h2>
        <p className="section-intro">{t.work_intro}</p>
      </div>

      <ul className="card-grid">
        {t.projects.map((project, i) => (
          <li
            key={project.id}
            className="project-card is-link"
            data-project={project.id}
            data-reveal
            style={{ '--reveal-delay': `${(i % 2) * 90}ms` }}
          >
            <ProjectCover id={project.id} data-vt="cover" />
            <div className="project-meta">
              <span className="project-type">{project.type}</span>
              <span className="project-year">{project.year}</span>
            </div>
            <h3 className="project-title" data-vt="title">
              {/* The link covers the whole card (see .project-link::after),
                  so its name stays short: just the title. */}
              <a
                href={projectPath(project.id)}
                className="project-link"
                onClick={(e) => { if (isPlainClick(e)) nameFrom(e.currentTarget.closest('.project-card')) }}
              >
                {project.title}
              </a>
            </h3>
            <p className="project-desc">{project.desc}</p>
            <ul className="project-tags">
              {project.tags.map((tag) => (
                <li key={tag} className="project-tag">{tag}</li>
              ))}
            </ul>
            <span className="project-visit" aria-hidden="true">
              {t.view_project}
              <IconArrow />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
