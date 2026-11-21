import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getMaterial, materialFor, unitBox, unitCylinder, unitSphere } from './materials'

type Vec3 = [number, number, number]

interface Transform {
  position: Vec3
  scale: Vec3
  rotationY?: number
  color?: string
}

function buildInstanced(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  transforms: Transform[],
  castShadow: boolean,
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, transforms.length)
  const dummy = new THREE.Object3D()
  transforms.forEach((t, i) => {
    dummy.position.set(t.position[0], t.position[1], t.position[2])
    dummy.scale.set(t.scale[0], t.scale[1], t.scale[2])
    dummy.rotation.set(0, t.rotationY ?? 0, 0)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    if (t.color) mesh.setColorAt(i, new THREE.Color(t.color))
  })
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  mesh.castShadow = castShadow
  mesh.receiveShadow = false
  return mesh
}

/** Deterministic pseudo random, so the site looks the same on every load. */
function seeded(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

const TREE_POSITIONS: Vec3[] = [
  [-20, 0, -24],
  [20, 0, -12],
  [24, 0, -17],
  [28, 0, -11],
  [-14, 0, -20],
  [14, 0, -24],
  [-24, 0, -20],
  [-36, 0, 12],
  [-36, 0, -16],
  [-20, 0, 16],
  [-8, 0, 18],
  [8, 0, 18],
  [20, 0, 16],
  [34, 0, 14],
  [36, 0, -6],
  [36, 0, 18],
  [-38, 0, 24],
  [30, 0, 24],
]

const BUSH_POSITIONS: Vec3[] = [
  [-16, 0, -6], [-16, 0, 2], [-16, 0, 8], [16, 0, -6], [16, 0, 2], [16, 0, 8],
  [-6, 0, 11], [0, 0, 11], [6, 0, 11], [-13, 0, -13], [-7, 0, -13],
  [8, 0, -13], [13, 0, -13], [18, 0, -21], [30, 0, -21], [18, 0, -8],
  [30, 0, -8], [-34, 0, -9], [-22, 0, -9], [-34, 0, 9], [-22, 0, 9],
]

const LAMP_POSITIONS: Vec3[] = [
  [-10, 0, -14], [-4, 0, -17.5], [5, 0, -17.5], [11, 0, -15],
  [-19, 0, -13.5], [-27, 0, -9], [24, 0, -9], [0, 0, -24.5],
]

const PATHS: { position: Vec3; size: Vec3 }[] = [
  { position: [-10, 0.03, -13.5], size: [3, 0.06, 5] },
  { position: [-5, 0.03, -16], size: [11, 0.06, 3] },
  { position: [0, 0.03, -20], size: [3, 0.06, 8] },
  { position: [11, 0.03, -15], size: [13, 0.06, 3] },
  { position: [16, 0.03, -14.5], size: [3, 0.06, 3] },
  { position: [-18, 0.03, -12], size: [8, 0.06, 3] },
  { position: [-27, 0.03, -8], size: [3, 0.06, 9] },
]

const CAR_COLORS = ['#E8A0A8', '#8FB4D4', '#E8C84A', '#8FB996', '#D9B8E6', '#F0C49C']
const CAR_POSITIONS: Vec3[] = [
  [-26, 0, -4], [-31, 0, -4], [-26, 0, 1], [-31, 0, 1], [-26, 0, 6], [-31, 0, 6],
]

const FLOWER_COLORS = ['#E8823F', '#D97B9E', '#FFFDF8', '#E8C84A', '#8FB4D4']
const FLOWER_BEDS: { center: Vec3; size: [number, number] }[] = [
  { center: [20, 0, -19], size: [5, 2] },
  { center: [27, 0, -19], size: [4, 2] },
  { center: [23.5, 0, -9.5], size: [5, 2] },
]

const lampMaterial = new THREE.MeshStandardMaterial({
  color: '#FFE8B0',
  emissive: '#FFD98A',
  emissiveIntensity: 1.2,
  roughness: 0.4,
})

function Trees(): React.ReactElement {
  const mesh = useMemo(() => {
    const trunks: Transform[] = TREE_POSITIONS.map((p) => ({
      position: [p[0], 0.8, p[2]],
      scale: [0.18, 1.6, 0.18],
    }))
    const trunkMesh = buildInstanced(unitCylinder, getMaterial('trunk'), trunks, true)
    const canopies: Transform[] = []
    TREE_POSITIONS.forEach((p) => {
      canopies.push({ position: [p[0], 2.4, p[2]], scale: [1.35, 1.35, 1.35] })
      canopies.push({ position: [p[0] + 0.45, 3.0, p[2] + 0.2], scale: [0.95, 0.95, 0.95] })
    })
    const canopyMesh = buildInstanced(unitSphere, getMaterial('leaf'), canopies, true)
    const group = new THREE.Group()
    group.add(trunkMesh)
    group.add(canopyMesh)
    return group
  }, [])
  return <primitive object={mesh} />
}

function Bushes(): React.ReactElement {
  const mesh = useMemo(() => {
    const transforms: Transform[] = BUSH_POSITIONS.map((p, i) => ({
      position: [p[0], 0.32, p[2]],
      scale: [0.62 + (i % 3) * 0.08, 0.42, 0.62 + (i % 3) * 0.08],
    }))
    return buildInstanced(unitSphere, getMaterial('leafsoft'), transforms, true)
  }, [])
  return <primitive object={mesh} />
}

function Flowers(): React.ReactElement {
  const mesh = useMemo(() => {
    const rand = seeded(42)
    const transforms: Transform[] = []
    FLOWER_BEDS.forEach((bed) => {
      for (let i = 0; i < 16; i += 1) {
        const x = bed.center[0] + (rand() - 0.5) * (bed.size[0] - 0.6)
        const z = bed.center[2] + (rand() - 0.5) * (bed.size[1] - 0.6)
        transforms.push({
          position: [x, 0.42, z],
          scale: [0.13, 0.13, 0.13],
          color: FLOWER_COLORS[i % FLOWER_COLORS.length],
        })
      }
    })
    const flowerMesh = buildInstanced(unitSphere, materialFor('#FFFFFF'), transforms, false)
    return flowerMesh
  }, [])
  return <primitive object={mesh} />
}

function Lamps(): React.ReactElement {
  const mesh = useMemo(() => {
    const poles: Transform[] = LAMP_POSITIONS.map((p) => ({
      position: [p[0], 1.5, p[2]],
      scale: [0.09, 3, 0.09],
    }))
    const poleMesh = buildInstanced(unitCylinder, getMaterial('darkMetal'), poles, true)
    const heads: Transform[] = LAMP_POSITIONS.map((p) => ({
      position: [p[0], 3.1, p[2]],
      scale: [0.24, 0.24, 0.24],
    }))
    const headMesh = buildInstanced(unitSphere, lampMaterial, heads, false)
    const group = new THREE.Group()
    group.add(poleMesh)
    group.add(headMesh)
    return group
  }, [])
  return <primitive object={mesh} />
}

function Car({ position, color }: { position: Vec3; color: string }): React.ReactElement {
  const bodyMat = materialFor(color)
  const wheelPositions: Vec3[] = [
    [-0.8, 0.28, -1.35], [0.8, 0.28, -1.35], [-0.8, 0.28, 1.35], [0.8, 0.28, 1.35],
  ]
  return (
    <group position={position}>
      <mesh geometry={unitBox} material={bodyMat} position={[0, 0.55, 0]} scale={[1.8, 0.55, 4.2]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('glass')} position={[0, 1.05, -0.2]} scale={[1.6, 0.5, 2.2]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.32, 0]} scale={[1.7, 0.18, 4.0]} />
      {wheelPositions.map((p, i) => (
        <mesh
          key={i}
          geometry={unitCylinder}
          material={getMaterial('darkMetal')}
          position={p}
          rotation={[0, 0, Math.PI / 2]}
          scale={[0.28, 0.22, 0.28]}
        />
      ))}
    </group>
  )
}

