import { useEffect, useRef, useState } from 'react'

const MEDIA = '/media/trimension'

const Icon = ({ children }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

// A light video (WebM, else MP4) that only loads once it is played: it plays
// while it is on screen and pauses when it leaves. A loop goes round; the
// logo plays once and stays on its last frame. Its button pauses it (and
// scrolling never restarts it then), plays it, or plays the logo again.
// With reduced motion nothing starts on its own: the still shows, and the
// button plays it.
function CaseVideo({ c, item }) {
  const ref = useRef(null)
  const stopped = useRef(false)
  const [motionAllowed] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [state, setState] = useState('idle')

  useEffect(() => {
    const video = ref.current
    video.muted = true
    if (!motionAllowed) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause()
      else if (!stopped.current && !video.ended) video.play().catch(() => {})
    }, { threshold: 0.5 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [motionAllowed])

  const toggle = () => {
    const video = ref.current
    if (state === 'playing') {
      stopped.current = true
      video.pause()
      return
    }
    stopped.current = false
    if (video.ended) video.currentTime = 0
    video.play().catch(() => {})
  }

  const label = state === 'playing' ? c.pause : state === 'ended' ? c.replay : c.play
  return (
    <figure className="case-shot">
      <div className="case-media" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
        <video
          ref={ref}
          width={item.width}
          height={item.height}
          poster={`${MEDIA}/${item.name}.webp`}
          preload="none"
          muted
          playsInline
          loop={item.kind === 'loop'}
          aria-label={item.label}
          onPlay={() => setState('playing')}
          onPause={(e) => setState(e.currentTarget.ended ? 'ended' : 'paused')}
          onEnded={() => setState('ended')}
        >
          <source src={`${MEDIA}/${item.name}.webm`} type="video/webm" />
          <source src={`${MEDIA}/${item.name}.mp4`} type="video/mp4" />
        </video>
        <button type="button" className="case-play" onClick={toggle}>
          <span className="sr-only">{label}</span>
          {state === 'playing'
            ? <Icon><path d="M9 5v14M15 5v14" /></Icon>
            : state === 'ended'
              ? <Icon><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></Icon>
              : <Icon><path d="M8 5.5v13l10-6.5z" /></Icon>}
        </button>
      </div>
      {item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>
  )
}

// The logos and the game videos of a project: a logo on its own, the
// animated logo and the videos, two by two
export default function BrandMedia({ c, brand }) {
  return (
    <section className="case-section" aria-labelledby="case-brand">
      <h2 id="case-brand" className="case-h2">{c.brand}</h2>
      <p className="case-section-intro">{brand.intro}</p>
      <div className="case-shots">
        {brand.items.map((item) => item.kind === 'image' ? (
          <figure key={item.name} className="case-shot">
            <div className="case-media case-logo" style={{ aspectRatio: `${item.frame[0]} / ${item.frame[1]}` }}>
              <img src={`${MEDIA}/${item.name}.svg`} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
            </div>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        ) : (
          <CaseVideo key={item.name} c={c} item={item} />
        ))}
      </div>
    </section>
  )
}
