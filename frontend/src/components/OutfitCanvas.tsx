import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { OutfitItemPlacement } from '../services/outfits'

export interface ResolvedCanvasItem {
  name: string
  imageUrl: string
}

interface OutfitCanvasProps {
  items: OutfitItemPlacement[]
  resolveItem: (clothingItemId: string) => ResolvedCanvasItem | undefined
  onChange: (items: OutfitItemPlacement[]) => void
  onRemove: (clothingItemId: string) => void
  editable?: boolean
}

// Floor for width/height (canvas %) so a drag/resize can't shrink an item to nothing.
const MIN_SIZE = 10
// Canvas % moved per arrow-key press — the keyboard-accessible alternative to
// pointer dragging (Shift+arrow resizes instead of moves).
const KEY_STEP = 2

interface DragState {
  clothingItemId: string
  mode: 'move' | 'resize'
  pointerId: number
  startClientX: number
  startClientY: number
  startItem: OutfitItemPlacement
  canvasWidth: number
  canvasHeight: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

// Free canvas for arranging outfit pieces. Dragging/resizing uses plain
// pointer events (owner decision — no drag-and-drop library), and works
// identically for mouse and touch via the Pointer Events API. Arrow keys
// (Shift+arrow to resize) give the same controls a keyboard path, since
// pointer dragging alone isn't operable without a pointer.
export function OutfitCanvas({ items, resolveItem, onChange, onRemove, editable = true }: OutfitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<DragState | null>(null)

  function bringToFront(clothingItemId: string): OutfitItemPlacement[] {
    const maxZ = items.reduce((max, i) => Math.max(max, i.zIndex), 0)
    const bumped = items.map((i) => (i.clothingItemId === clothingItemId ? { ...i, zIndex: maxZ + 1 } : i))
    onChange(bumped)
    return bumped
  }

  function startDrag(e: ReactPointerEvent<HTMLElement>, item: OutfitItemPlacement, mode: 'move' | 'resize') {
    if (!editable) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    e.currentTarget.setPointerCapture(e.pointerId)
    const bumped = bringToFront(item.clothingItemId)
    const startItem = bumped.find((i) => i.clothingItemId === item.clothingItemId)
    if (!startItem) return
    setDrag({
      clothingItemId: item.clothingItemId,
      mode,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startItem,
      canvasWidth: rect.width,
      canvasHeight: rect.height,
    })
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag || e.pointerId !== drag.pointerId) return
    const dxPct = ((e.clientX - drag.startClientX) / drag.canvasWidth) * 100
    const dyPct = ((e.clientY - drag.startClientY) / drag.canvasHeight) * 100

    onChange(
      items.map((i) => {
        if (i.clothingItemId !== drag.clothingItemId) return i
        if (drag.mode === 'move') {
          const x = clamp(drag.startItem.x + dxPct, 0, 100 - i.width)
          const y = clamp(drag.startItem.y + dyPct, 0, 100 - i.height)
          return { ...i, x, y }
        }
        const width = clamp(drag.startItem.width + dxPct, MIN_SIZE, 100 - drag.startItem.x)
        const height = clamp(drag.startItem.height + dyPct, MIN_SIZE, 100 - drag.startItem.y)
        return { ...i, width, height }
      }),
    )
  }

  function endDrag() {
    setDrag(null)
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>, item: OutfitItemPlacement) {
    if (!editable) return
    let dx = 0
    let dy = 0
    let dw = 0
    let dh = 0
    switch (e.key) {
      case 'ArrowLeft':
        if (e.shiftKey) dw = -KEY_STEP
        else dx = -KEY_STEP
        break
      case 'ArrowRight':
        if (e.shiftKey) dw = KEY_STEP
        else dx = KEY_STEP
        break
      case 'ArrowUp':
        if (e.shiftKey) dh = -KEY_STEP
        else dy = -KEY_STEP
        break
      case 'ArrowDown':
        if (e.shiftKey) dh = KEY_STEP
        else dy = KEY_STEP
        break
      default:
        return
    }
    e.preventDefault()
    onChange(
      items.map((i) => {
        if (i.clothingItemId !== item.clothingItemId) return i
        const width = clamp(i.width + dw, MIN_SIZE, 100 - i.x)
        const height = clamp(i.height + dh, MIN_SIZE, 100 - i.y)
        const x = clamp(i.x + dx, 0, 100 - width)
        const y = clamp(i.y + dy, 0, 100 - height)
        return { ...i, x, y, width, height }
      }),
    )
  }

  return (
    <div
      ref={canvasRef}
      className="relative aspect-square w-full overflow-hidden rounded-lg bg-olive/10"
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {items.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/50">
          {editable
            ? 'Add items from your wardrobe to start arranging this outfit.'
            : 'This outfit has no items yet.'}
        </p>
      )}
      {items.map((item) => {
        const resolved = resolveItem(item.clothingItemId)
        if (!resolved) return null
        return (
          <div
            key={item.clothingItemId}
            className="group absolute touch-none select-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
              zIndex: item.zIndex,
            }}
          >
            <div
              role="group"
              aria-label={
                editable
                  ? `${resolved.name}. Drag to move, or focus and use arrow keys (Shift+arrow to resize).`
                  : resolved.name
              }
              tabIndex={editable ? 0 : -1}
              className={`relative h-full w-full rounded-md focus-visible:outline
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
                ${editable ? 'cursor-grab active:cursor-grabbing' : ''}`}
              onPointerDown={(e) => startDrag(e, item, 'move')}
              onKeyDown={(e) => handleKeyDown(e, item)}
            >
              <img
                src={resolved.imageUrl}
                alt={resolved.name}
                draggable={false}
                className="h-full w-full rounded-md border border-white/20 object-cover"
              />
              {editable && (
                <>
                  <button
                    type="button"
                    onClick={() => onRemove(item.clothingItemId)}
                    aria-label={`Remove ${resolved.name} from outfit`}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full
                      bg-charcoal text-sm text-white focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    &times;
                  </button>
                  <button
                    type="button"
                    aria-label={`Resize ${resolved.name}`}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      startDrag(e, item, 'resize')
                    }}
                    className="absolute -bottom-2 -right-2 h-7 w-7 touch-none rounded-full border-2
                      border-charcoal bg-gold focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ cursor: 'nwse-resize' }}
                  />
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
