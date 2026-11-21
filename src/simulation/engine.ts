import { useEffect, useState } from 'react'
import { AGENTS, SCHEDULES } from '../data/worldData'
import {
  CEO_CHAIR,
  DESKS,
  collides,
  deskChair,
  findPath,
  meetingChairSpot,
  nearestWaypoint,
  resolveLocation,
  waypoint,
} from '../world/layout'
import type { ActivityKind, AgentSnapshot, ScheduleBlock, Vec3Tuple } from '../types'

/** Virtual minutes since 07:00, the schedule clock base. The store holds
 *  minutes since midnight starting at 07:00, so tick() converts it. */
const DAY_START_MINUTES = 7 * 60
const WALK_SPEED = 2.2
const LIFT_SECONDS = 1.4
const ARRIVE_DIST = 0.3
const CUSTOM_ARRIVE_DIST = 0.25
const BODY_RADIUS = 0.35
const SEPARATION_DIST = 0.7

export type RuntimeState = {
  id: string
  pos: Vec3Tuple
  heading: number
  activity: ActivityKind
  label: string
  path: string[]
  pathIdx: number
  pose: 'stand' | 'sitDesk' | 'sitMeeting' | 'sitCeo' | 'lounge'
  chair: { x: number; z: number; heading: number } | null
  liftTimer: number
  hidden: boolean
  scheduleIdx: number
  /** Seconds of blocked-wait remaining. Counts down in tick(). */
  waitUntil: number
  meetingChair: number
  /** Owner direct-move destination. Overrides the schedule until arrival. */
  customTarget: { x: number; z: number } | null
  /** Waypoint ids still to walk after a lift transit. Null when no lift is pending. */
  liftPending: string[] | null
}

interface CharInfo {
  id: string
  deskId: string
  meetingChair: number
  schedule: ScheduleBlock[]
}

function buildInfos(): CharInfo[] {
  const infos: CharInfo[] = AGENTS.map((def, index) => ({
    id: def.id,
    deskId: def.deskId,
    meetingChair: index,
    schedule: SCHEDULES[def.id] ?? [],
  }))
  infos.push({ id: 'owner', deskId: '', meetingChair: 0, schedule: SCHEDULES.owner ?? [] })
  return infos
}

function blockIndex(blocks: ScheduleBlock[], scheduleMinutes: number): number {
  let idx = 0
  for (let i = 0; i < blocks.length; i += 1) {
    if (blocks[i].start <= scheduleMinutes) idx = i
  }
  return idx
}

function turnToward(current: number, target: number, dt: number): number {
  let diff = target - current
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  const maxTurn = 7 * dt
  const step = Math.max(-maxTurn, Math.min(maxTurn, diff))
  const next = current + step
  return Math.atan2(Math.sin(next), Math.cos(next))
}

export class SimEngine {
  runtime: Map<string, RuntimeState> = new Map()
  onEvent?: (agentId: string, label: string, activity: ActivityKind) => void

  private initialized = false
  private infosCache: CharInfo[] | null = null

  private infos(): CharInfo[] {
    if (!this.infosCache) this.infosCache = buildInfos()
    return this.infosCache
  }

  private ensureInit(): void {
    if (this.initialized) return
    this.initialized = true
    const entrance = waypoint('entrance')
    for (const info of this.infos()) {
      const rt: RuntimeState = {
        id: info.id,
        pos: [entrance.x, entrance.y, entrance.z],
        heading: 0,
        activity: 'idle',
        label: '',
        path: [],
        pathIdx: 0,
        pose: 'stand',
        chair: null,
        liftTimer: 0,
        hidden: false,
        scheduleIdx: -1,
        waitUntil: 0,
        meetingChair: info.meetingChair,
        customTarget: null,
        liftPending: null,
      }
      this.runtime.set(info.id, rt)
      // Silent first assignment: no ticker event for the spawn state.
      this.applyBlock(rt, info, 0, false)
    }
  }

  private setActivity(rt: RuntimeState, activity: ActivityKind, emit: boolean): void {
    if (rt.activity === activity) return
    rt.activity = activity
    if (emit) this.onEvent?.(rt.id, rt.label, activity)
  }

