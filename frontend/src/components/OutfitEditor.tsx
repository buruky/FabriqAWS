import { useState, type FormEvent } from 'react'
import { useClothing } from '../hooks/useClothing'
import { OutfitCanvas, type ResolvedCanvasItem } from './OutfitCanvas'
import { WardrobePickerDrawer } from './WardrobePickerDrawer'
import type { ClothingItem } from '../services/clothing'
import type { OutfitItemPlacement, SuggestedClothingItem } from '../services/outfits'

const FIELD_CLASSES =
  'rounded-md border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white'

export interface OutfitEditorValues {
  name: string
  description: string
  theme: string
  items: OutfitItemPlacement[]
  comments: string
}

const EMPTY_OUTFIT_EDITOR_VALUES: OutfitEditorValues = {
  name: '',
  description: '',
  theme: '',
  items: [],
  comments: '',
}

interface OutfitEditorProps {
  initialValues?: Partial<OutfitEditorValues>
  // Agent-suggested pieces the user doesn't own (agent "suggest new" mode) —
  // rendered on the canvas alongside owned wardrobe items via resolveItem.
  suggestedItems?: SuggestedClothingItem[]
  onSave: (values: OutfitEditorValues) => Promise<void> | void
  saveLabel: string
}

// Shared canvas + form used by both /outfits/new (manual mode) and the
// editable /outfits/:id detail page.
export function OutfitEditor({ initialValues, suggestedItems = [], onSave, saveLabel }: OutfitEditorProps) {
  const { items: wardrobeItems, loading: wardrobeLoading } = useClothing()
  const [values, setValues] = useState<OutfitEditorValues>({ ...EMPTY_OUTFIT_EDITOR_VALUES, ...initialValues })
  const [pickerOpen, setPickerOpen] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  function resolveItem(clothingItemId: string): ResolvedCanvasItem | undefined {
    const owned = wardrobeItems.find((i) => i.id === clothingItemId)
    if (owned) return { name: owned.name, imageUrl: owned.imageUrl }
    const suggested = suggestedItems.find((i) => i.id === clothingItemId)
    if (suggested) return { name: suggested.name, imageUrl: suggested.imageUrl }
    return undefined
  }

  function handlePick(item: ClothingItem) {
    setValues((prev) => {
      if (prev.items.some((i) => i.clothingItemId === item.id)) return prev
      const cascade = (prev.items.length % 5) * 6
      const maxZ = prev.items.reduce((max, i) => Math.max(max, i.zIndex), 0)
      const placement: OutfitItemPlacement = {
        clothingItemId: item.id,
        x: 18 + cascade,
        y: 14 + cascade,
        width: 35,
        height: 35,
        zIndex: maxZ + 1,
      }
      return { ...prev, items: [...prev.items, placement] }
    })
  }

  function handleCanvasChange(items: OutfitItemPlacement[]) {
    setValues((prev) => ({ ...prev, items }))
  }

  function handleRemove(clothingItemId: string) {
    setValues((prev) => ({ ...prev, items: prev.items.filter((i) => i.clothingItemId !== clothingItemId) }))
  }

  function validate() {
    const next: typeof errors = {}
    if (!values.name.trim()) next.name = 'Name is required.'
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await onSave(values)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Could not save this outfit.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 sm:col-span-1">
          <span className="text-sm text-white/70">Outfit name</span>
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            className={FIELD_CLASSES}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'outfit-name-error' : undefined}
          />
          {errors.name && (
            <span id="outfit-name-error" className="text-sm text-red-400">
              {errors.name}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 sm:col-span-1">
          <span className="text-sm text-white/70">Theme</span>
          <input
            type="text"
            value={values.theme}
            onChange={(e) => setValues((prev) => ({ ...prev, theme: e.target.value }))}
            className={FIELD_CLASSES}
          />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-1">
          <span className="text-sm text-white/70">Description</span>
          <input
            type="text"
            value={values.description}
            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
            className={FIELD_CLASSES}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <span className="text-sm text-white/70">Canvas</span>
            <button type="button" onClick={() => setPickerOpen(true)} className="btn-secondary text-sm">
              Add from wardrobe
            </button>
          </div>
          <OutfitCanvas
            items={values.items}
            resolveItem={resolveItem}
            onChange={handleCanvasChange}
            onRemove={handleRemove}
          />
        </div>
        <div className="lg:w-64 lg:shrink-0">
          {wardrobeLoading ? (
            <p className="text-sm text-white/70">Loading your wardrobe...</p>
          ) : (
            <WardrobePickerDrawer
              items={wardrobeItems}
              onPick={handlePick}
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-white/70">Comments / refinement notes</span>
        <textarea
          value={values.comments}
          onChange={(e) => setValues((prev) => ({ ...prev, comments: e.target.value }))}
          rows={3}
          className={FIELD_CLASSES}
        />
      </label>

      {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}

      <button type="submit" className="btn-primary self-start" disabled={submitting}>
        {submitting ? 'Saving...' : saveLabel}
      </button>
    </form>
  )
}
