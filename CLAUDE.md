## Decisions
- Frontend: React
- Cloud: AWS
- Frontend lives in `frontend/`, built with Vite (not CRA) + TypeScript
- Styling: Tailwind CSS 3
- Routing: React Router 7
- Type pairing: Unica One (headings) + Crimson Text (body), self-hosted via `@fontsource`
- Color tokens carried over from the current app: sage `#A8B5A4`, olive `#9CA89B`, gold `#E8D973`, charcoal `#1A1D1A` — contrast-checked against charcoal background

## File Organization

Where things go, so structure doesn't drift file-by-file:
- `frontend/src/pages/` — one file per route
- `frontend/src/components/` — shared UI (layout, nav, backdrops), not page-specific
- `frontend/src/hooks/` — thin data hooks over `services/`
- `frontend/src/services/` — backend calls only, no React/JSX
- `frontend/src/context/` — React context providers
- `frontend/src/config/` — static config/data (categories, etc.)
- `frontend/src/assets/` — only files actually imported and shipped in the built bundle
- `assets/originals/` (repo root) — raw/unprocessed source assets (photos, design files); compress into `frontend/src/assets/` before anything imports them, never import the original directly
- `backend/` (repo root, once it exists) — AWS backend code, a sibling to `frontend/`, not nested inside it

Rule: before creating a new top-level folder, adding a file outside these buckets, or moving a file, check it against this map. If something doesn't obviously fit, ask rather than guessing a new location or leaving it at the repo root. Update this map when a new category of file shows up that doesn't fit an existing bucket.
