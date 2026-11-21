import { Eye, EyeOff } from 'lucide-react'
import { WORLD_NAME } from '../../data/worldData'
import { useAppStore } from '../../state/useAppStore'
import { ROOM_PLANS } from '../../world/layout'

const FLOORS = [1, 2, 3]

const GROUND_ROOMS = [
  { name: 'Lobi', detail: 'Lantai 1' },
  { name: 'Area resepsionis', detail: 'Lantai 1' },
  { name: 'Ruang CEO', detail: 'Lantai 1' },
  { name: 'Workspace terbuka', detail: 'Lantai 1' },
  { name: 'Ruang meeting', detail: 'Lantai 1' },
  { name: 'Rooftop lounge', detail: 'Atap' },
]

const ROOMS = [
  ...GROUND_ROOMS,
  ...[2, 3].flatMap((floor) =>
    ROOM_PLANS[floor].map((room) => ({ name: room.name, detail: `Lantai ${floor}` })),
  ),
]

export default function BuildingPanel() {
  const floor = useAppStore((s) => s.floor)
  const setFloor = useAppStore((s) => s.setFloor)
  const cameraMode = useAppStore((s) => s.cameraMode)
  const setCameraMode = useAppStore((s) => s.setCameraMode)
  const roofHidden = useAppStore((s) => s.roofHidden)
  const toggleRoof = useAppStore((s) => s.toggleRoof)

  function handleFloor(next: number) {
    setFloor(next)
    // Reframe without touching the camera rig: a single floor is shown
    // grounded, so the focus framing (no floor-height offset) keeps it in
    // view; returning to the whole building restores the orbit framing.
    if (next > 1 && cameraMode === 'orbit') setCameraMode('focus')
    if (next === 1 && cameraMode === 'focus') setCameraMode('orbit')
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold leading-tight">Gedung Kantor Pusat</h2>
        <p className="mt-1 text-sm leading-relaxed text-inksoft">
          Gedung utama {WORLD_NAME}, 3 lantai.
        </p>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Pilih lantai
        </h3>
        <div className="mt-2.5 flex gap-2" role="group" aria-label="Pilih lantai">
          {FLOORS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={floor === n}
              onClick={() => handleFloor(n)}
              className={`h-10 w-10 rounded-full text-sm font-semibold tabular-nums ${
                floor === n ? 'bg-ink text-white' : 'border border-line bg-white text-ink'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed">
          {floor === 1
            ? 'Gedung utuh: lobi, ruang CEO, workspace, ruang meeting, dan interior lantai 2 dan 3 terlihat dari luar.'
            : `Lantai ${floor}: ${ROOM_PLANS[floor].map((room) => room.name).join(', ')}. Lantai ditampilkan di permukaan tanah, tanpa atap di atasnya.`}
        </p>
      </section>

      <section>
        <button
          type="button"
          aria-pressed={roofHidden}
          onClick={toggleRoof}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
        >
          {roofHidden ? <Eye size={17} /> : <EyeOff size={17} />}
          {roofHidden ? 'Tampilkan atap' : 'Sembunyikan atap'}
        </button>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Ruangan
        </h3>
        <ul className="mt-2 space-y-1">
          {ROOMS.map((room) => (
            <li
              key={room.name}
              className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2 last:border-b-0"
            >
              <span className="text-sm">{room.name}</span>
              <span className="shrink-0 text-[13px] text-inksoft">{room.detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed text-inksoft">
          Gedung pendukung, area rekreasi, dan apartemen hadir di fase berikutnya.
        </p>
      </section>
    </div>
  )
}
