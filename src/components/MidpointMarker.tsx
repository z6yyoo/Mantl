'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLATFORM_COLORS, Platform } from '@/lib/types'

interface Props {
  midpoint: number // 0-1
  isFocused: boolean
  platform: Platform
}

const PLANE_WIDTH = 20

export default function MidpointMarker({ midpoint, isFocused, platform }: Props) {
  const lineRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const x = (midpoint - 0.5) * PLANE_WIDTH
  const color = PLATFORM_COLORS[platform]

  useFrame((_, delta) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.sin(Date.now() * 0.003) * 0.15
    }
  })

  return (
    <group position={[x, 0, 0]}>
      {/* Main line */}
      <mesh ref={lineRef}>
        <boxGeometry args={[0.04, isFocused ? 5 : 3, 1.8]} />
        <meshBasicMaterial color={color} transparent opacity={isFocused ? 0.9 : 0.5} />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef}>
        <boxGeometry args={[0.2, isFocused ? 5 : 3, 1.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}
