import { useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { BUILDING, ROOF_Y } from './layout'
import { getMaterial, materialFor, unitBox, unitCone, unitCylinder, unitSphere } from './materials'
import { useAppStore } from '../state/useAppStore'
import { NameBoard } from './NameBoard'

type Vec3 = [number, number, number]

const WIDTH = BUILDING.maxX - BUILDING.minX
const DEPTH = BUILDING.maxZ - BUILDING.minZ
const GROUND_TOP = BUILDING.groundHeight
const FLOOR_HEIGHT = BUILDING.floorHeight

function Mullions({ baseY, visible }: { baseY: number; visible: boolean }): React.ReactElement | null {
  const mesh = useMemo(() => {
    const transforms: { position: Vec3; scale: Vec3 }[] = []
    for (let x = -15; x <= 15; x += 3) {
      transforms.push({ position: [x, baseY + FLOOR_HEIGHT / 2, -10], scale: [0.12, FLOOR_HEIGHT, 0.12] })
      transforms.push({ position: [x, baseY + FLOOR_HEIGHT / 2, 10], scale: [0.12, FLOOR_HEIGHT, 0.12] })
    }
    for (let z = -7; z <= 7; z += 3.5) {
      transforms.push({ position: [-15, baseY + FLOOR_HEIGHT / 2, z], scale: [0.12, FLOOR_HEIGHT, 0.12] })
      transforms.push({ position: [15, baseY + FLOOR_HEIGHT / 2, z], scale: [0.12, FLOOR_HEIGHT, 0.12] })
    }
    const instanced = new THREE.InstancedMesh(unitBox, getMaterial('creamWall'), transforms.length)
    const dummy = new THREE.Object3D()
    transforms.forEach((t, i) => {
      dummy.position.set(t.position[0], t.position[1], t.position[2])
      dummy.scale.set(t.scale[0], t.scale[1], t.scale[2])
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
    })
    instanced.instanceMatrix.needsUpdate = true
    return instanced
  }, [baseY])
  if (!visible) return null
  return <primitive object={mesh} />
}

function UpperFloor({
  index,
  visible,
  hideCeiling,
  grounded,
}: {
  index: number
  visible: boolean
  hideCeiling: boolean
  /** Single-floor view: the shell is translated down to ground level. */
  grounded: boolean
}): React.ReactElement | null {
  const baseY = GROUND_TOP + (index - 2) * FLOOR_HEIGHT
  if (!visible) return null
  return (
    <group position={[0, grounded ? -baseY : 0, 0]}>
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[0, baseY + 0.18, 0]} scale={[WIDTH + 0.6, 0.36, DEPTH + 0.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[0, baseY + FLOOR_HEIGHT / 2, -10]} scale={[WIDTH, FLOOR_HEIGHT, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[0, baseY + FLOOR_HEIGHT / 2, 10]} scale={[WIDTH, FLOOR_HEIGHT, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[-15, baseY + FLOOR_HEIGHT / 2, 0]} scale={[0.08, FLOOR_HEIGHT, DEPTH]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[15, baseY + FLOOR_HEIGHT / 2, 0]} scale={[0.08, FLOOR_HEIGHT, DEPTH]} />
      {!hideCeiling && (
        <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[0, baseY + FLOOR_HEIGHT - 0.18, 0]} scale={[WIDTH + 0.6, 0.36, DEPTH + 0.6]} />
      )}
      <Mullions baseY={baseY} visible />
    </group>
  )
}

function GroundShell(): React.ReactElement {
  return (
    <group>
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-14.65, 2, -9.65]} scale={[0.7, 4, 0.7]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[14.65, 2, -9.65]} scale={[0.7, 4, 0.7]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-14.65, 2, 9.65]} scale={[0.7, 4, 0.7]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[14.65, 2, 9.65]} scale={[0.7, 4, 0.7]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[0, 2.02, 9.85]} scale={[29, 3.24, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[0, 0.2, 9.7]} scale={[WIDTH, 0.4, 0.6]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[-15, 2.02, 0]} scale={[0.08, 3.24, 19]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[15, 2.02, 0]} scale={[0.08, 3.24, 19]} />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-14.7, 0.2, 0]} scale={[0.6, 0.4, DEPTH]} />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[14.7, 0.2, 0]} scale={[0.6, 0.4, DEPTH]} />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-13, 2, -9.7]} scale={[4, 4, 0.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[3, 0.2, -9.7]} scale={[24, 0.4, 0.6]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[3, 2.02, -9.85]} scale={[24, 3.24, 0.08]} />
      {[-6, -3, 0, 3, 6, 9, 12].map((x) => (
        <mesh key={x} geometry={unitBox} material={getMaterial('creamWall')} position={[x, 2.02, -9.85]} scale={[0.12, 3.24, 0.12]} />
      ))}
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-10, 3.3, -9.7]} scale={[2.6, 1.4, 0.6]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[-10.55, 1.3, -9.85]} scale={[0.9, 2.6, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('glassExterior')} position={[-9.45, 1.3, -9.85]} scale={[0.9, 2.6, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-10, 1.3, -9.85]} scale={[0.08, 2.6, 0.1]} />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[0, 3.82, 0]} scale={[WIDTH + 0.6, 0.36, DEPTH + 0.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-10, 3.1, -11.25]} scale={[5, 0.18, 2.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-10, 2.95, -11.25]} scale={[5, 0.14, 2.6]} />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[-12.2, 1.5, -12.3]} scale={[0.09, 3, 0.09]} />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[-7.8, 1.5, -12.3]} scale={[0.09, 3, 0.09]} />
      <mesh geometry={unitBox} material={getMaterial('stone')} position={[-10, 0.06, -11]} scale={[5, 0.12, 2.4]} receiveShadow />
    </group>
  )
}

