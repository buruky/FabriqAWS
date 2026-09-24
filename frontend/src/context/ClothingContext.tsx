import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createClothingItem,
  listClothingItems,
  updateClothingItem,
  type ClothingItem,
  type NewClothingItemInput,
} from '../services/clothing'

interface ClothingContextValue {
  items: ClothingItem[]
  loading: boolean
  error: string | null
  createItem: (input: NewClothingItemInput) => Promise<ClothingItem>
  updateItem: (id: string, patch: Partial<NewClothingItemInput> & { timesWorn?: number }) => Promise<ClothingItem>
}

const ClothingContext = createContext<ClothingContextValue | undefined>(undefined)

// Mirrors UserContext.tsx's shape: this provider owns the state, and calls
// the plain service functions in services/clothing.ts to read/write it.
export function ClothingProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listClothingItems()
      .then((result) => {
        if (!cancelled) setItems(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load wardrobe.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function createItem(input: NewClothingItemInput) {
    const item = await createClothingItem(input)
    setItems((prev) => [item, ...prev])
    return item
  }

  async function updateItem(id: string, patch: Partial<NewClothingItemInput> & { timesWorn?: number }) {
    const updated = await updateClothingItem(id, patch)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }

  return (
    <ClothingContext.Provider value={{ items, loading, error, createItem, updateItem }}>
      {children}
    </ClothingContext.Provider>
  )
}

export function useClothingContext() {
  const ctx = useContext(ClothingContext)
  if (!ctx) throw new Error('useClothingContext must be used within a ClothingProvider')
  return ctx
}
