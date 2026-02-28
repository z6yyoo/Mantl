'use client'
import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { MarketDepth, PLATFORM_COLORS } from '@/lib/types'
import { depthToHeightmap, depthToColors } from '@/lib/terrain'

interface Props {
  depth: MarketDepth
  globalMaxDepth: number
  isFocused: boolean
  onClick: () => void
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

const SEGMENTS_X = 99
const PLANE_WIDTH = 20
const PLANE_DEPTH = 1.5

export default function TerrainRow({ depth, globalMaxDepth, isFocused, onClick }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)

  const platformColor = hexToRgb(PLATFORM_COLORS[depth.platform])

  const { heights, colors } = useMemo(() => {
    const h = depthToHeightmap(depth.depth, globalMaxDepth)
    const c = depthToColors(depth.depth, depth.orderbook.midpoint, platformColor)
    return { heights: h, colors: c }
  }, [depth, globalMaxDepth, platformColor])

  // Apply vertex displacement after mount
  useEffect(() => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry as THREE.PlaneGeometry
    const posAttr = geo.getAttribute('position')

    // PlaneGeometry is XY by default. We rotate -90 on X, so Y in local → Z in world, and Z in local → -Y in world.
    // But we want to raise the terrain upward (positive Y in world = negative Z in local after rotation).
    // Actually, since we rotate the mesh -PI/2 on X, local Y maps to world -Z and local Z maps to world Y.
    // So we displace local Z to raise in world Y.
    for (let i = 0; i < posAttr.count; i++) {
      const xi = i % (SEGMENTS_X + 1)
      const h = heights[Math.min(xi, heights.length - 1)] || 0
      posAttr.setZ(i, h) // Z in local space → Y in world after rotation
    }
    posAttr.needsUpdate = true
    geo.computeVertexNormals()

    // Set vertex colors
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }, [heights, colors])

  // Smooth scale animation
  useFrame(() => {
    if (!meshRef.current) return
    const target = isFocused ? 1.08 : 1
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, target, 0.08)
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, target, 0.08)
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, target, 0.08)
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[PLANE_WIDTH, PLANE_DEPTH, SEGMENTS_X, 1]} />
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          transparent
          opacity={isFocused ? 1 : 0.75}
          emissive={new THREE.Color(PLATFORM_COLORS[depth.platform])}
          emissiveIntensity={isFocused ? 0.4 : 0.15}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Market label */}
      {isFocused && (
        <Html
          position={[-PLANE_WIDTH / 2 - 1.5, 2, 0]}
          center
          distanceFactor={15}
        >
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 whitespace-nowrap pointer-events-none">
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {depth.title.length > 40 ? depth.title.slice(0, 37) + '...' : depth.title}
            </span>
            {depth.isEstimated && (
              <span className="ml-1.5 text-xs text-[var(--accent-yellow)] font-medium">EST</span>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
