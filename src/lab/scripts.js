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

/* demo:btn-ripple */
// A wave from the point of the click; from the keyboard (no pointer
// position), from the middle. Each wave removes itself when it is done.
export function ripple(root) {
  const button = root.querySelector('.lb-ripple')
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const wave = (e) => {
    if (calm) return
    const box = button.getBoundingClientRect()
    const fromKeys = e.detail === 0
    const x = fromKeys ? box.width / 2 : e.clientX - box.left
    const y = fromKeys ? box.height / 2 : e.clientY - box.top
    // big enough to cover the far corner
    const size = 2 * Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y))
    const span = document.createElement('span')
    span.className = 'lb-ripple-wave'
    span.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`
    span.addEventListener('animationend', () => span.remove())
    button.append(span)
  }
  button.addEventListener('click', wave)
  return () => button.removeEventListener('click', wave)
}
/* /demo */

/* demo:btn-copy */
// Copies the command; the tick shows for a moment and "Copied" is
// announced. If the browser refuses (no permission), says so.
export function copyButton(root) {
  const box = root.querySelector('.lb-copy')
  const button = box.querySelector('button')
  const status = box.querySelector('.lb-copy-status')
  let timer = 0
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(box.querySelector('code').textContent)
      box.setAttribute('data-copied', '')
      status.textContent = 'Copied'
    } catch {
      status.textContent = 'Copy is blocked here'
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      box.removeAttribute('data-copied')
      status.textContent = ''
    }, 1800)
  }
  button.addEventListener('click', copy)
  return () => {
    clearTimeout(timer)
    button.removeEventListener('click', copy)
  }
}
/* /demo */

/* demo:btn-loading */
// Idle, busy (aria-busy), done, then back to idle. A fake save stands in
// for the real request.
export function savingButton(root) {
  const button = root.querySelector('.lb-load')
  const status = root.querySelector('.lb-load-status')
  const timers = []
  const save = () => {
    if (button.dataset.state) return
    button.dataset.state = 'busy'
    button.setAttribute('aria-busy', 'true')
    status.textContent = 'Saving'
    timers.push(setTimeout(() => {
      button.dataset.state = 'done'
      button.removeAttribute('aria-busy')
      status.textContent = 'Saved'
    }, 1600))
    timers.push(setTimeout(() => {
      delete button.dataset.state
      status.textContent = ''
    }, 3400))
  }
  button.addEventListener('click', save)
  return () => {
    timers.forEach(clearTimeout)
    button.removeEventListener('click', save)
  }
}
/* /demo */

/* demo:icon-burger */
// The button says whether the menu is open (aria-expanded); the CSS reads it
export function burger(root) {
  const button = root.querySelector('.lb-burger')
  const toggle = () => button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'))
  button.addEventListener('click', toggle)
  return () => button.removeEventListener('click', toggle)
}
/* /demo */

/* demo:icon-play */
// A toggle: pressed means playing, and the shape follows aria-pressed
export function playPause(root) {
  const button = root.querySelector('.lb-play')
  const toggle = () => button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'))
  button.addEventListener('click', toggle)
  return () => button.removeEventListener('click', toggle)
}
/* /demo */

/* demo:icon-cart */
// Adds an item: the hop and the bump are CSS animations started by
// data-adding; the count changes when the item lands.
export function addToCart(root) {
  const cart = root.querySelector('.lb-cart')
  const button = cart.querySelector('.lb-cart-add')
  const count = cart.querySelector('.lb-cart-count')
  const status = cart.querySelector('.lb-cart-status')
  let items = 0
  let timer = 0
  const add = () => {
    items += 1
    cart.removeAttribute('data-adding')
    void cart.offsetWidth // restart the animations on a quick second click
    cart.setAttribute('data-adding', '')
    clearTimeout(timer)
    timer = setTimeout(() => { count.textContent = items }, 550)
    status.textContent = `${items} ${items === 1 ? 'item' : 'items'} in the cart`
  }
  button.addEventListener('click', add)
  return () => {
    clearTimeout(timer)
    button.removeEventListener('click', add)
  }
}
/* /demo */

/* demo:text-counter */
// Counts up once the number comes into view: fast, then slower (ease out).
// With reduced motion, shows the final number at once.
export function counter(root) {
  const el = root.querySelector('.lb-count-num')
  const to = Number(el.dataset.to)
  const format = new Intl.NumberFormat('en')
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  let frame = 0
  const run = () => {
    if (calm) { el.textContent = format.format(to); return }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / 1600, 1)
      el.textContent = format.format(Math.round(to * (1 - (1 - t) ** 4)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    run()
  })
  observer.observe(el)
  return () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
  }
}
/* /demo */

/* demo:card-pricing */
// The radio buttons choose the billing; the price rolls out and the new
// one rolls in (Web Animations), or simply changes with reduced motion
export function pricing(root) {
  const box = root.querySelector('.lb-pricing')
  const amount = box.querySelector('.lb-pricing-amount')
  const note = box.querySelector('.lb-pricing-note')
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const change = async (e) => {
    const yearly = e.target.value === 'year'
    const show = () => {
      amount.textContent = `$${yearly ? amount.dataset.year : amount.dataset.month}`
      note.textContent = yearly ? 'Billed yearly, save 20%' : 'Billed monthly'
    }
    if (calm) return show()
    await amount.animate([{ translate: '0 0', opacity: 1 }, { translate: '0 -40%', opacity: 0 }], { duration: 160, easing: 'ease-in' }).finished
    show()
    amount.animate([{ translate: '0 40%', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' })
  }
  box.addEventListener('change', change)
  return () => box.removeEventListener('change', change)
}
/* /demo */

/* demo:card-gallery */
// A click (or Enter) chooses a panel; pointing only previews
export function gallery(root) {
  const panels = [...root.querySelectorAll('.lb-gallery-panel')]
  const choose = (e) => panels.forEach((panel) => panel.setAttribute('aria-pressed', String(panel === e.currentTarget)))
  panels.forEach((panel) => panel.addEventListener('click', choose))
  return () => panels.forEach((panel) => panel.removeEventListener('click', choose))
}
/* /demo */

/* demo:nav-tabs */
// Tabs as the ARIA pattern describes them: one tab in the tab order, arrow
// keys to move, Home and End, and the line placed under the chosen tab
export function tabs(root) {
  const list = root.querySelector('.lb-tabs-list')
  const all = [...list.querySelectorAll('[role="tab"]')]
  const ink = list.querySelector('.lb-tabs-ink')
  const place = (tab) => {
    ink.style.setProperty('--x', `${tab.offsetLeft}px`)
    ink.style.setProperty('--w', `${tab.offsetWidth}px`)
  }
  const select = (tab) => {
    all.forEach((other) => {
      const on = other === tab
      other.setAttribute('aria-selected', String(on))
      other.tabIndex = on ? 0 : -1
      root.querySelector(`#${other.getAttribute('aria-controls')}`).hidden = !on
    })
    place(tab)
  }
  const click = (e) => {
    const tab = e.target.closest('[role="tab"]')
    if (tab) select(tab)
  }
  const keys = (e) => {
    const i = all.indexOf(document.activeElement)
    if (i < 0) return
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const tab = all[(next + all.length) % all.length]
    tab.focus()
    select(tab)
  }
  // placed again whenever the tabs change size (fonts arriving, resizing)
  const resize = new ResizeObserver(() => place(all.find((tab) => tab.getAttribute('aria-selected') === 'true')))
  resize.observe(list)
  list.addEventListener('click', click)
  list.addEventListener('keydown', keys)
  return () => {
    resize.disconnect()
    list.removeEventListener('click', click)
    list.removeEventListener('keydown', keys)
  }
}
/* /demo */