function Bench({ position, rotationY }: { position: Vec3; rotationY: number }): React.ReactElement {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.45, 0]} scale={[1.8, 0.08, 0.55]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.78, -0.26]} scale={[1.8, 0.5, 0.08]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-0.8, 0.22, 0]} scale={[0.08, 0.44, 0.5]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0.8, 0.22, 0]} scale={[0.08, 0.44, 0.5]} />
    </group>
  )
}

function Fountain(): React.ReactElement {
  const waterRef = useRef<THREE.Mesh>(null)
  const topRef = useRef<THREE.Mesh>(null)
  const waterMat = useMemo(() => getMaterial('waterMat').clone(), [])
  useFrame((state, delta) => {
    if (waterRef.current) waterRef.current.rotation.y += delta * 0.4
    if (topRef.current) topRef.current.rotation.y -= delta * 0.6
    waterMat.opacity = 0.68 + 0.12 * Math.sin(state.clock.elapsedTime * 1.4)
  })
  return (
    <group position={[0, 0, -20]}>
      <mesh geometry={unitCylinder} material={getMaterial('stone')} position={[0, 0.3, 0]} scale={[2.4, 0.6, 2.4]} castShadow receiveShadow />
      <mesh geometry={unitCylinder} material={getMaterial('stone')} position={[0, 0.62, 0]} scale={[2.05, 0.1, 2.05]} />
      <mesh ref={waterRef} geometry={unitCylinder} material={waterMat} position={[0, 0.6, 0]} scale={[1.95, 0.06, 1.95]} />
      <mesh geometry={unitCylinder} material={getMaterial('stone')} position={[0, 0.9, 0]} scale={[0.32, 0.7, 0.32]} castShadow />
      <mesh geometry={unitCylinder} material={getMaterial('stone')} position={[0, 1.3, 0]} scale={[0.85, 0.14, 0.85]} />
      <mesh ref={topRef} geometry={unitCylinder} material={waterMat} position={[0, 1.4, 0]} scale={[0.7, 0.05, 0.7]} />
      <mesh geometry={unitSphere} material={getMaterial('stone')} position={[0, 1.55, 0]} scale={[0.22, 0.22, 0.22]} />
    </group>
  )
}

