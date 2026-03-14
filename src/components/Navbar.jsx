export default function Navbar({ sessionStatus }) {
  const statusMap = {
    idle:   { label: 'Idle',     dot: 'bg-textSecondary' },
    active: { label: 'Active',   dot: 'bg-success' },
    break:  { label: 'On break', dot: 'bg-warning' },
  }
  const s = statusMap[sessionStatus] || statusMap.idle

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-surface shrink-0">
      <div className="text-lg font-semibold text-textPrimary tracking-tight">
        Grind<span className="text-accent">Guard</span>
      </div>
      <div className="text-xs text-textSecondary font-medium tracking-wide">
        Privacy-first focus companion
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span className="text-xs text-textSecondary font-medium">{s.label}</span>
      </div>
    </nav>
  )
}
