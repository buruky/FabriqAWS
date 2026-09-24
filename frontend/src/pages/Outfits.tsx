import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { useOutfits } from '../hooks/useOutfits'

export function Outfits() {
  const { outfits, loading } = useOutfits()

  return (
    <>
      <PageMeta title="Outfits" description="Outfits built from your wardrobe." />
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="panel">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl text-white">Outfits</h1>
            <Link to="/outfits/create" className="btn-primary">
              Create outfit
            </Link>
          </div>

          {loading ? (
            <p className="mt-8 text-white/70">Loading...</p>
          ) : outfits.length === 0 ? (
            <p className="mt-8 text-white/70">No outfits saved yet.</p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {outfits.map((outfit) => (
                <li key={outfit.id}>
                  <Link to={`/outfits/${outfit.id}`} className="card block hover:bg-olive/20">
                    {outfit.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
