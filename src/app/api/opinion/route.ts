import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://proxy.opinion.trade:8443/api/bsc/api/v2'
const VALID_ENDPOINTS = ['topic']

const cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 30_000

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const endpoint = params.get('endpoint')

  if (!endpoint || !VALID_ENDPOINTS.includes(endpoint)) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
  }

  const query = new URLSearchParams()
  params.forEach((value, key) => {
    if (key !== 'endpoint') query.set(key, value)
  })

  const url = `${BASE}/${endpoint}?${query.toString()}`

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
        { error: `Upstream ${res.status}` },
        { status: res.status }
      )
    }
    const data = await res.json()

    if (data.errno !== 0) {
      return NextResponse.json(
        { error: data.errmsg || 'Opinion API error' },
        { status: 502 }
      )
    }

    cache.set(url, { data, ts: Date.now() })

    if (cache.size > 100) {
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
