import { useState } from 'react'
import ProjectCover from './ProjectCovers'
import { projectPath } from '../projects'
import { nameFrom, isPlainClick, backToHome } from '../viewTransitions'

const Icon = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

// One page per project: what it is, the animated illustration, what I did.
// The illustration plays on its own here, so it has a pause button
// (WCAG 2.2.2). The cover and the title morph in from the card that was
// clicked (see viewTransitions.js).
export default function ProjectPage({ t, id }) {
  const c = t.case
  const index = t.projects.findIndex((p) => p.id === id)
  const project = t.projects[index]
  const next = t.projects[(index + 1) % t.projects.length]
  const [motionAllowed] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(motionAllowed)

  return (
    <article className="case">
      <a href="/#work" className="case-back" onClick={backToHome}>
        <Icon><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>
        {c.back}
      </a>

      <div className="case-head" data-vt-page>
        <p className="case-meta case-in">
          <span className="case-type">{project.type}</span>
          <span className="case-year">{project.year}</span>
        </p>
        <h1 className="case-title" data-vt="title">{project.title}</h1>
        <p className="case-lead case-in" style={{ '--d': '80ms' }}>{project.summary}</p>
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary case-visit case-in" style={{ '--d': '140ms' }} data-magnetic>
            {c.visit}
            <span className="sr-only"> {t.new_tab}</span>
            <Icon size={15}><path d="M7 17 17 7M8 7h9v9" /></Icon>
          </a>
        )}

        <div className="case-cover" data-playing={playing ? '' : undefined}>
          <ProjectCover id={project.id} data-vt="cover" />
          {motionAllowed && (
            <button type="button" className="case-play" onClick={() => setPlaying((on) => !on)}>
              <span className="sr-only">{playing ? c.pause : c.play}</span>
              {playing
                ? <Icon><path d="M9 5v14M15 5v14" /></Icon>
                : <Icon><path d="M8 5.5v13l10-6.5z" /></Icon>}
            </button>
          )}
        </div>
      </div>

      <div className="case-body case-in" style={{ '--d': '220ms' }}>
        <section aria-labelledby="case-did">
          <h2 id="case-did" className="case-h2">{c.did}</h2>
          <ul className="case-did">
            {project.did.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <aside className="case-details" aria-labelledby="case-details">
          <h2 id="case-details" className="case-details-title">{c.details}</h2>
          <dl>
            <div>
              <dt>{c.type}</dt>
              <dd>{project.type}</dd>
            </div>
            <div>
              <dt>{c.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>{c.stack}</dt>
              <dd>
                <ul className="project-tags">
                  {project.tags.map((tag) => <li key={tag} className="project-tag">{tag}</li>)}
                </ul>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <nav className="case-next" aria-label={c.next}>
        <a
          href={projectPath(next.id)}
          className="case-next-link"
          onClick={(e) => { if (isPlainClick(e)) nameFrom(e.currentTarget) }}
        >
          <span className="case-next-text">
            <span className="case-next-label">{c.next}</span>
            <span className="case-next-title" data-vt="title">{next.title}</span>
            <span className="case-next-type">{next.type}</span>
          </span>
          <ProjectCover id={next.id} data-vt="cover" />
        </a>
      </nav>

      <section className="case-cta" aria-labelledby="case-cta">
        <h2 id="case-cta" className="case-cta-title">{c.cta_title}</h2>
        <p>{c.cta_text}</p>
        <a href="/#contact" className="btn btn-primary" data-magnetic>{t.hero.cta_contact}</a>
      </section>
    </article>
  )
}

export function NotFound({ t }) {
  const c = t.case
  return (
    <section className="case case-missing">
      <h1 className="case-title">{c.not_found_title}</h1>
      <p className="case-lead">{c.not_found_text}</p>
      <a href="/" className="btn btn-primary case-visit">{c.not_found_link}</a>
    </section>
  )
}
