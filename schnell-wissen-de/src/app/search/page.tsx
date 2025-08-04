'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'
import { ArticleWithCategory } from '@/lib/types'

interface SearchResult extends Omit<ArticleWithCategory, 'content'> {
  preview: string
}

interface SearchResponse {
  success: boolean
  query: string
  results: SearchResult[]
  count: number
  error?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setError('Suchbegriff muss mindestens 2 Zeichen lang sein')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
      const data: SearchResponse = await response.json()

      if (!data.success) {
        setError(data.error || 'Fehler bei der Suche')
        setResults([])
        return
      }

      setResults(data.results)
      console.log('Search results:', data.results)
      
    } catch (err) {
      console.error('Search error:', err)
      setError('Netzwerkfehler bei der Suche')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Artikel durchsuchen
        </h1>
        <p className="text-gray-600 text-lg">
          Finden Sie die Artikel, die Sie interessieren
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nach Artikeln suchen..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading || query.trim().length < 2}
          className="mt-4 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Suche läuft...' : 'Suchen'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !loading && (
        <div className="mb-6">
          <p className="text-gray-600">
            {results.length > 0 
              ? `${results.length} Artikel${results.length === 1 ? '' : ''} gefunden für "${query}"`
              : `Keine Artikel gefunden für "${query}"`
            }
          </p>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Article Image */}
                {article.image_url && (
                  <div className="md:w-48 md:flex-shrink-0">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-32 md:h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {article.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category.name}
                      </span>
                    )}
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.created_at)}
                    </span>
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {article.views} Aufrufe
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link 
                      href={`/artikel/${article.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {highlightText(article.title, query)}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {highlightText(article.preview, query)}
                  </p>
                  
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Artikel lesen →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* No Results */}
      {hasSearched && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Artikel gefunden
          </h3>
          <p className="text-gray-600 mb-4">
            Versuchen Sie es mit anderen Suchbegriffen oder schauen Sie sich unsere Kategorien an.
          </p>
          <Link
            href="/kategorien"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Alle Kategorien ansehen
          </Link>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-48 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}