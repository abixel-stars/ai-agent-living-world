import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import { simEngine, useSimSnapshot } from '../simulation/engine'
import { useAppStore } from '../state/useAppStore'
import { OWNER } from '../data/worldData'
import type { AgentDef, OwnerDef } from '../types'
import { AvatarModel, type AvatarParts } from './AvatarModel'

export interface AgentAvatarProps {
  def: AgentDef | OwnerDef
  isOwner: boolean
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: '#FFFDF8',
  borderRadius: 999,
  padding: '3px 8px',
  boxShadow: '0 4px 14px rgba(46, 42, 37, 0.15)',
  fontSize: 11,
  fontWeight: 600,
  color: '#2E2A25',
  whiteSpace: 'nowrap',
  fontFamily: '"Plus Jakarta Sans", ui-sans-system, system-ui, sans-serif',
}

const LIFT_STYLE: React.CSSProperties = {
  background: '#2E2A25',
  color: '#FFFDF8',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 10,
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans", ui-sans-system, system-ui, sans-serif',
}

const BADGE_STYLE: React.CSSProperties = {
  background: '#C99A2E',
  color: '#FFFDF8',
  fontSize: 9,
  fontWeight: 700,
  padding: '1px 5px',
  borderRadius: 999,
  letterSpacing: '0.04em',
}

/** One character in the world: position and pose driven per frame from the
 *  simulation engine, with a clickable name label. */
