'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

export default function GridFloor() {
  const gridSize = 24
  const divisions = 10

  const priceLabels = useMemo(() => {
    const labels: { text: string; x: number }[] = []
    for (let i = 0; i <= 4; i++) {
      const price = i * 25
      const x = (price / 100) * gridSize - gridSize / 2
      labels.push({ text: `${price}¢`, x })
    }
    return labels
  }, [])

  return (
    <group position={[0, -0.1, 0]}>
      {/* Grid */}
      <gridHelper
        args={[gridSize, divisions, new THREE.Color('#1e293b'), new THREE.Color('#1e293b')]}
      />

      {/* Price axis labels */}
      {priceLabels.map((label, i) => (
        <Text
          key={i}
          position={[label.x, 0, gridSize / 2 + 1.5]}
          fontSize={0.5}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}

      {/* Axis labels */}
      <Text
        position={[0, 0, gridSize / 2 + 3]}
        fontSize={0.6}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Price →
      </Text>

      <Text
        position={[-gridSize / 2 - 2, 2, 0]}
        fontSize={0.5}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        ↑ Depth
      </Text>
    </group>
  )
}
