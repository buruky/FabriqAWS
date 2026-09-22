import { useState } from 'react'

export interface Outfit {
  id: string
  name: string
  itemIds: string[]
}

// TODO: replace with real data fetching once the AWS data layer is decided
// (see FRONTEND_REBUILD_SPEC.md open decisions).
export function useOutfits() {
  const [outfits] = useState<Outfit[]>([])
  const [loading] = useState(false)
  return { outfits, loading }
}
