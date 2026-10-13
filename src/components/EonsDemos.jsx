import { useEffect, useRef, useState } from 'react'
import '../demos/eons.css'
import { startScrollScenes } from '../demos/scrollScenes'

const MEDIA = '/media/trimension/eons'

// The ten fragments of the shattered world. Position (x, y in %) and size
// (in % of the scene's width) for the wide, medium and small layouts; on
// small screens, also the band they sit in (top or bottom) and how far
// their centre is from that edge (in % of the width). Then depth (0 far to
// 1 near), resting angle, spin on the burst, and the rhythm of the float
// (seconds). Nothing else differs between them.
const FRAGMENTS = [
  { file: 'rock-4a5afc6d', w: 450, h: 1268, l: [6, 52, 11], m: [5, 50, 13], s: [5, 13, 15, 'top', 22], depth: 1, rot: -4, spin: -60, dur: 6.4, delay: 0.4, look: 'near' },
  { file: 'rock-4a5afc6b', w: 380, h: 578, l: [93, 60, 13], m: [93, 62, 15], s: [90, 88, 20, 'bottom', 18], depth: 0.95, rot: 3, spin: 50, dur: 7.1, delay: 2.2, look: 'near' },
  { file: 'rock-4a5afc74', w: 355, h: 318, l: [20, 76, 7.5], m: [14, 82, 9], s: [26, 90, 14, 'bottom', 14], depth: 0.75, rot: -8, spin: 120, dur: 5.3, delay: 1.1 },
  { file: 'rock-4a5afc77', w: 195, h: 168, l: [77, 26, 5.5], m: [84, 22, 7], s: [78, 8, 11, 'top', 9], depth: 0.6, rot: 12, spin: -140, dur: 4.7, delay: 3 },
  { file: 'rock-4a5afc7c', w: 160, h: 178, l: [36, 13, 4.5], m: [30, 10, 6], s: [40, 18, 9, 'top', 22], depth: 0.45, rot: -14, spin: 160, dur: 5.9, delay: 0.7 },
  { file: 'rock-4a5afc7b', w: 163, h: 208, l: [19, 22, 4.5], m: [12, 18, 6], s: [18, 22, 9, 'top', 28], depth: 0.5, rot: 9, spin: -110, dur: 6.6, delay: 2.6 },
  { file: 'rock-4a5afc7f', w: 128, h: 180, l: [57, 10, 3.6], m: [60, 9, 5], s: [62, 20, 8, 'top', 26], depth: 0.35, rot: -20, spin: 200, dur: 4.3, delay: 1.8, look: 'far' },
  { file: 'rock-4a5afc75', w: 155, h: 88, l: [88, 16, 6], m: [80, 8, 8], s: [64, 6, 13, 'top', 7], depth: 0.55, rot: 6, spin: -90, dur: 5.6, delay: 0.2 },
  { file: 'rock-bf267bf9', w: 85, h: 98, l: [66, 84, 2.8], m: [66, 86, 4], s: null, depth: 0.3, rot: 25, spin: 240, dur: 3.9, delay: 2.9, look: 'far' },
  { file: 'rock-bf267bfb', w: 145, h: 138, l: [42, 85, 3.6], m: [38, 88, 5], s: [48, 92, 10, 'bottom', 10], depth: 0.4, rot: -12, spin: -180, dur: 4.9, delay: 1.4, look: 'far' },
]

const STORY = "The nebulite's heist is shattering the world. Gravity is not functioning properly anymore and the world you used to know is becoming a maze, borders disappear. With the use of the sun fragments they plan to rewrite the fabric of the universe according to their own desires. The fate of the solar system and the entire galaxy hangs in the balance."

const Eye = () => <img src={`${MEDIA}/eye.png`} width="56" height="56" alt="" loading="lazy" decoding="async" />

function fragmentStyle({ l, m, s, depth, rot, spin, dur, delay }) {
  const small = s || [...m, 'top', 0]
  return {
    '--xl': l[0], '--yl': l[1], '--sl': l[2],
    '--xm': m[0], '--ym': m[1], '--sm': m[2],
    '--xs': small[0], '--ys': small[1], '--ss': small[2], '--edge': small[4],
    '--depth': depth, '--rot': rot, '--spin': spin, '--dur': dur, '--delay': delay,
  }
}

// Live versions of the two Eons animations, rebuilt in 2026 (see eons.css).
// Each demo is described to screen readers as one picture; the floating,
// which loops on its own, can be paused (WCAG 2.2.2).
export default function EonsDemos({ r }) {
  const rootRef = useRef(null)
  const [motionAllowed] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [paused, setPaused] = useState(false)
  const [fonts, setFonts] = useState(false)

  useEffect(() => startScrollScenes(rootRef.current), [])

  // The two Eons typefaces (76 KB) wait until the page has loaded, so they
  // never hold back its first paint
  useEffect(() => {
    let idle = 0
    const apply = () => setFonts(true)
    const whenIdle = () => {
      idle = window.requestIdleCallback ? requestIdleCallback(apply, { timeout: 1500 }) : setTimeout(apply, 200)
    }
    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })
    return () => {
      window.removeEventListener('load', whenIdle)
      if (window.cancelIdleCallback) cancelIdleCallback(idle)
      else clearTimeout(idle)
    }
  }, [])

  return (
    <div className="eons-demos" ref={rootRef} data-fonts={fonts ? '' : undefined}>
      <figure className="eons-demo">
        <div className="eons-panel" role="img" aria-label={r.shatter_label}>
          <p className="eons-title" aria-hidden="true">
            <span className="eons-word">The w<Eye />rld</span> is shattering, time is of the essence
          </p>
          <div className="shatter" data-scroll-scene data-paused={paused ? '' : undefined}>
            {FRAGMENTS.map((f) => (
              <div
                key={f.file}
                className="frag"
                data-depth={f.look}
                data-small={f.s ? undefined : 'hide'}
                data-edge={f.s?.[3]}
                style={fragmentStyle(f)}
              >
                <div className="frag-move">
                  <img src={`${MEDIA}/${f.file}.webp`} width={f.w} height={f.h} alt="" loading="lazy" decoding="async" />
                </div>
              </div>
            ))}
            <p className="shatter-copy" aria-hidden="true">{STORY}</p>
          </div>
        </div>
        {motionAllowed && (
          <button type="button" className="eons-pause" onClick={() => setPaused((on) => !on)}>
            <span className="sr-only">{paused ? r.play : r.pause}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              {paused ? <path d="M8 5.5v13l10-6.5z" /> : <path d="M9 5v14M15 5v14" />}
            </svg>
          </button>
        )}
        <figcaption>{r.shatter_caption}</figcaption>
      </figure>

      <figure className="eons-demo">
        <div className="eons-panel agent" data-scroll-scene role="img" aria-label={r.hands_label}>
          <p className="eons-title" aria-hidden="true">
            <span className="eons-word">Bec<Eye />me</span> Agent Steve
          </p>
          <div className="agent-stage">
            <img className="agent-left" src={`${MEDIA}/hand-left.webp`} width="1600" height="900" alt="" loading="lazy" decoding="async" />
            <span className="agent-glow" />
            <span className="agent-ring" />
            <img className="agent-right" src={`${MEDIA}/hand-right.webp`} width="1600" height="900" alt="" loading="lazy" decoding="async" />
          </div>
        </div>
        <figcaption>{r.hands_caption}</figcaption>
      </figure>
    </div>
  )
}
