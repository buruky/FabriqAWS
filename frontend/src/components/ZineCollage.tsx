import type { CSSProperties } from 'react'
import tornPaperBg from '../assets/zine/torn-paper-bg.jpg'
import cutout1 from '../assets/zine/cutout-1.jpg'
import cutout2 from '../assets/zine/cutout-2.jpg'
import cutout3 from '../assets/zine/cutout-3.jpg'
import cutout4 from '../assets/zine/cutout-4.jpg'
import color1 from '../assets/zine/color-1.jpg'
import color2 from '../assets/zine/color-2.jpg'
import color3 from '../assets/zine/color-3.jpg'
import color4 from '../assets/zine/color-4.jpg'

interface Placement {
  top?: string
  bottom?: string
  left?: string
  right?: string
  width: string
  rotate: string
  opacity: number
}

interface Layer {
  src: string
  blend: 'multiply' | 'screen' | 'color-dodge'
  clip?: string
  /** true = torn-paper texture cutout (desaturated), false = vivid color-accent piece */
  texture?: boolean
  placement: Placement
}

// Torn-paper texture cutouts — bleed off the edges, desaturated so they read
// as paper, not photos. See ZINE_PROMPT.md #3.
const CUTOUTS: Layer[] = [
  {
    src: cutout1,
    blend: 'multiply',
    texture: true,
    placement: { bottom: '-4%', left: '-3%', width: '26vw', rotate: '-7deg', opacity: 0.9 },
  },
  {
    src: cutout2,
    blend: 'screen',
    texture: true,
    placement: { top: '0%', right: '-2%', width: '24vw', rotate: '5deg', opacity: 0.7 },
  },
  {
    src: cutout3,
    blend: 'multiply',
    texture: true,
    placement: { bottom: '8%', right: '2%', width: '22vw', rotate: '-3deg', opacity: 0.85 },
  },
  {
    src: cutout4,
    blend: 'multiply',
    texture: true,
    placement: { top: '6%', left: '2%', width: '18vw', rotate: '11deg', opacity: 0.75 },
  },
]

// Irregular color-accent pieces — jagged clip-paths, saturated, mid-page.
// See ZINE_PROMPT.md #4/#5.
const COLOR_PIECES: Layer[] = [
  {
    src: color1,
    blend: 'screen',
    clip: 'polygon(8% 0%, 94% 3%, 100% 78%, 87% 100%, 5% 91%, 0% 22%)',
    placement: { top: '28%', left: '-6%', width: '28vw', rotate: '-14deg', opacity: 0.75 },
  },
  {
    src: color2,
    blend: 'screen',
    clip: 'polygon(12% 0%, 100% 7%, 92% 88%, 70% 100%, 0% 95%, 3% 40%)',
    placement: { bottom: '12%', left: '30%', width: '18vw', rotate: '9deg', opacity: 0.65 },
  },
  {
    src: color3,
    blend: 'screen',
    clip: 'polygon(0% 10%, 80% 0%, 100% 60%, 95% 100%, 15% 88%, 0% 55%)',
    placement: { top: '15%', right: '22%', width: '16vw', rotate: '-8deg', opacity: 0.6 },
  },
  {
    src: color4,
    blend: 'color-dodge',
    clip: 'polygon(5% 0%, 100% 0%, 95% 70%, 100% 100%, 0% 100%, 2% 30%)',
    placement: { top: '-2%', left: '35%', width: '14vw', rotate: '3deg', opacity: 0.5 },
  },
]

function layerStyle(layer: Layer): CSSProperties {
  return {
    position: 'absolute',
    top: layer.placement.top,
    bottom: layer.placement.bottom,
    left: layer.placement.left,
    right: layer.placement.right,
    width: layer.placement.width,
    opacity: layer.placement.opacity,
    transform: `rotate(${layer.placement.rotate})`,
    mixBlendMode: layer.blend,
    clipPath: layer.clip,
    filter: layer.texture
      ? 'grayscale(0.3) brightness(0.55)'
      : 'saturate(1.4) contrast(1.1) brightness(0.75)',
  }
}

/**
 * Punk-zine collage backdrop: full-bleed torn-paper photo, a dark scrim for
 * legibility, torn-paper texture cutouts bleeding off the edges, and jagged
 * color-accent pieces blended in. Recipe: ZINE_PROMPT.md.
 */
export function ZineCollage() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <img src={tornPaperBg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />

      {CUTOUTS.map((layer, i) => (
        <img key={`cutout-${i}`} src={layer.src} alt="" style={layerStyle(layer)} />
      ))}

      {COLOR_PIECES.map((layer, i) => (
        <img key={`color-${i}`} src={layer.src} alt="" style={layerStyle(layer)} />
      ))}
    </div>
  )
}
