import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg font-semibold mb-4">SchnellWissen.de</p>
            <p className="font-medium mb-4">Inhaber: Schnell Wissen</p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                <div>
                  <p>Salamanderweg 16</p>
                  <p>51375 Leverkusen</p>
                  <p>Deutschland</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-600" />
                <span>aschnellwissen@gmail.com</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="font-semibold">Schnell Wissen</p>
            <p>Salamanderweg 16</p>
            <p>51375 Leverkusen</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
          <p className="mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
            unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mb-4">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der 
            Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen 
            werden wir diese Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Links</h2>
          <p className="mb-4">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
            Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
          <p className="mb-4">
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
            Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
          <p className="mb-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p className="mb-4">
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
            beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verwendete Dienste und Tools</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                Google Analytics
              </h3>
              <p className="text-gray-600 mb-2">
                Diese Website nutzt Google Analytics zur Analyse des Nutzerverhaltens (nur mit Einwilligung).
              </p>
              <p className="text-sm text-gray-500">
                Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-green-600" />
                Google AdSense
              </h3>
              <p className="text-gray-600 mb-2">
                Diese Website nutzt Google AdSense zur Anzeige von Werbung.
              </p>
              <p className="text-sm text-gray-500">
                Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-red-600" />
                YouTube
              </h3>
              <p className="text-gray-600 mb-2">
                Eingebettete Videos werden über youtube-nocookie.com geladen (nur mit Einwilligung).
              </p>
              <p className="text-sm text-gray-500">
                Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-purple-600" />
                Supabase
              </h3>
              <p className="text-gray-600 mb-2">
                Database-as-a-Service für die Speicherung von Artikeln und Nutzerdaten.
              </p>
              <p className="text-sm text-gray-500">
                Anbieter: Supabase Inc., USA (EU-Hosting verfügbar)
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Online-Streitbeilegung (OS)</h2>
          <p className="mb-4">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener" className="text-blue-600 underline ml-1">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>
            Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, 
            an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 mb-2">
            <strong>Fragen zum Impressum?</strong>
          </p>
          <p className="text-blue-700">
            Bei Fragen zu diesem Impressum oder unseren Diensten kontaktieren Sie uns gerne unter{' '}
            <a href="mailto:aschnellwissen@gmail.com" className="underline">aschnellwissen@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}