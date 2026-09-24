import { PageMeta } from '../components/PageMeta'

export function Privacy() {
  return (
    <>
      <PageMeta title="Privacy Policy" description="How Fabriq handles your data." />
      <section className="relative mx-auto max-w-2xl px-6 py-16">
        <div className="panel">
          <h1 className="text-3xl text-white">Privacy Policy</h1>
          <p className="mt-4 bg-gold/10 p-4 text-sm text-gold">
            Draft placeholder — replace with real policy text before launch. This
            page exists so the route and layout are in place ahead of the actual
            legal content.
          </p>
        </div>
      </section>
    </>
  )
}
