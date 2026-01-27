import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Heart, Trash, TrashSimple } from '@phosphor-icons/react'
import { GratitudeEntry } from '@/lib/types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function GratitudeView() {
  const [gratitudeEntries, setGratitudeEntries] = useKV<GratitudeEntry[]>('gratitude', [])
  const [newEntry, setNewEntry] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showClearAll, setShowClearAll] = useState(false)

  const handleAddEntry = () => {
    if (!newEntry.trim()) {
      toast.error('Please write something you\'re grateful for')
      return
    }

    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: newEntry.trim(),
      date: Date.now()
    }

    setGratitudeEntries((prev) => [entry, ...(prev || [])])
    setNewEntry('')
    toast.success('Gratitude recorded')
  }

  const handleDeleteEntry = (id: string) => {
    setGratitudeEntries((prev) => (prev || []).filter(entry => entry.id !== id))
    setDeleteId(null)
    toast.success('Entry deleted')
  }

  const handleClearAll = () => {
    setGratitudeEntries([])
    setShowClearAll(false)
    toast.success('All entries cleared')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddEntry()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
          Gratitude Journal
        </h2>
        <p className="text-sm text-muted-foreground">
          Cultivate appreciation for the blessings in your life
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            What are you grateful for today?
          </label>
          <Textarea
            id="gratitude-input"
            placeholder="I'm grateful for..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[100px] resize-none font-serif"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to save
            </p>
            <Button onClick={handleAddEntry} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Entry
            </Button>
          </div>
        </div>
      </Card>

      {gratitudeEntries && gratitudeEntries.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              Past Entries
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearAll(true)}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <TrashSimple className="w-4 h-4" />
              Clear All
            </Button>
          </div>
          <ScrollArea className="h-[400px] rounded-lg border p-4">
            <div className="space-y-4">
              {gratitudeEntries.map((entry) => (
                <Card key={entry.id} className="p-4 hover:bg-muted/50 transition-colors group">
                  <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-1" weight="fill" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm md:text-base text-foreground font-serif leading-relaxed">
                        {entry.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Start your gratitude practice by adding your first entry above.
          </p>
        </Card>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this gratitude entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteEntry(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearAll} onOpenChange={setShowClearAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Entries</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all gratitude entries? This will permanently remove all {gratitudeEntries?.length || 0} entries and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
