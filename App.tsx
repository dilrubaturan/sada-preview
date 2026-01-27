import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { Logo } from './components/Logo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReflectionView } from './components/ReflectionView'
import { GratitudeView } from './components/GratitudeView'
import { DayNotesView } from './components/DayNotesView'
import { LibraryView } from './components/LibraryView'
import { SilentMoment } from './components/SilentMoment'
import { Sparkle, BookOpen, Notepad, Heart } from '@phosphor-icons/react'
import { LibraryItem, UserPreferences } from './lib/types'
import { defaultReflections } from './lib/defaultReflections'

function App() {
  const [library, setLibrary] = useKV<LibraryItem[]>('library', defaultReflections)
  const [preferences, setPreferences] = useKV<UserPreferences>('preferences', {
    selectedCategories: ['all'],
    reminderEnabled: true,
    silentMomentDuration: 5
  })
  const [showSilentMoment, setShowSilentMoment] = useState(false)
  const [currentTab, setCurrentTab] = useState('reflection')

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SilentMoment 
        open={showSilentMoment} 
        onOpenChange={setShowSilentMoment}
        duration={preferences?.silentMomentDuration || 5}
      />
      
      <div className="container max-w-5xl mx-auto px-4 py-6 md:py-8">
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                Sada
              </h1>
              <p className="text-sm text-muted-foreground">Reflect & Remember</p>
            </div>
          </div>
        </header>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="reflection" className="gap-2">
              <Sparkle className="w-4 h-4" />
              <span className="hidden sm:inline">Reflect</span>
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Gratitude</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <Notepad className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reflection">
            <ReflectionView 
              library={library || []}
              setLibrary={setLibrary}
              preferences={preferences || { selectedCategories: ['all'], reminderEnabled: true, silentMomentDuration: 5 }}
              setPreferences={setPreferences}
              onSilentMoment={() => setShowSilentMoment(true)}
            />
          </TabsContent>

          <TabsContent value="gratitude">
            <GratitudeView />
          </TabsContent>

          <TabsContent value="notes">
            <DayNotesView />
          </TabsContent>

          <TabsContent value="library">
            <LibraryView 
              library={library || []}
              setLibrary={setLibrary}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
