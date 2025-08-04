'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useConsent } from '@/contexts/ConsentContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [adminClicks, setAdminClicks] = useState(0)
  const { showConsentBanner } = useConsent()

  const handleAdminAccess = async () => {
    // Check if already authenticated
    const existingToken = localStorage.getItem('admin_token')
    const existingTimestamp = localStorage.getItem('admin_timestamp')
    
    if (existingToken && existingTimestamp) {
      const now = Date.now()
      const tokenTime = parseInt(existingTimestamp)
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (now - tokenTime < twentyFourHours) {
        // Token still valid, redirect to admin
        window.open('/dashboard-xy934k2_admin', '_blank')
        return
      }
    }

    // Auto-login with predefined token for easier access
    const token = 'schnellwissen_admin_2024_xyz789_secure'
    
    try {
      const response = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        // Valid token - store in localStorage with timestamp
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_timestamp', Date.now().toString())
        
        // Redirect to admin without popup
        window.open('/dashboard-xy934k2_admin', '_blank')
      } else {
        console.error('Admin token validation failed')
      }
    } catch (error) {
      console.error('Admin access error:', error)
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      handleAdminAccess()
    } else {
      // Track clicks for potential triple-click access
      setAdminClicks(prev => prev + 1)
      
      // Reset click counter after 2 seconds
      setTimeout(() => {
        setAdminClicks(0)
      }, 2000)

      // Triple-click opens admin (alternative access method)
      if (adminClicks >= 2) {
        e.preventDefault()
        handleAdminAccess()
        setAdminClicks(0)
      }
    }
  }

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div 
              className="flex items-center space-x-2 mb-4 cursor-pointer select-none group"
              onClick={handleLogoClick}
              title="Ctrl+Klick oder 3x klicken für Admin-Zugang"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <div>
                <span className="text-xl font-bold group-hover:text-gray-100 transition-colors">Schnell</span>
                <span className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Wissen</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, 
              Gesundheit und vielem mehr. Schnell informiert, fundiert erklärt.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/kategorien" className="text-gray-300 hover:text-white transition-colors">
                  Alle Kategorien
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="text-gray-300 hover:text-white transition-colors">
                  Über uns
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-gray-300 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-300 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-300 hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <button 
                  onClick={showConsentBanner}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Datenschutzeinstellungen
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} SchnellWissen.de. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer