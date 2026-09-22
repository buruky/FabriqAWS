import { useState } from 'react'
import type { ClothingCategory } from '../config/categories'

export interface ClothingItem {
  id: string
  category: ClothingCategory
  imageUrl: string
  name: string
}

// TODO: replace with real data fetching once storage/DB is decided
// (S3 vs. keeping Cloudinary, RDS vs. DynamoDB — see FRONTEND_REBUILD_SPEC.md).
export function useClothing() {
  const [items] = useState<ClothingItem[]>([])
  const [loading] = useState(false)
  return { items, loading }
}
