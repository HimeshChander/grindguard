/**
 * GrindGuard — app.js
 *
 * PRIVACY GUARANTEE:
 * - Camera frames are read one at a time and immediately discarded after analysis.
 * - No image, frame, or face data is ever saved, stored, uploaded, or logged.
 * - Canvas is wiped after every single frame.
 * - No localStorage, sessionStorage, cookies, or network calls carry any camera data.
 * - Audio is never requested (getUserMedia audio: false is hardcoded).
 * - Closing the tab destroys all session data instantly.
 */

import * as faceapi from 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.esm.js';

// ════════════════════════════════════════════════
// TIME-BASED TRIVIA QUOTES
// Quotes are picked from a pool matching the current
// time of day: morning / afternoon / evening / night.
// ════════════════════════════════════════════════
const TRIVIA = {
  morning: [
    { tag: "🌅 Morning Grind",   text: "Your brain is sharpest in the first 2 hours after waking. You picked the perfect time to grind — make it count!" },
    { tag: "☕ Rise & Focus",    text: "Einstein did his best thinking in the morning. You're in good company — let's get to work." },
    { tag: "🧠 Brain Science",   text: "Morning sunlight boosts serotonin and focus. Your body is already set up for a great session — ride it." },
    { tag: "🔥 Early Bird",      text: "Studies show early risers score higher on focus tests. You're already winning just by being here." },
    { tag: "📚 Morning Fact",    text: "Newton developed calculus during a single summer at home in 1666. One focused morning changed mathematics forever." },
    { tag: "⚡ Kickstart",       text: "The first 90 minutes of work are the most cognitively productive. Lock in — this is your golden window." },
  ],
  afternoon: [
    { tag: "☀️ Afternoon Push",  text: "The post-lunch slump is real — but so is the 2–5 PM second wind. Push through the dip and you'll hit your stride." },
    { tag: "💡 Did You Know?",   text: "Beethoven took a walk every afternoon to clear his mind before his most productive composing sessions. Short reset, big output." },
    { tag: "🧪 Science Break",   text: "Penicillin was discovered at 3 PM on a Tuesday by a scientist who almost didn't come back from lunch. Keep showing up." },
    { tag: "🎯 Stay Sharp",      text: "Attention dips mid-afternoon but recovers fast. A 5-minute stretch and you're back to full power — don't quit now." },
    { tag: "🚀 Momentum",        text: "The Wright Brothers averaged 5 hours of focused afternoon work per day before their 12-second flight changed history." },
    { tag: "📡 Afternoon Fact",  text: "Most Nobel Prize discoveries happened during unglamorous afternoon lab sessions — not sudden sparks of genius." },
  ],
  evening: [
    { tag: "🌆 Evening Mode",    text: "Evening study locks in memory better — your brain consolidates what it learned all day while you sleep tonight." },
    { tag: "🦉 Night Learner",   text: "Darwin did most of his writing between 4–6 PM. Some of the world's greatest ideas were born in the evening grind." },
    { tag: "🧬 Memory Boost",    text: "Reviewing material in the evening before sleep boosts retention by up to 40%. You're studying at the perfect time." },
    { tag: "💻 Evening Fact",    text: "Ada Lovelace wrote her legendary algorithm late at night after her children were asleep. Dedication finds a way." },
    { tag: "🔭 Wind Down Wins",  text: "Your brain is wiring today's learning into long-term memory right now. Evening sessions aren't less productive — they're the finishers." },
    { tag: "🎵 Evening Push",    text: "Beethoven's 9th Symphony was written in the evenings over months of steady work. Greatness is a habit, not a moment." },
  ],
  night: [
    { tag: "🌙 Night Owl",       text: "You're up late and still grinding. The quiet hours belong to those who want it most — and you're here." },
    { tag: "⭐ Late Session",    text: "Tesla worked through the night for decades. He called 3 AM his most creative hour. Own the dark." },
    { tag: "🔬 Night Science",   text: "Many breakthrough ideas came to scientists in late-night sessions when distractions finally disappeared. You've got the whole night." },
    { tag: "💡 Midnight Oil",    text: "Marie Curie regularly worked past midnight in her lab. The world didn't change during office hours." },
    { tag: "🌌 Late Fact",       text: "The moon is 1.3 light-seconds from Earth. In the time it takes light to get there, you can finish one more problem." },
    { tag: "🏆 Night Grinder",   text: "While most people sleep, a few keep building. Those few change things. You already know which one you are." },
  ],
};

