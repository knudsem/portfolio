import { Fragment, useEffect, useRef, useState } from 'react'

// The hero headline, as a small physics toy.
// - On load the letters rise in one by one, then the underline draws.
// - Mouse over the hero: letters are pushed away from the pointer and pulled
//   back to their place by a spring.
// - Click or tap: a shockwave throws the nearby letters, which bounce back.
// - Pointer arriving on the highlighted word: its letters jump one by one.
// Screen readers read the plain sentence; the letters are hidden from them.
// With "reduce motion" the load animation never runs and none of this is
// switched on.

const STIFFNESS = 0.1
const DAMPING = 0.82

function buildWords(start, accent, end) {
  const words = start.split(' ').filter(Boolean).map((w) => ({ plain: [...w], accent: [], after: [] }))
  words.push({ plain: [], accent: [...accent], after: [...end] })
  return words
}

export default function KineticHeadline({ start, accent, end, hintHover, hintTouch, zoneRef }) {
  const [entered, setEntered] = useState(false)
  const [jumping, setJumping] = useState(false)
  const [interacted, setInteracted] = useState(false)
  // Decided once, before the first paint, so the hint's space is reserved
  // from the start and nothing below it moves when it fades in.
  const [motionAllowed] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const containerRef = useRef(null)
  const lettersRef = useRef([])

  const words = buildWords(start, accent, end)
  const accentStart = words.slice(0, -1).reduce((n, w) => n + w.plain.length, 0)
  const lastAccent = accentStart + [...accent].length - 1
  let n = 0

  const handleAnimationEnd = (e) => {
    if (e.animationName === 'underline-draw') setEntered(true)
    if (e.animationName === 'letter-jump' && Number(e.target.dataset.n) === lastAccent) setJumping(false)
  }

  const jump = () => {
    if (entered && !jumping) setJumping(true)
  }

  useEffect(() => {
    if (!entered) return undefined
    const container = containerRef.current
    const zone = zoneRef?.current || container
    const letters = lettersRef.current.filter(Boolean).map((el) => ({ el, cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0 }))
    let em = 16
    let pointer = null
    let frame = 0

    // Rest position of each letter, relative to the headline. Transforms do
    // not move the centre of the box, so the current offset is subtracted.
    const measure = () => {
      const base = container.getBoundingClientRect()
      em = parseFloat(getComputedStyle(container).fontSize)
      for (const l of letters) {
        const r = l.el.getBoundingClientRect()
        l.cx = r.left + r.width / 2 - l.x - base.left
        l.cy = r.top + r.height / 2 - l.y - base.top
      }
    }

    const step = () => {
      frame = 0
      const base = container.getBoundingClientRect()
      const radius = em * 1.7
      const push = em * 0.32
      let moving = false
      for (const l of letters) {
        let tx = 0
        let ty = 0
        if (pointer) {
          const dx = l.cx - (pointer.x - base.left)
          const dy = l.cy - (pointer.y - base.top)
          const d = Math.hypot(dx, dy)
          if (d < radius && d > 0.01) {
            const force = (1 - d / radius) ** 2
            tx = (dx / d) * force * push
            ty = (dy / d) * force * push
          }
        }
        l.vx = (l.vx + (tx - l.x) * STIFFNESS) * DAMPING
        l.vy = (l.vy + (ty - l.y) * STIFFNESS) * DAMPING
        l.x += l.vx
        l.y += l.vy
        if (Math.abs(l.vx) + Math.abs(l.vy) + Math.abs(tx - l.x) + Math.abs(ty - l.y) > 0.04) moving = true
        l.el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0) rotate(${Math.max(-18, Math.min(18, l.x * 0.45)).toFixed(2)}deg)`
      }
      if (moving) frame = requestAnimationFrame(step)
    }

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step)
    }

    const handleMove = (e) => {
      if (e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY }
      setInteracted(true)
      kick()
    }

    const handleLeave = () => {
      pointer = null
      kick()
    }

    const handleDown = (e) => {
      // Buttons and links in the hero keep their normal behaviour.
      if (e.target.closest('a, button')) return
      const base = container.getBoundingClientRect()
      const px = e.clientX - base.left
      const py = e.clientY - base.top
      const radius = em * 3.2
      for (const l of letters) {
        const dx = l.cx - px
        const dy = l.cy - py
        const d = Math.hypot(dx, dy) || 1
        if (d < radius) {
          const force = (1 - d / radius) * em * 0.45
          l.vx += (dx / d) * force
          l.vy += (dy / d) * force - em * 0.05
        }
      }
      setInteracted(true)
      kick()
    }

    const handleScroll = () => { if (pointer) kick() }

    measure()
    document.fonts?.ready.then(measure)
    const resize = new ResizeObserver(measure)
    resize.observe(container)
    zone.addEventListener('pointermove', handleMove)
    zone.addEventListener('pointerleave', handleLeave)
    zone.addEventListener('pointerdown', handleDown)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      zone.removeEventListener('pointermove', handleMove)
      zone.removeEventListener('pointerleave', handleLeave)
      zone.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('scroll', handleScroll)
      for (const l of letters) l.el.style.transform = ''
    }
  }, [entered, zoneRef])

  const letter = (char, accentLetter) => {
    const i = n++
    return (
      <span
        key={i}
        ref={(el) => { lettersRef.current[i] = el }}
        className={`kw-letter${accentLetter ? ' is-accent' : ''}`}
        style={{ '--n': i, '--tilt': i % 2 ? '-7deg' : '7deg' }}
      >
        <span className="kw-inner" data-n={i}>{char}</span>
      </span>
    )
  }

  return (
    <>
      <p className="hero-title">
        <span className="sr-only">{`${start} ${accent}${end}`}</span>
        <span
          ref={containerRef}
          className={`kinetic${entered ? ' is-entered' : ''}`}
          aria-hidden="true"
          onAnimationEnd={handleAnimationEnd}
        >
          {words.map((word, wi) => (
            <Fragment key={wi}>
              {wi > 0 && ' '}
              <span className="kw-word">
                {word.plain.map((c) => letter(c, false))}
                {word.accent.length > 0 && (
                  <span
                    className={`kw-accent${jumping ? ' is-jumping' : ''}`}
                    style={{ '--first': accentStart }}
                    onPointerEnter={jump}
                    onPointerDown={jump}
                  >
                    {word.accent.map((c) => letter(c, true))}
                    <svg className="kw-underline" viewBox="0 0 200 14" preserveAspectRatio="none" focusable="false">
                      <path d="M3 10 C 45 3, 120 2, 197 8" pathLength="1" />
                    </svg>
                  </span>
                )}
                {word.after.map((c) => letter(c, false))}
              </span>
            </Fragment>
          ))}
        </span>
      </p>
      {motionAllowed && (
        <p className={`hero-hint${entered ? '' : ' is-waiting'}${interacted ? ' is-hidden' : ''}`} aria-hidden="true">
          <span className="hint-hover">{hintHover}</span>
          <span className="hint-touch">{hintTouch}</span>
        </p>
      )}
    </>
  )
}
