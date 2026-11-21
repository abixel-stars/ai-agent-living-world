import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { dayPhase, useAppStore } from '../state/useAppStore'

interface SunTarget {
  position: THREE.Vector3
  color: THREE.Color
  intensity: number
}

const SUN_TARGETS: Record<ReturnType<typeof dayPhase>, SunTarget> = {
  morning: {
    position: new THREE.Vector3(35, 14, -10),
    color: new THREE.Color('#FFD9A8'),
    intensity: 1.6,
  },
  midday: {
    position: new THREE.Vector3(10, 45, -5),
    color: new THREE.Color('#FFF4E0'),
    intensity: 2.0,
  },
  afternoon: {
    position: new THREE.Vector3(-25, 28, -15),
    color: new THREE.Color('#FFD2A0'),
    intensity: 1.7,
  },
  evening: {
    position: new THREE.Vector3(-38, 10, -18),
    color: new THREE.Color('#FF9E6B'),
    intensity: 1.2,
  },
}

export function Lighting(): React.ReactElement {
  const worldMinutes = useAppStore((s) => s.worldMinutes)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const intensityRef = useRef(1.6)
  const phase = dayPhase(worldMinutes)
  const target = useMemo(() => SUN_TARGETS[phase], [phase])

  useFrame((_, delta) => {
    const sun = sunRef.current
    if (!sun) return
    const step = 1 - Math.exp(-delta * 1.5)
    sun.position.lerp(target.position, step)
    sun.color.lerp(target.color, step)
    intensityRef.current += (target.intensity - intensityRef.current) * step
    sun.intensity = intensityRef.current
  })

  return (
    <group>
      <ambientLight intensity={0.55} color="#FFF4E6" />
      <hemisphereLight args={['#C7DCEF', '#D8D0C2', 0.5]} />
      <directionalLight
        ref={sunRef}
        position={[35, 14, -10]}
        intensity={1.6}
        color="#FFD9A8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-8, 3.2, -4]} intensity={10} distance={14} decay={2} color="#FFE8C8" />
      <pointLight position={[6, 3.2, 4]} intensity={10} distance={14} decay={2} color="#FFE8C8" />
    </group>
  )
}
