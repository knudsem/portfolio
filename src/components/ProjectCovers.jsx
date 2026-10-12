// Illustrated covers for the project cards, drawn in SVG and animated in CSS
// (see "Project covers" in App.css). They are illustrations of what each
// project is about, not screenshots. Animations play while the card is
// hovered or focused, and once, for a few seconds, when the cover first
// scrolls into view (see Work.jsx).

// AccessEU: a web page swept by an accessibility scan. Issues are flagged,
// then checked off as the scan line passes over them.
const Issue = ({ x, y, delay }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="7" className="cv-issue" />
    <path d="M0 -3.4 V0.6 M0 3.2 V3.4" className="cv-issue-mark" />
    <g className="cv-badge" style={{ '--d': `${delay}s` }}>
      <circle r="8" className="cv-fill-accent" />
      <path d="M-3.5 0.2 L-1 2.8 L3.8 -2.6" className="cv-check" />
    </g>
  </g>
)

function Scanner() {
  return (
    <svg viewBox="0 0 400 180" focusable="false">
      <defs>
        <clipPath id="cv-scan-clip"><rect x="81" y="37" width="238" height="128" rx="2" /></clipPath>
        <linearGradient id="cv-scan-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <rect x="80" y="16" width="240" height="150" rx="10" className="cv-window" />
      <path d="M80 36 H320" className="cv-stroke" />
      <circle cx="95" cy="26" r="3" className="cv-fill-dim" />
      <circle cx="105" cy="26" r="3" className="cv-fill-dim" />
      <circle cx="115" cy="26" r="3" className="cv-fill-dim" />
      <rect x="96" y="48" width="118" height="10" rx="3" className="cv-fill-mid" />
      <rect x="96" y="66" width="176" height="6" rx="3" className="cv-fill-dim" />
      <rect x="96" y="78" width="146" height="6" rx="3" className="cv-fill-dim" />
      <rect x="96" y="94" width="88" height="52" rx="5" className="cv-fill-low" />
      <path d="M104 136 L124 116 L138 128 L150 118 L176 140" className="cv-stroke" />
      <rect x="196" y="98" width="100" height="6" rx="3" className="cv-fill-dim" />
      <rect x="196" y="110" width="78" height="6" rx="3" className="cv-fill-dim" />
      <rect x="196" y="128" width="58" height="16" rx="8" className="cv-fill-mid" />
      {/* The clip stays on a still wrapper: on the moving group it would move too */}
      <g clipPath="url(#cv-scan-clip)">
        <g className="cv-scan">
          <rect x="80" y="12" width="240" height="26" fill="url(#cv-scan-grad)" />
          <path d="M80 38 H320" className="cv-stroke-accent" />
        </g>
      </g>
      <Issue x={232} y={53} delay={0.25} />
      <Issue x={196} y={120} delay={1.3} />
      <Issue x={270} y={136} delay={1.55} />
    </svg>
  )
}

// Interdyn: a dealer ordering dashboard with live looking figures.
function Dashboard() {
  const bars = [[30, 0.6, 1.25], [46, 1.2, 0.7], [24, 1.6, 1.1], [52, 0.75, 1.15], [38, 1.3, 0.8]]
  return (
    <svg viewBox="0 0 400 180" focusable="false">
      <rect x="70" y="16" width="260" height="150" rx="10" className="cv-window" />
      <path d="M124 16 V166" className="cv-stroke" />
      <rect x="84" y="34" width="28" height="6" rx="3" className="cv-fill-dim" />
      <rect x="84" y="48" width="22" height="6" rx="3" className="cv-fill-accent cv-dim-accent" />
      <rect x="84" y="62" width="26" height="6" rx="3" className="cv-fill-dim" />
      <rect x="84" y="76" width="18" height="6" rx="3" className="cv-fill-dim" />
      {bars.map(([h, a, b], i) => (
        <rect
          key={i}
          x={142 + i * 22}
          y={98 - h}
          width="13"
          height={h}
          rx="3"
          className={`cv-bar${i === 3 ? ' cv-fill-accent' : ' cv-fill-mid'}`}
          style={{ '--i': i, '--a': a, '--b': b }}
        />
      ))}
      <path d="M136 98 H252" className="cv-stroke" />
      <rect x="266" y="34" width="50" height="64" rx="7" className="cv-fill-low" />
      <rect x="276" y="46" width="30" height="12" rx="3" className="cv-fill-accent cv-dim-accent" />
      <rect x="276" y="66" width="22" height="5" rx="2.5" className="cv-fill-dim" />
      <rect x="276" y="78" width="28" height="5" rx="2.5" className="cv-fill-dim" />
      {[112, 130, 148].map((y, i) => (
        <g key={y} style={{ '--i': i }}>
          <rect x="140" y={y - 3} width={[92, 70, 82][i]} height="6" rx="3" className="cv-fill-dim" />
          <rect x="274" y={y - 6.5} width="42" height="13" rx="6.5" className="cv-pill" />
        </g>
      ))}
    </svg>
  )
}

