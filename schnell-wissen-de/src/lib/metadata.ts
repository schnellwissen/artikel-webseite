import { Metadata } from 'next'
import { ArticleWithCategory } from './types'

export function generateArticleMetadata(article: ArticleWithCategory): Metadata {
  const description = article.content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .substring(0, 160) // Limit to 160 characters for meta description
    .trim() + '...'

  return {
    title: `${article.title} | SchnellWissen.de`,
    description,
    keywords: [
      article.title.split(' '),
      article.category?.name || '',
      'Artikel',
      'Wissen',
      'SchnellWissen'
    ].flat().filter(Boolean),
    authors: [{ name: 'SchnellWissen.de Team' }],
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: ['SchnellWissen.de Team'],
      section: article.category?.name,
      tags: [article.category?.name || ''].filter(Boolean),
      images: article.image_url ? [{
        url: article.image_url,
        width: 1200,
        height: 630,
        alt: article.title,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.image_url ? [article.image_url] : undefined,
    },
  }
}

export function generateCategoryMetadata(categoryName: string, articleCount: number): Metadata {
  return {
    title: `${categoryName} Artikel | SchnellWissen.de`,
    description: `Entdecken Sie ${articleCount} interessante Artikel zum Thema ${categoryName}. Aktuelle Informationen und fundiertes Wissen auf SchnellWissen.de.`,
    keywords: [categoryName, 'Artikel', 'Wissen', 'Information', 'SchnellWissen'],
    openGraph: {
      title: `${categoryName} Artikel | SchnellWissen.de`,
      description: `Entdecken Sie ${articleCount} interessante Artikel zum Thema ${categoryName}. Aktuelle Informationen und fundiertes Wissen auf SchnellWissen.de.`,
      type: 'website',
    },
  }
}

export const defaultMetadata: Metadata = {
  title: 'SchnellWissen.de - Täglich neue interessante Artikel',
  description: 'Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, Gesundheit und vielem mehr. Schnell informiert, fundiert erklärt.',
  keywords: ['Artikel', 'Wissen', 'Technologie', 'Wissenschaft', 'Gesundheit', 'News', 'Information'],
  authors: [{ name: 'SchnellWissen.de Team' }],
  openGraph: {
    title: 'SchnellWissen.de - Täglich neue interessante Artikel',
    description: 'Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, Gesundheit und vielem mehr.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'SchnellWissen.de',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SchnellWissen.de - Täglich neue interessante Artikel',
    description: 'Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, Gesundheit und vielem mehr.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}