import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { useClothing } from '../hooks/useClothing'
import { useOutfits } from '../hooks/useOutfits'

export function Dashboard() {
  const { items } = useClothing()
  const { outfits } = useOutfits()

  return (
    <>
      <PageMeta title="Dashboard" description="Your Fabriq wardrobe at a glance." />
      <section className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="bg-black/60 p-8">
          <h1 className="text-3xl text-white">Dashboard</h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Link to="/wardrobe" className="card block hover:bg-olive/20">
              <h2 className="text-xl">Wardrobe</h2>
              <p className="mt-2 text-olive">{items.length} items catalogued</p>
            </Link>

            <Link to="/outfits" className="card block hover:bg-olive/20">
              <h2 className="text-xl">Outfits</h2>
              <p className="mt-2 text-olive">{outfits.length} outfits saved</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