function Rooftop(): React.ReactElement {
  return (
    <group position={[0, ROOF_Y, 0]}>
      <mesh geometry={unitBox} material={getMaterial('stone')} position={[0, 0.05, 0]} scale={[27.2, 0.1, 17.2]} receiveShadow />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[8, 1.1, 4]} scale={[0.07, 2.2, 0.07]} castShadow />
      <mesh geometry={unitCone} material={materialFor('#E8823F')} position={[8, 2.5, 4]} scale={[1.7, 0.8, 1.7]} castShadow />
      <mesh geometry={unitCylinder} material={getMaterial('wood')} position={[8, 0.4, 4]} scale={[0.7, 0.8, 0.7]} castShadow />
      <mesh geometry={unitCylinder} material={getMaterial('creamWall')} position={[8, 0.84, 4]} scale={[0.75, 0.06, 0.75]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[6.4, 0.3, 4]} scale={[0.6, 0.6, 0.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[9.6, 0.3, 4]} scale={[0.6, 0.6, 0.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-11, 0.45, -6]} scale={[3, 0.9, 2]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leaf')} position={[-11, 1.15, -6]} scale={[0.7, 0.6, 0.7]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-12.5, 0.4, 7]} scale={[1, 0.8, 1]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leaf')} position={[-12.5, 1.05, 7]} scale={[0.55, 0.55, 0.55]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[12.5, 0.4, 7]} scale={[1, 0.8, 1]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leaf')} position={[12.5, 1.05, 7]} scale={[0.55, 0.55, 0.55]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.55, -8.4]} scale={[27.2, 0.08, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.55, 8.4]} scale={[27.2, 0.08, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-13.6, 0.55, 0]} scale={[0.08, 0.08, 16.8]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[13.6, 0.55, 0]} scale={[0.08, 0.08, 16.8]} />
    </group>
  )
}

export function HQBuilding(): React.ReactElement {
  const floor = useAppStore((s) => s.floor)
  const roofHidden = useAppStore((s) => s.roofHidden)
  const select = useAppStore((s) => s.select)

  const showGroundShell = floor === 1
  const showRoof = floor === 1 && !roofHidden
  // Whole-building view (floor 1) shows every shell with its ceiling. A
  // single-floor view shows only that shell, translated to ground level
  // with no ceiling, so the floor never appears floating and no roof or
  // ceiling slab covers its interior.
  const showUpper = (index: number): boolean => floor === 1 || floor === index

  const handleClick = (e: ThreeEvent<MouseEvent>): void => {
    e.stopPropagation()
    select({ kind: 'building', id: 'hq' })
  }

  return (
    <group onClick={handleClick}>
      {showGroundShell && <GroundShell />}
      {[2, 3].map((index) => (
        <UpperFloor
          key={index}
          index={index}
          visible={showUpper(index)}
          hideCeiling={floor === index}
          grounded={floor === index}
        />
      ))}
      {showRoof && (
        <group>
          <Rooftop />
        </group>
      )}
      {showGroundShell && <NameBoard />}
    </group>
  )
}
