'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/types'
import { createArticle, createCategory, getCategories } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { Upload, Save, Plus, FolderPlus, FileText, Image as ImageIcon, Shield, LogOut, List } from 'lucide-react'
import { getCategoryIcon } from '@/lib/categoryIcons'
import ImageUpload from '@/components/ui/ImageUpload'
import ClientOnlyRichTextEditor from '@/components/ui/ClientOnlyRichTextEditor'
// import ProtectedRoute from '@/components/auth/ProtectedRoute'

interface ArticleFormData {
  title: string
  category_id: string
  content: string
  image_url: string
}

interface CategoryFormData {
  name: string
}

// Temporäre Admin-Überprüfung als Fallback
const checkAdminAccess = () => {
  try {
    // Überprüfe Token in localStorage (Fallback für alte Implementierung)
    const adminToken = localStorage.getItem('admin_token')
    const hasValidToken = adminToken === 'schnellwissen_admin_2024_xyz789_secure'
    
    if (!hasValidToken) {
      console.warn('Invalid or missing admin token')
      return false
    }
    
    console.log('Admin access validated')
    return true
  } catch (error) {
    console.error('Admin access check failed:', error)
    return false
  }
}

export default function SecureAdminPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'article' | 'category' | 'manage'>('article')
  
  // Article form state
  const [articleForm, setArticleForm] = useState<ArticleFormData>({
    title: '',
    category_id: '',
    content: '',
    image_url: ''
  })
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: ''
  })
  
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...')
      
      // Stelle sicher, dass wir im Admin-Modus sind
      const isAdmin = checkAdminAccess()
      if (!isAdmin) {
        console.error('No admin access for categories')
        setCategories([])
        return
      }
      
      const categoriesData = await getCategories()
      console.log('Categories loaded:', categoriesData)
      setCategories(categoriesData)
      
      if (categoriesData.length === 0) {
        console.log('No categories found - auto-creating default categories...')
        setMessage({ 
          type: 'info', 
          text: 'Keine Kategorien gefunden. Standard-Kategorien werden automatisch erstellt...' 
        })
        
        // Erstelle automatisch Standard-Kategorien OHNE Nachfrage
        await createDefaultCategories()
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
      setMessage({ type: 'error', text: 'Fehler beim Laden der Kategorien. Überprüfen Sie die Datenbankverbindung.' })
    }
  }

  const createDefaultCategories = async () => {
    const defaultCategories = [
      { name: 'Technik & Gadgets', slug: 'technik-gadgets' },
      { name: 'Gaming & Unterhaltung', slug: 'gaming-unterhaltung' },
      { name: 'Energie & Umwelt', slug: 'energie-umwelt' },
      { name: 'Alltag & Haushalt', slug: 'alltag-haushalt' },
      { name: 'Gesundheit & Wohlbefinden', slug: 'gesundheit-wohlbefinden' },
      { name: 'Wissen & Kurioses', slug: 'wissen-kurioses' },
      { name: 'Beruf & Karriere', slug: 'beruf-karriere' },
      { name: 'Geld & Finanzen', slug: 'geld-finanzen' },
      { name: 'Zukunft & Innovation', slug: 'zukunft-innovation' },
      { name: 'Produktvergleiche & Empfehlungen', slug: 'produktvergleiche-empfehlungen' }
    ]

    setLoading(true)
    let createdCount = 0

    try {
      for (const category of defaultCategories) {
        try {
          await createCategory(category)
          createdCount++
        } catch (error) {
          console.warn('Failed to create category:', category.name, error)
        }
      }

      if (createdCount > 0) {
        console.log(`Successfully created ${createdCount} default categories`)
        setMessage({ 
          type: 'success', 
          text: `✅ ${createdCount} Standard-Kategorien automatisch erstellt! Artikel-Erstellung ist jetzt möglich.` 
        })
        await fetchCategories() // Refresh categories
        // Bleibe auf dem aktuellen Tab
      } else {
        console.error('Failed to create any default categories')
        setMessage({ type: 'error', text: 'Fehler beim automatischen Erstellen der Standard-Kategorien. Versuchen Sie es manuell.' })
      }
    } catch (error) {
      console.error('Error creating default categories:', error)
      setMessage({ type: 'error', text: 'Fehler beim Erstellen der Standard-Kategorien.' })
    } finally {
      setLoading(false)
    }
  }

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (categories.length === 0) {
      setMessage({ type: 'error', text: 'Keine Kategorien verfügbar! Erstellen Sie zuerst eine Kategorie.' })
      setActiveTab('category')
      return
    }
    
    if (!articleForm.title || !articleForm.category_id || !articleForm.content) {
      setMessage({ type: 'error', text: 'Bitte füllen Sie alle Pflichtfelder aus (Titel, Kategorie, Inhalt).' })
      return
    }

    setLoading(true)
    
    try {
      const slug = slugify(articleForm.title)
      
      await createArticle({
        title: articleForm.title,
        slug,
        category_id: articleForm.category_id,
        content: articleForm.content,
        image_url: articleForm.image_url || undefined
      })
      
      setMessage({ type: 'success', text: 'Artikel erfolgreich erstellt!' })
      setArticleForm({ title: '', category_id: '', content: '', image_url: '' })
      
      // Redirect to the new article after a delay
      setTimeout(() => {
        router.push(`/artikel/${slug}`)
      }, 2000)
      
    } catch (error) {
      console.error('Error creating article:', error)
      setMessage({ type: 'error', text: 'Fehler beim Erstellen des Artikels.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoryForm.name) {
      setMessage({ type: 'error', text: 'Bitte geben Sie einen Kategorie-Namen ein.' })
      return
    }

    setLoading(true)
    
    try {
      const slug = slugify(categoryForm.name)
      
      const newCategory = await createCategory({
        name: categoryForm.name,
        slug
      })
      
      setMessage({ type: 'success', text: 'Kategorie erfolgreich erstellt! Sie können jetzt Artikel erstellen.' })
      setCategoryForm({ name: '' })
      
      // Refresh categories list
      await fetchCategories()
      
      // Wechsle automatisch zum Artikel-Tab und setze neue Kategorie als ausgewählt
      setTimeout(() => {
        setActiveTab('article')
        setArticleForm(prev => ({ ...prev, category_id: newCategory.id }))
      }, 1000)
      
    } catch (error) {
      console.error('Error creating category:', error)
      setMessage({ type: 'error', text: 'Fehler beim Erstellen der Kategorie.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    // <ProtectedRoute requireAdmin={true}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            Sicherer Admin-Bereich
          </h1>
          <p className="text-gray-600">Verwalten Sie Artikel und Kategorien</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('article')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'article'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Artikel erstellen
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Artikel verwalten
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'category'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FolderPlus className="w-4 h-4 inline mr-2" />
            Kategorie erstellen
          </button>
        </nav>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Article Form */}
      {activeTab === 'article' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Neuen Artikel erstellen</h2>
          
          <form onSubmit={handleArticleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                id="title"
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Geben Sie den Artikel-Titel ein..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                id="category"
                value={articleForm.category_id}
                onChange={(e) => setArticleForm({ ...articleForm, category_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  categories.length === 0 
                    ? 'border-red-300 bg-red-50 text-red-700' 
                    : 'border-gray-300'
                }`}
                required
                disabled={categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">Keine Kategorien verfügbar - Erstellen Sie zuerst eine Kategorie</option>
                ) : (
                  <>
                    <option value="">Kategorie auswählen...</option>
                    {categories.map((category) => {
                      const iconConfig = getCategoryIcon(category.slug)
                      const IconComponent = iconConfig.icon
                      
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                    })}
                  </>
                )}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {categories.length === 0 ? (
                  <span className="text-red-600 font-medium">
                    ⚠️ Keine Kategorien gefunden! Gehen Sie zum "Kategorie erstellen" Tab.
                  </span>
                ) : (
                  `${categories.length} Kategorien verfügbar`
                )}
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Artikel-Bild (optional)
              </label>
              <ImageUpload
                value={articleForm.image_url}
                onChange={(url) => setArticleForm({ ...articleForm, image_url: url })}
                onRemove={() => setArticleForm({ ...articleForm, image_url: '' })}
                disabled={loading}
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Artikel-Inhalt *
              </label>
              <ClientOnlyRichTextEditor
                content={articleForm.content}
                onChange={(content) => setArticleForm({ ...articleForm, content })}
                placeholder="Beginnen Sie mit dem Schreiben Ihres Artikels..."
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Verwenden Sie die Toolbar-Optionen für Formatierung, Bilder und Links.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || categories.length === 0}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Artikel erstellen
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Article Management */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <List className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Artikel verwalten</h2>
            <p className="text-gray-600 mb-6">
              Verwalten Sie alle Ihre veröffentlichten Artikel an einem Ort.
              Bearbeiten, löschen oder zeigen Sie eine Vorschau Ihrer Artikel an.
            </p>
            <button
              onClick={() => router.push('/admin/artikel-verwalten')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <List className="w-4 h-4 mr-2" />
              Zur Artikel-Verwaltung
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schnellübersicht</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">-</div>
                <div className="text-sm text-gray-600">Artikel gesamt</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <FolderPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-gray-600">Kategorien</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">Admin</div>
                <div className="text-sm text-gray-600">Ihr Status</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Form */}
      {activeTab === 'category' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Neue Kategorie erstellen</h2>
            <p className="text-sm text-gray-600 mt-1">
              Standard-Kategorien werden automatisch erstellt. Hier können Sie zusätzliche Kategorien hinzufügen.
            </p>
          </div>
          
          <form onSubmit={handleCategorySubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie-Name *
              </label>
              <input
                type="text"
                id="category_name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Technologie, Wissenschaft, Gesundheit..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Plus className="w-4 h-4 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Kategorie erstellen
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Existing Categories */}
          {categories.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vorhandene Kategorien</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => {
                  const iconConfig = getCategoryIcon(category.slug)
                  const IconComponent = iconConfig.icon
                  
                  return (
                    <div key={category.id} className={`flex items-center px-3 py-2 ${iconConfig.bgColor} rounded-md text-sm`}>
                      <IconComponent className={`w-4 h-4 mr-2 ${iconConfig.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    // </ProtectedRoute>
  )
}