import React, { useEffect, useState } from 'react'
import { resumeAudioContext, playTone } from '../utils/sound'
import Toast from './Toast'

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const v = localStorage.getItem('tx_audio')
      return v === null ? true : v === '1'
    } catch (e) {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('tx_audio', enabled ? '1' : '0')
    } catch (e) {}
  }, [enabled])

  const [toast, setToast] = useState('')

  return (
    <>
    <button
      onClick={async () => {
        const newVal = !enabled
        setEnabled(newVal)
        try {
          if (newVal) {
            await resumeAudioContext()
            playTone(880, 0.12, 'sine')
            setToast('Audio enabled')
            setTimeout(() => setToast(''), 1500)
          } else {
            setToast('Audio muted')
            setTimeout(() => setToast(''), 1200)
          }
        } catch (e) {}
      }}
      title={enabled ? 'Audio on (click to mute)' : 'Audio off (click to enable)'}
      className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-200"
    >
      {enabled ? '🔊' : '🔈'}
    </button>
    <Toast message={toast} />
    </>
  )
}