/* demo:nav-underline */
// The line goes under the link pointed at or focused, and back to the
// current page's link when the pointer or the focus leaves the menu
export function slidingUnderline(root) {
  const nav = root.querySelector('.lb-navline')
  const ink = nav.querySelector('.lb-navline-ink')
  const links = [...nav.querySelectorAll('a')]
  const current = () => links.find((link) => link.getAttribute('aria-current') === 'page')
  // the line spans the link's text, inside its padding
  const place = (link) => {
    const pad = parseFloat(getComputedStyle(link).paddingLeft)
    ink.style.setProperty('--x', `${link.offsetLeft + pad}px`)
    ink.style.setProperty('--w', `${link.offsetWidth - 2 * pad}px`)
  }
  const follow = (e) => {
    const link = e.target.closest('a')
    if (link) place(link)
  }
  const back = (e) => {
    if (!nav.contains(e.relatedTarget)) place(current())
  }
  // a demo: the links choose the current page instead of leaving
  const choose = (e) => {
    const link = e.target.closest('a')
    if (!link) return
    e.preventDefault()
    links.forEach((other) => other.toggleAttribute('aria-current', other === link))
    link.setAttribute('aria-current', 'page')
    place(link)
  }
  const resize = new ResizeObserver(() => place(current()))
  resize.observe(nav)
  nav.addEventListener('pointerover', follow)
  nav.addEventListener('focusin', follow)
  nav.addEventListener('pointerleave', back)
  nav.addEventListener('focusout', back)
  nav.addEventListener('click', choose)
  return () => {
    resize.disconnect()
    nav.removeEventListener('pointerover', follow)
    nav.removeEventListener('focusin', follow)
    nav.removeEventListener('pointerleave', back)
    nav.removeEventListener('focusout', back)
    nav.removeEventListener('click', choose)
  }
}
/* /demo */

