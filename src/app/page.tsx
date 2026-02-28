'use client'
import { useState, useMemo, useCallback } from 'react'
import { Platform, Market } from '@/lib/types'
import { useMarkets } from '@/hooks/useMarkets'
import { useOrderbook } from '@/hooks/useOrderbook'
import { useIsMobile } from '@/hooks/useIsMobile'
import HUD from '@/components/HUD'
import PlatformTabs from '@/components/PlatformTabs'
import MarketSelector from '@/components/MarketSelector'
import SceneShell from '@/components/SceneShell'
import DepthPanel from '@/components/DepthPanel'
import EducationalOverlay from '@/components/EducationalOverlay'
import Disclaimer from '@/components/Disclaimer'
import MobileDepthView from '@/components/MobileDepthView'

export default function Home() {
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [showEducational, setShowEducational] = useState(false)
  const isMobile = useIsMobile()

  const { markets, loading } = useMarkets(activePlatform === 'all' ? 'all' : activePlatform)

  // Auto-select top 6 markets on first load
  const autoSelected = useMemo(() => {
    if (selectedIds.size > 0 || markets.length === 0) return selectedIds
    const top = new Set(markets.slice(0, 6).map(m => m.id))
    return top
  }, [markets, selectedIds])

  const effectiveSelectedIds = selectedIds.size > 0 ? selectedIds : autoSelected

  // Filter markets by platform for display
  const displayMarkets = useMemo(() => {
    if (activePlatform === 'all') return markets
    return markets.filter(m => m.platform === activePlatform)
  }, [markets, activePlatform])

  // Get selected markets for orderbook fetching
  const selectedMarkets = useMemo(() => {
    return markets.filter(m => effectiveSelectedIds.has(m.id))
  }, [markets, effectiveSelectedIds])

  const { depths, loading: depthLoading } = useOrderbook(selectedMarkets)

  // Platform counts
  const counts = useMemo(() => {
    const c: Record<Platform | 'all', number> = { all: markets.length, polymarket: 0, kalshi: 0, opinion: 0 }
    for (const m of markets) c[m.platform]++
    return c
  }, [markets])

  const handleToggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev.size > 0 ? prev : autoSelected)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [autoSelected])

  const handleSelect = useCallback((id: string) => {
    setFocusedId(prev => prev === id ? null : id)
    // Also select if not already
    if (!effectiveSelectedIds.has(id)) {
      setSelectedIds(prev => {
        const next = new Set(prev.size > 0 ? prev : autoSelected)
        next.add(id)
        return next
      })
    }
  }, [effectiveSelectedIds, autoSelected])

  const focusedMarket = focusedId ? markets.find(m => m.id === focusedId) : null
  const focusedDepth = focusedId ? depths.find(d => d.marketId === focusedId) : null

  // Mobile view
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
        <HUD
          marketCount={markets.length}
          loading={loading || depthLoading}
          showEducational={showEducational}
          onToggleEducational={() => setShowEducational(v => !v)}
        />
        <div className="pt-12 flex-1 overflow-hidden">
          <div className="px-3 py-1">
            <PlatformTabs active={activePlatform} onChange={setActivePlatform} counts={counts} />
          </div>
          <MobileDepthView markets={displayMarkets} depths={depths} />
        </div>
        <EducationalOverlay visible={showEducational} onClose={() => setShowEducational(false)} />
        <Disclaimer />
      </div>
    )
  }

  // Desktop view
  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <HUD
        marketCount={markets.length}
        loading={loading || depthLoading}
        showEducational={showEducational}
        onToggleEducational={() => setShowEducational(v => !v)}
      />

      <div className="flex-1 flex pt-12 overflow-hidden relative">
        {/* Left sidebar - Market selector */}
        <div className="w-72 flex-shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--bg-secondary)] z-10 relative">
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <PlatformTabs active={activePlatform} onChange={setActivePlatform} counts={counts} />
          </div>
          <div className="flex-1 overflow-hidden">
            <MarketSelector
              markets={displayMarkets}
              selectedIds={effectiveSelectedIds}
              onToggle={handleToggle}
              onSelect={handleSelect}
              focusedId={focusedId}
            />
          </div>
        </div>

        {/* Center - 3D scene */}
        <div className="flex-1 min-w-0 relative overflow-hidden">
          {depths.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
              <div className="text-6xl mb-4 opacity-20">📊</div>
              <div className="text-sm">Select markets to visualize depth</div>
              <div className="text-xs mt-1 opacity-60">Check markets in the sidebar to begin</div>
            </div>
          ) : (
            <SceneShell
              depths={depths}
              focusedId={focusedId}
              onSelectMarket={handleSelect}
            />
          )}

          {/* Loading overlay */}
          {loading && depths.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[var(--text-secondary)]">Loading market data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Detail */}
        {focusedMarket && focusedDepth && (
          <div className="fixed top-12 right-0 bottom-0 w-80 border-l border-[var(--border)] bg-[var(--bg-secondary)] animate-slide-in z-20">
            <DepthPanel
              market={focusedMarket}
              depth={focusedDepth}
              onClose={() => setFocusedId(null)}
            />
          </div>
        )}
      </div>

      <EducationalOverlay visible={showEducational} onClose={() => setShowEducational(false)} />
      <Disclaimer />
    </div>
  )
}
