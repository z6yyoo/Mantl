export function formatPrice(price: number): string {
  if (price >= 1) return '$1.00'
  if (price <= 0) return '$0.00'
  return `$${price.toFixed(2)}`
}

export function formatPercent(price: number): string {
  return `${(price * 100).toFixed(1)}%`
}

export function formatVolume(vol: number): string {
  const n = Number(vol)
  if (isNaN(n)) return '$0'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

export function formatSpread(spread: number): string {
  const cents = spread * 100
  if (cents < 1) return `${(cents * 10).toFixed(1)}‰`
  return `${cents.toFixed(1)}¢`
}

export function formatSize(size: number): string {
  if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(1)}M`
  if (size >= 1_000) return `${(size / 1_000).toFixed(1)}K`
  return size.toFixed(0)
}
