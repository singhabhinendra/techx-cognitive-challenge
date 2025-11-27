import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <section className="glass-card p-8 rounded-lg">
        <h1 className="text-4xl neon-text font-bold">TechX Cognitive Challenge</h1>
        <p className="mt-3 text-gray-300">Practice Accenture-style cognitive assessment games with adaptive difficulty and leaderboards.</p>
        <div className="mt-6">
          <Link to="/dashboard" className="px-4 py-2 bg-neonPurple rounded text-white">Go to Dashboard</Link>
        </div>
      </section>
    </div>
  )
}
