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

/** Desk positions: two rows of five in the open workspace. */
export interface DeskSpot {
  id: string
  x: number
  z: number
  rotY: number
}

export const DESKS: DeskSpot[] = [
  { id: 'desk-1', x: -2, z: -4, rotY: 0 },
  { id: 'desk-2', x: 2, z: -4, rotY: 0 },
  { id: 'desk-3', x: 6, z: -4, rotY: 0 },
  { id: 'desk-4', x: 10, z: -4, rotY: 0 },
  { id: 'desk-5', x: 14 - 1.4, z: -4, rotY: 0 },
  { id: 'desk-6', x: -2, z: 2, rotY: 0 },
  { id: 'desk-7', x: 2, z: 2, rotY: 0 },
  { id: 'desk-8', x: 6, z: 2, rotY: 0 },
  { id: 'desk-9', x: 10, z: 2, rotY: 0 },
  { id: 'desk-10', x: 14 - 1.4, z: 2, rotY: 0 },
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
  ...DESKS.map((d) => rect(d.x, d.z, 2.0, 1.1)),
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

function deskApproach(desk: DeskSpot): Waypoint {
  return {
    id: `${desk.id}-approach`,
    x: desk.x,
    z: desk.z + 2.1,
    y: 0,
    links: ['workspaceMid'],
  }
}

export const WAYPOINTS: Waypoint[] = [
  { id: 'entrance', x: -10, z: -8.6, y: 0, links: ['lobby', 'doorOut', 'liftLobby'] },
  { id: 'doorOut', x: -10, z: -11.6, y: 0, links: ['entrance', 'pathJunction'] },
  { id: 'lobby', x: -10, z: -4.2, y: 0, links: ['entrance', 'corridorW', 'receptionFront', 'liftLobby'] },
  { id: 'receptionFront', x: -8.8, z: -6, y: 0, links: ['lobby'] },
  { id: 'liftLobby', x: -6.5, z: -8.4, y: 0, links: ['lobby', 'entrance'] },
  { id: 'corridorW', x: -4, z: -5, y: 0, links: ['lobby', 'corridorC', 'ceoDoor'] },
  { id: 'corridorC', x: -4, z: 1, y: 0, links: ['corridorW', 'corridorE', 'workspaceMid', 'ceoDoor'] },
  { id: 'corridorE', x: 4, z: 1, y: 0, links: ['corridorC', 'workspaceMid', 'meetingDoor'] },
  { id: 'workspaceMid', x: 4, z: -2, y: 0, links: ['corridorC', 'corridorE', 'desk-1-approach', 'desk-2-approach', 'desk-3-approach', 'desk-4-approach', 'desk-5-approach', 'desk-6-approach', 'desk-7-approach', 'desk-8-approach', 'desk-9-approach', 'desk-10-approach'] },
  ...DESKS.map(deskApproach),
  { id: 'ceoDoor', x: -5.6, z: 5, y: 0, links: ['corridorW', 'corridorC', 'ceoFront'] },
  { id: 'ceoFront', x: -9.4, z: 6, y: 0, links: ['ceoDoor'] },
  { id: 'meetingDoor', x: 6, z: 5.6, y: 0, links: ['corridorE', 'meetingFront'] },
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
  { id: 'liftRoof', x: 8, z: 1.6, y: ROOF_Y, links: ['roofLounge'] },
  { id: 'roofLounge', x: 8, z: 4.4, y: ROOF_Y, links: ['liftRoof'] },
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

/** True when a character circle at (x, z, y) would overlap a solid shape. */
export function collides(x: number, z: number, y: number, radius: number): boolean {
  if (y > 1) {
    if (x < ROOF_BOUNDS.minX || x > ROOF_BOUNDS.maxX || z < ROOF_BOUNDS.minZ || z > ROOF_BOUNDS.maxZ) return true
    return rectHits(ROOF_COLLIDERS, x, z, radius) || circleHits(ROOF_CIRCLES, x, z, radius)
  }
  const inside = x > INTERIOR_BOUNDS.minX && x < INTERIOR_BOUNDS.maxX && z > INTERIOR_BOUNDS.minZ && z < INTERIOR_BOUNDS.maxZ
  if (inside) return rectHits(GROUND_COLLIDERS, x, z, radius)
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