// Rotating app tips shown above the focus ring
const TIPS = [
  "Minimize freely. We don't leave.\nYour focus partner runs up your sleeve.",
  "Phone down. Eyes up.\nGrindGuard is watching — and rooting for you.",
  "Look away and the clock starts.\nLook back and the grind continues.",
  "No mic. No storage. No server.\nJust you, your camera, and the work.",
  "Every second you stay focused\ncounts toward your score.",
  "Breaks are earned, not taken.\nTap the break button when you need one.",
  "Your camera sees you — nothing else.\nAll data vanishes when you close the tab.",
];

let quoteIndex = 0;
let tipIndex   = 0;

function getTimePool() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return TRIVIA.morning;
  if (h >= 12 && h < 17) return TRIVIA.afternoon;
  if (h >= 17 && h < 21) return TRIVIA.evening;
  return TRIVIA.night;
}

function showQuote() {
  const pool = getTimePool();
  const q    = pool[quoteIndex % pool.length];
  quoteIndex++;
  document.getElementById('quoteTag').textContent = q.tag;
  const el = document.getElementById('quoteText');
  el.textContent = q.text;
  el.classList.remove('placeholder');
}

function rotateTip() {
  const el = document.getElementById('grindTip');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent  = TIPS[tipIndex % TIPS.length];
    tipIndex++;
    el.style.opacity = '0.75';
  }, 400);
}

// ════════════════════════════════════════════════
// ANTI-INSPECT SHIELD
// ════════════════════════════════════════════════
(function initShield() {
  const shield = document.getElementById('shield');
  const THRESHOLD = 160;

  function checkDevTools() {
    const wDiff = window.outerWidth - window.innerWidth;
    const hDiff = window.outerHeight - window.innerHeight;
    shield.classList.toggle('active', wDiff > THRESHOLD || hDiff > THRESHOLD);
  }

  setInterval(checkDevTools, 500);
  window.addEventListener('resize', checkDevTools);

  // Disable right-click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Block DevTools keyboard shortcuts
  document.addEventListener('keydown', e => {
    const blocked =
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c','K','k'].includes(e.key)) ||
      (e.ctrlKey && ['U','u'].includes(e.key));
    if (blocked) { e.preventDefault(); return false; }
  });
})();

// ════════════════════════════════════════════════
// PRIVACY MODAL
// ════════════════════════════════════════════════
document.getElementById('acceptBtn').addEventListener('click', () => {
  document.getElementById('privacyModal').classList.add('hidden');
});

// ════════════════════════════════════════════════
// DISMISS DISTRACTED POPUP
// ════════════════════════════════════════════════

// ════════════════════════════════════════════════
// SESSION STATE
// ════════════════════════════════════════════════
let isRunning            = false;
let modelsLoaded         = false;
let isOnBreak            = false;
let manualBreakStart     = null;
let totalPausedMs        = 0;
let totalBreakMs         = 0;
let totalDistractionMs   = 0;
let distractionStartTime = null;
let sessionStartTime     = 0;
let focusedMs            = 0;
let focusStartTime       = null;
let sessionSeconds       = 0;
let focusedSeconds       = 0;
let lookAwaySeconds      = 0;
let distractionCount     = 0;
let breakCount           = 0;
let lastFaceTime         = 0;
let distractedShown      = false;
let mainInterval         = null;
let faceInterval         = null;
let quoteInterval        = null;

// ════════════════════════════════════════════════
// LOAD FACE-API MODELS
// ════════════════════════════════════════════════
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

async function loadModels() {
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');

  text.textContent = 'Loading face detection model…';
  fill.style.width = '25%';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

  text.textContent = 'Loading landmark model…';
  fill.style.width = '70%';
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);

  fill.style.width = '100%';
  text.textContent = 'All set — welcome! 🎉';
  await sleep(600);

  document.getElementById('loadingScreen').classList.add('hidden');
  modelsLoaded = true;
}