// Pro-Ject Australia: a turntable. The arm drops and the record spins.
function Turntable() {
  return (
    <svg viewBox="0 0 400 180" focusable="false">
      <rect x="70" y="16" width="260" height="150" rx="12" className="cv-window" />
      <circle cx="168" cy="91" r="66" className="cv-plinth" />
      <g className="cv-platter">
        <circle cx="168" cy="91" r="62" className="cv-record" />
        {[55, 48, 41, 34, 27].map((r) => <circle key={r} cx="168" cy="91" r={r} className="cv-groove" />)}
        <circle cx="168" cy="91" r="17" className="cv-fill-accent" />
        <path d="M158 97 H178" className="cv-label-mark" />
        <path d="M162 102 H174" className="cv-label-mark cv-label-soft" />
      </g>
      {/* The light stays still while the record turns under it */}
      <path d="M168 33 A58 58 0 0 1 216 60" className="cv-shine" />
      <path d="M120 128 A58 58 0 0 1 112 106" className="cv-shine cv-shine-soft" />
      <circle cx="168" cy="91" r="2.5" className="cv-spindle" />
      <g className="cv-arm">
        <circle cx="292" cy="40" r="11" className="cv-pivot" />
        <circle cx="292" cy="40" r="4" className="cv-fill-dim" />
        <path d="M292 40 L287 118 L264 140" className="cv-tonearm" />
        <rect x="255" y="135" width="16" height="10" rx="2" className="cv-fill-accent" transform="rotate(-42 263 140)" />
      </g>
      <circle cx="312" cy="148" r="6" className="cv-knob" />
      <circle cx="292" cy="148" r="6" className="cv-knob" />
    </svg>
  )
}

// Pro-Ject Audio Systems: a worldwide multilingual site, as a turning globe.
// Eight meridians, an eighth of a turn apart. Each one is the front half of
// a circle seen from the side, so its width is the cosine of its angle; the
// ones on the far side are hidden. These are also the still positions.
const MERIDIANS = Array.from({ length: 8 }, (_, p) => {
  const angle = (p * Math.PI) / 4
  return { sx: Math.abs(Math.cos(angle)) < 0.01 ? 0.01 : Number(Math.cos(angle).toFixed(3)), shown: angle <= Math.PI }
})

