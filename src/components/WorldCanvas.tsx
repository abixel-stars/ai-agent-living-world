import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '../state/useAppStore'
import { collides } from '../world/layout'
import { simEngine } from '../simulation/engine'
import { AgentLayer } from '../avatars/AgentLayer'
import { SimulationDriver } from '../simulation/SimulationDriver'
import { Campus } from '../world/Campus'
import { HQBuilding } from '../world/HQBuilding'
import { InteriorFloor } from '../world/InteriorFloor'
import { CameraRig } from '../world/CameraRig'
import { Lighting } from '../world/Lighting'

interface WorldCanvasProps {
  onCreated?: () => void
}

function GroundClickPlane(): React.ReactElement {
  const ownerMoveMode = useAppStore((s) => s.ownerMoveMode)

  const handleClick = (e: ThreeEvent<MouseEvent>): void => {
    if (!ownerMoveMode) return
    e.stopPropagation()
    // Same body radius the engine uses: a blocked point is ignored by the
    // engine, so tell the user instead of staying silent.
    if (collides(e.point.x, e.point.z, 0, 0.35)) {
      useAppStore.getState().pushTicker('Titik itu terhalang, pilih titik lain untuk Abi.', 'info')
      return
    }
    if (simEngine && typeof simEngine.setOwnerDestination === 'function') {
      simEngine.setOwnerDestination(e.point.x, e.point.z)
    }
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} onClick={handleClick}>
      <planeGeometry args={[90, 70]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

export function WorldCanvas({ onCreated }: WorldCanvasProps): React.ReactElement {
  const closePanel = useAppStore((s) => s.closePanel)
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [33, 28, -39], fov: 42, near: 0.5, far: 300 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={onCreated}
      onPointerMissed={() => closePanel()}
    >
      <color attach="background" args={['#EAF2F5']} />
      <fog attach="fog" args={['#EAF2F5', 90, 180]} />
      <Suspense fallback={null}>
        <Lighting />
        <CameraRig />
        <Campus />
        <HQBuilding />
        <InteriorFloor />
        <AgentLayer />
        <SimulationDriver />
        <GroundClickPlane />
      </Suspense>
    </Canvas>
  )
}

export default WorldCanvas
