'use client'
import { OrderBook } from '@/lib/types'
import { formatPrice, formatSize } from '@/lib/format'

interface Props {
  orderbook: OrderBook
  maxRows?: number
}

export default function OrderbookTable({ orderbook, maxRows = 8 }: Props) {
  const bids = orderbook.bids.slice(0, maxRows)
  const asks = orderbook.asks.slice(0, maxRows)

  const maxBidSize = Math.max(...bids.map(b => b.size), 1)
  const maxAskSize = Math.max(...asks.map(a => a.size), 1)

  return (
    <div className="text-xs">
      <div className="grid grid-cols-2 gap-px">
        {/* Headers */}
        <div className="flex justify-between px-2 py-1 text-[var(--text-muted)]">
          <span className="font-semibold">Bid Price</span>
          <span className="font-semibold">Size</span>
        </div>
        <div className="flex justify-between px-2 py-1 text-[var(--text-muted)]">
          <span className="font-semibold">Ask Price</span>
          <span className="font-semibold">Size</span>
        </div>

        {/* Rows */}
        {Array.from({ length: maxRows }).map((_, i) => {
          const bid = bids[i]
          const ask = asks[i]
          return (
            <div key={i} className="contents">
              {/* Bid */}
              <div className="relative flex justify-between px-2 py-0.5">
                {bid && (
                  <div
                    className="absolute inset-y-0 right-0 bid-bar"
                    style={{ width: `${(bid.size / maxBidSize) * 100}%` }}
                  />
                )}
                {bid ? (
                  <>
                    <span className="relative text-[var(--bid-green)] font-mono">
                      {formatPrice(bid.price)}
                    </span>
                    <span className="relative text-[var(--text-secondary)] font-mono">
                      {formatSize(bid.size)}
                    </span>
                  </>
                ) : (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </div>

              {/* Ask */}
              <div className="relative flex justify-between px-2 py-0.5">
                {ask && (
                  <div
                    className="absolute inset-y-0 left-0 ask-bar"
                    style={{ width: `${(ask.size / maxAskSize) * 100}%` }}
                  />
                )}
                {ask ? (
                  <>
                    <span className="relative text-[var(--ask-red)] font-mono">
                      {formatPrice(ask.price)}
                    </span>
                    <span className="relative text-[var(--text-secondary)] font-mono">
                      {formatSize(ask.size)}
                    </span>
                  </>
                ) : (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Spread */}
      <div className="flex justify-center items-center gap-2 mt-2 py-1.5 border-t border-[var(--border)]">
        <span className="text-[var(--text-muted)]">Spread</span>
        <span className="font-mono text-[var(--text-primary)]">
          {(orderbook.spread * 100).toFixed(1)}¢
        </span>
        <span className="text-[var(--text-muted)]">
          ({(orderbook.spread / orderbook.midpoint * 100).toFixed(1)}%)
        </span>
      </div>
    </div>
  )
}
