# Frontend Design Brief

Status key: **Decided** = your call, locked in. **Open** = still yours to decide.

---

## 0. Foundation

**Decided**
- Product: a fashion website that works as a digital wardrobe. Users can build and save outfits and get outfit suggestions.
- There is a public landing page in addition to the app itself.
- Aesthetic direction: punk zine collage.

**Open**
- Target audience (19 - 35, any fashin level, casual).
- How much of the zine aesthetic carries from the landing page into the app screens. The landing page can go loud; the wardrobe tools need to stay easy to use. Option: zine landing with a toned down app.

---

## 1. Typography

**Decided**
- Fonts are already chosen.
- Type stays "vanilla": the zine personality comes from backgrounds, icons, and imagery, not the fonts.


---

## 2. Star of the Show

**Decided**
- Punk zine collage aesthetic, expressed through backgrounds and icons.

**What committing to punk zine collage involves**

Pick from this menu; you don't need all of it.

| Element | What it is | Fit for a wardrobe app |
|---|---|---|
| Cut-out photos | Images with rough scissor-cut or torn edges | Strong: clothing items as cut-outs is a natural link to the wardrobe |
| Torn paper edges | Ragged edges on sections, cards, dividers | Section dividers, card edges |
| Photocopy / xerox texture | Grainy, high-contrast, slightly degraded print look | Backgrounds, image filters |
| Halftone dots | Print-style dot patterns in shading | Backgrounds, image treatments |
| Tape, staples, safety pins | Objects "holding" elements onto the page | Pinning outfit items to a board |
| Stickers and stamps | Badge-like labels, rubber stamp marks | Tags, "saved" confirmations, labels |
| Hand-drawn marks | Marker scribbles, circles, arrows, underlines | Annotations, highlighting suggestions |
| Rotation and overlap | Slightly tilted, layered elements breaking the grid | Outfit builder, landing hero |
i dont want to limit i want it to be more pastelle but color is still important almost like spider punks style but with different colors(| Limited palette | Usually black/white paper plus one or two loud spot colors | Sets the overall color system |)

**Assets you will need**
- A texture set: paper, photocopy grain, halftone patterns.
- Torn edge and cut-out shapes (as SVG masks ideally).
- Object graphics: tape, pins, staples, stickers.
- A hand-drawn mark set: arrows, circles, scribbles.
- A way to get clean cut-out clothing images from user uploads (background removal).

**Open**
- Which elements from the menu above you want.
- Asset sourcing: make them yourself (scan real paper, tape, marker drawings), use free packs, or buy licensed packs. Check licenses for commercial use either way.
- Palette: which paper tone and which spot color(s).
- What exactly the hero "star" is on the landing page (for example, a collage of outfit cut-outs, a zine cover layout, an animated pin board).

---

## 3. Visual Rhyming

**Decided**
- Source element: the logo shape (in progress).
- Where it repeats: buttons, icons, cards, image masks, section dividers.

**Open**
- Finalize the logo.
- Which part of the logo shape carries over (outline, a corner, a cut, a mark).
- Whether zine elements (tape, torn edges) also rhyme alongside the logo shape, or the logo shape is the only repeated motif.

---

## 4. Depth

**Decided**
- Depth comes from zine features (layering, paper, texture, shadows under pasted elements).
- Mobile performance is a high priority.

**Performance tradeoffs to decide on**

| Choice | Lighter option | Heavier option |
|---|---|---|
| Torn edges and cut-outs | SVG masks / clip paths | Large transparent PNGs |
| Textures | Small tiled images, CSS noise | Full-screen texture images |
| Image formats | WebP / AVIF | PNG / JPG |
| Layering and tilt | CSS transforms (cheap) | Many stacked filtered layers |
| Blur and glass effects | Avoid | backdrop-filter (costly on mobile) |
| Motion | Few, targeted animations | Continuous parallax and effects |

**Open**
- Which tradeoffs you accept per page (landing page may afford more than the app).
- A performance target, for example a page weight budget or a Lighthouse score to hold.

---

## 5. Opacity Hierarchy

**Decided**
- Three text emphasis levels.

**Open**
- Opacity values vs separate solid colors for each level.
- Whether meeting accessibility contrast standards (WCAG) is a hard requirement. Note: lowered-opacity text on textured or photo backgrounds is where contrast failures happen most, and zine backgrounds are busy by nature.

---

## 6. Exploring Versions

**Open**
- Where you explore: Figma, directly in React, or both.
- How many variations before committing.
- Which dimensions to vary (palette, layout, the star, how loud the collage gets).

---

## Gaps: Things the Guide Does Not Cover

The guide is written for marketing landing pages. For an app, you will also need to decide:

- **Color system**: full palette with roles (background, surface, text, accent, error, success).
- **Spacing and grid**: a spacing scale and layout grid, even if the zine style breaks it on purpose.
- **Component states**: hover, focus, pressed, disabled, loading, error for every interactive element.
- **Empty states**: what a new user sees with zero clothes and zero outfits. A strong place for zine personality.
- **User photo handling**: consistent sizing, aspect ratios, and backgrounds for uploaded clothing photos, since user images will sit inside your collage.
- **Responsive layouts**: how the outfit builder works on a phone vs desktop.
- **Accessibility**: contrast, visible keyboard focus, alt text for clothing images, reduced motion support.
- **Motion**: what animates and when.
- **Iconography**: one consistent icon set, custom zine style or an adapted library.
- **Light / dark mode**: whether you support one or both.
- **Design tokens in code**: how colors, spacing, and type get defined in React (a structural decision for the Decision Gate).