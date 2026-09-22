import { PageMeta } from '../components/PageMeta'
import { useClothing } from '../hooks/useClothing'

export function Wardrobe() {
  const { items, loading } = useClothing()

  return (
    <>
      <PageMeta title="Wardrobe" description="Every item in your Fabriq wardrobe." />
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="bg-black/60 p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl text-white">Wardrobe</h1>
            <button type="button" className="btn-primary">
              Add item
            </button>
          </div>

          {loading ? (
            <p className="mt-8 text-white/70">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-8 text-white/70">
              Nothing added yet. Add a photo of something you own to start building outfits.
            </p>
          ) : (
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => (
                <li key={item.id} className="card">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="mb-2 aspect-square w-full rounded-md object-cover"
                  />
                  <p>{item.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
