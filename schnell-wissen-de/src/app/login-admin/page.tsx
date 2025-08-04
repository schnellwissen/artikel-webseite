'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token.trim()) {
      setError('Bitte geben Sie den Admin-Token ein.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      })

      if (response.ok) {
        // Store token and timestamp
        localStorage.setItem('admin_token', token.trim())
        localStorage.setItem('admin_timestamp', Date.now().toString())
        
        // Redirect to admin dashboard
        router.push('/dashboard-xy934k2_admin')
      } else {
        const data = await response.json()
        setError(data.error || 'Ungültiger Token')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Admin-Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Melden Sie sich mit Ihrem Admin-Token an
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Admin-Token
            </label>
            <div className="relative">
              <input
                id="token"
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Geben Sie Ihren Admin-Token ein"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showToken ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 animate-spin" />
                Anmeldung läuft...
              </div>
            ) : (
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Anmelden
              </div>
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Zurück zur Startseite
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Standard-Token für Tests:</strong><br />
            <code className="text-xs">schnellwissen_admin_2024_xyz789_secure</code>
          </p>
        </div>
      </div>
    </div>
  )
}