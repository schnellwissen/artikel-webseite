export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Author {
  id: number
  name: string
  image_url?: string
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  category_id: string
  author_id?: number
  content: string
  image_url?: string
  views: number
  created_at: string
  updated_at: string
  category?: Category
  author?: Author
}

export interface ArticleWithCategory extends Article {
  category: Category
}

export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile?: UserProfile
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

export interface ConsentLog {
  id: string
  anonymous_id: string
  preferences: Record<string, boolean>
  timestamp: string
  policy_version: string
  region: string
  user_agent: string
  created_at: string
}

export interface DatabaseTables {
  articles: Article
  categories: Category
  authors: Author
  user_profiles: UserProfile
  consent_logs: ConsentLog
}

// Global gtag types
declare global {
  interface Window {
    gtag: (
      command: 'consent' | 'config' | 'event' | 'js',
      target: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}