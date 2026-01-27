import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Heart, Trash, Tag } from '@phosphor-icons/react'
import { LibraryItem, Category } from '@/lib/types'
import { toast } from 'sonner'

interface LibraryViewProps {
  library: LibraryItem[]
  setLibrary: (fn: (prev: LibraryItem[]) => LibraryItem[]) => void
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

const categories: Category[] = [
  'philosophical',
  'spiritual',
  'historical',
  'movies',
  'songs',
  'personal',
  'quran',
  'poetry'
]

export function LibraryView({ library, setLibrary }: LibraryViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<Category>('all')
  const [newText, setNewText] = useState('')
  const [newSource, setNewSource] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('philosophical')

  const filteredLibrary = filterCategory === 'all' 
    ? library 
    : library.filter(item => item.category === filterCategory)

  const favoriteItems = filteredLibrary.filter(item => item.isFavorite)
  const otherItems = filteredLibrary.filter(item => !item.isFavorite)

  const handleAdd = () => {
    if (!newText.trim()) {
      toast.error('Please enter the reflection text')
      return
    }

    const newItem: LibraryItem = {
      id: Date.now().toString(),
      text: newText.trim(),
      source: newSource.trim() || undefined,
      category: newCategory,
      isFavorite: false,
      dateAdded: Date.now()
    }

    setLibrary((prev) => [newItem, ...prev])
    setNewText('')
    setNewSource('')
    setNewCategory('philosophical')
    setIsAddOpen(false)
    toast.success('Added to library')
  }

  const toggleFavorite = (id: string) => {
    setLibrary((prev) => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setLibrary((prev) => prev.filter(item => item.id !== id))
    toast.success('Removed from library')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1">
            Values Library
          </h2>
          <p className="text-sm text-muted-foreground">
            Your personal collection of wisdom
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add to Library</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text</label>
                <Textarea
                  placeholder="Enter quote, verse, saying, or note..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="min-h-[120px] font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Source (optional)</label>
                <Input
                  placeholder="Author, book, person, etc."
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>
                  Add to Library
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 items-center">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as Category)}>
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

      <ScrollArea className="h-[600px]">
        <div className="space-y-6">
          {favoriteItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" weight="fill" />
                Favorites
              </h3>
              <div className="space-y-3">
                {favoriteItems.map((item) => (
                  <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors group">
                    <div className="space-y-3">
                      <p className="text-sm md:text-base text-foreground font-serif leading-relaxed">
                        {item.text}
                      </p>
                      {item.source && (
                        <p className="text-sm text-muted-foreground">
                          — {item.source}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[item.category]}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-accent"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Heart className="w-4 h-4" weight="fill" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {otherItems.length > 0 && (
            <div className="space-y-3">
              {favoriteItems.length > 0 && (
                <h3 className="text-sm font-medium text-muted-foreground">
                  All Items
                </h3>
              )}
              <div className="space-y-3">
                {otherItems.map((item) => (
                  <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors group">
                    <div className="space-y-3">
                      <p className="text-sm md:text-base text-foreground font-serif leading-relaxed">
                        {item.text}
                      </p>
                      {item.source && (
                        <p className="text-sm text-muted-foreground">
                          — {item.source}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[item.category]}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredLibrary.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No items in this category yet. Add your first one above.
              </p>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
