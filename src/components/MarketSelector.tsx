'use client'
import { useState } from 'react'
import { Search, TrendingUp, AlertTriangle } from 'lucide-react'
import { Market, PLATFORM_COLORS } from '@/lib/types'
import { formatPercent, formatVolume } from '@/lib/format'

interface Props {
  markets: Market[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  focusedId: string | null
}

export default function MarketSelector({ markets, selectedIds, onToggle, onSelect, focusedId }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? markets.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    : markets

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative px-3 py-2">
        <label htmlFor="market-search" className="sr-only">Search markets</label>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
        <input
          type="text"
          id="market-search"
          placeholder="Search markets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
        />
      </div>

      {/* Selected count + actions */}
      <div className="flex items-center justify-between px-3 pb-1">
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
          {selectedIds.size} selected · {filtered.length} available
        </span>
        {selectedIds.size > 0 && (
          <button
            onClick={() => {
              for (const m of markets) {
                if (selectedIds.has(m.id)) onToggle(m.id)
              }
            }}
            className="text-xs text-[var(--accent-blue)] hover:underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Market list */}
      <div className="flex-1 overflow-y-auto px-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
            <AlertTriangle className="w-5 h-5 mb-2" />
            <span className="text-xs">No markets found</span>
          </div>
        ) : (
          filtered.map(market => {
            const isSelected = selectedIds.has(market.id)
            const isFocused = focusedId === market.id
            const color = PLATFORM_COLORS[market.platform]
            const leadPrice = market.outcomes[0]?.price ?? 0.5

            return (
              <div
                key={market.id}
                className="mx-1 mb-1 rounded-lg cursor-pointer transition-all"
                style={{
                  background: isFocused
                    ? `${color}15`
                    : isSelected
                    ? 'var(--surface-hover)'
                    : 'transparent',
                  border: `1px solid ${isFocused ? `${color}50` : isSelected ? 'var(--border-bright)' : 'var(--border)'}`,
                }}
              >
                <div
                  className="flex items-start gap-2 px-2.5 py-2"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(market.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(market.id) } }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggle(market.id) }}
                    className="mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
                    style={{
                      borderColor: isSelected ? color : 'var(--border-bright)',
                      background: isSelected ? `${color}30` : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium line-clamp-2 leading-tight text-[var(--text-primary)]">
                      {market.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ background: `${color}20`, color }}
                      >
                        {market.platform}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {formatPercent(leadPrice)}
                      </span>
                      {market.volume24h ? (
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatVolume(market.volume24h)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
