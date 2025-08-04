'use client'

import { useEffect, useState } from 'react'
import { Category } from '@/lib/types'
import { getCategories } from '@/lib/api'
import Link from 'next/link'
import { Folder, ArrowLeft } from 'lucide-react'
import { getCategoryIcon } from '@/lib/categoryIcons'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...')
        const categoriesData = await getCategories()
        console.log('Got categories:', categoriesData)
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Fehler beim Laden der Kategorien: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück zur Startseite
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Alle Kategorien
        </h1>
        <p className="text-gray-600 text-lg">
          Entdecken Sie Artikel zu verschiedenen Themen
        </p>
      </header>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const iconConfig = getCategoryIcon(category.slug)
            const IconComponent = iconConfig.icon
            
            return (
              <Link
                key={category.id}
                href={`/kategorie/${category.slug}`}
                className="group bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${iconConfig.bgColor} rounded-lg flex items-center justify-center ${iconConfig.hoverColor} transition-colors`}>
                    <IconComponent className={`w-6 h-6 ${iconConfig.color}`} />
                  </div>
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 group-hover:${iconConfig.color} transition-colors mb-2`}>
                  {category.name}
                </h3>
                <p className="text-gray-600">
                  Artikel zum Thema {category.name}
                </p>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error ? error : 'Noch keine Kategorien verfügbar'}
          </h3>
          <p className="text-gray-600">
            {error ? 'Bitte versuchen Sie es später erneut.' : 'Es wurden noch keine Kategorien erstellt.'}
          </p>
        </div>
      )}
    </div>
  )
}