import { useEffect, useRef, useState } from 'react'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key])

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Real numbers from this very visit, read from the browser's Performance API.
function readPerformance() {
  const nav = performance.getEntriesByType?.('navigation')?.[0]
  if (!nav || !nav.loadEventEnd) return null
  const resources = performance.getEntriesByType('resource')
  const bytes = resources.reduce((sum, r) => sum + (r.encodedBodySize || 0), nav.encodedBodySize || 0)
  return { loadMs: nav.loadEventEnd, bytes, requests: resources.length + 1 }
}

// Counts up to the value when it scrolls into view. Screen readers get the
// final value straight away.
function CountUp({ value, format }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => (reducedMotion() ? value : 0))

  useEffect(() => {
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      setShown(value)
      return undefined
    }
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 900)
        setShown(value * (1 - (1 - progress) ** 3))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <>
      <span ref={ref} aria-hidden="true">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}

export default function Proof({ t, lang, langChosen }) {
  const p = t.proof
  const [audit, setAudit] = useState({ status: 'idle' })
  const [perf, setPerf] = useState(null)

  useEffect(() => {
    // loadEventEnd is only set once the load event has finished.
    const measure = () => setTimeout(() => setPerf(readPerformance()), 0)
    if (document.readyState === 'complete') measure()
    else window.addEventListener('load', measure, { once: true })
    return () => window.removeEventListener('load', measure)
  }, [])

  const runAudit = async () => {
    if (audit.status === 'running') return
    setAudit({ status: 'running' })
    try {
      // axe-core is only downloaded when someone asks for the audit.
      const { default: axe } = await import('axe-core')
      const start = performance.now()
      const results = await axe.run(document, {
        runOnly: { type: 'tag', values: WCAG_TAGS },
        resultTypes: ['violations'],
      })
      setAudit({
        status: 'done',
        violations: results.violations,
        rules: results.passes.length + results.violations.length + results.incomplete.length,
        ms: performance.now() - start,
      })
    } catch {
      setAudit({ status: 'error' })
    }
  }

  const number = (value, digits = 0) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
  const seconds = (ms) => `${number(ms / 1000, 2)} s`
  const issueLabel = (count) => (new Intl.PluralRules(lang).select(count) === 'one' ? p.issue_one : p.issue_other)

  return (
    <section id="proof">
      <div className="section-head" data-reveal>
        <h2 className="section-title">{p.title}</h2>
        <p className="section-intro">{p.intro}</p>
      </div>

      <ul className="proof-grid">
        <li className="proof-card proof-audit" data-reveal>
          <p className="proof-label">{p.a11y_label}</p>
          <p className="proof-text">{p.a11y_text}</p>

          <div className="proof-console" aria-live="polite">
            {audit.status === 'idle' && <p className="console-line console-muted">axe.run(document)</p>}
            {audit.status === 'running' && <p className="console-line console-running">{p.a11y_running}</p>}
            {audit.status === 'done' && (
              <>
                <p className={`console-result${audit.violations.length ? ' has-issues' : ''}`}>
                  <span className="console-number">{audit.violations.length}</span> {issueLabel(audit.violations.length)}
                </p>
                <p className="console-line console-muted">
                  {fill(p.a11y_rules, { n: audit.rules, s: seconds(audit.ms) })}
                </p>
                {audit.violations.length > 0 && (
                  <ul className="console-issues">
                    {audit.violations.map((v) => <li key={v.id}>{v.id} ({v.nodes.length})</li>)}
                  </ul>
                )}
              </>
            )}
            {audit.status === 'error' && <p className="console-line console-error">{p.a11y_error}</p>}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-small proof-button"
            onClick={runAudit}
            // aria-disabled rather than disabled: a disabled button would
            // drop keyboard focus while the audit runs
            aria-disabled={audit.status === 'running' || undefined}
          >
            {audit.status === 'done' ? p.a11y_again : p.a11y_button}
          </button>
        </li>

        <li className="proof-card" data-reveal style={{ '--reveal-delay': '90ms' }}>
          <p className="proof-label">{p.perf_label}</p>
          {perf ? (
            <>
              <p className="proof-big">
                <CountUp value={perf.loadMs} format={seconds} />
              </p>
              <p className="proof-text">{p.perf_load}</p>
              <ul className="proof-facts">
                <li>{fill(p.perf_weight, { kb: number(Math.round(perf.bytes / 1024)) })}</li>
                <li>{fill(p.perf_requests, { n: perf.requests })}</li>
              </ul>
            </>
          ) : (
            <p className="proof-big proof-pending" aria-hidden="true">{seconds(0)}</p>
          )}
          <p className="proof-note">{p.perf_text}</p>
        </li>

        <li className="proof-card" data-reveal style={{ '--reveal-delay': '180ms' }}>
          <p className="proof-label">{p.you_label}</p>
          <ul className="proof-checks">
            <li><IconCheck />{reducedMotion() ? p.you_motion_off : p.you_motion_on}</li>
            <li><IconCheck />{langChosen ? p.you_lang_chosen : p.you_lang_auto}</li>
            <li><IconCheck />{p.you_keyboard}</li>
          </ul>
        </li>
      </ul>
    </section>
  )
}
