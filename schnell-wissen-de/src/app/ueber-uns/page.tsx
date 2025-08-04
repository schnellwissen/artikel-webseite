import Link from 'next/link'
import { ArrowLeft, Users, Target, Heart, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück zur Startseite
      </Link>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Über <span className="text-blue-600">SchnellWissen</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, 
          Gesundheit und vielem mehr.
        </p>
      </header>

      {/* Mission Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Unsere Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Bei SchnellWissen.de glauben wir daran, dass Wissen für jeden zugänglich sein sollte. 
            Unser Ziel ist es, komplexe Themen verständlich aufzubereiten und unseren Lesern 
            täglich neue, interessante Einblicke zu bieten. Wir möchten eine Brücke zwischen 
            Wissenschaft und Alltag schlagen.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Unsere Werte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Schnell & Aktuell</h3>
            <p className="text-gray-600">
              Wir liefern die neuesten Entwicklungen und Erkenntnisse, 
              sobald sie verfügbar sind.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Fundiert & Vertrauenswürdig</h3>
            <p className="text-gray-600">
              Alle unsere Artikel basieren auf sorgfältiger Recherche 
              und vertrauenswürdigen Quellen.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Für Jeden Verständlich</h3>
            <p className="text-gray-600">
              Komplexe Themen erklären wir so, dass sie für jeden 
              Interessierten zugänglich sind.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Unser Team</h2>
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Das SchnellWissen Team</h3>
          <p className="text-gray-600 leading-relaxed">
            Unser Team besteht aus leidenschaftlichen Autoren, Wissenschaftlern und Experten 
            aus verschiedenen Fachbereichen. Gemeinsam arbeiten wir daran, euch täglich 
            mit spannenden und informativen Inhalten zu versorgen.
          </p>
        </div>
      </section>

      {/* Topics Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Unsere Themenbereiche</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            'Technologie',
            'Wissenschaft', 
            'Gesundheit',
            'Lifestyle',
            'Business'
          ].map((topic) => (
            <div key={topic} className="bg-blue-50 rounded-lg p-4 text-center">
              <span className="font-medium text-blue-900">{topic}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Fragen oder Anregungen?
        </h2>
        <p className="text-gray-600 mb-6">
          Wir freuen uns über Feedback und Themenvorschläge von unseren Lesern.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Zur Startseite
        </Link>
      </section>
    </div>
  )
}