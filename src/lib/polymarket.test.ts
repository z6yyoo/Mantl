import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  POLYMARKET_COLLATERAL_CURRENCY,
  POLYMARKET_TRADING_CONFIG,
  REAL_TRADING_ENABLED,
  PolymarketEvent,
} from './types'
import { fetchPolymarketViaProxy, normalizePolymarketEvents } from './polymarket'

const sampleEvent: PolymarketEvent = {
  id: 'event-1',
  title: 'Will Mantl ship v2?',
  description: 'Release check',
  image: 'https://example.com/mantl.png',
  slug: 'mantl-v2',
  volume: 5000,
  volume24hr: 900,
  liquidity: 1200,
  startDate: '2026-05-30T00:00:00Z',
  endDate: '2026-06-30T00:00:00Z',
  markets: [
    {
      id: 'market-1',
      question: 'Will Mantl ship v2?',
      outcomes: '["Yes","No"]',
      outcomePrices: '["0.58","0.42"]',
      clobTokenIds: '["yes-token","no-token"]',
      conditionId: 'condition-1',
      closed: false,
    },
  ],
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Polymarket normalization', () => {
  it('normalizes Gamma events with pUSD collateral', () => {
    const markets = normalizePolymarketEvents([sampleEvent])

    expect(markets).toHaveLength(1)
    expect(markets[0]).toMatchObject({
      id: 'event-1',
      platform: 'polymarket',
      title: 'Will Mantl ship v2?',
      collateralCurrency: POLYMARKET_COLLATERAL_CURRENCY,
    })
    expect(markets[0].outcomes[0]).toMatchObject({
      label: 'Yes',
      price: 0.58,
      tokenId: 'yes-token',
    })
  })

  it('fetches through the local Gamma proxy and keeps real trading disabled', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [sampleEvent],
    } as Response)

    const markets = await fetchPolymarketViaProxy(1, 0)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/polymarket?endpoint=events&active=true&closed=false&limit=1&offset=0&order=volume24hr&ascending=false',
    )
    expect(markets[0].collateralCurrency).toBe('pUSD')
    expect(REAL_TRADING_ENABLED).toBe(false)
    expect(POLYMARKET_TRADING_CONFIG.enabled).toBe(false)
  })
})
