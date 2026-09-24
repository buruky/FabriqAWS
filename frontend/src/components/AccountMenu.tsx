import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getAccountProfile } from '../services/account'

// Top-right account dropdown: avatar/initials button, opens a small menu
// with a link to /account and a logout action. Renders nothing when signed
// out (SiteMenu shows the Log in / Sign up nav instead).
//
// Reads the display name/photo straight from services/account.ts rather
// than through a shared context — Account.tsx does the same independently.
// That's a deliberate Stage 0 simplification: if the user edits their name
// on /account, this header avatar won't pick it up until next mount (e.g. a
// route change remounting Layout wouldn't even do it, since SiteMenu stays
// mounted). Worth an AccountContext if that live-sync starts to matter.
export function AccountMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getAccountProfile().then((profile) => {
      if (cancelled) return
      setName(profile.name)
      setPhotoUrl(profile.photoUrl)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) firstMenuItemRef.current?.focus()
  }, [open])

  if (!user) return null

  const initials = (name ?? user.email).trim().charAt(0).toUpperCase()

  async function handleLogout() {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-charcoal
          font-heading text-sm text-white transition-colors hover:bg-white hover:text-charcoal
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-white"
      >
        {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : initials}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full mt-2 w-44 rounded-md bg-charcoal p-2 shadow-lg"
        >
          <Link
            ref={firstMenuItemRef}
            to="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 font-heading text-sm text-white transition-colors
              hover:bg-white hover:text-charcoal"
          >
            Account
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full rounded px-3 py-2 text-left font-heading text-sm text-white
              transition-colors hover:bg-white hover:text-charcoal"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
