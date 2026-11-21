import type { RefObject } from 'react'
import type { Group } from 'three'
import { BoxGeometry, CapsuleGeometry, MeshStandardMaterial, SphereGeometry } from 'three'
import type { AgentDef } from '../types'

/** Refs to the animated parts. AgentAvatar drives these per frame. */
export interface AvatarParts {
  root: RefObject<Group>
  torso: RefObject<Group>
  head: RefObject<Group>
  leftArm: RefObject<Group>
  rightArm: RefObject<Group>
  leftLeg: RefObject<Group>
  rightLeg: RefObject<Group>
}

export interface AvatarModelProps {
  color: string
  outfit: AgentDef['outfit']
  hair: AgentDef['hair']
  skin: string
  isOwner: boolean
  dimmed?: boolean
  bodyRef: AvatarParts
}

// Shared geometries: built once at module scope, reused by every character.
const legGeometry = new CapsuleGeometry(0.09, 0.5, 4, 12)
const armGeometry = new CapsuleGeometry(0.07, 0.38, 4, 10)
const torsoGeometry = new BoxGeometry(0.44, 0.58, 0.26)
const headGeometry = new SphereGeometry(0.21, 24, 18)
const shoeGeometry = new BoxGeometry(0.16, 0.08, 0.28)
const handGeometry = new SphereGeometry(0.07, 12, 10)
const eyeGeometry = new SphereGeometry(0.028, 10, 8)
const hairShortGeometry = new SphereGeometry(0.228, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55)
const hairFadeGeometry = new SphereGeometry(0.218, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.38)
const hairBackGeometry = new BoxGeometry(0.34, 0.44, 0.1)
const bunGeometry = new SphereGeometry(0.09, 12, 10)
const collarGeometry = new BoxGeometry(0.3, 0.08, 0.28)
const bandGeometry = new BoxGeometry(0.46, 0.08, 0.28)
const zipGeometry = new BoxGeometry(0.035, 0.5, 0.02)
const stripeGeometry = new BoxGeometry(0.46, 0.07, 0.02)
const pinGeometry = new SphereGeometry(0.032, 10, 8)
const sleeveGeometry = new BoxGeometry(0.18, 0.12, 0.18)

// Materials cached per color so 14 characters share a small set.
const materialCache = new Map<string, MeshStandardMaterial>()
const dimMaterialCache = new Map<string, MeshStandardMaterial>()

function getMaterial(color: string, dimmed: boolean): MeshStandardMaterial {
  const cache = dimmed ? dimMaterialCache : materialCache
  let mat = cache.get(color)
  if (!mat) {
    mat = new MeshStandardMaterial({ color, roughness: 0.75, metalness: 0 })
    if (dimmed) {
      mat.transparent = true
      mat.opacity = 0.45
    }
    cache.set(color, mat)
  }
  return mat
}

const goldMaterial = new MeshStandardMaterial({ color: '#C99A2E', roughness: 0.35, metalness: 0.7 })

/** Procedural stylized character built from code. No images, no GLB files.
 *  Faces +z when heading is 0, so heading = atan2(dx, dz) faces travel. */
