import { useRef } from 'react'
import KineticHeadline from './KineticHeadline'

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
)

export default function Hero({ t }) {
  const h = t.hero
  // The whole hero is the play area: letters react as soon as the pointer
  // gets close to them, not only when it touches them.
  const zoneRef = useRef(null)

  return (
    <div className="hero" ref={zoneRef}>
      <div className="hero-top">
        <h1 className="hero-eyebrow">
          <span className="hero-name">Mathias Knudsen</span>
          <span className="hero-role">{t.title}</span>
        </h1>
        <div className="availability-badge">
          <span className="pulse-dot" />
          {h.available}
        </div>
      </div>

      <KineticHeadline
        key={h.title_accent}
        start={h.title_start}
        accent={h.title_accent}
        end={h.title_end}
        hintHover={h.hint_hover}
        hintTouch={h.hint_touch}
        zoneRef={zoneRef}
      />

      <div className="hero-bottom">
        <p className="hero-text">{h.text}</p>
        <div className="hero-actions">
          <a href="#work" className="btn btn-primary" data-magnetic>
            {h.cta_work}
            <IconArrow />
          </a>
          <a href="#contact" className="btn btn-secondary" data-magnetic>{h.cta_contact}</a>
        </div>
      </div>
    </div>
  )
}
