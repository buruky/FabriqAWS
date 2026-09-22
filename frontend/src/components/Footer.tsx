import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-olive/20 px-6 py-8 text-sm text-olive">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span>&copy; {new Date().getFullYear()} Fabriq</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-gold">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-gold">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