  private chairFor(
    pose: RuntimeState['pose'],
    info: CharInfo,
  ): { x: number; z: number; heading: number } | null {
    if (pose === 'sitDesk') {
      const desk = DESKS.find((d) => d.id === info.deskId)
      return desk ? deskChair(desk) : null
    }
    if (pose === 'sitMeeting') {
      const spot = meetingChairSpot(info.meetingChair)
      return { x: spot.x, z: spot.z, heading: spot.heading }
    }
    if (pose === 'sitCeo') {
      return { x: CEO_CHAIR.x, z: CEO_CHAIR.z, heading: CEO_CHAIR.heading }
    }
    if (pose === 'lounge') {
      // Lounge seat facing the umbrella at (8, 4) on the roof terrace.
      return { x: 6.5, z: 4.5, heading: Math.atan2(8 - 6.5, 4 - 4.5) }
    }
    return null
  }

  /** Route from the character's current spot to a target waypoint id.
   *  When the target is on the other level, route to the lift on this level
   *  and keep the remainder after the lift in liftPending. */
  private computeRoute(
    rt: RuntimeState,
    targetNodeId: string,
  ): { path: string[]; liftPending: string[] | null } {
    const fromId = nearestWaypoint(rt.pos[0], rt.pos[2], rt.pos[1])
    const from = waypoint(fromId)
    const target = waypoint(targetNodeId)
    if (Math.abs(from.y - target.y) <= 0.5) {
      return { path: findPath(fromId, targetNodeId), liftPending: null }
    }
    const liftEntry = from.y > 1 ? 'liftRoof' : 'liftLobby'
    const liftExit = from.y > 1 ? 'liftLobby' : 'liftRoof'
    return {
      path: findPath(fromId, liftEntry),
      liftPending: findPath(liftExit, targetNodeId).slice(1),
    }
  }

  private applyBlock(
    rt: RuntimeState,
    info: CharInfo,
    scheduleMinutes: number,
    emit: boolean,
  ): void {
    if (info.schedule.length === 0) return
    const idx = blockIndex(info.schedule, scheduleMinutes)
    const block = info.schedule[idx]
    const resolved = resolveLocation(block.location, rt.id, info.deskId, rt.meetingChair)
    rt.scheduleIdx = idx
    rt.label = block.label
    rt.pose = resolved.pose
    rt.chair = this.chairFor(resolved.pose, info)
    rt.customTarget = null
    const route = this.computeRoute(rt, resolved.nodeId)
    rt.path = route.path
    rt.pathIdx = 0
    rt.liftPending = route.liftPending
    this.setActivity(rt, 'walking', emit)
  }

  private applyArrival(rt: RuntimeState, info: CharInfo, emit: boolean): void {
    rt.path = []
    rt.pathIdx = 0
    if (rt.pose !== 'stand' && rt.chair) {
      rt.pos = [rt.chair.x, rt.pos[1], rt.chair.z]
      rt.heading = rt.chair.heading
    }
    const block = info.schedule[rt.scheduleIdx]
    const arrivalActivity: ActivityKind =
      block && block.activity === 'walking' ? 'idle' : (block?.activity ?? 'idle')
    this.setActivity(rt, arrivalActivity, emit)
  }

  private enterLift(rt: RuntimeState): void {
    rt.path = []
    rt.pathIdx = 0
    rt.hidden = true
    rt.liftTimer = LIFT_SECONDS
    this.setActivity(rt, 'inLift', true)
  }

  private completeLift(rt: RuntimeState, info: CharInfo): void {
    const exitId = rt.pos[1] > 1 ? 'liftLobby' : 'liftRoof'
    const exit = waypoint(exitId)
    rt.pos = [exit.x, exit.y, exit.z]
    rt.hidden = false
    rt.liftTimer = 0
    const pending = rt.liftPending
    rt.liftPending = null
    rt.path = pending ?? []
    rt.pathIdx = 0
    if (rt.path.length === 0 && rt.customTarget === null) {
      this.applyArrival(rt, info, true)
    } else {
      this.setActivity(rt, 'walking', true)
    }
  }

