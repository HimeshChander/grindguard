const RADIUS = 88
const CIRC = 2 * Math.PI * RADIUS

export default function FocusScoreRing({ pct, isFocused, isRunning }) {
  const offset = CIRC - (pct / 100) * CIRC
  const ringColor = !isRunning ? '#2A2F3E' : isFocused ? '#8EB89A' : '#D8B36A'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="110" cy="110" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="110" cy="110" r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="6"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-semibold text-textPrimary">
          {isRunning ? `${pct}%` : '—'}
        </span>
        <span className="text-xs text-textSecondary mt-1">focus score</span>
      </div>
    </div>
  )
}
