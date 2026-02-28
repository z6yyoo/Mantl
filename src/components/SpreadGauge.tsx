'use client'

interface Props {
  spread: number // 0 to 1
  midpoint: number
}

export default function SpreadGauge({ spread, midpoint }: Props) {
  const spreadCents = spread * 100
  const quality = spreadCents < 2 ? 'Tight' : spreadCents < 5 ? 'Normal' : spreadCents < 10 ? 'Wide' : 'Very Wide'
  const qualityColor = spreadCents < 2 ? 'var(--bid-green)' : spreadCents < 5 ? 'var(--accent-blue)' : spreadCents < 10 ? 'var(--accent-yellow)' : 'var(--ask-red)'

  const bidEdge = Math.max(0, midpoint - spread / 2)
  const askEdge = Math.min(1, midpoint + spread / 2)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-[var(--text-muted)]" title="How tight the bid-ask spread is — Tight is best for liquidity">Spread Quality</span>
        <span className="font-medium" style={{ color: qualityColor }}>{quality}</span>
      </div>

      {/* Visual gauge */}
      <div className="relative h-6 rounded-md overflow-hidden bg-[var(--bg-tertiary)]" role="progressbar" aria-valuenow={spreadCents} aria-valuemin={0} aria-valuemax={100}>
        {/* Bid zone */}
        <div
          className="absolute inset-y-0 left-0 bg-[var(--bid-green)] opacity-20"
          style={{ width: `${bidEdge * 100}%` }}
        />
        {/* Ask zone */}
        <div
          className="absolute inset-y-0 right-0 bg-[var(--ask-red)] opacity-20"
          style={{ width: `${(1 - askEdge) * 100}%` }}
        />
        {/* Spread gap */}
        <div
          className="absolute inset-y-0 border-x-2"
          style={{
            left: `${bidEdge * 100}%`,
            width: `${spread * 100}%`,
            borderColor: qualityColor,
            background: `${qualityColor}15`,
          }}
        />
        {/* Midpoint marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white opacity-70"
          style={{ left: `${midpoint * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
        <span>0¢</span>
        <span>{spreadCents.toFixed(1)}¢ spread</span>
        <span>100¢</span>
      </div>
    </div>
  )
}
