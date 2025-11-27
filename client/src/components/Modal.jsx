import React from 'react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-full max-w-lg mx-4 glass-card p-6 rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg neon-text">{title}</h3>
          <button onClick={onClose} className="text-gray-300">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
