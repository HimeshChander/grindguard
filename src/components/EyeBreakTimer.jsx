export default function EyeBreakTimer({ lookAwaySeconds, isRunning }) {
  const MAX = 15
  const pct = Math.min((lookAwaySeconds / MAX) * 100, 100)
  const label = isRunning
    ? lookAwaySeconds > MAX
      ? `${Math.round(lookAwaySeconds)}s away`
      : `${Math.round(lookAwaySeconds)}s / ${MAX}s`
    : `0s / ${MAX}s`

  return (
    <div className="w-full max-w-sm">
      <div className="flex justify-between text-xs text-textSecondary mb-2">
        <span className="font-medium">Quick eye break</span>
        <span>{label}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct >= 100 ? '#D8B36A' : '#6B84F8',
          }}
        />
      </div>
    </div>
  )
}
