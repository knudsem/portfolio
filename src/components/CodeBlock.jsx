import { useEffect, useMemo, useRef, useState } from 'react'
import { highlight, LANGUAGE_NAMES } from '../highlight'

// A code excerpt, coloured by highlight.js, with a copy button. Long lines
// wrap, so the block never needs sideways scrolling. The colours (hundreds
// of spans) wait until the block comes near the screen: the text is the
// same, only the first paint is lighter.
export default function CodeBlock({ c, code }) {
  const { source } = code
  const preRef = useRef(null)
  const [near, setNear] = useState(false)
  const tokens = useMemo(() => (near ? highlight(source, code.lang) : null), [near, source, code.lang])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true)
        observer.disconnect()
      }
    }, { rootMargin: '50% 0px' })
    observer.observe(preRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = () => {
    navigator.clipboard?.writeText(source).then(() => setCopied(true), () => {})
  }

  return (
    <figure className="case-code">
      <div className="case-code-head">
        <span className="case-code-file">{code.file}</span>
        <span className="case-code-lang">{LANGUAGE_NAMES[code.lang]}</span>
        <button type="button" className="case-code-copy" onClick={copy}>
          {copied ? c.copied : c.copy}
          <span className="sr-only"> {code.file}</span>
        </button>
      </div>
      <pre className="case-code-body" ref={preRef}><code>
        {tokens ? tokens.map((token, i) => (token.type === 'plain'
          ? token.text
          : <span key={i} className={`tok-${token.type}`}>{token.text}</span>)) : source}
      </code></pre>
      {code.caption && <figcaption>{code.caption}</figcaption>}
      <p className="sr-only" role="status">{copied ? c.copied : ''}</p>
    </figure>
  )
}