  private walkPath(rt: RuntimeState, info: CharInfo, dtEff: number): void {
    if (rt.waitUntil > 0) {
      rt.waitUntil -= dtEff
      return
    }
    const node = waypoint(rt.path[rt.pathIdx])
    const dx = node.x - rt.pos[0]
    const dz = node.z - rt.pos[2]
    const dist = Math.hypot(dx, dz)
    if (dist < ARRIVE_DIST) {
      rt.pos = [node.x, node.y, node.z]
      rt.pathIdx += 1
      if (rt.pathIdx >= rt.path.length) {
        if (rt.liftPending !== null) {
          this.enterLift(rt)
        } else if (rt.customTarget !== null) {
          // Waypoint leg done; the direct walk to the custom point follows.
          this.setActivity(rt, 'walking', true)
        } else {
          this.applyArrival(rt, info, true)
        }
      }
      return
    }
    const dirX = dx / dist
    const dirZ = dz / dist
    rt.heading = turnToward(rt.heading, Math.atan2(dirX, dirZ), dtEff)
    const step = Math.min(WALK_SPEED * dtEff, dist)
    const nx = rt.pos[0] + dirX * step
    const nz = rt.pos[2] + dirZ * step
    if (collides(nx, nz, rt.pos[1], BODY_RADIUS)) {
      rt.waitUntil = 0.5
      return
    }
    rt.pos = [nx, rt.pos[1], nz]
  }

  private walkCustom(
    rt: RuntimeState,
    info: CharInfo,
    dtEff: number,
    scheduleMinutes: number,
  ): void {
    const target = rt.customTarget
    if (!target) return
    if (rt.waitUntil > 0) {
      rt.waitUntil -= dtEff
      return
    }
    const dx = target.x - rt.pos[0]
    const dz = target.z - rt.pos[2]
    const dist = Math.hypot(dx, dz)
    if (dist < CUSTOM_ARRIVE_DIST) {
      rt.customTarget = null
      rt.scheduleIdx = -1
      this.applyBlock(rt, info, scheduleMinutes, true)
      return
    }
    const dirX = dx / dist
    const dirZ = dz / dist
    rt.heading = turnToward(rt.heading, Math.atan2(dirX, dirZ), dtEff)
    const step = Math.min(WALK_SPEED * dtEff, dist)
    const nx = rt.pos[0] + dirX * step
    const nz = rt.pos[2] + dirZ * step
    if (collides(nx, nz, rt.pos[1], BODY_RADIUS)) {
      rt.waitUntil = 0.5
      return
    }
    rt.pos = [nx, rt.pos[1], nz]
  }

  private stepCharacter(
    rt: RuntimeState,
    info: CharInfo,
    dtEff: number,
    scheduleMinutes: number,
  ): void {
    if (rt.hidden) {
      rt.liftTimer -= dtEff
      if (rt.liftTimer <= 0) this.completeLift(rt, info)
      return
    }
    // The schedule is suspended while the owner is walking to a custom point.
    if (rt.id !== 'owner' || rt.customTarget === null) {
      const idx = blockIndex(info.schedule, scheduleMinutes)
      if (idx !== rt.scheduleIdx) this.applyBlock(rt, info, scheduleMinutes, true)
    }
    if (rt.pathIdx < rt.path.length) {
      this.walkPath(rt, info, dtEff)
      return
    }
    if (rt.customTarget !== null) {
      this.walkCustom(rt, info, dtEff, scheduleMinutes)
      return
    }
    if (rt.activity === 'walking') {
      this.applyArrival(rt, info, true)
    }
  }

  private isSeated(rt: RuntimeState): boolean {
    return (
      rt.pose !== 'stand' &&
      rt.pathIdx >= rt.path.length &&
      rt.customTarget === null &&
      !rt.hidden &&
      rt.activity !== 'walking'
    )
  }

