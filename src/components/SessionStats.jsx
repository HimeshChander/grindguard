export default function SessionStats({ distractionCount, breakCount }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card rounded-2xl border border-white/5 px-3 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <p className="text-2xl font-semibold text-warning">{distractionCount}</p>
        <p className="text-[11px] text-textSecondary mt-1">Distractions</p>
      </div>
      <div className="bg-card rounded-2xl border border-white/5 px-3 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <p className="text-2xl font-semibold text-textPrimary">{breakCount}</p>
        <p className="text-[11px] text-textSecondary mt-1">Breaks</p>
      </div>
    </div>
  )
}
