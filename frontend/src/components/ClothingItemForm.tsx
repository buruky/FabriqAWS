import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { PIECE_TYPE_SUGGESTIONS } from '../config/pieceTypes'
import { COLOR_SUGGESTIONS } from '../config/colors'
import { STYLE_SUGGESTIONS } from '../config/styles'

const SEASON_SUGGESTIONS = ['spring', 'summer', 'fall', 'winter'] as const

const FIELD_CLASSES =
  'rounded-md border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white'

interface TagFieldProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  suggestions?: readonly string[]
  placeholder?: string
}

// Freeform-overridable multi-value chip input: type a value and press Enter
// (or comma) to add it, or tap a suggestion chip. Shared by colors, styles,
// seasons, tags, and collections here, and by style preferences on the
// Account page — per CLAUDE.md these fields should let users pick from
// suggestions in config/ or create their own.
export function TagField({ label, values, onChange, suggestions, placeholder }: TagFieldProps) {
  const [draft, setDraft] = useState('')

  function addValue(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed || values.includes(trimmed)) return
    onChange([...values, trimmed])
    setDraft('')
  }

  function removeValue(value: string) {
    onChange(values.filter((v) => v !== value))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addValue(draft)
    }
  }

  const unusedSuggestions = suggestions?.filter((s) => !values.includes(s)) ?? []

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-white/70">{label}</span>

      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {values.map((v) => (
            <li key={v}>
              <button
                type="button"
                onClick={() => removeValue(v)}
                aria-label={`Remove ${v}`}
                className="badge inline-flex items-center gap-1.5"
              >
                {v}
                <span aria-hidden="true">&times;</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Add and press Enter'}
          aria-label={`Add a ${label.toLowerCase()} value`}
          className={`flex-1 ${FIELD_CLASSES}`}
        />
        <button type="button" onClick={() => addValue(draft)} className="btn-secondary px-4 py-2 text-sm">
          Add
        </button>
      </div>

      {unusedSuggestions.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {unusedSuggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => addValue(s)}
                className="rounded-full border border-olive/40 px-3 py-1 text-xs text-olive
                  transition-colors hover:border-gold hover:text-gold focus-visible:outline
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                + {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export interface ClothingItemFormValues {
  name: string
  pieceType: string
  colors: string[]
  styles: string[]
  tags: string[]
  brand: string
  size: string
  seasons: string[]
  price: string
  whereBought: string
  notes: string
  collections: string[]
}

const EMPTY_CLOTHING_ITEM_FORM_VALUES: ClothingItemFormValues = {
  name: '',
  pieceType: '',
  colors: [],
  styles: [],
  tags: [],
  brand: '',
  size: '',
  seasons: [],
  price: '',
  whereBought: '',
  notes: '',
  collections: [],
}

interface ClothingItemFormProps {
  imageUrl: string
  initialValues?: Partial<ClothingItemFormValues>
  onSubmit: (values: ClothingItemFormValues) => Promise<void> | void
  submitLabel: string
  readOnlyMeta?: { timesWorn: number; createdAt: string; updatedAt: string }
}

// Shared by /wardrobe/new (after a photo is chosen) and /wardrobe/:id
// (pre-filled, editable). Reuses the Login/Register validate()+errors+
// aria-invalid pattern rather than a new validation approach.
export function ClothingItemForm({
  imageUrl,
  initialValues,
  onSubmit,
  submitLabel,
  readOnlyMeta,
}: ClothingItemFormProps) {
  const [values, setValues] = useState<ClothingItemFormValues>({
    ...EMPTY_CLOTHING_ITEM_FORM_VALUES,
    ...initialValues,
  })
  const [errors, setErrors] = useState<{ name?: string; pieceType?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof ClothingItemFormValues>(key: K, value: ClothingItemFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    const next: typeof errors = {}
    if (!values.name.trim()) next.name = 'Name is required.'
    if (!values.pieceType.trim()) next.pieceType = 'Piece type is required.'
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Could not save this item.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <img src={imageUrl} alt="" className="aspect-square w-full max-w-xs rounded-md object-cover" />

      <label className="flex flex-col gap-1">
        <span className="text-sm text-white/70">Name</span>
        <input
          type="text"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          className={FIELD_CLASSES}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'item-name-error' : undefined}
        />
        {errors.name && (
          <span id="item-name-error" className="text-sm text-red-400">
            {errors.name}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-white/70">Piece type</span>
        <input
          type="text"
          list="piece-type-suggestions"
          value={values.pieceType}
          onChange={(e) => update('pieceType', e.target.value)}
          className={FIELD_CLASSES}
          aria-invalid={!!errors.pieceType}
          aria-describedby={errors.pieceType ? 'item-piece-type-error' : undefined}
        />
        <datalist id="piece-type-suggestions">
          {PIECE_TYPE_SUGGESTIONS.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        {errors.pieceType && (
          <span id="item-piece-type-error" className="text-sm text-red-400">
            {errors.pieceType}
          </span>
        )}
      </label>

      <TagField label="Colors" values={values.colors} onChange={(v) => update('colors', v)} suggestions={COLOR_SUGGESTIONS} />
      <TagField label="Styles" values={values.styles} onChange={(v) => update('styles', v)} suggestions={STYLE_SUGGESTIONS} />
      <TagField
        label="Seasons"
        values={values.seasons}
        onChange={(v) => update('seasons', v)}
        suggestions={SEASON_SUGGESTIONS}
      />
      <TagField label="Tags" values={values.tags} onChange={(v) => update('tags', v)} />
      <TagField label="Collections" values={values.collections} onChange={(v) => update('collections', v)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-white/70">Brand</span>
          <input type="text" value={values.brand} onChange={(e) => update('brand', e.target.value)} className={FIELD_CLASSES} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-white/70">Size</span>
          <input type="text" value={values.size} onChange={(e) => update('size', e.target.value)} className={FIELD_CLASSES} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-white/70">Price</span>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={values.price}
            onChange={(e) => update('price', e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-white/70">Where bought</span>
          <input
            type="text"
            value={values.whereBought}
            onChange={(e) => update('whereBought', e.target.value)}
            className={FIELD_CLASSES}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-white/70">Notes</span>
        <textarea
          value={values.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          className={FIELD_CLASSES}
        />
      </label>

      {readOnlyMeta && (
        <dl className="grid gap-3 text-sm text-white/70 sm:grid-cols-3">
          <div>
            <dt className="text-olive">Times worn</dt>
            <dd>{readOnlyMeta.timesWorn}</dd>
          </div>
          <div>
            <dt className="text-olive">Created</dt>
            <dd>{new Date(readOnlyMeta.createdAt).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-olive">Updated</dt>
            <dd>{new Date(readOnlyMeta.updatedAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      )}

      {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}

      <button type="submit" className="btn-primary self-start" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
