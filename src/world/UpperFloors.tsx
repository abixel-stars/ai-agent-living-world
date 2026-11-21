import { getMaterial, materialFor, unitBox, unitSphere } from './materials'
import {
  DESKS,
  FLOOR_BASE_Y,
  LIFT_SHAFT_SEGMENTS,
  PARTITIONS_BY_FLOOR,
  ROOM_PLANS,
  type RoomPlan,
} from './layout'
import {
  CabinetUnit,
  CoffeeTableUnit,
  ConsoleUnit,
  DeskSet,
  DrawingBoardUnit,
  FocusPodUnit,
  GlassPartitionUnit,
  MeetingTableUnit,
  CeilingLightUnit,
  PlanterUnit,
  RecordingCornerUnit,
  RoundTableUnit,
  RugUnit,
  ScreenWallUnit,
  ServerRackUnit,
  ShelfUnit,
  SofaUnit,
  StatusBoardUnit,
  WhiteboardUnit,
  ChairUnit,
} from './furniture'
import { useAppStore } from '../state/useAppStore'

function PartitionMesh({ segment }: { segment: { x1: number; z1: number; x2: number; z2: number } }): React.ReactElement {
  const dx = segment.x2 - segment.x1
  const dz = segment.z2 - segment.z1
  const length = Math.hypot(dx, dz)
  const horizontal = Math.abs(dz) < 0.01
  return (
    <GlassPartitionUnit
      position={[(segment.x1 + segment.x2) / 2, 0, (segment.z1 + segment.z2) / 2]}
      size={[length, 2.7, 0.08]}
      rotationY={horizontal ? 0 : Math.PI / 2}
    />
  )
}

/** Solid lift shaft: cream walls, door panel facing the hall, indicator light. */
function LiftShaft(): React.ReactElement {
  return (
    <group>
      {LIFT_SHAFT_SEGMENTS.map((s, i) => {
        const dx = s.x2 - s.x1
        const dz = s.z2 - s.z1
        const length = Math.hypot(dx, dz)
        const horizontal = Math.abs(dz) < 0.01
        return (
          <mesh
            key={i}
            geometry={unitBox}
            material={getMaterial('creamWall')}
            position={[(s.x1 + s.x2) / 2, 1.5, (s.z1 + s.z2) / 2]}
            scale={horizontal ? [length, 3.0, 0.15] : [0.15, 3.0, length]}
            castShadow
          />
        )
      })}
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-6.75, 1.1, -6.55]} scale={[1.5, 2.2, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-7.55, 1.1, -6.5]} scale={[0.1, 2.3, 0.12]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-5.95, 1.1, -6.5]} scale={[0.1, 2.3, 0.12]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-6.75, 2.26, -6.5]} scale={[1.7, 0.1, 0.12]} />
      <mesh geometry={unitSphere} material={materialFor('#E8823F')} position={[-6.75, 2.55, -6.5]} scale={[0.09, 0.09, 0.09]} />
    </group>
  )
}

/** Toilet core: solid block with a door panel on the east face. */
function ToiletCore(): React.ReactElement {
  return (
    <group>
      <mesh geometry={unitBox} material={getMaterial('creamWall')} position={[-12.4, 1.5, -7.4]} scale={[3.8, 3.0, 3.8]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-12.4, 0.1, -7.4]} scale={[3.9, 0.2, 3.9]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[-10.46, 1.05, -7.4]} scale={[0.08, 2.1, 0.9]} />
      <mesh geometry={unitBox} material={materialFor('#8FB4D4')} position={[-10.46, 2.5, -7.4]} scale={[0.06, 0.3, 0.7]} />
      <mesh geometry={unitSphere} material={getMaterial('darkMetal')} position={[-10.38, 1.05, -7.05]} scale={[0.05, 0.05, 0.05]} />
    </group>
  )
}