/* demo:nav-slides */
// A dot shows its slide; the arrow keys move between the dots
export function slides(root) {
  const track = root.querySelector('.lb-slides-track')
  const dots = [...root.querySelectorAll('.lb-slides-dots button')]
  const show = (i) => {
    track.style.setProperty('--index', i)
    dots.forEach((dot, j) => (j === i ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')))
  }
  const click = (e) => {
    const i = dots.indexOf(e.target.closest('button'))
    if (i >= 0) show(i)
  }
  const keys = (e) => {
    const i = dots.indexOf(document.activeElement)
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (i < 0 || !step) return
    const next = (i + step + dots.length) % dots.length
    dots[next].focus()
    show(next)
  }
  const group = root.querySelector('.lb-slides-dots')
  group.addEventListener('click', click)
  group.addEventListener('keydown', keys)
  return () => {
    group.removeEventListener('click', click)
    group.removeEventListener('keydown', keys)
  }
}
/* /demo */

/* demo:nav-menu */
// A disclosure: the button opens and closes the list (aria-expanded);
// Escape or a click outside closes it and the focus returns to the button
export function dropdown(root) {
  const menu = root.querySelector('.lb-menu')
  const button = menu.querySelector('.lb-menu-button')
  const open = () => button.getAttribute('aria-expanded') === 'true'
  const set = (on) => button.setAttribute('aria-expanded', String(on))
  const toggle = () => set(!open())
  const keys = (e) => {
    if (e.key === 'Escape' && open()) {
      set(false)
      button.focus()
    }
  }
  const outside = (e) => {
    if (open() && !menu.contains(e.target)) set(false)
  }
  // a demo: the links close the menu instead of leaving
  const pick = (e) => {
    if (!e.target.closest('a')) return
    e.preventDefault()
    set(false)
    button.focus()
  }
  button.addEventListener('click', toggle)
  menu.addEventListener('keydown', keys)
  menu.addEventListener('click', pick)
  document.addEventListener('pointerdown', outside)
  return () => {
    button.removeEventListener('click', toggle)
    menu.removeEventListener('keydown', keys)
    menu.removeEventListener('click', pick)
    document.removeEventListener('pointerdown', outside)
  }
}
/* /demo */

/* demo:input-password */
// Shows or hides the password; the eye blinks at each change
export function showPassword(root) {
  const input = root.querySelector('.lb-pass input')
  const button = root.querySelector('.lb-pass button')
  let timer = 0
  const toggle = () => {
    const show = input.type === 'password'
    input.type = show ? 'text' : 'password'
    button.setAttribute('aria-pressed', String(show))
    button.setAttribute('data-blink', '')
    clearTimeout(timer)
    timer = setTimeout(() => button.removeAttribute('data-blink'), 260)
  }
  button.addEventListener('click', toggle)
  return () => {
    clearTimeout(timer)
    button.removeEventListener('click', toggle)
  }
}
/* /demo */

/* demo:input-otp */
// One digit per box: typing moves on, Backspace on an empty box moves
// back, a paste fills them all. Complete: the boxes light up, and it is said.
export function oneTimeCode(root) {
  const box = root.querySelector('.lb-otp')
  const inputs = [...box.querySelectorAll('input')]
  const status = box.querySelector('.lb-otp-status')
  const check = () => {
    const done = inputs.every((input) => /^\d$/.test(input.value))
    box.toggleAttribute('data-done', done)
    status.textContent = done ? 'Code complete' : ''
  }
  const input = (e) => {
    const i = inputs.indexOf(e.target)
    e.target.value = e.target.value.replace(/\D/g, '').slice(-1)
    if (e.target.value && i < inputs.length - 1) inputs[i + 1].focus()
    check()
  }
  const keydown = (e) => {
    const i = inputs.indexOf(e.target)
    if (e.key === 'Backspace' && !e.target.value && i > 0) inputs[i - 1].focus()
  }
  const paste = (e) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, inputs.length)
    if (!digits) return
    e.preventDefault()
    inputs.forEach((input, i) => { input.value = digits[i] ?? '' })
    inputs[Math.min(digits.length, inputs.length - 1)].focus()
    check()
  }
  box.addEventListener('input', input)
  box.addEventListener('keydown', keydown)
  box.addEventListener('paste', paste)
  return () => {
    box.removeEventListener('input', input)
    box.removeEventListener('keydown', keydown)
    box.removeEventListener('paste', paste)
  }
}
/* /demo */

