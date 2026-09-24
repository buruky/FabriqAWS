import { useState, type FormEvent } from 'react'
import { PageMeta } from '../components/PageMeta'
import { useClothing } from '../hooks/useClothing'

export function OutfitCreate() {
  const { items } = useClothing()
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // TODO: wire to services/outfits.ts once the data layer is decided.
  }

  return (
    <>
      <PageMeta title="Create outfit" description="Combine items from your wardrobe into an outfit." />
      <section className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-black/60 p-8">
          <h1 className="text-3xl text-white">Create outfit</h1>
          <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-white/70">Outfit name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white"
              />
            </label>

            <div>
              <span className="text-sm text-white/70">Items</span>
              {items.length === 0 ? (
                <p className="mt-2 text-white/70">Add wardrobe items first before building an outfit.</p>
              ) : (
                <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className={`card w-full text-left ${selected.has(item.id) ? 'bg-olive/30' : ''}`}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className="btn-primary self-start" disabled={!name || selected.size === 0}>
              Save outfit
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