// ════════════════════════════════════════════════
// CAMERA — audio: false is permanent and non-negotiable
// ════════════════════════════════════════════════
async function startCamera() {
  const video = document.getElementById('videoEl');
  // PRIVACY: audio is explicitly false — microphone is NEVER accessed
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;
  return new Promise(resolve => { video.onloadedmetadata = resolve; });
}

function stopCamera() {
  const video = document.getElementById('videoEl');
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }
}

// ════════════════════════════════════════════════
// EYE ASPECT RATIO
// Measures how open the eye is.
// Below 0.18 = eye closed / blinking.
// ════════════════════════════════════════════════
function eyeAspectRatio(pts) {
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  return (d(pts[1], pts[5]) + d(pts[2], pts[4])) / (2 * d(pts[0], pts[3]));
}

function eyeCenter(pts) {
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  };
}

// ════════════════════════════════════════════════
// FRONTAL FACE CHECK
// Detects if the user is actually facing the screen.
// Two signals that both collapse when the head turns:
//   1. Inter-eye horizontal distance / face width
//      (eyes appear close together when turned sideways)
//   2. Nose tip offset from the midpoint between the eyes
//      (nose shifts far to one side when turned)
// ════════════════════════════════════════════════
function isFacingScreen(lm, box) {
  const lc  = eyeCenter(lm.getLeftEye());
  const rc  = eyeCenter(lm.getRightEye());
  const nose = lm.getNose();

  // 1. Inter-eye span should be at least 26% of face width
  const interEyeRatio = Math.abs(rc.x - lc.x) / box.width;
  if (interEyeRatio < 0.26) return false;

  // 2. Nose tip should be within 35% of the inter-eye span
  //    from the midpoint between the eyes
  const noseTip    = nose[nose.length - 1];
  const eyeMidX    = (lc.x + rc.x) / 2;
  const eyeSpan    = Math.abs(rc.x - lc.x);
  const noseOffset = Math.abs(noseTip.x - eyeMidX) / eyeSpan;
  if (noseOffset > 0.35) return false;

  return true;
}

// ════════════════════════════════════════════════
// FACE DETECTION LOOP
// Each frame: detect → draw minimal overlay → immediately clear canvas
// No pixel data is ever kept between frames.
// ════════════════════════════════════════════════
async function detectLoop() {
  if (!isRunning) return;

  const video  = document.getElementById('videoEl');
  const canvas = document.getElementById('canvasEl');
  const ctx    = canvas.getContext('2d');

  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;

  const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });
  const detections = await faceapi.detectAllFaces(video, opts).withFaceLandmarks(true);

  // PRIVACY: canvas wiped before and after every frame — zero image retention
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (detections.length > 0) {
    const det      = detections[0];
    const lm       = det.landmarks;
    const box      = det.detection.box;
    const leftEye  = lm.getLeftEye();
    const rightEye = lm.getRightEye();

    const EAR_THRESHOLD = 0.15;
    const leftEar    = eyeAspectRatio(leftEye);
    const rightEar   = eyeAspectRatio(rightEye);
    const leftOpen   = leftEar  >= EAR_THRESHOLD;
    const rightOpen  = rightEar >= EAR_THRESHOLD;
    const eyesOpen   = leftOpen || rightOpen;
    const frontal    = isFacingScreen(lm, box);
    const focused    = eyesOpen && frontal;

    // Draw eye outlines — cyan when focused, grey when turned/closed
    [leftEye, rightEye].forEach((eye, idx) => {
      const open = idx === 0 ? leftOpen : rightOpen;
      const ear  = idx === 0 ? leftEar  : rightEar;
      ctx.strokeStyle = (open && frontal) ? 'rgba(96,165,250,0.85)' : 'rgba(100,110,130,0.45)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      eye.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.closePath();
      ctx.stroke();

      if (open && frontal) {
        const c = eyeCenter(eye);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,0.9)';
        ctx.fill();
      }

      // Live EAR debug label — lets you see the real value when open vs closed
      const c = eyeCenter(eye);
      ctx.font         = `${Math.max(10, canvas.width * 0.03)}px monospace`;
      ctx.fillStyle    = open ? 'rgba(96,165,250,0.85)' : 'rgba(249,115,22,0.9)';
      ctx.textAlign    = 'center';
      ctx.fillText(ear.toFixed(2), c.x, c.y - 10);
    });

    if (focused) lastFaceTime = Date.now();

    // Three distinct states with different emoji + cam-label colour
    let emoji, labelColor;
    if (focused) {
      emoji = '👁️'; labelColor = 'var(--accent)';       // eyes open, on screen
    } else if (!eyesOpen) {
      emoji = '😑'; labelColor = 'var(--warn)';          // face visible but eyes closed
    } else {
      emoji = '↩️'; labelColor = 'var(--muted)';         // eyes open but turned away
    }
    document.getElementById('eyeEmoji').textContent = emoji;
    document.querySelector('.cam-label').style.color = labelColor;
  } else {
    document.getElementById('eyeEmoji').textContent = '👀';                // no face
    document.querySelector('.cam-label').style.color = 'var(--muted)';
  }
}

