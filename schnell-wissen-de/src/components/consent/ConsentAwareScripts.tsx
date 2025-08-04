'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useConsent } from '@/contexts/ConsentContext'

// Configuration for third-party scripts
const THIRD_PARTY_SCRIPTS = [
  {
    id: 'google-analytics',
    category: 'analytics' as const,
    src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXX'}`,
    attributes: {},
    init: `
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXX'}', {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=Strict;Secure',
        'send_page_view': true
      });
    `,
  },
  {
    id: 'google-adsense',
    category: 'ads' as const,
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXX'}`,
    attributes: {
      crossorigin: 'anonymous',
      'data-ad-client': process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXX',
    },
    init: `
      // AdSense configuration for non-personalized ads when ads consent is denied
      if (typeof window !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXX'}",
          enable_page_level_ads: true
        });
      }
    `,
  },
] as const

export default function ConsentAwareScripts() {
  const { preferences, hasGivenConsent } = useConsent()

  return (
    <>
      {hasGivenConsent && THIRD_PARTY_SCRIPTS.map((script) => {
        // Only load script if user has consented to the category
        if (!preferences[script.category]) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Skipping ${script.id} - no consent for ${script.category}`)
          }
          return null
        }

        return (
          <div key={script.id}>
            {/* Load the script */}
            <Script
              id={script.id}
              src={script.src}
              strategy="afterInteractive"
              onLoad={() => {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Loaded ${script.id} with consent`)
                }
              }}
              {...(script.attributes || {})}
            />
            
            {/* Initialize the script */}
            {script.init && (
              <Script
                id={`${script.id}-init`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: script.init,
                }}
              />
            )}
          </div>
        )
      })}

      {/* Non-personalized AdSense when ads consent is denied but functional consent is given */}
      {hasGivenConsent && preferences.functional && !preferences.ads && (
        <Script
          id="adsense-non-personalized"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Configure AdSense for non-personalized ads
              window.googletag = window.googletag || {cmd: []};
              googletag.cmd.push(function() {
                googletag.pubads().setRequestNonPersonalizedAds(1);
                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
              });
            `,
          }}
        />
      )}
    </>
  )
}

// Hook to conditionally load external resources
export function useConsentAwareResource() {
  const { canUse } = useConsent()
  
  const loadScript = (src: string, category: 'analytics' | 'ads' | 'functional' | 'external_media') => {
    return new Promise<void>((resolve, reject) => {
      if (!canUse(category)) {
        reject(new Error(`No consent for ${category}`))
        return
      }
      
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.head.appendChild(script)
    })
  }
  
  const loadStylesheet = (href: string, category: 'analytics' | 'ads' | 'functional' | 'external_media') => {
    return new Promise<void>((resolve, reject) => {
      if (!canUse(category)) {
        reject(new Error(`No consent for ${category}`))
        return
      }
      
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.onload = () => resolve()
      link.onerror = () => reject(new Error(`Failed to load ${href}`))
      document.head.appendChild(link)
    })
  }
  
  return { loadScript, loadStylesheet, canUse }
}