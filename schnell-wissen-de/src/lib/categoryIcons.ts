import { 
  Smartphone, 
  Gamepad2, 
  Leaf, 
  Home, 
  Heart, 
  Brain, 
  Briefcase, 
  DollarSign, 
  Rocket, 
  Star,
  Folder,
  LucideIcon
} from 'lucide-react'

export interface CategoryIconConfig {
  icon: LucideIcon
  color: string
  bgColor: string
  hoverColor: string
}

export const categoryIconMap: Record<string, CategoryIconConfig> = {
  'technik-gadgets': {
    icon: Smartphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    hoverColor: 'hover:bg-blue-200'
  },
  'gaming-unterhaltung': {
    icon: Gamepad2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    hoverColor: 'hover:bg-purple-200'
  },
  'energie-umwelt': {
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    hoverColor: 'hover:bg-green-200'
  },
  'alltag-haushalt': {
    icon: Home,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    hoverColor: 'hover:bg-orange-200'
  },
  'gesundheit-wohlbefinden': {
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    hoverColor: 'hover:bg-red-200'
  },
  'wissen-kurioses': {
    icon: Brain,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    hoverColor: 'hover:bg-yellow-200'
  },
  'beruf-karriere': {
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    hoverColor: 'hover:bg-indigo-200'
  },
  'geld-finanzen': {
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    hoverColor: 'hover:bg-emerald-200'
  },
  'zukunft-innovation': {
    icon: Rocket,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    hoverColor: 'hover:bg-violet-200'
  },
  'produktvergleiche-empfehlungen': {
    icon: Star,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    hoverColor: 'hover:bg-amber-200'
  }
}

// Fallback für unbekannte Kategorien
const defaultIconConfig: CategoryIconConfig = {
  icon: Folder,
  color: 'text-gray-600',
  bgColor: 'bg-gray-100',
  hoverColor: 'hover:bg-gray-200'
}

export function getCategoryIcon(slug: string): CategoryIconConfig {
  return categoryIconMap[slug] || defaultIconConfig
}