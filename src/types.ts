/** Shared types for the Living World 3D Phase 1 build.
 *  No backend calls exist in Phase 1. Everything here describes the visual
 *  simulation and the state shape the Phase 3 backend wiring will reuse. */

export type ActivityKind =
  | 'idle'
  | 'walking'
  | 'sitting'
  | 'typing'
  | 'thinking'
  | 'talking'
  | 'meeting'
  | 'break'
  | 'lounging'
  | 'inLift'

export type Vec3Tuple = [number, number, number]

export interface AgentDef {
  id: string
  name: string
  role: string
  team: string
  personality: string
  /** Demo task label shown in the panel. Always demo, never real AI work. */
  demoTask: string
  /** Accent color used for outfit details and the name label dot. */
  color: string
  /** Outfit variant: 'jacket' | 'sweater' | 'shirt'. Drives procedural outfit geometry. */
  outfit: 'jacket' | 'sweater' | 'shirt'
  /** Hair variant: 'short' | 'bun' | 'long' | 'fade'. */
  hair: 'short' | 'bun' | 'long' | 'fade'
  skin: string
  deskId: string
}

export interface OwnerDef {
  id: 'owner'
  name: string
  displayName: string
  role: string
  color: string
  outfit: 'jacket'
  hair: 'short'
  skin: string
}

export interface ScheduleBlock {
  /** Virtual minutes since 07:00. */
  start: number
  activity: ActivityKind
  /** Waypoint node id from layout.ts, or 'desk' / 'meeting' / 'ceoDesk' shorthands. */
  location: string
  label: string
}

export interface AgentSnapshot {
  id: string
  activity: ActivityKind
  position: Vec3Tuple
  heading: number
  label: string
  moving: boolean
}

export type CameraMode = 'orbit' | 'top' | 'follow' | 'focus'

export type NavKey =
  | 'world'
  | 'agents'
  | 'tasks'
  | 'teams'
  | 'meetings'
  | 'buildings'
  | 'build'
  | 'analytics'
  | 'activity'
  | 'settings'

export interface TickerItem {
  id: number
  text: string
  kind: 'info' | 'move' | 'work' | 'owner'
  atMinutes: number
}

/** Backend-shaped task event (spec section 8). Phase 1 emits these locally
 *  from the visual simulation only; they are never real AI work results. */
export interface TaskEvent {
  type:
    | 'task.assigned'
    | 'task.started'
    | 'llm.thinking'
    | 'tool.executing'
    | 'task.completed'
    | 'task.failed'
    | 'agent.idle'
  agentId: string
  label: string
  atMinutes: number
}

export type PanelSelection =
  | { kind: 'agent'; id: string }
  | { kind: 'owner' }
  | { kind: 'building'; id: string }
  | { kind: 'phase'; nav: NavKey }
  | null
