import React, { useEffect, useMemo, useState } from 'react'
import Timer from '../components/Timer'
import ScoreBox from '../components/ScoreBox'
import CardGrid from '../components/CardGrid'
import { motion } from 'framer-motion'

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryMatch() {
  // adaptive difficulty: start with 6 pairs, increase with successful clears
  const [pairs, setPairs] = useState(6)
  const [running, setRunning] = useState(false)
  const [timeLimit, setTimeLimit] = useState(60)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)

  const [cards, setCards] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [flipped, setFlipped] = useState([])

  useEffect(() => {
    initBoard()
  }, [pairs])

  function initBoard() {
    const values = []
    for (let i = 0; i < pairs; i++) values.push(i + 1, i + 1)
    const board = shuffle(values).map((v) => ({ value: v, revealed: false, matched: false }))
    setCards(board)
    setFlipped([])
    setScore(0)
    setRunning(false)
    setDisabled(false)
  }

  function startGame() {
    setRunning(true)
  }

  function onTimeUp() {
    setRunning(false)
    setDisabled(true)
    // final score result handling
  }

  function onClickCard(idx) {
    if (disabled) return
    if (cards[idx].revealed || cards[idx].matched) return
    const next = cards.slice()
    next[idx].revealed = true
    const newFlipped = [...flipped, idx]
    setCards(next)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped
      setDisabled(true)
      setTimeout(() => {
        const n = next.slice()
        if (n[a].value === n[b].value) {
          n[a].matched = true
          n[b].matched = true
          setScore((s) => s + 10)
        } else {
          n[a].revealed = false
          n[b].revealed = false
          setScore((s) => Math.max(0, s - 2))
        }
        setCards(n)
        setFlipped([])
        setDisabled(false)
      }, 700)
    }
  }

  useEffect(() => {
    // if all matched => increase difficulty slightly and restart
    if (cards.length && cards.every((c) => c.matched)) {
      setRunning(false)
      setBest((b) => Math.max(b, score))
      setPairs((p) => Math.min(12, p + 1))
    }
  }, [cards])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl neon-text">Memory Match</h2>
          <p className="text-sm text-gray-400">Match all pairs before time runs out.</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreBox score={score} best={best} />
          <div className="glass-card p-3 rounded-md">
            <Timer initial={timeLimit} running={running} onTimeUp={onTimeUp} />
            <div className="mt-2 flex gap-2">
              <button onClick={startGame} className="px-3 py-1 bg-neonBlue text-black rounded">Start</button>
              <button onClick={initBoard} className="px-3 py-1 bg-gray-700 rounded">Reset</button>
            </div>
          </div>
        </div>
      </motion.div>

      <CardGrid cards={cards} onClickCard={onClickCard} disabled={disabled || !running} />

      <div className="text-sm text-gray-400">Pairs: {pairs} • Adaptive difficulty raises pairs when you clear a board.</div>
    </div>
  )
}
