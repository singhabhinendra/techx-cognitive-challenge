import React from 'react'

export default function GridBoard({ grid, onToggleWall, onSetStart, onSetEnd, cellSize = 40 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`, gap: 4 }}>
      {grid.flatMap((row, r) => row.map((cell, c) => {
        const key = `${r}-${c}`
        const styles = {
          width: cellSize,
          height: cellSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          cursor: 'pointer'
        }
        let className = 'glass-card'
        if (cell === 1) className = 'bg-gray-700'
        if (cell === 'S') className = 'bg-neonBlue text-black'
        if (cell === 'E') className = 'bg-neonPurple text-white'
        if (cell === 'P') className = 'bg-green-500 text-black'
        return (
          <button key={key} className={`${className} flex items-center justify-center`} style={styles}
            onClick={(e) => {
              if (e.shiftKey) onSetStart(r, c)
              else if (e.altKey) onSetEnd(r, c)
              else onToggleWall(r, c)
            }}
            title="Click: toggle wall. Shift+Click: set Start. Alt+Click: set End">
            {cell === 1 ? '' : (cell === 'S' ? 'S' : cell === 'E' ? 'E' : cell === 'P' ? '·' : '')}
          </button>
        )
      }))}
    </div>
  )
}
