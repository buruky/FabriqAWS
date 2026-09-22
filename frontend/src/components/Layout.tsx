import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { ZineCollage } from './ZineCollage'
import { SiteMenu } from './SiteMenu'

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ZineCollage />
      <SiteMenu />
      <main className="relative flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
