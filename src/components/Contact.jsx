import { useState } from 'react'

const ENDPOINT = 'https://formsubmit.co/ajax/mathiasknudsen31@gmail.com'

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Contact({ t }) {
  const f = t.form
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...fields,
          _subject: `Portfolio contact from ${fields.name}`,
          _captcha: 'false',
        }),
      })
      if (res.ok) {
        setStatus('sent')
        setFields({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact">
      <div className="section-label">{t.nav[3]}</div>

      <div className="contact-layout">

        {/* ── Left col ── */}
        <div className="contact-left">
          <p className="contact-p">{t.contact_p}</p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail-icon"><IconPin /></span>
              <span>{t.contact_location}</span>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon"><IconClock /></span>
              <span>{t.contact_response}</span>
            </div>
            <div className="contact-detail availability">
              <span className="pulse-dot" />
              <span>{t.contact_availability}</span>
            </div>
          </div>
        </div>

        {/* ── Right col — form ── */}
        <div className="contact-right">
          {status === 'sent' ? (
            <div className="contact-success">
              <div className="contact-success-icon"><IconCheck /></div>
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
                    className="form-input"
                    type="text"
                    value={fields.name}
                    onChange={set('name')}
                    placeholder={f.name_placeholder}
                    required
                    disabled={status === 'sending'}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cf-email">{f.email}</label>
                  <input
                    id="cf-email"
                    className="form-input"
                    type="email"
                    value={fields.email}
                    onChange={set('email')}
                    placeholder={f.email_placeholder}
                    required
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cf-message">{f.message}</label>
                <textarea
                  id="cf-message"
                  className="form-input form-textarea"
                  value={fields.message}
                  onChange={set('message')}
                  placeholder={f.message_placeholder}
                  rows={7}
                  required
                  disabled={status === 'sending'}
                />
              </div>

              {status === 'error' && (
                <p className="form-error">{f.error}</p>
              )}

              <button type="submit" className="form-submit" disabled={status === 'sending'}>
                {status === 'sending' ? f.sending : f.send}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
