import React from 'react'

export default function LeaderboardList({ items = [] }) {
  return (
    <div className="glass-card p-4 rounded">
      <ol className="list-decimal pl-5 space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{it.user}</span>
            <span className="font-mono">{it.score}</span>
          </li>
        ))}
        {items.length === 0 && <div className="text-gray-400">No scores yet</div>}
      </ol>
    </div>
  )
}
