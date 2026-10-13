import { Fragment, useEffect } from 'react'
import CodeBlock from '../components/CodeBlock'
import { NotFound } from '../components/ProjectPage'
import { POSTS, postBySlug, readingMinutes } from './posts'
import { BLOG_PATH, postPath } from '../projects'
import './blog.css'

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key])
const FILES = { css: 'style.css', js: 'script.js', text: 'prompt.txt' }

const Icon = ({ children }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

// French typography: a no-break space before : ; ? ! % and », after «, so a
// sign never starts a line on its own
const typeset = (text, lang) => (lang === 'fr' ? text.replace(/ ([:;?!%»])/g, '\u00a0$1').replace(/« /g, '«\u00a0') : text)

const formatDate = (date, lang) => new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))

// `code`, **bold** and [links](/path) inside a paragraph, as elements: no
// HTML is ever built from the text
function Inline({ text, lang }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    // Code breaks at its spaces only, never inside a name like --progress
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={i}>{part.slice(1, -1).split(/( )/).map((word, j) => (word === ' ' ? ' ' : <span key={j} className="nobr">{word}</span>))}</code>
    }
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{typeset(part.slice(2, -2), lang)}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return <a key={i} href={link[2]}>{typeset(link[1], lang)}</a>
    return <Fragment key={i}>{typeset(part, lang)}</Fragment>
  })
}

function Meta({ post, lang, b }) {
  const text = post[lang]
  return (
    <p className="case-meta">
      <time className="case-type" dateTime={post.date}>{formatDate(post.date, lang)}</time>
      <span className="case-year">{fill(b.minutes, { n: readingMinutes(text.body) })}</span>
    </p>
  )
}

function Tags({ tags }) {
  return (
    <ul className="project-tags blog-tags">
      {tags.map((tag) => <li key={tag} className="project-tag">{tag}</li>)}
    </ul>
  )
}

function Cta({ t, b }) {
  return (
    <section className="case-cta" aria-labelledby="blog-cta">
      <h2 id="blog-cta" className="case-cta-title">{b.cta_title}</h2>
      <p>{b.cta_text}</p>
      <a href="/#contact" className="btn btn-primary" data-magnetic>{t.hero.cta_contact}</a>
    </section>
  )
}

// The list of posts
function BlogIndex({ t, lang }) {
  const b = t.blog
  return (
    <article className="case blog">
      <div className="case-head">
        <p className="case-meta case-in">
          <span className="case-type">{fill(b.count, { n: POSTS.length })}</span>
        </p>
        <h1 className="case-title">{b.heading}</h1>
        <p className="case-lead case-in" style={{ '--d': '80ms' }}>{b.intro}</p>
      </div>

      <ul className="blog-list">
        {POSTS.map((post) => (
          <li key={post.slug} className="blog-card">
            <Meta post={post} lang={lang} b={b} />
            <h2 className="blog-card-title">
              {/* the link covers the whole card */}
              <a href={postPath(post.slug)} className="blog-card-link">{typeset(post[lang].title, lang)}</a>
            </h2>
            <p className="blog-card-text">{typeset(post[lang].description, lang)}</p>
            <Tags tags={post.tags} />
          </li>
        ))}
      </ul>

      <Cta t={t} b={b} />
    </article>
  )
}

// One post
function Post({ t, lang, post }) {
  const b = t.blog
  const text = post[lang]
  const others = POSTS.filter((other) => other.slug !== post.slug)
  const c = { copy: b.copy, copied: b.copied }

  useEffect(() => {
    document.title = fill(t.case.title, { title: text.title })
  }, [t, text])

  return (
    <article className="case post">
      <a href={BLOG_PATH} className="case-back">
        <Icon><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>
        {b.all}
      </a>

      <header className="case-head">
        <Meta post={post} lang={lang} b={b} />
        <h1 className="case-title post-title">{typeset(text.title, lang)}</h1>
        <p className="case-lead">{typeset(text.description, lang)}</p>
        <Tags tags={post.tags} />
      </header>

      <div className="post-body">
        {text.body.map(([type, content, source, caption], i) => {
          if (type === 'h2') return <h2 key={i}>{typeset(content, lang)}</h2>
          if (type === 'ul') return <ul key={i}>{content.map((item) => <li key={item}><Inline text={item} lang={lang} /></li>)}</ul>
          // ['code', lang, source, caption]
          if (type === 'code') return <CodeBlock key={i} c={c} code={{ source, lang: content, file: FILES[content], caption: caption && typeset(caption, lang) }} />
          return <p key={i}><Inline text={content} lang={lang} /></p>
        })}
      </div>

      {post.related && (
        <a href={post.related.href} className="post-related">
          {typeset(post.related[lang], lang)}
          <Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
        </a>
      )}

      {others.length > 0 && (
        <section className="post-more" aria-labelledby="post-more">
          <h2 id="post-more" className="case-h2">{b.more}</h2>
          <ul className="blog-list">
            {others.map((other) => (
              <li key={other.slug} className="blog-card">
                <Meta post={other} lang={lang} b={b} />
                <h3 className="blog-card-title">
                  <a href={postPath(other.slug)} className="blog-card-link">{typeset(other[lang].title, lang)}</a>
                </h3>
                <p className="blog-card-text">{typeset(other[lang].description, lang)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Cta t={t} b={b} />
    </article>
  )
}

export default function BlogPage({ t, lang, slug }) {
  if (!slug) return <BlogIndex t={t} lang={lang} />
  const post = postBySlug(slug)
  return post ? <Post t={t} lang={lang} post={post} /> : <NotFound t={t} />
}