export function AgentAvatar({ def, isOwner }: AgentAvatarProps) {
  const groupRef = useRef<Group>(null)
  const rootRef = useRef<Group>(null)
  const torsoRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)
  const leftLegRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)
  const smoothRef = useRef({
    rootY: 0,
    lean: 0,
    legL: 0,
    legR: 0,
    armL: 0,
    armR: 0,
    headX: 0,
    headY: 0,
    headZ: 0,
  })

  const parts: AvatarParts = {
    root: rootRef,
    torso: torsoRef,
    head: headRef,
    leftArm: leftArmRef,
    rightArm: rightArmRef,
    leftLeg: leftLegRef,
    rightLeg: rightLegRef,
  }

  // Label activity (the Lift indicator) refreshes from the 200ms snapshot;
  // pose animation below reads the live runtime every frame instead.
  const snapshots = useSimSnapshot()
  const snapshot = snapshots.find((s) => s.id === def.id)
  const inLift = snapshot?.activity === 'inLift'

  const displayName = isOwner ? OWNER.displayName : def.name

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const rt = simEngine.getRuntime(def.id)
    if (!rt) return
    group.position.set(rt.pos[0], rt.pos[1], rt.pos[2])
    group.rotation.y = rt.heading

    const root = rootRef.current
    if (!root) return
    // During lift transit the body is hidden; the name label stays visible.
    root.visible = !rt.hidden
    if (rt.hidden) return

    const t = state.clock.elapsedTime
    const d = Math.min(delta, 0.05)
    const arrived = rt.pathIdx >= rt.path.length && rt.customTarget === null
    const walking = rt.activity === 'walking' && !arrived
    const seated = arrived && rt.pose !== 'stand'
    const lounging = arrived && rt.pose === 'lounge'
    const s = smoothRef.current

    // Root height: seated drop, walking bob, standing rest.
    const targetY = seated ? -0.42 : walking ? Math.abs(Math.sin(t * 8)) * 0.035 : 0
    s.rootY = MathUtils.damp(s.rootY, targetY, 10, d)
    root.position.y = s.rootY
    // Lean back only while lounging.
    s.lean = MathUtils.damp(s.lean, lounging ? -0.25 : 0, 8, d)
    root.rotation.x = s.lean
    root.rotation.z = rt.activity === 'thinking' ? Math.sin(t * 0.8) * 0.02 : 0

    // Legs: walk swing, seated forward bend, lounging extension.
    if (walking) {
      const swing = Math.sin(t * 8) * 0.55
      s.legL = swing
      s.legR = -swing
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
    } else {
      const legTarget = seated ? (lounging ? -1.2 : -1.4) : 0
      s.legL = MathUtils.damp(s.legL, legTarget, 10, d)
      s.legR = MathUtils.damp(s.legR, legTarget, 10, d)
      if (leftLegRef.current) leftLegRef.current.rotation.x = s.legL
      if (rightLegRef.current) rightLegRef.current.rotation.x = s.legR
    }

    // Arms and head per activity. Base angles are damped; small sine
    // overlays add the live motion (typing jitter, gestures, nods).
    let armLTarget = -0.05
    let armRTarget = -0.05
    let armLOverlay = 0
    let armROverlay = 0
    let headXTarget = 0
    let headYTarget = 0
    let headZTarget = 0
    let headXOverlay = 0
    let headYOverlay = 0
    switch (rt.activity) {
      case 'walking':
        armLOverlay = Math.sin(t * 8) * 0.45
        armROverlay = -Math.sin(t * 8) * 0.45
        break
      case 'typing':
        armLTarget = -1.1
        armRTarget = -1.1
        armLOverlay = Math.sin(t * 13) * 0.03
        armROverlay = Math.sin(t * 13 + 1) * 0.03
        headXTarget = 0.1
        headXOverlay = Math.sin(t * 1.7) * 0.03
        break
      case 'sitting':
        armLTarget = -0.35
        armRTarget = -0.35
        break
      case 'meeting':
        armLTarget = -0.7
        armRTarget = -0.7
        headYOverlay = Math.sin(t * 0.6) * 0.12
        headXOverlay = Math.sin(t * 0.9) * 0.03
        break
      case 'thinking':
        armLTarget = -0.3
        armRTarget = -2.2
        headZTarget = 0.18
        headXTarget = 0.08
        break
      case 'talking':
        armLTarget = -0.2
        armRTarget = -0.9
        armROverlay = Math.sin(t * 3) * 0.35
        headXOverlay = Math.sin(t * 3) * 0.05
        headYOverlay = Math.sin(t * 1.3) * 0.15
        break
      case 'break':
        headYOverlay = Math.sin(t * 0.5) * 0.2
        break
      case 'lounging':
        armLTarget = -0.2
        armRTarget = -0.2
        headXTarget = -0.15
        break
      default:
        headYOverlay = Math.sin(t * 0.7) * 0.03
        break
    }

    if (walking) {
      if (leftArmRef.current) leftArmRef.current.rotation.x = armLOverlay
      if (rightArmRef.current) rightArmRef.current.rotation.x = armROverlay
      s.armL = armLOverlay
      s.armR = armROverlay
    } else {
      s.armL = MathUtils.damp(s.armL, armLTarget, 10, d)
      s.armR = MathUtils.damp(s.armR, armRTarget, 10, d)
      if (leftArmRef.current) leftArmRef.current.rotation.x = s.armL + armLOverlay
      if (rightArmRef.current) rightArmRef.current.rotation.x = s.armR + armROverlay
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = rt.activity === 'thinking' ? -0.35 : 0
    }

    s.headX = MathUtils.damp(s.headX, headXTarget, 8, d)
    s.headY = MathUtils.damp(s.headY, headYTarget, 8, d)
    s.headZ = MathUtils.damp(s.headZ, headZTarget, 8, d)
    if (headRef.current) {
      headRef.current.rotation.x = s.headX + headXOverlay
      headRef.current.rotation.y = s.headY + headYOverlay
      headRef.current.rotation.z = s.headZ
    }

    // Breathing: gentle torso scale.
    if (torsoRef.current) {
      const breath = 1 + Math.sin(t * 1.8) * 0.015
      torsoRef.current.scale.set(1, breath, 1)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    useAppStore.getState().select(isOwner ? { kind: 'owner' } : { kind: 'agent', id: def.id })
  }

  return (
    <group ref={groupRef}>
      <AvatarModel
        color={def.color}
        outfit={def.outfit}
        hair={def.hair}
        skin={def.skin}
        isOwner={isOwner}
        bodyRef={parts}
      />
      {/* Invisible hitbox: transparent material keeps raycasting reliable. */}
      <mesh
        position={[0, 0.9, 0]}
        onClick={handleClick}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <cylinderGeometry args={[0.45, 0.45, 1.8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html
        position={[0, 1.95, 0]}
        center
        distanceFactor={16}
        zIndexRange={[10, 0]}
        wrapperClass="pointer-events-none"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              ...LABEL_STYLE,
              border: isOwner ? '1px solid #C99A2E' : '1px solid #E7DFD2',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: def.color,
                flexShrink: 0,
              }}
            />
            <span>{displayName}</span>
            {isOwner && <span style={BADGE_STYLE}>OWNER</span>}
          </div>
          {inLift && <div style={LIFT_STYLE}>Lift</div>}
        </div>
      </Html>
    </group>
  )
}

export default AgentAvatar
