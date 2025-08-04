'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function GoogleConsentBootstrap() {
  return (
    <>
      {/* Google Consent Mode v2 Bootstrap - Must load before any Google tags */}
      <Script
        id="google-consent-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent to denied for all categories
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted' // Always granted for security
            });
            
            // Helper function to apply consent (called from ConsentContext)
            window.applyConsent = function(prefs) {
              gtag('consent', 'update', {
                'ad_storage': prefs.ads ? 'granted' : 'denied',
                'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                'ad_user_data': prefs.ads ? 'granted' : 'denied',
                'ad_personalization': prefs.ads ? 'granted' : 'denied',
                'functionality_storage': prefs.functional ? 'granted' : 'denied',
                'personalization_storage': prefs.functional ? 'granted' : 'denied',
                'security_storage': 'granted'
              });
            };
            
            // Debug logging in development
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
              console.log('Google Consent Mode v2 initialized with default denied state');
            }
          `,
        }}
      />
    </>
  )
}