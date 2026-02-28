'use client'
import { MarketDepth } from '@/lib/types'
import { formatVolume, formatPercent, formatSpread } from '@/lib/format'

interface Props {
  depth: MarketDepth
  market: { volume: number; volume24h?: number; liquidity?: number }
}

export default function MarketStats({ depth, market }: Props) {
  const stats = [
    {
      label: 'Midpoint',
      value: formatPercent(depth.orderbook.midpoint),
      color: 'var(--text-primary)',
      tooltip: 'Average of best bid and best ask — represents implied probability',
    },
    {
      label: 'Spread',
      value: formatSpread(depth.orderbook.spread),
      color: depth.orderbook.spread < 0.05 ? 'var(--bid-green)' : 'var(--accent-yellow)',
      tooltip: 'Gap between best bid and best ask — tighter = more liquid',
    },
    {
      label: '24h Volume',
      value: formatVolume(market.volume24h || 0),
      color: 'var(--accent-blue)',
      tooltip: 'Total trading volume in the last 24 hours',
    },
    {
      label: 'Liquidity',
      value: formatVolume(market.liquidity || 0),
      color: 'var(--accent-purple)',
      tooltip: 'Total available liquidity across all price levels',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map(s => (
        <div key={s.label} className="glass-panel-sm px-3 py-2" title={s.tooltip}>
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
          <div className="text-sm font-mono font-semibold mt-0.5" style={{ color: s.color }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  )
}
