import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

function MenuGridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="2" fill="#E8D973" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="#FFFFFF" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="#FFFFFF" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="#E8D973" />
    </svg>
  )
}

const LINKS = [
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
]

// Site-wide logo + menu, fixed top-left, replacing the old full-width Navbar
// everywhere. Below the logo sits a hamburger with a dropdown — until you've
// scrolled far enough (roughly matching the hero's scroll-to-header handoff
// on the landing page) at which point the links dock as plain options in
// the top-right corner instead. Closes on Escape and on outside click.
export function SiteMenu() {
  const [open, setOpen] = useState(false)
  const [docked, setDocked] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleScroll() {
      const isDocked = window.scrollY > window.innerHeight * 0.75
      setDocked(isDocked)
      if (isDocked) setOpen(false)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <>
      <div ref={rootRef} className="fixed left-9 top-6 z-30 flex flex-col items-center gap-20 text-white">
        <Link to="/" onClick={() => setOpen(false)} className="font-heading text-2xl tracking-wide text-gold">
          FABRIQ
        </Link>

        {!docked && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu-panel"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <XMarkIcon className="h-6 w-6" /> : <MenuGridIcon className="h-10 w-8" />}
            </button>

            {open && (
              <ul
                id="site-menu-panel"
                className="absolute left-1/2 top-full mt-3 flex -translate-x-1/2 flex-col gap-3 whitespace-nowrap bg-black/80 px-6 py-4 font-heading text-white"
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
        )}
      </div>

      {docked && (
        <ul className="fixed right-40 top-6 z-30 flex items-center gap-6 text-white">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="hover:text-gold">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
