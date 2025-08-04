'use client'

import { useState } from 'react'
import { MapPin, ExternalLink, Shield } from 'lucide-react'
import { useConsent } from '@/contexts/ConsentContext'

interface GoogleMapsEmbedProps {
  src: string
  title?: string
  className?: string
  height?: string
}

export default function GoogleMapsEmbed({ 
  src, 
  title = 'Google Maps', 
  className = '',
  height = '400px'
}: GoogleMapsEmbedProps) {
  const { canUse, showConsentBanner } = useConsent()
  const [userConsented, setUserConsented] = useState(false)
  
  const hasExternalMediaConsent = canUse('external_media')
  const shouldShowMap = hasExternalMediaConsent || userConsented
  
  const handleLoadMap = () => {
    if (hasExternalMediaConsent) {
      setUserConsented(true)
    } else {
      // Show consent banner to get permission
      showConsentBanner()
    }
  }
  
  const handleAcceptOnce = () => {
    setUserConsented(true)
  }

  if (shouldShowMap) {
    return (
      <div className={`relative w-full rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    )
  }

  return (
    <div 
      className={`relative w-full bg-gray-100 rounded-lg overflow-hidden ${className}`} 
      style={{ height }}
    >
      {/* Map Pattern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="mapPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#3B82F6" opacity="0.3"/>
                <path d="M5,5 L15,15 M15,5 L5,15" stroke="#10B981" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapPattern)"/>
          </svg>
        </div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="mb-4">
            <Shield className="w-12 h-12 mx-auto mb-2 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Externe Karte</h3>
            <p className="text-sm text-gray-600 mb-4">
              Diese Karte wird von Google Maps bereitgestellt. Beim Laden werden Daten an Google übertragen.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleAcceptOnce}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Karte laden (einmalig)
            </button>
            
            <button
              onClick={handleLoadMap}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Datenschutzeinstellungen
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            {title}
          </p>
        </div>
      </div>
    </div>
  )
}