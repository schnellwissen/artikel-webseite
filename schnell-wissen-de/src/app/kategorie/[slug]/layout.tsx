import { Metadata } from 'next'
import { getCategories, getArticlesByCategory } from '@/lib/api'
import { generateCategoryMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const [categories, articles] = await Promise.all([
      getCategories(),
      getArticlesByCategory(resolvedParams.slug)
    ])
    
    const category = categories.find(cat => cat.slug === resolvedParams.slug)
    
    if (!category) {
      return {
        title: 'Kategorie nicht gefunden | SchnellWissen.de',
        description: 'Die angeforderte Kategorie konnte nicht gefunden werden.',
      }
    }
    
    return generateCategoryMetadata(category.name, articles.length)
  } catch (error) {
    console.error('Error generating category metadata:', error)
    return {
      title: 'Kategorie | SchnellWissen.de',
      description: 'Artikel nach Kategorien auf SchnellWissen.de',
    }
  }
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>
}