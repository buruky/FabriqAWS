import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDocked } from '../hooks/useDocked'

// Site-wide logo + auth nav, fixed top-left/top-right on every page. Both
// stay put regardless of scroll — no dock/undock swap, since a hard cut
// between two differently-styled and differently-worded states (as this
// used to do) reads as broken, not as navigation. Wording matches the Log
// in / Register pages themselves so the CTA and the page it lands on agree.
// Once logged in, the right-hand slot swaps to account nav (Wardrobe,
// Outfits, Account) instead of Log in / Register — same slot, same id, so
// the hero's star-clearance measurement in Landing.tsx keeps working
// either way.
export function SiteMenu() {
  const { user } = useAuth()
  const docked = useDocked()

  return (
    <>
      {/*
        Logo and nav share the same fixed top offset AND the same row
        height (h-7) so their vertical centers line up exactly — matching
        `top-6` alone isn't enough once they're different font sizes, since
        their line-height boxes differ.
      */}
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
          <Link to="/wardrobe" className="font-heading text-sm text-white hover:text-gold">
            Wardrobe
          </Link>
          <Link to="/outfits" className="font-heading text-sm text-white hover:text-gold">
            Outfits
          </Link>
          <Link
            to="/profile"
            className="inline-flex h-7 items-center rounded-full bg-charcoal px-4 font-heading
              text-xs text-white transition-colors hover:bg-white hover:text-charcoal
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-white"
          >
            Account
          </Link>
        </div>
      ) : (
        <div id="site-auth-nav" className="fixed right-[87px] top-6 z-30 flex h-7 items-center gap-4">
          <Link to="/login" className="font-heading text-sm text-white hover:text-gold">
            Log in
          </Link>
          <Link
            to="/register"
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-charcoal px-4
              font-heading text-xs text-white transition-colors hover:bg-white
              hover:text-charcoal focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Register
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
    </>
  )
}
