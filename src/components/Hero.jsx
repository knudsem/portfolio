import { useState, useRef, useEffect } from 'react'

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
)

// The highlighted word rises in letter by letter on load. Once it has
// settled it reacts to the visitor:
// - pointer arriving on it (or a finger tapping it): the letters jump one
//   after the other, squashing and stretching, and the underline redraws
// - mouse moving over it: the letters follow the pointer, the closest one
//   lifting the most
// Screen readers get the plain word, the animated letters are hidden from
// them. With "reduce motion" the load animation never runs, so none of
// this is switched on.
function AnimatedWord({ word }) {
  const [entered, setEntered] = useState(false)
  const [jumping, setJumping] = useState(false)
  const letterRefs = useRef([])
  const frame = useRef(0)
  const letters = [...word]

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const handleAnimationEnd = (e) => {
    // The underline is the last thing to finish on load.
    if (e.animationName === 'underline-draw') setEntered(true)
    if (e.animationName === 'letter-jump' && Number(e.target.dataset.index) === letters.length - 1) setJumping(false)
  }

  const jump = () => {
    if (entered && !jumping) setJumping(true)
  }

  const handlePointerMove = (e) => {
    if (!entered || e.pointerType !== 'mouse') return
    const x = e.clientX
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      for (const el of letterRefs.current) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const distance = Math.abs(x - (rect.left + rect.width / 2)) / rect.height
        el.style.setProperty('--lift', Math.max(0, 1 - distance * 1.2).toFixed(3))
      }
    })
  }

  const handlePointerLeave = () => {
    cancelAnimationFrame(frame.current)
    for (const el of letterRefs.current) el?.style.setProperty('--lift', '0')
  }

  return (
    <span
      className={`animated-word${entered ? ' is-entered' : ''}${jumping ? ' is-jumping' : ''}`}
      onPointerEnter={jump}
      onPointerDown={jump}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="sr-only">{word}</span>
      <span aria-hidden="true">
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { letterRefs.current[i] = el }}
            className="word-letter"
            style={{ '--i': i, '--tilt': i % 2 ? '-7deg' : '7deg' }}
          >
            <span className="word-letter-inner" data-index={i}>{letter}</span>
          </span>
        ))}
      </span>
      <svg className="word-underline" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M3 10 C 45 3, 120 2, 197 8" pathLength="1" />
      </svg>
    </span>
  )
}

export default function Hero({ t }) {
  const h = t.hero
  return (
    <div className="hero">
      <div className="availability-badge">
        <span className="pulse-dot" />
        {h.available}
      </div>

      <p className="hero-title">
        {h.title_start}{' '}
        <AnimatedWord key={h.title_accent} word={h.title_accent} />
        {h.title_end}
      </p>

      <p className="hero-text">{h.text}</p>

      <div className="hero-actions">
        <a href="#work" className="btn btn-primary">
          {h.cta_work}
          <IconArrow />
        </a>
        <a href="#contact" className="btn btn-secondary">{h.cta_contact}</a>
      </div>
    </div>
  )
}
