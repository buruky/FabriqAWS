// Color suggestions for clothing items. Freeform-overridable, same pattern as
// config/pieceTypes.ts — users can pick one of these or type a custom color.
export const COLOR_SUGGESTIONS = [
  'black',
  'white',
  'gray',
  'beige',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'multicolor',
] as const

export type ColorSuggestion = (typeof COLOR_SUGGESTIONS)[number]
