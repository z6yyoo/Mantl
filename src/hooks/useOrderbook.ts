'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Market, MarketDepth, OrderBook, Platform } from '@/lib/types'
import { normalizeOrderbook, synthesizeDepthFromPrice } from '@/lib/depth'

async function fetchPolymarketOrderbook(tokenId: string): Promise<OrderBook> {
  const res = await fetch(`/api/polymarket?endpoint=book&token_id=${tokenId}`)
  if (!res.ok) throw new Error('Failed to fetch orderbook')
  const data = await res.json()

  const bids = (data.bids || []).map((b: { price: string; size: string }) => ({
    price: parseFloat(b.price),
    size: parseFloat(b.size),
  })).filter((b: { price: number; size: number }) => b.price > 0 && b.size > 0)
    .sort((a: { price: number }, b: { price: number }) => b.price - a.price)

  const asks = (data.asks || []).map((a: { price: string; size: string }) => ({
    price: parseFloat(a.price),
    size: parseFloat(a.size),
  })).filter((a: { price: number; size: number }) => a.price > 0 && a.size > 0)
    .sort((a: { price: number }, b: { price: number }) => a.price - b.price)

  const bestBid = bids[0]?.price ?? 0
  const bestAsk = asks[0]?.price ?? 1
  const midpoint = bids.length > 0 && asks.length > 0 ? (bestBid + bestAsk) / 2 : 0.5
  const spread = asks.length > 0 && bids.length > 0 ? bestAsk - bestBid : 1

  return { bids, asks, midpoint, spread, timestamp: Date.now() }
}

function makeKalshiOrderbook(market: Market): OrderBook {
  const yesPrice = market.outcomes[0]?.price ?? 0.5
  const bid = Math.max(0.01, yesPrice - 0.02)
  const ask = Math.min(0.99, yesPrice + 0.02)

  return {
    bids: [
      { price: bid, size: 100 },
      { price: Math.max(0.01, bid - 0.05), size: 200 },
      { price: Math.max(0.01, bid - 0.10), size: 350 },
      { price: Math.max(0.01, bid - 0.15), size: 500 },
    ],
    asks: [
      { price: ask, size: 100 },
      { price: Math.min(0.99, ask + 0.05), size: 200 },
      { price: Math.min(0.99, ask + 0.10), size: 350 },
      { price: Math.min(0.99, ask + 0.15), size: 500 },
    ],
    midpoint: yesPrice,
    spread: ask - bid,
    timestamp: Date.now(),
  }
}

function makeOpinionOrderbook(market: Market): OrderBook {
  const yesPrice = market.outcomes[0]?.price ?? 0.5
  const bid = Math.max(0.01, yesPrice - 0.03)
  const ask = Math.min(0.99, yesPrice + 0.03)

  return {
    bids: [
      { price: bid, size: 50 },
      { price: Math.max(0.01, bid - 0.08), size: 120 },
      { price: Math.max(0.01, bid - 0.16), size: 200 },
    ],
    asks: [
      { price: ask, size: 50 },
      { price: Math.min(0.99, ask + 0.08), size: 120 },
      { price: Math.min(0.99, ask + 0.16), size: 200 },
    ],
    midpoint: yesPrice,
    spread: ask - bid,
    timestamp: Date.now(),
  }
}

export function useOrderbook(selectedMarkets: Market[]) {
  const [depths, setDepths] = useState<MarketDepth[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevIdsRef = useRef<string>('')

  const fetchDepths = useCallback(async () => {
    if (selectedMarkets.length === 0) {
      setDepths([])
      return
    }

    setLoading(true)

    const results = await Promise.allSettled(
      selectedMarkets.map(async (market): Promise<MarketDepth> => {
        let orderbook: OrderBook
        let isEstimated = false

        if (market.platform === 'polymarket') {
          const tokenId = market.outcomes[0]?.tokenId
          if (tokenId) {
            try {
              orderbook = await fetchPolymarketOrderbook(tokenId)
            } catch {
              orderbook = synthesizeDepthFromPrice(market.outcomes[0]?.price ?? 0.5)
              isEstimated = true
            }
          } else {
            orderbook = synthesizeDepthFromPrice(market.outcomes[0]?.price ?? 0.5)
            isEstimated = true
          }
        } else if (market.platform === 'kalshi') {
          orderbook = makeKalshiOrderbook(market)
          isEstimated = true
        } else {
          orderbook = makeOpinionOrderbook(market)
          isEstimated = true
        }

        return {
          marketId: market.id,
          platform: market.platform,
          title: market.title,
          orderbook,
          depth: normalizeOrderbook(orderbook),
          isEstimated,
        }
      })
    )

    const newDepths: MarketDepth[] = []
    for (const r of results) {
      if (r.status === 'fulfilled') newDepths.push(r.value)
    }

    setDepths(newDepths)
    setLoading(false)
  }, [selectedMarkets])

  useEffect(() => {
    const newIds = selectedMarkets.map(m => m.id).join(',')
    if (newIds !== prevIdsRef.current) {
      prevIdsRef.current = newIds
      fetchDepths()
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    const poll = () => {
      timerRef.current = setTimeout(async () => {
        await fetchDepths()
        poll()
      }, 15000)
    }
    poll()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [fetchDepths, selectedMarkets])

  return { depths, loading, refresh: fetchDepths }
}