export function AvatarModel({
  color,
  outfit,
  hair,
  skin,
  isOwner,
  dimmed = false,
  bodyRef,
}: AvatarModelProps) {
  const torsoColor = isOwner ? '#F7F1E6' : color
  const torsoMat = getMaterial(torsoColor, dimmed)
  const accentMat = getMaterial(color, dimmed)
  const skinMat = getMaterial(skin, dimmed)
  const inkMat = getMaterial('#2E2A25', dimmed)
  const shoeMat = getMaterial('#241F1A', dimmed)
  const hairMat = getMaterial('#2B211B', dimmed)
  const whiteMat = getMaterial('#FFFDF8', dimmed)
  const armMat = outfit === 'shirt' ? skinMat : torsoMat
  const collarMat = outfit === 'jacket' ? inkMat : outfit === 'shirt' ? whiteMat : accentMat

  return (
    <group ref={bodyRef.root}>
      {/* Legs, pivoted at the hips. Trousers in the ink tone. */}
      <group ref={bodyRef.leftLeg} position={[-0.11, 0.78, 0]}>
        <mesh geometry={legGeometry} material={inkMat} position={[0, -0.32, 0]} castShadow />
        <mesh geometry={shoeGeometry} material={shoeMat} position={[0, -0.68, 0.04]} />
      </group>
      <group ref={bodyRef.rightLeg} position={[0.11, 0.78, 0]}>
        <mesh geometry={legGeometry} material={inkMat} position={[0, -0.32, 0]} castShadow />
        <mesh geometry={shoeGeometry} material={shoeMat} position={[0, -0.68, 0.04]} />
      </group>

      {/* Torso, pivoted at the hips for the breathing scale. */}
      <group ref={bodyRef.torso} position={[0, 0.78, 0]}>
        <mesh geometry={torsoGeometry} material={torsoMat} position={[0, 0.32, 0]} castShadow />
        <mesh geometry={collarGeometry} material={collarMat} position={[0, 0.58, 0.01]} />
        {outfit === 'jacket' && !isOwner && (
          <mesh geometry={zipGeometry} material={inkMat} position={[0, 0.32, 0.14]} />
        )}
        {outfit === 'sweater' && (
          <mesh geometry={bandGeometry} material={accentMat} position={[0, 0.06, 0]} />
        )}
        {isOwner && (
          <>
            <mesh geometry={stripeGeometry} material={accentMat} position={[0, 0.34, 0.14]} />
            <mesh geometry={pinGeometry} material={goldMaterial} position={[0.12, 0.52, 0.14]} />
          </>
        )}
      </group>

      {/* Arms, pivoted at the shoulders. */}
      <group ref={bodyRef.leftArm} position={[-0.29, 1.28, 0]}>
        <mesh geometry={armGeometry} material={armMat} position={[0, -0.26, 0]} castShadow />
        <mesh geometry={handGeometry} material={skinMat} position={[0, -0.52, 0]} />
        {outfit === 'shirt' && (
          <mesh geometry={sleeveGeometry} material={torsoMat} position={[0, -0.08, 0]} />
        )}
      </group>
      <group ref={bodyRef.rightArm} position={[0.29, 1.28, 0]}>
        <mesh geometry={armGeometry} material={armMat} position={[0, -0.26, 0]} castShadow />
        <mesh geometry={handGeometry} material={skinMat} position={[0, -0.52, 0]} />
        {outfit === 'shirt' && (
          <mesh geometry={sleeveGeometry} material={torsoMat} position={[0, -0.08, 0]} />
        )}
      </group>

      {/* Head with eyes and the hair variant. */}
      <group ref={bodyRef.head} position={[0, 1.52, 0]}>
        <mesh geometry={headGeometry} material={skinMat} castShadow />
        <mesh geometry={eyeGeometry} material={inkMat} position={[-0.075, 0.01, 0.185]} />
        <mesh geometry={eyeGeometry} material={inkMat} position={[0.075, 0.01, 0.185]} />
        {hair === 'short' && (
          <mesh geometry={hairShortGeometry} material={hairMat} position={[0, 0.02, -0.01]} />
        )}
        {hair === 'fade' && (
          <mesh geometry={hairFadeGeometry} material={hairMat} position={[0, 0.03, 0]} />
        )}
        {hair === 'bun' && (
          <>
            <mesh geometry={hairShortGeometry} material={hairMat} position={[0, 0.02, -0.01]} />
            <mesh geometry={bunGeometry} material={hairMat} position={[0, 0.19, -0.15]} />
          </>
        )}
        {hair === 'long' && (
          <>
            <mesh geometry={hairShortGeometry} material={hairMat} position={[0, 0.02, -0.01]} />
            <mesh geometry={hairBackGeometry} material={hairMat} position={[0, -0.14, -0.17]} />
          </>
        )}
      </group>
    </group>
  )
}

export default AvatarModel
