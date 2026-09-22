import { useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { useOutfits } from '../hooks/useOutfits'

export function OutfitDetail() {
  const { id } = useParams<{ id: string }>()
  const { outfits, loading } = useOutfits()
  const outfit = outfits.find((o) => o.id === id)

  return (
    <>
      <PageMeta
        title={outfit ? outfit.name : 'Outfit'}
        description="Details for a saved Fabriq outfit."
      />
      <section className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="bg-black/60 p-8">
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : outfit ? (
            <h1 className="text-3xl text-white">{outfit.name}</h1>
          ) : (
            <p className="text-white/70">Outfit not found.</p>
          )}
        </div>
      </section>
    </>
  )
}
