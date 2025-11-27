import React, { useEffect, useMemo, useState } from 'react'
import GridBoard from '../components/GridBoard'
import GameOverModal from '../components/GameOverModal'
import ScoreBox from '../components/ScoreBox'
import api from '../utils/api'

function makeGrid(rows, cols) {
  return Array.from({ length: rows }).map(() => Array.from({ length: cols }).map(() => 0))
}

function bfs(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const q = []
  const visited = Array.from({ length: rows }).map(() => Array(cols).fill(false))
  const parent = Array.from({ length: rows }).map(() => Array(cols).fill(null))
  q.push(start)
  visited[start[0]][start[1]] = true
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  while (q.length) {
    const [r,c] = q.shift()
    if (r === end[0] && c === end[1]) {
      // reconstruct path
      const path = []
      let cur = end
      while (cur) {
        path.push(cur)
        cur = parent[cur[0]][cur[1]]
      }
      return path.reverse()
    }
    for (const [dr,dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (visited[nr][nc]) continue
      if (grid[nr][nc] === 1) continue // wall
      visited[nr][nc] = true
      parent[nr][nc] = [r,c]
      q.push([nr,nc])
    }
  }
  return null
}

export default function GridPath() {
  // adaptive difficulty: increase grid size when player succeeds
  const [size, setSize] = useState(8)
  const [grid, setGrid] = useState(() => makeGrid(8,8))
  const [start, setStart] = useState([0,0])
  const [end, setEnd] = useState([7,7])
  const [path, setPath] = useState([])
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOverOpen, setGameOverOpen] = useState(false)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)

  useEffect(() => {
    setGrid(makeGrid(size, size))
    setStart([0,0])
    setEnd([size-1, size-1])
    setPath([])
    setScore(0)
    setTimeLeft(60)
  }, [size])

  useEffect(() => {
    let t = null
    if (running) {
      t = setInterval(() => setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          finish(false)
          return 0
        }
        return s - 1
      }), 1000)
    }
    return () => clearInterval(t)
  }, [running])

  function toggleWall(r,c) {
    setGrid((g) => {
      const ng = g.map((row) => row.slice())
      if (ng[r][c] === 0) ng[r][c] = 1
      else ng[r][c] = 0
      // don't allow turning start/end into wall
      const [sr, sc] = start
      const [er, ec] = end
      ng[sr][sc] = 'S'
      ng[er][ec] = 'E'
      return ng
    })
  }

  function onSetStart(r,c) {
    setStart([r,c])
  }

  function onSetEnd(r,c) {
    setEnd([r,c])
  }

  function startSearch() {
    // prepare numeric grid for bfs
    const numeric = grid.map((row) => row.map((cell) => cell === 'S' || cell === 'E' ? 0 : (cell === 1 ? 1 : 0)))
    const p = bfs(numeric, start, end)
    if (!p) {
      // no path
      setPath([])
      setMisses((m) => m + 1)
      setScore((s) => Math.max(0, s - 5))
      return
    }
    setPath(p)
    setRunning(true)
    // animate path traversal scoring: shorter path -> higher score
    const base = Math.max(0, 200 - p.length * 5)
    setScore((s) => s + base)
    setHits((h) => h + 1)
    // success increases grid size slightly
    setSize((sz) => Math.min(16, sz + 1))
    // send score
    (async () => {
      try {
        await api.post('/games/record-score', { game: 'grid-path', score: base, metadata: { size, pathLength: p.length } })
      } catch (err) {
        try {
          const pending = JSON.parse(localStorage.getItem('tx_pending_scores') || '[]')
          pending.push({ game: 'grid-path', score: base, metadata: { size, pathLength: p.length }, date: new Date().toISOString() })
          localStorage.setItem('tx_pending_scores', JSON.stringify(pending))
        } catch (e) {}
      }
    })()
    setBest((b) => Math.max(b, base))
    // open game over modal shortly after
    setTimeout(() => finish(true), 1000)
  }

  function finish(success) {
    setRunning(false)
    if (!success) {
      setTimeLeft(0)
      setGameOverOpen(true)
    } else {
      setGameOverOpen(true)
    }
  }

  // render numeric grid with S/E markers
  const displayGrid = useMemo(() => {
    const g = grid.map((row) => row.slice())
    const [sr, sc] = start
    const [er, ec] = end
    g[sr][sc] = 'S'
    g[er][ec] = 'E'
    for (const [r,c] of path) {
      if (!(r === sr && c === sc) && !(r === er && c === ec)) g[r][c] = 'P'
    }
    return g
  }, [grid, start, end, path])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl neon-text">Grid Pathfinding (BFS Shortest Path)</h2>
          <p className="text-sm text-gray-400">Click cells to add/remove walls. Shift+Click to set Start, Alt+Click to set End.</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreBox score={score} best={best} />
          <div className="glass-card p-3 rounded-md">
            <div className="text-sm text-gray-300">Time: {timeLeft}s</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => startSearch()} className="px-3 py-1 bg-neonBlue text-black rounded">Find Path</button>
              <button onClick={() => { setGrid(makeGrid(size,size)); setPath([]) }} className="px-3 py-1 bg-gray-700 rounded">Clear</button>
            </div>
          </div>
        </div>
      </div>

      <GridBoard grid={displayGrid} onToggleWall={toggleWall} onSetStart={onSetStart} onSetEnd={onSetEnd} />

      <div className="mt-4 text-sm text-gray-400">Grid size: {size}x{size}</div>

      <GameOverModal open={gameOverOpen} onClose={() => setGameOverOpen(false)} onTryAgain={() => { setSize(Math.max(6, size-1)); setGameOverOpen(false); }} stats={{ score, hits, misses }} />
    </div>
  )
}
