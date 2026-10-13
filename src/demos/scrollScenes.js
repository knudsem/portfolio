// Scroll scenes (Eons, revisited). Marks the scenes that are on screen, so
// their idle loops rest off screen. Where the browser has no scroll-driven
// animations, it also gives each scene its scroll progress, --progress, from
// 0 as it enters at the bottom to 1 as it leaves at the top: eons.css then
// scrubs the very same keyframes with it.
export function startScrollScenes(root = document) {
  const scenes = [...root.querySelectorAll('[data-scroll-scene]')]
  const native = CSS.supports('animation-timeline: view()')
  const onScreen = new Set()
  let frame = 0

  const update = () => {
    frame = 0
    for (const scene of onScreen) {
      const { top, height } = scene.getBoundingClientRect()
      const progress = (window.innerHeight - top) / (window.innerHeight + height)
      scene.style.setProperty('--progress', Math.min(1, Math.max(0, progress)).toFixed(4))
    }
  }
  const request = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      target.toggleAttribute('data-inview', isIntersecting)
      if (isIntersecting) onScreen.add(target)
      else onScreen.delete(target)
    }
    if (!native) request()
  })
  scenes.forEach((scene) => observer.observe(scene))

  if (!native) {
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
  }

  return () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', request)
    window.removeEventListener('resize', request)
  }
}
