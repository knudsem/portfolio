import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import { CATEGORIES, DEMOS } from './demos'
import { SCRIPTS } from './scripts'
import { typeset } from '../typeset'
import './demos.css'
import './lab.css'

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key])

const Icon = ({ children }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

// Lower case, without accents, so "defilement" finds "Défilement"
const fold = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

// One demo: it runs live on its stage, its script (if any) is started on the
// stage and undone when it leaves. Replay mounts a fresh stage. It rests
// while off screen.
function DemoCard({ demo, lang, l, onCode }) {
  const cardRef = useRef(null)
  const stageRef = useRef(null)
  const [run, setRun] = useState(0)
  const name = typeset(demo.title[lang], lang)

  useEffect(() => SCRIPTS[demo.id]?.(stageRef.current), [demo.id, run])

  useEffect(() => {
    const card = cardRef.current
    const observer = new IntersectionObserver(([entry]) => card.toggleAttribute('data-inview', entry.isIntersecting), { rootMargin: '80px 0px' })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <li className="lab-card" ref={cardRef} data-demo={demo.id}>
      {/* The demo's own markup, the same text the code panel shows */}
      <div key={run} ref={stageRef} className="lab-stage" dangerouslySetInnerHTML={{ __html: demo.html }} />
      <div className="lab-card-body">
        <h2 className="lab-card-title">{name}</h2>
        <p className="lab-card-note">{typeset(demo.note[lang], lang)}</p>
        <div className="lab-card-foot">
          <ul className="lab-tech">
            {demo.tech.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          <div className="lab-actions">
            {demo.replay && (
              <button type="button" className="lab-action" aria-label={fill(l.replay_of, { name })} onClick={() => setRun((n) => n + 1)}>
                <Icon><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></Icon>
                {l.replay}
              </button>
            )}
            <button type="button" className="lab-action" aria-haspopup="dialog" aria-label={fill(l.code_of, { name })} onClick={() => onCode(demo)}>
              <Icon><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></Icon>
              {l.code}
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

// The code of one demo: its HTML, and its CSS and JavaScript read from the
// files that run it (loaded only when a panel is first opened).
function CodeDialog({ demo, lang, l, onClose }) {
  const ref = useRef(null)
  const [source, setSource] = useState(null)

  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    let live = true
    import('./source').then(({ sourceOf }) => { if (live) setSource(sourceOf(demo.id)) })
    return () => { live = false }
  }, [demo.id])

  const c = { copy: l.copy, copied: l.copied }
  return (
    <dialog
      ref={ref}
      className="lab-dialog"
      aria-labelledby="lab-dialog-title"
      onClose={onClose}
      // a click on the backdrop (the dialog box itself, outside its content) closes it
      onClick={(e) => { if (e.target === ref.current) ref.current.close() }}
    >
      <div className="lab-dialog-content">
        <div className="lab-dialog-head">
          <h2 id="lab-dialog-title" className="lab-dialog-title">{fill(l.code_of, { name: typeset(demo.title[lang], lang) })}</h2>
          <button type="button" className="lab-dialog-close" aria-label={l.close} onClick={() => ref.current.close()}>
            <Icon><path d="M6 6l12 12M18 6 6 18" /></Icon>
          </button>
        </div>
        {source ? (
          <div className="case-codes">
            <CodeBlock c={c} code={{ source: demo.html, lang: 'html', file: 'index.html' }} />
            <CodeBlock c={c} code={{ source: source.css, lang: 'css', file: 'style.css' }} />
            {source.js && <CodeBlock c={c} code={{ source: source.js, lang: 'js', file: 'script.js', caption: l.js_note }} />}
          </div>
        ) : (
          <p className="lab-dialog-wait" role="status">{l.loading_code}</p>
        )}
      </div>
    </dialog>
  )
}

export default function LabPage({ t, lang }) {
  const l = t.lab
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [paused, setPaused] = useState(false)
  const [codeFor, setCodeFor] = useState(null)
  const [calm] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const mainRef = useRef(null)
  const firstFilter = useRef(true)

  const words = fold(query.trim()).split(/\s+/).filter(Boolean)
  const matches = (demo) => {
    if (!words.length) return true
    const text = fold([demo.title.en, demo.title.fr, demo.note[lang], l.cats[demo.cat], ...demo.tech].join(' '))
    return words.every((word) => text.includes(word))
  }
  const shown = DEMOS.filter((demo) => (filter === 'all' || demo.cat === filter) && matches(demo))
  const countOf = (cat) => (cat === 'all' ? DEMOS.length : DEMOS.filter((demo) => demo.cat === cat).length)
  const cats = ['all', ...CATEGORIES.filter((cat) => countOf(cat) > 0)]

  // After a new filter, the results start at the top of the grid, when the
  // visitor had scrolled past it
  useEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return }
    const main = mainRef.current
    if (main.getBoundingClientRect().top < 0) main.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' })
  }, [filter, calm])

  const search = (id) => (
    <div className="lab-search">
      <label htmlFor={id} className="sr-only">{l.search_label}</label>
      <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
      <input id={id} type="search" value={query} placeholder={l.search_placeholder} autoComplete="off" spellCheck="false" onChange={(e) => setQuery(e.target.value)} />
    </div>
  )
  const pause = !calm && (
    <button type="button" className="lab-pause" aria-pressed={paused} onClick={() => setPaused((on) => !on)}>
      <Icon>{paused ? <path d="M8 5.5v13l10-6.5z" /> : <path d="M9 5v14M15 5v14" />}</Icon>
      {l.pause_all}
    </button>
  )

  return (
    <article className="case lab">
      <div className="case-head">
        <p className="case-meta case-in">
          <span className="case-type">{fill(l.count, { n: DEMOS.length })}</span>
        </p>
        <h1 className="case-title">{l.heading}</h1>
        <p className="case-lead case-in" style={{ '--d': '80ms' }}>{l.intro}</p>
        {calm && <p className="lab-calm case-in" style={{ '--d': '120ms' }}>{l.reduced}</p>}
      </div>

      <div className="lab-layout">
        {/* Stays on screen: on the left on a wide screen, a bar on top on a phone */}
        <aside className="lab-side" aria-label={l.filters}>
          <div className="lab-side-wide">{search('lab-search-side')}</div>
          <div className="lab-filters" role="group" aria-label={l.filter_label}>
            {cats.map((cat) => (
              <button key={cat} type="button" className="lab-chip" aria-pressed={filter === cat} onClick={() => setFilter(cat)}>
                <span className="lab-chip-name">{cat === 'all' ? l.all : l.cats[cat]}</span>
                <span className="lab-chip-count" aria-hidden="true">{countOf(cat)}</span>
              </button>
            ))}
          </div>
          {pause && <div className="lab-side-wide">{pause}</div>}
        </aside>

        <div className="lab-main" ref={mainRef}>
          <div className="lab-tools-narrow">
            {search('lab-search-top')}
            {pause}
          </div>
          <p className="sr-only" role="status">{fill(l.shown, { n: shown.length })}</p>

          <ul className="lab-grid" data-paused={paused ? '' : undefined}>
            {shown.map((demo) => <DemoCard key={demo.id} demo={demo} lang={lang} l={l} onCode={setCodeFor} />)}
          </ul>
          {shown.length === 0 && (
            <div className="lab-empty">
              <p>{fill(l.empty, { q: query.trim() })}</p>
              <button type="button" className="lab-action" onClick={() => setQuery('')}>{l.clear}</button>
            </div>
          )}
        </div>
      </div>

      <section className="case-cta" aria-labelledby="lab-cta">
        <h2 id="lab-cta" className="case-cta-title">{l.cta_title}</h2>
        <p>{l.cta_text}</p>
        <a href="/#contact" className="btn btn-primary" data-magnetic>{t.hero.cta_contact}</a>
      </section>

      {codeFor && <CodeDialog demo={codeFor} lang={lang} l={l} onClose={() => setCodeFor(null)} />}
    </article>
  )
}
