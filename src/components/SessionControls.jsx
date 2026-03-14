export default function SessionControls({ isRunning, isOnBreak, modelsLoaded, onStart, onEnd, onToggleBreak }) {
  return (
    <div className="flex flex-col gap-2 mt-auto">
      {isRunning && (
        <button
          onClick={onToggleBreak}
          className="w-full py-3 rounded-xl border border-white/10 text-textSecondary text-sm font-medium hover:bg-white/5 transition-colors"
        >
          {isOnBreak ? 'Resume session' : 'Take a break'}
        </button>
      )}
      <button
        onClick={isRunning ? onEnd : onStart}
        disabled={!modelsLoaded}
        className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {!modelsLoaded ? 'Loading models…' : isRunning ? 'End session' : 'Start session'}
      </button>
    </div>
  )
}
