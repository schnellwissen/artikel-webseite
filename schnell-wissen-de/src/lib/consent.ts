// DSGVO/TTDDG Consent Management
export interface ConsentPreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  ads: boolean;
  external_media: boolean;
}

export interface ConsentData {
  preferences: ConsentPreferences;
  timestamp: string;
  policy_version: string;
  region: string;
  consent_id: string;
}

export const CONSENT_CATEGORIES = {
  necessary: {
    id: 'necessary',
    name: 'Notwendig',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    required: true,
    examples: ['Session-Cookies', 'CSRF-Schutz', 'Login-Status']
  },
  functional: {
    id: 'functional',
    name: 'Funktional',
    description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
    required: false,
    examples: ['Spracheinstellungen', 'Theme-Präferenzen', 'Suchverlauf']
  },
  analytics: {
    id: 'analytics',
    name: 'Analyse',
    description: 'Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen.',
    required: false,
    examples: ['Google Analytics', 'Seitenaufrufe', 'Verweildauer']
  },
  ads: {
    id: 'ads',
    name: 'Marketing',
    description: 'Diese Cookies werden verwendet, um relevante Werbung anzuzeigen.',
    required: false,
    examples: ['Google AdSense', 'Werbepräferenzen', 'Remarketing']
  },
  external_media: {
    id: 'external_media',
    name: 'Externe Medien',
    description: 'Diese Cookies ermöglichen das Laden von Inhalten von Drittanbietern.',
    required: false,
    examples: ['YouTube Videos', 'Google Maps', 'Social Media Widgets']
  }
} as const;

export const POLICY_VERSION = '1.0.0';
export const CONSENT_EXPIRY_MONTHS = 12;
export const CONSENT_STORAGE_KEY = 'schnell_wissen_consent';

// Default Preferences (only necessary cookies)
export const getDefaultPreferences = (): ConsentPreferences => ({
  necessary: true,
  functional: false,
  analytics: false,
  ads: false,
  external_media: false,
});

// Generate unique consent ID
export const generateConsentId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Save consent to localStorage
export const saveConsent = (preferences: ConsentPreferences): ConsentData => {
  const consentData: ConsentData = {
    preferences,
    timestamp: new Date().toISOString(),
    policy_version: POLICY_VERSION,
    region: 'DE',
    consent_id: generateConsentId(),
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    
    // Log consent to server (fire and forget)
    logConsentToServer(consentData).catch(console.error);
    
    return consentData;
  } catch (error) {
    console.error('Failed to save consent:', error);
    return consentData;
  }
};

// Load consent from localStorage
export const loadConsent = (): ConsentData | null => {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const data: ConsentData = JSON.parse(stored);
    
    // Check if consent is expired
    const consentDate = new Date(data.timestamp);
    const expiryDate = new Date(consentDate);
    expiryDate.setMonth(expiryDate.getMonth() + CONSENT_EXPIRY_MONTHS);
    
    if (new Date() > expiryDate) {
      console.log('Consent expired, removing from storage');
      clearConsent();
      return null;
    }
    
    // Check if policy version changed
    if (data.policy_version !== POLICY_VERSION) {
      console.log('Policy version changed, consent needs renewal');
      clearConsent();
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load consent:', error);
    clearConsent();
    return null;
  }
};

// Clear consent from localStorage
export const clearConsent = (): void => {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear consent:', error);
  }
};

// Check if user has given consent
export const hasConsent = (): boolean => {
  return loadConsent() !== null;
};

// Get current preferences (or defaults)
export const getCurrentPreferences = (): ConsentPreferences => {
  const consent = loadConsent();
  return consent?.preferences || getDefaultPreferences();
};

// Log consent to server
export const logConsentToServer = async (consentData: ConsentData): Promise<void> => {
  try {
    // Create anonymous hash for logging
    const anonymousId = await hashString(consentData.consent_id + navigator.userAgent);
    
    await fetch('/api/consent/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        anonymous_id: anonymousId,
        preferences: consentData.preferences,
        timestamp: consentData.timestamp,
        policy_version: consentData.policy_version,
        region: consentData.region,
        user_agent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.warn('Failed to log consent to server:', error);
  }
};

// Simple hash function for anonymous IDs
const hashString = async (str: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for older browsers
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
};

// Apply consent preferences to Google Consent Mode
export const applyGoogleConsent = (preferences: ConsentPreferences): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      'ad_storage': preferences.ads ? 'granted' : 'denied',
      'analytics_storage': preferences.analytics ? 'granted' : 'denied',
      'ad_user_data': preferences.ads ? 'granted' : 'denied',
      'ad_personalization': preferences.ads ? 'granted' : 'denied',
      'functionality_storage': preferences.functional ? 'granted' : 'denied',
      'personalization_storage': preferences.functional ? 'granted' : 'denied',
      'security_storage': 'granted', // Always granted for security
    });
  }
};