/* demo:input-range */
// The value drives the fill and the bubble (--v), and the bubble's text
export function rangeBubble(root) {
  const track = root.querySelector('.lb-range-track')
  const input = track.querySelector('input')
  const output = track.querySelector('output')
  const update = () => {
    track.style.setProperty('--v', input.value)
    output.textContent = input.value
  }
  input.addEventListener('input', update)
  return () => input.removeEventListener('input', update)
}
/* /demo */

/* demo:fb-confetti */
// Thirty pieces, each given a random direction, distance, spin and colour;
// each removes itself at the end. Nothing with reduced motion.
export function confetti(root) {
  const box = root.querySelector('.lb-confetti')
  const button = box.querySelector('button')
  const colours = ['#c5f04a', '#4ae0d2', '#8f6bff', '#ff9a62', '#ff5f7e', '#ffd36e']
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const burst = () => {
    if (calm) return
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('i')
      const angle = (i / 30) * Math.PI * 2 + Math.random() * 0.4
      const reach = 60 + Math.random() * 70
      piece.style.cssText = `--x:${Math.cos(angle) * reach}px;--y:${Math.sin(angle) * reach - 40}px;--r:${Math.round(Math.random() * 720 - 360)}deg;--c:${colours[i % colours.length]};animation-delay:${Math.random() * 0.08}s`
      piece.addEventListener('animationend', () => piece.remove())
      box.append(piece)
    }
  }
  button.addEventListener('click', burst)
  return () => button.removeEventListener('click', burst)
}
/* /demo */

/* demo:fb-shake */
// Checks the email on submit: if wrong, says why, shakes the row and
// focuses the field; if right, thanks
export function shakeOnError(root) {
  const form = root.querySelector('.lb-shake')
  const input = form.querySelector('input')
  const message = form.querySelector('.lb-shake-message')
  let timer = 0
  const submit = (e) => {
    e.preventDefault()
    const value = input.value.trim()
    const error = !value ? 'Please enter your email.' : !input.checkValidity() ? 'This email looks incomplete.' : ''
    input.setAttribute('aria-invalid', String(Boolean(error)))
    message.toggleAttribute('data-ok', !error)
    message.textContent = error || 'Thanks, you are in.'
    if (!error) return
    form.removeAttribute('data-shake')
    void form.offsetWidth // restart the shake on a second try
    form.setAttribute('data-shake', '')
    input.focus()
    clearTimeout(timer)
    timer = setTimeout(() => form.removeAttribute('data-shake'), 500)
  }
  form.addEventListener('submit', submit)
  return () => {
    clearTimeout(timer)
    form.removeEventListener('submit', submit)
  }
}
/* /demo */

/* demo:fb-steps */
// Back and Next move between three steps: the line, the ticks and
// aria-current follow
export function steps(root) {
  const list = root.querySelector('.lb-steps-list')
  const items = [...list.children]
  const [back, next] = root.querySelectorAll('.lb-steps-actions button')
  let step = 0
  const show = () => {
    list.style.setProperty('--step', step)
    items.forEach((item, i) => {
      item.toggleAttribute('data-done', i < step)
      if (i === step) item.setAttribute('aria-current', 'step')
      else item.removeAttribute('aria-current')
    })
    back.disabled = step === 0
    next.disabled = step === items.length - 1
  }
  const move = (e) => {
    step = Math.min(Math.max(step + Number(e.currentTarget.dataset.step), 0), items.length - 1)
    show()
  }
  back.addEventListener('click', move)
  next.addEventListener('click', move)
  return () => {
    back.removeEventListener('click', move)
    next.removeEventListener('click', move)
  }
}
/* /demo */

