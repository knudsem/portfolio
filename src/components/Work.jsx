import { useEffect, useRef } from 'react'
import ProjectCover from './ProjectCovers'

// How long a cover plays when it first comes into view. Kept under five
// seconds: longer motion that starts by itself would need a pause control
// (WCAG 2.2.2).
const PLAY_MS = 4200

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
)

export default function Work({ t }) {
  const sectionRef = useRef(null)

  // Each cover plays once, briefly, the first time it is fully in view, so
  // visitors on touch screens see it move too. Hover or focus plays it again.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timers = []
    const playing = []
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        const card = entry.target.closest('.project-card')
        card.dataset.playing = ''
        playing.push(card)
        timers.push(setTimeout(() => delete card.dataset.playing, PLAY_MS))
      }
    }, { threshold: 0.85 })
    sectionRef.current.querySelectorAll('.project-cover').forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
      playing.forEach((card) => delete card.dataset.playing)
    }
  }, [])

  return (
    <section id="work" ref={sectionRef}>
      <div className="section-head" data-reveal>
        <h2 className="section-title">{t.work_title}</h2>
        <p className="section-intro">{t.work_intro}</p>
      </div>

      <ul className="card-grid">
        {t.projects.map((project, i) => (
          <li
            key={project.id}
            className={`project-card${project.link ? ' is-link' : ''}`}
            data-reveal
            style={{ '--reveal-delay': `${(i % 2) * 90}ms` }}
          >
            <ProjectCover id={project.id} />
            <div className="project-meta">
              <span className="project-type">{project.type}</span>
              <span className="project-year">{project.year}</span>
            </div>
            <h3 className="project-title">
              {project.link ? (
                // The link covers the whole card (see .project-link::after),
                // so its name stays short: just the title.
                <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                  {project.title}
                  <span className="sr-only"> {t.new_tab}</span>
                </a>
              ) : project.title}
            </h3>
            <p className="project-desc">{project.desc}</p>
            <ul className="project-tags">
              {project.tags.map((tag) => (
                <li key={tag} className="project-tag">{tag}</li>
              ))}
            </ul>
            {project.link && (
              <span className="project-visit" aria-hidden="true">
                {t.visit}
                <IconArrow />
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
