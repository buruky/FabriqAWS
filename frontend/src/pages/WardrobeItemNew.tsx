import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpTrayIcon, CameraIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { PageMeta } from '../components/PageMeta'
import { ClothingItemForm, type ClothingItemFormValues } from '../components/ClothingItemForm'
import { useClothing } from '../hooks/useClothing'
import { mockWebSearchClothing, type ImageSource, type NewClothingItemInput, type WebSearchResult } from '../services/clothing'

type Method = 'upload' | 'camera' | 'web'

const METHODS = [
  { key: 'upload' as const, label: 'Upload', Icon: ArrowUpTrayIcon },
  { key: 'camera' as const, label: 'Camera', Icon: CameraIcon },
  { key: 'web' as const, label: 'Web search', Icon: MagnifyingGlassIcon },
]

// /wardrobe/new: one page with a method switcher (upload / camera / web
// search) sharing a single item form — once a photo exists (from any
// method), ClothingItemForm renders for the rest of the fields. Web search
// input is a single free-text query against a mocked result set; CLAUDE.md
// marks the exact input format/result-selection UX "Undecided", so this
// stays minimal rather than guessing a structured brand+name schema.
export function WardrobeItemNew() {
  const navigate = useNavigate()
  const { createItem } = useClothing()
  const [method, setMethod] = useState<Method>('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [imageSource, setImageSource] = useState<ImageSource>('upload')
  const objectUrlRef = useRef<string | null>(null)

  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<WebSearchResult[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function handleFile(e: ChangeEvent<HTMLInputElement>, source: ImageSource) {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setImageUrl(url)
    setImageSource(source)
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    setSearching(true)
    setSearchError(null)
    try {
      const found = await mockWebSearchClothing(query)
      setResults(found)
      if (found.length === 0) setSearchError('No results. Try a different search.')
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed.')
    } finally {
      setSearching(false)
    }
  }

  function pickResult(result: WebSearchResult) {
    setImageUrl(result.imageUrl)
    setImageSource('web')
  }

  function changeMethod(next: Method) {
    setMethod(next)
    setImageUrl('')
    setResults([])
    setSearchError(null)
  }

  async function handleSubmit(values: ClothingItemFormValues) {
    const input: NewClothingItemInput = {
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
      imageUrl,
      imageSource,
    }
    const item = await createItem(input)
    navigate(`/wardrobe/${item.id}`)
  }

  return (
    <>
      <PageMeta title="Add item" description="Add a new item to your Fabriq wardrobe." />
      <section className="relative mx-auto max-w-2xl px-6 py-16">
        <div className="panel">
          <h1 className="text-3xl text-white">Add a wardrobe item</h1>

          <div role="tablist" aria-label="Add item method" className="mt-6 flex flex-wrap gap-2">
            {METHODS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={method === key}
                onClick={() => changeMethod(key)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-heading text-sm
                  transition-colors focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-gold
                  ${method === key ? 'bg-sage text-charcoal' : 'bg-olive/10 text-white hover:bg-olive/20'}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {method === 'upload' && (
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Choose a photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e, 'upload')}
                  className="text-sm text-white"
                />
              </label>
            )}
            {method === 'camera' && (
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Take a photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFile(e, 'camera')}
                  className="text-sm text-white"
                />
              </label>
            )}
            {method === 'web' && (
              <div className="flex flex-col gap-4">
                <form className="flex gap-2" onSubmit={handleSearch}>
                  <label className="sr-only" htmlFor="web-search-query">
                    Search the web for this item
                  </label>
                  <input
                    id="web-search-query"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Levi's 501 black jeans"
                    className="flex-1 rounded-md border border-white/30 bg-transparent px-3 py-2 text-white
                      outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="btn-secondary px-4 py-2 text-sm"
                    disabled={searching || !query.trim()}
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </form>
                {searchError && <p className="text-sm text-red-400">{searchError}</p>}
                {results.length > 0 && (
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {results.map((result) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => pickResult(result)}
                          aria-pressed={imageUrl === result.imageUrl}
                          className={`card block w-full p-2 text-left ${
                            imageUrl === result.imageUrl ? 'bg-olive/30' : ''
                          }`}
                        >
                          <img
                            src={result.imageUrl}
                            alt=""
                            className="aspect-square w-full rounded-md object-cover"
                          />
                          <span className="mt-1 block truncate text-xs text-white">{result.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="mt-8">
              <ClothingItemForm imageUrl={imageUrl} onSubmit={handleSubmit} submitLabel="Add to wardrobe" />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
