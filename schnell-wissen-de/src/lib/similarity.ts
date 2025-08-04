import { ArticleWithCategory } from './types'

// Deutsche Stop-Wörter (häufige Wörter die wenig Bedeutung haben)
const GERMAN_STOP_WORDS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'einem', 'eines',
  'und', 'oder', 'aber', 'doch', 'sondern', 'jedoch', 'dennoch', 'trotzdem',
  'ist', 'sind', 'war', 'waren', 'hat', 'haben', 'hatte', 'hatten', 'wird', 'werden',
  'auf', 'in', 'zu', 'mit', 'von', 'für', 'an', 'bei', 'über', 'unter', 'durch',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sich', 'mich', 'dir', 'ihm', 'uns',
  'auch', 'noch', 'nur', 'schon', 'mehr', 'sehr', 'so', 'wie', 'als', 'wenn', 'dass',
  'kann', 'könnte', 'sollte', 'muss', 'musste', 'darf', 'durfte', 'soll', 'will',
  'alle', 'jeder', 'jede', 'jedes', 'viele', 'wenige', 'einige', 'andere', 'keine',
  'aus', 'nach', 'vor', 'seit', 'bis', 'während', 'gegen', 'ohne', 'um'
])

// Minimale Wortlänge für Relevanz
const MIN_WORD_LENGTH = 3

export interface SimilarityScore {
  article: ArticleWithCategory
  score: number
  commonKeywords: string[]
}

/**
 * Extrahiert relevante Keywords aus einem Text
 */
export function extractKeywords(text: string): string[] {
  if (!text) return []
  
  return text
    .toLowerCase()
    // Entferne Markdown-Syntax
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Entferne Satzzeichen und Zahlen
    .replace(/[^\wäöüß\s]/g, ' ')
    .replace(/\d+/g, '')
    // Teile in Wörter auf
    .split(/\s+/)
    // Filtere Stop-Wörter und kurze Wörter
    .filter(word => 
      word.length >= MIN_WORD_LENGTH && 
      !GERMAN_STOP_WORDS.has(word)
    )
    // Entferne Duplikate
    .filter((word, index, array) => array.indexOf(word) === index)
}

/**
 * Berechnet die Häufigkeit von Wörtern in einem Text
 */
function getWordFrequency(words: string[]): Map<string, number> {
  const frequency = new Map<string, number>()
  
  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1)
  }
  
  return frequency
}

/**
 * Berechnet die Ähnlichkeit zwischen zwei Artikeln
 */
export function calculateSimilarity(
  article1: ArticleWithCategory, 
  article2: ArticleWithCategory
): SimilarityScore {
  // Verschiedene Kategorien = 0 Ähnlichkeit
  if (article1.category?.id !== article2.category?.id) {
    return {
      article: article2,
      score: 0,
      commonKeywords: []
    }
  }
  
  // Keywords extrahieren mit Gewichtung
  const title1Keywords = extractKeywords(article1.title)
  const content1Keywords = extractKeywords(article1.content)
  const title2Keywords = extractKeywords(article2.title)
  const content2Keywords = extractKeywords(article2.content)
  
  // Alle Keywords mit Gewichtung zusammenfassen
  const article1Words: string[] = [
    ...title1Keywords,
    ...title1Keywords, // Titel-Keywords 2x zusätzlich (insgesamt 3x Gewichtung)
    ...title1Keywords,
    ...content1Keywords
  ]
  
  const article2Words: string[] = [
    ...title2Keywords,
    ...title2Keywords, // Titel-Keywords 2x zusätzlich (insgesamt 3x Gewichtung)
    ...title2Keywords,
    ...content2Keywords
  ]
  
  // Wort-Häufigkeiten berechnen
  const freq1 = getWordFrequency(article1Words)
  const freq2 = getWordFrequency(article2Words)
  
  // Gemeinsame Keywords finden
  const commonKeywords: string[] = []
  let similarityScore = 0
  const totalWords1 = article1Words.length
  const totalWords2 = article2Words.length
  
  // Jaccard-Ähnlichkeit berechnen
  for (const [word, count1] of freq1) {
    const count2 = freq2.get(word) || 0
    if (count2 > 0) {
      commonKeywords.push(word)
      // Normalisierte Ähnlichkeit für dieses Wort
      const wordSimilarity = Math.min(count1, count2) / Math.max(count1, count2)
      similarityScore += wordSimilarity
    }
  }
  
  // Normalisierung basierend auf Gesamtanzahl einzigartiger Keywords
  const uniqueWords1 = freq1.size
  const uniqueWords2 = freq2.size
  const maxUniqueWords = Math.max(uniqueWords1, uniqueWords2)
  
  if (maxUniqueWords === 0) {
    return {
      article: article2,
      score: 0,
      commonKeywords: []
    }
  }
  
  // Finale Ähnlichkeitsscore (0-1)
  const finalScore = Math.min(1, similarityScore / maxUniqueWords)
  
  return {
    article: article2,
    score: Math.round(finalScore * 100) / 100, // Runde auf 2 Dezimalstellen
    commonKeywords: commonKeywords.slice(0, 10) // Maximal 10 gemeinsame Keywords
  }
}

/**
 * Findet ähnliche Artikel zu einem gegebenen Artikel
 */
export function findSimilarArticles(
  currentArticle: ArticleWithCategory,
  allArticles: ArticleWithCategory[],
  limit: number = 5
): SimilarityScore[] {
  if (!currentArticle || !allArticles.length) return []
  
  // Filtere den aktuellen Artikel aus
  const otherArticles = allArticles.filter(article => article.id !== currentArticle.id)
  
  // Berechne Ähnlichkeiten
  const similarities = otherArticles
    .map(article => calculateSimilarity(currentArticle, article))
    .filter(similarity => similarity.score > 0) // Nur Artikel mit Ähnlichkeit > 0
    .sort((a, b) => b.score - a.score) // Sortiere nach Score (absteigend)
    .slice(0, limit) // Limitiere Ergebnisse
  
  return similarities
}

/**
 * Formatiert die Ähnlichkeitsscore für die Anzeige
 */
export function formatSimilarityScore(score: number): string {
  const percentage = Math.round(score * 100)
  if (percentage >= 80) return `${percentage}% ähnlich`
  if (percentage >= 60) return `${percentage}% ähnlich`
  if (percentage >= 40) return `${percentage}% ähnlich`
  return `${percentage}% ähnlich`
}

/**
 * Gibt die CSS-Klasse für die Ähnlichkeits-Anzeige zurück
 */
export function getSimilarityColorClass(score: number): string {
  const percentage = score * 100
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  if (percentage >= 40) return 'text-orange-600'
  return 'text-gray-600'
}