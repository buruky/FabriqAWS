import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { TagField } from '../components/ClothingItemForm'
import { useAuth } from '../hooks/useAuth'
import { getAccountProfile, updateAccountProfile, type AccountProfile } from '../services/account'
import { STYLE_SUGGESTIONS } from '../config/styles'

const FIELD_CLASSES =
  'rounded-md border border-white/30 bg-transparent px-3 py-2 text-white outline-none focus:border-white'

const SIZE_FIELDS = ['tops', 'bottoms', 'shoes', 'outerwear'] as const

// Full account field list per CLAUDE.md: name, email, photo, sizes, style
// preferences, settings, logout. Email comes from useAuth() (bare auth
// identity); everything else from services/account.ts. "Settings" is a
// subsection here rather than a separate route — CLAUDE.md doesn't define one.
export function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<AccountProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<{ name?: string; form?: string }>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getAccountProfile().then((result) => {
      if (cancelled) return
      setProfile(result)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function updateField<K extends keyof AccountProfile>(key: K, value: AccountProfile[K]) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev))
    setSaved(false)
  }

  function updateSize(key: (typeof SIZE_FIELDS)[number], value: string) {
    setProfile((prev) => (prev ? { ...prev, sizes: { ...prev.sizes, [key]: value } } : prev))
    setSaved(false)
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    updateField('photoUrl', url)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!profile) return
    const next: typeof errors = {}
    if (!profile.name.trim()) next.name = 'Name is required.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSaving(true)
    try {
      const updated = await updateAccountProfile(profile)
      setProfile(updated)
      setSaved(true)
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Could not save your profile.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      <PageMeta title="Account" description="Your Fabriq profile and settings." />
      <section className="relative mx-auto max-w-2xl px-6 py-16">
        <div className="panel">
          <h1 className="text-3xl text-white">Account</h1>
          <p className="mt-2 text-white/70">{user ? user.email : 'Not signed in.'}</p>

          {loading || !profile ? (
            <p className="mt-8 text-white/70">Loading...</p>
          ) : (
            <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-charcoal font-heading text-xl text-white">
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (profile.name.trim().charAt(0) || '?').toUpperCase()
                  )}
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/70">Profile photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm text-white" />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Name</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={FIELD_CLASSES}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'account-name-error' : undefined}
                />
                {errors.name && (
                  <span id="account-name-error" className="text-sm text-red-400">
                    {errors.name}
                  </span>
                )}
              </label>

              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm text-white/70">Sizes</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SIZE_FIELDS.map((key) => (
                    <label key={key} className="flex flex-col gap-1">
                      <span className="text-sm capitalize text-white/70">{key}</span>
                      <input
                        type="text"
                        value={profile.sizes[key] ?? ''}
                        onChange={(e) => updateSize(key, e.target.value)}
                        className={FIELD_CLASSES}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <TagField
                label="Style preferences"
                values={profile.stylePreferences}
                onChange={(v) => updateField('stylePreferences', v)}
                suggestions={STYLE_SUGGESTIONS}
              />

              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm text-white/70">Settings</legend>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={profile.settings.emailNotifications}
                    onChange={(e) =>
                      updateField('settings', { ...profile.settings, emailNotifications: e.target.checked })
                    }
                  />
                  Email notifications
                </label>
              </fieldset>

              {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}
              {saved && <p className="text-sm text-sage">Saved.</p>}

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button type="button" onClick={handleLogout} className="btn-secondary">
                  Log out
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
