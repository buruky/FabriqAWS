import { useClothingContext } from '../context/ClothingContext'

// Thin wrapper over ClothingContext, matching the current app's hooks/services split.
export function useClothing() {
  return useClothingContext()
}
