import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createOutfit,
  listOutfits,
  updateOutfit,
  type NewOutfitInput,
  type Outfit,
} from '../services/outfits'

interface OutfitsContextValue {
  outfits: Outfit[]
  loading: boolean
  error: string | null
  createItem: (input: NewOutfitInput) => Promise<Outfit>
  updateItem: (id: string, patch: Partial<NewOutfitInput>) => Promise<Outfit>
}

const OutfitsContext = createContext<OutfitsContextValue | undefined>(undefined)

// Mirrors UserContext.tsx's shape: this provider owns the state, and calls
// the plain service functions in services/outfits.ts to read/write it.
export function OutfitsProvider({ children }: { children: ReactNode }) {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listOutfits()
      .then((result) => {
        if (!cancelled) setOutfits(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load outfits.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function createItem(input: NewOutfitInput) {
    const outfit = await createOutfit(input)
    setOutfits((prev) => [outfit, ...prev])
    return outfit
  }

  async function updateItem(id: string, patch: Partial<NewOutfitInput>) {
    const updated = await updateOutfit(id, patch)
    setOutfits((prev) => prev.map((outfit) => (outfit.id === id ? updated : outfit)))
    return updated
  }

  return (
    <OutfitsContext.Provider value={{ outfits, loading, error, createItem, updateItem }}>
      {children}
    </OutfitsContext.Provider>
  )
}

export function useOutfitsContext() {
  const ctx = useContext(OutfitsContext)
  if (!ctx) throw new Error('useOutfitsContext must be used within an OutfitsProvider')
  return ctx
}
