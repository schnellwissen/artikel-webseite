'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestCategoriesPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [directSupabaseTest, setDirectSupabaseTest] = useState<any>(null)

  // Test der eigenen API
  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-storage')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'API Test failed', details: (error as Error).message })
    }
    setLoading(false)
  }

  // Direkter Supabase Test
  const testDirectSupabase = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      console.log('Testing direct Supabase connection...')
      
      const { data, error, count } = await supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .order('name')

      setDirectSupabaseTest({
        success: !error,
        data: data,
        count: count,
        error: error,
        timestamp: new Date().toISOString()
      })
      
      console.log('Direct Supabase result:', { data, error, count })
      
    } catch (error) {
      setDirectSupabaseTest({
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      })
    }
  }

  useEffect(() => {
    testDirectSupabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Kategorie-Diagnose</h1>
        
        {/* Direkter Supabase Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Direkter Supabase Test</h2>
            <button
              onClick={testDirectSupabase}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Neu testen
            </button>
          </div>
          
          {directSupabaseTest && (
            <div className={`p-4 rounded-lg ${
              directSupabaseTest.success ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(directSupabaseTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* API Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">API Test</h2>
            <button
              onClick={testAPI}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Teste...' : 'API testen'}
            </button>
          </div>
          
          {result && (
            <div className={`p-4 rounded-lg ${
              result.error ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Diagnose Ergebnis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🩺 Diagnose</h3>
          
          {directSupabaseTest && (
            <div className="space-y-2">
              <p><strong>Supabase Verbindung:</strong> {directSupabaseTest.success ? '✅ OK' : '❌ Fehler'}</p>
              <p><strong>Anzahl Kategorien:</strong> {directSupabaseTest.count || 0}</p>
              
              {directSupabaseTest.success && directSupabaseTest.count === 0 && (
                <div className="bg-yellow-100 p-4 rounded-lg mt-4">
                  <p className="text-yellow-800">
                    <strong>Problem identifiziert:</strong> Verbindung OK, aber keine Kategorien in der Datenbank.
                  </p>
                  <p className="text-yellow-800 mt-2">
                    <strong>Lösung:</strong> Führen Sie DIREKTE_LÖSUNG.sql in der Supabase SQL-Konsole aus.
                  </p>
                </div>
              )}
              
              {directSupabaseTest.success && directSupabaseTest.count && directSupabaseTest.count > 0 && (
                <div className="bg-yellow-100 p-4 rounded-lg mt-4">
                  <p className="text-yellow-800">
                    <strong>Problem identifiziert:</strong> Kategorien existieren ({directSupabaseTest.count}), aber RLS blockiert den Zugriff.
                  </p>
                  <p className="text-yellow-800 mt-2">
                    <strong>Lösung:</strong> Führen Sie die RLS-Policy Befehle aus DIREKTE_LÖSUNG.sql aus.
                  </p>
                </div>
              )}
              
              {!directSupabaseTest.success && (
                <div className="bg-red-100 p-4 rounded-lg mt-4">
                  <p className="text-red-800">
                    <strong>Problem:</strong> Supabase Verbindungsfehler
                  </p>
                  <p className="text-red-800 mt-2">
                    <strong>Fehler:</strong> {directSupabaseTest.error}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900">Nächste Schritte:</h4>
            <ol className="list-decimal list-inside text-blue-800 mt-2 space-y-1">
              <li>Führen Sie DIREKTE_LÖSUNG.sql in Supabase aus</li>
              <li>Aktualisieren Sie diese Seite</li>
              <li>Testen Sie die Admin-Seite erneut</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}