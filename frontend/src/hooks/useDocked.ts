import { useEffect, useState } from 'react'

// True once scrolled past the point where the hero's CTA bar docks as the
// fixed header underline (see Landing's HEADER_Y handoff) — shared so every
// element that changes at that same scroll point (e.g. the wordmark
// shrinking once it's sharing the header row) agrees on the threshold.
export function useDocked() {
  const [docked, setDocked] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setDocked(window.scrollY > window.innerHeight * 0.75)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return docked
}
