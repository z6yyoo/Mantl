import { NextRequest, NextResponse } from 'next/server'

const GAMMA_BASE = 'https://gamma-api.polymarket.com'
const CLOB_BASE = 'https://clob.polymarket.com'

const GAMMA_ENDPOINTS = ['events', 'markets', 'tags']
const CLOB_ENDPOINTS = ['book', 'midpoint', 'price', 'spread']

const cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 15_000 // 15s for orderbook data

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const endpoint = params.get('endpoint')

  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint param' }, { status: 400 })
  }

  const isClob = CLOB_ENDPOINTS.includes(endpoint)
  const isGamma = GAMMA_ENDPOINTS.includes(endpoint)

  if (!isClob && !isGamma) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
  }

  const base = isClob ? CLOB_BASE : GAMMA_BASE
  const query = new URLSearchParams()
  params.forEach((value, key) => {
    if (key !== 'endpoint') query.set(key, value)
  })

  const url = `${base}/${endpoint}${query.toString() ? '?' + query.toString() : ''}`

  // Check cache
  const cached = cache.get(url)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}: ${res.statusText}` },
        { status: res.status }
      )
    }
    const data = await res.json()
    cache.set(url, { data, ts: Date.now() })

    // Evict old entries
    if (cache.size > 200) {
      const now = Date.now()
      for (const [k, v] of cache) {
        if (now - v.ts > CACHE_TTL * 4) cache.delete(k)
      }
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Fetch failed' },
      { status: 502 }
    )
  }
}