function Globe() {
  const langs = ['EN', 'DE', 'FR', 'IT', 'ES']
  return (
    <svg viewBox="0 0 400 180" focusable="false">
      <g transform="translate(176 90)">
        {/* Back half of the orbit, hidden behind the globe in the middle */}
        <g transform="rotate(-16)">
          <path d="M96 0 A96 24 0 0 0 -96 0" pathLength="100" className="cv-orbit" />
        </g>
        <circle r="64" className="cv-globe" />
        {[-48, -26, 0, 26, 48].map((y) => (
          <path key={y} d={`M${-Math.sqrt(64 * 64 - y * y)} ${y} H${Math.sqrt(64 * 64 - y * y)}`} className="cv-stroke" />
        ))}
        {MERIDIANS.map(({ sx, shown }, p) => (
          <path
            key={p}
            d="M0 -64 A64 64 0 0 0 0 64"
            className={`cv-meridian${p === 1 ? ' is-accent' : ''}`}
            style={{ '--p': p, '--sx': sx, '--o': shown ? 1 : 0 }}
          />
        ))}
        <circle r="64" className="cv-globe-rim" />
        {/* Front half of the orbit, drawn over the globe */}
        <g transform="rotate(-16)">
          <path d="M-96 0 A96 24 0 0 0 96 0" pathLength="100" className="cv-orbit" />
        </g>
      </g>
      {langs.map((l, i) => (
        <g key={l} style={{ '--i': i }} transform={`translate(282 ${34 + i * 26})`}>
          <rect width="40" height="18" rx="9" className={`cv-lang-chip${i === 2 ? ' is-current' : ''}`} />
          <text x="20" y="12.5" textAnchor="middle" className={`cv-lang-text${i === 2 ? ' is-current' : ''}`}>{l}</text>
        </g>
      ))}
    </svg>
  )
}

// Exclusive Construction: an architect's elevation that redraws itself.
// One subpath per path, so each line is measured and drawn on its own.
function Blueprint() {
  const lines = [
    ['M84 150 H316'],
    ['M118 150 V94 H282 V150'],
    ['M106 100 L200 44 L294 100'],
    ['M246 72 V50 H262 V82'],
    ['M188 150 V116 H212 V150'],
    ['M134 106 H166 V130 H134 Z', 'M150 106 V130', 'M134 118 H166'],
    ['M234 106 H266 V130 H234 Z', 'M250 106 V130', 'M234 118 H266'],
    ['M118 164 H282', 'M118 160 V168', 'M282 160 V168'],
    ['M332 44 V150', 'M328 44 H336', 'M328 150 H336'],
  ]
  return (
    <svg viewBox="0 0 400 180" focusable="false">
      <defs>
        <pattern id="cv-bp-grid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0 H0 V12" className="cv-bp-grid" />
        </pattern>
      </defs>
      <rect x="64" y="16" width="290" height="158" rx="8" fill="url(#cv-bp-grid)" className="cv-bp-sheet" />
      {lines.flatMap((group, i) => group.map((d) => (
        <path key={d} d={d} pathLength="1" className="cv-bp" style={{ '--d': `${i * 0.12}s` }} />
      )))}
      <circle cx="200" cy="76" r="7" pathLength="1" className="cv-bp" style={{ '--d': '0.5s' }} />
    </svg>
  )
}

// Trimension: an immersive VR studio, as a wireframe cube over a horizon.
function Cube() {
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom']
  return (
    <div className="cv-scene">
      <svg className="cv-floor" viewBox="0 0 400 180" preserveAspectRatio="none" focusable="false">
        <path d="M0 118 H400" className="cv-horizon" />
        {[-260, -160, -60, 40, 140, 240, 340, 440, 540, 640].map((x) => (
          <path key={x} d={`M200 118 L${x} 180`} className="cv-grid-line" />
        ))}
        {[124, 134, 150, 174].map((y) => <path key={y} d={`M0 ${y} H400`} className="cv-grid-line" />)}
      </svg>
      <span className="cv-shadow" />
      <div className="cv-cube">
        {faces.map((f) => <span key={f} className={`cv-face cv-${f}`} />)}
        <div className="cv-cube cv-cube-inner">
          {faces.map((f) => <span key={f} className={`cv-face cv-${f}`} />)}
        </div>
      </div>
    </div>
  )
}

const COVERS = {
  accesseu: Scanner,
  interdyn: Dashboard,
  'project-au': Turntable,
  'project-global': Globe,
  exclusive: Blueprint,
  trimension: Cube,
}

export default function ProjectCover({ id }) {
  const Cover = COVERS[id]
  if (!Cover) return null
  return (
    <div className={`project-cover cover-${id}`} aria-hidden="true">
      <Cover />
    </div>
  )
}
