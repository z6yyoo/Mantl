'use client'
import { X, BookOpen } from 'lucide-react'

interface Props {
  visible: boolean
  onClose: () => void
}

const concepts = [
  {
    term: 'Order Book',
    description: 'A list of buy (bid) and sell (ask) orders at different price levels. Shows the available liquidity at each price.',
    color: 'var(--accent-blue)',
  },
  {
    term: 'Bid / Ask',
    description: 'Bids are buy offers (green). Asks are sell offers (red). The gap between the highest bid and lowest ask is the spread.',
    color: 'var(--bid-green)',
  },
  {
    term: 'Spread',
    description: 'The difference between best bid and best ask. Tighter spreads mean more liquid markets with lower trading costs.',
    color: 'var(--accent-yellow)',
  },
  {
    term: 'Depth',
    description: 'Cumulative volume at each price level. The "mountain" height shows how much liquidity exists at or better than that price.',
    color: 'var(--accent-purple)',
  },
  {
    term: 'Midpoint',
    description: 'The midpoint between best bid and best ask. Often used as the "fair" price estimate. In prediction markets, this represents implied probability.',
    color: 'var(--text-primary)',
  },
  {
    term: 'Estimated Depth',
    description: 'Kalshi and Opinion don\'t expose full orderbooks. Their depth displays are synthesized from available bid/ask data and are approximate.',
    color: 'var(--ask-red)',
  },
]

export default function EducationalOverlay({ visible, onClose }: Props) {
  if (!visible) return null

  return (
    <div className="absolute top-14 right-4 z-40 w-80 glass-panel p-4 animate-slide-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-blue)]" />
          <span className="text-sm font-semibold">Key Concepts</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
          aria-label="Close educational panel"
        >
          <X className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>

      <div className="space-y-3">
        {concepts.map(c => (
          <div key={c.term} className="flex gap-2">
            <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: c.color, height: '100%', minHeight: 16 }} />
            <div>
              <div className="text-xs font-semibold" style={{ color: c.color }}>{c.term}</div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">{c.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
