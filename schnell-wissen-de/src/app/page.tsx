'use client'

import { useEffect, useState } from 'react'
import { ArticleWithCategory } from '@/lib/types'
import { getArticles, getTopArticles } from '@/lib/api'
import ArticleCard from '@/components/ui/ArticleCard'
import ArticleListCard from '@/components/ui/ArticleListCard'
import Sidebar from '@/components/layout/Sidebar'
import { Star, TrendingUp, Clock } from 'lucide-react'
import SearchBox from '@/components/ui/SearchBox'

export default function Home() {
  const [topArticles, setTopArticles] = useState<ArticleWithCategory[]>([])
  const [recentArticles, setRecentArticles] = useState<ArticleWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [topData, recentData] = await Promise.all([
          getTopArticles(3),
          getArticles(9)
        ])
        setTopArticles(topData)
        setRecentArticles(recentData)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Fehler beim Laden der Artikel')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Willkommen bei <span className="text-blue-200">SchnellWissen</span>
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, 
          Gesundheit und vielem mehr. Schnell informiert, fundiert erklärt.
        </p>
        
        {/* Search Box */}
        <div className="max-w-md mx-auto">
          <SearchBox 
            placeholder="Nach Artikeln suchen..." 
            className="bg-white/10 backdrop-blur-sm rounded-xl"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Top 3 Articles of the Month */}
          <section>
            <div className="flex items-center mb-6">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Top 3 Artikel des Monats</h2>
            </div>
            {topArticles.length > 0 ? (
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <ArticleListCard 
                    key={article.id} 
                    article={article} 
                    showRank={true} 
                    rank={index + 1} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Noch keine Top-Artikel verfügbar
              </div>
            )}
          </section>

          {/* Recent Articles */}
          <section>
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Neueste Artikel</h2>
            </div>
            {recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <ArticleListCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Noch keine Artikel verfügbar
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  )
}
