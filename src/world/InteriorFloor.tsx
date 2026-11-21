import { getMaterial, materialFor, unitBox, unitCylinder, unitSphere } from './materials'
import { CEO_CHAIR, CEO_DESK, DESKS, MEETING_CHAIRS, MEETING_TABLE, RECEPTION_DESK, deskChair } from './layout'
import type { DeskSpot } from './layout'
import { useAppStore } from '../state/useAppStore'

type Vec3 = [number, number, number]

function Chair({ position, heading }: { position: Vec3; heading: number }): React.ReactElement {
  return (
    <group position={position} rotation={[0, heading, 0]}>
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.28, 0]} scale={[0.1, 0.28, 0.1]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.46, 0]} scale={[0.5, 0.07, 0.48]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.78, 0.24]} scale={[0.5, 0.55, 0.07]} castShadow />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0, 0.06, 0]} scale={[0.26, 0.05, 0.26]} />
    </group>
  )
}

function Planter({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitCylinder} material={materialFor('#C4574E')} position={[0, 0.3, 0]} scale={[0.42, 0.6, 0.42]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leaf')} position={[0, 0.95, 0]} scale={[0.5, 0.55, 0.5]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leafsoft')} position={[0.25, 1.2, 0.1]} scale={[0.32, 0.32, 0.32]} />
    </group>
  )
}

function Pendant({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0, 0.45, 0]} scale={[0.03, 0.9, 0.03]} />
      <mesh geometry={unitSphere} material={materialFor('#FFE8B0')} position={[0, -0.05, 0]} scale={[0.2, 0.2, 0.2]} />
    </group>
  )
}

function GlassPartition({ position, size, rotationY }: { position: Vec3; size: Vec3; rotationY: number }): React.ReactElement {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('glass')} position={[0, 1.45, 0]} scale={[size[0], 2.7, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.08, 0]} scale={[size[0], 0.16, 0.12]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 2.82, 0]} scale={[size[0], 0.12, 0.12]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-size[0] / 2, 1.45, 0]} scale={[0.1, 2.9, 0.12]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[size[0] / 2, 1.45, 0]} scale={[0.1, 2.9, 0.12]} />
    </group>
  )
}

function Desk({ desk }: { desk: DeskSpot }): React.ReactElement {
  const chair = deskChair(desk)
  const { x, z } = desk
  return (
    <group>
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[x, 0.76, z]} scale={[1.8, 0.08, 1.0]} castShadow receiveShadow />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[x - 0.82, 0.38, z]} scale={[0.08, 0.76, 0.9]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[x + 0.82, 0.38, z]} scale={[0.08, 0.76, 0.9]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[x, 1.02, z - 0.32]} scale={[0.7, 0.45, 0.05]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[x, 1.02, z - 0.28]} scale={[0.62, 0.37, 0.02]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[x, 0.82, z - 0.32]} scale={[0.08, 0.06, 0.2]} />
      <mesh geometry={unitBox} material={getMaterial('white')} position={[x, 0.82, z + 0.1]} scale={[0.5, 0.03, 0.18]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[x + 0.6, 0.92, z + 0.25]} scale={[0.06, 0.22, 0.14]} />
      <mesh geometry={unitSphere} material={materialFor('#FFE8B0')} position={[x + 0.6, 1.04, z + 0.25]} scale={[0.08, 0.08, 0.08]} />
      <Chair position={[chair.x, 0, chair.z]} heading={chair.heading} />
    </group>
  )
}

