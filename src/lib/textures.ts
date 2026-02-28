export function createGlowTexture(color: string, size = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.4, color + '80')
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return canvas
}

export function createGridTexture(divisions = 10, size = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = 'rgba(10, 14, 26, 0.9)'
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)'
  ctx.lineWidth = 1

  const step = size / divisions
  for (let i = 0; i <= divisions; i++) {
    const pos = i * step
    ctx.beginPath()
    ctx.moveTo(pos, 0)
    ctx.lineTo(pos, size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, pos)
    ctx.lineTo(size, pos)
    ctx.stroke()
  }

  return canvas
}
