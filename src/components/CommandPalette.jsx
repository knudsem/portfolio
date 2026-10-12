import { useEffect, useId, useMemo, useRef, useState } from 'react'

// Command menu, opened with Ctrl K (Cmd K on a Mac) or the button in the
// header. Built on the native <dialog>: the browser keeps focus inside it,
// hides the page behind it from screen readers and closes it on Escape.
// The text field is a combobox: arrows move through the list, Enter runs
// the highlighted command.

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key])

// "Accessibilité" is found by typing "accessibilite", and so on.
const fold = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const GROUPS = ['go', 'actions']

const ICON_PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  top: <path d="M12 19V5M6 11l6-6 6 6" />,
  message: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  audit: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  link: <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
  lang: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
}

const Icon = ({ name }) => (
  <svg className="cmdk-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {ICON_PATHS[name]}
  </svg>
)

export default function CommandPalette({ t, lang, open, onClose, commands }) {
  const p = t.palette
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const pending = useRef(null)
  const returnFocus = useRef(null)
  const pressedBackdrop = useRef(false)
  const movedByKey = useRef(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const uid = useId()
  const listId = `${uid}-list`
  const optionId = (cmd) => `${uid}-${cmd.id}`

  const results = useMemo(() => {
    const words = fold(query).split(/\s+/).filter(Boolean)
    if (!words.length) return commands
    return commands.filter((cmd) => {
      const text = fold(`${cmd.label} ${cmd.keywords}`)
      return words.every((word) => text.includes(word))
    })
  }, [commands, query])

  const current = results[Math.min(active, results.length - 1)]

  // The dialog follows the open state held by App.
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement
      dialog.showModal()
      inputRef.current.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Keeps the highlighted command visible when moving with the arrows.
  useEffect(() => {
    if (!movedByKey.current) return
    movedByKey.current = false
    if (current) document.getElementById(optionId(current))?.scrollIntoView({ block: 'nearest' })
  })

  // Runs on every close (Escape, button, backdrop, command). Focus goes back
  // where it was, then the chosen command runs, so it can move focus itself.
  const handleClose = () => {
    setQuery('')
    setActive(0)
    onClose()
    const previous = returnFocus.current
    if (previous?.isConnected && previous !== document.body) previous.focus({ preventScroll: true })
    const action = pending.current
    pending.current = null
    if (action) requestAnimationFrame(action)
  }

  const run = (cmd) => {
    if (!cmd) return
    // Copying to the clipboard must happen during the keypress or click.
    if (cmd.instant) cmd.run()
    else pending.current = cmd.run
    dialogRef.current.close()
  }

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return
    const count = results.length
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!count) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      movedByKey.current = true
      setActive((i) => (Math.min(i, count - 1) + step + count) % count)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(current)
    }
  }

  // A click on the dimmed backdrop closes the menu. Both the press and the
  // release must be outside, so selecting text and letting go outside does not.
  const handlePointerDown = (e) => { pressedBackdrop.current = e.target === e.currentTarget }
  const handleClick = (e) => {
    if (e.target === e.currentTarget && pressedBackdrop.current) dialogRef.current.close()
  }

  const countLabel = (n) => fill(new Intl.PluralRules(lang).select(n) === 'one' ? p.count_one : p.count_other, { n })
  let status = ''
  if (query.trim()) status = results.length ? countLabel(results.length) : fill(p.empty, { q: query.trim() })

  return (
    <dialog
      ref={dialogRef}
      className="cmdk"
      aria-label={p.label}
      onClose={handleClose}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div className="cmdk-head">
        <svg className="cmdk-search" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          className="cmdk-input"
          type="text"
          role="combobox"
          aria-label={p.input}
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={current ? optionId(current) : undefined}
          placeholder={p.placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0) }}
          onKeyDown={handleKeyDown}
        />
        {/* Shows "Esc" with a keyboard, a cross on touch screens */}
        <button type="button" className="cmdk-close" onClick={() => dialogRef.current.close()}>
          <span className="cmdk-close-text">Esc</span>
          <span className="sr-only"> {p.close}</span>
          <svg className="cmdk-close-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {results.length > 0 ? (
        // tabIndex -1: the list scrolls, but focus stays in the text field
        <div id={listId} role="listbox" aria-label={p.label} className="cmdk-list" tabIndex={-1}>
          {GROUPS.map((group) => {
            const items = results.filter((cmd) => cmd.group === group)
            if (!items.length) return null
            const labelId = `${uid}-${group}`
            return (
              <div key={group} role="group" aria-labelledby={labelId} className="cmdk-group">
                <div id={labelId} role="presentation" className="cmdk-group-label">
                  {group === 'go' ? p.group_go : p.group_actions}
                </div>
                {items.map((cmd) => (
                  // Options are picked with the arrows from the text field,
                  // or clicked; they never take focus themselves.
                  <div
                    key={cmd.id}
                    id={optionId(cmd)}
                    role="option"
                    aria-selected={cmd === current}
                    lang={cmd.lang}
                    className={`cmdk-option${cmd === current ? ' is-active' : ''}`}
                    onMouseMove={() => { if (cmd !== current) setActive(results.indexOf(cmd)) }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => run(cmd)}
                  >
                    <Icon name={cmd.icon} />
                    <span className="cmdk-label">{cmd.label}</span>
                    {cmd.hint && <span className="cmdk-hint" aria-hidden="true">{cmd.hint}</span>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="cmdk-empty" aria-hidden="true">{status}</p>
      )}

      <div className="cmdk-foot" aria-hidden="true">
        <span><kbd>↑</kbd><kbd>↓</kbd> {p.hint_move}</span>
        <span><kbd>↵</kbd> {p.hint_run}</span>
        <span><kbd>Esc</kbd> {p.hint_close}</span>
      </div>

      <p className="sr-only" role="status">{status}</p>
    </dialog>
  )
}
