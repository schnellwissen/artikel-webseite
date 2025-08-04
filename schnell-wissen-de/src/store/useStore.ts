import { create } from 'zustand'
import { Article, Category, ArticleWithCategory } from '@/lib/types'

interface AppState {
  articles: ArticleWithCategory[]
  topArticles: ArticleWithCategory[]
  categories: Category[]
  loading: boolean
  error: string | null
  
  setArticles: (articles: ArticleWithCategory[]) => void
  setTopArticles: (articles: ArticleWithCategory[]) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  addArticle: (article: ArticleWithCategory) => void
  updateArticleViews: (articleId: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  articles: [],
  topArticles: [],
  categories: [],
  loading: false,
  error: null,

  setArticles: (articles) => set({ articles }),
  setTopArticles: (topArticles) => set({ topArticles }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addArticle: (article) => set((state) => ({
    articles: [article, ...state.articles]
  })),

  updateArticleViews: (articleId) => set((state) => ({
    articles: state.articles.map(article =>
      article.id === articleId
        ? { ...article, views: article.views + 1 }
        : article
    ),
    topArticles: state.topArticles.map(article =>
      article.id === articleId
        ? { ...article, views: article.views + 1 }
        : article
    )
  }))
}))