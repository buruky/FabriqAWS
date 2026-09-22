import { Helmet } from 'react-helmet-async'

interface PageMetaProps {
  title: string
  description: string
}

const SITE_NAME = 'Fabriq'

// Per-route meta title/description (FRONTEND_REBUILD_SPEC.md #2.2.6) — every
// page should render one of these instead of relying on the static
// index.html title.
export function PageMeta({ title, description }: PageMetaProps) {
  return (
    <Helmet>
      <title>
        {title} · {SITE_NAME}
      </title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} · ${SITE_NAME}`} />
      <meta property="og:description" content={description} />
    </Helmet>
  )
}