/** Decorative switchback stair mass rising toward the north wall. */
function StairMass(): React.ReactElement {
  const steps: React.ReactElement[] = []
  for (let i = 0; i < 10; i += 1) {
    steps.push(
      <mesh
        key={i}
        geometry={unitBox}
        material={getMaterial('stone')}
        position={[12.4, 0.15 + i * 0.3, -5.4 - i * 0.36]}
        scale={[2.6, 0.3, 0.4]}
        castShadow
      />,
    )
  }
  // Stepped handrails: three level segments following the stair slope.
  const railSegments: Array<[number, number]> = [
    [-5.9, 0.9],
    [-7.0, 1.7],
    [-8.1, 2.5],
  ]
  const posts: Array<[number, number]> = [
    [-5.4, 0.9],
    [-6.5, 1.7],
    [-7.6, 2.5],
    [-8.6, 2.5],
  ]
  return (
    <group>
      {steps}
      <mesh geometry={unitBox} material={getMaterial('stone')} position={[12.4, 3.0, -8.95]} scale={[2.6, 0.3, 0.7]} />
      {[11.15, 13.65].map((x) => (
        <group key={x}>
          {railSegments.map(([z, y]) => (
            <mesh key={z} geometry={unitBox} material={getMaterial('darkMetal')} position={[x, y, z]} scale={[0.06, 0.06, 1.15]} />
          ))}
          {posts.map(([z, h]) => (
            <mesh key={z} geometry={unitBox} material={getMaterial('darkMetal')} position={[x, h / 2, z]} scale={[0.06, h, 0.06]} />
          ))}
        </group>
      ))}
    </group>
  )
}

