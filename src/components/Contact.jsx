import { useState, useRef, useEffect } from 'react'
import { isValidEmail, suggestEmail } from '../email'

const EMAIL = 'mathiasknudsen31@gmail.com'
const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`
const FIELDS = ['name', 'email', 'message']
const EMPTY_FIELDS = { name: '', email: '', message: '' }

// Returns the translation key describing what is wrong with a field, or null.
function fieldError(key, value) {
  const trimmed = value.trim()
  if (key === 'email') {
    if (!trimmed) return 'email_required'
    return isValidEmail(trimmed) ? null : 'email_invalid'
  }
  if (!trimmed) return key === 'name' ? 'name_required' : 'message_required'
  return null
}

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Contact({ t }) {
  const f = t.form
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [suggestion, setSuggestion] = useState(null)
  const [status, setStatus] = useState('idle')

  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  const honeypotRef = useRef(null)
  const successRef = useRef(null)
  const inputRefs = { name: nameRef, email: emailRef, message: messageRef }

  // Move focus to the confirmation so screen readers announce it.
  useEffect(() => {
    if (status === 'sent') successRef.current?.focus()
  }, [status])

  const handleChange = (key) => (e) => {
    const value = e.target.value
    setFields((prev) => ({ ...prev, [key]: value }))
    // Once a problem is shown, recheck live so it disappears as soon as it is fixed.
    if (attempted || errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: fieldError(key, value) }))
    }
    if (key === 'email') setSuggestion(null)
  }

  const handleBlur = (key) => () => {
    const value = fields[key]
    // Leaving a field empty is only flagged on submit, not while tabbing through.
    if (!value.trim()) return
    const problem = fieldError(key, value)
    setErrors((prev) => ({ ...prev, [key]: problem }))
    if (key === 'email' && !problem) setSuggestion(suggestEmail(value.trim()))
  }

  const applySuggestion = () => {
    setFields((prev) => ({ ...prev, email: suggestion }))
    setErrors((prev) => ({ ...prev, email: null }))
    setSuggestion(null)
    emailRef.current?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = Object.fromEntries(FIELDS.map((key) => [key, fieldError(key, fields[key])]))
    setErrors(found)
    setAttempted(true)
    const firstProblem = FIELDS.find((key) => found[key])
    if (firstProblem) {
      inputRefs[firstProblem].current?.focus()
      return
    }

    // Only bots fill in the hidden field: pretend it worked and send nothing.
    if (honeypotRef.current?.value) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const name = fields.name.trim()
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email: fields.email.trim(),
          message: fields.message.trim(),
          _subject: `Portfolio contact from ${name}`,
          _captcha: 'false',
        }),
      })
      // FormSubmit can answer 200 with success "false" (for example before the
      // address is activated), so check the body as well as the status code.
      const data = await res.json().catch(() => null)
      if (!res.ok || String(data?.success) === 'false') {
        setStatus('error')
        return
      }
      setStatus('sent')
      setFields(EMPTY_FIELDS)
      setErrors({})
      setAttempted(false)
    } catch {
      setStatus('error')
    }
  }

  const sending = status === 'sending'
  const describedBy = (key, extra) =>
    [errors[key] ? `cf-${key}-error` : null, extra].filter(Boolean).join(' ') || undefined

  return (
    <section id="contact">
      <div className="section-head" data-reveal>
        <h2 className="section-title">{t.contact_title}</h2>
      </div>

      <div className="contact-layout" data-reveal>

        {/* Left column */}
        <div className="contact-left">
          <p className="contact-p">{t.contact_p}</p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail-icon" aria-hidden="true"><IconPin /></span>
              <span>{t.contact_location}</span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon" aria-hidden="true"><IconClock /></span>
              <span>{t.contact_response}</span>
            </div>
            <div className="contact-detail availability">
              <span className="pulse-dot" />
              <span>{t.contact_availability}</span>
            </div>
          </div>
        </div>

        {/* Right column: form */}
        <div className="contact-right">
          {status === 'sent' ? (
            <div className="contact-success" tabIndex={-1} ref={successRef}>
              <div className="contact-success-icon" aria-hidden="true"><IconCheck /></div>
              <div>
                <p className="contact-success-title">{f.success_title}</p>
                <p className="contact-success-body">{f.success_body}</p>
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-name">{f.name}</label>
                  <input
                    id="cf-name"
                    ref={nameRef}
                    className="form-input"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={fields.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder={f.name_placeholder}
                    required
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy('name')}
                    disabled={sending}
                  />
                  {errors.name && <p id="cf-name-error" className="field-error">{f[errors.name]}</p>}
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-email">{f.email}</label>
                  <input
                    id="cf-email"
                    ref={emailRef}
                    className="form-input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={fields.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder={f.email_placeholder}
                    required
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy('email', suggestion ? 'cf-email-suggestion' : null)}
                    disabled={sending}
                  />
                  {errors.email && <p id="cf-email-error" className="field-error">{f[errors.email]}</p>}
                  <div aria-live="polite">
                    {suggestion && (
                      <p id="cf-email-suggestion" className="field-hint">
                        {f.suggest_before}{' '}
                        <button type="button" className="suggestion-btn" onClick={applySuggestion}>
                          {suggestion}
                        </button>
                        {f.suggest_after}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cf-message">{f.message}</label>
                <textarea
                  id="cf-message"
                  ref={messageRef}
                  className="form-input form-textarea"
                  name="message"
                  value={fields.message}
                  onChange={handleChange('message')}
                  onBlur={handleBlur('message')}
                  placeholder={f.message_placeholder}
                  rows={7}
                  required
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={describedBy('message')}
                  disabled={sending}
                />
                {errors.message && <p id="cf-message-error" className="field-error">{f[errors.message]}</p>}
              </div>

              {/* Anti-spam trap: invisible to people, filled in by bots. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="cf-honey">{f.honeypot}</label>
                <input id="cf-honey" ref={honeypotRef} type="text" name="_honey" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              {status === 'error' && (
                <p className="form-error" role="alert">
                  {f.error} <a href={`mailto:${EMAIL}`} className="form-error-link">{EMAIL}</a>
                </p>
              )}

              <button type="submit" className="form-submit" disabled={sending}>
                {sending ? f.sending : f.send}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
