'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic functionality
        setStatus('Testing imports...')
        
        const { getCategories } = await import('@/lib/api')
        setStatus('API imported successfully')
        
        const categories = await getCategories()
        setStatus(`Categories loaded: ${categories.length} found`)
        
      } catch (error) {
        console.error('Debug error:', error)
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Debug</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p>Status: {status}</p>
      </div>
    </div>
  )
}