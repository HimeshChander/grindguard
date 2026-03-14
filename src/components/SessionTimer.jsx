function toHMS(s) {
  const h = Math.floor(s / 3600).toString().padStart(2, '0')
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
}

export default function SessionTimer({ seconds }) {
  return (
    <div className="bg-card rounded-2xl border border-white/5 px-4 py-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <p className="text-xs text-textSecondary mb-1 font-medium">Session time</p>
      <p className="text-3xl font-semibold text-textPrimary tracking-widest tabular-nums">
        {toHMS(seconds)}
      </p>
    </div>
  )
}
