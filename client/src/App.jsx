import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import MemoryMatch from './games/MemoryMatch'
import NBack from './games/NBack'
import FastMath from './games/FastMath'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import About from './pages/About'

function Navbar() {
  return (
    <nav className="w-full p-4 flex items-center justify-between glass-card">
      <Link to="/" className="text-xl font-semibold neon-text">
        TechX Cognitive
      </Link>
      <div className="space-x-4">
        <Link to="/dashboard" className="text-sm text-gray-300 hover:underline">
          Dashboard
        </Link>
        <Link to="/leaderboard" className="text-sm text-gray-300 hover:underline">
          Leaderboard
        </Link>
        <Link to="/about" className="text-sm text-gray-300 hover:underline">
          About
        </Link>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <Navbar />
      <main className="mt-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/n-back" element={<NBack />} />
          <Route path="/games/fast-math" element={<FastMath />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
