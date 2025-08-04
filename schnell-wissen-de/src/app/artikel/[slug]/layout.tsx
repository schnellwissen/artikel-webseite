import { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/api'
import { generateArticleMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const article = await getArticleBySlug(resolvedParams.slug)
    
    if (!article) {
      return {
        title: 'Artikel nicht gefunden | SchnellWissen.de',
        description: 'Der angeforderte Artikel konnte nicht gefunden werden.',
      }
    }
    
    return generateArticleMetadata(article)
  } catch (error) {
    console.error('Error generating article metadata:', error)
    return {
      title: 'Artikel | SchnellWissen.de',
      description: 'Interessante Artikel auf SchnellWissen.de',
    }
  }
}

export default function ArticleLayout({ children }: Props) {
  return <>{children}</>
}