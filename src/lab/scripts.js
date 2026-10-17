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
  const colours = ['#ffd84a', '#fff3bf', '#e0a020', '#f2f2f5', '#ffd84a', '#c48f0f']
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
// The pointer (or a finger) takes the lens: its position, in the drawing's
// own units, goes to --lb-px and --lb-py, and the CSS glides there. Let go,
// and the lens glides back to its round.
export function magnifier(root) {
  const svg = root.querySelector('.lb-loupe')
  const follow = (e) => {
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse())
    svg.style.setProperty('--lb-px', point.x.toFixed(1))
    svg.style.setProperty('--lb-py', point.y.toFixed(1))
    svg.setAttribute('data-follow', '')
  }
  const leave = () => svg.removeAttribute('data-follow')
  svg.addEventListener('pointermove', follow)
  svg.addEventListener('pointerleave', leave)
  svg.addEventListener('pointercancel', leave)
  return () => {
    svg.removeEventListener('pointermove', follow)
    svg.removeEventListener('pointerleave', leave)
    svg.removeEventListener('pointercancel', leave)
  }
}
/* /demo */

/* demo:arch-globe */
// The land of Natural Earth (public domain), simplified for a small globe:
// one shape per "M", in half degrees (longitude latitude, then steps)
const LAND = 'M-360 138l11-5 0 1 5 0 4-2-5-1-1-2-11 3-3-2 720 0-5-1 3-4-11-2-6-3-14 0-3-4 2-1-2-5-10-8-2 12 15 8 2 3-9-4-1 3-6-1-5-3 2-2-26 0-14-9 10-1 3-4-7-11-6-6-5 0-10-7 4-6-1-4-5-1-1 4 2 1-5 2 2 3-9-1 1 4-7-4 2-3 7 0-7-5 6-7-1-7-11-10-10-3-1-2-4 2-5-3 7-13-1-4-8-6 0 3-10 7-2-9 8-7 2-8-5 3-3 7-3 3 1 7-4 11-6-2 1 4-6 10-9-3-1-3-12-8-1-11-5-5-8 16-2 11-4-1-8 9-18 0-2 3-4-1-6 3-3 4-4 0 6-10 1 2 1-4 4 0 5 5 1-5 6-3-9-11-24-9-2 9-16 22 1 3-2-4-3 5 9-16 1-7 12-12-2-2 4-2 13 3 0-3-7-13-17-17 4-20-12-11 1-8-6-3-1-7-8-8-17-4-3 2 0 5-6 9-1 10-5 8 3 15-3 11-6 8 1 9-2 3-5-1-3 4-13-4-14 1-15 14-2 5 3 7-2 8 5 9 10 7 0 5 7 7 8-2 7 3 16 2 3-1-1-6 17-7 5 5 15-4 10 0 4 11-17 0-3 6 15 5 10-2 6 2-10 6 5 5-8-2 3-3-5-1-3 2 2 1-6 1-6-8 3-3-13-1 3-6-2 1-1-3-6 8 0 2-13 8-1-3 12-8-3 1-2-5-1 4-13 9-12-3 0-2-4-2-2-5-4-4-7-1-7 2-1 12 16 2 1 4-7 5 6 0-1 3 7 0 6 6 7 1 1 7 4 1 1-2-3-2 3-3 17 1 4 1 0 5 5-1 1 3-2 1 11 2-12 0-3 1 0 5 8 4-7 1-8-6-2-2 4-3-4-3-2-5-6-1-5 8-4-2-6 0-1 7 2 1 26 15 11 2 7 0 7-1-3-1 2-1 19-3 1-2-2-1-14 0 4-1 0-3 4-1 0 2 5-1 5 4 4-1 1 2-2 3 6-1 1-1-3-1 2-1 14 5 13-1 2 1-1 2 16-4 1 1-4 2-1 3 5 4 7 0-1-3 3-6-4-4 2-1 5 4-3 3 2 2-3 2 3 3 4-4-1 2 3 1 8-2-2 4 13 1-2 1 2 1 28 3 7 2 19-3-9-4 27-2 1 1 7 0 9-5 2 2 15-1-2 2 3 1 37-4 4-3 14 0 3-2 3 1-1 2 16-1M-181 139l0-2 3 2 3-5 4 6 6-1 2-1 0-3-9-2-3-3-11-6-3-6 3 0 1-4 20-4 1-3 4-5 3 3-3 4 7 4-4 5 2 2-1 5 8 0 9-3 0-4 4-2 6 5 5-8 9-4 4-5-9-4-13 0-9-6 12 4 2-1-2-1 1-4 6 0 2 2 1-2-11-5-1 2 3 2-5-1-7-4 1-3-7-1 3 0-4 0-2-4-1 1-1-5-1 4-1-2 3-5-12-8 2-13-7 10-10 1-2-3-8 1-5-2-3-12 3-6 4-3 5 1 3 5 7 1-4-11 11-1-1-9 5-4 4 1 5-2 4 5 6 3 1-7 3 6 4-3 12 0-1-1 11-8 6 0 5-4 3-5-1-3 11-3 1-2 9-1 9-4 2-5-8-11-5-18-13-6-3-7-10-12-4-1-5 2 3-6-4-3-7-1 0-4-5 0 3-3-8-6 0-2 4-1-1-2-6-5 2-4-6-1 0-2-8 3-1 8 3 3-3 1 2 5 3-1 1 4-4-1 2 12 4 9 3 25-3 5-9 6-8 15-3 2 3 7-2 1 0 2 8 10-2 9-3 1-3-4-9 6-4 7-32 10-4 3-1 6-16 17-2 1 1-4 10-13-1-1-4 3-1 3-5 3 2 2-7 9-6 3-8 12 0 15 4-2-1 4-9 4-1 3-12 11-26 6-9-4 2 5-16-11-13-3 15 6 1 3-10-1 0 2-8 4 3 3 7 2-1 1 1 1-8-1-6 2 13 1-11 5 21 6 40-5 17 3 38-6 2 1-2 1 2 0 4 1 9-3 8 2 3-1 0-1 4 3-5 2 3 4M-360 -169l20 1 24-3 30 1-21 3 1 3-8 2 21 1-18 3-5 2-1 2 14-1 11 2 0 2 2 1 62 3 3-2 24-2-6 6 14-2 15 2 26-3 14 2 4 2-3 5 2 5 19 7-8-3 0-2-7-4 7-5 2-6-19-6-13 0 7-3-9-1 0-1 40-8 59 5-2 2-12 0 0 3 36 6 4 1-2 1 2 2 17 4 14-1 15 3 7-2 5 2 27-1 14 4 9-3 32 8 14-4 15 0 1-2-3-3 2 0-2-3 4-1 8 5 28 8 16-3 7 1 7 3 6-3 15 2 13-3 30 3 0 1 5-3 16 0 7-3 44-6-3-4-12-5 2-4 5-2-10 0-4-4 19-6 18-1M287 -28l4-2 2-8 5-3 8-11 0-10-6-13-7-3-3 2-3-2-6 2-5 5 0 2-2-2 2 5-4-4-3 5-6 2-27-7-6 2 1 5-4 11 1-1-1 4 1 5 0-1 14 6 9 11 8-2 2 5 4 1 0 2 8-2-2-6 9-5 4 13M-54 167l12-2-21-1 39-1-16-3 5 0-4-2 2-4-6-1 3-1 1-2-2 0 2-1-8-2 2-3-5 1 6-4-7 2-2-3 8 0-35-9-6-6-1-5-10 2-6 5-5 7 6 6-7-1 0 3 6-1-9 2 3 2-8 6-20 1-6 2 9 1-13 1 16 3-5 1 11 4 24 1 12-2-5 2 7 1M-173 146l1-1 7 3 3-4 6 2 12-3 8-3 2-2-4-1 14-3-4-4-8 3 7-6-1-2-8 2 6-3-18 5-5-1-2 1 1 2 8 0 2 4-12 5-19 1-3 3 3 3 5 1M-137 166l13-1-30-6 3-2-10-5-18 1 3 1-1 2 7-1-6 2 6 2-4 2 10 0-11 0-8 3M268 -2l3-5 6 4 12-5 6-4-1-3 7-6-5 1-7 5-4-4-10 2 2 2-1 4-9 4-1-1-2 2 3 2-6 2M236 4l2-2-2 0-4-10-12 2-2 5 1 5 7 2 7 8 5-3-3-5M-228 146l8 0 4-3-1 3 4 0 4-4 7-2-3-1 0-1-27 0-3 2 10 1-11 0 4 2-7 0M100 -27l1-4-7-19-6 0-1 6 2 4 0 8 6 3 3 5M98 83l3-2-3-3 0-3 10-1 0 4-3 2 4 2-2 2-1-2-1 4-4 3 5 2 0 3-8-1-5-4M212 -12l-7 4-14 19 4-1 13-10-1-1 5-5M-6 117l-2-2 4 0-2-3 9-7 0-2-13-3 3 3-4 1 3 1-1 2 3 1-5 3-1 3 2 3M282 74l-1-4-9-3-2 2-8-1 2-2-1-3-3 0-1 4 6 4 6 0 2 4 6 1 2 6 2 1 1-3M115 141l-12 2 8 7 27 3-21-4-6-4M-29 133l2-3-10-3-9 1 2 1-4 1 4 1-5 0M-90 -156l3-4-21-1 11 5M-241 143l-5-1-6 2 4 3-2 2 15-1 4-1M-174 159l2 0-10-3-11 4 8 3M-189 154l29-4-25 0-3 3-6 1M37 159l6-1-11-4-11 5M346 -82l2-1-2-5-7-5-6 1M250 3l-3-3-7 0 2-3 5 2-4-3 3-7-3 2-1 4-1-6-2 0-1 5 2 7M-112 101l-2-1 7-2 1-5-2 3-3-2-8 1 4 6 3 2M-216 152l4 0-1-2-14-1 3 1-11 0 4 3 13-2-3 2M200 158l-18 3 10 2 8-3M349 -72l5-4 3 1-7-8-2 4 1 4-4 6M-137 -142l-1-2-4-1-8 2 6 1 1 3 2 1M-136 -108l6-1-8-2-11 5 7-2 3 3M217 -14l5 1 9-4-14 1-6 2 1 2M287 101l2-3-3 1-1-3 2-4-3 0-1 15 2 2M-159 46l11-5-8-1 2 1-3 2-7 2-6-1 5 2M288 88l3 1 0-2-11-4 4 8M243 37l2-3-2-5 5-1 0-3-8 5M-14 105l-6-1 1 4 6 2 2-1M-201 148l6 0-1-2 3-1 0-2-12 2 4 0-2 2M290 151l-12-2-4 2 4 1M253 17l-2-6-4 5-3-2 7 6M51 161l4-1-9-1-11 2M-170 131l10-4-14 0M291 -82l6 0-1-4-4-1-3 5M-186 146l-5-2-1 3 11 1M-145 40l8-3-11-1-1 1 4 0-2 2M-197 153l1-3-9 1 0 2M-232 155l-2-2-12-1M162 12l-2 2 0 6 4-5M210 157l-11-1 5 3M-119 -160l-1-2-13 1'

