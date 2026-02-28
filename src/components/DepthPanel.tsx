'use client'
import { X, ExternalLink, AlertTriangle } from 'lucide-react'
import { Market, MarketDepth, PLATFORM_COLORS } from '@/lib/types'
import DepthChart2D from './DepthChart2D'
import OrderbookTable from './OrderbookTable'
import SpreadGauge from './SpreadGauge'
import MarketStats from './MarketStats'

interface Props {
  market: Market
  depth: MarketDepth
  onClose: () => void
}

export default function DepthPanel({ market, depth, onClose }: Props) {
  const color = PLATFORM_COLORS[market.platform]

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex-1 min-w-0 mr-2">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded uppercase"
              style={{ background: `${color}20`, color }}
            >
              {market.platform}
            </span>
            {depth.isEstimated && (
              <span className="flex items-center gap-1 text-xs text-[var(--accent-yellow)]">
                <AlertTriangle className="w-3 h-3" />
                Estimated
              </span>
            )}
          </div>
          <h2 className="text-sm font-semibold line-clamp-2 leading-tight">{market.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {market.url && (
            <a
              href={market.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
            aria-label="Close panel"
          >
            <X className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3">
        <MarketStats depth={depth} market={market} />
      </div>

      {/* Depth Chart */}
      <div className="px-4 py-2">
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Depth Chart</div>
        <div className="glass-panel-sm p-2">
          <DepthChart2D depth={depth.depth} midpoint={depth.orderbook.midpoint} height={180} />
        </div>
      </div>

      {/* Spread Gauge */}
      <div className="px-4 py-2">
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Spread Analysis</div>
        <div className="glass-panel-sm p-3">
          <SpreadGauge spread={depth.orderbook.spread} midpoint={depth.orderbook.midpoint} />
        </div>
      </div>

      {/* Orderbook */}
      <div className="px-4 py-2 pb-4">
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Order Book</div>
        <div className="glass-panel-sm p-2">
          <OrderbookTable orderbook={depth.orderbook} />
        </div>
      </div>
    </div>
  )
}
