// Clothing category taxonomy, carried over from the current app's config/categories.js.
export const CLOTHING_CATEGORIES = [
  'tops',
  'bottoms',
  'shoes',
  'outerwear',
  'accessories',
] as const

export type ClothingCategory = (typeof CLOTHING_CATEGORIES)[number]
