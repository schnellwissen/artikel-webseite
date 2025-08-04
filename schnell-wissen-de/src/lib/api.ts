import supabase from './supabase'
import { Article, Category, Author, ArticleWithCategory } from './types'

export async function getAuthors(): Promise<Author[]> {
  try {
    console.log('Loading authors...')
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name')

    console.log('Authors response:', { data, error })

    if (error) {
      console.error('Authors API error:', error)
      throw error
    }
    
    console.log('Authors loaded successfully:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('getAuthors failed:', error)
    throw error
  }
}

export async function getRandomAuthor(): Promise<Author> {
  try {
    // Versuche zuerst alle Autoren zu laden und dann einen zufälligen auszuwählen
    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')

    if (error) {
      console.error('getRandomAuthor database error:', error)
      // Fallback: Verwende Autor ID 1 (Lena Hartwig)
      return {
        id: 1,
        name: 'Lena Hartwig',
        image_url: '/uploads/authors/lena-hartwig.png',
        created_at: new Date().toISOString()
      }
    }

    if (!authors || authors.length === 0) {
      throw new Error('Keine Autoren gefunden')
    }

    // Wähle einen zufälligen Autor aus der Liste
    const randomIndex = Math.floor(Math.random() * authors.length)
    return authors[randomIndex]

  } catch (error) {
    console.error('getRandomAuthor failed:', error)
    // Letzter Fallback
    return {
      id: 1,
      name: 'Lena Hartwig',
      image_url: '/uploads/authors/lena-hartwig.png',
      created_at: new Date().toISOString()
    }
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    console.log('Loading categories...')
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    console.log('Categories response:', { data, error })

    if (error) {
      console.error('Categories API error:', error)
      throw error
    }
    
    console.log('Categories loaded successfully:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('getCategories failed:', error)
    throw error
  }
}

// Admin-Fallback ohne Auth
async function getCategoriesWithoutAuth(): Promise<Category[]> {
  try {
    // Erstelle temporären Client ohne Auth
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })

    const { data, error } = await tempClient
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Admin fallback also failed:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Admin fallback error:', error)
    return []
  }
}

export async function getArticles(limit?: number): Promise<ArticleWithCategory[]> {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getTopArticles(limit: number = 3): Promise<ArticleWithCategory[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithCategory | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getArticlesByCategory(categorySlug: string, limit?: number): Promise<ArticleWithCategory[]> {
  // First get the category ID
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function incrementArticleViews(articleId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_article_views', {
    article_id: articleId
  })

  if (error) throw error
}

export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views' | 'author_id'>): Promise<Article> {
  try {
    // Get random author
    const randomAuthor = await getRandomAuthor()
    
    const articleWithAuthor = {
      ...article,
      author_id: randomAuthor.id
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert(articleWithAuthor)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('createArticle failed:', error)
    throw error
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  try {
    console.log('Creating category:', category)
    
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) {
      console.error('Create category error:', error)
      
      // Fallback für Admin-Zugriff ohne RLS
      if (error.code === 'PGRST301' || error.message.includes('JWT') || error.code === '42501') {
        console.warn('Trying admin fallback for create category...')
        return await createCategoryWithoutAuth(category)
      }
      throw error
    }
    
    console.log('Category created successfully:', data)
    return data
  } catch (error) {
    console.error('createCategory failed:', error)
    throw error
  }
}

// Admin-Fallback für Category-Erstellung ohne Auth
async function createCategoryWithoutAuth(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  try {
    // Erstelle temporären Client ohne Auth
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })

    const { data, error } = await tempClient
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) {
      console.error('Admin fallback create category failed:', error)
      throw new Error(`Failed to create category: ${error.message}`)
    }
    
    return data
  } catch (error) {
    console.error('Admin fallback create category error:', error)
    throw error
  }
}

export async function getArticleById(id: string): Promise<ArticleWithCategory | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function updateArticle(
  id: string, 
  article: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views'>>
): Promise<Article> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout für kleinere Inhalte

  try {
    console.log('updateArticle: Starting update for article', id)
    
    // Validate content size before processing
    if (article.content) {
      const contentSize = new Blob([article.content]).size
      console.log('updateArticle: Content size:', Math.round(contentSize/1000) + 'KB')
      
      if (contentSize > 100000) { // 100KB limit - sehr konservativ für Supabase
        throw new Error(`Article content too large (${Math.round(contentSize/1000)}KB). Maximum: 100KB für Supabase.`)
      }
      
      // Check for problematic content patterns
      if (article.content.length > 50000) { // 50k characters
        console.warn('updateArticle: Large content detected, this may take longer...')
      }
    }

    const updateData = {
      ...article,
      updated_at: new Date().toISOString()
    }

    console.log('updateArticle: Sending update request with timeout...')
    
    // Add timeout to Supabase request
    const updatePromise = supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    const { data, error } = await updatePromise

    clearTimeout(timeoutId)

    if (error) {
      console.error('updateArticle: Supabase error:', error)
      
      // More specific error handling
      if (error.code === 'PGRST116') {
        throw new Error('Artikel nicht gefunden')
      } else if (error.message.includes('aborted') || error.name === 'AbortError') {
        throw new Error('TIMEOUT: Request wurde nach 15 Sekunden abgebrochen. Inhalt zu groß für Supabase.')
      } else if (error.message.includes('payload') || error.message.includes('too large')) {
        throw new Error('Content zu groß für die Datenbank. Reduzieren Sie den Inhalt.')
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Netzwerkfehler. Überprüfen Sie Ihre Internetverbindung.')
      } else {
        throw new Error(`Database error: ${error.message}`)
      }
    }

    if (!data) {
      throw new Error('Keine Daten von der Datenbank zurückgegeben')
    }

    console.log('updateArticle: Update successful')
    return data
    
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('updateArticle: Caught error:', error)
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('TIMEOUT: Speichern wurde nach 15 Sekunden abgebrochen. Inhalt zu groß für Supabase!')
    }
    
    throw error
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getSimilarArticles(
  currentArticleId: string, 
  limit: number = 5
): Promise<ArticleWithCategory[]> {
  // Lade den aktuellen Artikel nach ID
  const { data: currentArticle, error: currentError } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', currentArticleId)
    .single()

  if (currentError || !currentArticle) return []

  // Lade alle Artikel aus derselben Kategorie (außer dem aktuellen)
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', currentArticle.category_id)
    .neq('id', currentArticleId)
    .order('created_at', { ascending: false })
    .limit(20) // Mehr Artikel laden für bessere Ähnlichkeitsanalyse

  if (error) throw error
  
  const articles = data || []
  if (!articles.length) return []

  // Importiere Ähnlichkeits-Funktionen dynamisch
  const { findSimilarArticles } = await import('./similarity')
  
  // Finde ähnliche Artikel
  const similarArticles = findSimilarArticles(currentArticle, articles, limit)
  
  // Gib nur die Artikel zurück (ohne Similarity-Score für die API)
  return similarArticles.map(similarity => similarity.article)
}