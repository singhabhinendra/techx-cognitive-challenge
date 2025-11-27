import React from 'react'

export default function ScoreBox({ score = 0, best = 0 }) {
  return (
    <div className="glass-card p-3 rounded-md w-full max-w-xs">
      <div className="text-xs text-gray-300">Score</div>
      <div className="text-2xl font-semibold neon-text">{score}</div>
      <div className="text-xs text-gray-400 mt-2">Best: {best}</div>
    </div>
  )
}
