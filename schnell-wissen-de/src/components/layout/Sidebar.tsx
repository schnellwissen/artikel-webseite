'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArticleWithCategory } from '@/lib/types'
import { getTopArticles, getSimilarArticles } from '@/lib/api'
import { TrendingUp, Link as LinkIcon } from 'lucide-react'

interface SidebarProps {
  currentArticleId?: string
}

const Sidebar = ({ currentArticleId }: SidebarProps) => {
  const [topArticles, setTopArticles] = useState<ArticleWithCategory[]>([])
  const [similarArticles, setSimilarArticles] = useState<ArticleWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [similarLoading, setSimilarLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topArticlesData = await getTopArticles(5)
        setTopArticles(topArticlesData)
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch similar articles when currentArticleId changes
  useEffect(() => {
    const fetchSimilarArticles = async () => {
      if (!currentArticleId) {
        setSimilarArticles([])
        return
      }

      setSimilarLoading(true)
      try {
        const similarData = await getSimilarArticles(currentArticleId, 5)
        setSimilarArticles(similarData)
      } catch (error) {
        console.error('Error fetching similar articles:', error)
        setSimilarArticles([])
      } finally {
        setSimilarLoading(false)
      }
    }

    fetchSimilarArticles()
  }, [currentArticleId])

  // Check if we're on an article page
  const isArticlePage = pathname?.startsWith('/artikel/') && currentArticleId

  if (loading) {
    return (
      <aside className="w-full lg:w-80 bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Top Artikel */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Beliebteste Artikel</h3>
        </div>
        <div className="space-y-4">
          {topArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="block group"
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{article.views.toLocaleString()} Aufrufe</span>
                    {article.category && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{article.category.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ähnliche Artikel - nur auf Artikel-Seiten anzeigen */}
      {isArticlePage && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <LinkIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Ähnliche Artikel</h3>
          </div>
          
          {similarLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : similarArticles.length > 0 ? (
            <div className="space-y-4">
              {similarArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/artikel/${article.slug}`}
                  className="block group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{article.views.toLocaleString()} Aufrufe</span>
                        {article.category && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{article.category.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm">
                Keine ähnlichen Artikel gefunden
              </div>
            </div>
          )}
        </div>
      )}

      {/* Werbeplatz */}
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="text-gray-500 text-sm mb-2">Werbung</div>
        <div className="bg-gray-200 rounded h-32 flex items-center justify-center">
          <span className="text-gray-400 text-xs">AdSense Platzhalter</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar