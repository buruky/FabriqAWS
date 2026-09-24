import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { ZineCollage } from './ZineCollage'
import { SolidBackdrop } from './SolidBackdrop'
import { SiteMenu } from './SiteMenu'

// Photo backdrop is reserved for the pages where it sets the scene (landing
// pitch, dashboard home, and the auth pages that flank them); everywhere
// else gets the flat/shapes backdrop so dense UI (forms, item grids) isn't
// fighting a busy photo behind it.
const PHOTO_BACKDROP_PATHS = new Set(['/', '/dashboard', '/login', '/register'])

export function Layout() {
  const { pathname } = useLocation()
  const showPhoto = PHOTO_BACKDROP_PATHS.has(pathname)

  return (
    <div className="relative flex min-h-screen flex-col">
      {showPhoto ? <ZineCollage /> : <SolidBackdrop />}
      <SiteMenu />
      <main className="relative flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
