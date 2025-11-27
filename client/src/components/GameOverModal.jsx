import React from 'react'
import Modal from './Modal'

export default function GameOverModal({ open, onClose, stats = {}, onTryAgain }) {
  const { score = 0, hits = 0, misses = 0, falseAlarms = 0 } = stats
  return (
    <Modal open={open} onClose={onClose} title="Game Over">
      <div className="space-y-3">
        <div className="text-2xl neon-text font-bold">Score: {score}</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-card p-3">Hits<br /><strong>{hits}</strong></div>
          <div className="glass-card p-3">Misses<br /><strong>{misses}</strong></div>
          <div className="glass-card p-3">False Alarms<br /><strong>{falseAlarms}</strong></div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onTryAgain} className="px-4 py-2 bg-neonBlue text-black rounded">Try Again</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Close</button>
        </div>
      </div>
    </Modal>
  )
}
