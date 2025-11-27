import React, { useEffect, useState } from 'react'

export default function Timer({ initial = 60, running, onTimeUp, onTick }) {
  const [time, setTime] = useState(initial)

  useEffect(() => {
    setTime(initial)
  }, [initial])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTime((t) => {
        const nt = t - 1
        if (onTick) onTick(nt)
        if (nt <= 0) {
          clearInterval(id)
          onTimeUp && onTimeUp()
          return 0
        }
        return nt
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  return (
    <div className="text-sm text-gray-200">
      <div className="font-mono">Time: {time}s</div>
    </div>
  )
}
