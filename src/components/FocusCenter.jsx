import FocusScoreRing from './FocusScoreRing.jsx'
import EyeBreakTimer from './EyeBreakTimer.jsx'

export default function FocusCenter({ focusPct, isFocused, isRunning, lookAwaySeconds, trivia }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 px-10 bg-bg">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-textPrimary mb-2">Let's focus together</h1>
        <p className="text-sm text-textSecondary">Your session runs privately on this device.</p>
      </div>

      <p className="text-xs text-textSecondary text-center leading-relaxed max-w-xs">
        Minimize freely. We don't leave.<br />Your focus partner runs up your sleeve.
      </p>

      <FocusScoreRing pct={focusPct} isFocused={isFocused} isRunning={isRunning} />

      <EyeBreakTimer lookAwaySeconds={lookAwaySeconds} isRunning={isRunning} />

      <div className="bg-card border border-white/5 rounded-2xl px-6 py-5 max-w-sm w-full shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        {trivia ? (
          <>
            <p className="text-xs font-medium text-accent mb-2 tracking-wide">{trivia.tag}</p>
            <p className="text-sm text-textSecondary leading-relaxed">{trivia.text}</p>
          </>
        ) : (
          <p className="text-sm text-textSecondary leading-relaxed italic">Start your session to unlock trivia.</p>
        )}
      </div>
    </main>
  )
}
