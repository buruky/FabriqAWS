import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { ClothingItem } from '../services/clothing'

interface WardrobePickerDrawerProps {
  items: ClothingItem[]
  onPick: (item: ClothingItem) => void
  open: boolean
  onClose: () => void
}

// Wardrobe item picker for the manual outfit builder. On mobile it's a
// dismissible bottom-sheet drawer (owner decision — tap to add, not free
// cross-container drag); at the lg breakpoint the same list renders as an
// always-visible side panel instead, so `open`/`onClose` only matter below
// lg. Panel-vs-drawer is done with responsive classes, not two components,
// so there's one source of truth for the item list markup.
export function WardrobePickerDrawer({ items, onPick, open, onClose }: WardrobePickerDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) closeButtonRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-charcoal/70 lg:hidden"
        />
      )}
      <div
        role="region"
        aria-label="Your wardrobe"
        className={`${open ? 'fixed inset-x-0 bottom-0 z-40 max-h-96 overflow-y-auto rounded-t-lg bg-charcoal p-4 shadow-lg' : 'hidden'}
          lg:static lg:z-auto lg:block lg:max-h-none lg:overflow-visible lg:rounded-lg lg:bg-olive/10 lg:p-4 lg:shadow-none`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg text-white">Your wardrobe</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="btn-secondary px-3 py-1 text-sm lg:hidden"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-white/70">
            No items yet.{' '}
            <Link to="/wardrobe/new" className="underline hover:text-gold">
              Add one to your wardrobe
            </Link>{' '}
            first.
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onPick(item)}
                  className="card flex w-full flex-col gap-1 p-2 text-left hover:bg-olive/20"
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <span className="truncate text-xs text-white">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
