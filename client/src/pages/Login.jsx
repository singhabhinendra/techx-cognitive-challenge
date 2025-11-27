import React, { useState } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const setUser = useStore((s) => s.setUser)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      setUser(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto glass-card p-6 rounded">
      <h3 className="neon-text text-lg">Login</h3>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-800" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-800" placeholder="Password" type="password" />
        <button disabled={loading} className="w-full py-2 bg-neonBlue text-black rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
