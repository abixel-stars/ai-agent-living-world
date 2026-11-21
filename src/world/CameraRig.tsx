import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../state/useAppStore'
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

/** Free orbit limits. The polar range runs from directly overhead down to
 *  just past horizontal, so low angles are possible; the per-frame ground
 *  clamp below keeps the camera from sinking under the site instead of a
 *  polar cap trapping the view. The target clamp keeps panning from
 *  losing the site. */
const MIN_POLAR_ANGLE = 0
const MAX_POLAR_ANGLE = 1.64
const MIN_CAMERA_Y = 0.7
const TARGET_BOUNDS = { minX: -40, maxX: 40, minY: 0, maxY: 20, minZ: -30, maxZ: 30 }

export function CameraRig(): React.ReactElement {
  const cameraMode = useAppStore((s) => s.cameraMode)
  const followId = useAppStore((s) => s.followId)
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

  const snapshots = useSimSnapshot()
  const followed = followId ? snapshots.find((s) => s.id === followId) : undefined
  followTargetRef.current = followed
    ? [followed.position[0], followed.position[1] + 1.2, followed.position[2]]
    : null

  useEffect(() => {
    if (cameraMode === 'follow') {
      animRef.current.active = false
      return
    }
    // Staying in orbit while the floor changes needs no reframe: the user
    // keeps their own angle, and single floors are grounded at y = 0, so
    // the orbit framing fits every floor view as-is. Floor changes that
    // need a reframe switch mode (orbit to focus and back) in the panels.
    if (cameraMode === 'orbit') return
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
    }
    anim.active = true
  }, [cameraMode, floor])

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return
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
      }
      // Damping only settles when update() runs every frame; skipping it
      // here is what made free orbit feel stiff.
      controls.update()
      return
    }
    smoothFollowRef.current = null
    const anim = animRef.current
    if (anim.active) {
      const step = 1 - Math.exp(-delta * 3.2)
      camera.position.lerp(anim.position, step)
      controls.target.lerp(anim.target, step)
      if (
        camera.position.distanceTo(anim.position) < 0.08 &&
        controls.target.distanceTo(anim.target) < 0.08
      ) {
        anim.active = false
      }
    }
    controls.update()
    // Sane bounds only: keep the camera above the ground and the pan
    // target on the site, without capping the orbit angle itself.
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, TARGET_BOUNDS.minX, TARGET_BOUNDS.maxX)
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, TARGET_BOUNDS.minY, TARGET_BOUNDS.maxY)
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, TARGET_BOUNDS.minZ, TARGET_BOUNDS.maxZ)
    if (camera.position.y < MIN_CAMERA_Y) camera.position.y = MIN_CAMERA_Y
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      enableRotate
      enablePan
      enableZoom
      rotateSpeed={0.9}
      panSpeed={0.9}
      zoomSpeed={0.9}
      screenSpacePanning={false}
      minDistance={8}
      maxDistance={75}
      minPolarAngle={MIN_POLAR_ANGLE}
      maxPolarAngle={MAX_POLAR_ANGLE}
      onStart={() => {
        // The user's own drag wins over a mode-transition glide: no fight,
        // no snap back once they take over.
        animRef.current.active = false
      }}
    />
  )
}
