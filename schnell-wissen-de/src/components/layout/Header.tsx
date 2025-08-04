'use client'

import Link from 'next/link'
import { Search, Menu, X, LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from '@/components/auth/UserMenu'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { user, loading } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">Schnell</span>
              <span className="text-xl font-bold text-blue-600">Wissen</span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Startseite
            </Link>
            <Link 
              href="/kategorien" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Kategorien
            </Link>
            <Link 
              href="/ueber-uns" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Über uns
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Link 
              href="/search" 
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Artikel durchsuchen"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Auth Buttons / User Menu */}
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Anmelden
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Registrieren
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="px-2 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Startseite
              </Link>
              <Link 
                href="/kategorien" 
                className="px-2 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategorien
              </Link>
              <Link 
                href="/ueber-uns" 
                className="px-2 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Über uns
              </Link>

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="pt-2 mt-2 border-t border-gray-100 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center w-full px-2 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-3" />
                    Anmelden
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center w-full px-2 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-3" />
                    Registrieren
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

    </header>
  )
}

export default Header