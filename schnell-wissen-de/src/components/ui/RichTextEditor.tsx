'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useCallback, useState, useEffect } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Code,
  Eye
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({
  content,
  onChange,
  disabled = false
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [htmlContent, setHtmlContent] = useState(content)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Entferne Link aus StarterKit da wir unsere eigene Link-Konfiguration verwenden
        link: false,
      }),
      Image.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto;',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlContent(html)
      onChange(html)
    },
    editable: !disabled,
    immediatelyRender: false,
  })

  const toggleHtmlMode = useCallback(() => {
    if (!editor) return
    
    if (isHtmlMode) {
      // Wechsel von HTML zu WYSIWYG: HTML-Content in Editor laden
      editor.commands.setContent(htmlContent)
      onChange(htmlContent)
    } else {
      // Wechsel von WYSIWYG zu HTML: Editor-Content in HTML-State speichern
      setHtmlContent(editor.getHTML())
    }
    
    setIsHtmlMode(!isHtmlMode)
  }, [editor, isHtmlMode, htmlContent, onChange])

  const handleHtmlChange = useCallback((value: string) => {
    setHtmlContent(value)
    onChange(value)
  }, [onChange])

  const insertHtmlSnippet = useCallback((snippet: string) => {
    const textarea = document.querySelector('textarea[data-html-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = htmlContent.substring(start, end)
    
    const newContent = 
      htmlContent.substring(0, start) + 
      snippet.replace('${selected}', selectedText) + 
      htmlContent.substring(end)
    
    setHtmlContent(newContent)
    onChange(newContent)

    // Cursor-Position wiederherstellen
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + snippet.indexOf('${selected}') + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [htmlContent, onChange])

  const insertImageUrl = useCallback(() => {
    const url = prompt('Bild-URL eingeben:')
    if (url) {
      insertHtmlSnippet(`<img src="${url}" alt="Bild" style="max-width: 100%; height: auto;" />`)
    }
  }, [insertHtmlSnippet])

  // Synchronisiere externe Änderungen am content-Prop
  useEffect(() => {
    if (content !== htmlContent) {
      setHtmlContent(content)
      if (editor && !isHtmlMode) {
        editor.commands.setContent(content)
      }
    }
  }, [content, htmlContent, editor, isHtmlMode])

  const addLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setShowLinkDialog(true)
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return

    // cancelled
    if (linkUrl === null) {
      return
    }

    // empty
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkDialog(false)
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setShowLinkDialog(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!imageUrl) return
    if (!editor) return

    editor.chain().focus().setImage({ src: imageUrl }).run()
    setShowImageDialog(false)
    setImageUrl('')
  }, [editor, imageUrl])

  const uploadImage = async (file: File) => {
    if (!editor) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Get authentication token
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
      editor.chain().focus().setImage({ src: data.url }).run()
      
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

  if (!editor) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  )

  const HeadingButton = ({ level }: { level: 1 | 2 | 3 }) => (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
        editor.isActive('heading', { level })
          ? 'bg-blue-100 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      H{level}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Fett"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Kursiv"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Durchgestrichen"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <HeadingButton level={1} />
            <HeadingButton level={2} />
            <HeadingButton level={3} />
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Aufzählung"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Nummerierte Liste"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Link and Image */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              title="Link einfügen"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setShowImageDialog(true)}
              title="Bild einfügen"
            >
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>
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

          {/* Undo/Redo */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Rückgängig"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Wiederherstellen"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* HTML Mode Toggle */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={toggleHtmlMode}
              isActive={isHtmlMode}
              title={isHtmlMode ? "Zur visuellen Ansicht wechseln" : "Zum HTML-Editor wechseln"}
            >
              {isHtmlMode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* HTML Mode Toolbar */}
      {isHtmlMode && (
        <div className="border-b border-gray-200 bg-blue-50 p-3">
          <div className="text-xs text-blue-800 mb-2 font-semibold">HTML-Schnellzugriff:</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={insertImageUrl}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              disabled={disabled}
              title="Bild per URL einfügen"
            >
              🖼️ Bild-URL
            </button>
            <button
              type="button"
              onClick={() => insertHtmlSnippet('<div>${selected}</div>')}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              disabled={disabled}
              title="Div-Container"
            >
              &lt;div&gt;
            </button>
            <button
              type="button"
              onClick={() => insertHtmlSnippet('<span>${selected}</span>')}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              disabled={disabled}
              title="Span-Element"
            >
              &lt;span&gt;
            </button>
            <button
              type="button"
              onClick={() => insertHtmlSnippet('<code>${selected}</code>')}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              disabled={disabled}
              title="Code-Element"
            >
              &lt;code&gt;
            </button>
            <button
              type="button"
              onClick={() => insertHtmlSnippet('<a href="" target="_blank">${selected}</a>')}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              disabled={disabled}
              title="Link"
            >
              &lt;a&gt;
            </button>
            <button
              type="button"
              onClick={() => insertHtmlSnippet('<blockquote>${selected}</blockquote>')}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              disabled={disabled}
              title="Zitat"
            >
              &lt;blockquote&gt;
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="min-h-64 p-4">
        {isHtmlMode ? (
          <textarea
            data-html-editor
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="w-full min-h-60 p-3 border border-gray-200 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Hier können Sie HTML direkt eingeben... Nutzen Sie die Schnellzugriff-Buttons oben für häufige Tags."
            disabled={disabled}
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none focus:outline-none"
          />
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Link einfügen</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={setLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Einfügen
              </button>
              <button
                onClick={() => {
                  setShowLinkDialog(false)
                  setLinkUrl('')
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

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