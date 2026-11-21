import { getMaterial, materialFor, unitBox, unitCylinder, unitSphere } from './materials'

/** Shared furniture pieces for the upper-floor interiors. Same procedural
 *  geometry style and palette as the ground floor. All pieces sit at local
 *  y = 0; the parent floor group carries the floor base height. */

type Vec3 = [number, number, number]

export function ChairUnit({ position, heading }: { position: Vec3; heading: number }): React.ReactElement {
  return (
    <group position={position} rotation={[0, heading, 0]}>
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.28, 0]} scale={[0.1, 0.28, 0.1]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.46, 0]} scale={[0.5, 0.07, 0.48]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.78, 0.24]} scale={[0.5, 0.55, 0.07]} castShadow />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0, 0.06, 0]} scale={[0.26, 0.05, 0.26]} />
    </group>
  )
}

export function PlanterUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitCylinder} material={materialFor('#C4574E')} position={[0, 0.3, 0]} scale={[0.42, 0.6, 0.42]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leaf')} position={[0, 0.95, 0]} scale={[0.5, 0.55, 0.5]} castShadow />
      <mesh geometry={unitSphere} material={getMaterial('leafsoft')} position={[0.25, 1.2, 0.1]} scale={[0.32, 0.32, 0.32]} />
    </group>
  )
}

export function PendantUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0, 0.45, 0]} scale={[0.03, 0.9, 0.03]} />
      <mesh geometry={unitSphere} material={materialFor('#FFE8B0')} position={[0, -0.05, 0]} scale={[0.2, 0.2, 0.2]} />
    </group>
  )
}

/** Flush ceiling light for the upper floors, whose clear height (3.04) is
 *  too low for a pendant cord. */
export function CeilingLightUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0, 0.05, 0]} scale={[0.03, 0.1, 0.03]} />
      <mesh geometry={unitSphere} material={materialFor('#FFE8B0')} position={[0, -0.12, 0]} scale={[0.2, 0.14, 0.2]} />
    </group>
  )
}

export function GlassPartitionUnit({
  position,
  size,
  rotationY,
}: {
  position: Vec3
  size: Vec3
  rotationY: number
}): React.ReactElement {
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

/** Work desk with monitor, keyboard and chair. Same look as the ground floor. */
export function DeskUnit({ x, z }: { x: number; z: number }): React.ReactElement {
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
      <ChairUnit position={[x, 0, z + 1.35]} heading={Math.PI} />
    </group>
  )
}

/** Bookshelf against a wall: frame, three shelves, rows of books. */
export function ShelfUnit({
  position,
  width,
  rotationY = 0,
}: {
  position: Vec3
  width: number
  rotationY?: number
}): React.ReactElement {
  const bookColors = ['#C4574E', '#4E7FA6', '#E8823F', '#4E7A51', '#C99A2E', '#8FB4D4']
  const books: React.ReactElement[] = []
  for (let shelf = 0; shelf < 3; shelf += 1) {
    for (let i = 0; i < 6; i += 1) {
      const bx = -width / 2 + 0.25 + i * ((width - 0.5) / 6)
      books.push(
        <mesh
          key={`${shelf}-${i}`}
          geometry={unitBox}
          material={materialFor(bookColors[(shelf * 6 + i) % bookColors.length])}
          position={[bx, 0.42 + shelf * 0.55, 0.1]}
          scale={[0.16, 0.42, 0.24]}
        />,
      )
    }
  }
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[0, 0.95, 0]} scale={[width, 1.9, 0.32]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.95, 0.18]} scale={[width - 0.16, 1.74, 0.04]} />
      {books}
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.55, 0.2]} scale={[width - 0.16, 0.05, 0.3]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 1.1, 0.2]} scale={[width - 0.16, 0.05, 0.3]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 1.65, 0.2]} scale={[width - 0.16, 0.05, 0.3]} />
    </group>
  )
}

/** Wall-mounted whiteboard with frame and marker tray. */
export function WhiteboardUnit({
  position,
  width,
  rotationY = 0,
}: {
  position: Vec3
  width: number
  rotationY?: number
}): React.ReactElement {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('white')} position={[0, 1.5, 0]} scale={[width, 1.2, 0.06]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[0, 1.5, -0.04]} scale={[width + 0.12, 1.32, 0.04]} />
      <mesh geometry={unitBox} material={materialFor('#4E7FA6')} position={[-width / 4, 1.5, 0.05]} scale={[width / 2.6, 0.04, 0.02]} rotation={[0, 0, 0.1]} />
      <mesh geometry={unitBox} material={materialFor('#C4574E')} position={[width / 5, 1.35, 0.05]} scale={[width / 3.4, 0.04, 0.02]} rotation={[0, 0, -0.08]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.84, 0.08]} scale={[width, 0.06, 0.12]} />
    </group>
  )
}

/** Tilted drawing board on an easel, for the design room. */
export function DrawingBoardUnit({
  position,
  rotationY = 0,
}: {
  position: Vec3
  rotationY?: number
}): React.ReactElement {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-0.45, 0.55, 0]} scale={[0.08, 1.1, 0.08]} rotation={[0.12, 0, 0.18]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[0.45, 0.55, 0]} scale={[0.08, 1.1, 0.08]} rotation={[0.12, 0, -0.18]} />
      <mesh geometry={unitBox} material={getMaterial('white')} position={[0, 1.15, 0.08]} scale={[1.2, 0.9, 0.06]} rotation={[-0.22, 0, 0]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 1.15, 0.03]} scale={[1.32, 1.02, 0.04]} rotation={[-0.22, 0, 0]} />
      <mesh geometry={unitBox} material={materialFor('#E8823F')} position={[-0.25, 1.2, 0.14]} scale={[0.4, 0.3, 0.02]} rotation={[-0.22, 0, 0.2]} />
      <mesh geometry={unitBox} material={materialFor('#4E7FA6')} position={[0.25, 1.05, 0.14]} scale={[0.3, 0.04, 0.02]} rotation={[-0.22, 0, -0.1]} />
    </group>
  )
}

/** Two-seat sofa with cushions. Faces -z when rotationY is 0. */
export function SofaUnit({
  position,
  rotationY = 0,
  color = '#8FB4D4',
}: {
  position: Vec3
  rotationY?: number
  color?: string
}): React.ReactElement {
  const fabric = materialFor(color)
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={fabric} position={[0, 0.28, 0]} scale={[2.4, 0.35, 1.0]} castShadow />
      <mesh geometry={unitBox} material={fabric} position={[0, 0.62, 0.44]} scale={[2.4, 0.7, 0.22]} castShadow />
      <mesh geometry={unitBox} material={fabric} position={[-1.12, 0.55, 0]} scale={[0.22, 0.55, 1.0]} />
      <mesh geometry={unitBox} material={fabric} position={[1.12, 0.55, 0]} scale={[0.22, 0.55, 1.0]} />
      <mesh geometry={unitBox} material={getMaterial('white')} position={[-0.58, 0.5, -0.05]} scale={[1.05, 0.14, 0.85]} />
      <mesh geometry={unitBox} material={getMaterial('white')} position={[0.58, 0.5, -0.05]} scale={[1.05, 0.14, 0.85]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-1.05, 0.06, -0.4]} scale={[0.08, 0.12, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[1.05, 0.06, -0.4]} scale={[0.08, 0.12, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-1.05, 0.06, 0.4]} scale={[0.08, 0.12, 0.08]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[1.05, 0.06, 0.4]} scale={[0.08, 0.12, 0.08]} />
    </group>
  )
}

export function CoffeeTableUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.36, 0]} scale={[1.2, 0.06, 0.6]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-0.5, 0.18, -0.22]} scale={[0.07, 0.36, 0.07]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[0.5, 0.18, -0.22]} scale={[0.07, 0.36, 0.07]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-0.5, 0.18, 0.22]} scale={[0.07, 0.36, 0.07]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[0.5, 0.18, 0.22]} scale={[0.07, 0.36, 0.07]} />
      <mesh geometry={unitCylinder} material={materialFor('#C4574E')} position={[-0.3, 0.46, 0]} scale={[0.09, 0.08, 0.09]} />
    </group>
  )
}

/** Meeting table with chairs on both long sides. */
export function MeetingTableUnit({
  position,
  w,
  d,
  chairs,
}: {
  position: Vec3
  w: number
  d: number
  chairs: number
}): React.ReactElement {
  const per = Math.max(1, Math.floor(chairs / 2))
  const chairXs: number[] = []
  for (let i = 0; i < per; i += 1) {
    chairXs.push(-w / 2 + (i + 0.5) * (w / per))
  }
  return (
    <group position={position}>
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.74, 0]} scale={[w, 0.08, d]} castShadow receiveShadow />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[-w / 2 + 0.15, 0.37, 0]} scale={[0.1, 0.74, d - 0.3]} />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[w / 2 - 0.15, 0.37, 0]} scale={[0.1, 0.74, d - 0.3]} />
      <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[0, 0.8, 0]} scale={[0.5, 0.03, 0.32]} />
      {chairXs.map((cx, i) => (
        <ChairUnit key={`n${i}`} position={[cx, 0, -d / 2 - 0.65]} heading={0} />
      ))}
      {chairXs.map((cx, i) => (
        <ChairUnit key={`s${i}`} position={[cx, 0, d / 2 + 0.65]} heading={Math.PI} />
      ))}
    </group>
  )
}

