// Backdrop for every page except Landing/Dashboard/Login/Register, which
// keep the photo (ZineCollage). Just the flat charcoal fill — no decorative
// shapes (avoid-list #5/#6/#20 in FRONTEND_REBUILD_SPEC.md: no colored-border
// cards, no glassmorphism, no grain/gradient texture filler). The color
// comes from the content panels themselves (see `.panel` in index.css), not
// from background ornamentation.
export function SolidBackdrop() {
  return <div aria-hidden className="fixed inset-0 -z-10 bg-charcoal" />
}
