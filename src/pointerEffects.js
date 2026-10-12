// Small effects that follow the mouse. Only switched on for a precise
// pointer (mouse or trackpad) and when the visitor has not asked to reduce
// motion; touch screens and keyboard users get the page without them.
// - Cards: a light on their border follows the pointer (--mx, --my; the
//   drawing is in App.css, "Pointer effects").
// - Buttons marked data-magnetic lean towards the pointer when it is close.

const CARDS = '.project-card, .service-card, .proof-card, .case-next-link, .case-details'
const MAGNET_PULL = 0.3
const MAGNET_MAX = 8
const MAGNET_REACH = 14

export function startPointerEffects() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || reduceMotion) return () => {}

  const root = document.documentElement
  root.classList.add('fx-pointer')
  const pulled = new Map() // magnetic element -> its current offset
  let frame = 0
  let last = null

  const update = () => {
    frame = 0
    if (!last) return
    const { x, y, target } = last

    const card = target instanceof Element ? target.closest(CARDS) : null
    if (card) {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${(x - r.left).toFixed(1)}px`)
      card.style.setProperty('--my', `${(y - r.top).toFixed(1)}px`)
    }

    for (const el of document.querySelectorAll('[data-magnetic]')) {
      // Measured where the element sits without its current pull, so the
      // pull does not feed back into itself.
      const offset = pulled.get(el) || { x: 0, y: 0 }
      const r = el.getBoundingClientRect()
      const left = r.left - offset.x
      const top = r.top - offset.y
      const near = x > left - MAGNET_REACH && x < left + r.width + MAGNET_REACH
        && y > top - MAGNET_REACH && y < top + r.height + MAGNET_REACH
      if (near) {
        const clamp = (v) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v))
        const next = {
          x: clamp((x - (left + r.width / 2)) * MAGNET_PULL),
          y: clamp((y - (top + r.height / 2)) * MAGNET_PULL),
        }
        pulled.set(el, next)
        el.style.translate = `${next.x.toFixed(1)}px ${next.y.toFixed(1)}px`
      } else if (pulled.has(el)) {
        pulled.delete(el)
        el.style.translate = ''
      }
    }
  }

  const handleMove = (e) => {
    last = { x: e.clientX, y: e.clientY, target: e.target }
    if (!frame) frame = requestAnimationFrame(update)
  }

  const release = () => {
    last = null
    for (const el of pulled.keys()) el.style.translate = ''
    pulled.clear()
  }

  window.addEventListener('pointermove', handleMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', release)
  window.addEventListener('scroll', release, { passive: true })

  return () => {
    cancelAnimationFrame(frame)
    release()
    root.classList.remove('fx-pointer')
    window.removeEventListener('pointermove', handleMove)
    document.documentElement.removeEventListener('pointerleave', release)
    window.removeEventListener('scroll', release)
  }
}
