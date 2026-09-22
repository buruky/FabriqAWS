# Fabriq Frontend Rebuild Spec (React + AWS)

Reference doc for rebuilding Fabriq's frontend from the current Create React App
prototype into a standalone React app backed by AWS. Captures (1) what exists today,
(2) design rules pulled from the two reference clips, and (3) the target stack.
Fill in the AWS section as those decisions get made.

---

## 1. Current State (as of this rebuild's starting point)

### Stack in use today
- **Bundler/runtime:** Create React App (`react-scripts` 5) — no Vite yet, despite `fabriq_project_spec.md` describing Vite
- **React:** 19.1, React Router 7.6
- **Styling:** Tailwind CSS 3, custom component classes in `src/index.css` (`.btn-primary`, `.card`, `.badge`, `.glass`, etc.)
- **Icons:** `@heroicons/react` v1 (outline set)
- **Auth/DB/Storage:** Supabase (`@supabase/supabase-js`)
- **Image hosting:** Cloudinary (`@cloudinary/react`, `@cloudinary/url-gen`)
- **AI outfit generation:** OpenAI API, called from a Vercel serverless function (`api/generate-outfit.js`) — moved out of the client in the most recent commit
- **Local caching:** `idb-keyval`
- **Deployment:** Vercel (frontend + serverless function)

### Routes / pages (`src/pages`)
- `/` → `Landing.jsx` (public)
- `/login`, `/register` → `Login.jsx`, `Register.jsx`
- `/dashboard` → `Dashboard.jsx`
- `/wardrobe` → `Wardrobe.jsx`
- `/outfits` → `Outfits.jsx`, create flow → `OutfitCreate.jsx`, detail → `OutfitDetail.jsx`
- `/generated-outfit` (AI result) → `GeneratedOutfit.jsx`
- `/profile` → `Profile.jsx`
- `Navbar.jsx`, `Home.jsx` also present in `pages/`
- Stray/likely-dead dirs: `src/pages/closet`, `src/pages/goal fit`, `src/components/nothing` — check before porting

### Structure worth keeping
- `hooks/` (`useAuth`, `useClothing`, `useOutfits`) — thin data hooks over `services/`
- `services/` (`api.js`, `auth.js`, `clothing.js`, `cloudinary.js`, `outfits.js`, `supabase.js`) — clean separation of backend calls from components
- `context/UserContext.js` for auth state
- `config/categories.js` — clothing category taxonomy (tops/bottoms/shoes/outerwear/accessories)

### Current design tokens (`tailwind.config.js`, `src/index.css`)
- Palette: sage green primary (`#A8B5A4`), muted olive secondary (`#9CA89B`), golden-yellow accent (`#E8D973`), dark charcoal background (`#1A1D1A`) — "earthy dark mode," **not** the old purple/magenta scheme still described in `fabriq_project_spec.md` (that doc is stale on color)
- Font: Inter for the whole app, **except** the Landing hero (`Landing.jsx`) which hardcodes `Playfair Display` serif for the "FABRIQ." wordmark — inconsistent with the rest of the app
- Buttons/cards/badges use gradients (`bg-gradient-to-r`), glassmorphism (`.glass`, `.glass-dark`, `backdrop-blur-xl`), and `text-gradient` utilities — these directly conflict with the "avoid" list below and should be removed or replaced in the rebuild

---

## 2. Design Rules for the Rebuild

Two reference lists dictate what changes. Both are direct instructions for the new build, not suggestions.

