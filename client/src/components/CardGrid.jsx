import React from 'react'
import { motion } from 'framer-motion'

export default function CardGrid({ cards, onClickCard, disabled }) {
  return (
    <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
      {cards.map((c, idx) => (
        <motion.button
          key={idx}
          layout
          whileTap={{ scale: 0.98 }}
          onClick={() => !disabled && onClickCard(idx)}
          className={`p-4 rounded-md glass-card h-24 flex items-center justify-center text-xl font-bold ${c.matched || c.revealed ? 'bg-opacity-80' : ''}`}>
          {c.revealed || c.matched ? c.value : '?'}
        </motion.button>
      ))}
    </div>
  )
}
