'use client'
import { Platform, PLATFORM_COLORS, PLATFORM_LABELS } from '@/lib/types'

interface Props {
  active: Platform | 'all'
  onChange: (p: Platform | 'all') => void
  counts: Record<Platform | 'all', number>
}

const tabs: (Platform | 'all')[] = ['all', 'polymarket', 'kalshi', 'opinion']

export default function PlatformTabs({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-1" role="tablist">
      {tabs.map(tab => {
        const isActive = active === tab
        const color = tab === 'all' ? '#94a3b8' : PLATFORM_COLORS[tab]
        const label = tab === 'all' ? 'All' : PLATFORM_LABELS[tab]

        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent-blue)]"
            style={{
              background: isActive ? `${color}20` : 'transparent',
              color: isActive ? color : 'var(--text-muted)',
              border: `1px solid ${isActive ? `${color}40` : 'transparent'}`,
            }}
          >
            {label}
            <span className="ml-1 opacity-60">{counts[tab]}</span>
          </button>
        )
      })}
    </div>
  )
}
