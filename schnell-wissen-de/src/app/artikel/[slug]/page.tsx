'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArticleWithCategory } from '@/lib/types'
import { getArticleBySlug, incrementArticleViews } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Calendar, Eye, ArrowLeft, Tag, Edit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Sidebar from '@/components/layout/Sidebar'
import RichTextContent from '@/components/ui/RichTextContent'
import { useAuth } from '@/contexts/AuthContext'

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const { isAdmin } = useAuth()
  
  const [article, setArticle] = useState<ArticleWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        const articleData = await getArticleBySlug(slug)
        
        if (!articleData) {
          setError('Artikel nicht gefunden')
          return
        }
        
        setArticle(articleData)
        
        // Increment view count
        await incrementArticleViews(articleData.id)
        setArticle(prev => prev ? { ...prev, views: prev.views + 1 } : null)
        
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Fehler beim Laden des Artikels')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Sidebar />
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Artikel nicht gefunden'}
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
        {/* Article Content */}
        <article className="lg:col-span-3">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category Badge */}
            {article.category && (
              <Link 
                href={`/kategorie/${article.category.slug}`}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors mb-4"
              >
                <Tag className="w-3 h-3 mr-1" />
                {article.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Author Information */}
            {article.author && (
              <div className="flex items-center mb-4">
                <img
                  src={article.author.image_url || '/uploads/authors/default-avatar.png'}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">{article.author.name}</p>
                  <p className="text-sm text-gray-500">Autor</p>
                </div>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={article.created_at}>
                  {formatDate(article.created_at)}
                </time>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{article.views.toLocaleString()} Aufrufe</span>
              </div>
              {isAdmin && (
                <Link 
                  href={`/admin/artikel-bearbeiten/${article.id}`}
                  className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Bearbeiten
                </Link>
              )}
            </div>

            {/* Featured Image */}
            {article.image_url && (
              <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <RichTextContent 
            content={article.content}
            className="article-content prose prose-lg max-w-none"
          />

          {/* Ad Space */}
          <div className="bg-gray-100 rounded-lg p-6 text-center mt-12">
            <div className="text-gray-500 text-sm mb-2">Werbung</div>
            <div className="bg-gray-200 rounded h-32 flex items-center justify-center">
              <span className="text-gray-400 text-xs">AdSense Platzhalter</span>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <Sidebar currentArticleId={article.id} />
      </div>
    </div>
  )
}