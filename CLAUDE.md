# Project: Digital Wardrobe

A web app where users catalog their clothes, build outfits (by hand or with an AI agent), and organize everything with tags, collections, and filters.

## Decisions

- Frontend: React
- Cloud: AWS
- Frontend lives in `frontend/`, built with Vite (not CRA) + TypeScript
- Styling: Tailwind CSS 3
- Routing: React Router 7
- Type pairing: Unica One (headings) + Crimson Text (body), self-hosted via `@fontsource`
- Color tokens carried over from the current app: sage `#A8B5A4`, olive `#9CA89B`, gold `#E8D973`, charcoal `#1A1D1A`, contrast-checked against charcoal background

Anything not listed here is undecided, including state management, data fetching libraries, test tools, backend services, database, auth provider, and IaC.

## Current stage

Stage 0: the app runs fully locally with hardcoded mock data. No AWS, no real API calls yet. Mock data lives in `services/`, so swapping in real API calls later touches only that folder, not components or pages.

## How to work in this repo

- The owner makes all structural decisions. Before adding a dependency, library, or architectural pattern, present 2 to 3 options with tradeoffs and wait for a choice.
- Never install packages without approval.
- Explain unfamiliar techniques briefly.
- When a requirement below is marked **Undecided**, do not guess. Ask, or build the minimum that keeps the option open.
- Frontend work goes to the `frontend-expert` subagent.

## File organization

Where things go, so structure doesn't drift file by file:

- `frontend/src/pages/`: one file per route
- `frontend/src/components/`: shared UI (layout, nav, backdrops), not page specific
- `frontend/src/hooks/`: thin data hooks over `services/`
- `frontend/src/services/`: backend calls only (mock data during Stage 0), no React or JSX
- `frontend/src/context/`: React context providers
- `frontend/src/config/`: static config and data (categories, etc.)
- `frontend/src/assets/`: only files actually imported and shipped in the built bundle
- `assets/originals/` (repo root): raw, unprocessed source assets (photos, design files). Compress into `frontend/src/assets/` before anything imports them; never import an original directly
- `backend/` (repo root, once it exists): AWS backend code, a sibling to `frontend/`, not nested inside it

Rule: before creating a new top level folder, adding a file outside these buckets, or moving a file, check it against this map. If something doesn't obviously fit, ask rather than guessing a new location or leaving it at the repo root. Update this map when a new category of file shows up that doesn't fit an existing bucket.

## Design approach

Styling stays bare bones for now. The goal is clean structure that can be restyled later without rewriting components.

- Colors, fonts, spacing, radii, and breakpoints are defined once in the Tailwind theme config. Components use those token classes and never hardcode values (no arbitrary values like `bg-[#A8B5A4]`).
- Components handle structure and layout only. Use semantic HTML and keep visual variants (sizes, states) as props, not one off styles.
- Accessibility and responsiveness are not deferred. They are required now.
- Overall visual direction and branding beyond the fonts and colors above: **Undecided**.

## Devices

Phone and desktop are equally important. Every screen must work well on both, including touch interactions.

## Pages and routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/login`, `/signup` | Public | Auth |
| `/dashboard` | Logged in | Home after login |
| `/wardrobe` | Logged in | Browse, filter, sort clothing |
| `/wardrobe/new` | Logged in | Add a clothing item |
| `/wardrobe/:id` | Logged in | View and edit an item |
| `/outfits` | Logged in | Browse, filter, sort outfits |
| `/outfits/new` | Logged in | Outfit builder (manual or agent) |
| `/outfits/:id` | Logged in | View and edit a saved outfit |
| `/account` | Logged in | Profile and settings |

Route names are a starting point, not final.

### Global layout
- Header on every logged in page, with the account menu in the **top right** (profile photo or initials, links to account, settings, logout).
- Main navigation to Dashboard, Wardrobe, Outfits.

### Landing page
- Public. Visually related to the dashboard layout.
- Leaning toward an artistic page rather than a standard marketing page. Exact content: **Undecided**.

### Dashboard
- Contents beyond navigation: **Undecided**. Build it as a layout that can hold widgets later (for example recent outfits or a wardrobe summary).

## Wardrobe

### Adding clothes
Three ways to add an item:
1. **Manual entry** with a photo upload.
2. **Phone camera** capture (same form as upload, using the device camera).
3. **Web search**: find the item online and use its photo. The input format (brand plus item name, free text, etc.) and whether the user picks from multiple image results are **Undecided**. This needs a backend service later; for Stage 0, mock the results.

### Clothing item fields
- Photo(s) and image source (upload, camera, web)
- Name
- Piece type (for example top, bottom, shoes, outerwear, accessory)
- Colors (multiple allowed)
- Styles (multiple allowed)
- Custom tags (multiple allowed)
- Brand, size, season(s), price, where bought
- Times worn
- Notes
- Collections it belongs to
- Created and updated dates

Tags, colors, styles, and piece types should be maximally flexible: users can pick from suggestions (kept in `config/`) or create their own. Any field may be trimmed later, so keep the form easy to change.

### Organizing
- User created **collections** (for example "work", "summer") that items can belong to. Whether outfits also use collections: **Undecided**.
- **Filtering**: combine multiple filters at once (for example black AND tops AND streetwear) across any item field.
- **Sorting**: by multiple fields.

## Outfits

### Outfit fields
- Name, description, theme
- Clothing items included, with their position, size, and layer order on the canvas
- Creation method: manual or agent
- Created and updated dates
- Inspo image (if agent made)
- Comments or refinement notes (agent flow)
- Wear history (dates worn): **Undecided**

Outfits are editable after saving.

### Manual builder
- A free canvas where users drag clothing items from their wardrobe and arrange them.
- Must work on touch. How the builder adapts on small screens (for example a picker drawer, snap zones, or a simplified layout) is open: propose options before building.

### Agent builder
1. User uploads an inspo picture.
2. User chooses the source: **only clothes they own**, or **also suggest pieces they don't have**.
3. The agent returns an outfit in one shot (not a chat).
4. User can modify the result on the canvas and add comments to refine it.

The agent itself is a backend concern. For Stage 0, mock its response in `services/`.

### Organizing
Same filtering and sorting capabilities as the wardrobe.

## Account

Name, email, profile photo, sizes, style preferences, settings, logout.

## Open questions

- Web search: input format and result selection
- Landing page content and style
- Dashboard contents
- Wear history on outfits
- Collections for outfits
- Visual direction beyond fonts and colors
- State management, data fetching, and testing libraries