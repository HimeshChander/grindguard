function toHMS(s) {
  const h = Math.floor(s / 3600).toString().padStart(2, '0')
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
}

export default function SessionCompleteModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-card border border-white/5 rounded-3xl p-8 max-w-sm w-full shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <h2 className="text-lg font-semibold text-textPrimary mb-1">Session complete.</h2>
        <p className="text-sm text-textSecondary mb-6">A quiet step forward.</p>

        <div className="text-center mb-6">
          <p className="text-4xl font-semibold text-accent">{data.score}%</p>
          <p className="text-xs text-textSecondary mt-1">focus score</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Total time',   val: toHMS(data.totalSec),    color: 'text-textPrimary' },
            { label: 'Focused',      val: toHMS(data.focusSec),    color: 'text-success' },
            { label: 'Distractions', val: toHMS(data.distractSec), color: 'text-warning' },
            { label: 'Break time',   val: toHMS(data.breakSec),    color: 'text-textSecondary' },
          ].map((s, i) => (
            <div key={i} className="bg-surface rounded-xl border border-white/5 p-3 text-center">
              <p className={`text-base font-semibold ${s.color} tabular-nums`}>{s.val}</p>
              <p className="text-[11px] text-textSecondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-surface border border-white/10 text-textPrimary rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
