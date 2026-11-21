import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { simEngine } from './engine'
import { useAppStore } from '../state/useAppStore'
import { AGENTS, OWNER } from '../data/worldData'
import type { ActivityKind, TickerItem } from '../types'

function tickerKind(agentId: string, activity: ActivityKind): TickerItem['kind'] {
  if (agentId === 'owner') return 'owner'
  if (activity === 'typing' || activity === 'meeting' || activity === 'sitting') return 'work'
  if (activity === 'walking') return 'move'
  return 'info'
}

function displayNameFor(agentId: string): string {
  if (agentId === 'owner') return OWNER.displayName
  return AGENTS.find((def) => def.id === agentId)?.name ?? agentId
}

/** Drives the simulation clock and the engine from inside the Canvas.
 *  Reads store state via getState() on every frame: no subscriptions and
 *  no re-renders. Returns nothing. */
export function SimulationDriver() {
  const pendingMinutesRef = useRef(0)
  const lastWriteRef = useRef(0)
  const lastWallRef = useRef<number | null>(null)

  useEffect(() => {
    simEngine.onEvent = (agentId, label, activity) => {
      useAppStore.getState().pushTicker(
        `${displayNameFor(agentId)} ${label}`,
        tickerKind(agentId, activity),
      )
    }
    return () => {
      simEngine.onEvent = undefined
    }
  }, [])

  useFrame((state) => {
    const store = useAppStore.getState()
    // Wall-clock time, not frame deltas: the clock must advance at the same
    // rate on slow devices and backgrounded tabs. Capped per frame so a
    // long absence does not teleport the whole day at once.
    const now = performance.now()
    const last = lastWallRef.current ?? now
    lastWallRef.current = now
    const wallDt = Math.min(Math.max((now - last) / 1000, 0), 10)
    let worldMinutes = store.worldMinutes
    if (store.playing) {
      // 1 virtual minute per real second at 1x, multiplied by speed.
      pendingMinutesRef.current += wallDt * store.speed
      worldMinutes += pendingMinutesRef.current
      // Throttle store writes to 4 per second.
      if (state.clock.elapsedTime - lastWriteRef.current >= 0.25) {
        store.setWorldMinutes(worldMinutes)
        pendingMinutesRef.current = 0
        lastWriteRef.current = state.clock.elapsedTime
      }
    }
    simEngine.tick(Math.min(wallDt, 0.5), worldMinutes, store.playing, store.speed)
  })

  return null
}

export default SimulationDriver