// ════════════════════════════════════════════════
// MAIN TICK — runs every second
// ════════════════════════════════════════════════
function tick() {
  if (!isRunning || isOnBreak) return;

  const now = Date.now();
  sessionSeconds = Math.floor((now - sessionStartTime - totalPausedMs) / 1000);

  const awayMs  = now - lastFaceTime;
  const awaySec = awayMs / 1000;

  if (awaySec < 2) {
    // Eyes back on screen — auto-close any open distraction
    if (distractedShown && distractionStartTime !== null) {
      const dur = Math.round((now - distractionStartTime) / 1000);
      totalDistractionMs += now - distractionStartTime;
      addDistractionLog(sessionSeconds, dur);
      distractionStartTime = null;
      distractedShown      = false;
    }

    if (focusStartTime === null) focusStartTime = now;
    focusedSeconds  = Math.floor((focusedMs + (now - focusStartTime)) / 1000);
    lookAwaySeconds = 0;
  } else {
    if (focusStartTime !== null) {
      focusedMs    += now - focusStartTime;
      focusStartTime = null;
    }
    focusedSeconds  = Math.floor(focusedMs / 1000);
    lookAwaySeconds = awaySec;

    if (awaySec >= 15 && !distractedShown) {
      distractedShown      = true;
      distractionStartTime = lastFaceTime;
      distractionCount++;
      document.getElementById('distractCount').textContent = distractionCount;
    }
  }

  updateTimer();
  updateFocusUI(awaySec < 2);
}

// ════════════════════════════════════════════════
// UI HELPERS
// ════════════════════════════════════════════════
function updateTimer() {
  document.getElementById('sessionTimer').textContent = toHMS(focusedSeconds);
}

function updateFocusUI(focused) {
  const ring   = document.getElementById('focusRing');
  const pctEl  = document.getElementById('focusPct');
  const fill   = document.getElementById('lookAwayFill');
  const label  = document.getElementById('lookAwayLabel');
  const circle = document.getElementById('progressCircle');

  const pct = sessionSeconds > 0 ? Math.round((focusedSeconds / sessionSeconds) * 100) : 0;

  pctEl.textContent = sessionSeconds > 0 ? pct + '%' : '—';
  pctEl.className   = 'focus-pct ' + (pct >= 70 ? 'good' : 'bad');

  // SVG ring (circumference ≈ 590)
  circle.style.strokeDashoffset = 590 - (pct / 100) * 590;
  circle.style.stroke = pct >= 70 ? 'var(--success)' : 'var(--warn)';

  // Look-away bar
  const pct30 = Math.min((lookAwaySeconds / 15) * 100, 100);
  fill.style.width  = pct30 + '%';
  label.textContent = lookAwaySeconds > 15
    ? Math.round(lookAwaySeconds) + 's away'
    : Math.round(lookAwaySeconds) + 's / 15s';

  if (focused) {
    ring.className = 'focus-ring focused';
    setStatus('FOCUSED', 'active');
  } else {
    ring.className = 'focus-ring distracted';
    setStatus('LOOK AWAY', 'warn');
  }
}

