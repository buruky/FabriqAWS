import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { useAuth } from '../hooks/useAuth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    form?: string
  }>({})

  function validate() {
    const next: typeof errors = {}
    if (!email) next.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    if (confirmPassword !== password) next.confirmPassword = "Passwords don't match."
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    try {
      await register(email, password)
      navigate('/dashboard')
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Registration failed.' })
    }
  }

  return (
    <>
      <PageMeta title="Register" description="Create a Fabriq account." />

      <section className="relative mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6 py-24">
        <div className="bg-black/60 p-8">
          <h1 className="text-3xl text-white">Create an account</h1>
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

            <label className="flex flex-col gap-1">
              <span className="text-sm text-white/70">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <span className="text-sm text-red-400">{errors.confirmPassword}</span>
              )}
            </label>

            {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}

            <button type="submit" className="btn-flat mt-2">
              Register
            </button>
          </form>

          <p className="mt-6 text-sm text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-white underline">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
