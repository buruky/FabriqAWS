import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { useAuth } from '../hooks/useAuth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})

  function validate() {
    const next: typeof errors = {}
    if (!email) next.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    try {
      await login(email, password)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Sign-in failed.' })
    }
  }

  return (
    <>
      <PageMeta title="Log in" description="Log in to your Fabriq account." />
      <section className="relative mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6 py-24">
        <div className="bg-black/60 p-8">
          <h1 className="text-3xl text-white">Log in</h1>
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-white/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white"
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="text-sm text-red-400">{errors.email}</span>}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-white/70">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white"
                aria-invalid={!!errors.password}
              />
              {errors.password && <span className="text-sm text-red-400">{errors.password}</span>}
            </label>

            {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}

            <button type="submit" className="btn-flat mt-2">
              Log in
            </button>
          </form>

          <p className="mt-6 text-sm text-white/70">
            No account?{' '}
            <Link to="/register" className="text-white underline">
              Register
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
