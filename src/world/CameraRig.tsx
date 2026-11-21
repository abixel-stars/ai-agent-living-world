import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../state/useAppStore'
import { FLOOR_BASE_Y } from '../world/layout'
import { useSimSnapshot } from '../simulation/engine'
import type { Vec3Tuple } from '../types'

type ControlsRef = React.ElementRef<typeof OrbitControls>

interface AnimState {
  active: boolean
  position: THREE.Vector3
  target: THREE.Vector3
}

const DEFAULT_POSITION = new THREE.Vector3(33, 28, -39)
const DEFAULT_TARGET = new THREE.Vector3(0, 1, -7)
const TOP_POSITION = new THREE.Vector3(0, 55, -6)
const TOP_TARGET = new THREE.Vector3(0, 0, -6)
const FOCUS_POSITION = new THREE.Vector3(0, 14, -32)
const FOCUS_TARGET = new THREE.Vector3(0, 6, 0)

export function CameraRig(): React.ReactElement {
  const cameraMode = useAppStore((s) => s.cameraMode)
  const followId = useAppStore((s) => s.followId)
  const selection = useAppStore((s) => s.selection)
  const floor = useAppStore((s) => s.floor)
  const camera = useThree((s) => s.camera)
  const controlsRef = useRef<ControlsRef>(null)
  const animRef = useRef<AnimState>({
    active: false,
    position: DEFAULT_POSITION.clone(),
    target: DEFAULT_TARGET.clone(),
  })
  const followTargetRef = useRef<Vec3Tuple | null>(null)
  const smoothFollowRef = useRef<THREE.Vector3 | null>(null)
  const prevSmoothRef = useRef(new THREE.Vector3())
  const tmpRef = useRef(new THREE.Vector3())
  const prevFloorRef = useRef(floor)

  const snapshots = useSimSnapshot()
  const followed = followId ? snapshots.find((s) => s.id === followId) : undefined
  followTargetRef.current = followed
    ? [followed.position[0], followed.position[1] + 1.2, followed.position[2]]
    : null

  useEffect(() => {
    const floorChanged = prevFloorRef.current !== floor
    prevFloorRef.current = floor
    if (cameraMode === 'follow') {
      animRef.current.active = false
      return
    }
    if (cameraMode === 'orbit' && !floorChanged) return
    const anim = animRef.current
    if (cameraMode === 'top') {
      anim.position.copy(TOP_POSITION)
      anim.target.copy(TOP_TARGET)
    } else if (cameraMode === 'focus') {
      anim.position.copy(FOCUS_POSITION)
      anim.target.copy(FOCUS_TARGET)
    } else {
      anim.position.copy(DEFAULT_POSITION)
      anim.target.copy(DEFAULT_TARGET)
      if (floor > 1) {
        const baseY = FLOOR_BASE_Y[floor] ?? 0
        anim.position.y += baseY
        anim.target.y = baseY + 1
      }
    }
    anim.active = true
  }, [cameraMode, floor, selection])

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return
    const step = 1 - Math.exp(-delta * 3.5)
    if (cameraMode === 'follow') {
      const target = followTargetRef.current
      if (target) {
        // Smooth-follow: translate the camera by the same smoothed delta the
        // target moves, so the followed character stays framed while walking
        // and the user's orbit offset is preserved.
        if (!smoothFollowRef.current) {
          smoothFollowRef.current = new THREE.Vector3(target[0], target[1], target[2])
          prevSmoothRef.current.copy(smoothFollowRef.current)
        }
        tmpRef.current.set(target[0], target[1], target[2])
        smoothFollowRef.current.lerp(tmpRef.current, 1 - Math.exp(-delta * 4))
        camera.position.x += smoothFollowRef.current.x - prevSmoothRef.current.x
        camera.position.y += smoothFollowRef.current.y - prevSmoothRef.current.y
        camera.position.z += smoothFollowRef.current.z - prevSmoothRef.current.z
        prevSmoothRef.current.copy(smoothFollowRef.current)
        controls.target.copy(smoothFollowRef.current)
        controls.update()
      }
      return
    }
    smoothFollowRef.current = null
    const anim = animRef.current
    if (!anim.active) return
    camera.position.lerp(anim.position, step)
    controls.target.lerp(anim.target, step)
    controls.update()
    if (
      camera.position.distanceTo(anim.position) < 0.08 &&
      controls.target.distanceTo(anim.target) < 0.08
    ) {
      anim.active = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={8}
      maxDistance={75}
      maxPolarAngle={1.45}
    />
  )
}
