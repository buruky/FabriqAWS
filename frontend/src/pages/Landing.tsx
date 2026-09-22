import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import ClickSpark from '../components/ClickSpark/ClickSpark'

export function Landing() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Fabriq turns the clothes you already own into outfits you didn't know you had."
      />

      {/*
        Wordmark stands in as the headline (the "Wear more of what you
        already own." copy was cut), followed by subtext and CTA in the
        same top-left cluster.
      */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 sm:px-12">
        <div className="flex max-w-xl flex-col gap-6">
          <h1 className="self-start">
            <span className="text-[18vw] font-heading leading-none text-gold sm:text-[10vw]">
              FABRIQ
            </span>
          </h1>
          <p className="max-w-md text-lg text-white/80">
            Photograph your wardrobe once. Fabriq combines those pieces into outfits
            you'd actually wear, using what's already in your closet.
          </p>
          <div className="inline-block self-start">
            <ClickSpark sparkColor="#E8D973" sparkCount={10} sparkRadius={20}>
              <Link to="/register" className="btn-flat">
                Add your wardrobe
              </Link>
            </ClickSpark>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl px-6 pb-24">
        <div className="bg-black/50 p-6">
          <h2 className="text-2xl text-white">How it works</h2>
          <p className="mt-3 text-white/80">
            Upload photos of clothes you own, tag the category, and Fabriq
            suggests outfit combinations from that set — no shopping links, no
            stock photos, just your own clothes recombined.
          </p>
        </div>
      </section>
    </>
  )
}
