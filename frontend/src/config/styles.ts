// Style suggestions for clothing items and account style preferences.
// Freeform-overridable, same pattern as config/pieceTypes.ts.
export const STYLE_SUGGESTIONS = [
  'casual',
  'formal',
  'streetwear',
  'minimalist',
  'vintage',
  'athletic',
  'bohemian',
  'preppy',
  'edgy',
  'classic',
] as const

export type StyleSuggestion = (typeof STYLE_SUGGESTIONS)[number]
