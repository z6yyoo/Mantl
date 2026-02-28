'use client'
import { MarketDepth } from '@/lib/types'
import { getMaxDepth } from '@/lib/depth'
import TerrainRow from './TerrainRow'
import MidpointMarker from './MidpointMarker'

interface Props {
  depths: MarketDepth[]
  focusedId: string | null
  onSelectMarket: (id: string) => void
}

export default function DepthTerrain({ depths, focusedId, onSelectMarket }: Props) {
  // Calculate global max depth for consistent scaling
  const globalMaxDepth = depths.reduce((max, d) => {
    const localMax = getMaxDepth(d.depth)
    return localMax > max ? localMax : max
  }, 1)

  const rowSpacing = 3
  const startZ = ((depths.length - 1) * rowSpacing) / 2

  return (
    <group>
      {depths.map((depth, index) => {
        const z = startZ - index * rowSpacing
        const isFocused = focusedId === depth.marketId

        return (
          <group key={depth.marketId} position={[0, 0, z]}>
            <TerrainRow
              depth={depth}
              globalMaxDepth={globalMaxDepth}
              isFocused={isFocused}
              onClick={() => onSelectMarket(depth.marketId)}
            />
            <MidpointMarker
              midpoint={depth.orderbook.midpoint}
              isFocused={isFocused}
              platform={depth.platform}
            />
          </group>
        )
      })}
    </group>
  )
}