### 2.1 Avoid — generic "AI-generated SaaS" look
1. No purple-to-blue gradient anything
2. No gradient hero text (kills `.text-gradient` / `.text-gradient-primary` in current `index.css`)
3. No emojis in headings
4. Don't default to Inter everywhere without deciding on it — pick a deliberate type pairing (see 2.2)
5. No colored-border cards
6. No glassmorphism cards (kills `.glass` / `.glass-dark`)
7. No low-contrast dark mode — current dark theme should be contrast-checked, not assumed fine
8. No "3 icon boxes in a row" feature layout
9. No badge floating above the headline
10. No Lucide icons used indiscriminately everywhere (current app uses Heroicons — stay deliberate about icon choice, don't sprinkle icons for decoration)
11. Don't leave shadcn/ui components untouched/default-styled if shadcn is adopted — restyle to match the brand
12. Fade-in-on-scroll effects — avoid as a default, generic-feeling pattern
13. Cursor-following beam effects — avoid
14. Buttons that just fade on hover — avoid as the only hover treatment; current `.btn-primary` scale+shadow treatment is closer to acceptable but revisit
15. Inconsistent spacing — enforce a real spacing scale (Tailwind's default scale is fine, just use it consistently)
16. Em dashes everywhere in copy — avoid overusing
17. Generic buzzword copy ("elevate your style," "seamless experience," etc.) — write specific, concrete copy
18. Serif italic accents — avoid as a decorative default
19. Space Grotesk + Instrument Serif pairing specifically called out — don't use this exact combo (it's the current "obvious AI pick")
20. Grain-over-gradient texture effects — avoid

### 2.2 Add / do before launch — production readiness
1. Privacy policy page
2. Terms & conditions page
3. All secrets (Supabase service key, OpenAI key, Cloudinary API secret) stay server-side — never in frontend bundle or `VITE_`/`REACT_APP_`-prefixed env vars for anything sensitive. AI generation is already correctly proxied through a serverless function; carry this pattern into AWS (API Gateway/Lambda, not client-side calls)
4. Force HTTPS everywhere (should be default on Vercel/CloudFront/AWS, but verify)
5. Cookie consent banner (if using analytics/tracking cookies)
6. Meta titles + descriptions per route (currently CRA's static `public/index.html` — needs per-route handling, e.g. React Helmet or framework-level metadata if moving to Next.js/Remix)
7. Social preview image (Open Graph / Twitter card image)
8. Favicon (already present at `public/favicon.ico` — confirm it still matches the brand after redesign)
9. Sitemap + `robots.txt` (`public/robots.txt` exists — check it's not blocking everything; add sitemap)
10. Alt text on all images (clothing photos, outfit photos, marketing images)
11. Compress images (Cloudinary already handles this for user-uploaded clothing photos; make sure marketing/static assets are optimized too — `milad-fakurian-...jpg` at repo root and `src/assets/background.jpg` should be checked)
12. Check page load speed (Lighthouse pass before launch)
13. Fix color contrast (ties to avoid-list #7 — audit the dark theme against WCAG AA)
14. Mobile-friendly (current Navbar has a mobile menu; audit all pages, not just nav)
15. Custom 404 page
16. Fix broken links (audit all `Link to=`/`href=` — e.g. `Navbar.jsx` links to `/new-outfit` but the route table elsewhere uses `/outfits/create` per `fabriq_project_spec.md`; reconcile before rebuild)
17. Form validation (login, register, add-item, create-outfit forms)
18. Spam protection (register form, any public contact form — captcha or rate limiting)
19. Set up analytics
20. One clear call to action per page (Landing currently has two nav links and no real CTA in the hero — needs a primary CTA)

---

## 3. Target Architecture (React + AWS)

Decisions below are placeholders reflecting the stated direction (React frontend, AWS
backend) — fill in as choices are finalized.

### Frontend
- **Framework:** React (Vite recommended over CRA — CRA is unmaintained; this is the natural point to switch)
- **Styling:** Tailwind CSS, rebuilt design tokens per §2 (no gradients/glassmorphism)
- **Routing:** React Router (already on v7)
- **State/data:** keep the `hooks/` + `services/` split; swap Supabase client calls for AWS SDK / REST calls to API Gateway
- **Hosting:** S3 + CloudFront (or Amplify Hosting) in place of Vercel

### Backend (AWS) — TBD, sketch only
- **Compute:** API Gateway + Lambda (replaces the current single Vercel serverless function and any future Express backend in `backend/`)
- **Auth:** Cognito (replaces Supabase Auth) — or keep Supabase Auth and only move data/compute to AWS; decide before scaffolding
- **Database:** RDS Postgres (closest match to current Supabase/Postgres schema in `fabriq_project_spec.md` §4) or DynamoDB if moving to NoSQL — current data model (User, ClothingItem, Outfit) is relational and maps directly to RDS
- **File storage:** S3 (replaces Cloudinary) or keep Cloudinary for its image transforms and only move auth/data/AI to AWS
- **Secrets:** stored in Lambda environment config / Secrets Manager, never shipped to the client (per §2.2 #3)
- **AI outfit generation:** Lambda function wrapping the OpenAI call (same shape as current `api/generate-outfit.js`, moved to Lambda)

### Open decisions to resolve before scaffolding
- Keep Supabase for auth/DB, or fully migrate to Cognito/RDS?
- Keep Cloudinary for image handling, or move to S3 + a Lambda-based image pipeline?
- CRA → Vite migration timing (do it as part of this rebuild, not after)
- Resolve the stale route mismatch between `fabriq_project_spec.md` and actual `Navbar.jsx` links before porting routes
