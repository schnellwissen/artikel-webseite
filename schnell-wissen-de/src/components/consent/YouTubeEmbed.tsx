'use client'

import { useState } from 'react'
import { Play, ExternalLink, Shield } from 'lucide-react'
import { useConsent } from '@/contexts/ConsentContext'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  thumbnail?: string
  className?: string
}

export default function YouTubeEmbed({ 
  videoId, 
  title = 'YouTube Video', 
  thumbnail,
  className = '' 
}: YouTubeEmbedProps) {
  const { canUse, showConsentBanner } = useConsent()
  const [userConsented, setUserConsented] = useState(false)
  
  const hasExternalMediaConsent = canUse('external_media')
  const shouldShowVideo = hasExternalMediaConsent || userConsented
  
  // Generate thumbnail URL if not provided
  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  
  const handleLoadVideo = () => {
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

  if (shouldShowVideo) {
    return (
      <div className={`relative w-full aspect-video ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Thumbnail Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <div className="text-center text-white p-6 max-w-md">
          <div className="mb-4">
            <Shield className="w-12 h-12 mx-auto mb-2 text-blue-400" />
            <h3 className="text-lg font-semibold mb-2">Externe Inhalte</h3>
            <p className="text-sm text-gray-200 mb-4">
              Dieses Video wird von YouTube bereitgestellt. Beim Laden werden Daten an YouTube übertragen.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleAcceptOnce}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Video laden (einmalig)
            </button>
            
            <button
              onClick={handleLoadVideo}
              className="w-full flex items-center justify-center px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Datenschutzeinstellungen
            </button>
          </div>
          
          <p className="text-xs text-gray-300 mt-3">
            {title}
          </p>
        </div>
      </div>
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </div>
    </div>
  )
}