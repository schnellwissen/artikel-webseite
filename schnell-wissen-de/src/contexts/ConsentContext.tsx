'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  ConsentPreferences, 
  getCurrentPreferences, 
  hasConsent,
  applyGoogleConsent
} from '@/lib/consent'
import ConsentBanner from '@/components/consent/ConsentBanner'

interface ConsentContextType {
  preferences: ConsentPreferences
  hasGivenConsent: boolean
  showConsentBanner: () => void
  updatePreferences: (prefs: ConsentPreferences) => void
  canUse: (category: keyof ConsentPreferences) => boolean
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined)

interface ConsentProviderProps {
  children: ReactNode
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(getCurrentPreferences())
  const [hasGivenConsent, setHasGivenConsent] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize consent state
    const initializeConsent = () => {
      const hasExistingConsent = hasConsent()
      const currentPrefs = getCurrentPreferences()
      
      setHasGivenConsent(hasExistingConsent)
      setPreferences(currentPrefs)
      setIsInitialized(true)
      
      // Apply current preferences to Google Consent Mode
      applyGoogleConsent(currentPrefs)
      
      // Show banner if no consent given
      if (!hasExistingConsent) {
        setShowBanner(true)
      }
    }

    initializeConsent()
  }, [])

  const showConsentBanner = () => {
    setShowBanner(true)
  }

  const updatePreferences = (prefs: ConsentPreferences) => {
    setPreferences(prefs)
    setHasGivenConsent(true)
    setShowBanner(false)
    applyGoogleConsent(prefs)
  }

  const canUse = (category: keyof ConsentPreferences): boolean => {
    return preferences[category] === true
  }

  const handleConsentChange = (prefs: ConsentPreferences) => {
    updatePreferences(prefs)
  }

  // Don't render children until consent is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Website wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <ConsentContext.Provider
      value={{
        preferences,
        hasGivenConsent,
        showConsentBanner,
        updatePreferences,
        canUse,
      }}
    >
      {children}
      
      {/* Consent Banner */}
      <ConsentBanner
        onConsentChange={handleConsentChange}
        forceShow={showBanner}
      />
    </ConsentContext.Provider>
  )
}

export function useConsent(): ConsentContextType {
  const context = useContext(ConsentContext)
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider')
  }
  return context
}

// HOC for components that need consent
export function withConsent<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  requiredCategories: (keyof ConsentPreferences)[]
) {
  return function ConsentWrappedComponent(props: T) {
    const { canUse } = useConsent()
    
    const hasRequiredConsent = requiredCategories.every(category => canUse(category))
    
    if (!hasRequiredConsent) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 mb-2">
            Diese Funktion erfordert zusätzliche Cookies.
          </p>
          <p className="text-sm text-yellow-600">
            Bitte aktivieren Sie die entsprechenden Kategorien in den Datenschutzeinstellungen.
          </p>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}