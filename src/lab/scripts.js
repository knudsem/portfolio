// The behaviours of the lab's demos. Each one takes the element that holds
// the demo and returns a function that undoes it. Marked per demo: the lab
// shows each region as the demo's JavaScript.

/* demo:btn-fill */
// The fill starts where the pointer comes in and leaves where it goes out.
// From the keyboard, it grows from the middle.
export function fillFromPointer(root) {
  const button = root.querySelector('.lb-fill')
  const place = (e) => {
    const box = button.getBoundingClientRect()
    button.style.setProperty('--x', `${e.clientX - box.left}px`)
    button.style.setProperty('--y', `${e.clientY - box.top}px`)
  }
  const centre = () => {
    if (button.matches(':hover')) return
    button.style.setProperty('--x', '50%')
    button.style.setProperty('--y', '50%')
  }
  button.addEventListener('pointerenter', place)
  button.addEventListener('pointerleave', place)
  button.addEventListener('focus', centre)
  return () => {
    button.removeEventListener('pointerenter', place)
    button.removeEventListener('pointerleave', place)
    button.removeEventListener('focus', centre)
  }
}
/* /demo */

/* demo:btn-magnetic */
// The button leans towards the pointer while it is in the zone around it,
// and springs back when it leaves. Only for a mouse or a trackpad, and
// never when motion is reduced.
export function magnetic(root) {
  const zone = root.querySelector('.lb-magnet-zone')
  const button = zone.querySelector('.lb-magnet')
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || calm) return () => {}

  let frame = 0
  const move = (e) => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      // measured on the zone, which does not move, so the pull stays steady
      const box = zone.getBoundingClientRect()
      const x = e.clientX - (box.left + box.width / 2)
      const y = e.clientY - (box.top + box.height / 2)
      button.style.setProperty('--mx', `${x * 0.35}px`)
      button.style.setProperty('--my', `${y * 0.35}px`)
    })
  }
  const reset = () => {
    cancelAnimationFrame(frame)
    button.style.setProperty('--mx', '0px')
    button.style.setProperty('--my', '0px')
  }
  zone.addEventListener('pointermove', move)
  zone.addEventListener('pointerleave', reset)
  return () => {
    reset()
    zone.removeEventListener('pointermove', move)
    zone.removeEventListener('pointerleave', reset)
  }
}
/* /demo */

/* demo:btn-send */
// Sending, then sent, then back to normal. The status line tells screen
// readers what the animation shows.
export function sendButton(root) {
  const button = root.querySelector('.lb-send')
  const status = root.querySelector('.lb-send-status')
  let timers = []
  const send = () => {
    if (button.dataset.state) return
    button.dataset.state = 'sending'
    timers = [
      setTimeout(() => {
        button.dataset.state = 'sent'
        status.textContent = 'Message sent'
      }, 800),
      setTimeout(() => {
        delete button.dataset.state
        status.textContent = ''
      }, 3200),
    ]
  }
  button.addEventListener('click', send)
  return () => {
    timers.forEach(clearTimeout)
    button.removeEventListener('click', send)
  }
}
/* /demo */

/* demo:btn-like */
// A toggle button: its state is aria-pressed, which also drives the CSS
export function likeButton(root) {
  const button = root.querySelector('.lb-like')
  const toggle = () => {
    const on = button.getAttribute('aria-pressed') === 'true'
    button.setAttribute('aria-pressed', String(!on))
  }
  button.addEventListener('click', toggle)
  return () => button.removeEventListener('click', toggle)
}
/* /demo */

/* demo:btn-download */
// Loading, then done with a tick, then back. The label is a polite live
// region, so screen readers hear each step.
export function downloadButton(root) {
  const button = root.querySelector('.lb-dl')
  const text = button.querySelector('.lb-dl-text')
  const icon = button.querySelector('svg path')
  const arrow = icon.getAttribute('d')
  let timers = []
  const start = () => {
    if (button.dataset.state) return
    button.dataset.state = 'loading'
    text.textContent = 'Downloading'
    timers = [
      setTimeout(() => {
        button.dataset.state = 'done'
        text.textContent = 'Done'
        icon.setAttribute('d', 'M5 12.5l4.5 4.5L19 7.5')
      }, 1900),
      setTimeout(() => {
        delete button.dataset.state
        text.textContent = 'Download'
        icon.setAttribute('d', arrow)
      }, 4300),
    ]
  }
  button.addEventListener('click', start)
  return () => {
    timers.forEach(clearTimeout)
    button.removeEventListener('click', start)
  }
}
/* /demo */

