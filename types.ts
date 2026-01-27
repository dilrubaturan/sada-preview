export type Category = 
  | 'philosophical'
  | 'spiritual'
  | 'historical'
  | 'movies'
  | 'songs'
  | 'personal'
  | 'quran'
  | 'poetry'
  | 'all'

export interface LibraryItem {
  id: string
  text: string
  source?: string
  category: Category
  isFavorite: boolean
  dateAdded: number
}

export interface GratitudeEntry {
  id: string
  text: string
  date: number
}

export interface DayNote {
  id: string
  date: string
  liked: string[]
  upset: string[]
  dailyReflection?: string
  captures: MediaCapture[]
}

export interface MediaCapture {
  id: string
  type: 'movie' | 'book' | 'article' | 'video' | 'podcast' | 'other'
  title: string
  notes?: string
  timestamp: number
}

export interface UserPreferences {
  selectedCategories: Category[]
  reminderEnabled: boolean
  silentMomentDuration: number
}
