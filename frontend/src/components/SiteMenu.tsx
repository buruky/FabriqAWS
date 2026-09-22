import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const LINKS = [
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
]

// Site-wide logo + menu, fixed to the top-left corner, replacing the old
// full-width Navbar everywhere. Closes on Escape and on outside click.
export function SiteMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div ref={rootRef} className="fixed left-6 top-6 z-30">
      <div className="flex items-center gap-2 text-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="font-heading text-lg tracking-wide text-gold"
        >
          FABRIQ
        </Link>
      </div>

      {open && (
        <ul
          id="site-menu-panel"
          className="mt-3 flex flex-col gap-3 bg-black/80 px-5 py-4 text-white"
        >
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={() => setOpen(false)} className="hover:text-gold">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
