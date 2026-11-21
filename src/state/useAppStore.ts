import { create } from 'zustand'
import type { CameraMode, NavKey, PanelSelection, TickerItem } from '../types'
import { DAY_START_MINUTES } from '../data/worldData'

export interface Session {
  userName: string
  mode: 'demo' | 'live'
  email: string | null
}

interface AppState {
  session: Session | null
  nav: NavKey
  selection: PanelSelection
  panelOpen: boolean
  panelWidth: number
  cameraMode: CameraMode
  /** Floor shown in detail: 1 is the detailed ground floor, 2-5 are shells. */
  floor: number
  roofHidden: boolean
  playing: boolean
  speed: 1 | 2 | 4
  followId: string | null
  /** Virtual clock, minutes since midnight. Starts at 07:00. */
  worldMinutes: number
  /** Owner direct-control mode: ground clicks move Abi. */
  ownerMoveMode: boolean
  ticker: TickerItem[]
  tickerSeq: number
  setSession: (s: Session | null) => void
  setNav: (nav: NavKey) => void
  select: (sel: PanelSelection) => void
  closePanel: () => void
  setPanelWidth: (w: number) => void
  setCameraMode: (m: CameraMode) => void
  setFloor: (f: number) => void
  toggleRoof: () => void
  togglePlaying: () => void
  setSpeed: (s: 1 | 2 | 4) => void
  setFollowId: (id: string | null) => void
  setWorldMinutes: (m: number) => void
  setOwnerMoveMode: (on: boolean) => void
  pushTicker: (text: string, kind: TickerItem['kind']) => void
}

export const useAppStore = create<AppState>((set) => ({
  session: null,
  nav: 'world',
  selection: null,
  panelOpen: false,
  panelWidth: 360,
  cameraMode: 'orbit',
  floor: 1,
  roofHidden: false,
  playing: true,
  speed: 1,
  followId: null,
  worldMinutes: DAY_START_MINUTES,
  ownerMoveMode: false,
  ticker: [],
  tickerSeq: 0,
  setSession: (session) => set({ session }),
  setNav: (nav) => set({ nav }),
  select: (selection) => set({ selection, panelOpen: selection !== null }),
  closePanel: () => set({ selection: null, panelOpen: false }),
  setPanelWidth: (panelWidth) => set({ panelWidth: Math.min(480, Math.max(300, panelWidth)) }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setFloor: (floor) => set({ floor }),
  toggleRoof: () => set((s) => ({ roofHidden: !s.roofHidden })),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  setSpeed: (speed) => set({ speed }),
  setFollowId: (followId) =>
    set({ followId, cameraMode: followId ? 'follow' : 'orbit' }),
  setWorldMinutes: (worldMinutes) => set({ worldMinutes }),
  setOwnerMoveMode: (ownerMoveMode) => set({ ownerMoveMode }),
  pushTicker: (text, kind) =>
    set((s) => {
      const item: TickerItem = {
        id: s.tickerSeq + 1,
        text,
        kind,
        atMinutes: s.worldMinutes,
      }
      return { ticker: [item, ...s.ticker].slice(0, 30), tickerSeq: s.tickerSeq + 1 }
    }),
}))

export function formatWorldClock(minutes: number): string {
  const total = ((Math.floor(minutes) % 1440) + 1440) % 1440
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`
}

export function dayPhase(minutes: number): 'morning' | 'midday' | 'afternoon' | 'evening' {
  const total = ((Math.floor(minutes) % 1440) + 1440) % 1440
  if (total < 11 * 60) return 'morning'
  if (total < 14 * 60) return 'midday'
  if (total < 17 * 60) return 'afternoon'
  return 'evening'
}
