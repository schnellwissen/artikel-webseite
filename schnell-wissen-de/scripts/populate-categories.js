// Simple category population script
// Run with: node scripts/populate-categories.js

// You need to manually set these values from your .env.local file
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY_HERE'

// If you have the @supabase/supabase-js package installed:
// const { createClient } = require('@supabase/supabase-js')

// Alternative: Simple fetch approach
async function makeSupabaseRequest(table, method = 'GET', data = null) {
  const url = `${supabaseUrl}/rest/v1/${table}`
  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
  
  const options = {
    method,
    headers
  }
  
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data)
  }
  
  const response = await fetch(url, options)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`)
  }
  
  return response.json()
}

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
  console.error('❌ Fehler: Bitte setzen Sie SUPABASE_URL und SUPABASE_ANON_KEY in diesem Script.')
  console.log('📝 Kopieren Sie die Werte aus Ihrer .env.local Datei und ersetzen Sie:')
  console.log('   supabaseUrl = "YOUR_SUPABASE_URL_HERE"')
  console.log('   supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY_HERE"')
  process.exit(1)
}

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

async function populateCategories() {
  console.log('🚀 Starte Kategorie-Population...')
  
  try {
    // Prüfe existierende Kategorien
    console.log('📊 Lade existierende Kategorien...')
    const existingCategories = await makeSupabaseRequest('categories')
    
    console.log(`📊 Gefundene Kategorien: ${existingCategories?.length || 0}`)
    
    if (existingCategories && existingCategories.length >= 10) {
      console.log('✅ Bereits ausreichend Kategorien vorhanden!')
      console.log('Vorhandene Kategorien:')
      existingCategories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`)
      })
      return
    }
    
    // Füge fehlende Kategorien hinzu
    let createdCount = 0
    
    for (const category of defaultCategories) {
      const exists = existingCategories?.find(c => c.slug === category.slug)
      
      if (!exists) {
        try {
          console.log(`📝 Erstelle Kategorie: ${category.name}`)
          const result = await makeSupabaseRequest('categories', 'POST', category)
          
          if (result && result.length > 0) {
            console.log(`✅ Kategorie erstellt: ${category.name}`)
            createdCount++
          } else {
            console.warn(`⚠️  Unerwartete Antwort für "${category.name}":`, result)
          }
        } catch (err) {
          console.warn(`⚠️  Fehler beim Erstellen von "${category.name}":`, err.message)
        }
      } else {
        console.log(`🔄 Kategorie bereits vorhanden: ${category.name}`)
      }
    }
    
    console.log(`\n🎉 Fertig! ${createdCount} neue Kategorien erstellt.`)
    
    // Abschließende Prüfung
    console.log('📊 Lade finale Kategorien-Liste...')
    const finalCategories = await makeSupabaseRequest('categories?order=name')
    
    console.log(`\n📋 Insgesamt ${finalCategories?.length || 0} Kategorien verfügbar:`)
    finalCategories?.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`)
    })
    
  } catch (error) {
    console.error('💥 Unerwarteter Fehler:', error)
  }
}

populateCategories()