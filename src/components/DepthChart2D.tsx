'use client'
import { useRef, useEffect } from 'react'
import { DepthLevel } from '@/lib/types'
import { getMaxDepth } from '@/lib/depth'

interface Props {
  depth: DepthLevel[]
  midpoint: number
  height?: number
}

export default function DepthChart2D({ depth, midpoint, height = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || depth.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    const maxD = getMaxDepth(depth)
    const padding = { top: 10, bottom: 24, left: 0, right: 0 }
    const chartW = w - padding.left - padding.right
    const chartH = h - padding.top - padding.bottom

    // Draw bid area (green, from left)
    ctx.beginPath()
    ctx.moveTo(padding.left, h - padding.bottom)
    for (let i = 0; i < depth.length; i++) {
      const x = padding.left + (i / (depth.length - 1)) * chartW
      const y = padding.top + chartH - (depth[i].cumulativeBid / maxD) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.lineTo(padding.left + chartW, h - padding.bottom)
    ctx.lineTo(padding.left, h - padding.bottom)
    ctx.closePath()

    const bidGrad = ctx.createLinearGradient(0, 0, 0, h)
    bidGrad.addColorStop(0, 'rgba(34, 197, 94, 0.4)')
    bidGrad.addColorStop(1, 'rgba(34, 197, 94, 0.05)')
    ctx.fillStyle = bidGrad
    ctx.fill()

    // Bid line
    ctx.beginPath()
    for (let i = 0; i < depth.length; i++) {
      const x = padding.left + (i / (depth.length - 1)) * chartW
      const y = padding.top + chartH - (depth[i].cumulativeBid / maxD) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw ask area (red, from right)
    ctx.beginPath()
    ctx.moveTo(padding.left + chartW, h - padding.bottom)
    for (let i = depth.length - 1; i >= 0; i--) {
      const x = padding.left + (i / (depth.length - 1)) * chartW
      const y = padding.top + chartH - (depth[i].cumulativeAsk / maxD) * chartH
      ctx.lineTo(x, y)
    }
    ctx.lineTo(padding.left, h - padding.bottom)
    ctx.closePath()

    const askGrad = ctx.createLinearGradient(0, 0, 0, h)
    askGrad.addColorStop(0, 'rgba(239, 68, 68, 0.4)')
    askGrad.addColorStop(1, 'rgba(239, 68, 68, 0.05)')
    ctx.fillStyle = askGrad
    ctx.fill()

    // Ask line
    ctx.beginPath()
    for (let i = 0; i < depth.length; i++) {
      const x = padding.left + (i / (depth.length - 1)) * chartW
      const y = padding.top + chartH - (depth[i].cumulativeAsk / maxD) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.stroke()

    // Midpoint line
    const midX = padding.left + midpoint * chartW
    ctx.beginPath()
    ctx.moveTo(midX, padding.top)
    ctx.lineTo(midX, h - padding.bottom)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])

    // Price labels
    ctx.fillStyle = '#7e8fa6'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'
    for (let i = 0; i <= 4; i++) {
      const price = i * 0.25
      const x = padding.left + price * chartW
      ctx.fillText(`${(price * 100).toFixed(0)}¢`, x, h - 4)
    }

    // Midpoint label
    ctx.fillStyle = '#f1f5f9'
    ctx.font = 'bold 12px system-ui'
    ctx.fillText(`${(midpoint * 100).toFixed(1)}¢`, midX, padding.top - 1)
  }, [depth, midpoint, height])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height }}
    />
  )
}
