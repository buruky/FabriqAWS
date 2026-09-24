// Piece type suggestions. Generalizes the old fixed CLOTHING_CATEGORIES list
// (config/categories.ts) into a freeform-overridable suggestion set — per
// CLAUDE.md, piece type is one of the fields users can pick from suggestions
// or type their own custom value for. The stored field on a ClothingItem is
// a plain string, not this union, so a custom entry never fails to type-check.
export const PIECE_TYPE_SUGGESTIONS = [
  'top',
  'bottom',
  'dress',
  'outerwear',
  'shoes',
  'accessory',
  'bag',
  'jewelry',
] as const

export type PieceTypeSuggestion = (typeof PIECE_TYPE_SUGGESTIONS)[number]
