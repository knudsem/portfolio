import { parseRoute } from './projects'

// Page to page morph: when a visitor opens a project, the browser carries
// the card's cover and title over to the project page (cross-document view
// transitions, see "Page transitions" in App.css). Browsers without them
// simply change page.
// Two elements with the same name on one page would cancel the effect, so
// names are only given for the navigation that needs them.

const NAMES = { cover: 'case-cover', title: 'case-title' }

function clearNames() {
  for (const el of document.querySelectorAll('[data-vt-named]')) {
    el.style.viewTransitionName = ''
    delete el.dataset.vtNamed
  }
}

// Names the cover and title found inside a card, or a project page's head.
export function nameFrom(scope) {
  clearNames()
  for (const el of scope.querySelectorAll('[data-vt]')) {
    el.style.viewTransitionName = NAMES[el.dataset.vt]
    el.dataset.vtNamed = ''
  }
}

// Resting state: only the project page's own cover and title are named.
export function resetNames() {
  const head = document.querySelector('[data-vt-page]')
  if (head) nameFrom(head)
  else clearNames()
}

export const isPlainClick = (e) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented

// Arriving on a page. Coming back to the home page from a project, its card
// receives the morph, when it is on screen. Names set by the click that left
// a page are still there when the browser restores it from its cache, so the
// way back mirrors the way in.
export function handlePageReveal(e) {
  const transition = e.viewTransition
  if (transition && !document.querySelector('[data-vt-named]')) {
    const from = window.navigation?.activation?.from?.url
    const route = from ? parseRoute(new URL(from).pathname) : null
    const card = route?.name === 'project' && document.querySelector(`[data-project="${route.id}"]`)
    if (card) {
      const r = card.getBoundingClientRect()
      if (r.bottom > 0 && r.top < window.innerHeight) nameFrom(card)
    }
  }
  if (transition) transition.finished.finally(resetNames)
  else resetNames()
}

// "All projects" on a project page: when the visitor came from the home page
// (and has not moved within this page since), going back returns them to the
// card they clicked, where they were, with the morph back into it. Otherwise
// the link opens the home page at the work section. Needs the Navigation API.
export function backToHome(e) {
  const nav = window.navigation
  const from = nav?.activation?.from?.url
  if (!isPlainClick(e) || !from || nav.currentEntry?.id !== nav.activation.entry?.id) return
  const url = new URL(from)
  if (url.origin !== window.location.origin || parseRoute(url.pathname).name !== 'home') return
  e.preventDefault()
  window.history.back()
}
