'use client'

import { useState } from 'react'
import { Bold, Italic, List, Upload } from 'lucide-react'

interface SimpleTextEditorProps {
  content: string
  onChange: (content: string) => void
  disabled?: boolean
}

export default function SimpleTextEditor({
  content,
  onChange,
  disabled = false
}: SimpleTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('simple-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end)
    
    onChange(newContent)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const { getAuthToken } = await import('@/lib/auth-utils')
      const token = await getAuthToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      const imageHtml = `<img src="${data.url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`
      onChange(content + '\n' + imageHtml)
      
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('Fehler beim Hochladen des Bildes: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const addImage = () => {
    if (!imageUrl.trim()) return
    const imageHtml = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto;" />`
    onChange(content + '\n' + imageHtml)
    setShowImageDialog(false)
    setImageUrl('')
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => insertText('<strong>', '</strong>')}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            disabled={disabled}
            title="Fett"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => insertText('<em>', '</em>')}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            disabled={disabled}
            title="Kursiv"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertText('<h1>', '</h1>')}
            className="px-3 py-2 text-sm font-semibold rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            disabled={disabled}
            title="Überschrift 1"
          >
            H1
          </button>

          <button
            type="button"
            onClick={() => insertText('<h2>', '</h2>')}
            className="px-3 py-2 text-sm font-semibold rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            disabled={disabled}
            title="Überschrift 2"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => insertText('<ul>\n<li>', '</li>\n</ul>')}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            disabled={disabled}
            title="Liste"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            disabled={disabled}
            title="Bild einfügen"
          >
            📷
          </button>

          <label className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      {/* Editor */}
      <textarea
        id="simple-editor"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-64 p-4 resize-none focus:outline-none"
        placeholder="Beginnen Sie mit dem Schreiben Ihres Artikels. Sie können HTML-Tags verwenden für Formatierung."
        disabled={disabled}
      />

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Bild einfügen</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Einfügen
              </button>
              <button
                onClick={() => {
                  setShowImageDialog(false)
                  setImageUrl('')
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}