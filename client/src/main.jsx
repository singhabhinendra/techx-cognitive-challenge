import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { flushPendingScores } from './utils/api'
import { resumeAudioContext } from './utils/sound'

// flush any queued score submissions (best-effort)
flushPendingScores().catch(() => {})

// Ensure audio context can be resumed after a user gesture when audio is enabled
function resumeAudioOnGesture() {
  try {
    const enabled = (() => { try { const v = localStorage.getItem('tx_audio'); return v === null ? true : v === '1' } catch (e) { return true } })()
    if (!enabled) return
    const tryResume = async () => {
      try {
        await resumeAudioContext()
      } catch (e) {}
      window.removeEventListener('pointerdown', tryResume)
    }
    window.addEventListener('pointerdown', tryResume, { once: true })
  } catch (e) {}
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

resumeAudioOnGesture()
