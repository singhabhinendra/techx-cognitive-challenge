import React, { useEffect, useState, useRef } from 'react'
import ScoreBox from '../components/ScoreBox'
import GameOverModal from '../components/GameOverModal'
import api from '../utils/api'

function randomOp(max) {
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  const ops = ['+', '-', '*']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let result
  if (op === '+') result = a + b
  if (op === '-') result = a - b
  if (op === '*') result = a * b
  return { a, b, op, result }
}

export default function FastMath() {
  const [difficulty, setDifficulty] = useState(10) // max operand
  const [timeLimit, setTimeLimit] = useState(45)
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [current, setCurrent] = useState(() => randomOp(difficulty))
  const [input, setInput] = useState('')
  const timerRef = useRef(null)
  const [gameOverOpen, setGameOverOpen] = useState(false)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)

  useEffect(() => {
    setTimeLeft(timeLimit)
  }, [timeLimit])

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          endGame()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [running])

  function start() {
    setScore(0)
    setHits(0)
    setMisses(0)
    setInput('')
    setCurrent(randomOp(difficulty))
    setRunning(true)
  }

  function submitAnswer(e) {
    e && e.preventDefault()
    if (!running) return
    const val = Number(input)
    if (val === current.result) {
      setScore((s) => s + 10)
      setHits((h) => h + 1)
      // increase difficulty slightly every few correct
      if ((hits + 1) % 5 === 0) setDifficulty((d) => Math.min(50, d + 5))
    } else {
      setScore((s) => Math.max(0, s - 5))
      setMisses((m) => m + 1)
    }
    setInput('')
    setCurrent(randomOp(difficulty))
  }

  function endGame() {
    setRunning(false)
    setBest((b) => Math.max(b, score))
    setGameOverOpen(true)
    // attempt to send score, fallback to local queue
    (async () => {
      try {
        await api.post('/games/record-score', { game: 'fast-math', score, metadata: { difficulty, hits, misses } })
      } catch (err) {
        try {
          const pending = JSON.parse(localStorage.getItem('tx_pending_scores') || '[]')
          pending.push({ game: 'fast-math', score, metadata: { difficulty, hits, misses }, date: new Date().toISOString() })
          localStorage.setItem('tx_pending_scores', JSON.stringify(pending))
        } catch (e) {}
      }
    })()
  }

  function tryAgain() {
    setGameOverOpen(false)
    setTimeLeft(timeLimit)
    setScore(0)
    setHits(0)
    setMisses(0)
    setCurrent(randomOp(difficulty))
    setRunning(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl neon-text">Fast Math Reaction</h2>
          <p className="text-sm text-gray-400">Solve as many arithmetic problems as possible before time runs out.</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreBox score={score} best={best} />
          <div className="glass-card p-3 rounded-md">
            <div className="text-sm text-gray-300">Time: {timeLeft}s</div>
            <div className="mt-2 flex gap-2">
              <button onClick={start} className="px-3 py-1 bg-neonBlue text-black rounded">Start</button>
              <button onClick={() => { setRunning(false); clearInterval(timerRef.current) }} className="px-3 py-1 bg-gray-700 rounded">Pause</button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded text-center">
        <div className="text-5xl font-bold">{current.a} {current.op} {current.b} = ?</div>
        <form onSubmit={submitAnswer} className="mt-4 flex justify-center">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="p-3 rounded bg-gray-800 text-center w-40" inputMode="numeric" />
          <button type="submit" className="ml-3 px-4 py-2 bg-neonPurple rounded text-white">Submit</button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">Hits: {hits}</div>
        <div className="glass-card p-4">Misses: {misses}</div>
        <div className="glass-card p-4">Difficulty: {difficulty}</div>
      </div>

      <GameOverModal open={gameOverOpen} onClose={() => setGameOverOpen(false)} onTryAgain={tryAgain} stats={{ score, hits, misses }} />
    </div>
  )
}
