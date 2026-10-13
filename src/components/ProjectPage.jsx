import { useEffect, useMemo, useRef, useState } from 'react'
import ProjectCover from './ProjectCovers'
import { projectPath } from '../projects'
import { nameFrom, isPlainClick, backToHome } from '../viewTransitions'
import { highlight, LANGUAGE_NAMES } from '../highlight'
import { EXCERPTS } from '../demos/excerpts'
import EonsDemos from './EonsDemos'

const Icon = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

// A code excerpt, coloured by highlight.js, with a copy button. Long lines
// wrap, so the block never needs sideways scrolling. The colours (hundreds
// of spans) wait until the block comes near the screen: the text is the
// same, only the first paint is lighter.
function CodeBlock({ c, code }) {
  const source = code.source ?? EXCERPTS[code.excerpt]
  const preRef = useRef(null)
  const [near, setNear] = useState(false)
  const tokens = useMemo(() => (near ? highlight(source, code.lang) : null), [near, source, code.lang])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true)
        observer.disconnect()
      }
    }, { rootMargin: '50% 0px' })
    observer.observe(preRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = () => {
    navigator.clipboard?.writeText(source).then(() => setCopied(true), () => {})
  }

  return (
    <figure className="case-code">
      <div className="case-code-head">
        <span className="case-code-file">{code.file}</span>
        <span className="case-code-lang">{LANGUAGE_NAMES[code.lang]}</span>
        <button type="button" className="case-code-copy" onClick={copy}>
          {copied ? c.copied : c.copy}
          <span className="sr-only"> {code.file}</span>
        </button>
      </div>
      <pre className="case-code-body" ref={preRef}><code>
        {tokens ? tokens.map((token, i) => (token.type === 'plain'
          ? token.text
          : <span key={i} className={`tok-${token.type}`}>{token.text}</span>)) : source}
      </code></pre>
      <figcaption>{code.caption}</figcaption>
      <p className="sr-only" role="status">{copied ? c.copied : ''}</p>
    </figure>
  )
}

// Screens of the real site: the first one wide, then two by two, and the
// phone views side by side.
function Gallery({ c, images }) {
  const screens = images.filter((img) => !img.phone)
  const phones = images.filter((img) => img.phone)
  const picture = (img) => (
    <img src={img.src} width={img.width} height={img.height} alt={img.alt} loading="lazy" decoding="async" />
  )
  return (
    <section className="case-section" aria-labelledby="case-gallery">
      <h2 id="case-gallery" className="case-h2">{c.gallery}</h2>
      <div className="case-shots">
        {screens.map((img, i) => (
          <figure key={img.src} className={`case-shot${i === 0 ? ' is-wide' : ''}`}>
            {picture(img)}
            {img.caption && <figcaption>{img.caption}</figcaption>}
          </figure>
        ))}
        {phones.length > 0 && (
          <figure className="case-shot is-wide case-phones">
            <div className="case-phones-row">
              {phones.map((img) => <div key={img.src} className="case-phone">{picture(img)}</div>)}
            </div>
            {phones[0].caption && <figcaption>{phones[0].caption}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  )
}

// One page per project: what it is, the animated illustration, what I did,
// and, when written, the story, screens, details and code. The illustration
// plays on its own here, so it has a pause button (WCAG 2.2.2). The cover
// and the title morph in from the card that was clicked (viewTransitions.js).
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
        <div className="case-main">
          {project.story && (
            <section aria-labelledby="case-story">
              <h2 id="case-story" className="case-h2">{c.story}</h2>
              <div className="case-story">
                {project.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          )}
          <section aria-labelledby="case-did">
            <h2 id="case-did" className="case-h2">{c.did}</h2>
            <ul className="case-did">
              {project.did.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>

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

      {project.gallery && <Gallery c={c} images={project.gallery} />}

      {project.highlights && (
        <section className="case-section" aria-labelledby="case-highlights">
          <h2 id="case-highlights" className="case-h2">{c.highlights}</h2>
          <ul className="case-highlights">
            {project.highlights.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.revisited && (
        <section className="case-section" aria-labelledby="case-revisited">
          <h2 id="case-revisited" className="case-h2">{c.revisited}</h2>
          <p className="case-section-intro">{project.revisited.intro}</p>
          <EonsDemos r={project.revisited} />
          <h3 className="case-h3">{c.changes}</h3>
          <ul className="case-highlights case-changes">
            {project.revisited.changes.map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.code && (
        <section className="case-section" aria-labelledby="case-code">
          <h2 id="case-code" className="case-h2">{c.code}</h2>
          <div className="case-codes">
            {project.code.map((code) => <CodeBlock key={code.file} c={c} code={code} />)}
          </div>
        </section>
      )}

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
