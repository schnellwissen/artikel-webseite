'use client'

import { useState, useEffect } from 'react'
import { X, Settings, Shield, Eye, Target, ExternalLink, Check } from 'lucide-react'
import { 
  ConsentPreferences, 
  CONSENT_CATEGORIES, 
  hasConsent, 
  saveConsent, 
  getCurrentPreferences,
  getDefaultPreferences,
  applyGoogleConsent
} from '@/lib/consent'

interface ConsentBannerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void
  forceShow?: boolean
}

export default function ConsentBanner({ onConsentChange, forceShow = false }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>(getDefaultPreferences())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Show banner if no consent exists or if forced
    if (forceShow || !hasConsent()) {
      setIsVisible(true)
      setPreferences(getCurrentPreferences())
    }
  }, [forceShow])

  const handleAcceptAll = async () => {
    setIsLoading(true)
    const allAccepted: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      ads: true,
      external_media: true,
    }
    
    await saveConsentAndClose(allAccepted)
  }

  const handleAcceptNecessary = async () => {
    setIsLoading(true)
    await saveConsentAndClose(getDefaultPreferences())
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    await saveConsentAndClose(preferences)
  }

  const saveConsentAndClose = async (prefs: ConsentPreferences) => {
    try {
      const consentData = saveConsent(prefs)
      applyGoogleConsent(prefs)
      
      // Notify parent component
      onConsentChange?.(prefs)
      
      // Hide banner
      setIsVisible(false)
      setShowDetails(false)
      
      // Reload page to apply new consent settings
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
    } catch (error) {
      console.error('Failed to save consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePreference = (category: keyof ConsentPreferences) => {
    if (category === 'necessary') return // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'necessary': return Shield
      case 'functional': return Settings
      case 'analytics': return Eye
      case 'ads': return Target
      case 'external_media': return ExternalLink
      default: return Settings
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl border max-h-[90vh] overflow-y-auto">
        {!showDetails ? (
          // Simple Banner
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">
                  Datenschutz & Cookies
                </h2>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Nutzung unserer Website zu ermöglichen. 
              Einige sind notwendig für den Betrieb der Website, andere helfen uns bei der Analyse und Verbesserung. 
              Sie können Ihre Einwilligung jederzeit anpassen oder widerrufen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptAll}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Wird gespeichert...' : 'Alle akzeptieren'}
              </button>
              
              <button
                onClick={handleAcceptNecessary}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Nur notwendige
              </button>
              
              <button
                onClick={() => setShowDetails(true)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Individuell auswählen
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Weitere Informationen finden Sie in unserer{' '}
                <a href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutzerklärung
                </a>
              </p>
            </div>
          </div>
        ) : (
          // Detailed Settings
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">
                  Datenschutzeinstellungen
                </h2>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Wählen Sie aus, welche Cookies und Technologien Sie zulassen möchten:
            </p>

            <div className="space-y-4 mb-6">
              {Object.entries(CONSENT_CATEGORIES).map(([key, category]) => {
                const Icon = getCategoryIcon(key)
                const isChecked = preferences[key as keyof ConsentPreferences]
                const isRequired = category.required

                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <Icon className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-medium text-gray-900 mr-2">
                              {category.name}
                            </h3>
                            {isRequired && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Notwendig
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {category.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            <strong>Beispiele:</strong> {category.examples.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <button
                          onClick={() => togglePreference(key as keyof ConsentPreferences)}
                          disabled={isRequired}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isChecked ? 'bg-blue-600' : 'bg-gray-200'
                          } ${isRequired ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isChecked ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3 h-3 text-blue-600 absolute top-1 left-1" />
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
              </button>
              
              <button
                onClick={() => setShowDetails(false)}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Zurück
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Weitere Informationen zu unseren Cookies finden Sie in der{' '}
                <a href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutzerklärung
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}