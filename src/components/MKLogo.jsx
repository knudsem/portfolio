// Geometric MK monogram — vectorized from original logo.
// Uses `fill` so you can pass any color or use CSS currentColor.
export default function MKLogo({ size = 48, color = 'currentColor', className = '' }) {
  const h = size * (210 / 280)

  return (
    <svg
      viewBox="0 0 280 210"
      width={size}
      height={h}
      fill={color}
      className={className}
      aria-label="MK"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── M ───────────────────────────────────────────── */}

      {/* Left outer leg */}
      <polygon points="0,0 28,0 28,210 0,210" />

      {/* Left inner arm — tapers to V bottom */}
      <polygon points="48,0 76,0 83,210" />

      {/* Right inner arm — tapers to same V bottom */}
      <polygon points="90,0 118,0 83,210" />

      {/* Right outer leg */}
      <polygon points="138,0 166,0 166,210 138,210" />

      {/* ── K ───────────────────────────────────────────── */}

      {/* Vertical bar */}
      <polygon points="174,0 202,0 202,210 174,210" />

      {/* Upper arm — diagonal from gap to top-right corner */}
      <polygon points="222,0 280,0 280,54 222,98" />

      {/* Lower arm — mirror of upper arm */}
      <polygon points="222,112 280,156 280,210 222,210" />
    </svg>
  )
}
