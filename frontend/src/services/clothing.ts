// Stage 0 mock data layer for clothing items. Holds the "backend" in a
// module-level array and exposes async CRUD functions so the calling code
// (ClothingContext) already looks like it's talking to a real API — when a
// real backend is decided, only this file changes, not context/components.
// See CLAUDE.md "Current stage".

import { generateId } from './id'

export type ImageSource = 'upload' | 'camera' | 'web'

export interface NewClothingItemInput {
  name: string
  pieceType: string
  colors: string[]
  styles: string[]
  tags: string[]
  brand?: string
  size?: string
  seasons: string[]
  price?: number
  whereBought?: string
  notes?: string
  collections: string[]
  imageUrl: string
  imageSource: ImageSource
}

export interface ClothingItem extends NewClothingItemInput {
  id: string
  timesWorn: number
  createdAt: string
  updatedAt: string
}

export interface WebSearchResult {
  id: string
  name: string
  imageUrl: string
}

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Zero-network SVG placeholder, so mock photos render instantly offline and
// in CI without depending on an external image host.
function placeholderImage(label: string, bg: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">` +
    `<rect width="100%" height="100%" fill="${bg}"/>` +
    `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ` +
    `font-family="sans-serif" font-size="26" fill="#1A1D1A">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const now = new Date().toISOString()

let items: ClothingItem[] = [
  {
    id: generateId('item'),
    name: 'Olive Field Jacket',
    pieceType: 'outerwear',
    colors: ['green'],
    styles: ['casual', 'vintage'],
    tags: ['favorite'],
    brand: 'Carhartt',
    size: 'M',
    seasons: ['fall', 'spring'],
    price: 120,
    whereBought: 'Thrift store',
    notes: 'Great over a plain tee.',
    collections: ['work'],
    imageUrl: placeholderImage('Field Jacket', '#9CA89B'),
    imageSource: 'upload',
    timesWorn: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: generateId('item'),
    name: 'White Ribbed Tank',
    pieceType: 'top',
    colors: ['white'],
    styles: ['minimalist', 'casual'],
    tags: [],
    brand: 'Uniqlo',
    size: 'S',
    seasons: ['summer'],
    price: 15,
    whereBought: 'Uniqlo',
    notes: '',
    collections: ['summer'],
    imageUrl: placeholderImage('Ribbed Tank', '#E8D973'),
    imageSource: 'upload',
    timesWorn: 12,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: generateId('item'),
    name: 'Black Straight Jeans',
    pieceType: 'bottom',
    colors: ['black'],
    styles: ['classic', 'streetwear'],
    tags: [],
    brand: 'Levi’s',
    size: '30x32',
    seasons: ['fall', 'winter', 'spring'],
    price: 70,
    whereBought: 'Levi’s store',
    notes: '',
    collections: ['work'],
    imageUrl: placeholderImage('Straight Jeans', '#1A1D1A'),
    imageSource: 'upload',
    timesWorn: 20,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: generateId('item'),
    name: 'Canvas High-Tops',
    pieceType: 'shoes',
    colors: ['white'],
    styles: ['casual', 'streetwear'],
    tags: [],
    brand: 'Converse',
    size: '9',
    seasons: ['spring', 'summer', 'fall'],
    price: 65,
    whereBought: 'Converse.com',
    notes: '',
    collections: [],
    imageUrl: placeholderImage('High-Tops', '#A8B5A4'),
    imageSource: 'web',
    timesWorn: 8,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: generateId('item'),
    name: 'Charcoal Wool Coat',
    pieceType: 'outerwear',
    colors: ['gray'],
    styles: ['formal', 'classic'],
    tags: ['winter staple'],
    brand: 'COS',
    size: 'M',
    seasons: ['winter'],
    price: 240,
    whereBought: 'COS',
    notes: '',
    collections: [],
    imageUrl: placeholderImage('Wool Coat', '#9CA89B'),
    imageSource: 'camera',
    timesWorn: 3,
    createdAt: now,
    updatedAt: now,
  },
]

export async function listClothingItems(): Promise<ClothingItem[]> {
  return delay([...items])
}

export async function getClothingItem(id: string): Promise<ClothingItem | undefined> {
  return delay(items.find((item) => item.id === id))
}

export async function createClothingItem(input: NewClothingItemInput): Promise<ClothingItem> {
  const timestamp = new Date().toISOString()
  const item: ClothingItem = {
    ...input,
    id: generateId('item'),
    timesWorn: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  items = [item, ...items]
  return delay(item)
}

export async function updateClothingItem(
  id: string,
  patch: Partial<NewClothingItemInput> & { timesWorn?: number },
): Promise<ClothingItem> {
  const existing = items.find((item) => item.id === id)
  if (!existing) throw new Error(`Clothing item ${id} not found`)
  const updated: ClothingItem = { ...existing, ...patch, updatedAt: new Date().toISOString() }
  items = items.map((item) => (item.id === id ? updated : item))
  return delay(updated)
}

// Web search source for /wardrobe/new. Input format is intentionally a
// single free-text query — CLAUDE.md marks the exact input format and result
// selection UX "Undecided", so this stays minimal rather than guessing a
// structured brand+name schema.
export async function mockWebSearchClothing(query: string): Promise<WebSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return delay([])
  const palette = ['#A8B5A4', '#9CA89B', '#E8D973', '#1A1D1A']
  const results = Array.from({ length: 4 }, (_, i) => ({
    id: generateId('search'),
    name: `${trimmed} — result ${i + 1}`,
    imageUrl: placeholderImage(trimmed.slice(0, 18), palette[i % palette.length]),
  }))
  return delay(results, 500)
}
