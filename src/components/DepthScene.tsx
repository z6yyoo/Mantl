'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { MarketDepth } from '@/lib/types'
import DepthTerrain from './DepthTerrain'
import GridFloor from './GridFloor'

interface Props {
  depths: MarketDepth[]
  focusedId: string | null
  onSelectMarket: (id: string) => void
}

export default function DepthScene({ depths, focusedId, onSelectMarket }: Props) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#0a0e1a' }}
    >
      <PerspectiveCamera makeDefault position={[0, 12, 22]} fov={55} />
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        minDistance={8}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <pointLight position={[-10, 10, -10]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#a855f7" />

      {/* Fog */}
      <fog attach="fog" args={['#0a0e1a', 25, 60]} />

      {/* Grid floor */}
      <GridFloor />

      {/* Terrain rows */}
      <DepthTerrain
        depths={depths}
        focusedId={focusedId}
        onSelectMarket={onSelectMarket}
      />
    </Canvas>
  )
}