/** Big wall screen with a glowing face. Faces +z when rotationY is 0. */
export function ScreenWallUnit({
  position,
  width,
  rotationY = 0,
}: {
  position: Vec3
  width: number
  rotationY?: number
}): React.ReactElement {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 1.6, 0]} scale={[width, 1.5, 0.08]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[0, 1.6, 0.06]} scale={[width - 0.16, 1.34, 0.02]} />
      <mesh geometry={unitBox} material={materialFor('#E8823F')} position={[-width / 4, 1.35, 0.08]} scale={[width / 3, 0.05, 0.01]} />
      <mesh geometry={unitBox} material={getMaterial('white')} position={[width / 5, 1.75, 0.08]} scale={[width / 4, 0.05, 0.01]} />
    </group>
  )
}

/** Server rack: dark cabinet with status lights. */
export function ServerRackUnit({
  position,
  rotationY = 0,
}: {
  position: Vec3
  rotationY?: number
}): React.ReactElement {
  const lights = ['#8FB996', '#E8823F', '#8FB4D4', '#8FB996', '#E8823F', '#8FB996']
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 1.05, 0]} scale={[0.8, 2.1, 0.7]} castShadow />
      {[0.45, 0.95, 1.45].map((hy) => (
        <mesh key={hy} geometry={unitBox} material={materialFor('#3A352F')} position={[0, hy, 0.37]} scale={[0.64, 0.36, 0.03]} />
      ))}
      {lights.map((c, i) => (
        <mesh
          key={i}
          geometry={unitSphere}
          material={materialFor(c)}
          position={[-0.24 + (i % 3) * 0.24, 0.45 + Math.floor(i / 3) * 0.5, 0.39]}
          scale={[0.035, 0.035, 0.035]}
        />
      ))}
    </group>
  )
}

/** Command-center console: low desk, wide glowing screen, keyboard. */
export function ConsoleUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 0.72, 0]} scale={[2.2, 0.08, 0.9]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-1.0, 0.36, 0]} scale={[0.08, 0.72, 0.8]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[1.0, 0.36, 0]} scale={[0.08, 0.72, 0.8]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 1.15, -0.32]} scale={[1.7, 0.7, 0.05]} />
      <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[0, 1.15, -0.28]} scale={[1.58, 0.58, 0.02]} />
      <mesh geometry={unitBox} material={materialFor('#E8823F')} position={[-0.4, 1.05, -0.26]} scale={[0.5, 0.05, 0.01]} />
      <mesh geometry={unitBox} material={getMaterial('white')} position={[0, 0.8, 0.12]} scale={[0.7, 0.03, 0.24]} />
      <ChairUnit position={[0, 0, 0.95]} heading={Math.PI} />
    </group>
  )
}

/** Single focus pod: three-sided enclosure, small desk, chair, lamp. */
export function FocusPodUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitBox} material={materialFor('#D8D0C2')} position={[0, 1.0, 0.75]} scale={[1.6, 2.0, 0.08]} castShadow />
      <mesh geometry={unitBox} material={materialFor('#D8D0C2')} position={[-0.76, 1.0, 0]} scale={[0.08, 2.0, 1.5]} />
      <mesh geometry={unitBox} material={materialFor('#D8D0C2')} position={[0.76, 1.0, 0]} scale={[0.08, 2.0, 1.5]} />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.74, 0.45]} scale={[1.2, 0.06, 0.5]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0, 1.0, 0.62]} scale={[0.5, 0.32, 0.04]} />
      <mesh geometry={unitBox} material={getMaterial('emissiveScreen')} position={[0, 1.0, 0.59]} scale={[0.44, 0.26, 0.02]} />
      <ChairUnit position={[0, 0, -0.1]} heading={0} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[0.55, 1.35, 0.6]} scale={[0.05, 0.5, 0.05]} />
      <mesh geometry={unitSphere} material={materialFor('#FFE8B0')} position={[0.55, 1.62, 0.6]} scale={[0.09, 0.09, 0.09]} />
    </group>
  )
}

