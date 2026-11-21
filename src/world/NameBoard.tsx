import { useMemo } from 'react'
import * as THREE from 'three'
import { getMaterial, unitBox } from './materials'
import { WORLD_NAME } from '../data/worldData'

/**
 * Freestanding name board on the plaza, in front of the office entrance.
 *
 * Positioned beside the entrance path (centre -8.4, -18.3), south of the
 * path junction and west of the fountain plaza: clear of the entrance walk
 * segment, the path to the plaza, and the benches, and east of the door so
 * it never covers the entrance itself. The panel top (2.15 m) stays far
 * below the roofline, so the building and entrance stay in view. The board
 * is yawed toward the street side so its face reads from the default
 * camera angle as well as from the approach path. Two posts stand on
 * stone footings planted on the ground; nothing floats.
 * The face is a canvas texture (no network font fetch, no DOM overlay), so
 * the lettering is real 3D surface, occluded like any other geometry, and
 * reads from the default camera angle on the street side. No other text.
 */
const BOARD_X = -8.4
const BOARD_Z = -18.3
const BOARD_ROT_Y = -0.45
const PANEL_WIDTH = 4.6
const PANEL_HEIGHT = 1.3
const PANEL_Y = 1.5
const POST_X_OFFSET = 1.8

function makeFaceTexture(): THREE.CanvasTexture {
  const width = 1415
  const height = 400
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d canvas context unavailable')
  ctx.fillStyle = '#7C5732'
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = '#FAF7F1'
  ctx.lineWidth = 6
  ctx.strokeRect(20, 20, width - 40, height - 40)
  ctx.fillStyle = '#E8823F'
  ctx.fillRect(90, height - 74, width - 180, 8)
  ctx.fillStyle = '#FAF7F1'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let fontSize = 128
  const font = (size: number): string =>
    `700 ${size}px "Plus Jakarta Sans", Arial, sans-serif`
  ctx.font = font(fontSize)
  while (ctx.measureText(WORLD_NAME).width > width - 120 && fontSize > 40) {
    fontSize -= 4
    ctx.font = font(fontSize)
  }
  ctx.fillText(WORLD_NAME, width / 2, height / 2 - 14)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function NameBoard(): React.ReactElement {
  const panelMaterials = useMemo(() => {
    const face = new THREE.MeshStandardMaterial({
      map: makeFaceTexture(),
      roughness: 0.85,
      metalness: 0,
    })
    const wooddeep = getMaterial('wooddeep')
    // BoxGeometry material order: +x, -x, +y, -y, +z, -z. The face that
    // looks toward the street and the default camera is -z (index 5).
    return [wooddeep, wooddeep, wooddeep, wooddeep, wooddeep, face]
  }, [])

  return (
    <group position={[BOARD_X, 0, BOARD_Z]} rotation={[0, BOARD_ROT_Y, 0]}>
      {[-POST_X_OFFSET, POST_X_OFFSET].map((offsetX) => (
        <group key={offsetX} position={[offsetX, 0, 0]}>
          <mesh
            geometry={unitBox}
            material={getMaterial('stone')}
            position={[0, 0.09, 0]}
            scale={[0.5, 0.18, 0.5]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={unitBox}
            material={getMaterial('wooddeep')}
            position={[0, 1.165, 0.06]}
            scale={[0.14, 1.97, 0.14]}
            castShadow
          />
        </group>
      ))}
      <mesh
        geometry={unitBox}
        material={panelMaterials}
        position={[0, PANEL_Y, -0.06]}
        scale={[PANEL_WIDTH, PANEL_HEIGHT, 0.12]}
        castShadow
      />
    </group>
  )
}
