'use client'

import { useState, useEffect } from 'react'
import { createCategory, getCategories } from '@/lib/api'
import { Category } from '@/lib/types'

const defaultCategories = [
  { name: 'Technik & Gadgets', slug: 'technik-gadgets' },
  { name: 'Gaming & Unterhaltung', slug: 'gaming-unterhaltung' },
  { name: 'Energie & Umwelt', slug: 'energie-umwelt' },
  { name: 'Alltag & Haushalt', slug: 'alltag-haushalt' },
  { name: 'Gesundheit & Wohlbefinden', slug: 'gesundheit-wohlbefinden' },
  { name: 'Wissen & Kurioses', slug: 'wissen-kurioses' },
  { name: 'Beruf & Karriere', slug: 'beruf-karriere' },
  { name: 'Geld & Finanzen', slug: 'geld-finanzen' },
  { name: 'Zukunft & Innovation', slug: 'zukunft-innovation' },
  { name: 'Produktvergleiche & Empfehlungen', slug: 'produktvergleiche-empfehlungen' }
]

export default function DebugCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      console.log('Lade Kategorien...')
      const categoriesData = await getCategories()
      console.log('Kategorien geladen:', categoriesData)
      setCategories(categoriesData)
      
      if (categoriesData.length === 0) {
        setMessage({ 
          type: 'warning', 
          text: 'Keine Kategorien gefunden! Klicken Sie auf "Kategorien erstellen" um sie automatisch zu erstellen.' 
        })
      } else {
        setMessage({ 
          type: 'success', 
          text: `${categoriesData.length} Kategorien gefunden.` 
        })
      }
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error)
      setMessage({ type: 'error', text: 'Fehler beim Laden der Kategorien: ' + (error as Error).message })
    }
  }

  const createDefaultCategories = async () => {
    setLoading(true)
    setMessage({ type: 'info', text: 'Erstelle Standard-Kategorien...' })
    
    let createdCount = 0
    const results: string[] = []

    try {
      for (const category of defaultCategories) {
        try {
          console.log('Erstelle Kategorie:', category)
          await createCategory(category)
          createdCount++
          results.push(`✅ ${category.name}`)
          console.log(`Kategorie erstellt: ${category.name}`)
        } catch (error) {
          console.warn('Fehler beim Erstellen der Kategorie:', category.name, error)
          results.push(`❌ ${category.name}: ${(error as Error).message}`)
        }
      }

      setMessage({ 
        type: createdCount > 0 ? 'success' : 'error', 
        text: `${createdCount} von ${defaultCategories.length} Kategorien erstellt.\n${results.join('\n')}` 
      })
      
      if (createdCount > 0) {
        await fetchCategories() // Kategorien neu laden
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Kategorien:', error)
      setMessage({ type: 'error', text: 'Fehler beim Erstellen der Kategorien: ' + (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug: Kategorien verwalten</h1>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' :
            message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <pre className="whitespace-pre-wrap">{message.text}</pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Aktuelle Kategorien ({categories.length})</h2>
            <div className="space-x-2">
              <button
                onClick={fetchCategories}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Neu laden
              </button>
              <button
                onClick={createDefaultCategories}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Erstelle...' : 'Kategorien erstellen'}
              </button>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium">{index + 1}.</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Slug: {category.slug}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {category.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Keine Kategorien gefunden.</p>
              <p className="text-sm mt-2">Klicken Sie auf "Kategorien erstellen" um Standard-Kategorien zu erstellen.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Standard-Kategorien die erstellt werden:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {defaultCategories.map((category, index) => (
              <div key={category.slug} className="flex items-center space-x-2">
                <span className="text-sm font-medium">{index + 1}.</span>
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-gray-500">({category.slug})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}