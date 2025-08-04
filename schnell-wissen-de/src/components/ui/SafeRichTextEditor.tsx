'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import SimpleTextEditor from './SimpleTextEditor'

// Dynamically import RichTextEditor with error handling
const RichTextEditor = dynamic(
  () => import('./RichTextEditor'),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-gray-500">Rich-Text-Editor wird geladen...</span>
      </div>
    ),
    ssr: false
  }
)

interface SafeRichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function SafeRichTextEditor(props: SafeRichTextEditorProps) {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setMounted(true)
  }, [])

  // Error boundary for RichTextEditor
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message.includes('tiptap') || error.message.includes('prosemirror')) {
        console.warn('RichTextEditor failed, falling back to SimpleTextEditor:', error)
        setHasError(true)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // If not client-side yet or not mounted, show loading
  if (!isClient || !mounted) {
    return (
      <div className="h-64 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-gray-500">Editor wird geladen...</span>
      </div>
    )
  }

  // If there's an error or TipTap failed, use SimpleTextEditor
  if (hasError) {
    return (
      <div>
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ Rich-Text-Editor nicht verfügbar. HTML-Editor wird verwendet.
        </div>
        <SimpleTextEditor {...props} />
      </div>
    )
  }

  // Try to use RichTextEditor with error catching
  try {
    return <RichTextEditor {...props} />
  } catch (error) {
    console.warn('RichTextEditor failed, using SimpleTextEditor:', error)
    setHasError(true)
    return (
      <div>
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ Rich-Text-Editor nicht verfügbar. HTML-Editor wird verwendet.
        </div>
        <SimpleTextEditor {...props} />
      </div>
    )
  }
}