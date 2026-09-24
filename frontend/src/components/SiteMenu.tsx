import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
import { useDocked } from '../hooks/useDocked'
import { AccountMenu } from './AccountMenu'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/wardrobe', label: 'Wardrobe' },
  { to: '/outfits', label: 'Outfits' },
]

// Site-wide logo + auth/main nav, fixed top-left/top-right on every page.
// Both stay put regardless of scroll. Logged out shows Log in / Sign up,
// matching the Login/Signup pages' own wording. Logged in swaps that slot
// for main nav (Dashboard/Wardrobe/Outfits) + the account avatar menu —
// same slot, same id="site-auth-nav" either way, since Landing.tsx's
// star-clearance measurement reads that id directly off the DOM.
// Below the sm breakpoint the nav links collapse behind a hamburger toggle
// so they don't collide with the avatar in the tight top-right corner.
export function SiteMenu() {
  const { user } = useAuth()
  const docked = useDocked()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  // Close the mobile nav panel on every route change, so it never stays open
  // over the next page after a link is followed. Adjusted during render
  // (React's documented "adjusting state when a prop changes" pattern —
  // a plain state value, not a ref, since ref mutations during render
  // aren't safe under concurrent rendering) rather than in an effect.
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    if (navOpen) setNavOpen(false)
  }

  return (
    <>
      <div className="fixed left-1/2 top-6 z-30 flex h-7 -translate-x-1/2 items-center">
        <Link
          to="/"
          className={`font-wordmark font-black leading-none tracking-wide text-white
            transition-[font-size] duration-300 ${docked ? 'text-5xl' : 'text-7xl'}`}
        >
          FABRIQ
        </Link>
      </div>

      {user ? (
        <div id="site-auth-nav" className="fixed right-[87px] top-6 z-30 flex h-7 items-center gap-4">
          <nav aria-label="Main" className="hidden items-center gap-4 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="font-heading text-sm text-white hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>
          <AccountMenu />
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-white sm:hidden"
          >
            {navOpen ? <XMarkIcon className="h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      ) : (
        <div id="site-auth-nav" className="fixed right-[87px] top-6 z-30 flex h-7 items-center gap-4">
          <Link to="/login" className="font-heading text-sm text-white hover:text-gold">
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-charcoal px-4
              font-heading text-xs text-white transition-colors hover:bg-white
              hover:text-charcoal focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sign up
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
              <path
                d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}

      {user && navOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="fixed inset-x-0 top-20 z-20 flex flex-col gap-1 bg-charcoal p-4 shadow-lg sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 font-heading text-white transition-colors hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
