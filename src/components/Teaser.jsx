import { LAB_PATH, BLOG_PATH, postPath } from '../projects'
import { LAB_COUNT } from '../lab/count'
import { POST_META } from '../blog/meta'
import { typeset } from '../typeset'

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key])

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// The lab and the latest post, side by side. The lab card shows three small
// animations from the lab, still until the card is pointed at or focused.
export default function Teaser({ t, lang }) {
  const latest = [...POST_META].sort((a, b) => b.date.localeCompare(a.date))[0]
  return (
    <section id="lab-blog" aria-labelledby="teaser-title">
      <div className="section-head" data-reveal>
        <h2 id="teaser-title" className="section-title">{t.teaser_title}</h2>
        <p className="section-intro">{t.teaser_intro}</p>
      </div>
      <div className="teaser">
        <article className="teaser-card teaser-lab" data-reveal>
          <div className="teaser-demos" aria-hidden="true">
            <span className="tz-pill">{t.teaser_lab_pill}</span>
            <span className="tz-dots"><i /><i /><i /></span>
            <span className="tz-chevrons"><i /><i /><i /></span>
          </div>
          <p className="teaser-kicker">{fill(t.teaser_lab_count, { n: LAB_COUNT })}</p>
          <h3 className="teaser-title">
            <a href={LAB_PATH} className="teaser-link">{t.teaser_lab_title}</a>
          </h3>
          <p className="teaser-text">{t.teaser_lab_text}</p>
          <span className="teaser-cta" aria-hidden="true">{t.teaser_lab_cta}<Arrow /></span>
        </article>

        {latest && (
          <article className="teaser-card teaser-blog" data-reveal style={{ '--reveal-delay': '90ms' }}>
            <p className="teaser-kicker">
              {t.teaser_blog_latest} <span aria-hidden="true">·</span> {fill(t.teaser_blog_count, { n: POST_META.length })}
            </p>
            <h3 className="teaser-title">
              <a href={postPath(latest.slug)} className="teaser-link">{typeset(latest[lang].title, lang)}</a>
            </h3>
            <p className="teaser-text">{typeset(latest[lang].description, lang)}</p>
            <span className="teaser-cta" aria-hidden="true">{t.teaser_blog_cta}<Arrow /></span>
            <a href={BLOG_PATH} className="teaser-all">{t.teaser_blog_all}</a>
          </article>
        )}
      </div>
    </section>
  )
}
