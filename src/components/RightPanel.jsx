import CameraPanel from './CameraPanel.jsx'
import SessionTimer from './SessionTimer.jsx'
import SessionStats from './SessionStats.jsx'
import SessionControls from './SessionControls.jsx'

export default function RightPanel({
  videoRef, canvasRef, eyeEmoji,
  sessionSeconds, distractionCount, breakCount,
  isRunning, isOnBreak, modelsLoaded,
  onStart, onEnd, onToggleBreak,
}) {
  return (
    <aside className="w-72 shrink-0 border-l border-white/5 bg-surface flex flex-col p-5 gap-4 overflow-y-auto">
      <CameraPanel videoRef={videoRef} canvasRef={canvasRef} eyeEmoji={eyeEmoji} />
      <SessionTimer seconds={sessionSeconds} />
      <SessionStats distractionCount={distractionCount} breakCount={breakCount} />
      <SessionControls
        isRunning={isRunning}
        isOnBreak={isOnBreak}
        modelsLoaded={modelsLoaded}
        onStart={onStart}
        onEnd={onEnd}
        onToggleBreak={onToggleBreak}
      />
    </aside>
  )
}