/* demo:fb-tooltip */
// Escape hides the tip while it shows; it can show again on the next
// pointing or focus
export function tooltip(root) {
  const tip = root.querySelector('.lb-tip')
  const button = tip.querySelector('button')
  const showing = () => button.matches(':hover, :focus-visible') || tip.querySelector('[role="tooltip"]').matches(':hover')
  const keys = (e) => { if (e.key === 'Escape' && showing()) tip.setAttribute('data-dismissed', '') }
  const reset = () => tip.removeAttribute('data-dismissed')
  document.addEventListener('keydown', keys)
  button.addEventListener('focus', reset)
  button.addEventListener('pointerenter', reset)
  return () => {
    document.removeEventListener('keydown', keys)
    button.removeEventListener('focus', reset)
    button.removeEventListener('pointerenter', reset)
  }
}
/* /demo */

/* demo:arch-magnifier */
// With a mouse or a trackpad, the lens follows the pointer (its own path
// stops meanwhile); it goes back to its path when the pointer leaves
export function magnifier(root) {
  const box = root.querySelector('.lb-loupe')
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  const move = (e) => {
    const r = box.getBoundingClientRect()
    const x = Math.min(Math.max(e.clientX - r.left, 30), r.width - 30)
    const y = Math.min(Math.max(e.clientY - r.top, 30), r.height - 30)
    box.setAttribute('data-follow', '')
    box.style.setProperty('--lb-lx', `${x}px`)
    box.style.setProperty('--lb-ly', `${y}px`)
  }
  const leave = () => {
    box.removeAttribute('data-follow')
    box.style.removeProperty('--lb-lx')
    box.style.removeProperty('--lb-ly')
  }
  box.addEventListener('pointermove', move)
  box.addEventListener('pointerleave', leave)
  return () => {
    box.removeEventListener('pointermove', move)
    box.removeEventListener('pointerleave', leave)
  }
}
/* /demo */

/* demo:arch-globe */
// The figures are in the page from the start (for everyone, and without
// script); when they come into view, they count up to themselves
export function globeFigures(root) {
  const figures = [...root.querySelectorAll('.lb-globe-stat strong')]
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  let frame = 0
  const run = () => {
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / 1400, 1)
      figures.forEach((el) => { el.textContent = Math.round(el.dataset.to * (1 - (1 - t) ** 3)) })
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    run()
  })
  observer.observe(root.querySelector('.lb-globe-band'))
  return () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
  }
}
/* /demo */

/* demo:arch-rings */
// The button opens and closes the rings (aria-expanded, and its label);
// Escape closes them and puts the focus back on the button
export function cornerRings(root) {
  const nav = root.querySelector('.lb-rings')
  const button = nav.querySelector('button')
  const set = (open) => {
    button.setAttribute('aria-expanded', String(open))
    button.querySelector('span').textContent = open ? 'Close' : 'Games'
  }
  const toggle = () => set(button.getAttribute('aria-expanded') !== 'true')
  const keys = (e) => {
    if (e.key !== 'Escape' || button.getAttribute('aria-expanded') !== 'true') return
    set(false)
    button.focus()
  }
  // a demo: a ring closes the menu instead of leaving
  const pick = (e) => {
    if (!e.target.closest('a')) return
    e.preventDefault()
    set(false)
    button.focus()
  }
  button.addEventListener('click', toggle)
  nav.addEventListener('keydown', keys)
  nav.addEventListener('click', pick)
  return () => {
    button.removeEventListener('click', toggle)
    nav.removeEventListener('keydown', keys)
    nav.removeEventListener('click', pick)
  }
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
  'btn-ripple': ripple,
  'btn-copy': copyButton,
  'btn-loading': savingButton,
  'icon-burger': burger,
  'icon-play': playPause,
  'icon-cart': addToCart,
  'text-counter': counter,
  'card-pricing': pricing,
  'card-gallery': gallery,
  'nav-tabs': tabs,
  'nav-underline': slidingUnderline,
  'nav-slides': slides,
  'nav-menu': dropdown,
  'input-password': showPassword,
  'input-otp': oneTimeCode,
  'input-range': rangeBubble,
  'fb-confetti': confetti,
  'fb-shake': shakeOnError,
  'fb-steps': steps,
  'fb-tooltip': tooltip,
  'arch-magnifier': magnifier,
  'arch-globe': globeFigures,
  'arch-rings': cornerRings,
}
