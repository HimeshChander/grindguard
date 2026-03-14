const promises = [
  { icon: '○', title: 'Zero recordings', desc: 'Your camera feed is analyzed frame by frame and immediately discarded. Nothing is ever saved.' },
  { icon: '○', title: 'Nothing stored', desc: 'No data is written to disk, localStorage, or any database.' },
  { icon: '○', title: 'Runs entirely locally', desc: 'All AI inference happens inside your browser. No server receives any data.' },
  { icon: '○', title: 'Microphone never accessed', desc: 'Only your camera is requested. The microphone is never touched.' },
  { icon: '○', title: 'No account required', desc: 'GrindGuard does not know who you are, and never will.' },
]

export default function PrivacyOnboarding({ modelsLoaded, loadingText, loadingPct, onAccept }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-card border border-white/5 rounded-3xl p-10 max-w-md w-full shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <div className="mb-8">
          <div className="text-2xl font-semibold text-textPrimary mb-1">
            Grind<span className="text-accent">Guard</span>
          </div>
          <h2 className="text-xl font-semibold text-textPrimary mt-4 leading-snug">
            A study companion that stays private.
          </h2>
          <p className="text-sm text-textSecondary mt-2 leading-relaxed">
            Ready when you are. Everything runs on your device.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {promises.map((p, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <div>
                <p className="text-sm font-medium text-textPrimary">{p.title}</p>
                <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {!modelsLoaded ? (
          <div>
            <div className="flex justify-between text-xs text-textSecondary mb-2">
              <span>{loadingText}</span>
              <span>{loadingPct}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${loadingPct}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={onAccept}
            className="w-full py-3.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            I understand — let's focus
          </button>
        )}

        <p className="text-[11px] text-textSecondary/50 text-center mt-4 leading-relaxed">
          Camera access is for this tab only · Revoke anytime in browser settings
        </p>
      </div>
    </div>
  )
}
