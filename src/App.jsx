import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as faceapi from '@vladmandic/face-api'

import PrivacyOnboarding from './components/PrivacyOnboarding.jsx'
import CameraPermissionModal from './components/CameraPermissionModal.jsx'
import Navbar from './components/Navbar.jsx'
import ActivityPanel from './components/ActivityPanel.jsx'
import FocusCenter from './components/FocusCenter.jsx'
import RightPanel from './components/RightPanel.jsx'
import SessionCompleteModal from './components/SessionCompleteModal.jsx'

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'

const TRIVIA = {
  morning: [
    { tag: 'Morning Grind',   text: 'Your brain is sharpest in the first 2 hours after waking. You picked the perfect time to grind — make it count!' },
    { tag: 'Rise & Focus',    text: 'Einstein did his best thinking in the morning. You\'re in good company — let\'s get to work.' },
    { tag: 'Brain Science',   text: 'Morning sunlight boosts serotonin and focus. Your body is already set up for a great session — ride it.' },
    { tag: 'Early Bird',      text: 'Studies show early risers score higher on focus tests. You\'re already winning just by being here.' },
    { tag: 'Morning Fact',    text: 'Newton developed calculus during a single summer at home in 1666. One focused morning changed mathematics forever.' },
    { tag: 'Kickstart',       text: 'The first 90 minutes of work are the most cognitively productive. Lock in — this is your golden window.' },
  ],
  afternoon: [
    { tag: 'Afternoon Push',  text: 'The post-lunch slump is real — but so is the 2–5 PM second wind. Push through the dip and you\'ll hit your stride.' },
    { tag: 'Did You Know?',   text: 'Beethoven took a walk every afternoon to clear his mind before his most productive composing sessions. Short reset, big output.' },
    { tag: 'Science Break',   text: 'Penicillin was discovered at 3 PM on a Tuesday by a scientist who almost didn\'t come back from lunch. Keep showing up.' },
    { tag: 'Stay Sharp',      text: 'Attention dips mid-afternoon but recovers fast. A 5-minute stretch and you\'re back to full power — don\'t quit now.' },
    { tag: 'Momentum',        text: 'The Wright Brothers averaged 5 hours of focused afternoon work per day before their 12-second flight changed history.' },
    { tag: 'Afternoon Fact',  text: 'Most Nobel Prize discoveries happened during unglamorous afternoon lab sessions — not sudden sparks of genius.' },
  ],
  evening: [
    { tag: 'Evening Mode',    text: 'Evening study locks in memory better — your brain consolidates what it learned all day while you sleep tonight.' },
    { tag: 'Night Learner',   text: 'Darwin did most of his writing between 4–6 PM. Some of the world\'s greatest ideas were born in the evening grind.' },
    { tag: 'Memory Boost',    text: 'Reviewing material in the evening before sleep boosts retention by up to 40%. You\'re studying at the perfect time.' },
    { tag: 'Evening Fact',    text: 'Ada Lovelace wrote her legendary algorithm late at night after her children were asleep. Dedication finds a way.' },
    { tag: 'Wind Down Wins',  text: 'Your brain is wiring today\'s learning into long-term memory right now. Evening sessions aren\'t less productive — they\'re the finishers.' },
    { tag: 'Evening Push',    text: 'Beethoven\'s 9th Symphony was written in the evenings over months of steady work. Greatness is a habit, not a moment.' },
  ],
  night: [
    { tag: 'Night Owl',       text: 'You\'re up late and still grinding. The quiet hours belong to those who want it most — and you\'re here.' },
    { tag: 'Late Session',    text: 'Tesla worked through the night for decades. He called 3 AM his most creative hour. Own the dark.' },
    { tag: 'Night Science',   text: 'Many breakthrough ideas came to scientists in late-night sessions when distractions finally disappeared. You\'ve got the whole night.' },
    { tag: 'Midnight Oil',    text: 'Marie Curie regularly worked past midnight in her lab. The world didn\'t change during office hours.' },
    { tag: 'Late Fact',       text: 'The moon is 1.3 light-seconds from Earth. In the time it takes light to get there, you can finish one more problem.' },
    { tag: 'Night Grinder',   text: 'While most people sleep, a few keep building. Those few change things. You already know which one you are.' },
  ],
}

function getTimePool() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return TRIVIA.morning
  if (h >= 12 && h < 17) return TRIVIA.afternoon
  if (h >= 17 && h < 21) return TRIVIA.evening
  return TRIVIA.night
}

