import React, { useEffect, useRef, useState } from 'react'
import PatternLights from '../components/PatternLights'
import GameOverModal from '../components/GameOverModal'
import ScoreBox from '../components/ScoreBox'
import { playTone } from '../utils/sound'
import api from '../utils/api'

const PAD_CONFIG = [
  { label: 'A', color: 'linear-gradient(135deg,#ff7bd7,#ffb3d9)', freq: 440 },
  { label: 'B', color: 'linear-gradient(135deg,#57f0ff,#9b7bff)', freq: 520 },
  { label: 'C', color: 'linear-gradient(135deg,#ffd86b,#ffb86b)', freq: 360 },
  { label: 'D', color: 'linear-gradient(135deg,#7aff9b,#b3ffcf)', freq: 300 }
]

export default function SimonSays() {
  const [sequence, setSequence] = useState([])
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState(-1)
  const [userIndex, setUserIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [gameOverOpen, setGameOverOpen] = useState(false)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)

  const playRef = useRef(false)

  function pushRandom() {
    const idx = Math.floor(Math.random() * PAD_CONFIG.length)
    setSequence((s) => [...s, idx])
  }

  async function playSequence(seq) {
    setPlaying(true)
    playRef.current = true
    for (let i = 0; i < seq.length; i++) {
      if (!playRef.current) break
      const idx = seq[i]
      setActive(idx)
      try { playTone(PAD_CONFIG[idx].freq) } catch (e) {}
      await new Promise((r) => setTimeout(r, 600))
      setActive(-1)
      await new Promise((r) => setTimeout(r, 150))
    }
    setPlaying(false)
    playRef.current = false
    setUserIndex(0)
  }

  useEffect(() => {
    // start with one
    resetAndStart()
  }, [])

  function resetAndStart() {
    setSequence([])
    setScore(0)
    setHits(0)
    setMisses(0)
    setTimeout(() => { pushRandom() }, 150)
  }

  useEffect(() => {
    if (sequence.length > 0) playSequence(sequence)
  }, [sequence])

  function handlePress(idx) {
    if (playing) return
    // user input
    const expected = sequence[userIndex]
    if (idx === expected) {
      // correct
      setScore((s) => s + 10)
      setHits((h) => h + 1)
      setUserIndex((ui) => ui + 1)
      if (userIndex + 1 === sequence.length) {
        // advance
        setTimeout(() => {
          pushRandom()
        }, 400)
      }
    } else {
      setMisses((m) => m + 1)
      setGameOverOpen(true)
      // send score
      (async () => {
        try {
          await api.post('/games/record-score', { game: 'simon', score, metadata: { length: sequence.length } })
        } catch (err) {
          try {
            const pending = JSON.parse(localStorage.getItem('tx_pending_scores') || '[]')
            pending.push({ game: 'simon', score, metadata: { length: sequence.length }, date: new Date().toISOString() })
            localStorage.setItem('tx_pending_scores', JSON.stringify(pending))
          } catch (e) {}
        }
      })()
    }
  }

  function tryAgain() {
    setGameOverOpen(false)
    resetAndStart()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl neon-text">Simon Says</h2>
          <p className="text-sm text-gray-400">Repeat the color sequence. Each round adds one element.</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreBox score={score} best={best} />
        </div>
      </div>

      <PatternLights pads={PAD_CONFIG} active={active} onPress={handlePress} />

      <div className="text-center text-sm text-gray-400">Length: {sequence.length} • Hits: {hits} • Misses: {misses}</div>

      <GameOverModal open={gameOverOpen} onClose={() => setGameOverOpen(false)} onTryAgain={tryAgain} stats={{ score, hits, misses }} />
    </div>
  )
}