/* demo:scroll-progress */
// Only for browsers that cannot play scroll-driven animations yet: the same
// bar, from the scroll position, once per frame at most.
export function readingProgress(root) {
  if (CSS.supports('animation-timeline: scroll()')) return () => {}
  const box = root.querySelector('.lb-read')
  const bar = box.querySelector('.lb-read-bar')
  let frame = 0
  const update = () => {
    frame = 0
    const max = box.scrollHeight - box.clientHeight
    bar.style.setProperty('--p', max > 0 ? box.scrollTop / max : 0)
  }
  const request = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  box.addEventListener('scroll', request, { passive: true })
  update()
  return () => {
    cancelAnimationFrame(frame)
    box.removeEventListener('scroll', request)
  }
}
/* /demo */

/* demo:text-scramble */
// Random glyphs settle into the real words, left to right. The words are
// also in a hidden copy, so screen readers never hear the noise.
export function scramble(root) {
  const el = root.querySelector('.lb-scramble')
  const text = el.dataset.text
  const glyphs = '#%*+=?@$ABCDEFXYZ0123456789'
  el.replaceChildren()
  const words = document.createElement('span')
  words.className = 'lb-scramble-sr'
  words.textContent = text
  const shown = document.createElement('span')
  shown.setAttribute('aria-hidden', 'true')
  el.append(words, shown)

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.textContent = text
    return () => {}
  }

  const start = performance.now()
  const end = 400 + text.length * 45
  let frame = 0
  let last = 0
  const draw = (now) => {
    const t = now - start
    if (now - last > 50 || t >= end) {
      last = now
      shown.replaceChildren(...[...text].map((ch, i) => {
        if (ch === ' ' || t >= 400 + i * 45) return document.createTextNode(ch)
        const noise = document.createElement('span')
        noise.textContent = glyphs[Math.floor(Math.random() * glyphs.length)]
        return noise
      }))
    }
    if (t < end) frame = requestAnimationFrame(draw)
  }
  frame = requestAnimationFrame(draw)
  return () => cancelAnimationFrame(frame)
}
/* /demo */

/* demo:card-tilt */
// The card turns towards the pointer, up to 10 degrees, and the glare
// follows it. Only for a mouse or a trackpad, never when motion is reduced.
export function tilt(root) {
  const scene = root.querySelector('.lb-tilt')
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || calm) return () => {}

  const move = (e) => {
    const box = scene.getBoundingClientRect()
    const px = (e.clientX - box.left) / box.width
    const py = (e.clientY - box.top) / box.height
    scene.style.setProperty('--ry', `${(px - 0.5) * 20}deg`)
    scene.style.setProperty('--rx', `${(0.5 - py) * 20}deg`)
    scene.style.setProperty('--gx', `${px * 100}%`)
    scene.style.setProperty('--gy', `${py * 100}%`)
  }
  const reset = () => {
    scene.style.setProperty('--rx', '0deg')
    scene.style.setProperty('--ry', '0deg')
  }
  scene.addEventListener('pointermove', move)
  scene.addEventListener('pointerleave', reset)
  return () => {
    reset()
    scene.removeEventListener('pointermove', move)
    scene.removeEventListener('pointerleave', reset)
  }
}
/* /demo */

/* demo:card-spotlight */
// The light on the border follows the pointer
export function spotlight(root) {
  const card = root.querySelector('.lb-spot')
  const move = (e) => {
    const box = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - box.left}px`)
    card.style.setProperty('--y', `${e.clientY - box.top}px`)
  }
  card.addEventListener('pointermove', move)
  return () => card.removeEventListener('pointermove', move)
}
/* /demo */

/* demo:card-flip */
// Click, tap or Enter turns the card over: a toggle button (aria-pressed)
export function flipCard(root) {
  const card = root.querySelector('.lb-flip')
  const flip = () => {
    const on = card.getAttribute('aria-pressed') === 'true'
    card.setAttribute('aria-pressed', String(!on))
  }
  card.addEventListener('click', flip)
  return () => card.removeEventListener('click', flip)
}
/* /demo */

/* demo:toggle-daynight */
// A switch: its state is aria-checked, which also drives the CSS
export function dayNight(root) {
  const toggle = root.querySelector('.lb-dn')
  const flip = () => {
    const on = toggle.getAttribute('aria-checked') === 'true'
    toggle.setAttribute('aria-checked', String(!on))
  }
  toggle.addEventListener('click', flip)
  return () => toggle.removeEventListener('click', flip)
}
/* /demo */

export const SCRIPTS = {
  'btn-fill': fillFromPointer,
  'btn-magnetic': magnetic,
  'btn-send': sendButton,
  'btn-like': likeButton,
  'btn-download': downloadButton,
  'scroll-progress': readingProgress,
  'text-scramble': scramble,
  'card-tilt': tilt,
  'card-spotlight': spotlight,
  'card-flip': flipCard,
  'toggle-daynight': dayNight,
}
