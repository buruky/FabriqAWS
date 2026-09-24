import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { OutfitEditor, type OutfitEditorValues } from '../components/OutfitEditor'
import { useClothing } from '../hooks/useClothing'
import { useOutfits } from '../hooks/useOutfits'
import {
  mockGenerateOutfit,
  type AgentSourceMode,
  type GenerateOutfitResult,
  type NewOutfitInput,
  type OutfitMethod,
} from '../services/outfits'

type Mode = 'choose' | 'manual' | 'agent'

function toNewOutfitInput(values: OutfitEditorValues, method: OutfitMethod): NewOutfitInput {
  return {
    name: values.name,
    description: values.description || undefined,
    theme: values.theme || undefined,
    items: values.items,
    method,
    comments: values.comments || undefined,
  }
}

// /outfits/new: mode choice (manual vs. agent), folding what used to be the
// separate GeneratedOutfit.tsx page inline here — the agent result renders
// on the same OutfitEditor/canvas the manual flow uses, editable before save.
export function OutfitBuilder() {
  const navigate = useNavigate()
  const { items: wardrobeItems } = useClothing()
  const { createItem } = useOutfits()
  const [mode, setMode] = useState<Mode>('choose')

  const [inspoImageUrl, setInspoImageUrl] = useState('')
  const objectUrlRef = useRef<string | null>(null)
  const [sourceMode, setSourceMode] = useState<AgentSourceMode>('owned')
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateOutfitResult | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function handleInspoFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setInspoImageUrl(url)
    setResult(null)
  }

  async function handleGenerate() {
    setGenerating(true)
    setGenerateError(null)
    try {
      const generated = await mockGenerateOutfit({ inspoImageUrl, sourceMode, ownedItems: wardrobeItems })
      setResult(generated)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Could not generate an outfit.')
    } finally {
      setGenerating(false)
    }
  }

  async function saveManual(values: OutfitEditorValues) {
    const outfit = await createItem(toNewOutfitInput(values, 'manual'))
    navigate(`/outfits/${outfit.id}`)
  }

  async function saveAgent(values: OutfitEditorValues) {
    const input = toNewOutfitInput(values, 'agent')
    input.inspoImageUrl = inspoImageUrl
    input.suggestedItems = result?.suggestedItems ?? []
    const outfit = await createItem(input)
    navigate(`/outfits/${outfit.id}`)
  }

  return (
    <>
      <PageMeta title="New outfit" description="Build an outfit manually or generate one with the agent." />
      <section className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="panel">
          <h1 className="text-3xl text-white">New outfit</h1>

          {mode === 'choose' && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="card text-left transition-colors hover:bg-olive/20"
              >
                <h2 className="text-xl text-white">Build manually</h2>
                <p className="mt-2 text-sm text-white/70">Arrange pieces from your wardrobe on a free canvas.</p>
              </button>
              <button
                type="button"
                onClick={() => setMode('agent')}
                className="card text-left transition-colors hover:bg-olive/20"
              >
                <h2 className="text-xl text-white">Generate with the agent</h2>
                <p className="mt-2 text-sm text-white/70">
                  Upload an inspo photo and let the agent put together an outfit.
                </p>
              </button>
            </div>
          )}

          {mode === 'manual' && (
            <div className="mt-8">
              <button type="button" onClick={() => setMode('choose')} className="btn-flat mb-6 text-sm">
                Back
              </button>
              <OutfitEditor onSave={saveManual} saveLabel="Save outfit" />
            </div>
          )}

          {mode === 'agent' && (
            <div className="mt-8 flex flex-col gap-6">
              <button type="button" onClick={() => setMode('choose')} className="btn-flat self-start text-sm">
                Back
              </button>

              {!result && (
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-white/70">Inspo photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInspoFile}
                      className="text-sm text-white"
                    />
                  </label>

                  {inspoImageUrl && (
                    <img src={inspoImageUrl} alt="" className="h-48 w-48 rounded-md object-cover" />
                  )}

                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-sm text-white/70">Source</legend>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="radio"
                        name="source-mode"
                        checked={sourceMode === 'owned'}
                        onChange={() => setSourceMode('owned')}
                      />
                      Only clothes I own
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="radio"
                        name="source-mode"
                        checked={sourceMode === 'suggest'}
                        onChange={() => setSourceMode('suggest')}
                      />
                      Also suggest pieces I don&rsquo;t have
                    </label>
                  </fieldset>

                  {generateError && <p className="text-sm text-red-400">{generateError}</p>}

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!inspoImageUrl || generating}
                    className="btn-primary self-start"
                  >
                    {generating ? 'Generating...' : 'Generate outfit'}
                  </button>
                </div>
              )}

              {result && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white/70">
                      Generated from your inspo photo. Edit freely before saving.
                    </p>
                    <button type="button" onClick={() => setResult(null)} className="btn-secondary text-sm">
                      Try again
                    </button>
                  </div>
                  <OutfitEditor
                    initialValues={{ items: result.items }}
                    suggestedItems={result.suggestedItems}
                    onSave={saveAgent}
                    saveLabel="Save outfit"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