function Fence(): React.ReactElement {
  const posts = useMemo(() => {
    const transforms: Transform[] = []
    for (let x = -43; x <= 43; x += 3) {
      if (x > -12 && x < -8) continue
      transforms.push({ position: [x, 0.55, -32.5], scale: [0.12, 1.1, 0.12] })
    }
    transforms.push({ position: [-11, 0.7, -32.5], scale: [0.18, 1.4, 0.18] })
    transforms.push({ position: [-9, 0.7, -32.5], scale: [0.18, 1.4, 0.18] })
    return buildInstanced(unitBox, getMaterial('darkMetal'), transforms, false)
  }, [])
  return (
    <group>
      <primitive object={posts} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-27.5, 0.9, -32.5]} scale={[31, 0.08, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[16.5, 0.9, -32.5]} scale={[53, 0.08, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-27.5, 0.5, -32.5]} scale={[31, 0.08, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[16.5, 0.5, -32.5]} scale={[53, 0.08, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-11.9, 0.65, -31.6]} rotation={[0, 0.6, 0]} scale={[1.7, 0.9, 0.06]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-8.1, 0.65, -31.6]} rotation={[0, -0.6, 0]} scale={[1.7, 0.9, 0.06]} />
    </group>
  )
}

export function Campus(): React.ReactElement {
  return (
    <group>
      <mesh geometry={unitBox} material={getMaterial('grass')} position={[0, -0.1, 0]} scale={[90, 0.2, 70]} receiveShadow />
      <mesh geometry={unitBox} material={getMaterial('asphalt')} position={[0, 0.02, -29]} scale={[90, 0.08, 4]} receiveShadow />
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          material={getMaterial('white')}
          position={[-42 + i * 4.4, 0.07, -29]}
          scale={[1.6, 0.02, 0.28]}
        />
      ))}
      <mesh geometry={unitBox} material={getMaterial('stone')} position={[0, 0.04, -20]} scale={[13, 0.08, 9]} receiveShadow />
      {PATHS.map((path, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          material={getMaterial('stone')}
          position={path.position}
          scale={path.size}
          receiveShadow
        />
      ))}
      <mesh geometry={unitBox} material={getMaterial('asphalt')} position={[-28.5, 0.03, 1]} scale={[11, 0.06, 16]} receiveShadow />
      {CAR_POSITIONS.map((p, i) => (
        <Car key={i} position={p} color={CAR_COLORS[i]} />
      ))}
      {FLOWER_BEDS.map((bed, i) => (
        <group key={i}>
          <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[bed.center[0], 0.18, bed.center[2]]} scale={[bed.size[0], 0.36, bed.size[1]]} castShadow />
          <mesh geometry={unitBox} material={getMaterial('soil')} position={[bed.center[0], 0.38, bed.center[2]]} scale={[bed.size[0] - 0.3, 0.08, bed.size[1] - 0.3]} />
        </group>
      ))}
      <Flowers />
      <mesh geometry={unitBox} material={getMaterial('leaf')} position={[18, 0.45, -21]} scale={[6, 0.9, 0.9]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('leaf')} position={[29, 0.45, -21]} scale={[0.9, 0.9, 6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('leaf')} position={[18, 0.45, -8]} scale={[6, 0.9, 0.9]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('leaf')} position={[29, 0.45, -8]} scale={[0.9, 0.9, 6]} castShadow />
      <Bench position={[-6, 0, -20]} rotationY={Math.PI / 2} />
      <Bench position={[6, 0, -20]} rotationY={-Math.PI / 2} />
      <Fountain />
      <Trees />
      <Bushes />
      <Lamps />
      <Fence />
    </group>
  )
}
