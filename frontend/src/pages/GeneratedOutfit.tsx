import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function GeneratedOutfit() {
  // TODO: wire to the AI generation call once it's moved to a Lambda
  // (mirrors the current api/generate-outfit.js — see FRONTEND_REBUILD_SPEC.md).
  return (
    <>
      <PageMeta title="Generated outfit" description="An outfit generated from your wardrobe." />
      <section className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="panel">
          <h1 className="text-3xl text-white">Generated outfit</h1>
          <p className="mt-4 text-white/70">
            Outfit generation isn't wired up yet — this page will show the result once
            the AI generation Lambda is in place.
          </p>
          <Link to="/outfits" className="btn-secondary mt-6 inline-flex">
            Back to outfits
          </Link>
        </div>
      </section>
    </>
  )
}
