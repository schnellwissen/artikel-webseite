'use client'

import { useEffect, useState } from 'react'
import SimpleTextEditor from './SimpleTextEditor'

interface ClientOnlyRichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function ClientOnlyRichTextEditor(props: ClientOnlyRichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [RichTextEditor, setRichTextEditor] = useState<React.ComponentType<ClientOnlyRichTextEditorProps> | null>(null)
  const [useSimpleEditor, setUseSimpleEditor] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Try to dynamically import TipTap Editor
    const loadRichTextEditor = async () => {
      try {
        const { default: Editor } = await import('./RichTextEditor')
        setRichTextEditor(() => Editor)
      } catch (error) {
        console.warn('Failed to load RichTextEditor, using SimpleTextEditor:', error)
        setUseSimpleEditor(true)
      }
    }

    loadRichTextEditor()
  }, [])

  // Show loading state
  if (!mounted) {
    return (
      <div className="h-64 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-gray-500">Editor wird geladen...</span>
      </div>
    )
  }

  // Use simple editor if TipTap failed to load
  if (useSimpleEditor || !RichTextEditor) {
    return (
      <div>
        {useSimpleEditor && (
          <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ⚠️ Rich-Text-Editor nicht verfügbar. HTML-Editor wird verwendet.
          </div>
        )}
        <SimpleTextEditor {...props} />
      </div>
    )
  }

  // Render TipTap editor
  try {
    return <RichTextEditor {...props} />
  } catch (error) {
    console.warn('RichTextEditor crashed, falling back to SimpleTextEditor:', error)
    return (
      <div>
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ Rich-Text-Editor fehler. HTML-Editor wird verwendet.
        </div>
        <SimpleTextEditor {...props} />
      </div>
    )
  }
}