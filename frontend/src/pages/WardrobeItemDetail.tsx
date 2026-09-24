import { useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { ClothingItemForm, type ClothingItemFormValues } from '../components/ClothingItemForm'
import { useClothing } from '../hooks/useClothing'
import type { NewClothingItemInput } from '../services/clothing'

// Loads via useClothing()'s items + find-by-id, mirroring OutfitDetail.tsx's
// existing useParams + find-by-id + not-found fallback verbatim.
export function WardrobeItemDetail() {
  const { id } = useParams<{ id: string }>()
  const { items, loading, updateItem } = useClothing()
  const item = items.find((i) => i.id === id)

  async function handleSubmit(values: ClothingItemFormValues) {
    if (!item) return
    const patch: Partial<NewClothingItemInput> = {
      name: values.name,
      pieceType: values.pieceType,
      colors: values.colors,
      styles: values.styles,
      tags: values.tags,
      brand: values.brand || undefined,
      size: values.size || undefined,
      seasons: values.seasons,
      price: values.price ? Number(values.price) : undefined,
      whereBought: values.whereBought || undefined,
      notes: values.notes || undefined,
      collections: values.collections,
    }
    await updateItem(item.id, patch)
  }

  return (
    <>
      <PageMeta title={item ? item.name : 'Wardrobe item'} description="View and edit a Fabriq wardrobe item." />
      <section className="relative mx-auto max-w-2xl px-6 py-16">
        <div className="panel">
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : item ? (
            <>
              <h1 className="text-3xl text-white">{item.name}</h1>
              <div className="mt-8">
                <ClothingItemForm
                  imageUrl={item.imageUrl}
                  initialValues={{
                    name: item.name,
                    pieceType: item.pieceType,
                    colors: item.colors,
                    styles: item.styles,
                    tags: item.tags,
                    brand: item.brand ?? '',
                    size: item.size ?? '',
                    seasons: item.seasons,
                    price: item.price !== undefined ? String(item.price) : '',
                    whereBought: item.whereBought ?? '',
                    notes: item.notes ?? '',
                    collections: item.collections,
                  }}
                  onSubmit={handleSubmit}
                  submitLabel="Save changes"
                  readOnlyMeta={{ timesWorn: item.timesWorn, createdAt: item.createdAt, updatedAt: item.updatedAt }}
                />
              </div>
            </>
          ) : (
            <p className="text-white/70">Item not found.</p>
          )}
        </div>
      </section>
    </>
  )
}
