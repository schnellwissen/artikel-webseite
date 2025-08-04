import Link from 'next/link'
import Image from 'next/image'
import { ArticleWithCategory } from '@/lib/types'
import { formatDate, truncateText, stripHtmlAndClean } from '@/lib/utils'
import { Eye, Calendar } from 'lucide-react'
import { getCategoryIcon } from '@/lib/categoryIcons'

interface ArticleCardProps {
  article: ArticleWithCategory
  featured?: boolean
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const cardClasses = featured 
    ? "group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-blue-100"
    : "group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border"

  const titleClasses = featured
    ? "text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2"
    : "text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2"

  return (
    <article className={cardClasses}>
      <Link href={`/artikel/${article.slug}`}>
        {/* Image */}
        {article.image_url && (
          <div className={`relative ${featured ? 'h-64' : 'h-48'} w-full`}>
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "300px"}
            />
          </div>
        )}

        {/* Content */}
        <div className={`p-${featured ? '6' : '4'}`}>
          {/* Category Badge */}
          {article.category && (
            <div className="mb-3">
              {(() => {
                const iconConfig = getCategoryIcon(article.category.slug)
                const IconComponent = iconConfig.icon
                
                return (
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${iconConfig.color} ${iconConfig.bgColor} rounded-full`}>
                    <IconComponent className={`w-3 h-3 mr-1 ${iconConfig.color}`} />
                    {article.category.name}
                  </span>
                )
              })()}
            </div>
          )}

          {/* Title */}
          <h2 className={titleClasses}>
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 leading-relaxed">
            {truncateText(
              stripHtmlAndClean(article.content), 
              featured ? 120 : 80
            )}
          </p>

          {/* Author & Meta */}
          {article.author && (
            <div className="flex items-center mb-3">
              <img
                src={article.author.image_url || '/uploads/authors/default-avatar.png'}
                alt={article.author.name}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                {article.author.name}
              </span>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <time dateTime={article.created_at}>
                  {formatDate(article.created_at)}
                </time>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{article.views.toLocaleString()} Aufrufe</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ArticleCard