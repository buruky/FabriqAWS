import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import ClickSpark from '../components/ClickSpark/ClickSpark'
import { useDocked } from '../hooks/useDocked'

const STAR_ICON_HALF = 10 // half of the 20px star icon, to keep it centered on its anchor point

const HEADER_Y = 70 // final resting height (px from top) once the line docks as the header underline

export function Landing() {
  const docked = useDocked()
  const bottomLineRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, { stiffness: 90, damping: 20, mass: 0.5 })
  const rotate = useTransform(smoothScrollY, (v) => v * 0.4)

  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)
  // Measured from the hero's own bottom line so the bar starts perfectly
  // aligned with it, rather than guessing from viewport height. Gated behind
  // `ready` so nothing renders (and no spring animates in) until the real
  // position is known — avoids a flash/slide from the wrong spot on load.
  const [restY, setRestY] = useState(0)
  // Measured from SiteMenu's actual auth nav (rather than assumed) so the
  // bar/star stop short of it instead of sliding underneath — its width
  // shifts with copy ("Log in" vs a longer label) and login state.
  const [navLeft, setNavLeft] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => {
    function measure() {
      setViewportWidth(window.innerWidth)
      if (bottomLineRef.current) {
        setRestY(bottomLineRef.current.getBoundingClientRect().top + window.scrollY)
      }
      const nav = document.getElementById('site-auth-nav')
      setNavLeft(nav ? nav.getBoundingClientRect().left : null)
      setReady(true)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const barRestWidth = 141 // short segment sitting under the logo before any scrolling
  const NAV_CLEARANCE = 32 // gap kept between the star's resting spot and the auth nav
  const barFullWidth = (navLeft ?? viewportWidth - 120) - NAV_CLEARANCE

  // The white line itself scrolls away with the hero (it's a normal in-flow
  // element). So instead of an abstract 0-1 progress, track raw scroll: the
  // bar rides at exactly `restY - scrollY`, i.e. glued to the real line's
  // current on-screen position, until that would rise above the header spot
  // — at which point it clamps there and becomes the header underline.
  // No spring here — it needs to stay glued exactly to the real scroll
  // position (a spring would lag and overshoot/bounce against the hard
  // clamp at the header spot).
  const catchUpScrollY = Math.max(restY - HEADER_Y, 1)
  const barTop = useTransform(scrollY, (sy) => Math.max(HEADER_Y, restY - sy))

  // Horizontal growth completes over that same scroll distance, so the bar
  // is fully extended right as it catches up to the header position.
  const localProgress = useTransform(scrollY, [0, catchUpScrollY], [0, 1])
  const barScaleX = useTransform(localProgress, [0, 1], [barRestWidth / barFullWidth, 1])

  // Derived directly from the bar's own (sprung) scale, not a separate spring —
  // so the star is mathematically pinned to the bar's actual rendered tip and
  // the two can never drift apart mid-animation.
  const starX = useTransform(barScaleX, (scale) => scale * barFullWidth - STAR_ICON_HALF)

  return (
    <>
      <PageMeta
        title="Home"
        description="Fabriq turns the clothes you already own into outfits you didn't know you had."
      />

      {/*
        Starts sitting at the hero's bottom line (where the CTA is) and rises
        as you scroll, becoming the fixed header underline by the time "How
        it works" comes into view — the star always rides its leading tip.
        Gated on `ready` so it never flashes at the wrong spot before the
        bottom line's real position has been measured.
      */}
      {ready && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 z-20 h-50 w-full"
          style={{ top: barTop }}
        >
          <motion.div
            className="absolute left-0 h-0.5 origin-left rounded-full bg-gold"
            style={{ width: barFullWidth, scaleX: barScaleX, top: '50%', y: '-50%' }}
          />
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute left-0 h-5 w-5"
            style={{ x: starX, top: '50%', y: '-50%', rotate }}
          >
            <path
              d="M23 12 L14.83 9.17 L12 1 L9.17 9.17 L1 12 L9.17 14.83 L12 23 L14.83 14.83 Z"
              fill="#E8D973"
              stroke="#E8D973"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      )}

      {/*
        Logo and auth nav (Log in / Register) live in SiteMenu, fixed
        site-wide, so the hero headline is a short brand line instead of
        repeating the wordmark or its own nav.
      */}
      <section className="relative flex min-h-screen flex-col justify-center px-6 py-16 sm:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 right-0 top-[0px] h-px bg-white/0" />
          <div
            ref={bottomLineRef}
            className={`absolute bottom-[15%] left-0 right-0 h-px bg-white/50 transition-opacity
              duration-300 ${docked ? 'opacity-0' : 'opacity-100'}`}
          />
          <div className="absolute left-[140px] -top-20 bottom-[15%] w-px bg-white/50" />
          <div className="absolute right-[15%] -top-0 bottom-[15%] w-px bg-white/0" />
          {[
            { pct: 8, width: 40 },
            { pct: 16, width: 32 },
            { pct: 24, width: 24 },
            { pct: 32, width: 16 },
          ].map(({ pct, width }) => (
            <div
              key={pct}
              className="absolute h-px bg-white/50"
              style={{ left: '140px', top: `${pct}%`, width }}
            />
          ))}
        </div>
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <h1 className="font-wordmark text-4xl font-black leading-tight text-gold sm:text-5xl">
            Outfits you didn't know you had.
          </h1>
          <p className="max-w-md text-lg text-white/80">
            Photograph your wardrobe once. Fabriq combines those pieces into outfits
            you'd actually wear, using what's already in your closet.
          </p>
          <div className="inline-block">
            <ClickSpark sparkColor="#E8D973" sparkCount={10} sparkRadius={20}>
              <Link to="/signup" className="btn-flat">
                Add your wardrobe
              </Link>
            </ClickSpark>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl px-6 pb-24">
        <div className="bg-black/50 p-6">
          <h2 className="text-2xl text-white">How it works</h2>
          <p className="mt-3 text-white/80">
            Upload photos of clothes you own, tag the category, and Fabriq
            suggests outfit combinations from that set — no shopping links, no
            stock photos, just your own clothes recombined.
          </p>
        </div>
      </section>

      {/* TEMP: filler height for testing the scroll effect, remove once more sections exist */}
      <div className="h-[150vh]" />
    </>
  )
}
