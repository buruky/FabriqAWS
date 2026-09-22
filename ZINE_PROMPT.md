# Zine-ify an Image — AI Prompt Guide

Give this document to any AI along with a source image. It explains how to turn that image into a zine-style collage landing page.

---

## What "zine" means here

A zine aesthetic is raw, tactile, and hand-assembled. Think photocopied punk flyers, cut-and-paste protest posters, layered street bills that have been rained on and torn. The goal is to make a digital page feel like it was physically made — ripped, layered, imperfect.

---

## The core techniques

### 1. Full-bleed background
Use the source image as a full-screen background (`object-cover`, `position: absolute`, `inset: 0`). It should feel like a physical surface — a wall, a floor, a table covered in paper.

### 2. Dark overlay
Add a semi-transparent black layer (`background: rgba(0,0,0,0.4–0.55)`) over the background. This unifies the chaos underneath and makes text readable without killing the texture.

### 3. Torn paper cutouts (grayscale / texture layer)
Scatter 3–5 secondary images that feel like torn paper or peeling posters around the edges and corners. These should:
- Be positioned near edges, slightly cropped off-screen
- Be rotated randomly between -12deg and +12deg
- Use `mix-blend-mode: multiply` if the image has a white/light background (white becomes transparent)
- Use `mix-blend-mode: screen` if the image has a black/dark background (black becomes transparent)
- Have slight `grayscale(0.2–0.4)` so they read as texture, not photos

Good source queries: "torn paper texture", "ripped poster wall", "layered street bills", "peeling paint paper"

### 4. Irregular color pieces (accent layer)
Add 3–5 more images clipped into non-rectangular shapes using `clip-path: polygon(...)`. These should:
- Use jagged, uneven polygon coordinates — avoid right angles and symmetric shapes
- Use `mix-blend-mode: screen` or `color-dodge` to let color bleed through
- Have boosted `saturate(1.3–1.5)` and `contrast(1.1)` so they compete with the busy background
- Be placed mid-page or overlapping the text zone edges, not just corners
- Be at lower opacity (0.5–0.75) so they tint rather than dominate

Good source queries: "paint splash color", "colorful graffiti drips", "vintage magazine collage", "abstract color texture"

### 5. Clip-path shapes that feel hand-cut
Avoid rectangles. Use polygons like:
```
polygon(8% 0%, 94% 3%, 100% 78%, 87% 100%, 5% 91%, 0% 22%)
polygon(0% 10%, 80% 0%, 100% 60%, 95% 100%, 15% 88%, 0% 55%)
polygon(12% 0%, 100% 7%, 92% 88%, 70% 100%, 0% 95%, 3% 40%)
```
The key is that no two adjacent points should be on the same axis, and at least one point should be clearly "wrong" — that's what makes it feel torn rather than designed.

### 6. Hero text
Keep it minimal and stark. Large, bold, tight tracking. White or near-white. No drop shadows — let the contrast do the work. One headline, one short subline, one CTA button. The button should be flat: solid white fill, black text, no border-radius or gradients.

---

## Blend mode reference

| Mode | Use when |
|---|---|
| `multiply` | Image has white/light background you want to vanish |
| `screen` | Image has black/dark background you want to vanish |
| `color-dodge` | You want color to feel luminous and intense |
| `overlay` | You want texture to merge with both light and dark areas |
| `luminosity` | You want shape/tone without color contamination |

---

## Placement logic

- **Corners and edges**: torn paper pieces. Let them bleed off-screen.
- **Mid-left / mid-right**: color accent pieces, rotated, clipped.
- **Center**: hero text only. Keep this zone clear of heavy imagery.
- **Overlapping**: pieces should overlap each other slightly — that's what makes it feel layered rather than arranged.

---

## What to avoid

- Drop shadows or glows — too digital
- Border radius on cutout images — squares with rounded corners look like cards, not paper
- Symmetric placement — if left and right feel balanced, something is wrong
- Too many colors in the accent layer — pick 2–3 hues that clash interestingly
- Readable text in the background image — blur it or bury it under the overlay

---

## Example prompt to give the AI

> Here is a source image. Use it as a full-bleed background for a landing page with a zine aesthetic. Add torn paper texture cutouts around the edges using multiply/screen blend modes. Add 3–4 irregular color-accent pieces using clip-path polygons and screen/color-dodge blending. Keep the center clear for hero text: one bold headline, one short subline, one flat CTA button. The overall feel should be raw, layered, and hand-assembled — like a photocopied flyer or street poster.
