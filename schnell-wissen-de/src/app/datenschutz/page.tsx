'use client'

import { useConsent } from '@/contexts/ConsentContext'
import { Shield, Cookie, Eye, Target, ExternalLink, Mail, Phone, MapPin } from 'lucide-react'

export default function DatenschutzPage() {
  const { showConsentBanner, preferences } = useConsent()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
          <p className="text-gray-600">
            Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>

        {/* Consent Settings */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-900">Ihre Datenschutzeinstellungen</h2>
          </div>
          <p className="text-blue-800 mb-4">
            Sie können Ihre Einwilligung jederzeit anpassen oder widerrufen.
          </p>
          <button
            onClick={showConsentBanner}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Einstellungen ändern
          </button>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Name und Anschrift des Verantwortlichen</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="mb-2"><strong>SchnellWissen.de</strong></p>
            <p className="mb-4"><strong>Inhaber:</strong> Schnell Wissen</p>
            <div className="flex items-center mb-2">
              <Mail className="w-4 h-4 mr-2 text-gray-600" />
              <span>aschnellwissen@gmail.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              <span>Salamanderweg 16, 51375 Leverkusen, Deutschland</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Allgemeines zur Datenverarbeitung</h2>
          <h3 className="text-xl font-semibold mb-2">Umfang der Verarbeitung personenbezogener Daten</h3>
          <p className="mb-4">
            Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung 
            einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung 
            personenbezogener Daten unserer Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers.
          </p>

          <h3 className="text-xl font-semibold mb-2">Rechtsgrundlage für die Verarbeitung</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung für Cookies und Tracking</li>
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfüllung</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies und Tracking-Technologien</h2>
          
          <div className="grid gap-6">
            {/* Necessary Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold">Notwendige Cookies</h3>
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Immer aktiv
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Diese Cookies sind für die Grundfunktionen der Website erforderlich.
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Session-Cookies für die Navigation</li>
                <li>CSRF-Schutz Token</li>
                <li>Login-Status</li>
                <li>Consent-Einstellungen</li>
              </ul>
            </div>

            {/* Functional Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Cookie className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold">Funktionale Cookies</h3>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  preferences.functional ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {preferences.functional ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Spracheinstellungen</li>
                <li>Theme-Präferenzen</li>
                <li>Suchverlauf</li>
              </ul>
            </div>

            {/* Analytics Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Eye className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold">Analyse-Cookies</h3>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  preferences.analytics ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {preferences.analytics ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen.
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Google Analytics 4 (IP-anonymisiert)</li>
                <li>Seitenaufrufe und Verweildauer</li>
                <li>Anonyme Nutzungsstatistiken</li>
              </ul>
              {preferences.analytics && (
                <div className="mt-3 p-3 bg-purple-50 rounded text-sm">
                  <strong>Google Analytics:</strong> Mehr Informationen finden Sie in der{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-purple-600 underline">
                    Google Datenschutzerklärung
                  </a>
                </div>
              )}
            </div>

            {/* Marketing Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold">Marketing-Cookies</h3>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  preferences.ads ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {preferences.ads ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Diese Cookies werden verwendet, um relevante Werbung anzuzeigen.
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Google AdSense</li>
                <li>Werbepräferenzen</li>
                <li>Remarketing (bei Einwilligung)</li>
              </ul>
              {!preferences.ads && (
                <div className="mt-3 p-3 bg-orange-50 rounded text-sm">
                  <strong>Hinweis:</strong> Auch ohne Einwilligung können nicht-personalisierte Anzeigen angezeigt werden.
                </div>
              )}
            </div>

            {/* External Media */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <ExternalLink className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold">Externe Medien</h3>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  preferences.external_media ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {preferences.external_media ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Diese Cookies ermöglichen das Laden von Inhalten von Drittanbietern.
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>YouTube Videos (youtube-nocookie.com)</li>
                <li>Google Maps</li>
                <li>Social Media Widgets</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ihre Rechte</h2>
          <p className="mb-4">Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
            <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
            <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
            <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
            <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
            <li><strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Speicherdauer</h2>
          <p className="mb-4">
            Ihre Einwilligung zu Cookies wird für 12 Monate gespeichert. Danach werden Sie erneut um Ihre 
            Einwilligung gebeten. Sie können Ihre Einwilligung jederzeit über die Datenschutzeinstellungen 
            widerrufen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Kontakt</h2>
          <p className="mb-4">
            Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, 
            Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf von erteilten Einwilligungen wenden 
            Sie sich bitte an:
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p><strong>Datenschutzbeauftragter</strong></p>
            <p>E-Mail: aschnellwissen@gmail.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über unsere Verarbeitung 
            personenbezogener Daten zu beschweren.
          </p>
        </section>
      </div>
    </div>
  )
}