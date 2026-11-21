import * as THREE from 'three'

/** Palette taken from tailwind.config.js. Keep 3D colors in sync with it. */
export const PALETTE = {
  ground: '#FAF7F1',
  cream: '#F3ECDF',
  ink: '#2E2A25',
  wood: '#A97C50',
  wooddeep: '#7C5732',
  leaf: '#4E7A51',
  leafsoft: '#8FB996',
  skysoft: '#8FB4D4',
  skydeep: '#4E7FA6',
  tang: '#E8823F',
  tangdeep: '#C96A2E',
  line: '#E7DFD2',
  stone: '#D8D0C2',
  asphalt: '#6F675E',
  grass: '#7FA86B',
  soil: '#6B4F35',
  white: '#FFFDF8',
} as const

export type MaterialName =
  | 'wood'
  | 'wooddeep'
  | 'creamWall'
  | 'glass'
  | 'glassExterior'
  | 'grass'
  | 'stone'
  | 'asphalt'
  | 'trunk'
  | 'leaf'
  | 'leafsoft'
  | 'white'
  | 'darkMetal'
  | 'emissiveScreen'
  | 'waterMat'
  | 'soil'
  | 'tang'

const materialCache = new Map<string, THREE.MeshStandardMaterial>()

function buildMaterial(name: MaterialName): THREE.MeshStandardMaterial {
  switch (name) {
    case 'wood':
      return new THREE.MeshStandardMaterial({ color: PALETTE.wood, roughness: 0.8, metalness: 0 })
    case 'wooddeep':
      return new THREE.MeshStandardMaterial({ color: PALETTE.wooddeep, roughness: 0.85, metalness: 0 })
    case 'creamWall':
      return new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.95, metalness: 0 })
    case 'glass':
      return new THREE.MeshStandardMaterial({
        color: PALETTE.skysoft,
        roughness: 0.12,
        metalness: 0.1,
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
      })
    case 'glassExterior':
      // Building shell glazing: kept much clearer than interior partitions
      // so furnished interiors read from a normal exterior orbit distance.
      return new THREE.MeshStandardMaterial({
        color: PALETTE.skysoft,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      })
    case 'grass':
      return new THREE.MeshStandardMaterial({ color: PALETTE.grass, roughness: 1, metalness: 0 })
    case 'stone':
      return new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 0.95, metalness: 0 })
    case 'asphalt':
      return new THREE.MeshStandardMaterial({ color: PALETTE.asphalt, roughness: 1, metalness: 0 })
    case 'trunk':
      return new THREE.MeshStandardMaterial({ color: PALETTE.wooddeep, roughness: 1, metalness: 0 })
    case 'leaf':
      return new THREE.MeshStandardMaterial({ color: PALETTE.leaf, roughness: 0.9, metalness: 0 })
    case 'leafsoft':
      return new THREE.MeshStandardMaterial({ color: PALETTE.leafsoft, roughness: 0.9, metalness: 0 })
    case 'white':
      return new THREE.MeshStandardMaterial({ color: PALETTE.white, roughness: 0.85, metalness: 0 })
    case 'darkMetal':
      return new THREE.MeshStandardMaterial({ color: PALETTE.ink, roughness: 0.45, metalness: 0.6 })
    case 'emissiveScreen':
      return new THREE.MeshStandardMaterial({
        color: PALETTE.skydeep,
        emissive: PALETTE.skydeep,
        emissiveIntensity: 0.9,
        roughness: 0.4,
        metalness: 0,
      })
    case 'waterMat':
      return new THREE.MeshStandardMaterial({
        color: PALETTE.skysoft,
        roughness: 0.15,
        metalness: 0,
        transparent: true,
        opacity: 0.8,
      })
    case 'soil':
      return new THREE.MeshStandardMaterial({ color: PALETTE.soil, roughness: 1, metalness: 0 })
    case 'tang':
      return new THREE.MeshStandardMaterial({ color: PALETTE.tang, roughness: 0.7, metalness: 0 })
  }
}

/** Cached shared material. The same instance is reused by every mesh that asks for it. */
export function getMaterial(name: MaterialName): THREE.MeshStandardMaterial {
  const cached = materialCache.get(name)
  if (cached) return cached
  const created = buildMaterial(name)
  materialCache.set(name, created)
  return created
}

const colorCache = new Map<string, THREE.MeshStandardMaterial>()

/** Cached flat-color material for one-off pastel colors (cars, books, flowers). */
export function materialFor(color: string): THREE.MeshStandardMaterial {
  const cached = colorCache.get(color)
  if (cached) return cached
  const created = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0 })
  colorCache.set(color, created)
  return created
}

/** Shared unit geometries. Meshes scale these instead of allocating new geometry. */
export const unitBox = new THREE.BoxGeometry(1, 1, 1)
export const unitSphere = new THREE.SphereGeometry(1, 20, 14)
export const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 16)
export const unitCone = new THREE.ConeGeometry(1, 1, 20)
export const unitTorus = new THREE.TorusGeometry(1, 0.12, 10, 32)

export type BoxArgs = [number, number, number]

/** Small helper: a scaled unit box. Keeps mesh declarations short. */
export function boxProps(size: BoxArgs, position: BoxArgs): { args: BoxArgs; position: BoxArgs } {
  return { args: size, position }
}
