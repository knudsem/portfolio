import { useState } from 'react'

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
)

// The highlighted word rises in letter by letter, then waves when hovered.
// Screen readers get the plain word, the animated letters are hidden from them.
function AnimatedWord({ word }) {
  const [entered, setEntered] = useState(false)
  const [waving, setWaving] = useState(false)
  const letters = [...word]

  const handleAnimationEnd = (e) => {
    if (!e.target.classList.contains('word-letter') || Number(e.target.dataset.index) !== letters.length - 1) return
    if (e.animationName === 'letter-rise') setEntered(true)
    if (e.animationName === 'letter-wave') setWaving(false)
  }

  return (
    <span
      className={`animated-word${entered ? ' is-entered' : ''}${waving ? ' is-waving' : ''}`}
      onMouseEnter={() => entered && setWaving(true)}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="sr-only">{word}</span>
      <span aria-hidden="true">
        {letters.map((letter, i) => (
          <span key={i} className="word-letter" data-index={i} style={{ '--i': i }}>{letter}</span>
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
