const typeStyles = {
  start:  'text-accent',
  end:    'text-textSecondary',
  focus:  'text-success',
  warn:   'text-warning',
  break:  'text-warning',
  info:   'text-textSecondary',
}

export default function ActivityPanel({ log }) {
  return (
    <aside className="w-64 shrink-0 border-r border-white/5 bg-surface flex flex-col p-5 overflow-y-auto">
      <p className="text-xs font-medium text-textSecondary mb-5 tracking-wide">Activity</p>
      {log.length === 0 ? (
        <p className="text-xs text-textSecondary/50 leading-relaxed mt-2">
          Your session events will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {log.map(entry => (
            <div key={entry.id} className="flex flex-col gap-0.5">
              <span className={`text-xs font-medium ${typeStyles[entry.type] || 'text-textSecondary'}`}>
                {entry.text}
              </span>
              <span className="text-[11px] text-textSecondary/40">{entry.time}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