export default function App() {
  // Screens
  const [screen, setScreen] = useState('onboarding') // onboarding | dashboard
  const [showCamPerm, setShowCamPerm] = useState(false)
  const [showReport, setShowReport] = useState(false)

  // Models
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [loadingText, setLoadingText] = useState('Initializing…')
  const [loadingPct, setLoadingPct] = useState(0)

  // Session state
  const [isRunning, setIsRunning] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [sessionStatus, setSessionStatus] = useState('idle') // idle | active | break

  // Timers (using refs to avoid stale closures)
  const sessionStartRef = useRef(0)
  const lastFaceTimeRef = useRef(0)
  const focusedMsRef = useRef(0)
  const focusStartRef = useRef(null)
  const totalPausedMsRef = useRef(0)
  const totalBreakMsRef = useRef(0)
  const totalDistractionMsRef = useRef(0)
  const distractionStartRef = useRef(null)
  const manualBreakStartRef = useRef(null)
  const distractedShownRef = useRef(false)

  // Trivia
  const triviaIndexRef = useRef(0)
  const [trivia, setTrivia] = useState(() => {
    const pool = getTimePool()
    return pool[0]
  })

  useEffect(() => {
    const id = setInterval(() => {
      const pool = getTimePool()
      triviaIndexRef.current = (triviaIndexRef.current + 1) % pool.length
      setTrivia(pool[triviaIndexRef.current])
    }, 10 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  // Display values
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [focusedSeconds, setFocusedSeconds] = useState(0)
  const [lookAwaySeconds, setLookAwaySeconds] = useState(0)
  const [focusPct, setFocusPct] = useState(0)
  const [distractionCount, setDistractionCount] = useState(0)
  const [breakCount, setBreakCount] = useState(0)
  const [isFocused, setIsFocused] = useState(true)
  const [eyeEmoji, setEyeEmoji] = useState('😴')
  // Activity log
  const [activityLog, setActivityLog] = useState([])

  // Report data
  const [reportData, setReportData] = useState(null)

  // Intervals
  const mainIntervalRef = useRef(null)
  const faceIntervalRef = useRef(null)

  // Camera
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Load models on mount
  useEffect(() => {
    async function load() {
      setLoadingText('Loading face detection…')
      setLoadingPct(20)
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      setLoadingText('Loading landmark model…')
      setLoadingPct(70)
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL)
      setLoadingPct(100)
      setLoadingText('Ready')
      setModelsLoaded(true)
    }
    load().catch(console.error)
  }, [])

  // Helpers
  function eyeAspectRatio(pts) {
    const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
    return (d(pts[1], pts[5]) + d(pts[2], pts[4])) / (2 * d(pts[0], pts[3]))
  }
  function eyeCenter(pts) {
    return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length }
  }
  function isFacingScreen(lm, box) {
    const lc = eyeCenter(lm.getLeftEye())
    const rc = eyeCenter(lm.getRightEye())
    const nose = lm.getNose()
    if (Math.abs(rc.x - lc.x) / box.width < 0.26) return false
    const noseTip = nose[nose.length - 1]
    const eyeMidX = (lc.x + rc.x) / 2
    const eyeSpan = Math.abs(rc.x - lc.x)
    if (Math.abs(noseTip.x - eyeMidX) / eyeSpan > 0.35) return false
    return true
  }

  const addLog = useCallback((text, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setActivityLog(prev => [{ text, type, time, id: Date.now() }, ...prev.slice(0, 49)])
  }, [])

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      return new Promise(resolve => { videoRef.current.onloadedmetadata = resolve })
    }
  }
  function stopCamera() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
  }

  async function detectLoop() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 })
    const detections = await faceapi.detectAllFaces(video, opts).withFaceLandmarks(true)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (detections.length > 0) {
      const det = detections[0]
      const lm = det.landmarks
      const box = det.detection.box
      const leftEye = lm.getLeftEye()
      const rightEye = lm.getRightEye()
      const leftEar = eyeAspectRatio(leftEye)
      const rightEar = eyeAspectRatio(rightEye)
      const eyesOpen = leftEar >= 0.15 || rightEar >= 0.15
      const frontal = isFacingScreen(lm, box)
      const focused = eyesOpen && frontal
      if (focused) lastFaceTimeRef.current = Date.now()
      setEyeEmoji(focused ? '👁️' : eyesOpen ? '↩️' : '😑')
    } else {
      setEyeEmoji('👀')
    }
  }

  function tick() {
    const now = Date.now()
    const rawSession = now - sessionStartRef.current - totalPausedMsRef.current
    const ss = Math.floor(rawSession / 1000)
    setSessionSeconds(ss)

    const awayMs = now - lastFaceTimeRef.current
    const awaySec = awayMs / 1000

    if (awaySec < 2) {
      if (distractedShownRef.current && distractionStartRef.current !== null) {
        const dur = Math.round((now - distractionStartRef.current) / 1000)
        totalDistractionMsRef.current += now - distractionStartRef.current
        addLog(`Focus restored after ${dur}s`, 'focus')
        distractionStartRef.current = null
        distractedShownRef.current = false
      }
      if (focusStartRef.current === null) focusStartRef.current = now
      const fs = Math.floor((focusedMsRef.current + (now - focusStartRef.current)) / 1000)
      setFocusedSeconds(fs)
      setLookAwaySeconds(0)
      setIsFocused(true)
      setFocusPct(ss > 0 ? Math.round((fs / ss) * 100) : 0)
    } else {
      if (focusStartRef.current !== null) {
        focusedMsRef.current += now - focusStartRef.current
        focusStartRef.current = null
      }
      const fs = Math.floor(focusedMsRef.current / 1000)
      setFocusedSeconds(fs)
      setLookAwaySeconds(awaySec)
      setIsFocused(false)
      setFocusPct(ss > 0 ? Math.round((fs / ss) * 100) : 0)

      if (awaySec >= 15 && !distractedShownRef.current) {
        distractedShownRef.current = true
        distractionStartRef.current = lastFaceTimeRef.current
        setDistractionCount(prev => {
          addLog('Distraction detected', 'warn')
          return prev + 1
        })
      }
    }
  }

  async function startSession() {
    if (!modelsLoaded) return
    setShowCamPerm(true)
  }

  async function handleCamAllow() {
    setShowCamPerm(false)
    try {
      await startCamera()
    } catch {
      alert('Camera access required. Please allow and retry.')
      return
    }
    const now = Date.now()
    sessionStartRef.current = now
    lastFaceTimeRef.current = now
    focusedMsRef.current = 0
    focusStartRef.current = null
    totalPausedMsRef.current = 0
    totalBreakMsRef.current = 0
    totalDistractionMsRef.current = 0
    distractionStartRef.current = null
    distractedShownRef.current = false
    manualBreakStartRef.current = null

    setIsRunning(true)
    setIsOnBreak(false)
    setSessionStatus('active')
    setSessionSeconds(0)
    setFocusedSeconds(0)
    setLookAwaySeconds(0)
    setFocusPct(0)
    setDistractionCount(0)
    setBreakCount(0)
    setActivityLog([{ text: 'Session started', type: 'start', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), id: Date.now() }])

    mainIntervalRef.current = setInterval(tick, 1000)
    faceIntervalRef.current = setInterval(detectLoop, 800)
  }

  function endSession() {
    setIsRunning(false)
    clearInterval(mainIntervalRef.current)
    clearInterval(faceIntervalRef.current)

    if (isOnBreak && manualBreakStartRef.current) {
      totalPausedMsRef.current += Date.now() - manualBreakStartRef.current
    }

    stopCamera()
    setSessionStatus('idle')
    setEyeEmoji('😴')
    setIsOnBreak(false)

    const score = sessionSeconds > 0 ? Math.round((focusedSeconds / sessionSeconds) * 100) : 0
    setReportData({
      totalSec: sessionSeconds,
      focusSec: focusedSeconds,
      distractSec: Math.round(totalDistractionMsRef.current / 1000),
      breakSec: Math.round(totalBreakMsRef.current / 1000),
      distractionCount,
      breakCount,
      score,
    })
    setShowReport(true)
    addLog('Session ended', 'end')
  }

  async function toggleBreak() {
    const now = Date.now()
    if (!isOnBreak) {
      if (focusStartRef.current !== null) {
        focusedMsRef.current += now - focusStartRef.current
        focusStartRef.current = null
      }
      manualBreakStartRef.current = now
      setIsOnBreak(true)
      setSessionStatus('break')
      stopCamera()
      addLog('Break started', 'break')
    } else {
      const elapsed = now - manualBreakStartRef.current
      totalPausedMsRef.current += elapsed
      totalBreakMsRef.current += elapsed
      manualBreakStartRef.current = null
      await startCamera()
      lastFaceTimeRef.current = Date.now()
      setIsOnBreak(false)
      setSessionStatus('active')
      setBreakCount(prev => prev + 1)
      addLog('Break ended — focus restored', 'focus')
    }
  }

  // Hide camera on tab hide
  useEffect(() => {
    function onVisibility() {
      if (videoRef.current) {
        videoRef.current.style.visibility = document.hidden ? 'hidden' : 'visible'
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (screen === 'onboarding') {
    return (
      <PrivacyOnboarding
        modelsLoaded={modelsLoaded}
        loadingText={loadingText}
        loadingPct={loadingPct}
        onAccept={() => setScreen('dashboard')}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Navbar sessionStatus={sessionStatus} />
      <div className="flex flex-1 overflow-hidden">
        <ActivityPanel log={activityLog} />
        <FocusCenter
          focusPct={focusPct}
          isFocused={isFocused}
          isRunning={isRunning}
          lookAwaySeconds={lookAwaySeconds}
          trivia={trivia}
        />
        <RightPanel
          videoRef={videoRef}
          canvasRef={canvasRef}
          eyeEmoji={eyeEmoji}
          sessionSeconds={sessionSeconds}
          distractionCount={distractionCount}
          breakCount={breakCount}
          isRunning={isRunning}
          isOnBreak={isOnBreak}
          modelsLoaded={modelsLoaded}
          onStart={startSession}
          onEnd={endSession}
          onToggleBreak={toggleBreak}
        />
      </div>

      {showCamPerm && (
        <CameraPermissionModal
          onAllow={handleCamAllow}
          onDeny={() => setShowCamPerm(false)}
        />
      )}
      {showReport && reportData && (
        <SessionCompleteModal
          data={reportData}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  )
}
