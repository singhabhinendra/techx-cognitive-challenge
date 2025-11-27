import React from 'react'
import { motion } from 'framer-motion'

export default function PatternLights({ pads = [], active = -1, onPress }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
      {pads.map((p, i) => (
        <motion.button
          key={i}
          onClick={() => onPress && onPress(i)}
          whileTap={{ scale: 0.95 }}
          animate={active === i ? { scale: [1, 1.08, 1], boxShadow: '0 0 20px rgba(255,255,255,0.4)' } : { scale: 1 }}
          transition={{ duration: 0.18 }}
          className={`p-8 rounded-lg flex items-center justify-center text-3xl font-bold glass-card`}
          style={{ background: p.color }}
        >
          {p.label}
        </motion.button>
      ))}
    </div>
  )
}
