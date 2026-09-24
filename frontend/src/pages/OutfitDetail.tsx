import { useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { OutfitEditor, type OutfitEditorValues } from '../components/OutfitEditor'
import { useOutfits } from '../hooks/useOutfits'
import type { NewOutfitInput } from '../services/outfits'

// Outfits are editable after saving (CLAUDE.md). Reuses the same
// OutfitEditor/canvas the manual builder uses, pre-populated from the saved
// outfit; Save calls updateOutfit through the outfits context.
export function OutfitDetail() {
  const { id } = useParams<{ id: string }>()
  const { outfits, loading, updateItem } = useOutfits()
  const outfit = outfits.find((o) => o.id === id)

  async function handleSave(values: OutfitEditorValues) {
    if (!outfit) return
    const patch: Partial<NewOutfitInput> = {
      name: values.name,
      description: values.description || undefined,
      theme: values.theme || undefined,
      items: values.items,
      comments: values.comments || undefined,
    }
    await updateItem(outfit.id, patch)
  }

  return (
    <>
      <PageMeta title={outfit ? outfit.name : 'Outfit'} description="Details for a saved Fabriq outfit." />
      <section className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="panel">
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : outfit ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-3xl text-white">{outfit.name}</h1>
                <span className="badge">{outfit.method === 'agent' ? 'Agent-made' : 'Manual'}</span>
              </div>

              {outfit.inspoImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-white/70">Inspo photo</p>
                  <img src={outfit.inspoImageUrl} alt="" className="mt-1 h-32 w-32 rounded-md object-cover" />
                </div>
              )}

              <p className="mt-4 text-sm text-white/50">
                Created {new Date(outfit.createdAt).toLocaleDateString()} &middot; updated{' '}
                {new Date(outfit.updatedAt).toLocaleDateString()}
              </p>

              <div className="mt-8">
                <OutfitEditor
                  initialValues={{
                    name: outfit.name,
                    description: outfit.description ?? '',
                    theme: outfit.theme ?? '',
                    items: outfit.items,
                    comments: outfit.comments ?? '',
                  }}
                  suggestedItems={outfit.suggestedItems}
                  onSave={handleSave}
                  saveLabel="Save changes"
                />
              </div>
            </>
          ) : (
            <p className="text-white/70">Outfit not found.</p>
          )}
        </div>
      </section>
    </>
  )
}