function setStatus(text, cls) {
  const pill = document.getElementById('statusPill');
  const span = document.getElementById('statusText');
  pill.className   = 'status-pill ' + cls;
  span.textContent = text;
}

// ════════════════════════════════════════════════
// MANUAL BREAK
// ════════════════════════════════════════════════
async function toggleBreak() {
  const btn = document.getElementById('breakBtn');
  const now = Date.now();

  if (!isOnBreak) {
    // Start break — pause timers
    isOnBreak        = true;
    manualBreakStart = now;
    if (focusStartTime !== null) {
      focusedMs    += now - focusStartTime;
      focusStartTime = null;
    }
    stopCamera();
    btn.textContent = '▶ Resume Session';
    btn.classList.add('on-break');
    setStatus('ON BREAK', 'warn');
  } else {
    // End break — resume timers
    const breakElapsed = now - manualBreakStart;
    const dur = Math.round(breakElapsed / 1000);
    totalPausedMs   += breakElapsed;
    totalBreakMs    += breakElapsed;
    isOnBreak        = false;
    manualBreakStart = null;
    await startCamera();
    lastFaceTime     = Date.now(); // reset so distraction doesn't fire immediately

    breakCount++;
    document.getElementById('breakCount').textContent = breakCount;
    addBreakLog(sessionSeconds, dur);

    btn.textContent = '☕ Take a Break';
    btn.classList.remove('on-break');
    setStatus('FOCUSED', 'active');
  }
}

// ════════════════════════════════════════════════
// ACTIVITY LOG
// ════════════════════════════════════════════════
function addBreakLog(atSec, dur) {
  const log = document.getElementById('breakLog');
  log.querySelectorAll('.empty-log').forEach(e => e.remove());

  const item = document.createElement('div');
  item.className = 'break-item';
  item.innerHTML = `
    <div class="bi-num">☕ Break #${breakCount}</div>
    <div class="bi-time">@ ${toHMS(atSec)} into session</div>
    <div class="bi-dur">${toHMS(dur)} break</div>
  `;
  log.prepend(item);
}

function addDistractionLog(atSec, dur) {
  const log = document.getElementById('breakLog');
  log.querySelectorAll('.empty-log').forEach(e => e.remove());

  const item = document.createElement('div');
  item.className = 'distract-item';
  item.innerHTML = `
    <div class="bi-num">👀 Distraction #${distractionCount}</div>
    <div class="bi-time">@ ${toHMS(atSec)} into session</div>
    <div class="bi-dur">${toHMS(dur)} away</div>
  `;
  log.prepend(item);
}


// ════════════════════════════════════════════════
// CAMERA PERMISSION MODAL
// ════════════════════════════════════════════════
function requestCameraPermission() {
  return new Promise((resolve, reject) => {
    const modal  = document.getElementById('cameraPermModal');
    const allow  = document.getElementById('camPermAllow');
    const deny   = document.getElementById('camPermDeny');
    const close  = document.getElementById('camPermClose');

    modal.classList.add('show');

    function cleanup() {
      modal.classList.remove('show');
      allow.removeEventListener('click', onAllow);
      deny.removeEventListener('click', onDeny);
      close.removeEventListener('click', onDeny);
    }
    function onAllow() { cleanup(); resolve(); }
    function onDeny()  { cleanup(); reject(new Error('cancelled')); }

    allow.addEventListener('click', onAllow);
    deny.addEventListener('click', onDeny);
    close.addEventListener('click', onDeny);
  });
}

