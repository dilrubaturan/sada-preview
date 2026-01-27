import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Smiley, SmileyMeh, Plus, X, BookOpen, FilmSlate, Article, Microphone, Video, Notebook } from '@phosphor-icons/react'
import { DayNote, MediaCapture } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function DayNotesView() {
  const [dayNotes, setDayNotes] = useKV<DayNote[]>('dayNotes', [])
  const [todayNote, setTodayNote] = useState<DayNote | null>(null)
  const [newLiked, setNewLiked] = useState('')
  const [newUpset, setNewUpset] = useState('')
  const [dailyReflection, setDailyReflection] = useState('')
  const [showCaptureDialog, setShowCaptureDialog] = useState(false)
  const [captureType, setCaptureType] = useState<MediaCapture['type']>('movie')
  const [captureTitle, setCaptureTitle] = useState('')
  const [captureNotes, setCaptureNotes] = useState('')

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    if (dayNotes) {
      const existingNote = dayNotes.find(note => note.date === today)
      if (existingNote) {
        setTodayNote(existingNote)
        setDailyReflection(existingNote.dailyReflection || '')
      } else {
        setTodayNote({
          id: Date.now().toString(),
          date: today,
          liked: [],
          upset: [],
          dailyReflection: '',
          captures: []
        })
        setDailyReflection('')
      }
    }
  }, [today])

  const updateDailyReflection = () => {
    if (!todayNote) return
    
    const updated = {
      ...todayNote,
      dailyReflection: dailyReflection.trim()
    }

    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      } else {
        return [...notes, updated]
      }
    })
    toast.success('Daily reflection saved')
  }

  const addCapture = () => {
    if (!captureTitle.trim() || !todayNote) {
      toast.error('Please enter a title')
      return
    }

    const newCapture: MediaCapture = {
      id: Date.now().toString(),
      type: captureType,
      title: captureTitle.trim(),
      notes: captureNotes.trim() || undefined,
      timestamp: Date.now()
    }

    const updated = {
      ...todayNote,
      captures: [...todayNote.captures, newCapture]
    }

    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      } else {
        return [...notes, updated]
      }
    })
    
    setCaptureTitle('')
    setCaptureNotes('')
    setShowCaptureDialog(false)
    toast.success('Inspiration source saved')
  }

  const removeCapture = (captureId: string) => {
    if (!todayNote) return
    const updated = {
      ...todayNote,
      captures: todayNote.captures.filter(c => c.id !== captureId)
    }
    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      }
      return notes
    })
  }

  const addLiked = () => {
    if (!newLiked.trim() || !todayNote) return

    const updated = {
      ...todayNote,
      liked: [...todayNote.liked, newLiked.trim()]
    }

    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      } else {
        return [...notes, updated]
      }
    })
    setNewLiked('')
    toast.success('Added to what you liked')
  }

  const addUpset = () => {
    if (!newUpset.trim() || !todayNote) return

    const updated = {
      ...todayNote,
      upset: [...todayNote.upset, newUpset.trim()]
    }

    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      } else {
        return [...notes, updated]
      }
    })
    setNewUpset('')
    toast.success('Noted what upset you - let it go')
  }

  const removeLiked = (index: number) => {
    if (!todayNote) return
    const updated = {
      ...todayNote,
      liked: todayNote.liked.filter((_, i) => i !== index)
    }
    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      }
      return notes
    })
  }

  const removeUpset = (index: number) => {
    if (!todayNote) return
    const updated = {
      ...todayNote,
      upset: todayNote.upset.filter((_, i) => i !== index)
    }
    setTodayNote(updated)
    setDayNotes((prev) => {
      const notes = prev || []
      const existingIndex = notes.findIndex(note => note.date === today)
      if (existingIndex >= 0) {
        const updatedNotes = [...notes]
        updatedNotes[existingIndex] = updated
        return updatedNotes
      }
      return notes
    })
  }

  const getMediaIcon = (type: MediaCapture['type']) => {
    switch (type) {
      case 'movie': return <FilmSlate className="w-5 h-5" weight="fill" />
      case 'book': return <BookOpen className="w-5 h-5" weight="fill" />
      case 'article': return <Article className="w-5 h-5" weight="fill" />
      case 'video': return <Video className="w-5 h-5" weight="fill" />
      case 'podcast': return <Microphone className="w-5 h-5" weight="fill" />
      case 'other': return <Notebook className="w-5 h-5" weight="fill" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
          Today's Notes
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <Card className="p-6 space-y-4 bg-primary/5 border-primary/30">
        <div className="flex items-center gap-2 mb-2">
          <Notebook className="w-6 h-6 text-primary" weight="fill" />
          <h3 className="text-lg font-medium text-foreground">Daily Reflection</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Reflect on your day, your goals, and what matters to you
        </p>
        <Textarea
          id="daily-reflection"
          placeholder="How did today go? What am I working toward? What resonates with me today?"
          value={dailyReflection}
          onChange={(e) => setDailyReflection(e.target.value)}
          className="min-h-[120px] resize-none font-serif"
        />
        <div className="flex justify-end">
          <Button onClick={updateDailyReflection} className="gap-2">
            Save Reflection
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-accent/10 border-accent/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-foreground" weight="fill" />
            <h3 className="text-lg font-medium text-foreground">Inspiration Sources</h3>
          </div>
          <Dialog open={showCaptureDialog} onOpenChange={setShowCaptureDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record an Inspiration Source</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={captureType} onValueChange={(v) => setCaptureType(v as MediaCapture['type'])}>
                    <SelectTrigger id="capture-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    id="capture-title"
                    placeholder="Enter title..."
                    value={captureTitle}
                    onChange={(e) => setCaptureTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Textarea
                    id="capture-notes"
                    placeholder="What stood out? Any thoughts or quotes?"
                    value={captureNotes}
                    onChange={(e) => setCaptureNotes(e.target.value)}
                    className="min-h-[100px] resize-none font-serif"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCaptureDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addCapture}>
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep track of movies, books, articles, and other content that inspired or moved you today
        </p>
        
        <ScrollArea className="h-[250px]">
          <div className="space-y-3">
            {todayNote?.captures.map((capture) => (
              <div 
                key={capture.id} 
                className="flex items-start gap-3 p-4 bg-card rounded-lg group hover:bg-muted/50 transition-colors"
              >
                <div className="text-accent-foreground mt-0.5">
                  {getMediaIcon(capture.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{capture.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => removeCapture(capture.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{capture.type}</p>
                  {capture.notes && (
                    <p className="text-sm text-foreground/80 font-serif pt-1">{capture.notes}</p>
                  )}
                </div>
              </div>
            ))}
            {(!todayNote?.captures.length) && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Start recording content that resonates with your values
              </p>
            )}
          </div>
        </ScrollArea>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 border-success/30 bg-success/5">
          <div className="flex items-center gap-2 mb-2">
            <Smiley className="w-6 h-6 text-success" weight="fill" />
            <h3 className="text-lg font-medium text-foreground">What I Liked</h3>
          </div>

          <div className="flex gap-2">
            <Input
              id="liked-input"
              placeholder="Add something positive..."
              value={newLiked}
              onChange={(e) => setNewLiked(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLiked()}
              className="flex-1"
            />
            <Button onClick={addLiked} size="icon" className="bg-success hover:bg-success/90">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[250px]">
            <div className="space-y-2">
              {todayNote?.liked.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-2 p-3 bg-card rounded-lg group"
                >
                  <span className="flex-1 text-sm text-foreground font-serif">
                    {item}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeLiked(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {(!todayNote?.liked.length) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start noting what brings you joy
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-6 space-y-4 border-muted bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <SmileyMeh className="w-6 h-6 text-muted-foreground" weight="fill" />
            <h3 className="text-lg font-medium text-foreground">What Upset Me</h3>
          </div>

          <div className="flex gap-2">
            <Input
              id="upset-input"
              placeholder="Release what bothered you..."
              value={newUpset}
              onChange={(e) => setNewUpset(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addUpset()}
              className="flex-1"
            />
            <Button onClick={addUpset} size="icon" variant="secondary">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[250px]">
            <div className="space-y-2">
              {todayNote?.upset.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-2 p-3 bg-card rounded-lg group"
                >
                  <span className="flex-1 text-sm text-foreground font-serif">
                    {item}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeUpset(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {(!todayNote?.upset.length) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Let go of what troubles you
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground text-center font-serif">
          Remember: noting your upsets helps you release them, freeing your mind and heart for peace.
        </p>
      </Card>
    </div>
  )
}
