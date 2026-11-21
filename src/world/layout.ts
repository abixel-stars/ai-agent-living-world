/** Floor plan, collision shapes and waypoint graph. Single source of truth
 *  shared by the 3D world renderer and the simulation engine, so what you see
 *  is what the characters walk through. Units are metres. Ground floor is y=0,
 *  the roof terrace is y=ROOF_Y. The building front faces -z. */

export interface Rect {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface Circle {
  cx: number
  cz: number
  r: number
}

export const BUILDING = {
  minX: -15,
  maxX: 15,
  minZ: -10,
  maxZ: 10,
  groundHeight: 4,
  floorHeight: 3.4,
  floors: 5,
}

export const ROOF_Y = BUILDING.groundHeight + (BUILDING.floors - 1) * BUILDING.floorHeight + 0.4

export const SITE_BOUNDS: Rect = { minX: -44, maxX: 44, minZ: -33, maxZ: 33 }
export const INTERIOR_BOUNDS: Rect = { minX: -14.3, maxX: 14.3, minZ: -9.3, maxZ: 9.3 }
export const ROOF_BOUNDS: Rect = { minX: -13.6, maxX: 13.6, minZ: -8.6, maxZ: 8.6 }

/** Desk positions. Ground floor: two rows of five in the open workspace,
 *  plus one desk in the CEO office. Upper floors: one row per team room,
 *  desks sit against the far wall with a clear aisle in front. */
export interface DeskSpot {
  id: string
  x: number
  z: number
  rotY: number
  /** 1 = ground floor. Upper floors use their base Y. */
  floor: number
  y: number
  /** Waypoint the desk approach links to. Defaults to 'workspaceMid'. */
  link?: string
}

/** Walking surface heights. Upper floors sit on the shell slabs, whose tops
 *  are 0.36 above the shell base heights (slab thickness). */
export const FLOOR_BASE_Y: Record<number, number> = {
  1: 0,
  2: 4.36,
  3: 7.76,
  4: 11.16,
  5: 14.56,
  6: 18,
}

/** Floor index for a character height. 6 is the roof terrace. Thresholds sit
 *  midway between walking surfaces. */
export function floorOfY(y: number): number {
  if (y < 2.18) return 1
  if (y < 6.06) return 2
  if (y < 9.46) return 3
  if (y < 12.86) return 4
  if (y < 16.28) return 5
  return 6
}

/** Lift waypoint id for a floor. Floor 1 keeps the historic 'liftLobby' id. */
export function liftNodeForFloor(floor: number): string {
  if (floor === 1) return 'liftLobby'
  if (floor === 6) return 'liftRoof'
  return `f${floor}Lift`
}

export const DESKS: DeskSpot[] = [
  { id: 'desk-1', x: -2, z: -4, rotY: 0, floor: 1, y: 0 },
  { id: 'desk-2', x: 2, z: -4, rotY: 0, floor: 1, y: 0 },
  { id: 'desk-3', x: 6, z: -4, rotY: 0, floor: 1, y: 0 },
  { id: 'desk-4', x: 10, z: -4, rotY: 0, floor: 1, y: 0 },
  { id: 'desk-5', x: 14 - 1.4, z: -4, rotY: 0, floor: 1, y: 0 },
  { id: 'desk-6', x: -2, z: 2, rotY: 0, floor: 1, y: 0, link: 'workspaceSouth' },
  { id: 'desk-7', x: 2, z: 2, rotY: 0, floor: 1, y: 0, link: 'workspaceSouth' },
  { id: 'desk-8', x: 6, z: 2, rotY: 0, floor: 1, y: 0, link: 'workspaceSouth' },
  { id: 'desk-9', x: 10, z: 2, rotY: 0, floor: 1, y: 0, link: 'workspaceSouth' },
  { id: 'desk-10', x: 14 - 1.4, z: 2, rotY: 0, floor: 1, y: 0, link: 'workspaceSouth' },
  // Second desk in the ground-floor CEO office, for the CEO Agent.
  { id: 'desk-11', x: -7, z: 3.8, rotY: 0, floor: 1, y: 0, link: 'ceoFront' },
  // Floor 2: programmer room (north-west) and UI/UX + creative room (north-east).
  { id: 'desk-12', x: -3.5, z: -7.6, rotY: 0, floor: 2, y: 4.36, link: 'f2Prog' },
  { id: 'desk-13', x: -1.4, z: -7.6, rotY: 0, floor: 2, y: 4.36, link: 'f2Prog' },
  { id: 'desk-14', x: 0.7, z: -7.6, rotY: 0, floor: 2, y: 4.36, link: 'f2Prog' },
  { id: 'desk-15', x: 4.3, z: -7.6, rotY: 0, floor: 2, y: 4.36, link: 'f2Design' },
  { id: 'desk-16', x: 6.4, z: -7.6, rotY: 0, floor: 2, y: 4.36, link: 'f2Design' },
  { id: 'desk-17', x: 8.5, z: -7.6, rotY: 0, floor: 2, y: 4.36, link: 'f2Design' },
  // Floor 2: content creator studio (south-west).
  { id: 'desk-18', x: -11.5, z: 2.2, rotY: 0, floor: 2, y: 4.36, link: 'f2Content' },
  { id: 'desk-19', x: -9.6, z: 2.2, rotY: 0, floor: 2, y: 4.36, link: 'f2Content' },
  // Floor 3: research + data room (north-west) and marketing room (north-east).
  { id: 'desk-20', x: -3.5, z: -7.6, rotY: 0, floor: 3, y: 7.76, link: 'f3Research' },
  { id: 'desk-21', x: -1.4, z: -7.6, rotY: 0, floor: 3, y: 7.76, link: 'f3Research' },
  { id: 'desk-22', x: 0.7, z: -7.6, rotY: 0, floor: 3, y: 7.76, link: 'f3Research' },
  { id: 'desk-23', x: 4.3, z: -7.6, rotY: 0, floor: 3, y: 7.76, link: 'f3Marketing' },
  { id: 'desk-24', x: 6.4, z: -7.6, rotY: 0, floor: 3, y: 7.76, link: 'f3Marketing' },
  { id: 'desk-25', x: 8.5, z: -7.6, rotY: 0, floor: 3, y: 7.76, link: 'f3Marketing' },
  // Floor 3: HR + administration room (south-east).
  { id: 'desk-26', x: 1.5, z: 2.2, rotY: 0, floor: 3, y: 7.76, link: 'f3Hr' },
  { id: 'desk-27', x: 4.2, z: 2.2, rotY: 0, floor: 3, y: 7.76, link: 'f3Hr' },
  // Floor 4: project manager room (north-west) and library + focus room (south-west).
  { id: 'desk-28', x: -2.5, z: -7.6, rotY: 0, floor: 4, y: 11.16, link: 'f4Pm' },
  { id: 'desk-29', x: 0.2, z: -7.6, rotY: 0, floor: 4, y: 11.16, link: 'f4Pm' },
  { id: 'desk-30', x: -11.5, z: 2.2, rotY: 0, floor: 4, y: 11.16, link: 'f4Library' },
]

/** Chair spot for a desk: south side, facing the desk (facing -z). */
export function deskChair(desk: DeskSpot): { x: number; z: number; heading: number } {
  return { x: desk.x, z: desk.z + 1.35, heading: Math.PI }
}

export const MEETING_TABLE = { x: 10, z: 7, w: 4.6, d: 2.0 }
export const MEETING_CHAIRS: { x: number; z: number; heading: number }[] = [
  { x: 8.4, z: 5.7, heading: 0 },
  { x: 10, z: 5.7, heading: 0 },
  { x: 11.6, z: 5.7, heading: 0 },
  { x: 8.4, z: 8.3, heading: Math.PI },
  { x: 10, z: 8.3, heading: Math.PI },
  { x: 11.6, z: 8.3, heading: Math.PI },
]

export const CEO_DESK = { x: -11, z: 6, w: 2.4, d: 1.2 }
export const CEO_CHAIR = { x: -11, z: 7.4, heading: Math.PI }
export const RECEPTION_DESK = { x: -11, z: -6, w: 3.2, d: 1.0 }

function rect(cx: number, cz: number, w: number, d: number): Rect {
  return { minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 }
}

/** Solid shapes characters must not walk through, ground floor. */
export const GROUND_COLLIDERS: Rect[] = [
  ...DESKS.filter((d) => d.floor === 1).map((d) => rect(d.x, d.z, 2.0, 1.1)),
  rect(MEETING_TABLE.x, MEETING_TABLE.z, MEETING_TABLE.w, MEETING_TABLE.d),
  rect(RECEPTION_DESK.x, RECEPTION_DESK.z, RECEPTION_DESK.w, RECEPTION_DESK.d),
  rect(CEO_DESK.x, CEO_DESK.z, CEO_DESK.w, CEO_DESK.d),
  rect(-13.4, -8.4, 1.1, 1.1),
  rect(13.4, -8.4, 1.1, 1.1),
  rect(-13.4, 8.4, 1.1, 1.1),
  rect(13.4, 8.4, 1.1, 1.1),
  rect(-13, -3, 2.8, 1.1),
  rect(14.0, -1, 0.9, 3.2),
  rect(0, -9.6, 6.0, 0.6),
]

/** Axis-aligned wall segment (thickness 0.15). Used for interior partitions
 *  on floors 2-5; colliders are derived from the same segments. */
export interface WallSegment {
  x1: number
  z1: number
  x2: number
  z2: number
}

const wallRect = (s: WallSegment): Rect => ({
  minX: Math.min(s.x1, s.x2) - 0.075,
  maxX: Math.max(s.x1, s.x2) + 0.075,
  minZ: Math.min(s.z1, s.z2) - 0.075,
  maxZ: Math.max(s.z1, s.z2) + 0.075,
})

/** Interior partition segments shared by floors 2-4 (north and south room
 *  walls with door gaps). Floor 5 uses the wide command-center variant. */
const PARTITION_NORTH: WallSegment[] = [
  // South wall of the north-west room, door gap x -1.8..0.4.
  { x1: -4.5, z1: -2.5, x2: -1.8, z2: -2.5 },
  { x1: 0.4, z1: -2.5, x2: 3.2, z2: -2.5 },
  // South wall of the north-east room, door gap x 5.6..8.0.
  { x1: 3.2, z1: -2.5, x2: 5.6, z2: -2.5 },
  { x1: 8.0, z1: -2.5, x2: 10.5, z2: -2.5 },
  // Divider between the two north rooms.
  { x1: 3.2, z1: -9.3, x2: 3.2, z2: -2.5 },
  // West wall of the north-west room, against the lift hall.
  { x1: -4.5, z1: -6.6, x2: -4.5, z2: -2.5 },
]

const PARTITION_SOUTH: WallSegment[] = [
  // North wall of the south-west room, door gap x -8.4..-6.6.
  { x1: -14.3, z1: 0.5, x2: -8.4, z2: 0.5 },
  { x1: -6.6, z1: 0.5, x2: -2, z2: 0.5 },
  // North wall of the south-east room, door gap x 5.1..6.9.
  { x1: -2, z1: 0.5, x2: 5.1, z2: 0.5 },
  { x1: 6.9, z1: 0.5, x2: 14.3, z2: 0.5 },
  // Divider between the two south rooms.
  { x1: -2, z1: 0.5, x2: -2, z2: 9.3 },
]

const PARTITION_F5_NORTH: WallSegment[] = [
  // South wall of the command center, door gap x 2..4.
  { x1: -4.5, z1: -2.5, x2: 2, z2: -2.5 },
  { x1: 4, z1: -2.5, x2: 10.5, z2: -2.5 },
  // West wall of the command center, against the lift hall.
  { x1: -4.5, z1: -6.6, x2: -4.5, z2: -2.5 },
]

/** Lift shaft walls (door gap faces south, x -7.5..-6) and the toilet block. */
const LIFT_SHAFT: WallSegment[] = [
  { x1: -9, z1: -9.3, x2: -9, z2: -6.6 },
  { x1: -4.5, z1: -9.3, x2: -4.5, z2: -6.6 },
  { x1: -9, z1: -9.3, x2: -4.5, z2: -9.3 },
  { x1: -9, z1: -6.6, x2: -7.5, z2: -6.6 },
  { x1: -6, z1: -6.6, x2: -4.5, z2: -6.6 },
]

const SHARED_UPPER: Rect[] = [
  // Toilet block (decorative door, solid inside).
  { minX: -14.3, maxX: -10.5, minZ: -9.3, maxZ: -5.5 },
  // Stair block (decorative switchback stairs).
  { minX: 10.5, maxX: 14.3, minZ: -9.3, maxZ: -5.0 },
  ...LIFT_SHAFT.map(wallRect),
]

/** Furniture colliders per upper floor, matching the furniture kits in
 *  furniture.tsx. Only pieces a walking character could bump into. */
const FURNITURE_COLLIDERS: Record<number, Rect[]> = {
  2: [
    // Programmer room: whiteboard on the north wall, shelf, plant.
    rect(-0.7, -9.0, 3.0, 0.3),
    rect(2.6, -8.9, 1.2, 0.5),
    rect(-4.0, -3.4, 0.7, 0.7),
    // UI/UX room: two tilted drawing boards, shelf, plant.
    rect(9.8, -6.5, 0.5, 1.4),
    rect(9.8, -4.0, 0.5, 1.4),
    rect(4.0, -9.0, 1.6, 0.4),
    rect(3.8, -3.4, 0.7, 0.7),
    // Content studio: recording corner (backdrop + camera + ring light), sofa, table, plant.
    rect(-12.8, 7.4, 2.4, 2.0),
    rect(-4.5, 7.8, 2.4, 1.0),
    rect(-4.5, 6.3, 1.2, 0.6),
    rect(-13.8, 3.2, 0.7, 0.7),
    // Focus pods: three enclosures, sofa, coffee table.
    rect(1, 6.5, 1.6, 1.6),
    rect(4.5, 6.5, 1.6, 1.6),
    rect(8, 6.5, 1.6, 1.6),
    rect(11.5, 7.8, 2.4, 1.0),
    rect(11.5, 6.3, 1.2, 0.6),
    rect(13.6, 3.2, 0.7, 0.7),
  ],
  3: [
    // Research room: shelves on the north wall, whiteboard, plant.
    rect(-3.6, -9.0, 2.4, 0.4),
    rect(2.6, -8.9, 1.2, 0.5),
    rect(-4.0, -3.4, 0.7, 0.7),
    // Marketing room: campaign board, shelf, plant.
    rect(9.8, -5.2, 0.5, 2.4),
    rect(4.0, -9.0, 1.6, 0.4),
    rect(3.8, -3.4, 0.7, 0.7),
    // Small meeting room: table + screen.
    rect(-8, 6.5, 3.6, 1.8),
    rect(-8, 9.0, 3.0, 0.3),
    rect(-13.8, 1.6, 0.7, 0.7),
    // HR room: cabinets along the east wall, sofa, table, plant.
    rect(13.7, 4.0, 0.6, 2.4),
    rect(13.7, 7.0, 0.6, 2.4),
    rect(11.5, 7.8, 2.4, 1.0),
    rect(11.5, 6.3, 1.2, 0.6),
    rect(1.0, 8.6, 0.7, 0.7),
  ],
  4: [
    // PM room: round side table, whiteboard, shelf, plant.
    rect(-3.5, -4.3, 1.0, 1.0),
    rect(2.6, -8.9, 1.2, 0.5),
    rect(-0.7, -9.0, 3.0, 0.3),
    rect(-4.0, -3.4, 0.7, 0.7),
    // Large meeting room: big table + screen on the north wall.
    rect(6.8, -6.9, 4.4, 2.0),
    rect(6.8, -9.0, 3.4, 0.3),
    // Library: shelves along the west and south walls, reading chairs, lamp.
    rect(-13.9, 4.5, 0.5, 5.0),
    rect(-8, 8.9, 5.0, 0.4),
    rect(-5.2, 7.2, 0.9, 0.9),
    rect(-3.6, 7.2, 0.9, 0.9),
    rect(-13.8, 1.6, 0.7, 0.7),
    // Meeting room 2: table + screen.
    rect(6, 6.5, 3.0, 1.6),
    rect(6, 9.0, 2.6, 0.3),
    rect(13.6, 1.6, 0.7, 0.7),
  ],
  5: [
    // Command center: three consoles + screen wall + side status boards.
    rect(-1, -7.4, 2.2, 1.0),
    rect(3, -7.4, 2.2, 1.0),
    rect(7, -7.4, 2.2, 1.0),
    rect(3, -9.0, 5.0, 0.3),
    rect(-4.1, -5.2, 0.4, 2.4),
    rect(10.1, -5.2, 0.4, 2.4),
    rect(9.8, -3.4, 0.7, 0.7),
    // Server room: two rack rows along the west and east walls.
    rect(-13.6, 5.0, 0.8, 7.0),
    rect(-2.9, 5.0, 0.8, 7.0),
    rect(-8, 8.9, 2.4, 0.5),
    // Balcony lounge: sofas, coffee table, planters.
    rect(2.5, 7.8, 2.4, 1.0),
    rect(9.5, 7.8, 2.4, 1.0),
    rect(6, 6.3, 1.6, 0.7),
    rect(1.0, 1.6, 0.7, 0.7),
    rect(13.6, 1.6, 0.7, 0.7),
  ],
}

/** All solid colliders per floor. Floor 1 keeps the historic list above. */
export const COLLIDERS_BY_FLOOR: Record<number, Rect[]> = {
  1: GROUND_COLLIDERS,
  2: [
    ...DESKS.filter((d) => d.floor === 2).map((d) => rect(d.x, d.z, 2.0, 1.1)),
    ...PARTITION_NORTH.map(wallRect),
    ...PARTITION_SOUTH.map(wallRect),
    ...SHARED_UPPER,
    ...FURNITURE_COLLIDERS[2],
  ],
  3: [
    ...DESKS.filter((d) => d.floor === 3).map((d) => rect(d.x, d.z, 2.0, 1.1)),
    ...PARTITION_NORTH.map(wallRect),
    ...PARTITION_SOUTH.map(wallRect),
    ...SHARED_UPPER,
    ...FURNITURE_COLLIDERS[3],
  ],
  4: [
    ...DESKS.filter((d) => d.floor === 4).map((d) => rect(d.x, d.z, 2.0, 1.1)),
    ...PARTITION_NORTH.map(wallRect),
    ...PARTITION_SOUTH.map(wallRect),
    ...SHARED_UPPER,
    ...FURNITURE_COLLIDERS[4],
  ],
  5: [
    ...PARTITION_F5_NORTH.map(wallRect),
    ...PARTITION_SOUTH.map(wallRect),
    ...SHARED_UPPER,
    ...FURNITURE_COLLIDERS[5],
  ],
}

/** Partition segments per floor, for rendering the glass/wood dividers. */
export const PARTITIONS_BY_FLOOR: Record<number, WallSegment[]> = {
  2: [...PARTITION_NORTH, ...PARTITION_SOUTH],
  3: [...PARTITION_NORTH, ...PARTITION_SOUTH],
  4: [...PARTITION_NORTH, ...PARTITION_SOUTH],
  5: [...PARTITION_F5_NORTH, ...PARTITION_SOUTH],
}

/** Lift shaft wall segments, rendered solid (not glass). */
export const LIFT_SHAFT_SEGMENTS: WallSegment[] = LIFT_SHAFT

export const GROUND_CIRCLES: Circle[] = []

/** Exterior colliders: fountain, trees, parked cars, benches. */
export const SITE_CIRCLES: Circle[] = [
  { cx: 0, cz: -20, r: 2.6 },
  { cx: 20, cz: -12, r: 0.6 },
  { cx: 24, cz: -17, r: 0.6 },
  { cx: 28, cz: -11, r: 0.6 },
  { cx: -14, cz: -20, r: 0.6 },
  { cx: 14, cz: -24, r: 0.6 },
  { cx: -24, cz: -20, r: 0.6 },
]

export const SITE_COLLIDERS: Rect[] = [
  rect(-26, -4, 2.0, 4.6),
  rect(-26, 2, 2.0, 4.6),
  rect(-31, -4, 2.0, 4.6),
  rect(-31, 2, 2.0, 4.6),
  rect(-6, -20, 1.8, 0.6),
  rect(6, -20, 1.8, 0.6),
  rect(22, -18, 1.8, 0.6),
]

export const ROOF_CIRCLES: Circle[] = [{ cx: 8, cz: 4, r: 1.4 }]
export const ROOF_COLLIDERS: Rect[] = [rect(-11, -6, 3.0, 2.0)]

export interface Waypoint {
  id: string
  x: number
  z: number
  y: number
  links: string[]
}

/** Room plan for one upper-floor room. The door sits in a gap of the room's
 *  partition wall; the interior node sits on the room's clear aisle, and
 *  desk approaches link to it along the aisle, so every walk segment stays
 *  clear of furniture. */
export type RoomKind =
  | 'programmer'
  | 'design'
  | 'content'
  | 'focus'
  | 'research'
  | 'marketing'
  | 'meetingSmall'
  | 'hr'
  | 'pm'
  | 'meetingLarge'
  | 'library'
  | 'command'
  | 'server'
  | 'lounge'

export interface RoomPlan {
  /** Interior waypoint id, also the desk-approach link target. */
  id: string
  doorId: string
  name: string
  kind: RoomKind
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  doorX: number
  doorZ: number
  interiorX: number
  interiorZ: number
  corridorLink: string
}

const room = (
  floor: number,
  id: string,
  name: string,
  kind: RoomKind,
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number,
  doorX: number,
  doorZ: number,
  interiorX: number,
  interiorZ: number,
  corridor: 'W' | 'C' | 'E',
): RoomPlan => ({
  id,
  doorId: `${id}Door`,
  name,
  kind,
  minX,
  maxX,
  minZ,
  maxZ,
  doorX,
  doorZ,
  interiorX,
  interiorZ,
  corridorLink: `f${floor}Corr${corridor}`,
})

/** Every room on the spec section 3A list, assigned across floors 2-5.
 *  Ground floor keeps the CEO/director room, lobby, workspace and meeting
 *  room from FASE 1; the rooftop lounge sits on the roof terrace. */
export const ROOM_PLANS: Record<number, RoomPlan[]> = {
  2: [
    room(2, 'f2Prog', 'Ruang Programmer', 'programmer', -4.5, 3.2, -9.3, -2.5, -0.7, -2.5, -0.7, -5.5, 'C'),
    room(2, 'f2Design', 'Ruang UI/UX dan Desain', 'design', 3.2, 10.5, -9.3, -2.5, 6.8, -2.5, 6.8, -5.5, 'E'),
    room(2, 'f2Content', 'Studio Content Creator', 'content', -14.3, -2, 0.5, 9.3, -7.5, 0.5, -7.5, 4.3, 'W'),
    room(2, 'f2Focus', 'Focus Pods', 'focus', -2, 14.3, 0.5, 9.3, 6, 0.5, 6, 4.3, 'E'),
  ],
  3: [
    room(3, 'f3Research', 'Ruang Research dan Data', 'research', -4.5, 3.2, -9.3, -2.5, -0.7, -2.5, -0.7, -5.5, 'C'),
    room(3, 'f3Marketing', 'Ruang Marketing', 'marketing', 3.2, 10.5, -9.3, -2.5, 6.8, -2.5, 6.8, -5.5, 'E'),
    room(3, 'f3Meeting', 'Ruang Meeting Kecil', 'meetingSmall', -14.3, -2, 0.5, 9.3, -7.5, 0.5, -7.5, 4.3, 'W'),
    room(3, 'f3Hr', 'Ruang HR dan Administrasi', 'hr', -2, 14.3, 0.5, 9.3, 6, 0.5, 6, 4.3, 'E'),
  ],
  4: [
    room(4, 'f4Pm', 'Ruang Project Manager', 'pm', -4.5, 3.2, -9.3, -2.5, -0.7, -2.5, -0.7, -5.5, 'C'),
    room(4, 'f4Meeting', 'Ruang Meeting Besar', 'meetingLarge', 3.2, 10.5, -9.3, -2.5, 6.8, -2.5, 6.8, -4.6, 'E'),
    room(4, 'f4Library', 'Perpustakaan dan Focus', 'library', -14.3, -2, 0.5, 9.3, -7.5, 0.5, -7.5, 4.3, 'W'),
    room(4, 'f4Meeting2', 'Ruang Meeting 2', 'meetingSmall', -2, 14.3, 0.5, 9.3, 6, 0.5, 6, 4.3, 'E'),
  ],
  5: [
    room(5, 'f5Command', 'Command Center', 'command', -4.5, 10.5, -9.3, -2.5, 3, -2.5, 3, -4.6, 'C'),
    room(5, 'f5Server', 'Ruang Server', 'server', -14.3, -2, 0.5, 9.3, -7.5, 0.5, -7.5, 4.3, 'W'),
    room(5, 'f5Lounge', 'Balcony Lounge', 'lounge', -2, 14.3, 0.5, 9.3, 6, 0.5, 6, 4.3, 'E'),
  ],
}

function deskApproach(desk: DeskSpot): Waypoint {
  return {
    id: `${desk.id}-approach`,
    x: desk.x,
    z: desk.z + 2.1,
    y: desk.y,
    links: [desk.link ?? 'workspaceMid'],
  }
}

/** Waypoint graph for one upper floor: lift, lift hall, corridor spine,
 *  room doors and room interiors. Desk approaches are added by deskApproach. */
function upperFloorWaypoints(floor: number): Waypoint[] {
  const y = FLOOR_BASE_Y[floor]
  const rooms = ROOM_PLANS[floor]
  const lift = liftNodeForFloor(floor)
  const hall = `f${floor}LiftHall`
  const corrW = `f${floor}CorrW`
  const corrC = `f${floor}CorrC`
  const corrE = `f${floor}CorrE`
  const doorsFor = (corr: string) => rooms.filter((r) => r.corridorLink === corr).map((r) => r.doorId)
  const wps: Waypoint[] = [
    { id: lift, x: -6.75, z: -5.4, y, links: [hall] },
    { id: hall, x: -6.75, z: -3.6, y, links: [lift, corrW] },
    // Corridor nodes sit on the door columns so every door approach runs
    // straight through its gap instead of clipping a partition corner.
    { id: corrW, x: -7.5, z: -1, y, links: [hall, corrC, ...doorsFor(corrW)] },
    { id: corrC, x: floor === 5 ? 3 : -0.7, z: -1, y, links: [corrW, corrE, ...doorsFor(corrC)] },
    { id: corrE, x: 6.4, z: -1, y, links: [corrC, ...doorsFor(corrE)] },
  ]
  for (const r of rooms) {
    wps.push({ id: r.doorId, x: r.doorX, z: r.doorZ, y, links: [r.corridorLink, r.id] })
    const approaches = DESKS.filter((d) => d.link === r.id).map((d) => `${d.id}-approach`)
    wps.push({ id: r.id, x: r.interiorX, z: r.interiorZ, y, links: [r.doorId, ...approaches] })
  }
  return wps
}

export const WAYPOINTS: Waypoint[] = [
  { id: 'entrance', x: -10, z: -8.6, y: 0, links: ['lobby', 'doorOut', 'liftLobby'] },
  { id: 'doorOut', x: -10, z: -11.6, y: 0, links: ['entrance', 'pathJunction'] },
  { id: 'lobby', x: -7.6, z: -4.2, y: 0, links: ['entrance', 'corridorW', 'receptionFront', 'liftLobby'] },
  { id: 'receptionFront', x: -8.8, z: -6, y: 0, links: ['lobby'] },
  { id: 'liftLobby', x: -6.5, z: -8.4, y: 0, links: ['lobby', 'entrance'] },
  { id: 'corridorW', x: -4, z: -5, y: 0, links: ['lobby', 'corridorC', 'ceoDoor'] },
  { id: 'corridorC', x: -4, z: 1, y: 0, links: ['corridorW', 'corridorE', 'workspaceMid', 'ceoDoor'] },
  { id: 'corridorE', x: 4, z: 1, y: 0, links: ['corridorC', 'workspaceMid', 'meetingDoor'] },
  { id: 'workspaceMid', x: 4, z: -2, y: 0, links: ['corridorC', 'corridorE', 'workspaceSouth', 'desk-1-approach', 'desk-2-approach', 'desk-3-approach', 'desk-4-approach', 'desk-5-approach'] },
  { id: 'workspaceSouth', x: 4, z: 4.1, y: 0, links: ['workspaceMid', 'desk-6-approach', 'desk-7-approach', 'desk-8-approach', 'desk-9-approach', 'desk-10-approach'] },
  ...DESKS.map(deskApproach),
  ...[2, 3, 4, 5].flatMap(upperFloorWaypoints),
  { id: 'ceoDoor', x: -5.6, z: 5, y: 0, links: ['corridorW', 'corridorC', 'ceoFront'] },
  { id: 'ceoFront', x: -9.4, z: 6, y: 0, links: ['ceoDoor', 'desk-11-approach'] },
  { id: 'meetingDoor', x: 4.2, z: 5.6, y: 0, links: ['corridorE', 'meetingFront'] },
  { id: 'meetingFront', x: 10, z: 5.0, y: 0, links: ['meetingDoor'] },
  { id: 'pathJunction', x: -10, z: -15, y: 0, links: ['doorOut', 'plazaNorth', 'gardenPath', 'parkingPath'] },
  { id: 'plazaNorth', x: 0, z: -16.6, y: 0, links: ['pathJunction', 'plazaWest', 'plazaEast'] },
  { id: 'plazaWest', x: -4.8, z: -20, y: 0, links: ['plazaNorth', 'plazaSouth'] },
  { id: 'plazaEast', x: 4.8, z: -20, y: 0, links: ['plazaNorth', 'plazaSouth', 'gardenPath'] },
  { id: 'plazaSouth', x: 0, z: -23.4, y: 0, links: ['plazaWest', 'plazaEast'] },
  { id: 'gardenPath', x: 16, z: -15, y: 0, links: ['pathJunction', 'plazaEast', 'garden'] },
  { id: 'garden', x: 24, z: -14, y: 0, links: ['gardenPath'] },
  { id: 'parkingPath', x: -20, z: -12, y: 0, links: ['pathJunction', 'parking'] },
  { id: 'parking', x: -27, z: -8, y: 0, links: ['parkingPath'] },
  { id: 'liftRoof', x: 8, z: 1.6, y: ROOF_Y, links: ['roofWest'] },
  { id: 'roofWest', x: 5.5, z: 3.2, y: ROOF_Y, links: ['liftRoof', 'roofNorth'] },
  { id: 'roofNorth', x: 5.5, z: 5.5, y: ROOF_Y, links: ['roofWest', 'roofLounge'] },
  { id: 'roofLounge', x: 8, z: 6.2, y: ROOF_Y, links: ['roofNorth'] },
]

const WAYPOINT_MAP = new Map(WAYPOINTS.map((w) => [w.id, w]))

export function waypoint(id: string): Waypoint {
  const w = WAYPOINT_MAP.get(id)
  if (!w) throw new Error(`Unknown waypoint ${id}`)
  return w
}

/** Breadth-first path over the waypoint graph. Returns node ids including start and goal. */
export function findPath(fromId: string, toId: string): string[] {
  if (fromId === toId) return [fromId]
  const prev = new Map<string, string>()
  const queue: string[] = [fromId]
  const seen = new Set([fromId])
  while (queue.length > 0) {
    const cur = queue.shift() as string
    for (const next of waypoint(cur).links) {
      if (seen.has(next)) continue
      seen.add(next)
      prev.set(next, cur)
      if (next === toId) {
        const path = [toId]
        let node = toId
        while (node !== fromId) {
          node = prev.get(node) as string
          path.unshift(node)
        }
        return path
      }
      queue.push(next)
    }
  }
  return [fromId, toId]
}

export function nearestWaypoint(x: number, z: number, y: number): string {
  let best = WAYPOINTS[0]
  let bestDist = Number.POSITIVE_INFINITY
  for (const w of WAYPOINTS) {
    if (Math.abs(w.y - y) > 0.5) continue
    const d = (w.x - x) ** 2 + (w.z - z) ** 2
    if (d < bestDist) {
      bestDist = d
      best = w
    }
  }
  return best.id
}

function circleHits(circles: Circle[], x: number, z: number, radius: number): boolean {
  return circles.some((c) => {
    const dx = x - c.cx
    const dz = z - c.cz
    return dx * dx + dz * dz < (c.r + radius) * (c.r + radius)
  })
}

function rectHits(rects: Rect[], x: number, z: number, radius: number): boolean {
  return rects.some(
    (r) => x > r.minX - radius && x < r.maxX + radius && z > r.minZ - radius && z < r.maxZ + radius,
  )
}

/** True when a character circle at (x, z, y) would overlap a solid shape.
 *  Floors 2-5 use their own collider sets; outside a floor plate is solid. */
export function collides(x: number, z: number, y: number, radius: number): boolean {
  const floor = floorOfY(y)
  if (floor === 6) {
    if (x < ROOF_BOUNDS.minX || x > ROOF_BOUNDS.maxX || z < ROOF_BOUNDS.minZ || z > ROOF_BOUNDS.maxZ) return true
    return rectHits(ROOF_COLLIDERS, x, z, radius) || circleHits(ROOF_CIRCLES, x, z, radius)
  }
  const inside = x > INTERIOR_BOUNDS.minX && x < INTERIOR_BOUNDS.maxX && z > INTERIOR_BOUNDS.minZ && z < INTERIOR_BOUNDS.maxZ
  if (inside) return rectHits(COLLIDERS_BY_FLOOR[floor] ?? [], x, z, radius)
  if (floor !== 1) return true
  if (x < SITE_BOUNDS.minX || x > SITE_BOUNDS.maxX || z < SITE_BOUNDS.minZ || z > SITE_BOUNDS.maxZ) return true
  if (rectHits(SITE_COLLIDERS, x, z, radius) || circleHits(SITE_CIRCLES, x, z, radius)) return true
  // The building shell blocks walking except through the entrance door gap.
  if (x > BUILDING.minX - radius && x < BUILDING.maxX + radius && z > BUILDING.minZ - radius && z < BUILDING.maxZ + radius) {
    const inDoorGap = x > -11.2 && x < -8.8
    if (!inDoorGap) return true
  }
  return false
}

/** Resolve a schedule location string to a waypoint id and a pose target. */
export function resolveLocation(
  location: string,
  agentId: string,
  deskId: string,
  _meetingChairIndex: number,
): { nodeId: string; pose: 'stand' | 'sitDesk' | 'sitMeeting' | 'sitCeo' | 'lounge' } {
  switch (location) {
    case 'desk':
      return { nodeId: `${deskId}-approach`, pose: 'sitDesk' }
    case 'meeting':
      return { nodeId: 'meetingFront', pose: 'sitMeeting' }
    case 'ceoDesk':
      return { nodeId: 'ceoFront', pose: 'sitCeo' }
    case 'roof':
      return { nodeId: 'roofLounge', pose: 'lounge' }
    case 'entrance':
      return { nodeId: 'entrance', pose: 'stand' }
    case 'lobby':
      return { nodeId: 'lobby', pose: 'stand' }
    case 'plaza':
      return { nodeId: agentId === 'owner' ? 'plazaSouth' : 'plazaWest', pose: 'stand' }
    case 'garden':
      return { nodeId: 'garden', pose: 'stand' }
    default:
      return { nodeId: 'lobby', pose: 'stand' }
  }
}

export function meetingChairSpot(index: number): { x: number; z: number; heading: number } {
  return MEETING_CHAIRS[index % MEETING_CHAIRS.length]
}
