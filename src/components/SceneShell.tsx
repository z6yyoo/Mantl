'use client'
import dynamic from 'next/dynamic'
import { MarketDepth } from '@/lib/types'

const DepthScene = dynamic(() => import('./DepthScene'), { ssr: false })

interface Props {
  depths: MarketDepth[]
  focusedId: string | null
  onSelectMarket: (id: string) => void
}

export default function SceneShell({ depths, focusedId, onSelectMarket }: Props) {
  return (
    <div className="w-full h-full">
      <DepthScene
        depths={depths}
        focusedId={focusedId}
        onSelectMarket={onSelectMarket}
      />
    </div>
  )
}
