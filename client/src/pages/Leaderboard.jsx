import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import LeaderboardList from '../components/LeaderboardList'

const GAMES = [
  { id: 'memory-match', name: 'Memory Match' },
  { id: 'n-back', name: 'N-Back' },
  { id: 'fast-math', name: 'Fast Math' },
  { id: 'grid-path', name: 'Grid Pathfinding' },
  { id: 'simon', name: 'Simon Says' }
]

export default function Leaderboard() {
  const [game, setGame] = useState('memory-match')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/games/leaderboard/${game}`)
        setItems(res.data)
      } catch (err) {
        console.error(err)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [game])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="neon-text text-2xl">Leaderboard</h2>
        <select value={game} onChange={(e) => setGame(e.target.value)} className="bg-gray-800 p-2 rounded">
          {GAMES.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
      <p className="text-gray-300">Top scores for {GAMES.find(g => g.id === game)?.name}</p>

      <div className="mt-4">
        {loading ? <div className="text-gray-400">Loading...</div> : <LeaderboardList items={items} />}
      </div>
    </div>
  )
}
