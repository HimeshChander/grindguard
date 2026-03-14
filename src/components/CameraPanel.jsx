export default function CameraPanel({ videoRef, canvasRef, eyeEmoji }) {
  return (
    <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay muted playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />
        <span className="absolute top-2 right-2 text-lg">{eyeEmoji}</span>
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-textPrimary">Camera</span>
        <span className="text-[11px] text-textSecondary">Live locally · never stored</span>
      </div>
    </div>
  )
}