  private separate(): void {
    const list = [...this.runtime.values()]
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        const a = list[i]
        const b = list[j]
        if (a.hidden || b.hidden) continue
        if (Math.abs(a.pos[1] - b.pos[1]) > 0.5) continue
        if (this.isSeated(a) || this.isSeated(b)) continue
        const dx = b.pos[0] - a.pos[0]
        const dz = b.pos[2] - a.pos[2]
        const dist = Math.hypot(dx, dz)
        if (dist >= SEPARATION_DIST) continue
        const ux = dist < 1e-6 ? 1 : dx / dist
        const uz = dist < 1e-6 ? 0 : dz / dist
        const push = (SEPARATION_DIST - dist) / 2
        const ax = a.pos[0] - ux * push
        const az = a.pos[2] - uz * push
        if (!collides(ax, az, a.pos[1], BODY_RADIUS)) a.pos = [ax, a.pos[1], az]
        const bx = b.pos[0] + ux * push
        const bz = b.pos[2] + uz * push
        if (!collides(bx, bz, b.pos[1], BODY_RADIUS)) b.pos = [bx, b.pos[1], bz]
      }
    }
  }

  tick(dtSeconds: number, worldMinutes: number, playing: boolean, speed: number): void {
    this.ensureInit()
    if (!playing) return
    // Substep so large wall-clock deltas (slow frames, background tabs) move
    // characters the full distance without tunneling through colliders.
    const dtTotal = Math.min(Math.max(dtSeconds, 0), 1) * Math.max(speed, 0.25)
    const steps = Math.max(1, Math.ceil(dtTotal / 0.05))
    const h = dtTotal / steps
    const scheduleMinutes = worldMinutes - DAY_START_MINUTES
    for (let s = 0; s < steps; s++) {
      for (const info of this.infos()) {
        const rt = this.runtime.get(info.id)
        if (rt) this.stepCharacter(rt, info, h, scheduleMinutes)
      }
    }
    this.separate()
  }

  setOwnerDestination(x: number, z: number): void {
    this.ensureInit()
    const rt = this.runtime.get('owner')
    if (!rt || rt.hidden) return
    if (collides(x, z, 0, BODY_RADIUS)) return
    const fromId = nearestWaypoint(rt.pos[0], rt.pos[2], rt.pos[1])
    const toId = nearestWaypoint(x, z, 0)
    const from = waypoint(fromId)
    const target = waypoint(toId)
    let path: string[]
    let liftPending: string[] | null = null
    if (Math.abs(from.y - target.y) <= 0.5) {
      path = findPath(fromId, toId)
    } else {
      const liftEntry = from.y > 1 ? 'liftRoof' : 'liftLobby'
      const liftExit = from.y > 1 ? 'liftLobby' : 'liftRoof'
      path = findPath(fromId, liftEntry)
      liftPending = findPath(liftExit, toId).slice(1)
    }
    rt.customTarget = { x, z }
    rt.path = path
    rt.pathIdx = 0
    rt.liftPending = liftPending
    rt.pose = 'stand'
    rt.chair = null
    this.setActivity(rt, 'walking', true)
  }

  getSnapshots(): AgentSnapshot[] {
    this.ensureInit()
    const out: AgentSnapshot[] = []
    for (const info of this.infos()) {
      const rt = this.runtime.get(info.id)
      if (!rt) continue
      out.push({
        id: rt.id,
        activity: rt.activity,
        position: [rt.pos[0], rt.pos[1], rt.pos[2]],
        heading: rt.heading,
        label: rt.label,
        moving:
          rt.activity === 'walking' &&
          (rt.pathIdx < rt.path.length || rt.customTarget !== null),
      })
    }
    return out
  }

  getRuntime(id: string): RuntimeState | undefined {
    this.ensureInit()
    return this.runtime.get(id)
  }
}

export const simEngine = new SimEngine()

export function useSimSnapshot(): AgentSnapshot[] {
  const [snapshots, setSnapshots] = useState<AgentSnapshot[]>(() => simEngine.getSnapshots())
  useEffect(() => {
    const timer = setInterval(() => {
      setSnapshots(simEngine.getSnapshots())
    }, 200)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return snapshots
}
