import { DepthLevel } from './types'
import { getMaxDepth } from './depth'

const SEGMENTS = 99 // 100 vertices along X (price axis)
const MAX_HEIGHT = 6.0

/**
 * Convert depth levels to a heightmap Float32Array for PlaneGeometry vertex displacement.
 * The plane has (SEGMENTS+1) vertices along X and 2 vertices along Z.
 * We displace Y based on cumulative depth.
 */
export function depthToHeightmap(
  levels: DepthLevel[],
  globalMaxDepth: number
): Float32Array {
  const width = SEGMENTS + 1 // 100 vertices
  const heightZ = 2 // 2 rows in Z
  const heights = new Float32Array(width * heightZ)

  const maxD = globalMaxDepth > 0 ? globalMaxDepth : getMaxDepth(levels)

  for (let x = 0; x < width; x++) {
    const levelIdx = Math.min(x, levels.length - 1)
    const level = levels[levelIdx]

    if (!level) continue

    // Height is max of bid and ask at this price level
    const bidH = (level.cumulativeBid / maxD) * MAX_HEIGHT
    const askH = (level.cumulativeAsk / maxD) * MAX_HEIGHT
    const h = Math.max(bidH, askH)

    // Both Z rows get the same height
    heights[x] = h
    heights[width + x] = h
  }

  return heights
}

/**
 * Generate vertex colors for the terrain.
 * Left side (bids) = green, right side (asks) = red, midpoint = platform color.
 */
export function depthToColors(
  levels: DepthLevel[],
  midpoint: number,
  platformColor: [number, number, number]
): Float32Array {
  const width = SEGMENTS + 1
  const heightZ = 2
  const colors = new Float32Array(width * heightZ * 3)

  const bidColor: [number, number, number] = [0.08, 0.85, 0.40] // vivid green
  const askColor: [number, number, number] = [0.96, 0.22, 0.22] // vivid red

  for (let x = 0; x < width; x++) {
    const price = (x + 1) / (width)
    let r: number, g: number, b: number

    const midBucket = midpoint
    const distFromMid = Math.abs(price - midBucket)
    // Sharper transition: color fully saturates at 15% away from midpoint
    const t = Math.min(distFromMid / 0.15, 1)
    // Ease-in for smoother visual
    const tEased = t * t

    if (price < midBucket) {
      // Bid side: platform color at mid → green at edges
      r = platformColor[0] * (1 - tEased) + bidColor[0] * tEased
      g = platformColor[1] * (1 - tEased) + bidColor[1] * tEased
      b = platformColor[2] * (1 - tEased) + bidColor[2] * tEased
    } else {
      // Ask side: platform color at mid → red at edges
      r = platformColor[0] * (1 - tEased) + askColor[0] * tEased
      g = platformColor[1] * (1 - tEased) + askColor[1] * tEased
      b = platformColor[2] * (1 - tEased) + askColor[2] * tEased
    }

    for (let z = 0; z < heightZ; z++) {
      const idx = (z * width + x) * 3
      colors[idx] = r
      colors[idx + 1] = g
      colors[idx + 2] = b
    }
  }

  return colors
}
