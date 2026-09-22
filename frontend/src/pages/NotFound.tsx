import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function NotFound() {
  return (
    <>
      <PageMeta title="Page not found" description="This page doesn't exist." />
      <section className="relative mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-32 text-center">
        <div className="bg-black/60 p-8">
          <h1 className="text-4xl text-white">404</h1>
          <p className="mt-2 text-white/70">There's nothing at this address.</p>
          <Link to="/" className="btn-primary mt-4 inline-flex">
            Back home
          </Link>
        </div>
      </section>
    </>
  )
}
