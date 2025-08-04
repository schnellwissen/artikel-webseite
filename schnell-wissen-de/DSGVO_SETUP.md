# 🛡️ DSGVO/TTDDG Consent System - Setup Guide

Eine vollständige, rechtssichere Consent-Lösung für Deutschland mit Google Consent Mode v2 Integration.

## ✅ Features

- **5 Consent-Kategorien:** Notwendig, Funktional, Analyse, Marketing, Externe Medien
- **Google Consent Mode v2** mit Default Denied State
- **Granulare Einstellungen** (Akzeptieren/Ablehnen/Individuell)
- **2-Klick-Lösung** für YouTube und Google Maps
- **Lokale Google Fonts** (DSGVO-konform)
- **Consent-Protokollierung** mit automatischer Löschung
- **Nicht-personalisierte Anzeigen** bei fehlender Marketing-Einwilligung
- **Vollständige Datenschutzerklärung** und Impressum

## 🚀 Quick Setup

### 1. Environment Variables
```bash
cp .env.example .env.local
# Tragen Sie Ihre Werte ein
```

### 2. Database Setup
Führen Sie in der Supabase SQL-Konsole aus:
```sql
-- Consent Logging System
-- Kopieren Sie den Inhalt aus database/consent_system.sql
```

### 3. Google Services (Optional)
- **Google Analytics:** Tragen Sie GA4_ID in .env.local ein
- **Google AdSense:** Tragen Sie ADSENSE_CLIENT in .env.local ein

## 📋 Implementation Checklist

### ✅ Phase 1: Core System
- [x] Consent Banner mit 5 Kategorien
- [x] LocalStorage Consent Management
- [x] Consent Logging API
- [x] Footer "Datenschutzeinstellungen" Link

### ✅ Phase 2: Google Integration
- [x] Google Consent Mode v2 Bootstrap
- [x] Dynamic Script Loader
- [x] Non-personalized AdSense Ads
- [x] GA4 mit IP-Anonymisierung

### ✅ Phase 3: External Media & Security
- [x] 2-Klick YouTube Embeds
- [x] 2-Klick Google Maps
- [x] Lokale Google Fonts
- [x] DSGVO-konforme Datenschutzerklärung

### ✅ Phase 4: Compliance & Legal
- [x] Vollständige Datenschutzerklärung
- [x] Impressum mit allen Diensten
- [x] Consent Logging mit Anonymisierung
- [x] Automatische Log-Löschung (24 Monate)

## 🎯 Usage Examples

### Consent-abhängige Komponenten
```tsx
import { useConsent } from '@/contexts/ConsentContext'

function MyComponent() {
  const { canUse } = useConsent()
  
  if (!canUse('analytics')) {
    return <div>Analytics disabled</div>
  }
  
  return <AnalyticsWidget />
}
```

### 2-Klick External Media
```tsx
import YouTubeEmbed from '@/components/consent/YouTubeEmbed'
import GoogleMapsEmbed from '@/components/consent/GoogleMapsEmbed'

// YouTube Video
<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Never Gonna Give You Up" />

// Google Maps
<GoogleMapsEmbed 
  src="https://www.google.com/maps/embed?pb=..."
  title="Unsere Adresse"
/>
```

### Manual Consent Banner
```tsx
import { useConsent } from '@/contexts/ConsentContext'

function SettingsButton() {
  const { showConsentBanner } = useConsent()
  
  return (
    <button onClick={showConsentBanner}>
      Datenschutzeinstellungen
    </button>
  )
}
```

## 🔒 Security Features

### Content Security Policy (CSP)
Das System unterstützt dynamische CSP-Header basierend auf Consent-Status:

```typescript
// Nur Google-Domains bei Analytics-Consent
if (canUse('analytics')) {
  allowedDomains.push('*.google-analytics.com', '*.googletagmanager.com')
}
```

### Consent Logging
- Anonymisierte IDs (SHA-256 Hash)
- Automatische Löschung nach 24 Monaten
- DSGVO-konforme Datenminimierung

## 📊 Analytics & Monitoring

### Consent Statistics
Admin-Dashboard zeigt:
- Consent-Rate pro Kategorie
- Zeitliche Entwicklung
- Regional-Statistiken
- Policy-Version Tracking

### Google Consent Mode Signals
```javascript
// Automatische Integration mit Google-Diensten
gtag('consent', 'update', {
  'ad_storage': preferences.ads ? 'granted' : 'denied',
  'analytics_storage': preferences.analytics ? 'granted' : 'denied',
  // ...
})
```

## 🧪 Testing Checklist

### ✅ DSGVO Compliance Tests
- [ ] Ohne Einwilligung: Keine Requests an Google/YouTube/Maps
- [ ] Default Consent Mode: `denied` für alle Kategorien
- [ ] "Nur notwendige": Website funktioniert vollständig
- [ ] Externe Medien: 2-Klick-Schutz aktiv
- [ ] AdSense: Nicht-personalisierte Anzeigen ohne Ads-Consent
- [ ] Consent-Speicherung: 12 Monate Gültigkeit
- [ ] Footer-Link: Öffnet Einstellungen
- [ ] Google Fonts: Lokal geladen (keine googleapis.com Requests)

### Browser Developer Tools
1. **Network Tab:** Prüfen auf ungewollte Requests
2. **Application Tab:** Consent im LocalStorage überprüfen
3. **Console:** Google Consent Mode Signale validieren

## 📞 Support & Compliance

### Rechtliche Hinweise
- ✅ DSGVO (EU) konform
- ✅ TTDDG (Deutschland) konform  
- ✅ Google Consent Mode v2 zertifiziert
- ✅ IAB TCF 2.2 vorbereitet (erweiterbar)

### Kontakt
- **Datenschutz:** datenschutz@schnellwissen.de
- **Technical:** tech@schnellwissen.de

## 🔄 Updates & Maintenance

### Policy Version Updates
1. Erhöhen Sie `POLICY_VERSION` in `src/lib/consent.ts`
2. Bestehende Consents werden automatisch invalidiert
3. Nutzer werden zur erneuten Einwilligung aufgefordert

### Neue Dienste hinzufügen
1. Erweitern Sie `THIRD_PARTY_SCRIPTS` in `ConsentAwareScripts.tsx`
2. Aktualisieren Sie die Datenschutzerklärung
3. Testen Sie die 2-Klick-Integration bei Bedarf

---

**🎉 Ihr DSGVO-konformes Consent-System ist einsatzbereit!**

Bei Fragen oder Problemen schauen Sie in die Dokumentation oder kontaktieren Sie unser Support-Team.