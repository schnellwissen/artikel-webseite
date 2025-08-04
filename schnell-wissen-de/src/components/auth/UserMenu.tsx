'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Settings, Shield, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function UserMenu() {
  const { user, signOut, isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (!user) return null

  const initials = user.profile?.full_name
    ? user.profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user.email.substring(0, 2).toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{initials}</span>
        </div>
        
        {/* User Info (Desktop) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.profile?.full_name || user.email.split('@')[0]}
          </div>
          {isAdmin && (
            <div className="text-xs text-blue-600 font-medium">Admin</div>
          )}
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.profile?.full_name || 'Benutzer'}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile/Settings */}
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <User className="w-4 h-4 mr-3" />
              Profil bearbeiten
            </button>

            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings className="w-4 h-4 mr-3" />
              Einstellungen
            </button>

            {/* Admin Dashboard */}
            {isAdmin && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <Link 
                  href="/dashboard-xy934k2_admin"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Admin Dashboard
                </Link>
              </>
            )}

            {/* Sign Out */}
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}