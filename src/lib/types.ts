export type Platform = 'polymarket' | 'kalshi' | 'opinion'

export interface Market {
  id: string
  platform: Platform
  title: string
  description?: string
  category?: string
  imageUrl?: string
  url?: string
  outcomes: Outcome[]
  volume: number
  volume24h?: number
  liquidity?: number
  collateralCurrency?: 'pUSD' | 'USD'
  status: 'active' | 'closed'
  createdAt?: string
  endDate?: string
  slug?: string
  extra?: Record<string, unknown>
}

export interface Outcome {
  label: string
  price: number
  tokenId?: string
}

export interface PolymarketEvent {
  id: string | number
  title?: string
  description?: string
  image?: string
  slug?: string
  volume?: number
  volume24hr?: number
  liquidity?: number
  startDate?: string
  endDate?: string
  markets?: PolymarketRawMarket[]
}

export interface PolymarketRawMarket extends Record<string, unknown> {
  id?: string | number
  question?: string
  groupItemTitle?: string
  outcomes?: string
  outcomePrices?: string
  clobTokenIds?: string
  closed?: boolean
  conditionId?: string
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  polymarket: '#3B82F6',
  kalshi: '#A855F7',
  opinion: '#FACC15',
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  polymarket: 'Polymarket',
  kalshi: 'Kalshi',
  opinion: 'Opinion',
}

export const POLYMARKET_API_ENDPOINTS = {
  gamma: 'https://gamma-api.polymarket.com',
  data: 'https://data-api.polymarket.com',
  clob: 'https://clob.polymarket.com',
} as const

export const POLYMARKET_COLLATERAL_CURRENCY = 'pUSD'

export const REAL_TRADING_ENABLED = false

export const POLYMARKET_TRADING_CONFIG = {
  enabled: REAL_TRADING_ENABLED,
  mode: 'disabled-read-only-viewer',
  collateralCurrency: POLYMARKET_COLLATERAL_CURRENCY,
  clobEndpoint: POLYMARKET_API_ENDPOINTS.clob,
} as const

// Orderbook types
export interface OrderBookEntry {
  price: number // 0.01 to 1.00
  size: number  // quantity at this price level
}

export interface OrderBook {
  bids: OrderBookEntry[] // sorted desc by price
  asks: OrderBookEntry[] // sorted asc by price
  midpoint: number
  spread: number
  timestamp: number
}

export interface DepthLevel {
  price: number           // 0.01 to 1.00
  cumulativeBid: number   // cumulative bid size at this price
  cumulativeAsk: number   // cumulative ask size at this price
}

export interface MarketDepth {
  marketId: string
  platform: Platform
  title: string
  orderbook: OrderBook
  depth: DepthLevel[]
  isEstimated: boolean // true for Kalshi/Opinion (no full orderbook)
}