/** Furniture for one room, laid out to match the colliders in layout.ts. */
function RoomKit({ room }: { room: RoomPlan }): React.ReactElement {
  switch (room.kind) {
    case 'programmer':
      return (
        <group>
          <RugUnit position={[-0.7, 0, -5.5]} w={5.4} d={2.6} color="#E4D5BE" />
          <WhiteboardUnit position={[-0.7, 0, -9.05]} width={3.0} />
          <ShelfUnit position={[2.6, 0, -8.95]} width={1.2} />
          <PlanterUnit position={[-4.0, 0, -3.4]} />
          <CeilingLightUnit position={[-2, 2.6, -6]} />
          <CeilingLightUnit position={[1.5, 2.6, -6]} />
        </group>
      )
    case 'design':
      return (
        <group>
          <RugUnit position={[6.8, 0, -5.5]} w={5.4} d={2.6} color="#E4D5BE" />
          <DrawingBoardUnit position={[9.8, 0, -6.5]} rotationY={-Math.PI / 2} />
          <DrawingBoardUnit position={[9.8, 0, -4.0]} rotationY={-Math.PI / 2} />
          <ShelfUnit position={[4.0, 0, -9.05]} width={1.6} />
          <PlanterUnit position={[3.8, 0, -3.4]} />
          <CeilingLightUnit position={[5.4, 2.6, -6]} />
          <CeilingLightUnit position={[8.2, 2.6, -6]} />
        </group>
      )
    case 'content':
      return (
        <group>
          <RugUnit position={[-8, 0, 4.3]} w={5.4} d={2.6} color="#E4D5BE" />
          <RecordingCornerUnit position={[-12.8, 0, 7.6]} />
          <SofaUnit position={[-4.5, 0, 7.8]} color="#8FB996" />
          <CoffeeTableUnit position={[-4.5, 0, 6.3]} />
          <PlanterUnit position={[-13.8, 0, 3.2]} />
          <CeilingLightUnit position={[-10, 2.6, 4.5]} />
          <CeilingLightUnit position={[-5, 2.6, 4.5]} />
        </group>
      )
    case 'focus':
      return (
        <group>
          <RugUnit position={[6, 0, 4.3]} w={6.0} d={2.6} color="#E4D5BE" />
          <FocusPodUnit position={[1, 0, 6.5]} />
          <FocusPodUnit position={[4.5, 0, 6.5]} />
          <FocusPodUnit position={[8, 0, 6.5]} />
          <SofaUnit position={[11.5, 0, 7.8]} />
          <CoffeeTableUnit position={[11.5, 0, 6.3]} />
          <PlanterUnit position={[13.6, 0, 3.2]} />
          <CeilingLightUnit position={[4, 2.6, 4.5]} />
          <CeilingLightUnit position={[9, 2.6, 4.5]} />
        </group>
      )
    case 'research':
      return (
        <group>
          <RugUnit position={[-0.7, 0, -5.5]} w={5.4} d={2.6} color="#E4D5BE" />
          <ShelfUnit position={[-3.6, 0, -9.05]} width={2.4} />
          <ShelfUnit position={[2.6, 0, -8.95]} width={1.2} />
          <WhiteboardUnit position={[-0.7, 0, -9.05]} width={2.2} />
          <PlanterUnit position={[-4.0, 0, -3.4]} />
          <CeilingLightUnit position={[-2, 2.6, -6]} />
          <CeilingLightUnit position={[1.5, 2.6, -6]} />
        </group>
      )
    case 'marketing':
      return (
        <group>
          <RugUnit position={[6.8, 0, -5.5]} w={5.4} d={2.6} color="#E4D5BE" />
          <StatusBoardUnit position={[9.85, 0, -5.2]} width={2.4} rotationY={-Math.PI / 2} />
          <ShelfUnit position={[4.0, 0, -9.05]} width={1.6} />
          <PlanterUnit position={[3.8, 0, -3.4]} />
          <CeilingLightUnit position={[5.4, 2.6, -6]} />
          <CeilingLightUnit position={[8.2, 2.6, -6]} />
        </group>
      )
    case 'meetingSmall':
      return (
        <group>
          <RugUnit position={[-8, 0, 6.5]} w={5.0} d={3.4} color="#E4D5BE" />
          <MeetingTableUnit position={[-8, 0, 6.5]} w={3.6} d={1.8} chairs={6} />
          <ScreenWallUnit position={[-8, 0, 9.05]} width={3.0} rotationY={Math.PI} />
          <PlanterUnit position={[-13.8, 0, 1.6]} />
          <CeilingLightUnit position={[-8, 2.6, 6.5]} />
        </group>
      )
    case 'hr':
      return (
        <group>
          <RugUnit position={[6, 0, 4.3]} w={5.4} d={2.6} color="#E4D5BE" />
          {[3.0, 3.7, 4.4, 5.1].map((z) => (
            <CabinetUnit key={z} position={[13.7, 0, z]} rotationY={-Math.PI / 2} />
          ))}
          {[6.6, 7.3, 8.0].map((z) => (
            <CabinetUnit key={z} position={[13.7, 0, z]} rotationY={-Math.PI / 2} />
          ))}
          <SofaUnit position={[11.5, 0, 7.8]} color="#8FB996" />
          <CoffeeTableUnit position={[11.5, 0, 6.3]} />
          <PlanterUnit position={[1.0, 0, 8.6]} />
          <CeilingLightUnit position={[4, 2.6, 4.5]} />
          <CeilingLightUnit position={[9, 2.6, 4.5]} />
        </group>
      )
    case 'pm':
      return (
        <group>
          <RugUnit position={[-0.7, 0, -5.5]} w={5.4} d={2.6} color="#E4D5BE" />
          <WhiteboardUnit position={[-0.7, 0, -9.05]} width={3.0} />
          <ShelfUnit position={[2.6, 0, -8.95]} width={1.2} />
          <RoundTableUnit position={[-3.5, 0, -4.3]} />
          <PlanterUnit position={[-4.0, 0, -3.4]} />
          <CeilingLightUnit position={[-2, 2.6, -6]} />
          <CeilingLightUnit position={[1.5, 2.6, -6]} />
        </group>
      )
    case 'meetingLarge':
      return (
        <group>
          <RugUnit position={[6.8, 0, -6.9]} w={6.0} d={3.6} color="#E4D5BE" />
          <MeetingTableUnit position={[6.8, 0, -6.9]} w={4.4} d={2.0} chairs={8} />
          <ScreenWallUnit position={[6.8, 0, -9.05]} width={3.4} rotationY={Math.PI} />
          <PlanterUnit position={[3.8, 0, -3.4]} />
          <CeilingLightUnit position={[5.4, 2.6, -6.9]} />
          <CeilingLightUnit position={[8.2, 2.6, -6.9]} />
        </group>
      )
    case 'library':
      return (
        <group>
          <RugUnit position={[-8, 0, 4.3]} w={6.0} d={3.0} color="#E4D5BE" />
          <ShelfUnit position={[-13.95, 0, 4.5]} width={5.0} rotationY={Math.PI / 2} />
          <ShelfUnit position={[-8, 0, 8.95]} width={5.0} rotationY={Math.PI} />
          <ChairUnit position={[-5.2, 0, 7.2]} heading={0} />
          <ChairUnit position={[-3.6, 0, 7.2]} heading={0} />
          <CoffeeTableUnit position={[-4.4, 0, 7.2]} />
          <PlanterUnit position={[-13.8, 0, 1.6]} />
          <CeilingLightUnit position={[-10, 2.6, 4.5]} />
          <CeilingLightUnit position={[-5, 2.6, 4.5]} />
        </group>
      )
    case 'command':
      return (
        <group>
          <RugUnit position={[3, 0, -5.6]} w={8.0} d={2.4} color="#D8D0C2" />
          <ConsoleUnit position={[-1, 0, -7.4]} />
          <ConsoleUnit position={[3, 0, -7.4]} />
          <ConsoleUnit position={[7, 0, -7.4]} />
          <ScreenWallUnit position={[3, 0, -9.05]} width={5.0} rotationY={Math.PI} />
          <StatusBoardUnit position={[-4.15, 0, -5.2]} width={2.4} rotationY={Math.PI / 2} accent="#4E7FA6" />
          <StatusBoardUnit position={[10.15, 0, -5.2]} width={2.4} rotationY={-Math.PI / 2} />
          <PlanterUnit position={[9.8, 0, -3.4]} />
          <CeilingLightUnit position={[0, 2.6, -5.6]} />
          <CeilingLightUnit position={[6, 2.6, -5.6]} />
        </group>
      )
    case 'server':
      return (
        <group>
          <RugUnit position={[-8, 0, 5.0]} w={3.4} d={6.4} color="#D8D0C2" />
          {[2.2, 4.2, 6.2, 8.2].map((z) => (
            <ServerRackUnit key={`w${z}`} position={[-13.6, 0, z]} rotationY={Math.PI / 2} />
          ))}
          {[2.2, 4.2, 6.2, 8.2].map((z) => (
            <ServerRackUnit key={`e${z}`} position={[-2.9, 0, z]} rotationY={-Math.PI / 2} />
          ))}
          <ScreenWallUnit position={[-8, 0, 9.05]} width={2.4} rotationY={Math.PI} />
          <CeilingLightUnit position={[-8, 2.6, 5.0]} />
        </group>
      )
    case 'lounge':
      return (
        <group>
          <RugUnit position={[6, 0, 6.6]} w={7.0} d={3.4} color="#E4D5BE" />
          <SofaUnit position={[2.5, 0, 7.8]} />
          <SofaUnit position={[9.5, 0, 7.8]} />
          <CoffeeTableUnit position={[6, 0, 6.3]} />
          <PlanterUnit position={[1.0, 0, 1.6]} />
          <PlanterUnit position={[13.6, 0, 1.6]} />
          <CeilingLightUnit position={[3, 2.6, 6.6]} />
          <CeilingLightUnit position={[9, 2.6, 6.6]} />
        </group>
      )
  }
}

