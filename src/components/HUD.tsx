'use client'
import Image from 'next/image'
import { BookOpen, Info } from 'lucide-react'

interface Props {
  marketCount: number
  loading: boolean
  showEducational: boolean
  onToggleEducational: () => void
}

export default function HUD({ marketCount, loading, showEducational, onToggleEducational }: Props) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Title */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image src="/mantl-logo.png" alt="Mantl" width={24} height={24} className="rounded" />
            <h1 className="text-lg font-semibold tracking-tight">
              Mantl
            </h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border)]">
            Research Tool
          </span>
        </div>

        {/* Status + controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-[var(--accent-yellow)] animate-pulse' : 'bg-[var(--bid-green)]'}`} />
            {loading ? 'Updating...' : `${marketCount} markets`}
          </div>

          {/* Learn button */}
          <button
            onClick={onToggleEducational}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              showEducational
                ? 'bg-[var(--accent-blue)] text-white'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Learn
          </button>

          {/* Info */}
          <a
            href="https://docs.polymarket.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Polymarket API documentation"
            className="p-1.5 rounded-lg bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-blue)]"
          >
            <Info className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
