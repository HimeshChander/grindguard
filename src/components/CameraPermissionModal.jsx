export default function CameraPermissionModal({ onAllow, onDeny }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-card border border-white/5 rounded-3xl p-8 max-w-sm w-full shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B84F8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
        </div>
        <h2 className="text-base font-semibold text-textPrimary mb-2">Allow camera access</h2>
        <p className="text-sm text-textSecondary leading-relaxed mb-6">
          The camera is used only to estimate eye focus in real time.
          No video is recorded or stored.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onAllow}
            className="w-full py-3 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Allow camera
          </button>
          <button
            onClick={onDeny}
            className="w-full py-3 text-textSecondary text-sm font-medium hover:text-textPrimary transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