/** Detailed interior of one upper floor. In the whole-building view
 *  (floor 1) every upper floor renders at its own height, furnished and
 *  visible through the shell glass. In a single-floor view only the
 *  selected floor renders, translated to ground level, so it never
 *  appears floating. */
function FloorInterior({ floor, grounded }: { floor: number; grounded: boolean }): React.ReactElement {
  const baseY = grounded ? 0 : FLOOR_BASE_Y[floor]
  const rooms = ROOM_PLANS[floor]
  return (
    <group position={[0, baseY, 0]}>
      {/* Floor finish and corridor rug. */}
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.04, 0]} scale={[29.4, 0.08, 19.4]} receiveShadow />
      <mesh geometry={unitBox} material={materialFor('#E4D5BE')} position={[0, 0.09, -1]} scale={[22, 0.04, 1.8]} receiveShadow />
      <mesh geometry={unitBox} material={materialFor('#E4D5BE')} position={[-6.75, 0.09, -4.6]} scale={[4.5, 0.04, 2.2]} receiveShadow />
      <CeilingLightUnit position={[-8, 2.6, -1]} />
      <CeilingLightUnit position={[0, 2.6, -1]} />
      <CeilingLightUnit position={[8, 2.6, -1]} />

      {/* Glass room dividers and door signs. */}
      {PARTITIONS_BY_FLOOR[floor].map((s, i) => (
        <PartitionMesh key={i} segment={s} />
      ))}
      {rooms.map((r) => (
        <mesh key={r.id} geometry={unitBox} material={getMaterial('wood')} position={[r.doorX, 2.62, r.doorZ]} scale={[1.4, 0.16, 0.12]} />
      ))}

      <LiftShaft />
      <ToiletCore />
      <StairMass />

      {rooms.map((r) => (
        <RoomKit key={r.id} room={r} />
      ))}
      <DeskSet desks={DESKS.filter((d) => d.floor === floor).map((d) => ({ x: d.x, z: d.z }))} />
    </group>
  )
}

export function UpperFloors(): React.ReactElement | null {
  const floor = useAppStore((s) => s.floor)
  if (floor < 1 || floor > 3) return null
  if (floor === 1) {
    return (
      <group>
        <FloorInterior floor={2} grounded={false} />
        <FloorInterior floor={3} grounded={false} />
      </group>
    )
  }
  return <FloorInterior floor={floor} grounded />
}