/** Recording corner: backdrop panel, ring light, tripod camera, mic. */
export function RecordingCornerUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitBox} material={materialFor('#4E7FA6')} position={[0, 1.3, 0.7]} scale={[1.6, 2.6, 0.08]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wood')} position={[0, 0.05, 0.5]} scale={[1.6, 0.1, 0.5]} />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0.9, 1.5, -0.2]} scale={[0.32, 0.06, 0.32]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={unitCylinder} material={materialFor('#FFE8B0')} position={[0.9, 1.5, -0.16]} scale={[0.26, 0.05, 0.26]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0.9, 0.75, -0.2]} scale={[0.04, 1.5, 0.04]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-0.9, 1.15, -0.3]} scale={[0.34, 0.22, 0.24]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-0.9, 0.6, -0.3]} scale={[0.05, 0.9, 0.05]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-1.1, 0.25, -0.3]} scale={[0.05, 0.5, 0.05]} rotation={[0, 0, 0.4]} />
      <mesh geometry={unitBox} material={getMaterial('darkMetal')} position={[-0.7, 0.25, -0.3]} scale={[0.05, 0.5, 0.05]} rotation={[0, 0, -0.4]} />
      <mesh geometry={unitCylinder} material={getMaterial('darkMetal')} position={[0.3, 1.35, -0.4]} scale={[0.05, 0.05, 0.05]} />
      <mesh geometry={unitCylinder} material={materialFor('#2E2A25')} position={[0.3, 1.5, -0.4]} scale={[0.07, 0.18, 0.07]} />
    </group>
  )
}

/** Small round side table with two chairs. */
export function RoundTableUnit({ position }: { position: Vec3 }): React.ReactElement {
  return (
    <group position={position}>
      <mesh geometry={unitCylinder} material={getMaterial('wood')} position={[0, 0.72, 0]} scale={[0.5, 0.06, 0.5]} castShadow />
      <mesh geometry={unitCylinder} material={getMaterial('wooddeep')} position={[0, 0.36, 0]} scale={[0.06, 0.72, 0.06]} />
      <mesh geometry={unitCylinder} material={getMaterial('wooddeep')} position={[0, 0.03, 0]} scale={[0.32, 0.06, 0.32]} />
      <ChairUnit position={[-0.85, 0, 0]} heading={Math.PI / 2} />
      <ChairUnit position={[0.85, 0, 0]} heading={-Math.PI / 2} />
    </group>
  )
}

/** Filing cabinet with drawers. */
export function CabinetUnit({
  position,
  rotationY = 0,
}: {
  position: Vec3
  rotationY?: number
}): React.ReactElement {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={materialFor('#8A8177')} position={[0, 0.65, 0]} scale={[0.6, 1.3, 0.5]} castShadow />
      {[0.3, 0.75, 1.2].map((hy) => (
        <mesh key={hy} geometry={unitBox} material={materialFor('#6F675E')} position={[0, hy, 0.26]} scale={[0.48, 0.3, 0.02]} />
      ))}
      {[0.3, 0.75, 1.2].map((hy) => (
        <mesh key={`h${hy}`} geometry={unitBox} material={getMaterial('darkMetal')} position={[0, hy, 0.29]} scale={[0.18, 0.03, 0.03]} />
      ))}
    </group>
  )
}

/** Wall status board with chart bars. Faces +z when rotationY is 0. */
export function StatusBoardUnit({
  position,
  width,
  rotationY = 0,
  accent = '#E8823F',
}: {
  position: Vec3
  width: number
  rotationY?: number
  accent?: string
}): React.ReactElement {
  const bars = [0.5, 0.8, 0.65, 1.0, 0.75]
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={unitBox} material={getMaterial('white')} position={[0, 1.6, 0]} scale={[width, 1.3, 0.06]} castShadow />
      <mesh geometry={unitBox} material={getMaterial('wooddeep')} position={[0, 1.6, -0.04]} scale={[width + 0.1, 1.4, 0.04]} />
      {bars.map((h, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          material={materialFor(i === 3 ? accent : '#8FB4D4')}
          position={[-width / 2 + 0.3 + i * ((width - 0.6) / 4), 1.15 + h * 0.4, 0.05]}
          scale={[0.18, h * 0.8, 0.02]}
        />
      ))}
      <mesh geometry={unitBox} material={materialFor('#4E7FA6')} position={[0, 1.05, 0.05]} scale={[width - 0.5, 0.03, 0.02]} />
    </group>
  )
}

/** Thin floor rug. */
export function RugUnit({
  position,
  w,
  d,
  color,
}: {
  position: Vec3
  w: number
  d: number
  color: string
}): React.ReactElement {
  return (
    <mesh
      geometry={unitBox}
      material={materialFor(color)}
      position={[position[0], 0.06, position[2]]}
      scale={[w, 0.03, d]}
      receiveShadow
    />
  )
}