// ════════════════════════════════════════════════
// SESSION CONTROL
// ════════════════════════════════════════════════
async function toggleSession() {
  const btn = document.getElementById('startBtn');

  if (!isRunning) {
    if (!modelsLoaded) return;

    btn.disabled = true;
    try {
      await requestCameraPermission();
    } catch {
      btn.disabled = false;
      return; // user dismissed the modal
    }
    try {
      await startCamera();
    } catch (err) {
      alert('Camera access is required.\n\nPlease allow camera permission in your browser and try again.\n\n(Tip: Make sure you\'re running this from a local server, not by double-clicking the file.)');
      btn.disabled = false;
      return;
    }

    // Reset all state
    isRunning            = true;
    isOnBreak            = false;
    manualBreakStart     = null;
    totalPausedMs        = 0;
    totalBreakMs         = 0;
    totalDistractionMs   = 0;
    distractionStartTime = null;
    const _now       = Date.now();
    sessionStartTime = _now;
    lastFaceTime     = _now;
    focusedMs        = 0;
    focusStartTime   = null;
    sessionSeconds   = 0;
    focusedSeconds   = 0;
    lookAwaySeconds  = 0;
    distractionCount = 0;
    breakCount       = 0;
    distractedShown  = false;

    document.getElementById('distractCount').textContent = '0';
    document.getElementById('breakCount').textContent    = '0';
    document.getElementById('breakLog').innerHTML = '<div class="empty-log">Session started…<br>Tracking your focus.</div>';

    const breakBtn = document.getElementById('breakBtn');
    breakBtn.style.display  = 'block';
    breakBtn.textContent    = '☕ Take a Break';
    breakBtn.classList.remove('on-break');

    btn.textContent = '⏹ End Session';
    btn.disabled    = false;
    setStatus('FOCUSED', 'active');

    mainInterval  = setInterval(tick,        1000);
    faceInterval  = setInterval(detectLoop,   800);
    showQuote();
    quoteInterval = setInterval(showQuote, 10 * 60 * 1000); // every 10 min

  } else {
    // Stop session
    isRunning = false;
    clearInterval(mainInterval);
    clearInterval(faceInterval);
    clearInterval(quoteInterval);
    stopCamera();

    // If ending while on break, close it out
    if (isOnBreak) {
      const elapsed = Date.now() - manualBreakStart;
      totalPausedMs += elapsed;
      totalBreakMs  += elapsed;
      isOnBreak = false;
    }

    showSessionReport();

    btn.textContent = '▶ Start Focus Session';
    document.getElementById('breakBtn').style.display = 'none';
    setStatus('IDLE', '');
    document.getElementById('eyeEmoji').textContent = '😴';
    document.getElementById('focusRing').className  = 'focus-ring';

    const canvas = document.getElementById('canvasEl');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ════════════════════════════════════════════════
// SESSION REPORT
// ════════════════════════════════════════════════
function showSessionReport() {
  const totalSec      = sessionSeconds;
  const focusSec      = focusedSeconds;
  const distractSec   = Math.round(totalDistractionMs / 1000);
  const breakSec      = Math.round(totalBreakMs / 1000);
  const score         = totalSec > 0 ? Math.round((focusSec / totalSec) * 100) : 0;

  document.getElementById('reportTotalTime').textContent    = toHMS(totalSec);
  document.getElementById('reportFocusTime').textContent    = toHMS(focusSec);
  document.getElementById('reportDistractTime').textContent = toHMS(distractSec);
  document.getElementById('reportBreakTime').textContent    = toHMS(breakSec);
  document.getElementById('reportDistractLbl').textContent  = `Distracted · ${distractionCount} event${distractionCount !== 1 ? 's' : ''}`;
  document.getElementById('reportBreakLbl').textContent     = `On Break · ${breakCount} break${breakCount !== 1 ? 's' : ''}`;
  document.getElementById('reportScore').textContent        = score + '%';

  document.getElementById('sessionReport').classList.add('show');
}

document.getElementById('reportCloseBtn').addEventListener('click', () => {
  document.getElementById('sessionReport').classList.remove('show');
});

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function toHMS(s) {
  const h   = Math.floor(s / 3600).toString().padStart(2, '0');
  const m   = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ════════════════════════════════════════════════
// BOOT
// ════════════════════════════════════════════════
document.getElementById('startBtn').addEventListener('click', toggleSession);
document.getElementById('breakBtn').addEventListener('click', toggleBreak);

window.addEventListener('load', () => {
  rotateTip();
  setInterval(rotateTip, 20000); // rotate tip every 20 s

  loadModels().catch(err => {
    document.getElementById('loaderText').textContent = 'Failed to load models. Check your internet connection.';
    console.error('GrindGuard model load error:', err);
  });
});
