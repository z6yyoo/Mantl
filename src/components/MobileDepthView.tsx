'use client'
import { useState } from 'react'
import { ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { Market, MarketDepth, PLATFORM_COLORS } from '@/lib/types'
import { formatPercent, formatVolume, formatSpread } from '@/lib/format'
import DepthChart2D from './DepthChart2D'
import OrderbookTable from './OrderbookTable'
import SpreadGauge from './SpreadGauge'
import MarketStats from './MarketStats'

interface Props {
  markets: Market[]
  depths: MarketDepth[]
}

export default function MobileDepthView({ markets, depths }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const depthMap = new Map(depths.map(d => [d.marketId, d]))
  const selectedMarket = selectedId ? markets.find(m => m.id === selectedId) : null
  const selectedDepth = selectedId ? depthMap.get(selectedId) : null

  if (selectedMarket && selectedDepth) {
    return (
      <div className="h-full overflow-y-auto">
        {/* Back button */}
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-1 px-4 py-3 text-sm text-[var(--accent-blue)] cursor-pointer"
        >
          ← Back to markets
        </button>

        {/* Market info */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded uppercase"
              style={{ background: `${PLATFORM_COLORS[selectedMarket.platform]}20`, color: PLATFORM_COLORS[selectedMarket.platform] }}
            >
              {selectedMarket.platform}
            </span>
            {selectedDepth.isEstimated && (
              <span className="flex items-center gap-1 text-xs text-[var(--accent-yellow)]">
                <AlertTriangle className="w-3 h-3" /> Estimated
              </span>
            )}
          </div>
          <h2 className="text-sm font-semibold">{selectedMarket.title}</h2>
        </div>

        {/* Stats */}
        <div className="px-4 py-2">
          <MarketStats depth={selectedDepth} market={selectedMarket} />
        </div>

        {/* Depth Chart */}
        <div className="px-4 py-2">
          <div className="glass-panel-sm p-2">
            <DepthChart2D depth={selectedDepth.depth} midpoint={selectedDepth.orderbook.midpoint} height={200} />
          </div>
        </div>

        {/* Spread */}
        <div className="px-4 py-2">
          <div className="glass-panel-sm p-3">
            <SpreadGauge spread={selectedDepth.orderbook.spread} midpoint={selectedDepth.orderbook.midpoint} />
          </div>
        </div>

        {/* Orderbook */}
        <div className="px-4 py-2 pb-8">
          <div className="glass-panel-sm p-2">
            <OrderbookTable orderbook={selectedDepth.orderbook} />
          </div>
        </div>
      </div>
    )
  }

  // Market list
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Markets with Depth Data</h2>
      </div>

      {markets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
          <TrendingUp className="w-8 h-8 mb-2 opacity-40" />
          <span className="text-sm">Loading markets...</span>
        </div>
      ) : (
        <div className="px-2 pb-8">
          {markets.map(market => {
            const depth = depthMap.get(market.id)
            const color = PLATFORM_COLORS[market.platform]
            const leadPrice = market.outcomes[0]?.price ?? 0.5

            return (
              <button
                key={market.id}
                onClick={() => setSelectedId(market.id)}
                className="w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg cursor-pointer transition-colors hover:bg-[var(--surface-hover)] border border-[var(--border)]"
              >
                <div className="w-1 h-8 rounded-full" style={{ background: color }} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-medium line-clamp-1">{market.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {formatPercent(leadPrice)}
                    </span>
                    {depth && (
                      <span className="text-xs text-[var(--text-muted)]">
                        Spread: {formatSpread(depth.orderbook.spread)}
                      </span>
                    )}
                    {market.volume24h ? (
                      <span className="text-xs text-[var(--text-muted)]">
                        Vol: {formatVolume(market.volume24h)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
