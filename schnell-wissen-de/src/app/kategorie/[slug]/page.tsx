'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArticleWithCategory, Category } from '@/lib/types'
import { getArticlesByCategory, getCategories } from '@/lib/api'
import ArticleCard from '@/components/ui/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import { ArrowLeft, Folder, FileText } from 'lucide-react'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [articles, setArticles] = useState<ArticleWithCategory[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const articlesPerPage = 12

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        
        // Get all categories to find the current one
        const categories = await getCategories()
        const currentCategory = categories.find(cat => cat.slug === slug)
        
        if (!currentCategory) {
          setError('Kategorie nicht gefunden')
          return
        }
        
        setCategory(currentCategory)
        
        // Get articles for this category
        const categoryArticles = await getArticlesByCategory(slug, articlesPerPage * page)
        setArticles(categoryArticles)
        
        // Check if there are more articles
        setHasMore(categoryArticles.length === articlesPerPage * page)
        
      } catch (err) {
        console.error('Error fetching category data:', err)
        setError('Fehler beim Laden der Kategorie')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, page])

  const loadMore = async () => {
    if (!hasMore || loading) return
    
    try {
      const nextPage = page + 1
      const moreArticles = await getArticlesByCategory(slug, articlesPerPage * nextPage)
      
      if (moreArticles.length <= articles.length) {
        setHasMore(false)
      } else {
        setArticles(moreArticles)
        setPage(nextPage)
      }
    } catch (err) {
      console.error('Error loading more articles:', err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Kategorie nicht gefunden'}
          </h1>
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>

          {/* Category Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <Folder className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {category.name}
              </h1>
            </div>
            
            <div className="flex items-center text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              <span>
                {articles.length} {articles.length === 1 ? 'Artikel' : 'Artikel'} gefunden
              </span>
            </div>
          </header>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Weitere Artikel laden
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Noch keine Artikel in dieser Kategorie
              </h3>
              <p className="text-gray-600 mb-6">
                Es wurden noch keine Artikel in der Kategorie &quot;{category.name}&quot; veröffentlicht.
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Alle Artikel ansehen
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  )
}