export function InteriorFloor(): React.ReactElement | null {
  const floor = useAppStore((s) => s.floor)
  if (floor >= 2) return null
  return (
    <group>
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.04, 0]} scale={[29.4, 0.08, 19.4]} receiveShadow />
      <mesh geometry={unitBox} material={materialFor('#E4D5BE')} position={[4, 0.1, -1]} scale={[17, 0.04, 7]} receiveShadow />
      <mesh geometry={unitBox} material={materialFor('#E8823F')} position={[-11, 0.1, 6]} scale={[4.2, 0.04, 3.4]} receiveShadow />
      <mesh geometry={unitBox} material={materialFor('#E4D5BE')} position={[-11, 0.1, -4.2]} scale={[5, 0.04, 3.6]} receiveShadow />

      <group>
        <mesh geometry={unitBox} material={getMaterial('wood')} position={[RECEPTION_DESK.x, 0.55, RECEPTION_DESK.z]} scale={[RECEPTION_DESK.w, 1.1, RECEPTION_DESK.d]} castShadow />
        <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[RECEPTION_DESK.x, 1.14, RECEPTION_DESK.z]} scale={[RECEPTION_DESK.w + 0.2, 0.08, RECEPTION_DESK.d + 0.2]} />
        <mesh geometry={unitBox} material={getMaterial('tang')} position={[RECEPTION_DESK.x, 0.55, RECEPTION_DESK.z - 0.52]} scale={[RECEPTION_DESK.w - 0.6, 0.5, 0.04]} />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-13, 0.35, -3]} scale={[2.8, 0.7, 1.1]} castShadow />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-13, 0.85, -3.45]} scale={[2.8, 0.7, 0.2]} castShadow />
        <mesh geometry={unitBox} material={materialFor('#8FB4D4')} position={[-13, 0.45, -3]} scale={[2.5, 0.12, 0.9]} />
        <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.55, -9.6]} scale={[6, 1.1, 0.5]} castShadow />
        <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[0, 1.14, -9.6]} scale={[6.2, 0.08, 0.6]} />
        <Planter position={[-13.4, 0, -8.4]} />
        <Planter position={[13.4, 0, -8.4]} />
      </group>

      <group>
        <mesh geometry={unitBox} material={getMaterial('wood')} position={[CEO_DESK.x, 0.76, CEO_DESK.z]} scale={[CEO_DESK.w, 0.08, CEO_DESK.d]} castShadow />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[CEO_DESK.x - 1.05, 0.38, CEO_DESK.z]} scale={[0.1, 0.76, 1.1]} />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[CEO_DESK.x + 1.05, 0.38, CEO_DESK.z]} scale={[0.1, 0.76, 1.1]} />
        <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[CEO_DESK.x, 1.05, CEO_DESK.z - 0.35]} scale={[0.8, 0.5, 0.05]} castShadow />
        <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[CEO_DESK.x, 1.05, CEO_DESK.z - 0.31]} scale={[0.72, 0.42, 0.02]} />
        <Chair position={[CEO_CHAIR.x, 0, CEO_CHAIR.z]} heading={CEO_CHAIR.heading} />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-14.05, 1.1, 6.5]} scale={[0.5, 2.2, 3.4]} castShadow />
        {[0.5, 1.1, 1.7].map((y, i) => (
          <mesh key={i} geometry={unitBox} material={getMaterial('wood')} position={[-13.78, y, 6.5]} scale={[0.06, 0.06, 3.2]} />
        ))}
        {[5.4, 6.0, 6.6, 7.2, 7.8].map((z, i) => (
          <mesh
            key={i}
            geometry={unitBox}
            material={materialFor(['#C4574E', '#4E7FA6', '#E8823F', '#4E7A51', '#7A6FB8'][i])}
            position={[-13.8, 0.85, z]}
            scale={[0.3, 0.5, 0.28]}
          />
        ))}
        <Planter position={[-13.4, 0, 8.4]} />
        <GlassPartition position={[-5.6, 0, 7.6]} size={[2.8, 1, 1]} rotationY={Math.PI / 2} />
        <GlassPartition position={[-5.6, 0, 3.7]} size={[1.4, 1, 1]} rotationY={Math.PI / 2} />
      </group>

      <group>
        {DESKS.map((desk) => (
          <Desk key={desk.id} desk={desk} />
        ))}
      </group>

      <group>
        <mesh geometry={unitBox} material={getMaterial('wood')} position={[MEETING_TABLE.x, 0.76, MEETING_TABLE.z]} scale={[MEETING_TABLE.w, 0.08, MEETING_TABLE.d]} castShadow receiveShadow />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[MEETING_TABLE.x - 2.05, 0.38, MEETING_TABLE.z]} scale={[0.1, 0.76, 1.8]} />
        <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[MEETING_TABLE.x + 2.05, 0.38, MEETING_TABLE.z]} scale={[0.1, 0.76, 1.8]} />
        {MEETING_CHAIRS.map((chair, i) => (
          <Chair key={i} position={[chair.x, 0, chair.z]} heading={chair.heading} />
        ))}
        <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[10, 1.6, 9.2]} scale={[3.2, 1.8, 0.08]} castShadow />
        <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[10, 1.6, 9.14]} scale={[3.0, 1.6, 0.04]} />
        <Planter position={[13.4, 0, 8.4]} />
        <GlassPartition position={[6, 0, 7.6]} size={[3.4, 1, 1]} rotationY={Math.PI / 2} />
        <GlassPartition position={[10.7, 0, 4.8]} size={[7.2, 1, 1]} rotationY={0} />
      </group>

      <group>
        <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[14, 1.6, -1]} scale={[0.9, 3.2, 0.2]} />
        <mesh geometry={unitBox} material={getMaterial('glass')} position={[13.95, 1.4, -1]} scale={[0.7, 2.4, 0.06]} />
        <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[14, 3.3, -1]} scale={[0.9, 0.4, 0.2]} />
      </group>

      <Pendant position={[-11, 3.1, -6]} />
      <Pendant position={[4, 3.1, -1]} />
      <Pendant position={[10, 3.1, 7]} />
      <Pendant position={[-11, 3.1, 6]} />
      <pointLight position={[0, 3, 0]} intensity={8} distance={14} decay={2} color="#FFE8C8" />
      <pointLight position={[10, 3, 7]} intensity={6} distance={10} decay={2} color="#FFE8C8" />
    </group>
  )
}