// A real globe. Each shape is turned with the sphere and projected
// (orthographic); what passes behind is cut where it crosses the edge, and
// the cut follows the edge round. The turn is a CSS animation (lb-turn):
// at each frame the canvas reads how far it has run, so the globe pauses
// and calms down like the rest of the lab; a drag adds a spin of its own,
// which slows down when let go.
export function globe(root) {
  const band = root.querySelector('.lb-globe-band')
  const canvas = band.querySelector('.lb-globe')
  const ctx = canvas.getContext('2d')
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const rad = Math.PI / 180

  const shapes = LAND.split('M').filter(Boolean).map((part) => {
    const n = part.match(/-?\d+/g).map((v) => v / 2)
    const points = [[n[0], n[1]]]
    for (let i = 2; i < n.length; i += 2) {
      const [lon, lat] = points[points.length - 1]
      points.push([lon + n[i], lat + n[i + 1]])
    }
    // seen from outside, with north up: is it drawn clockwise?
    let area = 0
    points.forEach(([x1, y1], i) => {
      const [x2, y2] = points[(i + 1) % points.length]
      area += x1 * y2 - x2 * y1
    })
    return { points, clockwise: area < 0 }
  })
  // lines of longitude and latitude, every 30 degrees
  const grid = []
  for (let lon = -180; lon < 180; lon += 30) grid.push(Array.from({ length: 37 }, (_, i) => [lon, i * 5 - 90]))
  for (let lat = -60; lat <= 60; lat += 30) grid.push(Array.from({ length: 73 }, (_, i) => [i * 5 - 180, lat]))

  let size = 0, r = 0, c = 0
  let spin = 0, tilt = 18, velocity = 0
  let drag = null, last = ''

  // longitude, latitude to a point: x right, y up, z towards us
  const project = ([lon, lat], turn) => {
    const l = (lon + turn + spin) * rad, p = lat * rad, t = tilt * rad
    const x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l)
    return { x, y: y * Math.cos(t) - z * Math.sin(t), z: y * Math.sin(t) + z * Math.cos(t) }
  }
  const screen = (p) => [c + p.x * r, c - p.y * r]
  // where the segment from a (in front) to b (behind) meets the edge
  const edge = (a, b) => {
    const k = a.z / (a.z - b.z)
    const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k
    return Math.atan2(-y, x)
  }
  const rim = (angle) => [c + Math.cos(angle) * r, c + Math.sin(angle) * r]

  // the parts of a line that can be seen, each from where it comes round
  // the edge to where it goes behind
  const pieces = (line, turn, closed) => {
    const p = line.map((point) => project(point, turn))
    const first = p.findIndex((q) => q.z > 0)
    if (first < 0) return []
    const n = p.length, end = closed ? n : n - first - 1
    const list = [{ from: null, points: [screen(p[first])], to: null }]
    for (let k = 1; k <= end; k++) {
      const a = p[(first + k - 1) % n], b = p[(first + k) % n]
      const piece = list[list.length - 1]
      if (a.z > 0 && b.z > 0) piece.points.push(screen(b))
      else if (a.z > 0) {
        piece.to = edge(a, b)
        piece.points.push(rim(piece.to))
      } else if (b.z > 0) {
        const from = edge(b, a)
        list.push({ from, points: [rim(from), screen(b)], to: null })
      }
    }
    // a closed shape ends where it began: its last piece leads into the first
    if (closed && list.length > 1) {
      const last = list.pop()
      list[0] = { from: last.from, points: [...last.points, ...list[0].points.slice(1)], to: list[0].to }
    }
    // a coast that only grazes the edge shows nothing, and its two ends can
    // come out in the wrong order: leave it behind
    return list.filter((piece) => piece.from === null || piece.points.some(([x, y]) => Math.hypot(x - c, y - c) < r - 0.5))
  }

  // a shape as far as it can be seen: where it goes behind, the edge of the
  // globe takes over, round to the next place where the shape comes back
  // (clockwise for a clockwise shape, so its land stays on the same side)
  const shape = ({ points, clockwise }, turn) => {
    const list = pieces(points, turn, true)
    if (list.length === 1 && list[0].from === null) {
      list[0].points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.closePath()
      return
    }
    const way = clockwise ? 1 : -1
    const turnTo = (a, b) => (((b - a) * way) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
    const left = new Set(list)
    while (left.size) {
      const start = left.values().next().value
      let piece = start
      ctx.moveTo(...piece.points[0])
      for (;;) {
        left.delete(piece)
        piece.points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y))
        const next = list.reduce((best, other) => (turnTo(piece.to, other.from) < turnTo(piece.to, best.from) ? other : best))
        ctx.arc(c, c, r, piece.to, piece.to + turnTo(piece.to, next.from) * way, !clockwise)
        if (next === start || !left.has(next)) break
        piece = next
      }
      ctx.closePath()
    }
  }

  const draw = (turn) => {
    if (r <= 0) return
    ctx.clearRect(0, 0, size, size)
    // the sea: a pale sphere
    const sea = ctx.createRadialGradient(c * 0.7, c * 0.62, 0, c, c, r)
    sea.addColorStop(0, '#ffffff')
    sea.addColorStop(0.75, '#e6f1f1')
    sea.addColorStop(1, '#c9dcdc')
    ctx.fillStyle = sea
    ctx.beginPath()
    ctx.arc(c, c, r, 0, 2 * Math.PI)
    ctx.fill()
    // the grid, faint
    ctx.beginPath()
    for (const line of grid) {
      for (const piece of pieces(line, turn, false)) piece.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    }
    ctx.strokeStyle = 'rgb(60 120 125 / 0.14)'
    ctx.lineWidth = size / 280
    ctx.stroke()
    // the land
    ctx.beginPath()
    for (const land of shapes) shape(land, turn)
    ctx.fillStyle = '#76cbc2'
    ctx.fill()
    ctx.strokeStyle = '#5fb8ae'
    ctx.lineWidth = size / 400
    ctx.stroke()
    // light from the top left, a shadow round the edge
    const shade = ctx.createRadialGradient(c * 0.66, c * 0.58, r * 0.1, c, c, r)
    shade.addColorStop(0, 'rgb(255 255 255 / 0.35)')
    shade.addColorStop(0.55, 'rgb(255 255 255 / 0)')
    shade.addColorStop(0.86, 'rgb(20 40 48 / 0.18)')
    shade.addColorStop(1, 'rgb(20 40 48 / 0.55)')
    ctx.fillStyle = shade
    ctx.beginPath()
    ctx.arc(c, c, r, 0, 2 * Math.PI)
    ctx.fill()
  }

  // (off screen, the lab does not lay a card out: its canvas has no size)
  const resize = () => {
    if (!canvas.clientWidth) return
    const ratio = Math.min(devicePixelRatio || 1, 2)
    size = Math.round(canvas.clientWidth * ratio)
    canvas.width = canvas.height = size
    c = size / 2
    r = c - ratio
    last = ''
  }

  // the clock: how far the CSS animation has run in its turn (paused with
  // it, and nothing at all without it)
  const clock = () => {
    const turn = canvas.getAnimations().find((animation) => animation.animationName === 'lb-turn')
    return (turn?.effect.getComputedTiming().progress ?? 0) * 360
  }

  let frame = 0
  const tick = () => {
    const turn = clock()
    if (!drag && Math.abs(velocity) > 0.01) {
      spin += velocity
      velocity *= 0.92
    }
    const key = `${turn.toFixed(2)} ${spin.toFixed(2)} ${tilt.toFixed(2)} ${size}`
    if (key !== last) {
      last = key
      draw(turn)
    }
    frame = requestAnimationFrame(tick)
  }

  // a drag spins it (and tilts it a little); let go, and it carries on
  const down = (e) => {
    drag = { x: e.clientX, y: e.clientY, t: e.timeStamp }
    velocity = 0
    canvas.setPointerCapture(e.pointerId)
  }
  const move = (e) => {
    if (!drag) return
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y
    const frames = Math.max((e.timeStamp - drag.t) / 16.7, 1)
    drag = { x: e.clientX, y: e.clientY, t: e.timeStamp }
    spin += dx * 0.6
    tilt = Math.min(Math.max(tilt + dy * 0.4, -60), 70)
    // the speed it leaves with, in degrees a frame, within reason
    velocity = calm ? 0 : Math.max(-6, Math.min(6, (dx * 0.6) / frames))
  }
  const up = () => { drag = null }

  // counting figures: written in the page, they count up to themselves
  const figures = [...band.querySelectorAll('[data-to]')]
  let count = 0
  const countUp = () => {
    band.removeAttribute('data-waiting')
    if (calm) return
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / 1400, 1)
      figures.forEach((el) => { el.textContent = Math.round(el.dataset.to * (1 - (1 - t) ** 3)) })
      if (t < 1) count = requestAnimationFrame(step)
    }
    count = requestAnimationFrame(step)
  }
  if (!calm) band.setAttribute('data-waiting', '')

  // it only turns while it can be seen
  let counted = false
  const observer = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame)
    if (!entry.isIntersecting) return
    frame = requestAnimationFrame(tick)
    if (!counted) { counted = true; countUp() }
  })
  const sizer = new ResizeObserver(resize)
  sizer.observe(canvas)
  observer.observe(band)
  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)
  return () => {
    observer.disconnect()
    sizer.disconnect()
    cancelAnimationFrame(frame)
    cancelAnimationFrame(count)
    canvas.removeEventListener('pointerdown', down)
    canvas.removeEventListener('pointermove', move)
    canvas.removeEventListener('pointerup', up)
    canvas.removeEventListener('pointercancel', up)
  }
}
/* /demo */

