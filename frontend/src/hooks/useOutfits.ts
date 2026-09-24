import { useOutfitsContext } from '../context/OutfitsContext'

// Thin wrapper over OutfitsContext, matching the current app's hooks/services split.
export function useOutfits() {
  return useOutfitsContext()
}
