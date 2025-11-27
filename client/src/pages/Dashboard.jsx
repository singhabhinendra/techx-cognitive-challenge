import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const games = [
    { id: 'memory-match', name: 'Memory Match', path: '/games/memory-match' },
    { id: 'n-back', name: 'N-Back', path: '/games/n-back' },
    { id: 'fast-math', name: 'Fast Math', path: '/games/fast-math' },
    { id: 'grid-path', name: 'Grid Pathfinding', path: '/games/grid-path' },
    { id: 'simon', name: 'Simon Says', path: '/games/simon' }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl neon-text">Dashboard</h2>
      <p className="text-gray-300">Choose a game and test your cognitive skills.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {games.map((g) => (
          <Link key={g.id} to={g.path} className="glass-card p-4 rounded-md hover:scale-105 transition">
            <div className="font-semibold neon-text">{g.name}</div>
            <div className="text-sm text-gray-400 mt-2">Click to play</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