/* demo:arch-rings */
// The button opens and closes the rings (aria-expanded; the CSS swaps its
// label). Escape closes them and puts the focus back on the button.
export function cornerRings(root) {
  const nav = root.querySelector('.lb-rings nav')
  const button = nav.querySelector('button')
  // the CSS spaces the letters evenly; on the first opening, each one gets
  // the room its own width needs, measured along the middle of its ring
  let spaced = false
  const space = () => {
    spaced = true
    for (const link of nav.querySelectorAll('a')) {
      const letters = [...link.querySelectorAll('i')]
      const middle = parseFloat(link.style.getPropertyValue('--r')) - 19
      const widths = letters.map((letter) => letter.offsetWidth + 1)
      const total = widths.reduce((sum, w) => sum + w, 0)
      let before = 0
      letters.forEach((letter, i) => {
        const along = before + widths[i] / 2 - total / 2
        letter.style.setProperty('--a', `${((along / middle) * 180) / Math.PI}deg`)
        before += widths[i]
      })
    }
  }
  const set = (open) => {
    if (open && !spaced) space()
    button.setAttribute('aria-expanded', String(open))
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

/* demo:arch-water */
// The tube fills up when it comes into view. Then it tilts towards the
// pointer (or a finger) on a stiff spring; the water stays level but rides
// a softer spring of its own, so it lags behind the glass and sloshes
// before it settles.
export function sparklingWater(root) {
  const box = root.querySelector('.lb-tube')
  const glass = box.querySelector('.lb-tube-glass')
  const inside = box.querySelector('#lb-tube-in path')
  const water = box.querySelector('.lb-tube-water')
  const label = box.querySelector('.lb-tube-level')
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const FULL = 0.65, TOP = 18, BOTTOM = 190
  let level = calm ? FULL : 0, start = 0
  let tilt = 0, aim = 0, speed = 0
  let lag = 0, lagSpeed = 0
  let frame = 0, last = 0

  const place = () => {
    const y = BOTTOM - level * (BOTTOM - TOP)
    const slosh = (lag - tilt) * 1.5
    glass.setAttribute('transform', `rotate(${tilt.toFixed(2)} 50 100)`)
    inside.setAttribute('transform', `rotate(${tilt.toFixed(2)} 50 100)`)
    water.setAttribute('transform', `translate(0 ${y.toFixed(2)}) rotate(${slosh.toFixed(2)} 50 0)`)
    label.textContent = `${Math.round(level * 100)}%`
  }
  const step = (now) => {
    const dt = Math.min((now - (last || now)) / 1000, 1 / 30)
    last = now
    if (level < FULL) level = FULL * (1 - (1 - Math.min((now - start) / 1800, 1)) ** 3)
    speed += ((aim - tilt) * 120 - speed * 18) * dt
    tilt += speed * dt
    lagSpeed += ((tilt - lag) * 60 - lagSpeed * 3.4) * dt
    lag += lagSpeed * dt
    place()
    const still = level >= FULL && Math.abs(aim - tilt) + Math.abs(speed) + Math.abs(tilt - lag) + Math.abs(lagSpeed) < 0.02
    frame = still ? 0 : requestAnimationFrame(step)
  }
  const wake = () => {
    if (frame) return
    last = 0
    frame = requestAnimationFrame(step)
  }

  place()
  if (calm) return () => {}
  const toward = (e) => {
    const r = box.getBoundingClientRect()
    aim = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2))) * 18
    wake()
  }
  const away = () => {
    aim = 0
    wake()
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    start = performance.now()
    wake()
  })
  observer.observe(box)
  box.addEventListener('pointermove', toward)
  box.addEventListener('pointerleave', away)
  box.addEventListener('pointercancel', away)
  return () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
    box.removeEventListener('pointermove', toward)
    box.removeEventListener('pointerleave', away)
    box.removeEventListener('pointercancel', away)
  }
}
/* /demo */

