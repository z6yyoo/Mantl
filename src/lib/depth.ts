import { OrderBook, OrderBookEntry, DepthLevel } from './types'

const BUCKET_COUNT = 100

export function normalizeOrderbook(book: OrderBook): DepthLevel[] {
  const levels: DepthLevel[] = []

  // Create 100 price buckets from 0.01 to 1.00
  for (let i = 0; i < BUCKET_COUNT; i++) {
    const price = (i + 1) / BUCKET_COUNT
    levels.push({ price, cumulativeBid: 0, cumulativeAsk: 0 })
  }

  // Cumulative bids: sum of all bid sizes where bid.price >= bucket price
  // (bids are sorted desc by price)
  const sortedBids = [...book.bids].sort((a, b) => b.price - a.price)
  for (let i = BUCKET_COUNT - 1; i >= 0; i--) {
    const bucketPrice = levels[i].price
    let cum = 0
    for (const bid of sortedBids) {
      if (bid.price >= bucketPrice) {
        cum += bid.size
      }
    }
    levels[i].cumulativeBid = cum
  }

  // Cumulative asks: sum of all ask sizes where ask.price <= bucket price
  // (asks are sorted asc by price)
  const sortedAsks = [...book.asks].sort((a, b) => a.price - b.price)
  for (let i = 0; i < BUCKET_COUNT; i++) {
    const bucketPrice = levels[i].price
    let cum = 0
    for (const ask of sortedAsks) {
      if (ask.price <= bucketPrice) {
        cum += ask.size
      }
    }
    levels[i].cumulativeAsk = cum
  }

  return levels
}

export function synthesizeDepthFromPrice(price: number): OrderBook {
  const bid = Math.max(0.01, price - 0.02)
  const ask = Math.min(0.99, price + 0.02)

  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  // Generate synthetic depth levels
  for (let i = 0; i < 5; i++) {
    const bidPrice = Math.max(0.01, bid - i * 0.04)
    const askPrice = Math.min(0.99, ask + i * 0.04)
    const size = 50 + i * 80

    bids.push({ price: bidPrice, size })
    asks.push({ price: askPrice, size })
  }

  return {
    bids: bids.sort((a, b) => b.price - a.price),
    asks: asks.sort((a, b) => a.price - b.price),
    midpoint: price,
    spread: ask - bid,
    timestamp: Date.now(),
  }
}

export function getMaxDepth(levels: DepthLevel[]): number {
  let max = 0
  for (const l of levels) {
    if (l.cumulativeBid > max) max = l.cumulativeBid
    if (l.cumulativeAsk > max) max = l.cumulativeAsk
  }
  return max || 1
}
