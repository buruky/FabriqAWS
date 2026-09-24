// Stage 0 mock data layer for outfits, mirroring services/clothing.ts's
// shape: module-level mock "backend" + async CRUD functions, so swapping in
// a real API later only touches this file. See CLAUDE.md "Current stage".
import type { ClothingItem } from './clothing'

export type OutfitMethod = 'manual' | 'agent'

// x/y/width/height are percentages of the canvas (0-100), not pixels, so
// placement stays correct across canvas sizes (phone vs. desktop) without
// recalculating on resize.
export interface OutfitItemPlacement {
  clothingItemId: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

// A piece the agent suggests that the user doesn't own yet (agent "suggest
// new" mode). Rendered on the canvas the same way as an owned item, but
// isn't a real ClothingItem — it never gets written into the wardrobe.
export interface SuggestedClothingItem {
  id: string
  name: string
  pieceType: string
  imageUrl: string
}

export interface NewOutfitInput {
  name: string
  description?: string
  theme?: string
  items: OutfitItemPlacement[]
  method: OutfitMethod
  inspoImageUrl?: string
  comments?: string
  suggestedItems?: SuggestedClothingItem[]
}

export interface Outfit extends NewOutfitInput {
  id: string
  createdAt: string
  updatedAt: string
}

function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const now = new Date().toISOString()

let outfits: Outfit[] = [
  {
    id: generateId('outfit'),
    name: 'Weekend Errands',
    description: 'Easy, layered, everything already in rotation.',
    theme: 'casual',
    method: 'manual',
    comments: '',
    items: [],
    createdAt: now,
    updatedAt: now,
  },
]

export async function listOutfits(): Promise<Outfit[]> {
  return delay([...outfits])
}

export async function getOutfit(id: string): Promise<Outfit | undefined> {
  return delay(outfits.find((outfit) => outfit.id === id))
}

export async function createOutfit(input: NewOutfitInput): Promise<Outfit> {
  const timestamp = new Date().toISOString()
  const outfit: Outfit = { ...input, id: generateId('outfit'), createdAt: timestamp, updatedAt: timestamp }
  outfits = [outfit, ...outfits]
  return delay(outfit)
}

export async function updateOutfit(id: string, patch: Partial<NewOutfitInput>): Promise<Outfit> {
  const existing = outfits.find((outfit) => outfit.id === id)
  if (!existing) throw new Error(`Outfit ${id} not found`)
  const updated: Outfit = { ...existing, ...patch, updatedAt: new Date().toISOString() }
  outfits = outfits.map((outfit) => (outfit.id === id ? updated : outfit))
  return delay(updated)
}

export type AgentSourceMode = 'owned' | 'suggest'

export interface GenerateOutfitInput {
  inspoImageUrl: string
  sourceMode: AgentSourceMode
  ownedItems: ClothingItem[]
}

export interface GenerateOutfitResult {
  items: OutfitItemPlacement[]
  suggestedItems: SuggestedClothingItem[]
}

// Rough canvas slots keyed by piece-type keyword, so a generated outfit
// reads as an actual outfit (jacket over top, bottoms below, shoes at the
// foot) instead of a random scatter. Values are canvas percentages.
const SLOTS: { keywords: string[]; placement: Omit<OutfitItemPlacement, 'clothingItemId'> }[] = [
  { keywords: ['outerwear', 'jacket', 'coat'], placement: { x: 28, y: 6, width: 44, height: 40, zIndex: 3 } },
  { keywords: ['top', 'shirt', 'dress', 'tee'], placement: { x: 32, y: 14, width: 36, height: 36, zIndex: 2 } },
  { keywords: ['bottom', 'pant', 'jean', 'skirt', 'short'], placement: { x: 34, y: 48, width: 32, height: 34, zIndex: 1 } },
  { keywords: ['shoe'], placement: { x: 38, y: 80, width: 24, height: 16, zIndex: 1 } },
  { keywords: ['bag'], placement: { x: 72, y: 50, width: 20, height: 20, zIndex: 2 } },
  { keywords: ['accessor', 'jewelry'], placement: { x: 6, y: 50, width: 16, height: 16, zIndex: 2 } },
]

const palette = ['#A8B5A4', '#9CA89B', '#E8D973']

function suggestedPlaceholder(label: string, index: number): string {
  const bg = palette[index % palette.length]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">` +
    `<rect width="100%" height="100%" fill="${bg}"/>` +
    `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ` +
    `font-family="sans-serif" font-size="24" fill="#1A1D1A">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Mocks the agent outfit-generation call (a backend concern per CLAUDE.md —
// "for Stage 0, mock its response in services/"). Picks one owned item per
// canvas slot when it can; in "suggest" mode, fills any slot with no owned
// match with a synthesized suggested piece instead of leaving it empty.
export async function mockGenerateOutfit(input: GenerateOutfitInput): Promise<GenerateOutfitResult> {
  const items: OutfitItemPlacement[] = []
  const suggestedItems: SuggestedClothingItem[] = []
  const used = new Set<string>()

  SLOTS.forEach((slot, index) => {
    const owned = input.ownedItems.find(
      (item) => !used.has(item.id) && slot.keywords.some((kw) => item.pieceType.toLowerCase().includes(kw)),
    )
    if (owned) {
      used.add(owned.id)
      items.push({ clothingItemId: owned.id, ...slot.placement })
      return
    }
    if (input.sourceMode === 'suggest') {
      const suggested: SuggestedClothingItem = {
        id: generateId('suggested'),
        name: `Suggested ${slot.keywords[0]}`,
        pieceType: slot.keywords[0],
        imageUrl: suggestedPlaceholder(slot.keywords[0], index),
      }
      suggestedItems.push(suggested)
      items.push({ clothingItemId: suggested.id, ...slot.placement })
    }
  })

  return delay({ items, suggestedItems }, 900)
}
