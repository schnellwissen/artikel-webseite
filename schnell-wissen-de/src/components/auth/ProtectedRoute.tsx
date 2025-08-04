'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Shield, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    )
  }

  // Check if user is logged in
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Anmeldung erforderlich</h1>
          <p className="text-gray-600 mb-8">
            Sie müssen angemeldet sein, um auf diese Seite zugreifen zu können.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin-Zugriff erforderlich</h1>
          <p className="text-gray-600 mb-8">
            Sie haben keine Berechtigung für diesen Bereich. Nur Administratoren können auf diese Seite zugreifen.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated and has required permissions
  return <>{children}</>
}