'use client'

import { useEffect, useState } from 'react'

interface RichTextContentProps {
  content: string
  className?: string
}

export default function RichTextContent({ content, className = '' }: RichTextContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sanitizeContent = async () => {
      if (typeof window !== 'undefined') {
        try {
          console.log('RichTextContent: Starting sanitization...', {
            contentLength: content.length,
            contentPreview: content.substring(0, 100) + '...'
          })

          const DOMPurify = (await import('dompurify')).default
          
          const clean = DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'del',
              'ul', 'ol', 'li',
              'a', 'img',
              'blockquote', 'code', 'pre',
              'div', 'span',
              'article', 'section', 'header', 'footer', 'main', 'aside', 'nav',
              'figure', 'figcaption',
              'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
              'small', 'b', 'i', 'time'
            ],
            ALLOWED_ATTR: [
              'href', 'target', 'rel',
              'src', 'alt', 'width', 'height', 'loading',
              'class', 'style', 'id',
              'title', 'aria-label', 'datetime',
              'colspan', 'rowspan'
            ],
            ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
            ALLOW_DATA_ATTR: false,
            FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
            ADD_ATTR: ['target', 'rel'],
            // Wichtig: Beibehalten der Struktur
            KEEP_CONTENT: true,
            RETURN_DOM: false,
            RETURN_DOM_FRAGMENT: false,
            SANITIZE_DOM: true
          })
          
          console.log('RichTextContent: Sanitization complete', {
            originalLength: content.length,
            cleanedLength: clean.length,
            cleanedPreview: clean.substring(0, 100) + '...'
          })
          
          setSanitizedContent(clean)
        } catch (error) {
          console.error('RichTextContent: Sanitization failed:', error)
          // Fallback: Use content as-is but escaped
          setSanitizedContent(content.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
        } finally {
          setIsLoading(false)
        }
      } else {
        // Server-side: return content as-is for hydration
        setSanitizedContent(content)
        setIsLoading(false)
      }
    }

    sanitizeContent()
  }, [content])

  // Show loading state while sanitizing
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
      </div>
    )
  }

  // Fallback if no content
  if (!sanitizedContent && !content) {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        Kein Inhalt verfügbar
      </div>
    )
  }

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        // Basis-Styling für HTML5-Semantik
        '--prose-headings': '1.2em',
        '--prose-body': '1rem',
        '--prose-spacing': '1.5rem'
      } as React.CSSProperties}
    />
  )
}