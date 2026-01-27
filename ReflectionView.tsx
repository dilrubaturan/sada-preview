import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, ArrowClockwise, Timer, PencilSimple, Sparkle } from '@phosphor-icons/react'
import { LibraryItem, UserPreferences, Category, DayNote } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ReflectionViewProps {
  library: LibraryItem[]
  setLibrary: (fn: (prev: LibraryItem[]) => LibraryItem[]) => void
  preferences: UserPreferences
  setPreferences: (fn: (prev: UserPreferences) => UserPreferences) => void
  onSilentMoment: () => void
}

const categoryLabels: Record<Category, string> = {
  all: 'All Categories',
  philosophical: 'Philosophical',
  spiritual: 'Spiritual',
  historical: 'Historical',
  movies: 'Movies',
  songs: 'Songs',
  personal: 'Personal Notes',
  quran: 'Quranic Verses',
  poetry: 'Poetry'
}

export function ReflectionView({ 
  library, 
  setLibrary, 
  preferences,
  setPreferences,
  onSilentMoment 
}: ReflectionViewProps) {
  const [currentReflection, setCurrentReflection] = useState<LibraryItem | null>(null)
  const [filterCategory, setFilterCategory] = useState<Category>('all')
  const [dayNotes, setDayNotes] = useKV<DayNote[]>('day-notes', [])
  const [reflectionText, setReflectionText] = useState('')

  const getTodayDateString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTodayNote = () => {
    const todayDate = getTodayDateString()
    return dayNotes?.find(note => note.date === todayDate)
  }

  useEffect(() => {
    const todayNote = getTodayNote()
    if (todayNote?.dailyReflection) {
      setReflectionText(todayNote.dailyReflection)
    } else {
      setReflectionText('')
    }
  }, [dayNotes])

  const getRandomReflection = (category: Category = filterCategory) => {
    let filtered = library
    
    if (category !== 'all') {
      filtered = library.filter(item => item.category === category)
    }
    
    if (filtered.length === 0) {
      return null
    }
    
    const randomIndex = Math.floor(Math.random() * filtered.length)
    return filtered[randomIndex]
  }

  useEffect(() => {
    setCurrentReflection(getRandomReflection())
  }, [])

  const handleRefresh = () => {
    const newReflection = getRandomReflection()
    setCurrentReflection(newReflection)
  }

  const toggleFavorite = () => {
    if (!currentReflection) return
    
    setLibrary((prev) => 
      prev.map(item => 
        item.id === currentReflection.id 
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    )
    
    setCurrentReflection(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null)
    toast.success(currentReflection.isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleCategoryChange = (value: Category) => {
    setFilterCategory(value)
    const newReflection = getRandomReflection(value)
    setCurrentReflection(newReflection)
  }

  const saveReflection = () => {
    const todayDate = getTodayDateString()
    
    setDayNotes((currentNotes) => {
      const notes = currentNotes || []
      const existingNoteIndex = notes.findIndex(note => note.date === todayDate)
      
      if (existingNoteIndex >= 0) {
        const updated = [...notes]
        updated[existingNoteIndex] = {
          ...updated[existingNoteIndex],
          dailyReflection: reflectionText
        }
        return updated
      } else {
        return [
          ...notes,
          {
            id: Date.now().toString(),
            date: todayDate,
            liked: [],
            upset: [],
            dailyReflection: reflectionText,
            captures: []
          }
        ]
      }
    })
    
    toast.success('Reflection saved')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
            Daily Reflection
          </h2>
          <p className="text-sm text-muted-foreground">
            A moment of wisdom for your day
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSilentMoment}
            className="gap-2"
          >
            <Timer className="w-4 h-4" />
            Silent Moment
          </Button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={filterCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentReflection ? (
        <motion.div
          key={currentReflection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card to-muted/20 border-2">
            <div className="text-4xl text-primary/30 font-serif">"</div>
            
            <p className="reflection-text text-lg md:text-xl text-foreground font-serif leading-relaxed">
              {currentReflection.text}
            </p>
            
            {currentReflection.source && (
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                — {currentReflection.source}
              </p>
            )}
            
            <div className="flex items-center justify-center gap-3 pt-4">
              <Badge variant="secondary" className="text-xs">
                {categoryLabels[currentReflection.category]}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className={currentReflection.isFavorite ? 'text-accent hover:text-accent' : ''}
              >
                <Heart 
                  className="w-5 h-5" 
                  weight={currentReflection.isFavorite ? 'fill' : 'regular'}
                />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <ArrowClockwise className="w-4 h-4" />
                New Reflection
              </Button>
            </div>
          </Card>

          <Card className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <PencilSimple className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">
                Your Reflection
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              Take a moment to reflect on today's quote. What does it mean to you? How does it resonate with your life?
            </p>

            <Textarea
              id="daily-reflection"
              placeholder="Write your thoughts here..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="min-h-[200px] resize-none font-serif text-base leading-relaxed"
            />

            <div className="flex justify-end">
              <Button 
                onClick={saveReflection}
                disabled={!reflectionText.trim()}
                className="gap-2"
              >
                <PencilSimple className="w-4 h-4" />
                Save Reflection
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card className="p-8 md:p-12 text-center space-y-4">
          <Sparkle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              Welcome to Your Reflection Space
            </p>
            <p className="text-muted-foreground">
              Start building your values library by adding quotes, poems, verses, or personal notes that inspire you.
            </p>
          </div>
          <Button 
            onClick={() => {
              const libraryTab = document.querySelector('[value="library"]') as HTMLElement
              libraryTab?.click()
            }}
            className="mt-4"
          >
            Go to Library
          </Button>
        </Card>
      )}
    </div>
  )
}
