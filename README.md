# GrindGuard 

**Your private, browser-based study companion.**
Beat the distraction, boost your traction.

## What it does

GrindGuard uses your webcam to track whether you're actively focused on your screen. It detects:

- **Eye openness** (Eye Aspect Ratio) — catches when you close your eyes or zone out
- **Gaze direction** — detects when you look away from the screen
- **Pupil position** — tracks iris movement via pixel brightness centroid

When you look away for more than 15 seconds, a distraction event is logged and you get a nudge to refocus.

## Privacy — 100% local

- No recordings. No storage. No uploads.
- All AI runs entirely in your browser via WebAssembly.
- Nothing ever leaves your device.
- No account, no sign-in, no tracking.

## Features

- Live eye-tracking overlay with EAR debug readout
- Session timer (accurate even when tab is in the background)
- Focus score + session report on end
- Break tracking with activity log
- Rotating study tips and trivia
- Distraction counter and look-away progress bar

## Tech stack

- Vanilla JS (ES modules)
- [`@vladmandic/face-api`](https://github.com/vladmandic/face-api) — TinyFaceDetector + 68-point landmark model
- Pure CSS (no framework)
- No build step — just open `index.html`

## Running locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/grindguard.git
cd grindguard

# Serve with any static file server, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> **Note:** Camera access requires HTTPS or `localhost`. Opening `index.html` directly as a `file://` URL will not work due to browser security restrictions.

## Models

Face detection models are loaded from the `@vladmandic/face-api` CDN. No local model files are needed.

## License

MIT
