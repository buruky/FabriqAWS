import { PageMeta } from '../components/PageMeta'
import { useAuth } from '../hooks/useAuth'

export function Profile() {
  const { user, logout } = useAuth()

  return (
    <>
      <PageMeta title="Profile" description="Your Fabriq account." />
      <section className="relative mx-auto max-w-md px-6 py-16">
        <div className="bg-black/60 p-8">
          <h1 className="text-3xl text-white">Profile</h1>
          <p className="mt-4 text-white/70">{user ? user.email : 'Not signed in.'}</p>
          <button type="button" onClick={() => logout()} className="btn-secondary mt-6">
            Log out
          </button>
        </div>
      </section>
    </>
  )
}
