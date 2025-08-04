import Link from 'next/link'
import Image from 'next/image'
import { ArticleWithCategory } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Eye, Calendar } from 'lucide-react'
import { getCategoryIcon } from '@/lib/categoryIcons'

interface ArticleListCardProps {
  article: ArticleWithCategory
  showRank?: boolean
  rank?: number
}

const ArticleListCard = ({ article, showRank = false, rank }: ArticleListCardProps) => {
  return (
    <article className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <Link href={`/artikel/${article.slug}`}>
        <div className="flex items-center p-4 gap-4">
          {/* Rank Badge */}
          {showRank && rank && (
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {rank}
            </div>
          )}

          {/* Article Image */}
          {article.image_url && (
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                sizes="96px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category Badge */}
            {article.category && (
              <div className="mb-2">
                {(() => {
                  const iconConfig = getCategoryIcon(article.category.slug)
                  const IconComponent = iconConfig.icon
                  
                  return (
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${iconConfig.color} ${iconConfig.bgColor} rounded-full`}>
                      <IconComponent className={`w-3 h-3 mr-1 ${iconConfig.color}`} />
                      {article.category.name}
                    </span>
                  )
                })()}
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
              {article.title}
            </h3>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {/* Author */}
              {article.author && (
                <div className="flex items-center gap-2">
                  <img
                    src={article.author.image_url || '/uploads/authors/default-avatar.png'}
                    alt={article.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-medium">{article.author.name}</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <time dateTime={article.created_at}>
                  {formatDate(article.created_at)}
                </time>
              </div>

              {/* Views */}
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

export default ArticleListCard