/* demo:arch-cat */
// The eyes follow the pointer over the stage. A pet (a click, a tap, Enter
// or Space) makes the paw beckon faster and lets out a burst of luck.
export function luckyCat(root) {
  const cat = root.querySelector('.lb-cat')
  let timer = 0
  const look = (e) => {
    const box = cat.getBoundingClientRect()
    const x = (e.clientX - (box.left + box.width / 2)) / (box.width / 2)
    const y = (e.clientY - (box.top + box.height * 0.3)) / (box.height / 2)
    cat.style.setProperty('--lb-look-x', Math.max(-1, Math.min(1, x)).toFixed(2))
    cat.style.setProperty('--lb-look-y', Math.max(-1, Math.min(1, y)).toFixed(2))
  }
  const rest = () => {
    cat.style.removeProperty('--lb-look-x')
    cat.style.removeProperty('--lb-look-y')
  }
  const pet = () => {
    cat.removeAttribute('data-lucky')
    void cat.offsetWidth // start the burst again
    cat.setAttribute('data-lucky', '')
    clearTimeout(timer)
    timer = setTimeout(() => cat.removeAttribute('data-lucky'), 1600)
  }
  root.addEventListener('pointermove', look)
  root.addEventListener('pointerleave', rest)
  cat.addEventListener('click', pet)
  return () => {
    clearTimeout(timer)
    root.removeEventListener('pointermove', look)
    root.removeEventListener('pointerleave', rest)
    cat.removeEventListener('click', pet)
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
  'arch-cat': luckyCat,
  'arch-water': sparklingWater,
  'arch-globe': globe,
  'arch-rings': cornerRings,
}
